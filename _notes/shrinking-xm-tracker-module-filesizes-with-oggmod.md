---
title: Shrinking .XM tracker module filesizes with OggMod
last_modified: 2025-10-26
---

Tracker modules are a form of music that is stored as patterns containing instructions for playing back samples. Generally this will mean the filesize will be substantially smaller than the same song rendered as a regular audio stream, even when using lossy encoding.

However, for traditional tracker formats the samples are stored as raw PCM data, which can lead to large filesizes if the samples are of high quality or if there are many samples used in the module.

<!--more-->

This was the situation I found myself in when I was picking out some music for Tensy. I was looking at a rather nice XM module, but the filesize was a whopping 1.3 MB due to the size of the samples embedded in it.

While looking through the source code for libxmp (used by SDL_mixer for tracker module playback), [I noticed a check in the XM sample data loader for Ogg Vorbis encoded samples](https://github.com/libxmp/libxmp/blob/caa964ff37d20646c1d4a594c76515a55bd2be73/src/loaders/xm_load.c#L740). Intrigued, I began searching for some kind of tool that could convert an XM file to make use of this.

## Cleaning up a module
Before going further, it would be a good idea to try to clean up the module first using OpenMPT. It can remove unused patterns, instruments, samples, etc. which may already lead to a substantial reduction in filesize.

Simply open the module in OpenMPT and then go to "Edit" -> "Cleanup". Click the "Remove all unused stuff" preset and then "OK". After that, save the module again.

In my case, this just reduced the filesize from about 1.3 MB to 1.2 MB. But depending on how many unused samples and patterns there are, it could be a larger reduction. Moving along.

## OggMod and OXM files
The tool you need to create these fancy XM files with Ogg Vorbis encoded samples (called OXM to distinguish them) is called OggMod. After some amount of searching I ended up at [a Polish demo scene site](https://www.modules.pl/?id=soft&sid=21) that had a download link for it. I have also uploaded it to Internet Archive for preservation purposes:

[Download oggmod.zip (archive.org)](https://archive.org/download/oggmod/oggmod.zip)

It's a Windows program but also runs fine in Wine.

Open the program and load the XM file. It will show the list of samples and select the ones that will be converted to Ogg Vorbis format. You can adjust the quality settings as needed (the default quality of 0 is approx. 64kbit), and then start the conversion process.

Once it's done, you can press "Save" to save the new file, which will have the `.oxm` file extension.

In my case, when converting the module I was looking at, the filesize went down from about 1.2 MB to just 360 KB with the default quality of 0. A substantial reduction, and I did not notice any quality degradation when playing back the compressed module (audiophiles may disagree, of course, but the filesize savings were worth it to me).

## Library compatibility
libopenmpt and players that make use of this library (such as OpenMPT and openmpt123) support playing these modules, which is likely not too much of a surprise as they can play pretty much anything.

The beforementioned libxmp also supports these files, but only the regular version of the library. The libxmp-lite version is compiled without Vorbis decoder support and cannot play OXM files.

Other less maintained libraries such as libmodplug do not support XM modules with Vorbis encoded samples, and will play garbage trying to read them as raw PCM data. Tread carefully.
