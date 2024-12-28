---
title: My C/C++ setup with Visual Studio Code (Code - OSS)
tags: C/C++ Informational
cover_alt: Screenshot of Code - OSS showing some C code. The Visual Studio Code logo is shown to the right.
---

Visual Studio Code is a code editor that has become quite popular since its introduction in 2016. Out of the box it is not necessarily an IDE, but because of the rich extension ecosystem you can compose together your own powerful IDE for any language you can think of.

This blog post goes over the current setup I have for doing C/C++ development in Visual Studio Code, the extensions and beyond.

<!--more-->

## A quick clarification
In case you don't already know, the [Visual Studio Code](https://code.visualstudio.com/) program as Microsoft distributes it [is proprietary software](https://code.visualstudio.com/License/). However it is built on top of, and largely based on the open source and MIT licensed [Code - OSS](https://github.com/microsoft/vscode) project. And then [VSCodium](https://vscodium.com/) is a separate distribution that offers freely licensed binary builds that are closer to the Code - OSS upstream, as Code - OSS is primarily a source distribution.

I am actually using a build of Code - OSS [as it is being packaged in the Arch Linux repositories](https://gitlab.archlinux.org/archlinux/packaging/packages/code), which is using the [OpenVSX](https://open-vsx.org/) extension marketplace. But all extensions mentioned are also available on the proprietary Visual Studio Code extension marketplace and all of the information in this blog post can be applied identically across all distributions in the Code - OSS family of editors, including the most popular (and with the most brand recognition) Visual Studio Code distribution.

## Setting up a build folder
Basically all the projects I have a hand in use CMake, love it or hate it but I don't necessarily think it's the worst build system out there. Since VSCode doesn't have any built-in language support for `CMakeLists` files, I use the [CMake](https://marketplace.visualstudio.com/items?itemName=twxs.cmake) ([OpenVSX](https://open-vsx.org/extension/twxs/cmake)) extension which both provides syntax highlighting and some basic autocompletion.

To start off let's configure and generate a primary build folder that I'd be using.

- For my compiler I tend to use [Clang](https://clang.llvm.org/) rather than GCC. It's somewhat faster at compiling than GCC and usually throws better warnings and errors when things go wrong, so choosing it as my primary compiler seems obvious.

- For linker I usually use [mold](https://github.com/rui314/mold), which is an executable linker that is extremely fast compared to even the LLVM `lld` linker. Its usefulness depends on the size of the linking program, but when you are doing many incremental builds the snappiness of repeated builds that `mold` creates is very useful.

- Rather than using the standard Makefile generator for CMake I use the Ninja generator. [Ninja](https://ninja-build.org/) is supposed to be slightly faster than plain Make due to having simpler build file syntax, but what I like most about it is that it will automatically compile with a default amount of jobs corresponding to my processor thread count.

Let's combine all of that into a set of commands to configure the primary build folder:

```bash
mkdir build
cd build
cmake .. -DCMAKE_BUILD_TYPE=Debug \
		-DCMAKE_C_COMPILER=/usr/bin/clang -DCMAKE_CXX_COMPILER=/usr/bin/clang++ \
		-DCMAKE_EXE_LINKER_FLAGS="-fuse-ld=mold" -DCMAKE_SHARED_LINKER_FLAGS="-fuse-ld=mold" \
		-G Ninja
```

## Code intellisense with `clangd`
Autocompletion, navigation and refactoring tools is a convenience most would want to have while developing. For providing this functionality for C/C++ in VSCode I use the [clangd](https://marketplace.visualstudio.com/items?itemName=llvm-vs-code-extensions.vscode-clangd) ([OpenVSX](https://open-vsx.org/extension/llvm-vs-code-extensions/vscode-clangd)) extension which integrates the feature rich language server of the same name, [`clangd`](https://clangd.llvm.org/) from LLVM.

To make `clangd` understand the source files you open you will need to provide it compile flags for each source file in a `compile_commands.json` file. CMake can generate this automatically using `-DCMAKE_EXPORT_COMPILE_COMMANDS=1`, which will write it to the build folder and be regenerated whenever it needs to be updated. I tend to have my build folder excluded from the editor to reduce noise, which makes me have to symlink it to the root of the source tree (which I have opened as the project), like such:

```bash
ln -s build/compile_commands.json compile_commands.json
```

## Building, running & debugging with CodeLLDB
When you're doing development you'll want a quick way to build and run the program, which should be as simple and convenient as pressing one key. You would also want to run it with a debugger attached such that you can catch crashes or set breakpoints to inspect the program state.

For this I use the [CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb) ([OpenVSX](https://open-vsx.org/extension/vadimcn/vscode-lldb)) extension which integrates the [`lldb`](https://lldb.llvm.org/) debugger from LLVM and provides it as a launch configuration. When launching a program with debug symbols, you can set breakpoints in source files and it will allow you to view various states of the program once the breakpoint is hit or viewing what happened when a segfault occurs.

The `lldb` launch configuration can be combined with a build task in order to first build, and then launch the program with a debugger attached if the build task was successful. To demonstrate, see the following `tasks.json` which defines a build task that runs `ninja` inside of the `build/` folder:

```json
{
	"version": "2.0.0",
	"tasks": [ {
		"label": "build",
		"type": "shell",
		"command": "ninja",
		"problemMatcher": [],
		"options": { "cwd": "build/" },
		"group": { "kind": "build", "isDefault": true }
	} ]
}
```

Then, the `launch.json` that uses `lldb` to launch the built executable, with `preLaunchTask` set to the previously defined build task making it a dependency on the launch configuration.

```json
{
	"version": "0.2.0",
	"configurations": [ {
		"type": "lldb",
		"request": "launch",
		"name": "Launch",
		"program": "${workspaceFolder}/build/tensy", // CHANGEME
		"args": [],
		"cwd": "${workspaceFolder}",
		"preLaunchTask": "build",
	} ]
}
```

And with that, pressing F5 will run a build and then launch the compiled binary in `lldb` creating a very convenient way of building and debugging the program with just a single key press.
