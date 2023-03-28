---
title: Userstyles
---

Since I believe in user choice, I have compiled a list of various userstyles to change the appearance of this site. If you have a hard time reading white monospaced font on a dark background and wish for something better, these are for you.

For applying them, I recommend Stylus. It's available both for [Chromium-based](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne) and [Firefox-based](https://addons.mozilla.org/firefox/addon/styl-us/) browsers as an extension. Click on the extension icon, press the "(Write style for) rollerozxa.github.io" link, and paste the CSS code for the userstyles you want to enable. Some can even be combined together!

## Different fonts

### Roboto Slab (serif)
Serif fonts are the king of readability, even on the web, so here is a userstyle that changes the font to Roboto Slab. It is a part of the Roboto family of fonts and also my favorite serif font. ROllerozxa approved!

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@400;700&display=swap');
body {
	font-family: 'Roboto Serif', serif;
	font-size: 13pt;
	line-height: 1.8;
}
```

### OpenDyslexic
I'm not dyslexic so I don't know how well it works, but OpenDyslexic is a font that's supposed to improve text readability for dyslexic people. This userstyle requires the font to be installed on your system for it to work.

```css
body {
	font-family: OpenDyslexic;
	font-size: 14pt;
	line-height: 1.8;
}
```

## Light mode
*(Note: This style is currently a bit broken as I've changed around the styling of the site.)*

If you prefer a light mode, here is an userstyle for you... Why you ever would want this. I take no responsibility for any eyestrain or loss of sight.

```css
body {
	background-color: #cacaca;
	color: #151515;
}

a {
	color: #186d9d;
}

:root {
	--main-bg-color: #007945;
}
header, table th, hr, .table td {
	border-bottom: 2px dashed var(--main-bg-color);
}
header h1, h1, h2, h3, h4, h5, h6, pre {
	color: var(--main-bg-color);
}
footer {
	border-top: 2px dashed var(--main-bg-color);
}
.table, .hexeditor {
	border: 2px dashed var(--main-bg-color);
}
.hexeditor .offset {
	border-right: 2px dashed var(--main-bg-color);
}
```
