---
title: ROller's rules for happy computing
tags: Linux
no_cover: true
redirect_from: /2021/10/29/ROllers-Rules-To-Happy-Computing/
quite_old: true
---

As I've switched from the dumpster fire that is the Windows operating system, I've begun going about my way of managing my Linux system in a very particular way. These guidelines, or rules, have purely existed as ideas in my mind, and I haven't thought about writing them down until now.

<!--more-->

That being said, these are rules. Not laws, or commandments. Breaking these rules isn't illegal, the Linux gods will not curse you for not following these rules, nor will Linus Torvalds come to your house personally and flip you off if you break one of these rules.

These are simply rules I personally believe make for a system that is easier to maintain and more enjoyable to use. As always, your mileage may vary.

When I am writing this I'm assuming an Arch system or any of its derivatives. Not only because it's the best Linux distribution out there (heh) but because some of the rules are hard to follow on distributions like Debian and its derivatives.

## The rules.
1. Do not install packages manually into the root filesystem.
2. Do not install programs or libraries from domain-specific package managers. (pip, gem, snap...)
3. Treat your Wine prefix(es) as temporary and throwaway.
4. If something in your home folder can be a package in the root filesystem, make it so.
5. Strive for the most up-to-date versions of software.
6. Take advantage of dependency management.

## Do not install packages manually into the root filesystem.
This is probably the most important rule, because it allows you to be able to reconstruct your root filesystem from just a text file with a list of package names, which is a huge plus for backing up your system. It also prevents you from having to manually update these manually installed programs since they'd just be managed by your package manager.

If you'd like to see how many "lost" files you have (files in your root filesystem that aren't managed by your package manager), you can install the `lostfiles` package and run it. It can give you a good overview on what you have manually installed into your root filesystem, and what can be cleaned up. Preferably you should not have any lost files listed at all, but there are always some files considered lost that really aren't. You can choose to ignore them or add them to your lostfiles exclusion config in `/etc/lostfiles.conf`.

## Do not install programs or libraries from domain-specific package managers. (pip, gem, snap...)
In a similar vein to rule 1, this makes them able to be reconstructed from an exported list of package names. For `pip`, installing them locally in the home folder clutters your home folder with junk that will never be updated and could be better served as a system installed package, which violates rule 4 and 5. Installing them system-wide (`sudo pip`) violates rule 1 since you're effectively installing packages that won't be managed by your package manager and will never get updated.

For things such as Snap and Flatpak... Just, don't. Your system's package manager is good enough, anything you would want to install is either available in the official repositories or as an AUR package, and it will most likely be smaller, faster and run better. If you're on a distro with outdated official repositories, you really need to re-evaluate your life choices.

AppImage is pretty alright and is the best method currently for distributing distribution-independent programs albeit with some statically linked dependency overhead. More often than not though, it could either be replaced with a non-AppImage package or packaged itself as a package (see rule 4).

## Treat your Wine prefix(es) as temporary and throwaway.
This one's for all you Windows program users.

As you download Windows programs and install them into your Wineprefix, it accumulates junk in a similar way to how a regular Windows install does. This is just how Windows and its programs are, there's no real way to prevent it, but there's one way to circumvent it. This is by treating your Wineprefixes as temporary and throwaway.

That is, do not store programs you regularly use within a Wineprefix, but package them and try to make it not touch any Wineprefix but instead works independently of it. [The Arch Wiki has a great article about this.](https://wiki.archlinux.org/title/Wine_package_guidelines) For example with the Windows game Principia, I have the Principia home folder normally at `C:\Users\%username%\Principia\` symlinked to `~/.principia/`. If you're lucky, the program you're trying to run already exists as an AUR package, which solves the issue of packaging it yourself.

## If something in your home folder can be a package in the root filesystem, make it so.
This is very akin to rule 2 and 3. If you have something that is in your home folder but that could very well be packaged and put into the root filesystem, do it! It might already exist in the official repositories or the AUR, but if not you would of course need to package it yourself.

If it's something that's general-purpose (i.e. not your dotfiles) and publicly available (i.e. not your legally dumped and ported NWF games for own use), you can [submit it for inclusion to the AUR](https://wiki.archlinux.org/title/AUR_submission_guidelines) and contribute to the wealth of packages available there. Otherwise, you can [create a custom local repository](https://wiki.archlinux.org/title/Pacman/Tips_and_tricks#Custom_local_repository) where you put packages to install like any other package available in the official repositories.

For Minetest, I maintain a wide variety of AUR packages which package Minetest games and install them to the system's games directory (`/usr/share/minetest/games/`), rather than installing them through the ContentDB and putting them in your local games directory (`~/.minetest/games/`).

## Strive for the most up-to-date versions of software.
If you're on Arch, you should already be getting the latest and greatest software, instead of having a hodge-podge of outdated packages from the official repositories and more up-to-date manually installed packages you sure as hell aren't updating.

However, even in Arch there are several major versions available for things such as Python, OpenJDK and PHP. Do you really need Python 2? You can check in the package information for `python2` if there are any packages that require `python2`, and if these packages are ones you don't even use anyways, you can safely remove both and clean up your system from obsolete cruft.

## Take advantage of dependency management.
If you follow the above rules you should already be pretty set on this part, but there is something that I'd like to bring up &mdash; Electron-based programs. Depending on the package, you will either use the system install of Electron or a version of Electron that is bundled with the program's specific package. Right now Electron 14.0.1 is about 170MB in size, so it could lead to a significant difference in install size.

One example is Discord, which in the official `discord` package comes bundled with its own electron runtime, but in the `discord_arch_electron` package available from the AUR it uses the system Electron package. Of course, there is a massive space save, since this system Electron package can be shared across every Electron applications it effectively cuts down the space Discord takes up on your system from 181MB to a little under 10MB.

Same idea can be applied to other types of programs with runtimes. The Linux version of GeoGebra Classic 5 comes bundled with its own Java runtime, which is thrown away in the AUR package in favour of Arch's regular official OpenJDK packages.
