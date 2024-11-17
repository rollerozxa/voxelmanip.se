---
title: Turning a Chromebook into a Chrultrabook
tags: Storytime Linux
cover_alt: Photo of the screen of ROllerozxa's Chromebook showing the hyfetch output after it was corebooted and running Arch Linux. The wallpaper is Kirby swimming underwater.
---

**Chromebook** is the name of Google's brand of mostly low-end laptops running Chrome OS, an operating system whose primary functionality is running the Google Chrome browser.

When I finished 9th grade and went onto Gymnasiet, I had the option to keep the Chromebook I was given for the past three years at school. Since I had been keeping good care of it for the past years I was using it, why not? I knew that once it gets unlocked I will have access to the containerised Crostini Linux environment, but I was not aware at the time of the ways one can fully install another operating system on it.

<!--more-->

My journey of liberating Chromebooks wouldn't have been possible without the help of the [Chrultrabook Docs](https://docs.chrultrabook.com/) as well as the utility script and firmware images provided by MrChromebox. This blog post isn't meant to replace their documentation but to tell a story, and if you want to do this yourself with a Chromebook you should read their guide on how to do so.

## The end of a Chromebook's life
To a normal person, the end of a Chromebook's life is usually when Google drops support for the device in Chrome OS, which could be as short as just 5 years. They will send out a notification telling you that the device is out of support, you will not receive any further updates to the operating system or the bundled Chrome browser. On the EOL page, they basically tell you to purchase a new Chromebook and/or drop the old one off at your nearest recycling center. Too bad, so sad.

But to a technical person this is far from the end of a Chromebook, merely the beginning of a new life for it. For more or less all x86-based Chromebooks, there are multiple ways of running a custom operating system other than Chrome OS on it breathing life into a laptop that still has decent enough hardware but that was declared obsolete by Google.

As Chromebooks are very popular in schools and other educational institutions, they also have a lot of used Chromebooks for students that have graduated or otherwise do not need it anymore. And even if they put used devices back into circulation for new students, once a device's end of life date passes after some years there is generally nothing the school's IT department can do with it. So you basically have a steady flow of Chromebooks flowing out of these institutions that, to them, are effectively e-waste they sometimes even need to pay to dispose of. But you know that they can still be very much of use, given that you find one that has been well taken care of.

## Prequel: RW_LEGACY
The default Chrome OS bootloader for x86-based devices has a special area containing a SeaBIOS payload allowing for booting a custom operating system off of an USB drive or other external storage medium. It is rather limited, not supporting UEFI and requiring you store the custom OS on an external storage medium connected to the Chromebook, but it is an enticing option to start out with as it requires no disassembly and no flashing of the main bootloader firmware.

The first order of business when doing anything with a Chromebook (!!That you yourself own!!) is enabling Developer Mode on it. It's a quite simple process consisting of [entering into Recovery Mode](https://docs.chrultrabook.com/docs/firmware/recovery-mode.html) and either disabling something called "OS Verification" or enabling Developer Mode. It will wipe any existing data on the device, but hopefully you haven't put anything important on the Chromebook anyways.

{% include image.html
	name="transitioning_developer_mode.webp"
	alt="The screen that comes up when enabling Developer Mode. It says 'Your system is transitioning to Developer Mode. Local data has been cleared.', and some warnings about no support and no warranty."
	caption="My system is transitioning? Well good for them!"
	max_width=700 %}

