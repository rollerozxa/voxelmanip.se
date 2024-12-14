---
title: SDL_LEAN_AND_MEAN
tags: Informational SDL
cover_alt: The SDL logo with crudely drawn limbs and a face on it. It has angry eyebrows and it is running fast, as noted by the
---

As storage space becomes larger and larger even on the most modest of phones and bandwidth is becoming evermore plentiful, software tends to become larger in size over time as the necessity to optimise filesizes decreases. But there are also people who wish to reverse the trend by trying to conserve the amount of space their resulting program becomes through going closer to the metal or finding clever ways to cut down the size of their dependencies.

SDL is a library that aims to provide cross-platform low level access to input, audio, graphics and more that will *just work* across all supported platforms, for games and other multimedia programs. While the library originally had humble beginnings it has since grown with size as new features that while may be useful to some, are not something everyone would utilise when using SDL. Thankfully there are countless build options you can use to control what gets built with SDL but there is also the rather funnily named and undocumented define, by the name of `SDL_LEAN_AND_MEAN`.

<!--more-->

## What it is
The name is obviously a homage to the old [WIN32_LEAN_AND_MEAN](https://devblogs.microsoft.com/oldnewthing/20091130-00/?p=15863) preprocessor define in Windows, and is something you can define while compiling SDL. It disables a bunch of miscellaneous features from SDL that are large in size, or otherwise features that contribute a significant amount of the library footprint compared to the amount of use it sees by users of the library.

The things it disables can be found in the internal [SDL_internal.h](https://github.com/libsdl-org/SDL/blob/main/src/SDL_internal.h#L129) header file. Being a generally undocumented option it can be assumed that it may disable additional features in the future, but currently what it disables are the following:

- Various optimised software blitting functions with lookup tables for different colour depths and such
	- `SDL_HAVE_BLIT_0`
	- `SDL_HAVE_BLIT_1`
	- `SDL_HAVE_BLIT_A`
	- `SDL_HAVE_BLIT_N`
	- `SDL_HAVE_BLIT_N_RGB565`
	- `SDL_HAVE_BLIT_AUTO`
- Run-Length-Encoding optimisation of surfaces with the SDL_RLEACCEL flag (`SDL_HAVE_RLE`)
- Software backend of the SDL renderer (`SDL_VIDEO_RENDER_SW`)
- [YUV colourspace](https://en.wikipedia.org/wiki/Y%E2%80%B2UV) support (`SDL_HAVE_YUV`)

Defining SDL_LEAN_AND_MEAN will set all of these to 0, but you can override things by e.g. defining SDL_HAVE_YUV to keep it while getting rid of the rest.

## How to use it
The build option is not exposed as a proper CMake option, which [is intentional](https://github.com/libsdl-org/SDL/pull/9252#issuecomment-1989413125) due to the fact it disables a bunch of random features across the library that you may not realise are disabled when you enable a generic "debloat" compile option. To build with it, you will need to pass `SDL_LEAN_AND_MEAN` as a C flag when generating the CMake build files:

`-DCMAKE_C_FLAGS="-DSDL_LEAN_AND_MEAN=1"`

Then build. To check that the flag has been applied apart from comparing the size difference from a , you can check in the `libSDL3.a` static library that files like `SDL_RLEaccel.c.obj` and `SDL_render_sw.c.obj` are stubbed - they should only be mere bytes in size compared to the other object files.

## How much will it save?
For testing, I will be compiling SDL3 commit [6cc9ce1](https://github.com/libsdl-org/SDL/commit/6cc9ce183d904489bf8e33e26b91d6012667e1b0) in release mode.

Building for x64 Windows with llvm-mingw with default configuration options, basically with everything enabled gives me a 3.8 MiB SDL3.dll file when fully stripped. Rebuilding with `SDL_LEAN_AND_MEAN=1` defined shrinks the DLL down all the way to a 2.3 MiB SDL3.dll, a significant improvement of 1.5 MiB.

Building for Android (arm64-v8a) with the NDK with the default configuration options gives me a 1.9 MiB libSDL3.so file when stripped. Rebuilding with `SDL_LEAN_AND_MEAN=1` shrinks it down to 1.5 MiB. Not as significant because the Android library starts out much smaller than the Windows one, but do keep in mind that you would generally ship everything from two to four native libraries for every supported ABI on Android. If shipping them all in a combined APK then the space savings would begin to add up.

Of course, this is merely the beginning of the options you have for reducing the footprint of the SDL library, by removing other features and components you don't need.

## Other ways to reduce SDL's footprint
In addition to `SDL_LEAN_AND_MEAN`, there are a lot of other more descriptive build options actually exposed to CMake for disabling particular SDL subsystems and features that your program may not be using and that you can live without. You can view the list of compile options once a build folder has been configured by running `cmake .. -LH` (assuming your build folder is at the root of the SDL source tree).

Another SDL feature that may contribute substantially to the footprint of the library is the Dynamic API functionality, which can be disabled by modifying the internal header file `SDL_dynapi.h`. However you may want to think twice about disabling this feature, as it allows for updating the version of SDL in the field even when statically linked, allowing users to receive fixes from newer versions of SDL without you needing to recompile and release an update. [There is an article in the SDL docs that goes over this in more detail](https://wiki.libsdl.org/SDL3/README/dynapi). However on some platforms (Android, Emscripten, [etc.](https://github.com/libsdl-org/SDL/blob/main/src/dynapi/SDL_dynapi.h#L46)) where the Dynamic API wouldn't be useful or usable it is already disabled by default.

For compressing executables and libraries on common desktop platforms you can use [UPX](https://github.com/upx/upx) which can further reduce the filesize of the program, but can introduce other issues depending on the platform such as AV false positives or increased memory usage (however small it may be) from the whole program needing to be decompressed into memory before it can run.

As an example, I recompiled SDL for Windows as above trying to disable as many features and subsystems as possible (including DynAPI) while keeping basic things like audio and 2D rendering intact. I then compiled the [renderer/01-clear](https://examples.libsdl.org/SDL3/renderer/01-clear/) example statically linking against the built library, and the result is a standalone binary approximately 995 KiB in size.

Then with UPX compression the executable is further reduced to a crazy 360 KiB! This would leave plenty of space for your own program code if you were to, I don't know, put it on a floppy disk.
