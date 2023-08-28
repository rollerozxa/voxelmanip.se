---
title: Mjukisbyxor???
---

I like reading through my access logs, almost as much as I like RSS feeds nowadays. So when I looked at the access logs for the Voxelmanip Forums, I was very interested to see what I thought was a new RSS client... Mjukisbyxor?

<!--more-->

> `"GET /rss.php HTTP/2.0" 200 17344 "-" "Mjukisbyxor / 2.4.6-2(268)"`

In case you don't know, "mjukisbyxor" is Swedish for sweatpants. Certainly an odd name for an RSS client, but interesting nonetheless.

So I tried to search for this "Mjukisbyxor RSS client" and... got nothing but sites selling sweatpants. I assumed it was just some random Swedish guy's personal RSS client, and he subscribed to the Voxelmanip Forums RSS feed through a peculiar turn of events. But when I did an IP lookup, I was surprised...

## Wait, that's me?

Turns out that was me, my IP and everything. But how? I do in fact have two RSS clients, one on my mobile and one on my desktop, but I don't recall any of them being called Mjukisbyxor. Looking at the timeframe of requests, it would have had to been from my mobile RSS client, Feeder. I checked its source code and...

```java
const val USER_AGENT_STRING = "Mjukisbyxor / ${BuildConfig.VERSION_NAME}(${BuildConfig.VERSION_CODE})"
```

Well, would you look at that. The version number in the user agent also matched up with the version of the app I had installed, obviously.

Turns out [this was a change that had happened a couple weeks ago](https://gitlab.com/spacecowboy/Feeder/-/commit/8adb4114c71ed801a517301c86c3eee98f370e54) as the old user agent that pretended to be Chrome on Android 10 seemed to cause issues for some using RSS feeds on Wordpress sites with odd security extensions installed. I guess this could count as an easter egg.

## On the topic of RSS...
I honestly really like RSS. I rediscovered it alongside reimplementing RSS for the old Voxelmanip Forums codebase, and have been using it ever since then for keeping track of latest posts there. I've also really liked the fact it's easy to code together custom RSS feeds as a simple way of sending notifications to my phone. (More about that sometime...)

The abovementioned RSS client, Feeder, is a FOSS RSS client for Android phones. It's available both on [Google Play](https://play.google.com/store/apps/details?id=com.nononsenseapps.feeder.play) and [F-Droid](https://f-droid.org/en/packages/com.nononsenseapps.feeder/), and I highly recommend it if you would want to get into RSS feeds. If you want an RSS feed to test it out with, you can use [this blog's RSS feed](/atom.xml). But only use it while wearing sweatpants, obviously. ;)
