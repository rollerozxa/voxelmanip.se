---
title: principia-web
image: principia-web
timeframe: 2020-
technologies: LEMMP stack - Linux (Debian), Nginx, MariaDB, memcached and PHP. Frontend uses Twig as a templating engine and the CSS is compiled from SCSS stylesheets.
license: AGPLv3
website: https://principia-web.se
repo: https://github.com/principia-preservation-project/principia-web
---

Principia is a game by Bithack that was originally released back in 2013 for Android, and later 2014 for Windows. It is a sandbox game, that allows you to build various things that you were able to upload onto the game's community site. Unfortunately the game wasn't a very big success, and Bithack ran into financial issues having to abandon the game by the end of 2014. However, the community site would stay up until around the beginning of 2018 when the site was shut down without warning. The little community that still existed at that point was then splintered, with about a dozen people getting behind a Discord server that had been set up shortly before.

Enter principia-web, a project I started to make an unofficial recreation of the Principia community. This would include reverse engineering the game, its level format, and reimplement the protocols it used to communicate with the community site.

While my project to recreate the Principia community site technically started as far back as April 2019, it wasn't until February 2020 that I properly begun development on it and created a Git repository for it. The development progressed during 2020 up until the 26th of December 2020, when I considered the most essential functions to be complete and launched the site running on a Raspberry Pi server sitting on my desk.

This was my first ever project that was public in any large capacity, and taught me valuable skills in server hosting, making an user friendly project, and a lot more about coding in general.

The site also features a forum and wiki, latter of which was written entirely from scratch purpose built for principia-web. You can read more about the first iteration of the Wiki software [in this blog post](/2022/11/06/Reinventing-The-Wheel/), which has been forked off as a separate Wiki software called [Wikiozxa](/projects/wikiozxa). The Principia Wiki has since then been rewritten to be backed by a Git repository, which will likely be written about in a blog post sometime.

Recently (August 2022), the original author of Principia came back and open sourced it, as was promised to the community some years back. With this, principia-web has become the main community site that the open source Principia uses in addition to me [stepping up to become the maintainer of the open source project](/projects/principia/).

...Not bad for a first project.
