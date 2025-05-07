---
title: Porting a game to 7 platforms
tags: Projects SDL
cover_alt: Screenshot of the Tensy main menu showing the game title. Around it are the logos for Windows, Android, Linux (AppImage right behind it), WebAssembly, PSVita, Haiku OS and macOS.
---

When making a game or another kind of general purpose program, you would usually want to ensure that it runs on more than one platform. Targeting a higher-level, cross-platform library rather than OS-specific APIs usually gets you most of the way there, but there are still many other considerations that are needed if you want it to be available and function across several platforms.

When faced with this predicament, one may also wonder how to port your software to as many platforms as possible. That's what I wanted to give a try, and ended up porting a game of mine to 7 platforms in total.

<!--more-->

## The subject
The subject of this porting bonanza is [Tensy](/projects/tensy/), a puzzle game I have been making. It is relatively simple technically, being written in C and using SDL3. There are no complex external dependencies other than SDL, and it makes use of SDL's functionality for everything from input to audio as well as using SDL's 2D renderer for the graphics.

This ends up making it very inherently portable just from the get go since as long as SDL is supported on a platform, you'll be basically guaranteed to get something built with just a C compiler toolchain. [And SDL supports a lot of platforms](https://github.com/libsdl-org/SDL/blob/main/docs/README-platforms.md).

