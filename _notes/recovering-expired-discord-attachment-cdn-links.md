---
title: Recovering expired Discord attachment CDN links
last_modified: 2025-10-19
---

In 2023 Discord made the links of files and images uploaded to their service and available as a link from their CDN time-sensitive, containing a key in the URL that will expire after some time. While inside of Discord these links will keep working, when someone copies and pastes them outside of Discord, they will eventually stop working some time in the future.

<!--more-->

Since Discord had been around for about 8 years at that point, it has already been used by many people who want to hotlink images onto forums or as a file hosting service, even though it was never meant to be used in this manner. So this has caused a lot of broken images all across the Internet on forums and other websites that may not allow you to upload images directly to the site.

## How to refresh an expired link
Discord attachment links are hosted under the `cdn.discordapp.com` domain, and expired links will simply show this message if you attempt to access it:

> This content is no longer available.

In order to refresh such a link, simply copy it and paste it into a Discord channel! You can create an empty Discord server with only you in it, so as to not spam someone else's server. Once pasted, the file will either generate an image embed or create a link, and you can now download the file in question to save it and reupload it somewhere more reliable if needed.
