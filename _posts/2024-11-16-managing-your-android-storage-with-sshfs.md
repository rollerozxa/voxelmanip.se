---
title: Managing your Android storage with SSHFS
tags: Android Guide
cover_alt: Screenshot of the root of my Android phone's external storage as mounted through SSHFS.
---

As you're on your phone you may be downloading memes, files, taking pictures, writing notes and whatnot. But after a certain point you'd want to go through these and move anything you want to keep to your computer since let's face it, your phone is not for permanent storage.

This blog post shows you how to mount your storage so you can manage it from your computer using SSHFS by running an SSH server on your phone, as well as the motivation for why I manage my phone's storage this way rather than other traditional methods one may otherwise use.

<!--more-->

## The traditional way
Usually what you would do is simply connect your phone to your computer via a USB cable. Most of the case your phone's charger should be modular where you can pull out the cable from the AC adapter and get a male USB-A port you can plug into your computer. Then you will get some kind of notification on your phone that allows you to enable file transfer which shows up as a new storage device on your computer.

When you connect this way and enable file transfer it does not act like you may expect with a regular USB thumbdrive. Instead it uses the Media Transfer Protocol (MTP) in order to access the storage of the device.

In my experience this protocol is probably one of the worst things ever created (and as all bad things, it was originally implemented in Windows and then spread to everything else to end up becoming a standard). It is rather clunky, and I have had occurrences in the past where copying, moving or deleting files would end up messing up something else, both on Windows and Linux and not limited to the storage of a single device.

Plainly stated, I do not want to use MTP for anything I care about.

## The tools
Here's a list of the tools I'll be using:

- [`sshfs`](https://github.com/libfuse/sshfs), which uses [FUSE](https://en.wikipedia.org/wiki/Filesystem_in_Userspace) to mount a remote filesystem accessible over SSH (SFTP) and make it browsable like any other filesystem. FUSE is generally a Linux-only thing, but if you are on Windows there is apparently [a port of `sshfs` for Windows](https://github.com/winfsp/sshfs-win). I haven't tested it, but could be useful.

- [Termux](https://termux.dev/), a very powerful terminal app for Android you can download from F-Droid. It includes a package manager with a large repository of packages that have been built to run inside of Termux, including OpenSSH [for running an SSH server on your phone](https://wiki.termux.com/wiki/Remote_Access#Using_the_SSH_server).

- `adb`, the Android Debugging Bridge which is a part of the [Android SDK platform tools](https://developer.android.com/tools/releases/platform-tools) and can be used with connected devices that have USB debugging enabled.

## Setting up an SSH server
Open Termux, run commands to update packages and install OpenSSH:

```bash
pkg upgrade
pkg install openssh
```

You'd also want to set the password in Termux. This is what you'll be inputting when connecting over SSH.

```bash
passwd
```

To start OpenSSH in Termux you just run `sshd`. Just like that:

```bash
sshd
```

(And to later shut down the SSH server, say if you are going outside and don't want an SSH server running on your phone that every silly individual connected to the free Wi-Fi networks you use can try poking at, you run `pkill sshd` to kill the process)

I don't know what the username in Termux is supposed to be or if it is consistent between all devices, but to see your username in Termux run `whoami`. For me it is `u0_a172`, but if it is different then substitute it in the below commands. The default port of the OpenSSH server in Termux is also 8022 instead of the standard port 22 for SSH.

By now you could connect to the internal IP of your phone (see `wlan0` in `ip addr` of Termux), but I'm already at my computer so I have my phone plugged in via USB! Wouldn't it be nice if the connection could go via USB rather than wirelessly through Wi-Fi? Enter ADB port forwarding.

## ADB port forwarding
The default port of Termux' sshd is 8022, so you can simply port it forward so you can access it from `127.0.0.1:8022` with this command (every time you connect your device you'll need to redo this step):

```bash
adb forward tcp:8022 tcp:8022
```

At this point you should be able to connect via SSH by connecting to `127.0.0.1` with the port 8022.

```bash
ssh -p 8022 u0_a172@127.0.0.1
```

You should be able to see Termux' MOTD and prompt show up. It's cool, but Ctrl+D to disconnect, because we'll be using SSHFS instead. Create a folder and mount it there:

```bash
mkdir -p phone_storage
sshfs -p 8022 u0_a172@127.0.0.1:/sdcard/ phone_storage
```

It will now be mounted into a new folder called `phone_storage`. As the root directory I chose `/sdcard/` which should put you right at your external storage (Even if you don't have an SD card, Android will still "emulate" an external storage like it would be on an SD card)

I have not actually benchmarked SFTP forwarded over USB compared to MTP, but it has been quite responsive and not too slow when copying over lots of photos from my phone. If anything, it is a very nerdy way of managing your Android storage, and that is enough for me.