## Linux
The first platform as that's where I started out. Obtaining SDL can be usually done through the distro's package manager, though when I started the game SDL3 did not even [have its ABI freeze yet](https://github.com/libsdl-org/SDL/releases/tag/preview-3.1.3). So I built the `sdl3-git` package from the AUR and went on with laying out all the (admittedly small amount of) boilerplate to get an SDL project compiling with CMake.

While building for development is very simple and convenient on Linux, building something for distribution may not be as simple. Fortunately the dependency tree of the game is not very large, and SDL3 cleverly dynamically loads any libraries dynamically at runtime depending on what exists on the target system, meaning there is no explicit linkage of anything other than glibc. So building the game on an older distro, say an older version of Debian, is enough to get a Linux binary that will work on a wide range of glibc-based distributions.

While the game can already be contained within a single Linux ELF binary, an AppImage would still be useful for distribution. In this case, the program is so simple that just going with the low-level `appimagetool` is fine. A full write-up about AppImage is for another blog post, but this is the structure for the directory that gets turned into an AppImage by `appimagetool`:

```
- .DirIcon -> tensy.png
- AppRun
- tensy.desktop
- tensy.png
```

`AppRun` is the entrypoint for every AppImage. In other cases this might be simply a Bash script or some other kind of bootstrap that launches the actual program with certain environment variables set to load libraries that are included in the AppImage, among other things. But in Tensy's case, it's just one binary and can be placed as the `AppRun` entrypoint itself. The other files are metadata files which are used for various AppImage helper tools which can provide icon previews, desktop integration and other things.

## Windows
I do not actively use Windows, but if I did I would likely have built the game with [MSYS2](https://msys2.org) when starting development.

Since I prefer to stay a decent length away from Windows I usually want cross-compilation. I picked the wonderful llvm-mingw ([which I wrote a blog post about](/2024/12/10/cross-compiling-for-windows-using-llvm-mingw/)) which provides an LLVM-based mingw-w64 toolchain. It's nice and also has support for building for Windows on Arm. Very fancy.

For Windows you would usually want to add some metadata to the executable such as an icon and other information. This is contained within so-called resource files, which are oddly formatted files that can be used to store all kinds of resources for the program. But for a cross-platform program that doesn't want to dive deep into Win32 APIs, the only time they will be used for is for executable metadata in the form of a [VERSIONINFO](https://learn.microsoft.com/en-us/windows/win32/menurc/versioninfo-resource) resource.

## WebAssembly
[WebAssembly](https://webassembly.org/) is (primarily) a web technology that allows you to build C and other low level languages to run in the WebAssembly VM of a browser. It is the successor of previous attempts such as transpiling assembly into JavaScript (asm.js) and has achieved widespread browser support, providing a great platform to port your native program to the web. And lucky for us SDL supports it very well!

To compile things to WebAssembly, you usually use the toolchain provided by [Emscripten](https://emscripten.org/). It provides a wrapper for CMake called `emcmake` that will set up everything for compiling using Emscripten, replacing your normal call to `cmake`. Once compiled you'll get a .wasm file with the main program as well as a .js file for glue code.

To run the program, you'll also need some HTML boilerplate to get the program initiated and rendering to a canvas element. `emrun` provides a nice test environment for development, but the minimum you'd need to get written to make a simple player-ready frontend [is not that much](https://github.com/rollerozxa/tensy/blob/master/packaging/index.html).

{% include image.html
	name="tensy_web.webp"
	alt="The top part of the Tensy main menu showing the game title. Above is a browser's address bar." %}

## Android
Android is Android. SDL supports it very well nowadays, of course.

In addition to running the traditional Dalvik bytecode compiled from Java, Android supports apps that contain libraries built natively for the device's architecture, compiled using the [Android NDK](https://github.com/android/ndk) toolchain. While you will still need to start the app in Java before you can load native code, you could get away with very small amounts of Java glue code to hand off everything to your native code, and with SDL all Java glue code you would need is provided for you. All you really need to do is create your own activity class extending from `SDLActivity` with the name of the library to load:

```java
package se.voxelmanip.tensy;
import org.libsdl.app.SDLActivity;

public class GameActivity extends SDLActivity {
	@Override protected String[] getLibraries() {
		return new String[] {"tensy"};
	}
}
```

Quite simple.

Then add some Gradle boilerplate for an Android project (SDL gives you [a skeleton to base it off of](https://github.com/libsdl-org/SDL/tree/main/android-project)), and it compiles. You'll want to change the application ID, as well as the app title and icon too.

Run Gradle to build the app, sign it and then install it onto your phone with ADB. And it's done.

{% include image.html
	name="tensy_android.webp"
	alt="Holding a phone running Tensy at the main menu, showing the game title and the menu buttons."
	caption="Please excuse the terrible webcam quality." %}

## macOS
While all of Apple's platforms are quite hostile to scrappy amateur developers, some form of macOS support is at least attainable for this project. I don't have a Mac, but what I do have is a macOS virtual machine created by [Quickemu](https://github.com/quickemu-project/quickemu), which allows you to [surprisingly easily create QEMU virtual machines running macOS](https://github.com/quickemu-project/quickemu/wiki/03-Create-macOS-virtual-machines). Simply pick the version of macOS and it will download a recovery image straight from Apple (hah!) and create a Bash script with a QEMU launch command to run the VM. After you've installed macOS, you've got your own virtualised Hackintosh.

Apple provides its own Clang compiler as part of their developer toolchain, and additional packages such as CMake you would typically want to install from Homebrew. Then once built, you'll get a Mach-O executable file which you can run from the terminal. Simple as that.

{% include image.html
	name="tensy_macos.webp"
	alt="Screenshot of Tensy in-game, showing the macOS window decoration and menu bar at the top." %}

But for distribution you would want to put this binary into a so-called app bundle. An [app bundle](https://en.wikipedia.org/wiki/Bundle_(macOS)#Application_bundles) in macOS is simply a folder that ends in .app (zipped for Internet distribution) which contains all necessary files for a program. For a fairly simple program like Tensy, this is what the resulting contents of the `Tensy.app` bundle are:

```bash
Contents/
  MacOS/
    tensy
  Resources/
	tensy.icns
  Info.plist
  PkgInfo
```

The executable is put in `MacOS/`, and any program data files (as well as the icon) are put in `Resources/`. The `Info.plist` file is an XML file containing some metadata for the program &mdash; the full list of values is available [here](https://developer.apple.com/documentation/bundleresources/bundle-configuration) and the file that Tensy uses is [here](https://github.com/rollerozxa/tensy/blob/master/packaging/Info.plist).

Currently the macOS ecosystem is still in a transition period between x86 and ARM, so as a developer you would want to provide builds of both architectures. Thankfully macOS supports creating fat binaries that contain code for both architectures at the same time (called [Universal Binary](https://en.wikipedia.org/wiki/Universal_binary) by Apple, because they love giving things special names).

It can be easily enabled with CMake by passing `-DCMAKE_OSX_ARCHITECTURES="arm64;x86_64"` as an option when compiling which will make it compile for both architectures and then link it all together. The resulting binary will then be able to run both on older x86-based Macs as well as newer ARM-based Macs without any Rosetta emulation layer.

## Haiku OS
Oh yes, this is where things are going off the rails.

Haiku OS is a free reimplementation of BeOS. It is not Linux, but people sure have ported a lot of stuff to it and unsurprisingly SDL has first class support for it, being the low-level basis for a lot of stuff one would want to port. As easy as building SDL and then building Tensy, and there it runs.

{% include image.html
	name="tensy_haiku.webp"
	alt="Screenshot of Tensy in-game on Haiku. You can see the Haiku desktop at the top and the Haiku menu in the top-right corner." %}

However while trying to set up the game to build for Haiku OS automatically in CI, I ran into some issues. Obviously there are no GitHub runners running Haiku, and trying to virtualise Haiku in QEMU in CI does not sound very thrilling.

Thankfully I stumbled upon through looking at SDL's CI workflows [a Linux container that includes a cross-compiler toolchain](https://github.com/orgs/haiku/packages/container/package/cross-compiler) which can target Haiku OS. It's officially maintained under the Haiku OS umbrella, but it's not really documented anywhere and seems to have [gone mostly unnoticed until SDL started using it](https://github.com/haiku/infrastructure/issues/140).

While setting the Haiku CI for Tensy, I noticed something rather strange happening with the resulting build artifacts. Because for some reason SDL's CI compiles Haiku into a weird Unix-y amalgamation of Linux and Haiku &mdash; it uses the proper cross-compiler binaries, but does not properly cross-compile targeting Haiku so it uses the header directories from the Linux host. The result of this is a completely headless binary which does not know how to render or do anything useful on Haiku.

Fortunately this was rather simple to solve by [writing my own CMake toolchain file](https://github.com/rollerozxa/tensy/blob/master/packaging/toolchain-haiku.cmake) to define the environment it should use when cross-compiling for Haiku. Of note is the FIND_ROOT_PATH which is inside of the directory for the cross-compiler toolchain, so it pulls includes and other things from there rather than in Linux's `/usr` directory. Hopefully the SDL folks will find this useful too.

## PlayStation Vita (Homebrew)
Now we're going into the realm of homebrew console platforms!

While SDL ports on homebrew console platforms are generally developed in separate downstream forks, lagging behind upstream by some revisions or even whole version numbers, there are a total of three homebrew PlayStation platforms that the even latest SDL3 currently supports.

The one which was the most enticing ended up being the PlayStation Vita, Sony's last handheld console which ended up being a bit of a failure. However despite this the Vita homebrew community seems to be very active and enthusiastic about the console, and so of course SDL has support for it.

The Vita homebrew community has created their own homebrew toolchain and SDK for making Vita games, called [vitasdk](https://vitasdk.org/). The installation of it is quite straightforward, and they also maintain a quite decent amount of common libraries you can install as packages as part of the SDK project. Not really anything Tensy needs, but it's nice nonetheless.

Once installed you can cross-compile for the Vita simply by passing their CMake toolchain file when creating a build folder. Once compiled it will create a 32-bit ARM ELF file targeting the Vita.

```
$ file tensy
tensy: ELF 32-bit LSB executable, ARM, EABI5 version 1 (SYSV), statically linked, not stripped
```

...Or does it? Trying to run this produced executable in the premier Vita emulator [Vita3K](https://vita3k.org/) did not give any results. Apparently Sony has its own executable format for the Vita (referred to as SELF) which needs to be converted to in order to be able to actually run it on the console.

In addition to that though, the primary way of distributing Vita homebrew are through `.vpk` files. They are basically just ZIP files containing a SELF executable payload as well as some associated metadata for the game such as an icon and some more graphics during game startup.

Thankfully vitasdk makes all this fairly simple using the `vita_create_self` and `vita_create_vpk` functions. You provide [the metadata files](https://github.com/rollerozxa/tensy/tree/master/packaging/vita) and the SDK does the rest:

```cmake
vita_create_self(${PROJECT_NAME}.self ${PROJECT_NAME})
vita_create_vpk(${PROJECT_NAME}.vpk OZXA00010 ${PROJECT_NAME}.self
	VERSION "00.00"
	NAME Tensy
	FILE packaging/vita/icon.png sce_sys/icon0.png
	FILE packaging/vita/bg.png sce_sys/livearea/contents/bg.png
	FILE packaging/vita/startup.png sce_sys/livearea/contents/startup.png
	FILE packaging/vita/template.xml sce_sys/livearea/contents/template.xml
)
```

The result is a .vpk file that is able to run in Vita3K, and assumedly also on real hardware too.

{% include image.html
	name="tensy_vita.webp"
	alt="Screenshot of Tensy in-game, running in the Vita3K emulator."
	max_width=750 %}

## What more is there?
I ended up porting the game to quite the amount of platforms. But there are still a wide range of more platforms that SDL supports out of the box:

- Various BSDs (FreeBSD, NetBSD, OpenBSD)
- iOS (& closely related tvOS, watchOS and visionOS)
- Nintendo 3DS
- PlayStation 2 & the PSP

There are also the officially maintained PlayStation 4 and 5 ports, as well as the Switch port which are gated by an NDA signed with the respective console manufacturer and not in the main SDL source tree.

In addition to this, there are downstream forks that maintain support for platforms that aren't supported in the upstream SDL. However since SDL3 is still very new at the time of writing, most of these are still on SDL2 (or maybe even SDL1) due to the large amount of effort that generally goes into porting and maintaining a downstream platform port for SDL. For example, devkitPro maintains Wii, Wii U and Switch homebrew ports [in their fork of SDL2](https://github.com/devkitPro/SDL/branches/all).

Considering running Tensy on the Wii U would be pretty nifty, I might end up writing the bare necessities for a SDL3 -> SDL2 compatibility layer for Tensy unless a SDL3 port is developed before I get to that.

## Conclusion
In the end, I ported the game to 7 different platforms, each with their own set of architectures to cover. While doing this, I also took the time to set up CI in GitHub Actions to build the game for every supported platform when I push new commits for the game. Then when a successful build is made, it then gets uploaded to the [rolling](https://github.com/rollerozxa/tensy/releases/tag/rolling) release tag to act as a permanent storage for the latest builds of the game for every platform. The process of keeping all ports alive becomes very streamlined and easy to manage, and a lot of scaffolding becomes reusable for future projects.

For instance when I picked back up a Lua game project which I had been working on earlier in 2024, by the name of [Flood Fill](/projects/floodfill/), I wanted to rewrite it into C as the SDL2 bindings for Lua I were using were really starting to hold it down by the end. I started from the Tensy codebase (as well as the additional experience with C that I had gotten from it) and in an instant I had immediately ported the game to 7 platforms. This little thing that was originally written in Lua was now ready to run on a Vita after a day or two of rewriting parts of the game into C.

While the amount of platforms I have managed to port Tensy to don't come anywhere close to something like [Doom](https://en.wikipedia.org/wiki/List_of_Doom_ports), it still covers a wide reaching area of modern platforms that most people are on, as well as some unique outliers. It has also been a uniquely rewarding experience being able to simply point at a platform and say "I will port it to that!", then getting the game to show signs of life on it in an hour at most.

Also SDL is great. Both as a portability library and as a minimal framework for 2D games. I really can't get enough of it.
