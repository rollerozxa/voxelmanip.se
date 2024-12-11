---
title: 5 Useful Command-line Utilities
tags: Listicles Terminal
cover_alt: Terminal output from openmpt123
redirect_from: /2022/03/08/5-Useful-Commandline-Utilities/
---

I realise I need to make more clickbaity, more digestible blog posts so I will now expand into the territory of Top 5 lists. This is how you do it right?

The Linux terminal is an extremely powerful tool, allowing you to access and control your entire system just by typing commands. In addition, there exists a seemingly infinite amount of command-line utilities. What characterises all of these are just how lightweight they are, while not compromising in its power and flexibility.

<!--more-->

## 5. tldr
`tldr` is a lovely utility to get a crunched down version of the manpage for basically any command you could want. It contains real-world examples of how you would use commands along with a description of what it does. There are of course some obscure commands that do not have descriptions, but they are open for anyone to contribute to, so feel free to!

## 4. gitui
`gitui` is a really nice and lightweight interactive CLI Git client. You can easily see file diffs and manage them, choosing to only stage certain lines, hunks, or discarding some of them. Full branch and remote management is also included. A definite choice for people who work with Git version control on a day to day basis.

## 3. yt-dlp
`yt-dlp` (formerly known as `youtube-dl`) is an extremely powerful program written in Python that allows you to download every kind of multimedia off websites. While its flagship feature is of course downloading from Youtube, it supports [over a thousand different additional sites](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md) from Soundcloud to Reddit. `youtube-dl` is the original project, but has significantly decreased in activity after the RIAA lawsuit, `yt-dlp` is a new fork where all the development happens. Don't play Finnish roulette finding an online Youtube downloader, just learn to use `yt-dlp`!

Describing the syntax for `yt-dlp` is certainly out of the scope for this blog post, but you can use a beforementioned utility to learn the basics of it. (hint hint ;) Just pasting quoted URLs as the argument should also be enough for the most basic of usecases.

## 2. micro
`micro` is, in case you haven't made the connection already, a text editor meant to be a better version of the nano text editor. It is actually really cool, and its copy-paste and cursor functionality is more similar regular graphical text editor. It's a clear upgrade from nano and is a no-brainer not only for editing over SSH connections but also for lightweight text editing even in a graphical environment. It even has plugin support and contains a repository with lots of useful installable plugins to extend it even more. I'm writing this in micro right now, even!

## 1. openmpt123
I very much like tracker music, so when I learnt that libopenmpt has a command-line music player I was absolutely overjoyed. It has the same compatibility as OpenMPT/libopenmpt, and you might even have it installed as it comes bundled with the `libopenmpt` package which many programs that support tracker music use. Otherwise you can just install the `libopenmpt` package from your package manager. If you want it to look even cooler, you can even pass the `--pattern` argument to show the song pattern as it's being played!
