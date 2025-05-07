---
title: Small useful tools for web development
tags: Listicles Web
cover_alt: Screenshots of the Google Webfonts helper, RealFaviconGenerator and Pictogrammers websites stacked on top of eachother.
---

This blog post goes over some small tools and utilities I have come across and that I find useful for web development. They're not things like code editors, the developer tools in your web browser or documentation resources, but small tools that help you with one specific thing that you're bound to run into when making any website.

<!--more-->

## [Google Webfonts Helper](https://gwfh.mranftl.com/fonts)
[Google Fonts](https://fonts.google.com/) is a service that allows you to load a wide range of freely licensed custom webfonts from Google's CDN rather than needing to rely on the classic set of web safe fonts. However there is nothing stopping you from hosting the font files yourself as they are quite small in size, and it can even be beneficial for performance in some cases to keep all associated requests for a page on one domain.

You can of course download them from Google's CDN by going into the generated CSS and downloading the linked fonts, but Google Webfonts Helper prepares the fonts and associated CSS a lot more conveniently for quickly putting it into your website.

While [WOFF2 has been widely supported for many years by now](https://caniuse.com/woff2), it also offers the fonts in other formats if you need legacy support beyond what WOFF2 offers, as far back as Embedded OpenType for older versions of Internet Explorer! You're likely okay going with just WOFF2 as any potential old browsers would fall back to the web safe fallback font you have selected in the font sequence, but the option is always there for absolute compatibility.

Once you have selected your fonts along with the weight variants and charset support, it will offer all of them as a .zip download to extract into your static assets directory along with a block of CSS you can paste into your stylesheet to load them.

## [RealFaviconGenerator](https://realfavicongenerator.net/)
Nowadays, the so-called "favicon" goes a lot further than just providing a simple favicon.ico at the root of your website. You've got icons in varying sizes for desktop and mobile, manifest metadata and maybe even more? It's gotten quite messy over the years.

With RealFaviconGenerator you upload a full sized icon to the website and then you have the option of customising how it will look like across browsers as well as on iOS and Android. It will then generate all the icons you need along with the HTML tags you should put in the head of pages.

It will also not generate obsolete icons you don't need anymore such as the Windows Metro icon and the MacBook Touch Bar icon, as well as favouring a favicon in vector format over making a dozen different sizes of bitmap favicons. If you provide a vector image as the input then this is what it will use for the vector favicon rather than embedding a bitmap, and rasterise the rest of the icons it generates.

In general it turns generating favicons for a website into a pretty straightforward experience.

## [Material Design Icons / Pictogrammers](https://pictogrammers.com/library/mdi/)
Not necessarily a tool as much as it's a library of icons. It has thousands of flat icons in the Material Design style, both the original set from Google as well as custom ones from the community, and all of them are under the Apache-2.0 license. Simply search for and download in SVG vector format whatever icons you would want for your iconography.

In addition to just being able to download individual SVG files there are also libraries for some JavaScript frameworks that allow you to automatically import icons by referencing their name.

## [OpenGraph.xyz](https://opengraph.xyz)
Meta tags are invisible HTML tags that are put in the head of the document for search indexers to get an understanding of a page, or to create rich embeds when a link is posted on other platforms. As they are not part of the visible document, it may also be easy to make mistakes in relation to how they are displayed in certain places.

There are likely hundreds of other similar sites that do the same thing of visualising the metadata in a way common services do it, but this is the one I typically use sometimes to make sure everything looks right on a live site.

## ["How to Center in CSS"](http://howtocenterincss.com)
This one is admittedly a bit tongue-in-cheek and perhaps dated now in 2024 (wow look, it mentions IE6!) when support for Flexbox has become almost universal, making centering things a much more straightforward process most of the time. Nonetheless it may of course be useful when you're really lost and you ask yourself the age old question: How do I center in CSS?
