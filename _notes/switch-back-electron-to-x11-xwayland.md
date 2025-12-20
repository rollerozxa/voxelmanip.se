---
title: Switch back Electron to X11 (under XWayland)
last_modified: 2025-12-20
---

As of Electron 38, it will now make use of Wayland by default on Linux when an Electron app is running under a Wayland session, and the developer has not explicitly switched back to using X11. This change has since begun to roll out as programs using Electron upgrade to version 38 or later.

<!--more-->

This is generally a good change, but for some reason [this has made the appearance of Electron apps brighter for me](https://hachyderm.io/@ROllerozxa/115735441458414005) like it uses (or misuses) some gamma value that was previously not being used. I'm not quite sure why this happens as it does not happen with other programs that I can run both under Wayland and X11 (e.g. SDL) to compare.

Previously you could use the `ELECTRON_OZONE_PLATFORM_HINT` environment variable to force a given option (`x11` or `wayland`), but this has been removed in Electron 38 and does nothing now. Instead you will need to pass `--ozone-plaftform` as a command-line argument to the program in question to force a specific configuration.

So to force Electron to use X11 (under XWayland) you will need to start your Electron apps with **`--ozone-plaftform=x11`**. You could add this to your desktop file's Exec line, or create a wrapper script that adds this option automatically.
