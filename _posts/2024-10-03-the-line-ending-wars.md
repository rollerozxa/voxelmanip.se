---
title: The Line Ending Wars - Carriage Return
tags: Humourous
no_cover: true
---

*This is an amusing story about line endings. Originally written as a post for the Voxelmanip Forums, extended and improved as a post on this blog.*

Carriage Return, also known as CR, also known as `\r`, also known as `0x0D`, is the bane of every developer working on both Unix-like and Windows systems, as well as the bane of every web developer working with forms.

<!--more-->

Legends say, that it all started in 1960 when Cary Returno tried to send a letter without a postage stamp, and getting it swiftly returned to sender. On that day, Mr. Returno swore to curse every computer developer with endless misery. 15 years later this became a reality.

While that may not be the case, the beginning story of our titular character was in the advent of typewriters. Carriage Return was a control character to move the typewriter's position to the beginning column, while Linefeed moves the position down a row. Together this would create a new line in your document. If this is the first time you realised that the computer you may be sitting at right now is just an overgrown typewriter with colour, you're welcome.

Once typewriters became digital and you could play games on them, it needed to be decided how newlines are represented in plain text documents. Unix decided upon simply LF, which has tricked down into practically any operating system based on or inspired by Unix. CP/M decided upon CRLF, a combination of two control characters in the text file for representing a newline, which made its way for several layers of compatibility into this little known operating system called Windows.

So when making a new line, programs generally have the choice of representing the newline as one or two characters. Either simply `\n` (LF), or `\r\n` (CRLF). The latter is preferred by things that have had too much exposure to the contamination of Windows, the former is preferred by that which look beyond anything with CP/M legacy. In addition to this, Classic Macintosh used to simply use the CR character for newlines. This was however later changed with the advent of OS X which aligned newlines with the way Unix works, and it is likely well out of view of the rear mirror at this point.

Most programs are destined to have to deal with both CRLF and LF, or convert to one or the other transparently. However, some programs aim to make a political statement. Windows' batchfiles treat `\n` as simply thin air if it is not preceded by an `\r` beforehand, Notepad also behaved in this manner [up until recently](https://devblogs.microsoft.com/commandline/extended-eol-in-notepad/). On the other side, the Bourne Again Shell and others make a statement in favour of LF. This is especially disturbing if you run the Bourne Again Shell on enemy turf inside the MSYS2 environment, watching in real time both sides colliding in the comfort of your computer.

{% include image.html
	name="msys_pkgbuild_crlf.webp"
	alt="ERROR: PKGBUILD contains CRLF characters and cannot be sourced."
	caption="*Reaches for dos2unix*" %}

In a moment of brilliance by whoever decided on the web standards, they felt that web developers aren't suffering enough and decided that CRLF is the default form of newline in HTTP. It is used for newlines in HTTP headers, and it is used for form data, to the horror of any web developer who has to watch in terror as their backend parses these cursed line endings.

Many code functions have been written to solve one problem - strip those damn `\r` characters. This code snippets originates from a mentally ill PHP developer's codebase (The illness caused either by CRLF or PHP, doctors are still uncertain about the cause):

```php
function normalise($text) {
	// I HATE CRLF I HATE CRLF
	return trim(str_replace("\r", "", $text));
}
```

The Git version control system goes to great lengths to adapt itself to the differing line endings, and tries its best to normalise line endings to LF when `* text=auto` is put in the `.gitattributes` file in a repository. For Git users on Windows there is also the `core.autocrlf` setting which will convert files on the fly to CRLF when checked out of Git while converting back to LF when committing to a repository.

{% include image.html
	name="git_crlf.webp"
	alt="Screenshot of a page in the Git setup about configuring line ending conversions."
	caption="Do I look like I know what a CRLF is? I just want to version my code!" %}

The reason Git needs to care so much about line endings is of course because of its text diffs, which can easily break down when the line endings change as the diff algorithm will now think something has been changed on every line, if commits switch back and forth. There are of course ways to ignore such changes just like with whitespace changes, but in general Git tries to normalise everything to LF unless you absolutely insist.

There can be so much to be said about our little Carriage Return. But in the end, the world keeps spinning and systems keep running, no matter what kind of line ending sequence is used. Most simply do not notice unless they go looking for it, or when a program occasionally exposes the difference to the user.

And that is all.
