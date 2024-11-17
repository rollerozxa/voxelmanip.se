---
title: Uninstalling system apps on Android with ADB (No root required)
tags: Android Guide
cover_alt: Photo of a tablet showing the app drawer. All apps have been uninstalled except for the Settings app (and a "Tethering" app that is part of the settings app).
---

If you've ever owned a couple Android devices you're definitively familiar with the kind of pre-installed system "bloatware" apps that may come with it from your manufacturer. Or maybe you're lucky and only get the base Google apps, or sometimes even that is too much for you.

Rooting your Android device usually makes you able to write to the system partition and delete system apps, but as time has gone on rooting has come with more headaches than the niceties it used to give you. While there are some that still choose to root their Android phone for the freedom it gives, a lot of us who may have done it in the past no longer do so just for the peace of mind of not having to deal with apps that check the device's "integrity".

Thankfully there is still a way of getting rid of any unwanted system apps on Android using ADB, which does not require your device to be rooted.

<!--more-->

## USB Debugging and ADB
You have probably already got this set up but I'll give a quick rundown.

You'll need to enable developer mode on your phone by pressing the build number several times in the "About phone" page (or equivalent for your vendor ROM) in the settings, and then enable the "USB debugging" setting in the new "Developer options". Then connect your phone to your computer with a USB cable.

On your computer you'll need to download the Android SDK platform tools which ADB is contained within. On Linux you usually can find it in your package manager, but [Google offers downloads for the platform tools for Windows, macOS and Linux here](https://developer.android.com/tools/releases/platform-tools). For Windows you may also need special "ADB drivers" for detecting your phone which are usually device specific, if Windows won't install it automatically you'll have to search for it.

## The command
For more information about going about uninstalling system apps, read on. But if you just want the command, here it is:

```bash
adb uninstall --user 0 <application ID>
```

To get a list of IDs of apps installed you can use the `adb shell pm list packages` command, adding `-s` to only show system installed apps. You can also install [Stanley](https://f-droid.org/en/packages/fr.xgouchet.packageexplorer/) on your phone which allows you to look at all your apps and see their application ID.

If you try to just uninstall system apps without the `--user 0` argument, you will get an error saying that it is not allowed. But the argument will simply remove it for the given user 0, which is likely the primary user profile you're using if you don't have multiple user profile on your Android device. [It is certainly a thing](https://source.android.com/docs/devices/admin/multi-user).

This means the app's files aren't actually removed from the system partition which is read-only by default so you won't save storage space by doing this, but to you the app is basically gone and will likely not reappear. However they will reappear if you do a factory reset if you happen to remove something very important, so the process is reversible. With great power comes great responsibility.

If you happen to want to uninstall Google Play Services, you'll likely run into permission errors due to the fact that it is enabled as a "Device admin" app by default for the "Find my Phone" feature. You will have to go into the special app access menu in the Settings and disable it before it can be uninstalled.
