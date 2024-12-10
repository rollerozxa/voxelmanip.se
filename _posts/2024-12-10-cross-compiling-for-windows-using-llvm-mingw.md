---
title: Cross-compiling for Windows using llvm-mingw
tags: Guide Linux Windows
cover_alt: Screenshot of terminal output from configuring SDL for crosscompiling using llvm-mingw. The LLVM logo and the MinGW-w64 logo is shown to the right.
---

**[llvm-mingw](https://github.com/mstorsjo/llvm-mingw)** is an LLVM-based MinGW-w64 toolchain distribution for compiling C/C++ programs for Windows. Prebuilt toolchains are provided as plain archives both for compiling natively on Windows, or for cross-compiling from Linux and macOS.

Compared to traditional MinGW-w64 based toolchains, it uses the Clang compiler as well as libc++, LLD and other LLVM projects in place of their GNU counterparts. With this it has support for compiling for Windows ARM targets and can target all four modern Windows architectures with one set of toolchain binaries.

<!--more-->

The versatility of the toolchain and the convenience of the distribution has led it to be the preferred toolchain for many open source projects that make Windows builds, and I myself use it often for most of my Windows compilation needs. This blog post goes over how you would get started with using llvm-mingw to cross-compile C and C++ programs for Windows from any Linux distribution you may be on.

## Downloading it
The toolchain is reproducibly built using a bunch of scripts in the repository that are run in Github Actions. Prebuilt toolchains are available on the [GitHub releases page](https://github.com/mstorsjo/llvm-mingw/releases).

The `.zip` artifacts are native toolchains that run on Windows, while the `.tar.xz` artifacts are cross-compilation toolchains that run on Linux (as well as one for macOS). The architecture names refer to the architecture that the toolchain itself can run on, not the builds it can produce - all of the toolchain downloads can compile for all four architectures.

There are also two different variants of downloads, UCRT and MSVCRT, referring to the C runtime that the toolchain is built to run compiled programs against. MSVCRT is a C runtime that has been found in Windows ever since Windows 98. [It is old and crusty](https://www.msys2.org/docs/environments/#msvcrt-vs-ucrt). UCRT is much newer, being introduced with Windows 10 and [has also been made available all the way back to Windows Vista](https://support.microsoft.com/en-us/topic/update-for-universal-c-runtime-in-windows-c0514201-7fe6-95a3-b0a5-287930f3560c) through Windows Update.

Most likely what you would want is the `llvm-mingw-YYYYMMDD-ucrt-ubuntu-20.04-x86_64.tar.xz` download for x86_64 Linux that uses UCRT. It should run on any glibc-based Linux distribution that is newer than Ubuntu 20.04. Extract it somewhere nice, whether it be in your home folder or in the root filesystem (e.g. `/opt/llvm-mingw`). To use all of the binaries in a newly opened terminal, you'd add it to the PATH as such:

```bash
export PATH=/opt/llvm-mingw/bin:$PATH
```

I would not want to permanently add it to the PATH since it may interfere with my system install of Clang in ways that are undesirable, but you can choose what you would want.

## Test run
You could test it out with something boring like your typical C hello world example. But let's make things more interesting and test with Christopher Wellons' [Asteroids clone for Windows](https://github.com/skeeto/asteroids-demo), originally made as a tech demo for [w64devkit](https://github.com/skeeto/w64devkit) but works to compile with llvm-mingw too. It only relies on Windows system libraries such as GDI and can be compiled with the following command:

```bash
x86_64-w64-mingw32-clang asteroids.c -lwinmm -lgdi32 -lopengl32 -ldsound -mwindows -o asteroids
```

While you should *never* test your Windows programs with only Wine and should always have an actual Windows machine at hand for testing, it is still useful for smoke testing when Wine supports your program.

{% include image.html
	name="asteroids.webp"
	alt="Screenshot of the directory tree of QDirStat showing some of the largest folders in the root of a server." %}

The above command compiles for 64-bit x86 which is likely what you are on right now, but to compile for another architecture you would want to switch out the `x86_64` in the beginning of the executable name. llvm-mingw supports all four relatively recent processor architectures that Windows support, which are the following:

- `x86_64`: 64-bit x86 - The vast majority of the Windows userbase.
- `i686`: 32-bit x86 - Starting to fade out of relevance at least for Windows, but some users are still stuck on old hardware.
- `aarch64`: 64-bit ARM, "Windows on Arm" - Starting to become used more often, and will only become more popular with time.
- `armv7`: 32-bit ARM, "Windows RT" - Doesn't see a lot of use nowadays but there are some enthusiasts who are still holding onto these devices.

If you peek inside of the bin directory you may see that all of these symlink to the same Clang binaries, they simply just change target based on what name they are being called from.

At this point you should be good to go using the toolchain, but if you have some larger project you probably aren't calling the compiler directly but using some other build system. You may also want libraries other than the Win32 API that you'll have to compile and keep the binaries of for linking against your program, as the libraries you already have installed through your Linux package manager are built for Linux.

Below are some quick instructions for how to cross-compile using llvm-mingw for common build systems you may be using or will run into when compiling other software.

## Building using CMake
CMake has the concept of toolchain files which allows you to define a custom non-native toolchain to simplify configuring the build system for cross-compiling. An example toolchain for building a CMake project with llvm-mingw would be:

```cmake
set(CMAKE_SYSTEM_NAME Windows)
set(CMAKE_SYSTEM_PROCESSOR x86_64)

set(CMAKE_C_COMPILER x86_64-w64-mingw32-clang)
set(CMAKE_CXX_COMPILER x86_64-w64-mingw32-clang++)
set(CMAKE_RC_COMPILER x86_64-w64-mingw32-windres)

set(CMAKE_FIND_ROOT_PATH /usr/x86_64-w64-mingw32)

set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
```

To make a corresponding toolchain file for other architectures, you would replace occurrences of `x86_64` with the other architecture name.

To provide the toolchain file to CMake, you will need to pass `-DCMAKE_TOOLCHAIN_FILE="toolchain-x86_64-w64-mingw32.cmake"` during the first time you generate the build files. It will check relative from the build folder you're in, so if you build anywhere other than in the root of the source tree you would probably want to put it somewhere else and reference it from there. After the first generation of the build scripts, it will remember it even when reconfiguring the build options.

## Building using Autotools
To be able to cross-compile a project that uses Autotools for its build system, pass `--host=x86_64-w64-mingw32` (or the architecture you want to build for) when running `./configure`. It should be able to find things automatically from that point on.
