---
title: How (not) to compare strings in C
tags: Anecdotes C/C++ Informational
cover_alt: Screenshot of some C code with a screenshot of a message box laid on top of it describing an assertion failure occurring in the shown code. An X_X (dead eyes) emoticon is visible below the message box, signifying some kind of embarrassment.
---

When you are previously used to working with higher-level programming languages and pick up a lower-level language, there tends to be a lot of things you previously took for granted working at a higher level that suddenly become visible. And the programmer becomes more thoughtful, more resourceful.

But there are also things that you *think* may work like they did in the languages you were previously used to, while in reality being completely different. One such example would be strings in C, specifically how to compare two strings against each other, and how *not* to compare them.

<!--more-->

## Comparing strings in C
To begin with, what we refer to in C as "strings" are in fact simply `char` arrays, with each entry being one character byte. This means that operating at a character-level on strings is quite intuitive as they're quite literally just arrays when you look at them. But because of this, there is not a lot of syntactic sugar in the language for working with such strings.

For example: Performing a traditional equality check in C, as you would maybe try to do in a higher-level language with the `==` operator, will simply compare the memory location of the first character in the string.

```c
if (str1 == str2)
	printf("Strings are equal!"); // Good luck having this run
```

Generally, this behaviour is more or less useless unless you actually do want to check that two string variables point to the same location in memory. What you usually want to do is actually compare the strings character-by-character, a function for which is available in the C standard library as `strcmp`:

```c
if (strcmp(str1, str2) == 0)
	printf("Strings are equal!"); // Slightly higher chance of this running
```

With a small (or big) asterisk however, that `strcmp` only works with properly null terminated strings. Without the null byte it will just begin comparing random bytes in memory until the operating system kills your process, or something else bad happens.

What you should generally use, for basically anything other than comparing string literals you know for sure are null terminated, is `strncmp`. It has a third argument to limit the upper bound of how far it will iterate.

```c
// Let's say str2 is 32 bytes in length and the shorter of two strings.
str[31] = ' '; // Oh dear!
if (strncmp(str1, str2, 32) == 0)
	printf("Strings are equal!"); // No issues :)
```

However there are some cases when doing an incorrect `str1 == str2` comparison will still work, by sheer luck with some compiler optimisation magic, that I happened to discover by doing this exact mistake.

## The mistake
I've been working on a game called Tensy for some time now, writing it in C using SDL3. When I implemented the scene system for it, I wrote a function that would change the current scene to the scene name that is passed to the function. It goes through the list of registered scenes until it finds the scene with that name, to retrieve its numeric scene ID. Simple linear search for a small list, no big deal:

```c
for (size_t i = 0; i < MAX_SCENES; i++)
	if (name == scenes[i].name)
		current_scene = i;
```

But I was maybe writing it a bit too hastily, and I ended up trying to compare the strings using a plain `==` which generally shouldn't work. Because there is no way two string literals, identical in content but defined in two different source files, would end up pointing to the same memory location and make this accidentally work?

## It still worked.
And I carried on with the game, scene switching seemingly working fine despite this mistake in the code.

At least until a certain, very familiar character, showed up.

I primarily develop on Linux, where that code above worked fine, but I was also in the process of porting Tensy to several other platforms. The ones first out were Windows, WebAssembly and Android. It went pretty well and I managed to get all of them set up and building in CI.

WebAssembly and Android had no issues switching scenes when pressing the play button. But when I was testing a Windows build of the game in a virtual machine, I couldn't manage to press the Play button which should normally cause a scene switch. Hmm, strange.

