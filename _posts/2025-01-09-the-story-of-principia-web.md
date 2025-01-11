---
title: The story of principia-web
tags: Projects Web
cover_alt: Screenshot of the front page of principia-web.se, showing the navigation bar and the featured levels at the time of the screenshot.
---

[principia-web](https://principia-web.se/) is two things: it is both an open source implementation of a Principia community site that can communicate with the client, and it is the name of the new Principia community site. While Principia is now [an open source project](https://github.com/Bithack/principia/) with the source code being available for everyone to read and understand how things work, when I started working on principia-web in late 2019 this was far from the case.

Back then, it was still an abandoned proprietary game with little to nothing known about its internals, file formats or how it interfaced with the community site. The official community site had shut down in early 2018 and the remains of the community resided in a small Discord server, which I was a part of. But I was determined to take on this project, which I did not fully know the scope of at the time, and create a new website for the community to upload and share Principia levels.

<!--more-->

This is the story of principia-web, how it came to be through reverse engineering efforts, and what it has since turned into with the Principia open source project.

## The communication protocol
In order to create a reimplementation of the community site, the communication protocol of course needed to be studied first of all.

When the Principia client communicates with the server it does so by sending either GET or POST HTTP requests, using everyone's favourite `libcurl`. There was no encryption and no real obfuscation apart from obtusely named endpoints such as `/apZodIaL1/xx.php`. This made it fairly easy to edit the `hosts` file to point `principiagame.com` to localhost and vacuum up any and all requests it makes.

Some of the very early reverse engineering efforts such as logging in from the client and playing community levels were aided by Artemking4, but after that point I was mostly on my own. Generally, it was like working with a complete black box that spit out a result, and trying to construct a proper response that the game would accept. But I would also use [Cutter](https://cutter.re/) and its Ghidra decompiler plugin to disassemble the executable, search for the name of endpoints, and try to parse Ghidra's reconstructed C (pseudo)code to get some hints about how to reimplement the endpoint in principia-web.

{% include image.html
	name="login_code_cutter.webp"
	alt="Screenshot showing reconstructed C pseudocode from the client's login functionality. Most of it is not very comprehensible, but there is a string for the login endpoint, and some other strings for the values in the form that it submits."
	caption="Aha! I totally know what all of this does. (Maybe not.)" %}

As mentioned, the login endpoint `/apZodIaL1/xx.php` was one of the first that got implemented with Artem's help. It would send a form with the `username` and `password` fields, along with a peculiar `cPa1Ozi` field with the value of `Submit  ` (with two spaces!). Obviously, that was a little bit of security through obscurity to make it harder to send automated login requests. When sending the request, the game reads the content of the response as an integer and decides what to do based on it. For successful login, the server should respond with `100`, or `103` for if the credentials were invalid. The error messages that show up would then be hardcoded into the game to show up on particular codes responded from the server.

When a successful login is made, the server should return a authentication cookie that the game can send for subsequent requests to e.g. edit or upload a level. As Principia was originally a proprietary game, upon login it does a license check based on the cookies returned by the server. I never figured out how exactly it works (and at this point it doesn't matter, as it's been long ripped out from the open source release), but it relies on three cookies from phpBB that it then does something with to determine if the user has bought Principia or not.

```
#HttpOnly_.principiagame.com	TRUE	/	FALSE	1551164781	phpbb_ziao2_u	<snip>
#HttpOnly_.principiagame.com	TRUE	/	FALSE	1551164781	phpbb_ziao2_k	<snip>
#HttpOnly_.principiagame.com	TRUE	/	FALSE	1551164781	phpbb_ziao2_sid	<snip>
```

After the community site's shutdown making it impossible to activate the Windows version of the game, users began passing along the game's cURL cookie jar file (simply called `c`) which contained the cookies of someone who owned Principia. If you copied this file into the game's user data, it would get activated on next startup. Obviously, I received this file from another community member too when I was trying to activate a new install of the game. So I thought that if I made principia-web respond with these garbage cookies in addition to a proper authentication cookie, [I could trick the game into automatically activating itself](https://www.youtube.com/watch?v=BK830v2feGs).

## Reverse engineering formats
At a certain point, it became necessary to reverse engineer certain file formats related to Principia. One example being the `fl.cache` format, which stores the featured level data for the main menu of the game along with a list. As it is cached by the client, I already had a copy of the featured levels as it were before the official community site shut down.

{% include image.html
	name="featured_level_hex.webp"
	alt="Screenshot of a hex editor showing an excerpt of the featured levels file format. You can make out some strings such as a level title, level author and the magic JFIF header for JPEG images."
	caption="Excerpt of how a featured levels file looks in a hex editor." %}

So as such, I sat down with a hex editor and [painstakingly documented the file format as a Kaitai file](https://github.com/principia-game/kaitai/blob/master/kaitai/featuredlist.ksy), using cues such as text strings and the magic JFIF header to figure out what was contained within the file. Once I had fully described the file format, [I wrote a small Python script](https://github.com/principia-game/featured-list-creator/tree/169474bec144c3a6ea4a48825ec67aefade6c8f2) to generate a featured levels file from a JSON file and accompanying JPEG images.

In order to extract information from levels uploaded to the site it was necessary to fully document the level header format. This was because the client will only send the level file in the request along with cookies to authenticate the user uploading it, no other metadata about the level is sent separately. Fortunately, this was the rare instance where I wasn't working completely blind.

One of the people who had worked on the game back in the day had published a function which described the size of the level header based off of which level version it was (it can now be found as `lvlinfo::get_size()` in the source code). It also included very helpful comments describing what everything was for, so it was fairly trivial to [transcribe it into a Kaitai file](https://github.com/principia-game/kaitai/blob/master/kaitai/plvl.ksy) which then could be used to generate a parser function for principia-web.

Some of these things may seem trivial now that the full source code is available, and the format and behaviour of things can be easily seen just by reading the fully source code, but at the time these were quite big steps in being able to recreate a server that would be able to communicate with the game. While there are some fields I had previously denoted as unknown whose purpose now is known, most of this work still holds up after the source code released and is still used by principia-web to this day.

## The site goes public
At around the end of 2020 I felt that the development of principia-web was coming along well enough that a usable test site could be set up to allow for people to test it and begin uploading levels like you used to.

For hosting the site, I chose to self-host it using a Raspberry Pi I had gotten earlier that year. Because it was only really meant to be for testing, right? I installed the headless version of Raspbian and set up principia-web on it. Registered `principia-web.tk` through Freenom, which nowadays doesn't even exist as a registrar anymore, and ported forward port 80 in my router. Now everyone can access principia-web, running on a Raspberry Pi sitting right on my desk.

{% include image.html
	name="raspberry_pi.webp"
	alt="Photo of a Raspberry Pi sitting on a desk right next to a router. There is a ridiculously long Ethernet cable connecting the two, and a power cable for the Raspberry Pi which goes outside of the photo. To the left is a tiny part of the bottom right screen area of a monitor, showing 2020-12-25 12:19:20 on the clock in the taskbar."
	caption="Raspberry Pi sitting right next to our old router, connected with a ridiculously long Ethernet cable."
	max_width=600 %}

Initially I had only made a way for the Windows version to connect, by using a custom cURL build that would redirect requests to the official community site's domain to my domain, distributed as a DLL you replace the original libcurl DLL with. But as a significant portion of the playerbase are on their Android phones, I had to figure out a way to make a mod for the Android version too for it to ever get off the ground.

Of course since everything was statically linked into a single native library in the APK (grumble grumble) I couldn't simply replace cURL like I did on Windows. Instead I had to do binary find-and-replace for all strings inside of the APK's native libraries. Thankfully the new domain `principia-web.tk` was not longer than the old `principiagame.com`, so it was relatively easy to make a list of URLs in the binary and replace them with the corresponding new one.

I signed the APK, and linked to it in the Discord server. People were interested, they went onto the website, registered, uploaded levels, played levels. Shortly after I quietly removed the "TEST SITE" banner and [replaced the old test site announcement with a new one](https://principia-web.se/news/1). Principia was back.

## Running in production
Once it was public, all bets were off. I would constantly make fixes and updates as the site was being tested in a production setting. I also began going around to tell everyone that Principia is unofficially back, linking to the Discord server we had in the comments section of Principia videos on YouTube and other places where old community members may lurk.

In general, it was a very rewarding experience. Players, new and old alike, came back to see a new community site take shape unofficially developed by the community, and I was the one who had made it all happen.

But of course not everything was all fun and games, because when you're hosting and maintaining a complex website there will always be bad actors who want to disrupt it. After a couple months of operation principia-web received its own DDoS attack.

{% include image.html
	name="logstalgia_ddos.webp"
	alt="Screenshot of Logstalgia visualising a DDoS attack. It is a lot of balls representing requests flowing from various IP ranges all converging at a single point labelled '/index.php'."
	caption="(This screenshot isn't the first DDoS that occurred, but it is a screenshot of one I made a Logstalgia visualisation out of, <a href=\"https://www.youtube.com/watch?v=i0w7NgHNoy4\">available to watch on YouTube</a> with some severe bitrate artifacts.)"
	max_width=640 %}

At the time I was still using Apache and the site immediately caved to the massive influx of requests. The kid who was doing it felt very good about himself too and would egg me on in the Discord server pretending to just be a regular person wondering why it was down. I however realised what was going on after some time, and they were swiftly banned.

A short while later I switched to nginx, which both can absorb an influx of requests and also has built-in support for configuring rate-limits. The site has received many DDoS attacks since from unknown actors, but none of them has actually managed to bring it down ever since the first one.

In spring of 2022 I felt that the site had outgrown being hosted out of my home, and I ended up moving principia-web onto a small VPS hosted at OVH in Germany. This is where it is still hosted to this day, along with some other things such as [Voxelmanip Classic](/projects/voxelmanip-classic/) and this blog.

Around the same time I also decided to get a proper domain name. Two in fact, `principia-web.se` and `voxelmanip.se`. One for moving principia-web off of the free domain provided by Freenom and one for doing other things with, which ended up being where I moved my personal website and blog to while also using the domain as a place to host other projects under as subdomains.

For the most part, things were doing fine at this point. But one thing was nagging at me, as well as a lot of other people in the community. The Principia source code.

Principia was actually intended to be fully open sourced under the BSD 3-Clause license all the way back in 2016. Unfortunately the plans for it fell through at the time, and while there had been small mentions throughout the years, in spring of 2022 the game's source code has still not been released.

To be honest, I had somewhat lost hope in it ever happening after exhausting most non-invasive options of establishing contact with the original game's author, but in my work on principia-web and other Principia-related things I always dreamt of it truly becoming open source one day such that it can truly flourish again. Little did I know that summer was going to hold a big surprise for me, and the rest in the community.

## Principia goes open source
One day in August 2022 a user by the name of 'sdac' joined the Principia Discord server. At first I didn't think it was real, but after some time of him looking around he introduced himself. The original author of Principia. To show that he was the real deal, he made a page on the Bithack website with his Discord username. It was happening.

The next day, the anticipation was rising as sdac was currently making sure that the game builds for Windows before releasing the source code. Once it was pushed and released, I cloned it almost immediately and began trying to build it for Linux. With some tweaks to the build system, it managed to successfully compile.

I likely ended up being the first person outside of Bithack to ever run the game natively on Linux. We had been running the Windows version of Principia under Wine for some time, but this was the real deal. Running natively, Free and open source to go along with it. It was truly a momentous occasion. I even made a video recording out of the compilation process afterwards [which you can watch on YouTube here](https://www.youtube.com/watch?v=bWOgsHDQj7A).

{% include image.html
	name="principia_first_linux_build.webp"
	alt="Screenshot of the native Linux version of Principia, at the main menu. There is a terminal to the left showing debug output."
	caption="Success!"
	max_width=1000 %}

## So it's open source, what now?
Now that the game was revived as open source, the question of the community site came up. At the time I had been running principia-web for a year and a half, and sdac really appreciated the work I had done at that point to try to revive the game on my own and didn't want to interfere with a new community site run by the community. In the end, I kept running principia-web, and it became the primary community site that the open source version of Principia uses.

As for the old levels from 2013 to 2018 that were on the old official community site, it was decided to make them available on a separate website, which could be played with the new open source version of Principia once we allowed for playing levels from any domain. Originally sdac was hosting the archive itself and it was essentially the official community site made read-only but when we switched to HTTPS for the game's networking, the decade old server setup that did not support HTTPS meant the archive became unavailable for players.

I subsequently set up a reverse proxy on my server that would offer HTTPS support while communicating with the archive, but after a certain point I ended up scraping the archive and set up my own archive with the publicly available data. [You can read more about it in this blog post](/2024/08/25/archiving-the-archive/), but the result was essentially a stripped down fork of principia-web that would serve the historical collection of levels in this new archive.

With the open sourcing of Principia, I was able to finally compare my reverse engineered notes against the proper behaviour. While there were some things I discovered were completely incorrect, such as my assumptions about how the game handles IDs for uploaded levels to allow for uploading updated revisions of the same level, most things actually held up.

In addition to this I was also able to improve and implement many things that were previously out of reach. The [special screenshot build of the game](https://principia-web.se/wiki/Screenshot_Build) used to automatically take screenshots of levels uploaded to the community site was made available to me, as well as tools to properly handle editing level metadata and retrieving level highscore submissions which were integrated into principia-web.

But as well as continuing to work on principia-web, I became a significant contributor to the Principia open source project and was after a while offered to become the project maintainer of it. I guess it wouldn't come as much of a surprise, and I of course accepted it.

## Current day
As of the time of writing (January 2025), principia-web has been running for about four years now, and I have been working on it on-and-off for over half a decade. It has been a wild ride ever since the beginning and it has taught me a lot about a wide range of topics, from reverse engineering to various areas within frontend and backend web development. If I had (re)written principia-web today from scratch things would have likely looked very different, but the codebase has also seen some refactors over the years and grown alongside me in some ways.

Depending on the statistics you look at for measuring development activity, you may think it has slowed down over the years. While it is true that the wider Principia open source project has taken away my focus solely on principia-web, there is a lot else that has gone into running principia-web that goes unnoticed in commit history, general day-to-day server maintenance and checking in so that things work as they should.

Now in retrospective, branding the community site itself under the `principia-web` name might have been a mistake. But looking at other revival servers' naming schemes, it could also have been much worse, e.g. Principia Community Site Rewritten (abbreviated "pcsrewritten"!). The name is a throwback to its creation and original goal of simply being an unofficial revival of a game thought to be long since abandoned, and I never expected it to have such a staying power. While I have progressively begun to phase out mentions of it in favour of either "Principia" or "the community site", it will realistically always live on in the address bar as `principia-web.se`.

### Final thoughts
It almost feels like it was destiny for me to make principia-web. Having originally discovered Apparatus sometime in 2011 and receiving the full game for Christmas in 2012, I then got Bithack's sequel Principia for Christmas in 2013. I was 9 years old when I got Principia that Christmas morning, and now I am 20 years old. I grew up alongside Principia, it has shaped my interests and career, and most importantly I took up the mantle when the game needed it the most.

When talking to sdac after the open source release, he was curious to know what username I had on the old community site. I found my old stuff from back then to be mostly embarrassing and it's something I've for the most part kept in the past. But I told him my old username, and he burst out into excitement. I was apparently a quite well-liked community member among the original development team, and he was happy to see that the kid from back then had grown up and come back to help out the project, thanks to Principia.

I was very happy to hear that.
