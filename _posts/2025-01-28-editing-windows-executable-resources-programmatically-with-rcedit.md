---
title: Editing Windows executable resources programmatically with rcedit
tags: Informational Windows
cover_alt: Screenshot of a Windows desktop, showing a game.exe file with the LÖVE icon to the left, and an arrow pointing at a box_smasher.exe file to the right with the Box Smasher logo. A rcedit.exe file is visible in the center right above the arrow, symbolising the process of editing the executable metadata.
---

Sometimes you are in a situation where you need to modify an already built Windows executable, whether it be a program without available sources or where it is more convenient to use already available prebuilt binaries for your own purposes. In this case you usually also want to edit the metadata embedded within the executable as resources.

When wanting to distribute a LÖVE game for Windows, I wanted a convenient way of modifying the resource metadata of the LÖVE runtime executable. I ended up finding a very useful program for that purpose, named `rcedit.exe`.

<!--more-->

## LÖVE
LÖVE is a quite nice game framework that makes use of Lua as its scripting language. It is rather lightweight but still provides you with a lot of the essentials for making games, available to you right through the Lua API.

Within the LÖVE ecosystem, you can zip up a game and then rename the extension to `.love`. This then becomes a LÖVE game package, that can be played with the LÖVE runtime installed. But being a framework rather than a more fully featured and integrated game engine, it does not offer any native kind of game export capabilities. However, there is of course the ability to take the LÖVE runtimes for the different platforms and repackaging it with your game, which they have made relatively simple.

For the Windows version of the LÖVE runtime it supports a so-called "fused" mode where it can load a `.love` file that is appended to the executable. In Linux shell terms, this is how you fuse a game:

```bash
cat love.exe game.love > game.exe
```

Once you run `game.exe`, it will read the embedded .love file and launch it, giving the game full control over the experience. But the executable file itself will, outside of the different filename, remain quite LÖVE-y.

{% include image.html
	name="fused_game_exe.webp"
	alt="Screenshot of the fused game.exe file being hovered on, showing the LÖVE logo and metadata in the tooltip."
	caption="Oh no no, not my precious game, the immersion is ruined! Worse than a Unity splash screen!" %}

To resolve that, it will be necessary to go a bit deeper into the Windows executable and the resources embedded within one.

## What is a resource?
Resources are data files that are embedded into Windows executables, that come in many different types. If you are making a native Windows-only program you may be using these extensively for dialogs, embedded images, translation strings, and more.

But for most cross-platform software that relies on its own provided functionality and libraries for such things, the only thing it is used for is providing the executable icon as well as metadata about the executable. This is called a [VERSIONINFO](https://learn.microsoft.com/en-us/windows/win32/menurc/versioninfo-resource) resource, usually also combined with a [ICON](https://learn.microsoft.com/en-us/windows/win32/menurc/icon-resource) resource for the executable icon, in the classic `.ico` format.

## Resource Hacker
[Resource Hacker](https://www.angusj.com/resourcehacker/) is this really nifty program that allows you to open a Windows executable and inspect, as well as edit, the resources that exist inside of the executable.

Opening up the LÖVE runtime executable shows us a version info resource that looks something like this.

{% include image.html
	name="res_hacker.webp"
	alt="Screenshot of the version info for the LÖVE runtime executable, as seen by Resource Hacker."
	caption="Please excuse my awful Wine dark theme." %}

Now, what you could do is take an unmodified version of the LÖVE executable, make your modifications to the version info, replace the executable icon with your own .ico file, and then this executable will serve as the basis when you fuse the game for release.

I did this back in 2023 when I did the first release of Box Smasher on itch.io, but when I revisited it now to further develop it and package things up for a 1.1 release, I felt I could make this process a bit more convenient without needing to have a modified template executable around.

Wouldn't it be nice if I could just edit the resource data directly from the shell script that already does the game packaging? I was clearly onto something, and it made me discover `rcedit`.

## rcedit
[`rcedit`](https://github.com/electron/rcedit) is a small command-line tool from the Electron developers (yes, [*that* Electron](https://www.electronjs.org/)) that allows you to edit and manipulate resources embedded within a compiled Windows executable. While it is a Windows-only program as it relies heavily on native Win32 APIs for the resource handling, it still works fine when run inside of Wine.

The tool has various command-line arguments as can be seen with `--help`, but some of the ones that are useful for this are the following:

```bash
--set-version-string <key> <value>  Set version string
--set-file-version <version>        Set FileVersion
--set-product-version <version>     Set ProductVersion
--set-icon <path-to-icon>           Set file icon
```

The `--set-icon` argument will replace the embedded icon used as the primary executable icon, `--set-file-version` and `--set-product-version` sets the file version and product version respectively in the fixed info section, and `--set-version-string` sets arbitrary version string keys to the value provided. The full set of version strings can be can be found on [this page in the Microsoft Learn documentation](https://learn.microsoft.com/en-us/windows/win32/menurc/versioninfo-resource#remarks) under "string-name".

Of note is that the special product and file version arguments that set the fixed info section need to be in pure dotted decimal notation, with four numbers allowed. There are also similarly named `FileVersion` and `ProductVersion` keys in the version information which allows for arbitrary version names. Just Windows things.

As an example combining all of that together, the following code below is (more or less) the command being run to rebrand the LÖVE runtime executable for Box Smasher, embedding an .ico format of the game logo and modifying the version info metadata all in one command. The following version strings are also generally the only required ones you'll need to change.

```bash
VER="1.1.0"
VER_STRING="1.1.0-dev"

wine rcedit "box_smasher.exe" \
	--set-icon "box_smasher.ico" \
	--set-file-version "$VER" \
	--set-product-version "$VER" \
	--set-version-string FileDescription "Box Smasher" \
	--set-version-string FileVersion "$VER_STRING" \
	--set-version-string CompanyName "ROllerozxa" \
	--set-version-string LegalCopyright "(c) ROllerozxa, et al." \
	--set-version-string ProductName "Box Smasher" \
	--set-version-string ProductVersion "$VER_STRING" \
	--set-version-string OriginalFilename "box_smasher.exe"
```

The end result is a new executable that bears the full custom branding for my game, and no remnants of the old LÖVE metadata is left.

{% include image.html
	name="modified_game_exe.webp"
	alt="Screenshot of the modified box_smasher.exe file being hovered on, showing the Box Smasher icon and metadata in the tooltip."
	caption="Very professional, brought to you by the CEO of ROllerozxa." %}
