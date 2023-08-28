---
title: Reinventing The Wheel
subtitle: "<b>Alternate title:</b> Writing a Wiki software from scratch"
---

The current gold standard of Wiki software would have to be MediaWiki. It is developed by the Wikimedia Foundation and is used by most Wikis on the internet, including Wikipedia and related projects. While it's certainly a very well polished piece of software that is designed to be able to handle a website within the top 10 websites (Wikipedia), it is a quite large piece of software that scales down poorly to a small Wiki hosted on a low-end server.

<!--more-->

So when I wanted a new Wiki for the game Principia, I wanted to write my own Wiki software. Because how difficult can it be? A Wiki is essentially a database of text files with revision history anyone can edit, anything else would be blåt.

However, I quickly realised there's more to a Wiki than that. I had whipped up an extremely basic implementation of a Wiki for principia-web back in March of this year, and picked up it during September, writing and managing content for the Wiki simultaneously as I wrote the software.

## Page revisions
For an user-editable Wiki to be usable, it will need to keep some kind of history of page revisions. Otherwise any potential spammer or malicious user would be able to cause actual damage to the content, rather than just a couple steps to revert to the previous revision.

So every time you make a new edit to the Wiki, a new row in the page revisions is made linked to the particular page and revision number. This creates a history of how the page has morphed throughout its existence, which can be traced back afterwards. For every revision, the length of the page is recorded and compared against the length of the previous page revision. This creates a fairly basic representation of how the size of a page has changed.

```
22:14, 2022-10-27  (4278 bytes) (+1338) (write some ^^)
10:19, 2022-10-22  (2940 bytes) (+240) (finish the sentences I started)
17:30, 2022-10-18  (2700 bytes) (+1218) (Add some notes/pitfalls)
09:06, 2022-10-13  (1482 bytes)
```

For seeing what has been changed in a particular revision for reviewing what has been changed, it is useful to view the difference between two revisions. Implementing a Diff engine yourself is pretty redundant as there are already hundreds of such libraries available. I simply picked one and [pretty colours!](https://principia-web.se/wiki/LuaScript?action=diff&prev=1&next=2)

## Formatting
Markdown is pretty much the golden standard for text formatting, with wide support from parsers and such. MediaWiki's wikitext I personally find quite gross (too much apostrophes and equal signs everywhere), but there are some things I would like to keep such as a wikitext-like link shorthand [[straight]] out of [[DELTARUNE]] for linking to other internal pages on the wiki. Something like `[RC MONSTRO](/wiki/RC_MONSTRO)` simply becomes `[[RC MONSTRO]]`.

As a bonus, implementing this also allows me to check whether the page actually exists. In MediaWiki if a page that is linked to does not exist it will be marked as red, signalling to someone that maybe it should be created. So whenever the parser detects a wikitext link it can query the database to check if a page exists with that name, and if it does not exist the link is marked as red. Put caching in front of the database query and it becomes quite performant, the cache gets populated quite quickly and the only time the cache needs to be invalidated is when a nonexistent page has been created.

In addition I also wanted some kind of table of contents for pages, so for pages with many sections (e.g. the [LuaScript page](https://principia-web.se/wiki/LuaScript)) you can put a table of contents at the beginning. I simply took a [TOC extension for the Parsedown library](https://github.com/BenjaminHoegh/parsedownToc) I use and customised it to look more like MediaWiki's table of contents.

## Reusable templates
If you've ever edited a Wiki, you might be aware of templates which are reusable modules which can be inserted into a page. They take certain input and generate things like infoboxes, message boxes, warning boxes, cardboard boxes... You get the point.

For MediaWiki there are two competing implementations for getting templates. The first is ParserFunctions which implements custom logic handling in wikitext, allowing for dynamic templates that can work with input like a programming language. The second is Scribunto, which makes use of the Lua scripting language for templates.

For the principia-web Wiki, I implemented something I like to cutely call "Poor Man's Scribunto". Essentially it takes input from a page in the form of JSON data, and then runs a Lua bootstrap script that in turn runs the script associated with the particular template. For example:

```lua
-- scripts/test.lua
-- Example input: {"some_key": "some text here"}
local l, json, data = ...

l.write('<div class="cool_box">%s</div>', data.some_key)
l.output()
```

This is fairly basic and bare-frills, it just runs a script using the regular LuaJIT interpreter and takes the outputted content to put it on the rendered page. There is no real sandboxing or security, but the template scripts are part of the source code and get vetted before being pushed, so it all works fine anyway.

## Page analysis
Another pretty useful feature of MediaWiki is its wealth of special pages that analyse the content in the Wiki in different ways, such as listing the shortest pages, the least updated pages, orphaned pages, wanted links... In order to ease maintenance and further growth of the Wiki and its content.

Some of these are quite trivial to implement, e.g. shortest pages, which is just measuring the size of each latest revision and ordering them in ascending order. Some, like the wanted links page, require iterating over each latest revision and checking every wikilink for existence. In general I've just implemented pages as I've needed them, for instance I implemented the wanted pages in order to check that all links point to an existing page.

## More...
MediaWiki of course has much more than this. But most of that is quite frankly superfluous or unnecessary on the small scale that the Principia Wiki operates. If anything turns out to be necessary later down the line, it just needs implementing.

For instance, I would like to offer some kind of complete offline copy of the Wiki. Both for referencing to without the need for an internet connection, and potentially for inclusion in Principia as a replacement for the object help texts. Theoretically, it would be as simple as iterating over all pages, rendering them with a more simple layout template, and saving them to a folder which can be zipped and provided for download. I'll have to see about that.
