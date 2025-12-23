---
title: Gallery
layout: retro
permalink: /retro/gallery.htm
images_base: "photos"
dir1_count: 7
dir2_count: 100
---

<a href="/retro/index.htm">Back to main page</a>

This is a gallery of photos I have taken with a rather cheap camera I got from a flea market. I don't think most of them are any good, but here they are anyway.

<div class="galleri">

{% for i in (1..page.dir1_count) %}
	{% assign padded = i | plus: 100000 %}
	<a href="{{ page.images_base }}/1/DC{{ padded | slice: 1,5 }}.jpg" target="_blank">
		<img src="{{ page.images_base }}/1/DC{{ padded | slice: 1,5 }}.jpg" alt="">
	</a>
{% endfor %}

{% for i in (1..page.dir2_count) %}
	{% assign padded = i | plus: 100000 %}
	<a href="{{ page.images_base }}/2/DC{{ padded | slice: 1,5 }}.jpg" target="_blank">
		<img src="{{ page.images_base }}/2/DC{{ padded | slice: 1,5 }}.jpg" alt="">
	</a>
{% endfor %}

</div>
