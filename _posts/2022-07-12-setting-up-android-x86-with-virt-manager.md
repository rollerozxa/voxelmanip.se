---
title: Setting up Android-x86 with Virt-Manager
cover_alt: Screenshot of Apparatus running under Android-x86
redirect_from: /2022/07/12/Setting-Up-Android-x86-With-Virt-Manager/
---

Android-x86 is a project which aims to make a flavour of Android that is suitable to run natively on any regular x86-based desktop computer. It might therefore be a good option to use Android-x86 in a virtual machine you want to run Android apps on Linux, and find other options such as Anbox to either not work with your app of choice or you simply do not meet the system requirements to run Anbox.

This post will show you how to set up an Android-x86 virtual machine on Linux using Virt-Manager, a GUI frontend for QEMU, and configuring it for optimal performance and *coolness*.

<!--more-->

## First things first...
Make sure you have Virt-Manager installed and properly set up. The [Arch Wiki article](https://wiki.archlinux.org/title/Virt-Manager) and [this video by DistroTube](https://www.youtube.com/watch?v=p1d_b_91YlU) should be enough.

Some caveats you might run into is that Virt-Manager can't find QEMU, which can be solved by starting the `libvirtd` daemon which may not automatically start. If you get an error saying the network is inactive, try running `sudo virsh net-start default` which will start up the networking setup. (and do `sudo virsh net-autostart default` which should automatically start it in the future)

## Getting started
Go to [android-x86.org](https://android-x86.org) and download the latest ISO. If your processor is recent enough to support SSE 4.1 you should use the 64-bit version. However if you are on an older 64-bit processor that doesn't support such extensions you should use the 32-bit version, otherwise you will get a blank screen on bootup.

Then, press the "New VM" button in Virt-Manager and follow the wizard, picking the ISO you just downloaded and selecting "Android-x86 9.0" (or equivalent) as it may not give this option automatically. When at the end of the wizard, be sure to check the box that asks if you want to further configure the virtual machine before installation.

## Configuration & Installation
By default, Virt-Manager/QEMU will use the QXL video model. While it's perfectly fine in a pinch, it does not use 3D acceleration and we could do better. Quite a lot, in fact.

Go to the 'Video' tab and switch the model from QXL to 'Virtio' and enable 3D acceleration. Then in the 'Display Spice' tab set 'Listen Type' to 'None', check the OpenGL checkbox and select your graphics card in the dropdown that appears. What this does is make use of your graphics card directly for accelerated rendering rather than using a slower, virtualised graphics driver like QXL, effectively giving you the closest to bare metal graphics performance without directly passing through your entire GPU.

Then, press "Begin installation" and it will boot up to the Android-x86 ISO boot menu. Go down to the option that will install Android-x86 to your harddrive.

When coming to the screen that asks you to choose the partition, pick 'Create/Modify partitions', select 'No' to whether you want to use GPT, and create one primary partition that is the size of the entire virtual disk you created. Mark it as bootable, and then write to disk.

When formatting, pick `ext4` and answer 'Yes' to installing GRUB. When asked if you want to make the system partition read-write, answer no unless you really want it as it will make the Android system take up more space.

When done, reboot! Virt-Manager should automatically unmount the ISO and you will boot up into the installed GRUB.

## Post-installation tips

### Installing APKs using ADB
When using the default network device, there should be a virtual WiFi network called 'VirtWifi' you can connect to. To get the VM's IP address go into the terminal emulator app, type `ifconfig` and you should see the address somewhere right under `wlan0` as such:

```
wlan0	Link encap:Ethernet HWaddr ff:ff:ff:ff:ff:ff
		inet addr:>192.168.221.51< ...
```

Then on the host machine connect with adb (`adb connect 192.168.221.51`), install whatever APKs you want to install, and they will show up in the VM.

### ARM Emulation
By default, you will only be able to run apps either written entirely in Java or apps that have x86 native libraries available in its APK. You can check this by opening up the APK in a file archiver program and look inside of the lib/ folder. If there is none, it is entirely written in Java and can run perfectly fine, but if there is you'll need to see if there is an `x86` folder (if your VM is running 64-bit Android it can use a native `x86_64` library, otherwise it will fallback to `x86` if it exists).

If there is an app that only contains ARM native libraries, you can try your hand at getting ARM emulation working through `libhoudini`. Android-x86 is supposed to support it through an option in the Android-x86 settings page, although I was unsuccessful in getting it to work as the website offering the downloads looked to be down. Your mileage may vary however, and I may revisit this in the future if I ever get it to work.
