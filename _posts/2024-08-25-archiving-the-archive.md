---
title: Archiving the Archive
tags: Storytime
cover_alt: Screenshot of the new community site archive site at archive.principia-web.se
---

This blog post details my journey as I scraped the entirety of the Principia official community site archive and extracted the data from it to be able to recreate it myself.

<!--more-->

## Backstory
In August of 2022 the main author of Principia came back to the community and released the source code as open source. With this, the question about the levels on the old official community site which had shut down in early 2018 came up. After some discussion, it was decided to bring back the official community site as an archive, providing access to all the thousands of old levels uploaded during between 2013 and 2018 while making principia-web the primary community site for new levels.

To facilitate this, the game was made able to connect to an arbitrary domain to play levels, and an archive was set up at `archive.principiagame.com`. Initially things worked well up until we upgraded the game's cURL version and made the game connect via HTTPS. This broke the archive as, being from before the time of free Let's Encrypt HTTPS certificates, the official community site never supported HTTPS and all communication was made over plain HTTP back then.

After some time of things being broken I took things into my own hands and set up my own reverse proxy pointing to `archive.principiagame.com` at `archive.principia-web.se` (which now points at the cloned site). In addition to supporting HTTPS I also took the time to do a quick and dirty dark mode redesign similar to principia-web, hiding and removing useless page elements, and some other fixes.

However, just because I now was in control of the reverse proxy most people accessed the archive through didn't mean I had full control of it. I probably could have hacked things up even more, dragged in some server-side scripting to manipulate pages in a more complex manner than Nginx filter substitutions could do, but I preferred if I could essentially clone the archive and have full control over it instead of having to twiddle around as a middle man in front of the downstream black box.

## Scrape time
The files and pages I wanted to scrape was:

- Principia level files
- Full sized thumbnails
- Level pages
- User pages

The level files themselves contain some metadata such as the title and description, but also lack some vital information such as the author. Hence why the level pages would be scraped as well, so some information about levels not in the level file could be extracted from them.

User pages were scraped in order to create a list of all users that were registered on the site. Their IDs would then be used to link levels together to their author.

Now, scraping a full set of level files turned out to be quite tricky. As we do not have direct filesystem access to the folder of levels (as far as I know), you need to simulate requests to internal endpoints. Most internal endpoints that the game makes use of are under the confusingly named `apZodIaL1` (pronounced apsodial-one) directory, referred to as `COMMUNITY_SECRET` in the source code. The endpoints aren't very descriptive either, being random gibberish or a sequence of the letter X in increasing length. As another method of security, all requests require a valid Principia client user agent (e.g. `Principia/34 (Linux)`) or else will 404.

The endpoint you would think is useful is `/apZodIaL1/x.php`, which is the endpoint the game sends a request to when it wants to play a community level. However, the official community site implementation will refuse to send the level file if the level is locked. This might not be much of a big deal (because why would you want to archive locked levels that mostly consist of spam?), but there turns out to be quite a lot of interesting locked levels, including many locked levels with low IDs that were uploaded during the game's development. And because having as complete of an archive as possible is neat, obviously. The solution? Packages.