While Chromebooks already come with a payload in RW_LEGACY, it may be outdated or unusable for actually booting something. Thankfully it can be updated [using MrChromebox's firmware utility script](https://docs.chrultrabook.com/docs/firmware/flashing-firmware.html) and you can get to it by pressing Ctrl+L on the obnoxious "OS Verification is off" screen where a boot option menu appears.

I chose a 32GB USB flash drive I had laying around to install Arch Linux onto, and plugged in another USB drive with an installation medium. While regular non-SSD based USB flash drives are generally terrible for booting an OS off of as they focus more on sequential write speeds rather than random access writes, it is not as much of an issue booting Linux on it compared to Windows To Go which will absolutely hammer your flash drive with writes.

Once installed I do what I usually do when I have a piece of hardware with a screen and some reasonable graphics capability - Run [Principia](https://principia-web.se) on it, along with some other things.

{% include image.html
	name="chromebook_folded.webp"
	alt="Image of the Chromebook running Principia inside of KDE Plasma. The keyboard has been folded all the way back so it acts as a tablet, and there is an USB stick protuding from the left side of the screen."
	caption="It both has a touchscreen and can be folded all the way back allowing it to act like a tablet."
	max_width=920 %}

While it was already running fully featured Linux, it was doing so off a USB drive which you need to keep plugged in at all times, and you also need to specify it each time in the boot menu when booting the Chromebook. Great novelty, but we can do better! In addition to booting an external OS with RW_LEGACY, you can also flash the bootloader entirely with a custom Coreboot image, allowing you to wipe it clean of Chrome OS and install any operating system you would want to the internal drive. The ultimate Chrultrabook.

I wanted to get around to doing this full bootloader flash one day but until then it was sitting on the shelf alongside the USB drive and charger. At least, until a very special person came into my life.

## A sweetie appears
In February I got an email from someone who had come across me on Mastodon. They were living in Sweden, likes FOSS, and also mentioned the fact they had flashed Coreboot on multiple of their computers. We began talking over Matrix and among the first things I began talking about was this Chromebook I had gotten regular Linux booting off an USB drive using RW_LEGACY. I then mentioned that I wanted to sometime in the future flash the main UEFI bootloader to allow for booting regular Linux off the internal drive. With Coreboot.

A month or so after that we were in a relationship. I clearly have the Chrultrabook rizz.

## The Coreboot date
The first time we met in real life was in early July of this year, travelling across the country on my own for the first time. I had also suggested that I could bring with me my Chromebook to flash Coreboot on it as a little project to do together, which we thought was a good idea.

By default the more sensitive parts of the Chromebook storage are locked from writing by the regular user, such as the bootloader and core parts of Chrome OS. In order to flash your own bootloader and fully install a custom operating system to the internal drive you will need to break this write protection, and there are various methods you will need to do this depending on the device.

In my device's case, the battery connection is used to control the write protection state. So to disable write protect, you need to disconnect the battery and then boot it off of external power to flash the bootloader. This was easier said than done, and meant disassembling the laptop down to the core to be able to disconnect the battery, partially assembling it enough that the basic hardware components were functional to be able to boot into Chrome OS and flash the bootloader.

{% include image.html
	name="chromebook_internals.webp"
	alt="Fully disassembled Chromebook with both sides of it lying on a table."
	caption="The operation table, my SO's very small desk"
	max_width=700 %}

My SO's iFixit Toolkit was very useful for taking stuff apart and we also found a teardown video on Youtube for this particular model, it took some time to get it stripped down to the battery connector but eventually we did it. At which point we disconnected the battery and reassembled the minimum necessary to get it to boot again.

Once booted into Chrome OS, I went into a text TTY instead of going through the setup process for Chrome OS and ran MrChromebox's firmware utility script in there. Now that the battery was disconnected, the bootloader was now showing as writeable, allowing me to flash the custom Coreboot image provided by MrChromebox onto the bootloader.

It prompted us to make a backup of the previous firmware which we did (my SO has experience with externally flashing Coreboot onto devices so it was worth having a recovery plan), and when I accepted the final warning about flashing the firmware being *serious business* it began flashing Coreboot.

I was sitting in my SO's lap while running the script, so we hugged while it was installing the new firmware which took a bit of time. When the Chromebook was rebooted, we were greeted by the Coreboot rabbit. Success.

{% include image.html
	name="coreboot_bootup.webp"
	alt="The Coreboot logo shown on an otherwise black screen."
	caption="Never been so happy to see a rabbit." %}

Once you have flashed the custom Coreboot firmware, the default Chrome OS installation becomes unbootable. Though this doesn't really matter since you probably want to wipe it clean if you're doing this anyways. So I went to grab an USB drive I had prepared with an Arch Linux installation medium, and proceeded to install Arch onto the internal drive.

It was functional, but it was still half disassembled and with a disconnected battery. So once we knew everything had gone well we shut it down, disassembled it down to the battery to plug it back in, and then fully reassembled it to its original state.

My Chromebook had now become a Chrultrabook.

## Turning a Chromebit into a Chrultrabit
I have an ASUS Chromebit CS10 lying in a drawer, essentially a Chromebook on a stick you can plug into any HDMI port such as on a TV. It never seems to have been much of a success, and Google has since dropped support for it in Chrome OS.

The Chromebit is ARM-based, which usually may be a death blow for liberating a Chromedevice, but the Rockchip RK3288-based device has support by Libreboot and [Arch Linux ARM](https://archlinuxarm.org/platforms/armv7/rockchip/asus-chromebit-cs10) has a whole page with installation instructions. It sounds like a promising endeavour.

So one day it too will be liberated, in a sequel to this blog post.
