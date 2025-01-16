---
title: Drawing text in the SDL renderer without SDL_ttf
tags: Code SDL
cover_alt: Screenshot of the main menu of Tensy, showing the text "Tensy" wiggling up and down in a sine wave pattern in front of a striped background. (The text rendering is done through what is brought up in the blog post)
---

When you want to draw text in SDL, you would usually want to use SDL_ttf which in turn depends on Freetype for font rendering, giving you nice rendered fonts. But what if you do not want this? Maybe you just want some basic text rendering for a small game, and want not include the extra dependencies because something simpler would work just as well.

When I began working on a game written in C and using SDL, I wanted to try to implement my own font renderer rather than relying on SDL_ttf. What I wanted was just a way of drawing a pixelated monospace font, and it turns out to be quite simple to do so when you're able to reduce the scope of the implementation. This blog post is a retelling of the process of doing just that.

<!--more-->

The code provided is in C and I'm using the new SDL3, which is technically not yet released as of the time of writing but has had several preview releases with a stable ABI already. You should be able to adjust function definitions and code syntax if you are using something different.

## Preparing a bitmap font
First of all you'd want to have a font texture loaded into SDL.

For demonstration purposes for preparing a texture, I'll be using the [Monogram](https://datagoblin.itch.io/monogram) font, which is a CC0 licensed pixel-style monospace font that has a bitmap version of the font ready to download.

{% include image.html
	name="monogram-bitmap.png"
	alt="Bitmap font atlas of Monogram, which is a monospace pixel-style font. The atlas maps more or less to the ASCII character set."
	caption="Bitmap font version of Monogram"
	max_width=288
	pixelated=true %}

While we could load the image itself, either in PNG format or something more simple like QOI, in this case the image is so simple with 1 bit colour depth that we can simply put the raw pixel data into the code.

The following quick and dirty Python script extracts each pixel value into a two-dimensional array, putting a 1 for opaque pixels and 0 for transparent pixels:

```python
from PIL import Image

alpha = Image.open("monogram-bitmap.png").convert("RGBA").split()[-1]
alpha_pixels = alpha.load()
binary_array = [
	[1 if alpha_pixels[x, y] == 255 else 0 for x in range(alpha.width)]
	for y in range(alpha.height)]

for row in binary_array:
	print("\t{" + ",".join(map(str, row)) + "},")
```

Once run you should get a bunch of ones and zeroes. If you paste it into a text editor and zoom out you should even be able to recognise the font! We'll put the generated image data into a header file (e.g. `font_bitmap.h`) which we will load from, also specifying the dimensions of the font bitmap as well as the dimensions of individual character glyphs.

```c
#pragma once

#define FONT_WIDTH 96
#define FONT_HEIGHT 96

#define GLYPH_WIDTH 6
#define GLYPH_HEIGHT 12

const static unsigned char font_bitmap[FONT_HEIGHT][FONT_WIDTH] = {
	// Put the generated stuff here
};
```

But in order to do anything useful with this, we'll need to create an SDL texture out of it. The SDL_Texture format stores the image data on the GPU, making it quick for rendering, but less quick to manipulate.

So for creating the texture we'll first create an SDL_Surface the size of the font image and map ones to opaque white pixels, and map zeroes to fully transparent pixels, then create a texture out of the surface to upload it to the GPU.

```c
static SDL_Texture* font_tex;

SDL_Texture* load_font(SDL_Renderer *renderer) {
	SDL_Surface *surface = SDL_CreateSurface(FONT_WIDTH, FONT_HEIGHT,
		SDL_GetPixelFormatForMasks(32, 0x00FF0000, 0x0000FF00, 0x000000FF, 0xFF000000));

	Uint32 white = SDL_MapSurfaceRGB(surface, 255, 255, 255);
	Uint32 black = SDL_MapSurfaceRGBA(surface, 0, 0, 0, 0);

	for (int y = 0; y < FONT_HEIGHT; ++y) {
		for (int x = 0; x < FONT_WIDTH; ++x) {
			Uint32 color = font_bitmap[y][x] ? white : black;
			((Uint32 *)surface->pixels)[y * FONT_WIDTH + x] = color;
		}
	}

	SDL_Texture *texture = SDL_CreateTextureFromSurface(renderer, surface);
	SDL_SetTextureScaleMode(texture, SDL_SCALEMODE_NEAREST);
	SDL_DestroySurface(surface);

	return texture;
}
```

Now to test the rendering you can put this in your rendering loop:

```c
load_font();
SDL_RenderTexture(renderer, font_tex, NULL, NULL);
```

You should see the font texture show up spread across the whole screen.

## Drawing a character
Now that we have the bitmap font loaded as a texture, we can make a function to draw one character from this font.

