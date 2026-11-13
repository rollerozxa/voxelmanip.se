---
title: Info-ZIP - Widespread and Unmaintained
cover_alt: The Info-ZIP logo (slightly pixelated with a "90s 3D render" kind of aesthetic) on top of a vibrant orange-purple sunset.
tags: Informational Linux
forum_thread: 186
---

On every Linux system, is it very likely that you have the `zip` and `unzip` commands available. They are so commonplace that you may assume they are part of the GNU coreutils, or some other GNU project such as gzip. However, these utilities are actually part of a project called Info-ZIP, which saw its last stable release in 2009.

In the absence of public announcements from Info-ZIP or a primary third-party fork, Linux distributions have each maintained their own set of patches to address the increasing amount of vulnerabilities and other issues in the tools. However, there is a question of how long this can be sustained as the last stable releases continue to age. It also begs the question, what actually happened to Info-ZIP?

<!--more-->

## History
The ZIP file format was originally created by Phil Katz of PKWARE and Gary Conway of Infinity Design Concepts in 1989, in response to legal issues with implementing the older ARC archive format for PKARC. While PKZIP was the original archiving utility, the ZIP file format spec was public and later released into the public domain. This free nature of the format lead to its widespread adoption in the 90s.

Info-ZIP is the name of a project which provides various free, open and widely cross-platform utilities for working with ZIP archives. While the umbrella encompasses more tools, the most well-known are `zip` and `unzip`, part of Zip and Unzip respectively. The utilities were originally released around the beginning of the 90s (unzip 1989, zip 1992), and saw several updates over the years. However, by the 00s the stable releases begun to slow down, likely as a result of the fact that ZIP was a mature and stable file format by that point.

The latest version of Zip is 3.0 from July 2008. The latest version of Unzip is 6.0 from April 2009. In software terms, this is an eternity. The security posture of critical open source software has changed drastically since then, as has the tools for static analysis and fuzzing for C code developed.

There does exist newer official betas of Unzip and Zip floating around the Internet. The newest ones available on the SourceForge site alongside the official stable releases are Unzip 6.10b from December 2010 and Zip 3.1c from July 2010. Outside of SourceForge there are even newer beta versions with some relation to Info-ZIP, but we'll get to those later. The packages that exist in most Linux distribution are based on the last stable versions from the late 00s.

## But does it even need any changes?
I'm sure this is a good question to ask. The ZIP format has largely stayed the same since 2009, and relatively newer features from the 00s such as Zip64 and UTF-8 Unicode support are supported by the primary `zip` and `unzip` tools. So does it even need any changes?

There is this concept in computing of a program or library which is deemed "complete", to the extent that no changes need to be made to it for the time it remains in use. I do not doubt that such a thing exists, but for open source software which is written in languages such as C and accept complex binary file formats - sometimes from untrusted sources! - that is a naive concept. There will always be another bugfix, another CVE patch, another adjustment to the packaging.

Info-ZIP is no different. Specifically Unzip is the most dangerous given that it often runs on untrusted input, potentially ZIPs coming from the Internet, maybe even running on a server. In the time since the last stable update there has been a huge list of vulnerabilities discovered in Unzip:

