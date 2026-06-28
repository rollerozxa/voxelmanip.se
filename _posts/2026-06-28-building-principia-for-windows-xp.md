---
title: Building Principia for Windows XP
tags: Projects
cover_alt: The Windows XP logo from the boot splash is blended into a screenshot of a Principia adventure level. The Windows XP Luna taskbar is visible at the bottom showing Principia running.
---

Back in the day when Principia originally released for Windows in 2014, the game would run on versions as far back as Windows XP. Given that Principia 1.4 was released while Windows XP still had mainstream support, this of course made sense at the time, and there was no real reason _not_ to support it given that the tooling and dependencies at the time were still compatible with it.

Fast forward to today with Principia as an open source project. While the Windows version _should_ still run as far back as Windows 7, our usage of modern toolchains, dependencies and system libraries such as UCRT means that hard to truly guarantee far into the future as the ecosystem moves forward. However, this has always been something I wanted to change one day, bringing Principia back onto Windows XP and producing a fully open source build of the game that can run on it.

<!--more-->

## The technical details of Principia
I suppose it would be useful to first describe the technical details of Principia that are relevant to this endeavour. Principia is a game that was originally designed to run on phones from around 2012, so it should have no problem running on very old hardware as long as it supports at least OpenGL 2.0. Principia has very few dependencies, and makes use of SDL for cross-platform support. SDL (both SDL2 and the newer SDL3) still supports Windows XP, and as previously mentioned Principia also used to run on Windows XP. So unless there have been changes I have made during my work on the open source version that broke XP compatibility, it should be possible to get it running again on XP without too many code changes.

The main issue is just the toolchain and some other dependencies which have moved on to newer Windows versions.

The Windows version of Principia only officially supports being compiled with a mingw-w64 Windows toolchain. While historically this was due to MSVC lacking support for C99 features used in Principia's backing engine TMS, I'm not sure how the situation for this is like nowadays. However mingw-w64 also contains various polyfills for simple C functions that do not actually exist natively on Windows, and unless someone shows up with a burning interest to build Principia with MSVC this is likely not going to change anytime soon.

Regardless, FOSS toolchains tend to be the easiest to get a modern version up that can target older versions of Windows. However, the current LLVM-based mingw-w64 toolchain from MSYS2 we use for official Windows builds are unsuitable for targeting Windows XP, both due to linking against the UCRT, LLVM's libc++ is 7+, and any other support libraries are built expecting symbols in e.g. Vista to always exist. So we will need to step out of this and find something else... Or build something from source.

## Let's build our own toolchain!
When going further back than around Vista/7, the compatibility for existing mingw-w64 toolchains you can find start to drop. Any LLVM-based toolchain has a minimum of around Windows 7 for C++ projects due to libc++ not supporting anything older, while other GCC-based toolchains are built expecting Vista+ APIs to always exist in their pre-built support libraries. While there are toolchains whose primary purpose is to target versions as old as 95, I ended up just rolling with my own. This was likely going to be the simplest, as I specifically also wanted a cross-compiling toolchain I can run on a Linux host while targeting Windows.

Okay, so we will be compiling GCC, binutils, mingw-w64... What else? Oh jeez...