```c
void draw_char(SDL_Renderer *renderer, unsigned char character, int cx, int cy, int scale);
```

To make sure the font is loaded you can put some lazy loading at the start of the function if the font texture `font_tex` is is undefined.

```c
if (font_tex == NULL)
	font_tex = load_font(renderer);
```

To find the corresponding character in the font atlas, we'll need to divide it up into a grid. `FONT_WIDTH / GLYPH_WIDTH` will get us the amount of characters per column, and modulating the character code with that will get us what column the character is in, then performing integer division on the character code to get the row.

```c
SDL_Point cell = {
	(character-32) % (FONT_WIDTH/GLYPH_WIDTH),
	(character-32) / (FONT_WIDTH/GLYPH_WIDTH) };
```

The magic number 32 corresponds to the starting character of the font atlas in ASCII. If you look at a [character set for ASCII](https://en.wikipedia.org/wiki/ASCII#Character_set) you can see two rows of control characters that precede the space character - the Monogram bitmap font starts at the space character so we simply realign it so you can provide ASCII character codes and get the corresponding glyph in the atlas.

Now the glyph needs to be cut out from the atlas texture. The `SDL_RenderTexture` function takes two rect arguments, the first `srcrect` is what we're interested in.

Normally if you want to display the whole texture you pass `NULL` to it and move on to the `dstrect`, but this time we want to calculate the rect of the glyph we want. Taking the cell coordinates and multiplying them by the glyph size.

```c
SDL_FRect srcrect = {
	cell.x * GLYPH_WIDTH,
	cell.y * GLYPH_HEIGHT,
	GLYPH_WIDTH,
	GLYPH_HEIGHT };
```

Then the destination rect, which should be pretty self-explanatory - just the size of a glyph, scaled to the scale.

```c
SDL_FRect dstrect = {
	cx,
	cy,
	GLYPH_WIDTH * scale,
	GLYPH_HEIGHT * scale };
```

Now render the texture with the above rects!

```c
SDL_RenderTexture(renderer, font_tex, &srcrect, &dstrect);
```

Then, usage of the resulting function would be as such:

```c
draw_char(renderer, 'E', 20, 20, 2);
```

{% include image.html
	name="drawing_char.webp"
	alt="Rendered character: 'E'"
	max_width=64
	pixelated=true %}

Impressive, very nice. Now let's see how to draw more text.

## Drawing text
Once you have written a function to draw an individual character, the function to draw multiple comes easy.

Since we're using a monospace font we can take some shortcuts by spacing everything with the glyph width times the scale, and then iterate over the string until the ending null byte is reached:

```c
void draw_text(SDL_Renderer *renderer, const char* text, int x, int y, int scale) {
	for (size_t i = 0; text[i] != '\0'; i++) {
		draw_char(renderer, text[i], x + i * GLYPH_WIDTH * scale, y, scale);
	}
}
```

Simply use it as such:

```c
draw_text(renderer, "Hello SDL. Look, no SDL_ttf!", 20, 20, 2);
```

And you've got a nice text string on the screen.

{% include image.html
	name="drawing_text.webp"
	alt="Rendered text: 'Hello SDL. Look, no SDL_ttf!'" %}

## More...
Now that the basic functionality is done there are probably more features you would like to add, such as being able to set the font colour by applying `SDL_SetTextureColorMod` on the font texture and then rendering multicoloured text. Or making text with a shadow, by drawing black coloured text with a particular position offset and then drawing the text again with the wanted colour on top. You could also calculate the dimensions of the resulting text and do linebreaks or wordbreaks at appropriate places when the text runs off the screen.

The code examples above more or less describe a simpler form of the text drawing functionality I implemented for Tensy, a small puzzle game I have been developing on-and-off for some months. The full code in question can be found at [src/font.c](https://github.com/rollerozxa/tensy/blob/master/src/font.c) and includes drawing text with a shadow, with different colours, and likely more in the future if I have a need for it.

### SDL_RenderDebugText
While this blog post was sitting in a work-in-progress state, the SDL 3.1.6 preview was released in the meantime which adds the [SDL_RenderDebugText](https://wiki.libsdl.org/SDL3/SDL_RenderDebugText) function.

{% include image.html
	name="render_debug_text.webp"
	alt="Demonstration of the SDL_RenderDebugText function, rendering text in varying colour and scale"
	caption='(Screenshot of the <a href="https://examples.libsdl.org/SDL3/renderer/18-debug-text/">debug-test</a> SDL example)' %}

As the function name says, it is primarily for debugging and is not exactly intended to be flexible, but it is in fact available out of the box with SDL3 and could come useful due to this if you just want to grab the quickest possible text rendering at an early stage.
