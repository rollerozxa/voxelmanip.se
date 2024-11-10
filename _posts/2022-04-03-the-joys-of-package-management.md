---
title: The joys of package management
tags: Linux
no_cover: true
redirect_from: /2022/04/03/The-Joys-Of-Package-Management/
---

One of the reasons I find Linux to be largely superior over Windows is its use of package managers. For a Windows user, this might seem like a nit-pick when comparing the two operating systems but it really is a game changer. The implementation of package managers varies between different families of Linux distributions, and I'm writing with Arch Linux's package manager `pacman` in mind, but the idea and core concept is the same no matter the distro.

<!--more-->

To begin with I probably should explain what a package is, in its simplest form. It can be any type of software or data, be it an user-facing program, library or additional data for programs. Packages are shipped in file archives where its files are structured from the root of the filesystem, and usually contain additional metadata such as a description of the package, its license, and its required and optional dependencies.

A Linux system can have hundreds or even thousands of packages, and they make up a web of dependencies each package relies on, with the base system package or glibc usually being the root package every other package relies on in some way. Structuring a system in this way has several upsides.

It allows for common libraries to be shared by several programs as compared to on Windows where programs will include all libraries it needs either statically linked into the executable or as a DLL file in the same folder as the program. This ends up becoming quite a space saver, each program does need to include large libraries or runtimes such as Qt, Electron or Python but can simply label them as a dependency of its package. The package manager will see the list of dependencies and if one is not installed, it will be installed alongside the package you want installed.

It can also improve security. When a vulnerability for a security-critical library like OpenSSL is found, the OpenSSL package is updated and every other package relying on it will now be using the newer version with the vulnerability patched. For Windows programs you would be relying on the developer to update their program with a new OpenSSL DLL, which might take some time or be delayed until the next proper feature update for the program.

In addition the basic structure of packages and the versatility of your package manager will also mean system maintenance is easier. Since the package manager knows the version of every package, their dependencies and also knows, from the repositories it has access to, the latest version of a package.

What this effectively means is one single command to upgrade your entire system and the packages installed, and that the current system can be easily reconstructed from [a simple text file with a list of packages](https://github.com/rollerozxa/packages). Instead of needing to back up your entire root filesystem, all that needs to be backed up is your home folder and your list of packages, which can later be reconstructed (it's like [Ninite](https://ninite.com/) but instead of a limited selection it's **absolutely everything!**). You can of course also install or remove packages in bulk, something which is considered heresy by Windows Installer.

Dependency resolution, along with your package manager marking whether a package was explicitly installed as compared to installed as a dependency, also means you can check for orphaned packages. They can be dependencies for packages that have updated and no longer depend on said package, or remnants from a package you have removed. This useless cruft can be cleaned quickly and simply with a single command.

But no package manager is complete without powerful packaging tools. For Arch Linux's `pacman` in particular, it contains `makepkg` which is a tool that can automatically build and package packages from buildscripts called PKGBUILDs. They are available for every official repository package which ends up becoming an encyclopedia of automated compilation instructions for everything imaginable, and also a great starting ground if you want to rebuild software with your own patches, giving you complete and full control in how you shape your system.

They are also easy to create, and make it dead simple to create your own packages that can be distributed in packaged form under a custom repository or as its buildscript pushed onto the AUR for others to build and make use of.

While these points may just be coming from the point of a power user who's far beyond any kind of sanity (heh), I personally do still believe the fact it would be good for everyone. I feel having one tool that can update and manage all your software, complete with dependency management and also the capability to backup all your software just by listing their package names would be extremely beneficial to everyone.