Thankfully I had a bit of an ace up my sleeve in the form of [a Dockerfile written by Martin Storsjö](/media/building-principia-for-windows-xp/gcc-mingw.docker.txt) (which you may know as the [llvm-mingw](https://voxelmanip.se/2024/12/10/cross-compiling-for-windows-using-llvm-mingw/) guy) that he linked sometime in the #mingw-w64 IRC channel. Being eager and curious, I had already taken this Dockerfile, rewrote it into a simple shell script and split it up into distinct steps for each component.

I did some adjustments to the version I had lying around, changing the triplet to `i686-w64-mingw32` for 32-bit Windows, switching to MSVCRT as the system runtime it will target, and also set the default `WIN32_WINNT` to 0x0501 (Windows NT 5.1, corresponding to Windows XP). Then ran it to see if it would still build...

It already failed at the first step of building `libgmp` (the GNU MP Bignum library) with a weird error about not having a functioning compiler. Perplexed, I went into the `config.log` that autotools had generated and saw that it gave an error about trying to compile some real funky code:

```c
for(i=0;i<1;i++){if(e(got,got,9,d[i].n)==0)h();g(i,d[i].src,d[i].n,got,d[i].want,9);if(d[i].n)h();}
```

I was building this with the latest GCC 16, and it appears that the latest stable version of GMP as of writing (6.3.0) does not compile with GCC 15+ on default settings. The build system has a compile-time check that includes code with a function with empty parameters. In older versions of C this meant any number of arguments could be passed (and to prevent this, you would put `foo(void)`), while in C23 this was changed where an empty parameter list means no arguments can be passed. GCC 15 defaults to C23, making it fail to compile this code and the build system then treats it as a broken compiler.

I found a patch for the first issue in Arch's buildscripts for GMP, but in the end I just configured GMP to build with `-std=gnu99` to get it to shut up and move on with the build process, without needing to regenerate the autotools files.

After that, it was mostly smooth sailing! I would build MPFR, then MPC, then binutils, then GCC. Then build mingw-w64's CRT and libraries using the newly built GCC, and build GCC's libraries using the toolchain.

While letting it build, I wanted to check to make sure there hasn't been any recent changes in GCC that would break Windows XP compatibility, specifically in the C++ standard library. That's when I discovered that the libstdc++ that ships with GCC 16 has a newly added hard dependency on a Vista+ Win32 API function. Specifically [`GetDynamicTimeZoneInformation`](https://learn.microsoft.com/en-us/windows/win32/api/timezoneapi/nf-timezoneapi-getdynamictimezoneinformation), used in `std::chrono` for timezone handling.

While I am mostly on my own building my own toolchain like this, I am not beyond borrowing things from other people's toolchains. [w64devkit](https://github.com/skeeto/w64devkit)'s 32-bit version uses GCC 16, still supports Windows XP, and was where I found out about this. They also carry a patch which turns the dependency on the abovementioned API function into a dynamic one, attempting to grab the symbol and falling back to nothing if it does not exist. `std::chrono` is a C++20 feature and Principia barely even makes use of C++11 standards, so just stubbing it out would have worked fine too. But a ready-made clean patch is always best!

With that patch and some time spent compiling GCC, I now had a toolchain I knew almost with certainly could produce binaries that will work on Windows XP. Every part was built with NT 5.1 as the target, and as long as the program does not use newer functions, it should work! Just as a smoke test I compiled and ran a simple hello world program in Wine, and the compiler can in fact create runnable Windows executables.

## Building dependencies
Before we can build Principia, we need to build its dependencies with the newly built toolchain. Principia has the following dependencies that we need to provide externally:

- curl
- Freetype
- libjpeg-turbo
- libpng
- SDL
- zlib

These are some of the most portable and universal software libraries in the world! However, out of these, curl ended up being a bit of a hassle. They very recently dropped support for Windows XP in curl 8.19.0, which is honestly understandable for a networking library, but somehow even curl 8.18.0 did not work as it tries to locate a `freopen_s` function in `msvcrt.dll`, which does not exist in XP. I ended up going with curl 8.17.0, which is still very recent considering where we will be running it on.

Luanti core developer sfan5 has a repository with buildscripts for cross-compiling various common libraries for Windows ([link](https://github.com/sfan5/mingw-pkgs)), which is used for building dependencies needed by Luanti and which I've found to be a useful resource for other things. All the dependencies that Principia needs are covered, and just like that all the dependencies are built!

...There is however a rather big elephant in the room in the form of GTK3, which Principia uses for dialogs on desktops. This is a *huge* dependency with a tree of dependencies that I don't even want to go into. I could resurrect the old GTK2 dialogs from the commit history, or there may be an old version of GTK3 that still supports Windows XP, but I basically did not want to deal with this at least initially. Instead I decided that I will just build the game with the experimental new dialogs that use Dear Imgui instead, which is a much lighter dependency (in addition to being much better suited for our use cases and being integrated into the game window), but a lot of dialogs in the game still remain unimplemented.

Hopefully one day that will improve, but for now that will make these builds a bit limited in terms of usability.

## Building Principia
With all the prerequisites up to this point done, all that was left was to actually build Principia. This would involve a long CMake incantation to point to the cross-compiler toolchain, along with all the dependencies... Some fighting with CMake option names and paths later, and the configuration was successful.

And then build. It almost got to the end and then... compiler error. Something something, incompatible pointer type, in `pipeline.c` in TMS, relating to these typedefs.

```c
typedef void (*TMS_UNIFORM_FN)(GLint, GLsizei, const GLfloat*);
typedef void (*TMS_UNIFORM_MAT_FN)(GLint, GLsizei, GLboolean, const GLfloat*);
```

`pipeline.c` is probably one of the hairiest source files in the codebase. I've improved it over the years but it's still one of the files you'd rather not touch. However turns out the issue was quite simple - you ever heard of `__stdcall`? It defines the calling convention for Win32 API functions... or something along those lines. One definition expected `__stdcall` and another one did not, causing the compiler error.

I'm not sure why this is the case, but I've seen more cases of this across the codebase so I assume it is just a legacy thing from when the game used less complete GL headers. The typedefs are basically duplicates of function prototypes that are already defined in GLAD (minus the calling convention stuff), so we can just replace the longer definitions with just an alias to those:

```c
typedef PFNGLUNIFORM1FVPROC TMS_UNIFORM_FN;
typedef PFNGLUNIFORMMATRIX4FVPROC TMS_UNIFORM_MAT_FN;
```

Why has this never come up before on Windows? Not sure. Anyways it compiles now! Woo.

## Testing the binary
First of all it's good to do a smoke test right away to make sure the binary is even able to run at all, before worrying about whether it runs on XP. All we know was that we could produce a Hello World program with the toolchain. Now we've built a bunch of libraries as well as the entirety of Principia, which is a *slightly* more complex program.

What better way to do that than just... Run it with Wine?

Yeah that works fine. Let's move to my Windows XP virtual machine I just so have handy for times like this.

After dealing with the above mentioned issue about curl 8.18.0 requiring `freopen_s`, I was able to launch the game up until getting the error message that appears when you try to run Principia without functional OpenGL drivers. Which is a good sign as it means none of the binaries (both the Principia EXE and library DLLs) have a hard dependency on functions that do not exist in XP.

{% include image.html
	name="principia_xp_error.webp"
	alt="[Error dialog] Your graphics driver does not support OpenGL >1.1 and as such Principia will not start. Most likely this is because you do not have any graphics drivers installed and are using Windows' software rendering driver. Please install the necessary driver for your graphics card. If you are on a VM for testing purposes, then you can use Mesa's software renderer to [text cut off...]" %}

On newer versions of Windows I use [the Mesa software renderer](https://fdossena.com/?p=mesa/index.frag) to get slow, but functional OpenGL support in a virtual machine for testing things. But I have not been able to find a version that works on XP, so it feels like the best thing to do at this point is... Install Windows XP on real hardware?

## Let's install Windows XP!
This is kinda where things are going off the rails. It was intended for a friend of mine who had installed Windows XP on an old laptop to test the build, but by the time I was done she was already away to install Windows Vista after not getting WiFi drivers to work on XP. So I ended up having to do it myself, but I just so happen to have a machine that would be quite perfect to install XP on.

My previous desktop which I used up until I built my new one in 2022 is old. Very old. It has a non-UEFI motherboard and an AMD Phenom II X4 955 processor. It is well within the year range where Windows XP was supported by manufacturers with drivers so it should be perfect for this. It has been mostly sitting and collecting dust ever since I built my new one, anyway!

Being under the belief that using an original Windows XP ISO to install from an USB and onto a SATA SSD would be complicated, I searched for unofficial ISOs that have additional updates and drivers included in them. However, this didn't give much positive results.

{% include image.html
	name="xp_bsod.webp"
	alt="Windows XP Blue Screen of Death"
	max_width=800 %}

Getting desperate, I was recommended something by my friend that I did not even know was a thing before hearing about it. [The Universal NT Installer](https://github.com/ages2001/Universal-NT-Installer) is a Linux-based ISO that can install every version of Windows NT pre-Vista, either with or without patches. Being based on Linux, booting it from an USB was easy and I could then install a version of Windows XP with support for AHCI and other things already included. Perfect!

{% include image.html
	name="installing_xp.webp"
	alt="OS Edition: Windows XP Professional SP2 x64 (Patched)"
	max_width=640 %}

Seeing the Windows XP splash screen again running on real hardware was quite the experience.

{% include image.html
	name="xp_splash_screen.webp"
	alt="Windows XP splash screen showing 'x64 Edition' below the logo."
	max_width=840 %}

I went through the setup process, entirely with a keyboard as I had not plugged in my mouse yet. Then I was dropped in a low-resolution desktop without Internet connectivity. I had plugged in the Ethernet cable didn't I...?

{% include image.html
	name="ethernet_controller.webp"
	alt="Windows XP driver installation wizard asking whether it should connect to the Internet to search for drivers for the Ethernet Controller."
	max_width=600 %}

Oh, no drivers for the Ethernet Controller... Yes, good luck connecting to the Internet to search for Ethernet drivers, Windows.

The next while was spent finding drivers to put onto an USB thumbdrive and put it into the XP machine. Then switching out the thumbdrive for one where the primary partition could be detected. Then I went online, installed Legacy Update and began installing updates, including more drivers such as a driver for the integrated ATI Radeon HD 3000 graphics. I also wanted to install a newer browser, and remembered my friend had a collection of old software that runs on Windows XP, such as the last version of Firefox for XP.

{% include image.html
	name="polish_firefox.webp"
	alt="Installation wizard of Firefox in Polish." %}

It was in Polish... Well, I also ended up installing a version of Supermium which is a backported modern Chromium fork for XP. But the real thing I want to test is of course Principia. I replugged my HDMI cable into my main desktop and the keyboard, then copied over the build of Principia onto a thumbdrive. Then replugged my HDMI cable back into the XP machine, along with keyboard and thumbdrive.

I copied over Principia to my desktop. Opened the folder, and went to launch principia.exe. It booted, it loaded. And I was staring at the main menu. Success! Everything I had been doing for the past days led up to this very moment.

{% include image.html
	name="principia_xp.webp"
	alt="The Principia main menu, with Windows XP titlebar and the Windows XP winver dialog visible in front of Principia."
	max_width=960 %}

...The fonts are messed up, but I would not be surprised if this is specific to the OpenGL drivers for my integrated ATI graphics. Trying [Tensy](https://tensy.voxelmanip.se) (the 32-bit Windows version runs on XP!) gave me the same result with garbage textures, but _only on OpenGL_. (Use `-d3d` to run Tensy with Direct3D instead if you run into this!)

{% include image.html
	name="tensy_opengl_corruption.webp"
	alt="Main menu of Tensy on XP, showing serious graphical corruption"
	max_width=800 %}

I even tried the old Principia 1.5.1 from 2014, which I know should work on Windows XP, and it has the same font corruption bug. So I am almost certain it is my OpenGL drivers.

Regardless, the goal that was originally set out to do has been accomplished. I have brought Principia back to Windows XP, in its open source form, and I got to play around with Windows XP on real hardware. A great journey overall.

{% include image.html
	name="principia_xp_2.webp"
	alt="Full screenshot of Principia running on Windows XP with the desktop visible, playing the Art Adventure level." %}

## More...
After getting it running on XP, I wanted to try to improve the build. Initially I built libcurl with the Schannel TLS backend, which relies on the TLS stack that exists on Windows. If you're targeting modern or up to date versions of Windows 7+, this works perfectly fine, but XP's TLS stack is ancient and as such the game could not connect to the community site. After thinking way too much about which TLS library to pick, I chose mbedTLS due to being simple to build and the last version that supports XP (3.4.1) is quite recent, and I also bundled an up to date CA store for curl to use.

I also grabbed the NSIS script used for the official builds and made an installer out of the build, in addition to a regular portable archive. This way you can just run the installer which registers the protocol handler for the game, and conveniently play levels from the community site in Supermium.

All the scripts to build the toolchain, dependencies and Principia are all available in [this GitHub repository](https://github.com/rollerozxa/principia-xp). After I did the following I also made a release [2026-06-10-xp](https://github.com/rollerozxa/principia-xp/releases) for people to try out. Though I'm the maintainer of Principia, this is likely not going to be an officially maintained build so to speak, and it will likely not going to follow the same release cadence as the official builds.