- [CVE-2014-8139](https://nvd.nist.gov/vuln/detail/CVE-2014-8139)
- [CVE-2014-8140](https://nvd.nist.gov/vuln/detail/CVE-2014-8140)
- [CVE-2014-8141](https://nvd.nist.gov/vuln/detail/CVE-2014-8141)
- [CVE-2014-9636](https://nvd.nist.gov/vuln/detail/CVE-2014-9636)
- [CVE-2014-9913](https://nvd.nist.gov/vuln/detail/CVE-2014-9913)
- [CVE-2015-7696](https://nvd.nist.gov/vuln/detail/CVE-2015-7696)
- [CVE-2015-7697](https://nvd.nist.gov/vuln/detail/CVE-2015-7697)
- [CVE-2016-9844](https://nvd.nist.gov/vuln/detail/CVE-2016-9844)
- [CVE-2018-18384](https://nvd.nist.gov/vuln/detail/CVE-2018-18384)
- [CVE-2018-1000035](https://nvd.nist.gov/vuln/detail/CVE-2018-1000035)
- [CVE-2019-13232](https://nvd.nist.gov/vuln/detail/CVE-2019-13232)
- [CVE-2021-4217](https://nvd.nist.gov/vuln/detail/CVE-2021-4217)
- [CVE-2022-0529](https://nvd.nist.gov/vuln/detail/CVE-2022-0529)
- [CVE-2022-0530](https://nvd.nist.gov/vuln/detail/CVE-2022-0530)

[Debian](https://sources.debian.org/patches/unzip/6.0-29+deb13u1/), [Arch](https://gitlab.archlinux.org/archlinux/packaging/packages/unzip/-/blob/4f2e32f21f161d2a8805287faade0852fefe1c42/PKGBUILD), [Fedora](https://src.fedoraproject.org/rpms/unzip/tree/main), [Alpine](https://gitlab.alpinelinux.org/alpine/aports/-/blob/master/main/unzip/APKBUILD), etc. all maintain their own patchsets on top of Unzip 6.0 while borrowing patches from eachother, to patch vulnerabilities and other issues in the Info-ZIP tools. The [Info-ZIP-Family-Tree-for-UnZip](https://github.com/pmqs/Info-ZIP-Family-Tree-for-UnZip) GitHub repository by Paul Marquess tries to track the lineage of all downstream Unzip packages, and there are a lot of diverging branches. So it is very likely that the version of `unzip` you can find in any Linux distribution has been heavily patched to fix all currently known vulnerabilities to the best of their abilities, despite Info-ZIP not having released a new stable version with fixes for them.

It's not a situation any Linux distribution wants to be in, though.

One reoccurring issue with `unzip` is the problem of how to handle zip bombs, ZIP archives which are specifically crafted to quickly inflate to enormous sizes causing out-of-memory issues. Ideally the unzipping tool should be able to detect a potential zip bomb and abort early, without allocating enormous amounts of memory and potentially causing system instability. However this is a very difficult problem to truly solve, as it is not always possible to know whether a ZIP is a zip bomb or not without actually extracting it.

This is a typical [space-time tradeoff](https://en.wikipedia.org/wiki/Space%E2%80%93time_tradeoff) in computing. You want to develop heuristics to catch a zip bomb before it inflates to a size that is unmanageable in RAM, at which point it is too late and you have already caused system instability. You however do not want to reject valid ZIPs that become unextractable due to looking too much like a zip bomb, if you make the heuristics too strict and eager to label it a zip bomb.

The proliferation of large security patchsets also in itself can pose a security problem, as it's not guaranteed that every package maintainer knows all the intricacies of the Info-ZIP codebase and can tell whether a patch actually fixes the underlying issue without introducing side effects. A certain chunk of the patches applied by distros come from [an unzip fork](https://github.com/madler/unzip) by Mark Adler, the co-author and current maintainer of zlib as well as a former member of the Info-ZIP team, which primarily focuses on patches relating to zip bomb detection. Mark Adler is, [as his GitHub profile reads](https://github.com/madler), mostly harmless and should be seen as a trustworthy figure in all of this. Likewise security researchers who responsibly disclose vulnerabilities to open source maintainers can generally be seen as the good guys.

However, this would also create an opportunity for a malicious actor to audit the codebase in secret, find flaws and construct intentionally flawed patches that together create a much worse vulnerability, then submit them to downstreams. This doesn't seem too far fetched considering the extreme sophistication that was behind the [XZ Utils backdoor](https://en.wikipedia.org/wiki/XZ_Utils_backdoor). This reasoning can also be found in an issue on the Arch Unzip package about large valid ZIP files triggering zip bomb detections, where [Arch project lead Levente Polyak commented on the current state of Unzip](https://gitlab.archlinux.org/archlinux/packaging/packages/unzip/-/work_items/3#note_267385):

> [...] Applying huge patch sets of C semi randomly to fix downstream introduced problems is an infinite rabbit hole. package maintainers aren't really there to vouch for huge downstream C patches, that's not their job - and just blindly applying huge C patches just because "security" is a fallacy of false sense of precisely that. But we all fear hostile backdoors in upstream like it happened to xz, but expect packagers to just pull in huge downstream patch sets on top of each other, which is precisely where I as an attacker would try to get a backdoor into a distro. [...]
>
> For me we long ago crossed a line, and the only winning move is to get rid of unzip. We shouldn't spend any second trying to vouch for any further C patch set, but spend this time working out the proposal to get rid of this package, including analysis what it means to the reverse depends.

## My own Info-ZIP bug...
While writing this blog post, I decided to take a look at the Unzip codebase myself. I wanted to do a little bit of software archeology and just skim through the codebase for personal curiosity, though it quickly escalated.

Large parts of the codebase are rather jarring to read as a younger person who is used to "modern" C (assuming a baseline of C99). Functions make use of K&R style function declarations predating C89, and there are a lot of custom types typical of codebases predating C99. There are a sizeable amount of options you can define while compiling to change the program's behaviour, such as `-DUNICODE_SUPPORT` for Unicode support and `-DLARGE_FILE_SUPPORT` for Zip64 support. This is of course to accommodate platforms without 64-bit integers or where Unicode support was unnecessary - I'm sure there was a time when this was useful. Building with the Unix makefile without any additional flags will get you an unzip without Unicode or Zip64 support, among other things.

In addition there are a huge amount of codepaths gated by preprocessor checks for the enormous amount of platforms that Info-ZIP supports, many of which can be safely considered obsolete today. Modern IDEs can ease the load by lowering the opacity of codepaths that wouldn't be compiled for the current platform, but it is still a large mental overhead to juggle all the different parts when platform-specific codepaths are stacked on top of each other for all the strange things needed for operating systems from the 80s.

For instance, I was wondering what the "TOPS20" compiler define meant because there was a certain amount of alternate code gated by it. Then I looked it up and found the [TOPS-20 operating system](https://en.wikipedia.org/wiki/TOPS-20), which hasn't seen a new release since the 80s... Supporting obsolete platforms for retro enthusiasts is a noble goal, but TOPS-20 conveniently seems to be about the only platform they _no longer_ support as mentioned in the INSTALL file:

> [...] The sole exception is TOPS-20, where tops20/* should be unpacked into the current directory, but TOPS-20 is no longer fully supported anyway.

Another interesting thing I noticed was this syntax error in `ttyio.c` gated by a `DEBUG_WINSZ` define, there is one extra closing parenthesis in the `fprintf` call:

```c
#ifdef DEBUG_WINSZ
        if (firsttime) {
            firsttime = FALSE;
            fprintf(stderr,
              "ttyio.c screensize():  ioctl(TIOCGWINSZ) failed\n"));
        }
#endif
```

`DEBUG_WINSZ` is a preprocessor define and has nothing to do with Windows or null-terminated strings, it's just debug prints for the functions dealing with terminal window sizes. No files explicitly define or mention it, so it's primarily dead code that does no harm being broken. But it also feels like a sign that nobody has truly dug into the codebase with modern analysis tooling - which can reveal such syntax issues even though it is behind a define that is never defined anywhere.

My exploration in the codebase hit a much more interesting discovery at a certain point. And after one thing led to another, I suddenly had a crafted malicious ZIP file which triggers an OOB heap read when unzipping. Valgrind reported "Invalid read of size 1", and ASan would crash with a "heap-buffer-overflow" error after attempting to read 92 bytes that ended out of bounds.

{% include image.html
	name="asan_crash_redacted.webp"
	alt="ERROR: AddressSanitizer: heap-buffer-overflow" %}

At this point I went from software archeology to security research. The crafted ZIP file which triggered this also uncovered another buffer overflow elsewhere, once I had fixed the first one! The second one was in a codepath you would not expect to be used on a modern Linux system, as it is fallback code reimplementing the functionality of a function that has been present since C89. This is handled by a compile-time option which as far as I can tell, no Linux distribution defines. They probably should.

I have since reported these two findings by email to the Debian security team, and hope these issues will be resolved soon. I will likely make a follow-up post about this once it has been resolved.

## What even happened to Info-ZIP?
The question I kept having in my head while doing all this was simple - what happened to the people behind Info-ZIP? People disappear or move on, and with a project spanning several decades it is understandable that personal responsibilities change. Work, family, new hobbies rather than maintaining ZIP utilities. It is perfectly understandable for plans to change, and the entire Linux distribution ecosystem relying on your project as a centerpiece does not change that fact.

That Info-ZIP is entirely abandoned would be the easy answer. Based on [the Info-ZIP website](https://infozip.sourceforge.net/) being in a largely frozen state with the forums closed, and everything else mentioned so far that would be reasonable to assume. But this is actually not the full story.

While the latest official betas on SourceForge as I previously mentioned was released in 2010, there have been even newer beta releases not found on SourceForge. Wikipedia mentions a significantly newer beta version of Zip 3.1d, as recent as 2015:

> A newer release candidate, Zip 3.1d, appeared on the official FTP site in 2015, but the SourceForge page was not updated.

The official FTP site in question, ftp.info-zip.org, has since gone down. But wait, Wikipedia has more original research!

> The antinode.info FTP site seems to be hosting an even more cutting-edge source of info-zip utilities. Individual revisions are organized into folders containing files differing from the previous revision, and zip archives for sources are occasionally released.

antinode.info appears to be the website of Steven Schweda, listed as an Info-ZIP member on the official Info-ZIP website. [The FTP site](http://antinode.info/ftp/) contains versions of unzip as new as 6.1c25c from December 2023 inside the `info-zip/` directory. Huh??? Inside of the source ZIP, there is a `History.610` file which contains a full list of changes for each beta release along with their release date, with a handful being released after 2015:

```
6.1c20 (16 Mar 2016)
6.1c21 (12 May 2017)
6.1c22 (08 Jun 2017)
6.1c23 (29 Nov 2017)
6.1c24 (06 Dec 2018)
6.1c25 (20 Dec 2018)
6.1c25b (20 Aug 2020)
6.1c25c (14 Dec 2023)
```

That's a lot of recent beta releases for a project whose last stable release was in 2009. There is also a `zip31e23` (Zip 3.1e23?) directory from 2024, containing just two files relating to VMS support. Why are these random things just hiding in plain sight on someone's FTP server without any mention on SourceForge?

Looking through the changelog for the recent Unzip betas, there are a lot of changes relating to VMS support. The antinode.info FTP server is hosted on OpenVMS as visible in the directory listing, and Schweda is listed as the maintainer of unzip's VMS support on the Info-ZIP website. So it's possible that he has just been working on fixes to the utilities on his own with a particular focus on the VMS support.

With that in mind, a probable theory is that he's simply fine doing his own work and does not find the release engineering required for a new stable release to be worth it. Linux distributions aren't interested in VMS support anyway, and have all the most important security issues plugged after all. There are mentions of vulnerabilities being patched in the release notes, but I haven't checked whether all changed Linux distributions carry are present in the last beta release.

So there is actually some amount of real, publicly visible, development activity from an Info-ZIP member. Entirely unmaintained may not be true, but when the last stable release was from two decades ago and development activity is hard to fully pinpoint it's not wrong to still consider it some form of unmaintained.

Modern open source projects tend to be developed very much in the open, with a public Git repository and very visible development activity for every commit someone pushes to the main branch. Info-ZIP started when the term "open source" was not even coined, and appear to favour a more private development model.

However, this of course would not stop someone from forking if they wished to take the project in another direction.

## What about forks?
It would be reasonable to assume that Unzip and related would be forked by now. Projects have been forked for less. As all Linux distribution branches have already had to maintain their own patchset to deal with the large amount of vulnerabilities, and many of these patches are shared across distributions, it would make sense for a fork to appear as a collaboration between Linux distribution package maintainers to centralise this maintenance.

It was previously mentioned that Mark Adler has a fork of Unzip with changes that have made it to distributions' patchsets, but the repository is more intended to host his own authored patches to the codebase rather than being a full fork of the project.

However, there is a more proper third-party maintenance fork of unzip, [unzip-p by Maks Verver](https://github.com/maksverver/unzip-p). The fork aims to inspect and apply all known third-party patches for the project, as well as modernising, hardening and trimming down the codebase by cleaning up platform-specific code for non-POSIX platforms. This would be perfect for Linux distributions whose primary support concern is solely for POSIX compliant, rather unified modern Linux environments. The code becomes much easier to audit when it is stripped down to only the codepaths that would be used on any modern Linux systems.

Otherwise, every Linux distribution's package has effectively become its own fork. Not because they really love doing it, but because their hands have been forced. But if we were to consider abandoning the Info-ZIP codebase altogether in favour of something else with less legacy cruft, what alternative command-line utilities do exist?

## Can we replace Info-ZIP?
There exists countless of *libraries* for working with ZIP files. There is the library literally called [libzip](https://libzip.org), independent of Info-ZIP and actively maintained with new releases occurring regularly, as well as minizip loosely maintained as part of zlib (which itself has been forked into [minizip-ng](https://github.com/zlib-ng/minizip-ng) as part of zlib-ng). There is also [libarchive](https://github.com/libarchive/libarchive), a library originally started as part of FreeBSD which supports a wide range of different archive formats including ZIP.

But `zip` and `unzip` are command-line tools, not libraries. You could make your own `unzip` command easily with any library of choice that accepts a single argument to extract a ZIP archive, then a second optional argument for the destination directory. This would likely be enough for interactive usage, but the issue is that the Info-ZIP tools contain a large amount of command-line arguments which all would need to be implemented exactly like in the original, to not break any shell scripts made within the past three decades.

However, libarchive actually ships with its own unzip tool, also called `bsdunzip` to distinguish it from Info-ZIP:

> **unzip**: the 'bsdunzip' program is a simple replacement tool for Info-ZIP's unzip

This program is used in FreeBSD to provide `unzip`, and has been adopted by other BSDs as well. So it has already seen relatively wide use as a replacement for Info-ZIP `unzip`, being battle tested as part of BSD distributions. It also typically exists as `bsdunzip` as part of a libarchive package in Linux distributions.

However, Unzip is more than just `unzip`. In addition to the namesake command, it ships with several other utilities, some of which are more useful than others:

- `funzip` - filter for extracting from a ZIP archive in a pipe.
- `unzipsfx` - self-extracting stub for prepending to ZIP archives. The usefulness of this nowadays is questionable as ZIP archives are universal, while prepending a stub will make it dependent on the operating system, architecture and the glibc version for Linux systems.
- `zipgrep` - search files in a ZIP archive for lines matching a pattern. This is just a ~100 line shell script that uses `unzip` and `grep`, and could likely be made to work on top of `bsdunzip` instead.
- `zipinfo` - list detailed information about a ZIP archive.

While there has been a lot of focus on Unzip in this blog post, the Zip suite also contains several more utilities in addition to the standard `zip`, though they all have some pretty glaring limitations:

- `zipcloak` - encrypt a ZIP archive. This uses the original PKWARE encryption algorithm rather than the modern AES encryption that archiving tools tend to use nowadays, and is very weak.
- `zipnote` - read or write comments in a ZIP archive. Doesn't support >2GB Zip64 archives.
- `zipsplit` - split a ZIP archive into smaller ZIP archive chunks. Doesn't support >2GB Zip64 archives.

While the suite spans a wide range of additional utilities, some of these have became quite dated by now. Nonetheless libarchive's `bsdunzip` only represents a replacement for one of these utilities. It is still among the most widely used and the most security-sensitive of the utilities, and would be a good start.

In terms of alternative commands used on Unix platforms for handling ZIP files, which serve the same purpose while not being compatible with the Info-ZIP tools:

- `7z` is available as part of 7-Zip. Previously the p7zip project was a third party soft-fork of 7-Zip to provide POSIX support which was abandoned after version 16.02, but POSIX support for the command-line utilities was later introduced in 7-Zip proper in version 21.01. It supports a wide range of formats including ZIP, and sees regular releases by Igor Pavlov to this day.
- libarchive also features `bsdtar` which can be best described as an overgrown `tar` alternative which can create and extract a wide range of archive formats including ZIP with a `tar`-like syntax, using libarchive as the backend.

But of course, nothing feels quite as good as just typing `zip` or `unzip` on the command-line.

## In conclusion
The Info-ZIP story is a story about a long-running open source project spanning decades and still sees widespread usage. Depending on how you look at it, it is either a case study in forgotten open source projects that underpin the Linux ecosystem and the dangers of letting them go unnoticed, or simply a project with a different development model foreign to modern open source developers like myself.

Realistically, things will just keep going as they are for the foreseeable future. Maybe one day the Info-ZIP team reappears with a new stable release, revealing that they had been meticulously fixing every single issue in the codebase in separate private branches, or maybe a new fork will appear one day. If your calling in life is to thanklessly maintain ZIP utilities, maybe this was inspiring. Or maybe you will never be able to look at `zip` and `unzip` the same way again.

Either way, Linux distributions can surely accept another patch. I'm sure it will be the last one this time.