At the time I figured that it was something to do with how mouse input in the VM is treated like a drawing tablet, with absolute movement and presses that might also be treated as finger touches. I've experienced an opposite thing with mouse clicks not registering when mirroring an Android device's screen to my computer using [scrcpy](https://github.com/Genymobile/scrcpy), so I didn't think much of it at the time. I shut down my Windows VM and carried on.

But one day in December after I had ported Tensy to Android, I was reading up about if SDL3 still supported Windows XP, which turns out it does. Well, it is a bit of a special case in that it is supported if people are actually willing to test it, and as long as the work to keep it functional does not impede or disrupt surrounding development.

I set things up to try to build the game for Windows XP, worked around some regressions that SDL3 had at the time with Windows XP support (which I believe have been fixed by now), and ended up with an executable targeting XP which I gleefully copied into the Windows XP virtual machine I just conveniently had at hand.

I was also making a debug build of the game, which means that SDL's assertion macros will be active. This is an important detail for when I then tried to press the play button.

{% include image.html
	name="assertion_failure.webp"
	alt="Screenshot of a message box using the blue Windows XP Luna theme. The message is 'Assertion failure at switch_scene...' which is the scene switching function that has been shown previously in the blog post."
	caption="Yes that is really Windows XP." %}

Huh! Assertion failure. Right.

When I wrote the scene switch function, I had also put a false assertion at the bottom of the function, to make sure that it would never reach that point. Because if it would finish iterating over all scenes and not find a match, then I would have made a mistake and either forgotten to register a scene or mistyped the scene name.

```c
for (size_t i = 0; i < MAX_SCENES; i++) {
	if (name == scenes[i].name) {
		current_scene = i;
		return 1;
	}
}

// (We never want to reach this)
SDL_assert(0);
```

Reading the [SDL Wiki page for SDL_assert](https://wiki.libsdl.org/SDL3/SDL_assert), it will disappear when making release builds. That way you can use it however much you want for (maybe expensive) sanity testing for debug builds during development, while not impacting anything in release builds.

It also makes use of SDL's own cross-platform message box functionality to give you a nice interactive message box with several options for how to proceed, like you can see above of it running on... Windows XP.

Sprinkling false asserts into code paths that should be unreachable in user code may be an overly defensive programming strategy, but in this case it sure worked to reveal a bug not in how the function was called, but in the function itself.

The realisation once I inspected the code of the function went like this:

> Arghh... I need to use `strcmp`...

Or something along those lines.

## Why did it work?
Doing it the wrong way worked on Linux and other platforms (at least WebAssembly and Android), but not Windows. Why so?

When you write string literals in your code, it gets stored in the `.rodata` section when linking an ELF file. It appears that as part of an optimisation, identical strings are deduplicated even across compilation units (i.e. .c source files), making them point to the exact same memory location. This of course makes sense for reducing program size, since the section is for read-only constants and will never be edited by program code, so there won't be any surprises that the string has been modified somewhere along the way.

But my Windows toolchain (llvm-mingw), linking together a PE file, didn't perform that optimisation for some reason, leading to the bug being uncovered.

Let's test this in action with a simpler example. See these two source files for a very simple reproduction case, two string literals with the same value but separated into two compilation units, and printing the memory location of both:

```c
// string.c
#include <stdio.h>

const char *text1 = "hello world";
extern const char *text2;

int main() { printf("%p\n%p\n", text1, text2); }
```

```c
// string2.c
const char *text2 = "hello world";
```

Compiling these source files into an executable with Clang on Linux shows that the memory location of the strings are the exact same, at any optimisation level:

```bash
$ clang string.c string2.c -o string && ./string
0x5ad37000d004
0x5ad37000d004
```

And, this behaviour can be seen with GCC on Linux too, if basically any optimisation level has been set:

```bash
$ gcc string.c string2.c -O2 -o string && ./string
0x5e953381400b
0x5e953381400b
```

Looking at the GCC argument reference gives us the particular flag which controls this behaviour, which as we noticed is enabled by default on any optimisation level.

> `-fmerge-constants`<br>
> Attempt to merge identical constants (string constants and floating-point constants) across compilation units.
>
> Enabled at levels -O1, -O2, -O3, -Os.

Now, let's try compiling it instead with my llvm-mingw Windows compiler:

```bash
$ x86_64-w64-mingw32-clang string.c string2.c -o string.exe && wine string.exe
0000000140003090
00000001400030B0
```

Ignoring the fact that the output looks different since it has become a Windows program now, the memory addresses do not match! It does not matter what `-O` optimisation level is passed, when LLVM/Clang is generating a PE file it simply will not deduplicate string literals across compilation units like could be seen when compiling for Linux.

Unless you enable link-time-optimisation, that is:

```bash
$ x86_64-w64-mingw32-clang string.c string2.c -flto -o string.exe && wine string.exe
000000014000354F
000000014000354F
```

Which brings us back to how GCC only did this when optimisation is enabled - deduplicating string literals across compilation units is only possible when you have the full picture of the entire program's compilation units at the very end of the build process, and you are linking them together into the final executable. However rudimentary it may be, it is indeed a *link-time optimisation*.

## Closing words
The reason it ended up working by accident does indeed make sense when you start to peek under the hood and look at certain optimisations that are done by the compiler, but this is very much an optimisation done at the compiler's discretion that you should *never* rely on, as it is very clearly **undefined behaviour**. Even if you are using the same compiler, just changing the target can be enough to change the code generation in unexpected ways.

It was quite interesting how a small mistake led me down the path of being able to witness one of the many clever optimisations that compilers take to make the code it is provided smaller and more effective. It will also always make me remember to use `strcmp` in the future when comparing strings in C. Or `strncmp`. Well, you get the point.
