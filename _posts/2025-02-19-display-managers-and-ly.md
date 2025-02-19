---
title: Display Managers, and Ly
tags: Anecdotes Informational Linux
cover_alt: Screenshot of the Ly display manager at the log in screen. There is green text flowing down the screen in the background, and an ASCII art box is visible in the center containing fields for entering user credentials.
---

A display manager is an essential component in a typical Linux graphical environment. Its origins date to the original design of the X Window System with client and server components that may be on other ends of a network, managing authentication for remote graphical X environments.

However, for modern personal computers running a Linux distribution nowadays, it is simply the intermediate between the initial bootup sequence and starting your window manager or desktop environment of choice, providing local account switching and authentication. It disappears as soon as you log in, and in many cases is seamlessly tied to your desktop environment of choice making you not even notice it.

<!--more-->

## My experience with display managers
For me, the display manager is not really something I have put a lot of thought into. My computers are all practically single-user, and the password protection mechanism is about as useless for securing it as possible when full-disk encryption is not also used.

A password at the display manager screen does set some boundaries, but it definitively wouldn't stop anyone with long-term physical access from inserting a bootable medium and gaining access to the internal drive. Not that anyone ever visits me anyway. Or that I leave the house with my laptop.

It is generally just something I see once a day, type in my password and then that's about it.

## SDDM
Being a Qt and Plasma boy, I used to use SDDM which is typically the display manager that is associated with, and installed alongside KDE Plasma. It's fairly alright, it has rich theming options and for Plasma it has quite nice integration.

But do I really care about it? Well, it gets out of the way after I boot up, and it has the option to switch the desktop environment in a dropdown select if I ever want to do that. The `sddm` package is only 5MB in size or so, and you'll maybe add another theme on top of it, but other than that it was fine enough to not need to mess with it.

## Wayland time!
And then Plasma 6 released, with first-class Wayland support. Always wishing to be an early adopter of Wayland, I switched from the X11 option to Wayland option after updating to Plasma 6 around when 6.0.2 was released.

After testing everything from screen recording to my drawing tablet's input, and everything just finally worked I felt it was ready to finally say goodbye to the full Xorg server. While I of course still have XWayland for programs that still aren't quite there yet (for various reasons), I did not see any reason to keep `xorg-server` itself anymore. So I checked the package to see if there were any remaining packages it required.

> **Required By**: sddm

Hmm, SDDM still uses Xorg. That's unfortunate.

Before this I hadn't really put much thought into my display manager. But thanks to the customisability and modularity of most parts of a Linux desktop environment, I was happy to read (but not really surprised at this point) that you can basically pick and choose anything and it will generally work fine with whatever window manager and desktop environment you use.

So when I was already looking for alternatives, I wanted to try to find one that was as minimal as possible. With led me to find a particular text-based display manager that very much fit that description.

## Ly
> [**Ly**](https://github.com/fairyglade/ly) — TUI (ncurses-like) display manager for Linux and BSD. Supports X and Wayland sessions.

[Ly](https://github.com/fairyglade/ly) is amazingly simple. It does not even launch a graphical environment, but stays in the framebuffer console as an interactive TUI program. It has the few features that probably anyone would need (user switching, selecting the desktop environment, and rudimentary password protection), and some more nice little goodies (Matrix background effect!) without bloating it too much.

Clearly, the best way of not requiring an X server is to simply return to the terminal. It was the perfect choice for wanting to go as minimalist as possible.

I removed SDDM and then installed ly, then set it up as my display manager. I rebooted my computer and I ended up at a very simple, yet functional text interface when it booted up again.

I then dove into the Ly configuration file and did some tweaks from the default setup, resulting in what you saw as the cover image of this blog post.

{% include image.html
	name="ly_screenshot.webp"
	alt="Screenshot of the Ly display manager at the log in screen. There is green text flowing down the screen in the background, and an ASCII art box is visible in the center containing fields for entering user credentials."
	caption="" %}

For me this was just wonderful, and just like that I had swapped out a module of my Linux system with something else in its place.

### Customising Ly
I'm not going to be writing up a full reference of the Ly configuration file here. You can find it in `/etc/ly/config.ini` and you should be able to read it through and configure things to your liking based on the comments in it. And [here](https://gist.github.com/rollerozxa/cee62f0df8ce2112d3440babf4d21228) is the config file I use, a demonstration of which you can see above.

However there are some things not enabled by default that I find to be rather interesting or useful features that are worth mentioning.

Like, you might want the fancy green Matrix text flowing down the screen, which is disabled by default but can be enabled with this line in the configuration file:

```ini
animation = matrix
```

Another nice to have thing that's not enabled by default is the big clock, which tells the time with large ASCII block characters. Nice for telling the time from a distance if it remains on the login screen for any prolonged period of time.

```ini
bigclock = true
```
