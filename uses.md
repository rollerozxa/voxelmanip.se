---
title: Uses
description: This page contains a list of the software I use.
---

# Uses
This page contains a list of the software I use.

## Software
- **Distribution:** [Arch Linux](https://archlinux.org)
- **Kernel**: [Linux](https://kernel.org/)
- **Coreutils**: [GNU Coreutils](https://www.gnu.org/software/coreutils/)
- **C runtime**: [glibc](https://www.gnu.org/software/libc/)
- **Bootloader**: [GRUB](https://www.gnu.org/software/grub/index.html)
- **Display Manager**: [ly](https://github.com/fairyglade/ly)
- **DE**: [KDE Plasma 6](https://kde.org/sv/plasma-desktop/)
- **Display server**: [Wayland](https://wayland.freedesktop.org/) ([Xorg](https://x.org/) as backup)
- **Audio**: [Pipewire-pulse](https://pipewire.org/)
- **Terminal**: [kitty](https://sw.kovidgoyal.net/kitty/)
- **Shell**: [zsh](https://www.zsh.org/) (with [my own config](https://github.com/rollerozxa/zshrc))
- **Version control**: [Git](https://git-scm.com/) / `gitui`
- **Compiler**: [GCC](https://gcc.gnu.org/) / [Clang](https://clang.llvm.org/) / [MinGW-w64](https://www.mingw-w64.org/)
- **Code/text editor**: [Code - OSS](https://gitlab.archlinux.org/archlinux/packaging/packages/code) / [Kate](https://kate-editor.org/sv/) / [Micro](https://micro-editor.github.io/)
- **Diff**: [Code - OSS](https://gitlab.archlinux.org/archlinux/packaging/packages/code) / [KDiff3](https://invent.kde.org/sdk/kdiff3)
- **File manager**: [Dolphin](https://apps.kde.org/sv/dolphin/)
- **Image viewer**: [Gwenview](https://apps.kde.org/gwenview/) / feh
- **Music player**: [VLC Media Player](https://videolan.org) / [openmpt123](https://lib.openmpt.org/libopenmpt/)
- **Video player**: [VLC Media Player](https://videolan.org) / [mpv](https://mpv.io/)
- **PDF Reader**: [Okular](https://okular.kde.org/)
- **Office Suite**: [LibreOffice](https://www.libreoffice.org/) (but I usually use a text editor & Markdown when I can)
- **BitTorrent client**: [qBittorrent](https://www.qbittorrent.org/)
- **Browser**: [Firefox](https://www.mozilla.org/sv-SE/firefox/new/) / [NetSurf](https://www.netsurf-browser.org/) (& Chromium for site testing)
- **Image editing**: [GIMP](https://www.gimp.org/) (what else?)
- **Audio editing**: [Audacity](https://www.audacityteam.org/)
- **Video editing**: [Kdenlive](https://kdenlive.org/en/)
- **Vector image editor**: [Inkscape](https://inkscape.org/)
- **Hex editor**: [GHex](https://wiki.gnome.org/Apps/Ghex) (YUCK) / [`hexcurse`](https://github.com/LonnyGomes/hexcurse)
- **Writing maths**: [Rnote](https://rnote.flxzt.net/)
- **Disk space analyser**: [Filelight](https://apps.kde.org/sv/filelight/) / [QDirStat](https://github.com/shundhammer/qdirstat) / [`dust`](https://github.com/bootandy/dust)
- **Archiver**: [Ark](https://apps.kde.org/ark/) / [`7z`](https://7-zip.org)[!]
- **Virtualisation**: [virt-manager](https://virt-manager.org/) (QEMU/KVM) / [quickemu](https://github.com/quickemu-project/quickemu)
- **Screenshotter**: [Spectacle](https://apps.kde.org/spectacle/)
- **Screen recording**: [OBS Studio](https://obsproject.com/)
- **Image optimisation**: [`optipng`](https://optipng.sourceforge.net/) / [`guetzli`](https://github.com/google/guetzli) / [`pngquant`](https://pngquant.org/)
- **Multimedia conversion**: `ffmpeg`
- **TOTP authenticator**: `oathtool` ([OATH Toolkit](https://www.nongnu.org/oath-toolkit/))
- **Filesystem search**: `find` & `grep`
- **Bragging**: `hyfetch`
- **System resource monitor**: [`btop`](https://github.com/aristocratos/btop)
- **System infodumping**: [`inxi`](https://smxi.org/docs/inxi.htm)
- **Access log visualisation**: [`goaccess`](https://goaccess.io/) / [`logstalgia`](https://logstalgia.io/)
- **Git history visualisation**: [`gource`](https://gource.io/)
- **Phone screen mirroring**: [`scrcpy`](https://github.com/Genymobile/scrcpy)
- **Calculator**: [KCalc](https://apps.kde.org/kcalc/) / [Python](https://www.python.org/) REPL / [Lua](https://luajit.org/) REPL
- **XMPP client**: [Gajim](https://gajim.org/)
- **Matrix client**: Element Web
- **IRC client**: [Quassel IRC](https://quassel-irc.org/) (formerly HexChat but GTK2 isn't getting any newer...)
- **Content blocker**: [µBlock Origin](https://github.com/gorhill/uBlock)
- **Performance overlay**: [MangoHud](https://github.com/flightlessmango/MangoHud)
- **Gaming**: Steam[!], [Minetest](https://www.minetest.net/), [Principia](https://principia-web.se/)
- **Console gaming (emulation)**: Dolphin, MelonDS, Citra, mGBA, PCSX2 etc.

(`[!]` denotes software that is proprietary)

I version control the list of packages I have on my desktop, so you can also see a full list of what packages I have installed at the moment [here](https://github.com/rollerozxa/packages/blob/master/packages.txt). Only explicitly installed packages are listed.

### Browser extensions
For Firefox I use various browser extensions to make the modern web a bit more bearable.

- [Dark Reader](https://darkreader.org/)*
- [Renewed Tab](https://renewedtab.com/en/)
- [Return YouTube Dislike](https://returnyoutubedislike.com/)
- [SponsorBlock](https://sponsor.ajay.app/)
- [Stylus](https://add0n.com/stylus.html)
- [uBlock Origin](https://github.com/gorhill/uBlock)*
- [Unhook YouTube](https://unhook.app/)
- [Violentmonkey](https://violentmonkey.github.io/)

Ones marked with asterisks I also use on my phone with Firefox for Android.

### Code - OSS extensions
Code - OSS (aka the open source upstream of VSCode) is my primary code editor, and I have various extensions to improve the experience when working with various languages.

- [clangd](https://open-vsx.org/extension/llvm-vs-code-extensions/vscode-clangd) - C/C++ code completion & more using `clangd`
- [Cmake](https://open-vsx.org/extension/twxs/cmake) - CMake language support
- [CodeLLDB](https://open-vsx.org/extension/vadimcn/vscode-lldb) - LLDB debugger integration for debugging C/C++
- [Lua (sumneko)](https://open-vsx.org/extension/sumneko/lua) - Lua language server
- [Markdown Table](https://open-vsx.org/extension/TakumiI/markdowntable) - Helpful extension for editing Markdown tables
- [Material Icon Theme](https://open-vsx.org/extension/PKief/material-icon-theme) - Nice icon theme with a lot of icons for particular filetypes and folder names
- [Seti-Monokai](https://github.com/smukkekim/vscode-setimonokai-theme) - Nice dark Monokai-like theme

Links are to OpenVSX which most open source distributions (Code - OSS, VSCodium) use but all should also be available on the VSCode extension marketplace.

## Phone
This is just a selection of some of the apps I have installed on my phone - you are likely not very interested in all the Google apps that are preinstalled and such.

- [Calculator++](https://f-droid.org/en/packages/org.solovyev.android.calculator/)
- [Conversations](https://f-droid.org/en/packages/eu.siacs.conversations/) - XMPP Client
- [F-Droid](https://f-droid.org/)
- [Feeder](https://f-droid.org/en/packages/com.nononsenseapps.feeder/) - RSS client
- Firefox (the... technically not Free official build)
- [Fossify Gallery](https://f-droid.org/en/packages/org.fossify.gallery/) (replacing Google Photos)
- [Markor](https://f-droid.org/en/packages/net.gsantner.markor/) - Text editor
- [Obsqr](https://f-droid.org/packages/trikita.obsqr/) - QR reader
- [Revolution IRC](https://f-droid.org/en/packages/io.mrarm.irc/) - IRC client
- [SchildiChat](https://f-droid.org/en/packages/de.spiritcroc.riotx/) - Matrix client
- [Stanley](https://f-droid.org/en/packages/fr.xgouchet.packageexplorer/) - Android app analyser
- [Termux](https://f-droid.org/en/packages/com.termux/)
- [Tusky](https://f-droid.org/en/packages/com.keylesspalace.tusky/) - Mastodon client
- [Vädret](https://f-droid.org/en/packages/fi.kroon.vadret/) - Weather app (sourcing data from Swedish SMHI)

For my launcher and icon theme I use [Nova Launcher](https://play.google.com/store/apps/details?id=com.teslacoilsw.launcher) and [Delta icons](https://f-droid.org/packages/website.leifs.delta.foss/) which are... proprietary and non-free respectively. :(
