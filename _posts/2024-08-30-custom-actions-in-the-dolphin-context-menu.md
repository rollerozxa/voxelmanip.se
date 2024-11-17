---
title: Custom actions in the Dolphin context menu
tags: Linux
cover_alt: Screenshot of the Dolphin file manager showing the context menu from right clicking on an image file.
---

Whenever you right click in Dolphin a context menu appears with a list of various actions you can take depending on the context, if you have selected a particular filetype or a folder. Having not quite yet ascended to the plane of doing all my file management from the terminal, I thought it would be useful to make custom actions for things that I currently do by opening a terminal from Dolphin.

<!--more-->

KDE Plasma and Dolphin has also seen many iterations over the years, version 6 being the latest as of writing. So if you attempt to look up something more technical just with a search on Google or similar you will probably end up sifting through Stack Exchange answers from varying years ago that may be talking about something as it existed in version 5 or even version 4.

That was basically what I ended up at, but what you are looking for is called the *service menu* and there is an [article in the Dolphin documentation](https://develop.kde.org/docs/apps/dolphin/service-menus/) about it. So that was a bit of a lesson for me to always go directly to the official documentation. Reading the effin' manual, if you will.

So once you've arrived at the proper documentation, it is actually quite simple. Just a .desktop file loaded from e.g. `~/.local/share/kio/servicemenus/` that contains a desktop entry and an action which executes a command.

I already had a small shell script `convert-webp-lossless` that accepts an arbitrary amount of PNG images as arguments that it will then convert to lossless WEBPs saved as the same filename but with the extension changed from `.png` to `.webp`.

```bash
#!/bin/bash

while [[ $# -gt 0 ]]; do
	magick $1 -define webp:lossless=true ${1/png/webp}
	shift
done
```

I have previously used it from the terminal, but now that I have the power of custom Dolphin service menus, I made one for adding a new action "Convert to WEBP (Lossless)" attached to any files with the `image/png` mimetype, which runs the beforementioned script.

```ini
[Desktop Entry]
Type=Service
MimeType=image/png;
Actions=pngToWebp

[Desktop Action pngToWebp]
Name=Convert to WEBP (Lossless)
Icon=convert-symbolic
Exec=convert-webp-lossless %U
```

Saved it as `png-to-webp.desktop` in the servicemenus folder, and now I have an option when right-clicking on any PNG image to convert it to a lossless WEBP just like that. The ability to easily customise and extend the functionality software you use with just a couple lines in a configuration file is pretty useful.
