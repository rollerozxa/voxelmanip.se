---
title: The most intense week in a while
tags: Anecdotes Personal Sysadmin
cover_alt: A blåhaj plush lying on top of a laundury dryer.
forum_thread: 183
---

Week 43 ([as defined by ISO](https://en.wikipedia.org/wiki/ISO_week_date), 19th-25th October) was a very intense week for me in terms of security-related happenings which I had to stay on top of, including but not limited to the compromised eMudhra intermediate certificate and the disclosure of two PHP RCE vulnerabilities. The story begins with an issue being discovered in Principia the day before, and ends with a serious compromise of Luanti infrastructure which we only discovered the week after.

<!--more-->

## Friendly vulnerability
It starts with something rather personal.

Noxii is someone who I have been friends with for some months by now after stumbling upon Lyano Market, a revival project for old versions of Android Market/Google Play. We have been playing together on the Lyano Minecraft server, worked on some code projects, among other things.

{% include image.html
	name="roller_noxii_mc.webp"
	alt="Minecraft screenshot of a player with a raccoon skin, standing next to someone with a purple cat/wolf skin wearing trans and rainbow pride sleeves." %}

One of the things she has worked on is a Xbox 360 custom server by the name of Nekomist, which involves some amount of C++. So I have always found it nice if she were interested in potentially contributing to Principia, being an open source project with a C/C++ codebase that I am the maintainer of.

As such, on Sunday the week before (the 18th), she was looking through random source files in the Principia codebase. I suppose `src/network.cc` stood out as particularly interesting from a security standpoint, containing code handling network responses in the game. She ended up at the following lines in the `parse_featured_levels` function which parses a request for featured levels in the main menu of the game:

```cpp
uint32_t name_len = lb.r_uint32();
char *name = (char*)calloc(name_len+1, 1);
lb.r_buf(name, name_len);
strcpy(menu_shared::fl[i].name, name);
free(name);

uint32_t creator_len = lb.r_uint32();
char *creator = (char*)calloc(creator_len+1, 1);
lb.r_buf(creator, creator_len);
strcpy(menu_shared::fl[i].creator, creator);
free(creator);
```

The name can be as long as 4 billion, while the struct it copies into with `strcpy` is only 256 bytes long. We also pass the length directly to `calloc`, potentially making a huge allocation of 4 gigabytes with a malformed or malicious featured list file received from the network.

Yeah. That will need fixing.

{% include image.html
	name="i_warned_you_about_strcpy_bro.webp"
	alt="'Hella Jeff' says 'I WARNED YOU ABOUT STRCPY BRO!!!! I TOLD YOU DOG!'" %}

The small fix would be to just use strncpy instead, but we ended up entirely redoing that part of the code to return if the length is too big to prevent a potentially huge memory allocation. This also saves a heap allocation as we can just `memcpy` into the destination buffer (using `r_buf` in Principia's `lvlbuf` class for dealing with binary buffers).

```c++
uint32_t name_len = lb.r_uint32();
if (name_len > 255) {
    tms_errorf("parse_featured_levels: Level name too big!");
    return false;
}
lb.r_buf(menu_shared::fl[i].name, name_len);
menu_shared::fl[i].name[name_len] = '\0';

[...]
```

In addition to this, there were also two more potentials for allocating enormous amounts of memory when parsing the links for the getting started links in the main menu. As well as the length of an embedded JPEG being an unsigned 32-bit integer with no range checking, allowing you to send a 4GB sized thumbnail if you ever needed that. I went through these on Monday and kept the patches for a future release, unsure of when that would be...

## eMudhra intermediate certificate
On Tuesday, 20th October, the news broke about the certificate authority eMudhra having eight intermediate certificates compromised which had been revoked across browsers and other software leading up to this day. From [emudhra.we-have-a-problem.com](https://emudhra.we-have-a-problem.com/):

> The private keys of eight eMudhra intermediate CA certificates have been compromised. They chain to roots trusted by the Mozilla, Microsoft, Apple and Chrome root programs and by many downstream trust stores.

This is... quite serious! As it would mean that anyone could create HTTPS certificates for any domain, allowing for undetectable Man-in-the-Middle attacks on HTTPS traffic.

Further investigation [by Fediverse queers](https://mastodon.catgirl.cloud/@49016/117474217042191790) uncovered a peculiar detail about the private keys of all the "compromised" intermediate certificates:

> omfg they're ALL FUCKING <255

One of the private keys for the intermediate certificates was literally 4, and the rest were all below 255. Trivial to brute force by anyone, hiding in plain sight and trusted by everything up until a couple days ago. Of course, speculation remains rampant about whether there were malicious intent behind the creation of these certificates or merely gross negligence caused by some kind of mistake that made the generated keys get cut off after one byte.

As mentioned previously, browsers and major programs dealing with HTTPS certificates had pushed updates to make the intermediate certificates untrusted. But there are also _a lot_ of random programs that make HTTPS requests which bundle their own CA store in cases where they cannot access the operating system's CA store, or cannot trust that it is kept up to date by the OS vendor.

Principia is one of those programs. We bundle a CA store for the Android version of the game which is used by libcurl when communicating with the community site. Android has had a rough history with its CA store (such as that time [Let's Encrypt almost killed 1/3 of Android](/2024/09/16/how-lets-encrypt-almost-killed-one-third-of-android/)), but the TLS library we use for libcurl on Android (mbedTLS) has no way of retrieving the system certificates anyway. So bundling the CA store turned out to be the only way of solving it for Android.

But that means we get dragged into things like this. I made a mental note, getting a security update out with this + fixes to the previously discovered issues with the featured level parser would be useful. Maybe tomorrow? I think tomorrow would be nice, I hope nothing serious happens on the 21st...

## The PHP RCE Sisters
Later on the 20th, the PHP team published an ominous announcement on the PHP website:

> The PHP security team would like to give advance notice of an upcoming security release.
>
> It is scheduled for Wednesday, 21 October 2026 at 14:00 UTC.
>
> It addresses two critical vulnerabilities, both rated CVSS v4.0 9.2.

This was in response to someone leaking the existence of two high severity PHP vulnerabilities assigned the numbers CVE-2026-109618 and CVE-2026-109619, breaking the embargo early. While the original announcement was intentionally vague on details, the precise date at which the security release would drop made it sound like extremely serious vulnerabilities that could cause a lot of damage.

Late in the night on that day, I wrote [this on Mastodon](https://hachyderm.io/@ROllerozxa/117475720958193683):

> Ominous announcement of two RCE CVEs in PHP core having patches released tomorrow. Somehow I feel like there will be an independent discovery of it before the planned release date after the embargo has been broken. Could be bad!
>
> I can't help but feel like the rate at which big vulnerabilities and security incidents in open source and adjacent areas happen have really cranked up now. I assume this is how it felt to be a Windows sysadmin in the early 00s, what with Sasser, Blaster and whatever else was going on at the time. It seemed like a quite hectic time in all the records I've read from that time.

Then I went to bed. Once I woke up, one of the first things I heard was that at least one of the vulnerabilities had been independently discovered, and someone had published both details and a PoC was public somewhere. A Cloudflare employee also reported exploitation of it in the wild.

This is bad!

I scrambled to SSH into my server and kill PHP-FPM, then put up a notice on principia-web in place of the 502 Bad Gateway error page. Then inspected logs for potential exploitation, but I seemed to have gotten to it before someone had tried to exploit it. However I decided to keep the site down for the time being, and updated the downtime message:

> The Principia community site is currently down due to two high severity remote code execution vulnerabilities in PHP core (CVE-2026-109618 and CVE-2026-109619). Exploitation of these vulnerabilities have been reported in the wild and a new release of PHP to fix the vulns have still not been released.

I also got a DM from someone I had been talking with about this the night before:

> breaking news \
> the exploit has been reproduced before the update

Throughout the day, other people who knew I was maintaining multiple websites running PHP checked up on me to make sure I was aware, and big ❤️ to those!

While I was still not 100% sure about what exploitation of the two vulnerabilities entailed despite the independent discoveries, what I did realise were that they were quite bad and affected essentially every PHP installation. One of them was certainly something about how PHP handled multi-part file uploads, which sounded really concerning. Even if you reject such a request at the webapp level for an endpoint that does not accept such a request, it was allegedly already too late once it had been received by PHP.

I do not run any off-the-shelf PHP software - the Principia community site and Voxelmanip Forums are all largely built entirely from scratch with no framework and a few dependencies such as Twig. So when e.g. a vulnerability occurs in WordPress or some other widely used PHP software, it does not directly affect me. This time, it was quite different, a vulnerability right in the core of PHP.

The PHP team had still not released the patches, and I expected them at that point to wait until the 14:00 UTC time to release everything even though the vulnerability had breached containment. The time up until that point was unnerving, like the whole Internet was holding their breath.

Checking up on several forums, wikis and other sites running PHP, a lot of them had also decided to pull everything offline to keep the server safe in the hours before the patches released. It became an unofficial blackout for all websites running PHP who were concerned enough about the vulnerability to pull things offline in the meantime.

## PHP CVE disclosure
About half an hour before 14:00 UTC, the full disclosure for [CVE-2026-109618](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w) and [CVE-2026-109619](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp) were published, and then the patch releases for all supported PHP version branches. Shortly thereafter, Ondrej Sury's third-party Debian and Ubuntu repositories for PHP pushed packages for the new versions, and I ran updates on the server.

Then I went right onto Fedi to sound the alarm to everyone else who had been waiting for the packages to drop:

> If you are using Ondrej Sury's Debian or Ubuntu PHP repositories, he has pushed the patched versions of PHP now! UPDATE UPDATE UPDATE!!!

I checked to make sure it had successfully updated on my server, and then brought my services online again. In the announcement on the Principia Fediverse account I added another reminder for any other sysadmins who may be reading:

> Anyone else running ANYTHING with PHP needs to UPDATE IMMEDIATELY(!!!) as the exploitation of unpatched PHP versions will likely ramp up further now that detailed disclosures have been made.

Just like how the vulnerability was independently discovered just by the fact that a RCE vulnerability simply existed, there was a concern that the moment the full disclosure details and patch was released by the PHP team, a ticking countdown would immediately start as AI-wielding black hats race to develop PoCs and exploit them on unpatched systems.

"15 minutes" was an estimate of how much time it would take from the release of the vulnerability details to when it would be exploited in mass by AI agents, but I'm not sure how accurate that ended up being. It was certainly the reason why the PHP team decided to announce such a precise date in advance to prepare sysadmins to be on high alert for the release, though.

The vulnerabilities have since been nicknamed [PHP2Shell](https://en.wikipedia.org/wiki/PHP2Shell), due to its ability to allow for shell access when the right conditions are in place. It will likely go down in history as a serious vulnerability that shook the entire web among the likes of Heartbleed. Later in the day I saw a news article in the local news, and my dad asked me in the evening whether I had heard about "the PHP thing that happened". Oh yes, I did!

## AI agent vulnerability disclosure
On the same day that I was waiting impatiently for PHP patches, I checked my junk mail and saw an email I had received earlier that day from someone reporting a security vulnerability in the Principia client.

It turned out to be an AI agent who operates on behalf of someone to scan for and find security vulnerabilities in open source software, to credit it to them.

> [redacted] is the personal website of [redacted], managed and run by AI agents he built. [redacted] has a full-time job, so the agents do the research, open-source security work and writing. The site has a short introduction, notes on open-source security work, public findings, and a blog.

Err, yeah okay. That's 2026 for you, I guess. Well, what did it find?

> Component: src/network.cc, function parse_featured_levels

Wait wait wait... Who do you think you are?

It turned out that they had reported a buffer overflow vulnerability in the featured level parser, the exact same issue in the code that Noxii had discovered while skimming through the network code. This coincidence was quite unnerving - I asked her if she had fed source files into some AI tool but she does not appear to have done so. It was just a really weird coincidence.

But I respond anyway, of course:

> Hi, thank you for the detailed report. I received an independent report a couple days ago from someone else disclosing the same buffer overflow issue, and I have been working with them to get a patch out already which should be out sometime soon. They will be credited for the discovery as they were the first one to bring it to my attention, but you can publish your own writeup once the next release with the fix arrives.
>
> I've been working back-to-back with other security incidents that have happened this week (the eMudhra certificate compromise and the two PHP RCE CVEs, which both affected Principia in some way) in addition to handling stuff in my personal life, but hope to get a fixed release out soon enough.

I had previously been torn on whether to label the issue she had discovered as simply a bug or a vulnerability. While it is very unlikely to be exploited due to the default community site being essentially the only community site that exists, it is still a buffer overflow vulnerability that can be triggered from over the network, which could end badly if went unchecked.

After this email I decided to go through with it as a vulnerability and crediting Noxii for the discovery rather than the AI agent. I would release a new update tomorrow and then also help her to get a writeup ready and published right after that to get the most out of her discovery. I did not want to give some random AI agent steal the credit of a human's discovery.

## Principia 2026.10.22
On the 22nd October I released Principia 2026.10.22 as a backport security release, updating the CA store for Android and fixing the previously discovered issue with the featured level parser which I ended up going forth as a vulnerability. The [news article](https://principia-web.se/news/36) also had a section mentioning the downtime of the community site that occurred the day before.

After the release, Noxii released [her writeup on the vulnerability](https://noxii7d.github.io/principia-2026-10-18-buffer-overflow/) with my approval. I helped her with the technical writing and I am happy with how it turned out with my mentorship.

## University exams
I was supposed to be having an exam in a university course this week on Saturday! I had been studying for this throughout the week while taking care of everything that was going on to prepare myself for it, and after the Principia update that was my primary focus at that point.

Not to jinx it, but I think it went well.

During the subsequent night, I was wondering whether to write a blog post about everything that happened this week. I did not think of it during Sunday, however on Monday I was made aware of something which put me right on edge and convinced me to actually begin writing this blog post.

## Luanti ContentDB compromise
On the morning of 26th October Luanti's ContentDB, the site hosting games, mods and texture packs for [Luanti](https://luanti.org), was brought offline to investigate a security incident. I'm involved with the Luanti project and am a staff member on ContentDB, so I had first hand knowledge of what was going on behind the scenes before it was made public.

While we were alerted to it on Monday, they had been probing for multiple days and had already acquired configuration secrets from the webapp's configuration file on the 22nd of October. Using this, they could create a session cookie for a staff member, and this was all going on without us knowing it. I was busy getting a new Principia release out at the time.

They then continued to probe the website for vulnerabilities and ended up discovering a vulnerability in one of the third-party libraries used by ContentDB. This lead to them achieving full shell access inside the container sometime in the night leading up to the 26th. Once this was discovered the next morning, the server was abruptly brought offline.

The majority of the workload dealing with the compromise fell on [rubenwardy](https://rubenwardy.com), who has been developing and running ContentDB since 2018. Due to the level of access they had acquired, the current ContentDB server was assumed to be fully compromised and a new VPS was ordered to rebuild the server. As well as doing forensics on the compromised server to assess the full extent of what happened.

On the 27th, [a new post on the Luanti blog was published](https://blog.luanti.org/2026/10/27/contentdb-security-incident/) giving more details about the security incident. This is still an ongoing incident and ContentDB is still currently down as of writing - a read-only mirror from ContentDB staff member Zenon Seth is currently being hosted on content.luanti.org, but ContentDB proper is not coming back up until it has been fully secured. This will likely take some time until everything is resolved.

Once things have settled down and the vulnerability in the third-party library has been publicly disclosed, rubenwardy will likely be making a more detailed post going over everything that happened [on his own blog](https://blog.rubenwardy.com). In case you are interested in reading the full story once that drops.

## What a week!
This week turned out to be very hectic with several security-related things all happening at once, and specifically things that affected the things I am involved with directly.

However, it appears that I'm not the only one noticing this - October 2026 has been dubbed Black October and [Wikipedia now even has a page about it](https://en.wikipedia.org/wiki/Black_October_(information_security)). Some mentions of other things that happened during the same week but did not directly affect me was a RCE vulnerability in GitLab, as well as a vulnerability in the Brotli compression library that affected many things typically exposed to the Internet such as Node.js.

Apart from the fallout from the ContentDB breach, this week has been much calmer by comparison. The adrenaline rush while you're in the state of things constantly happening is addicting, but will burn you out if you're not careful. If you were also affected by anything that happened that week, stay safe and be sure to get some well-deserved rest, if you haven't already.