[Packages](https://principia-web.se/wiki/Packages) are a mostly unused feature in Principia that can package levels together. The only place it currently is actually used is for the built-in puzzle levels. However, it was intended for players to make their own packages that could be uploaded to the community site. Separate levels in packages would get uploaded as regular levels to the community site, but if you didn't want them to be accessible as regular levels you would lock them.

However, this also means there would have to be an endpoint where the game can request locked levels for the purpose of playing it inside of a package. Enter `/apZodIaL1/xxxxx.php`, the endpoint that is used for fetching levels for packages. Compared to `/apZodIaL1/x.php`, this one doesn't care about level visibility, it just throws the level file at you if you ask for it.

So as such I set to work scraping it all, writing some Python scripts that would iterate over all level and user IDs, downloading absolutely everything. Despite being the largest (almost 4GB at the end), thumbnails ended up being the fastest as the ratelimit for static files was much more relaxed than the one for dynamic PHP pages, allowing it to be downloaded in parallel at a break-neck speed compared to the rest. After about a day, I had meticulously scraped everything and was sitting with four folders of data, measuring several gigabytes.

## Extracting data
When extracting data from the HTML pages, I used a combination of BeautifulSoup and simple regexes to grab stuff. [Very quick and dirty Python scripts](https://github.com/principia-game/archive-scrape-tools).

First thing I did was extracting a list of users, with their username and ID associated with it, which would get dumped as a JSON file. This was fairly simple, since the user ID existed in the filename of the scraped page, and the username simply exists inside of an `<h2>` HTML element. That data was then imported into the MariaDB database I'll be storing all of it in.

Extracting level metadata was more tricky, since there's significantly more variation in what level pages would show. For instance if a level was unlisted, the download count is hidden, and if a level is locked the description will not show up. The download count for unlisted levels is essentially lost, but the description also is contained within the level file. I made a list of all level fields I wanted to populate in the database, and which fields I could populate using the page captures versus with the level file.

```
- id (page capture)
- cat (page capture)
- title (page capture/level file)
- description (level file)
- author (page capture)
- time (page capture)
- parent (level file)
- revision (page capture/level file?)
- revision_time (page capture)
- likes (page capture)
- visibility (visibility level flag includes unlisted 0x2)
- downloads (page capture)
- platform (page capture)
```

After fighting with different page behaviours, malformed level pages, messed up text encodings and mojibake, I ended up with a massive JSON file with various level metadata which I then imported into the database.

To parse the headers of Principia level files, usually I use the [.plvl Kaitai](https://github.com/principia-preservation-project/kaitai/blob/master/kaitai/plvl.ksy) which I wrote to document the format *a long time ago*, predating even the source code release. It still generally holds up though, and I use it for parsing uploaded levels on principia-web despite receiving the source code for an utility program that the official community site was using to extract metadata out of level files uploaded.

I wrote a PHP script that would directly parse every level file I had locally, and then populate the database with further metadata. In addition to populating the description for locked levels, this turns out to also fix a lot of mojibake, as the titles and descriptions inside of the actual level file appears to be less prone to mojibake than if it has been stored in the old community site's MySQL database.

## Replacement site
For hosting the archive site, principia-web was forked and trimmed down to the minimum necessary, essentially just a read-only level database frontend, with the ability to search through levels and play them. I also added some additional means of being able to discover levels such as a page that shows a random selection of levels, which is rather useful for finding some hidden gems throughout the thousands of levels that were uploaded.

## Massaging the dataset
After all the data was imported I effectively had a cloned database of the community site, but there were some issues.

Most noticeable was that the visibility field was completely off on some levels. My theory is that, in the community site's early years, if you were to mark a level as locked it wouldn't edit the level file's visibility flag, only the database flag. Thankfully I was able to get a list of these levels by simply ordering by downloads, as levels with 0 downloads would have been either locked or unlisted on the community site. I went through these and updated them to their proper state.

As there were a large amount of users who hadn't uploaded a level since the phpBB powered forum was prone to receiving a lot of spam registrations, I decided to only keep users who had uploaded at least one level. This reduced the ~13800 user count down to just ~1600 users.

## The result
In the end, the result was a new community site available under [archive.principia-web.se](https://archive.principia-web.se) containing a full archive of the levels in the old official community site, and it was announced in [this news article](https://principia-web.se/news/10) on the Principia website. The look of it is more or less identical to principia-web seeing as it was forked off it but has slightly drifted apart due to not using the same CSS.

Now that I host both sites it should also be more easy to integrate them tighter into eachother, though it has not happened yet. But in general, it has been an improvement over the previous setup and a full collection of all levels that were uploaded onto the old community site has been preserved for the future to come.
