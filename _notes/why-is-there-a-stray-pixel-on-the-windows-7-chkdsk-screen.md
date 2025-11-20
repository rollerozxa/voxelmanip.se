---
title: Why is there a stray pixel on the Windows 7 chkdsk screen?
last_modified: 2025-11-20
---

One time back in late 2021 when I was virtualising and booting up an old Windows 7 install in VirtualBox, I noticed what I thought was a speck of dust on my screen. When it did not go away I moved the VirtualBox window around and realised it was actually part of the chkdsk bootup screen.

<!--more-->

The pixel is in the upper part of the screen and a bit to the left of the center of the screen. The exact position of the pixel is (262,36) in a 640x480 resolution, and the hex colour value is `#201817`.

I ended up recording a short video where I took a screenshot of the VirtualBox screen and zoomed in on the pixel in GIMP to show it closer:

{% include youtube.html id="BmYOL1eVus8" %}

And if you want to check for yourself, here is that screenshot I took:

{% include image.html
	url="/media/notes/chkdsk_win7.webp" %}

Asking around in Windows fan communities a long time ago led to a hypothesis that it is a remnant of the old Windows Vista logo that used to be on the chkdsk screen in Windows Vista. When Windows 7 was released, the logo was removed from the screen, but a single pixel from it was accidentally left behind. This seems to make sense, given that it is near where the logo would have been in Vista, but still does not seem to be an exact match (it's a bit too far to the left, checking screenshots on the Internet).

This is a really minor detail and not something I have managed to find mentioned anywhere else online (search results mostly drowned out by actual stuck pixels, tutorials and other pages about chkdsk, and such). If anyone stumbles upon this page and is interested in doing a deeper technical dive into the chkdsk screen's internals to find out more about it, that would be interesting to hear about.
