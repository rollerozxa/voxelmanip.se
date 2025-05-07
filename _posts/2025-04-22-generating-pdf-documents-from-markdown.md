---
title: Generating PDF documents from Markdown
tags: Guides Markdown
cover_alt: Screenshot of the Markdown source for the "The Luanti Techage Backdoor" blog post to the left, and to the right is a generated PDF version of it run through the process that is described in this blog post.
---

When you are supposed to write something and submit it as a PDF document, generally the most common tool that comes to mind are traditional word processors such as LibreOffice Writer. Such word processors also provide various WYSIWYG formatting tools, and then allow you to export the document as a PDF.

But there are of course other ways to write your text documents, such as using the simple yet effective Markdown markup language. This blog post goes over how I generate PDF documents from Markdown, using Pandoc and Weasyprint.

<!--more-->

## Backstory
When I started university in autumn of 2023, we were expected to hand in written assignments in PDF format for some courses. While this is pretty standard practice for university, I'm a software engineering student and maybe sitting with a WYSIWYG word processor isn't something I'm particularly thrilled with.

The semester before I was contemplating learning LaTeX, but never got around to it for when university started. However, I was already familiar with another markup language that albeit being much simpler, I thought would likely serve my needs anyway.

That language of course being Markdown.

I did some quick research on how to go about converting Markdown to PDF and have since then ended up with a pretty good workflow using Pandoc and Weasyprint that I'll share in this blog post.

## Setting things up
You can install Pandoc and Weasyprint how you usually install your packages. I install it using `sudo pacman -S pandoc python-weasyprint` on Arch, and things will likely be easier or harder depending on what other environment you may be using.

You can find instructions on [Pandoc's installation page](https://pandoc.org/installing.html) for various platforms including Windows. Weasyprint is a Python library, and it is enough for the `weasyprint` command to be accessible on the PATH by Pandoc, so installing it [from PyPI through `pip`](https://pypi.org/project/weasyprint/) should work fine.

## Conversion
Once prerequisites have been set up, grab a Markdown document to convert. The markdown file is the input, then specify an output file with `--output=`, and specify `--pdf-engine=weasyprint` to use Weasyprint as the PDF generator engine:

```bash
pandoc document.md --output=document.pdf --pdf-engine=weasyprint
```

Your Markdown document `document.md` will now have been converted into `document.pdf`, and is ready for viewing in your favourite PDF reader.

To make things even smoother, I have a Bash script (which I call `markdown-hydrator`) that does this &ndash; converting a Markdown file with the filename passed to the script which will generate a `.pdf` with the same filename, and then opening it in my PDF reader [Okular](https://okular.kde.org/) for previewing.

```bash
#!/bin/bash
pandoc $1 -s --pdf-engine=weasyprint --output=${1/.md/.pdf}
okular ${1/.md/.pdf}
```

## The resulting output
By default it will apply some default styling giving you typical page margins, a serif font, and some other things. In general you should be able to convert just about any Markdown document and the output will be fairly alright to send off to wherever it's going to, without needing to go deeper.

Basically everything you'd want from standard Markdown is supported. Headers, text formatting, tables, and more. Fenced code blocks with a language set will get nice syntax highlighting, and it's possible to embed images into the PDF simply by putting them next to your Markdown document and linking them like you usually would.

It will also make use of some front matter metadata in the Markdown document, if it exists. For example, you can put a title and subtitle for the document in the front matter, which will be rendered as a title and subtitle at the top of the PDF document:

```markdown
---
title: Page title
subtitle: Page subtitle
---
```

Plain inline HTML is also possible to be put in the document if you need something that Markdown doesn't offer, and it will be generated like you generally expect it to do.

## Styling it with CSS
However since we're going through HTML and Weasyprint to render the PDF, we also have the ability to add our own CSS stylesheet to it, in addition to just putting plain HTML intermixed with Markdown. Simply pass `--css` with the path to a CSS stylesheet to be included when rendering:

```bash
--css=style.css
```

Do note that when you are doing this then some default styling applied somewhere along the way will disappear. For example, you may want to add some code to make images scale down again and center the title and subtitle.

```css
img { max-width: 100%; }
.title, .subtitle { text-align: center; }
```

If you want to adjust the margins, you can do something like this in the special [`@page`](https://developer.mozilla.org/en-US/docs/Web/CSS/@page) CSS rule for styling a whole printed page:

```css
@page {
	size: A4;
	margin: 15mm 20mm;
}
```

In fact, CSS has a lot of useful tricks when you are styling a printed document rather than a webpage. For example if you want code blocks to not break in the middle when going to a new page, you can use the following snippet:

```css
pre {
	break-inside: avoid;
}
```

## Conclusion
I've been using this workflow for writing and handing in many written reports and other assignments across many courses in the time I've been at university, and it has always worked pretty well. Of course there have been some times when we have been handed a very clear document template we've been supposed to use, and I've usually just conceded to using LibreOffice for those assignments. My university prides itself on students only needing to make use of open source software when studying software engineering, so they always get provided as ODT documents anyway.

For me, Markdown is quite a frictionless way of doing writing, compared to WYSIWYG word processors where the formatting that gets applied is rather opaque. [xkcd 2109](https://xkcd.com/2109/) brings up invisible formatting, but my personal gripe usually ends up being line heights which always and without exception will become messed up in some way when writing any longer documents. All of this becomes a non-issue when you transparently see the formatting that you use.

I do admit that's the programmer in me speaking but hey, if you've come this far you probably agree with that.

On a final note about Weasyprint: If you really want to, you could also drop the middle man and write documents straight in HTML and convert it directly using Weasyprint without using Pandoc. I made [a cheatsheet a while back for Principia LuaScript](/projects/luascript-cheatsheet/), which was made in this exact way using HTML+CSS and then Weasyprint to convert it into a printable PDF. The resulting cheatsheet is something quite visually appealing and something one would have normally done in a desktop publishing program, but instead it is entirely designed just like one would make a website with HTML and CSS.
