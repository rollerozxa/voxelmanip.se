---
title: A wet physics gamedev adventure
tags: Gamedev Projects
cover_alt: A screenshot of the water simulation game
---

This is a blog post chronicling the initial development of a physics-based water game of sorts using C, Box2D, SDL3 and OpenGL. The idea of it is something I have been wanting to make into reality for a long time, and the concept is inspired by one of my favourite games of all time.

<!--more-->

## Inspiration
Hydroventure (also known as Fluidity in America) was a WiiWare game originally released in 2010 by Curve Studios. It is a physics-based puzzle platformer where you control a small body of water that later can learn new abilities and transform into different states. You would then navigate through an open world to collect rainbow drops by solving puzzles and other challenges, which would unlock new parts of the world metroidvania style.

{% include image.html
	name="hydroventure_screenshot.webp"
	alt="Screenshot of Hydroventure (running in Dolphin)" %}

As you may know, the Wii Shop Channel was shut down for new purchases in January of 2019, and with that made all games that were still exclusive to WiiWare unavailable to obtain through legal means (but of course, not lost forever). Hydroventure later got a spin-off/sequel for the 3DS by the name of Hydroventure: Spin Cycle in 2012, and... the 3DS eShop has also closed down for new purchases, making it unavailable as well due to being digital-only.

The series has remained dormant for over a decade at this point, but I am sure there are still other fans of the game somewhere out there.

I originally played the Wii version of Hydroventure back in the day when I was a kid. At first I would replay the DEMO version over and over again, but eventually I would get the full game. It is safe to say that it is one of my favourite games of all time. I would even scribble out ideas for new levels for the game in a drawing book I had, when I was not playing the actual game.

{% include image.html
	name="level_drawing.webp"
	alt="Photo of a drawing of a custom Hydroventure level taking place in a sprawling cave system, ending with a room where you need to defeat three enemies to unlock the rainbow drop."
	max_width=300 %}

Previously I have made a similar kind of prototype for a Hydroventure-like water game using GDevelop back in 2021:

{% include youtube.html id="DiNIz6dnQEY"
	max_width=640 %}

However it didn't go very far, as I quickly shelved the project due in part to GDevelop not feeling like the right choice for such a game &mdash; the backing engine of GDevelop is written in JavaScript and other web technology, and as you can see from the video above even just putting a small amount of water particles together in a simulation was enough to cause frame drops. But I still had the idea in the back of my mind, for whenever I felt I would be ready to give it another attempt.

And now, hot on the heels of having released [Tensy](/2025/11/23/tensy-has-been-released/) which is a game written in C using SDL3, I felt like I finally have the tools and knowledge for a more serious attempt at creating a physics-based water game.

## First prototype
First off, I just wanted to get a physics simulation up and running. I grabbed some project boilerplate from Tensy and pulled in Box2D as the physics engine. I'm sure there are fancier ways to do water simulation, but just using very small circle rigidbodies in Box2D is what I've seen as mostly good enough. And that's what I did, spawning a big bunch of circular water particles into a rectangular area that drops onto some static terrain rectangles.

Then in order to create the ability to move the water around, I change the gravity of the world depending on an angle, as well as rotating the rendered world in order to create the effect of tilting the world. Initially I implemented keyboard controls for testing, fully tilting to the left or right using the arrow keys.

Controlling using the arrow keys works fine for demonstration, but the proper way to play this game is to use an accelerometer sensor from a game controller or a phone to get the tilt angle. So I implemented accelerometer sensor input support using SDL's sensor API, and then grabbed the Android build folder from Tensy and modified it to get it built for Android and running on my phone.

{% include video.html
	name="early_prototype_on_phone.webm"
	max_width=640 %}

The poor webcam quality makes the water look better than it actually was. In reality it was just a bunch of blue outlined circles drawn to be slightly bigger than their physics bodies in order to make them overlap a bit.

{% include image.html
	name="early_prototype_screenshot.webp"
	alt="Blue outlined circles being kept collected by some green rectangles representing terrain." %}

## Fancier water rendering
While just rendering blue circles gets the point across, it doesn't look very much like water. We can do better!

Typically to render more realistic water you would turn them into [metaballs](https://en.wikipedia.org/wiki/Metaballs), creating blobby connections between the particles when they are close to each other. I came across [this blog post by Dave Gill about doing fluid rendering](https://davegill.io/blog/fluid-rendering-with-box2d/), with the GLSL shader being of most interest to me.

While I was still using the SDL renderer at this point, if you force it to always use an OpenGL backend you can pretty reliably bolt your own GL code on top of it... Probably. If you're careful, flushing the renderer beforehand and resetting all the state back to how the renderer left it when you're done.

So that's what I did, and it worked out pretty well.

{% include image.html
	name="initial_water_shader.webp"
	alt="Initial water shader rendering showing blobby metaball effect." %}

It basically just renders the water particles as circles to an offscreen framebuffer and then runs a shader over that for post-processing to create a nice blobby metaball look. I felt impressed, even just being able to get the shader working.

Around this time I also implemented some more controls, such as being able to make the water jump by pressing the up arrow key and being able to collect up the water by pressing F, just like with the original game's collect ability.

{% include video.html
	name="initial_water_shader_video.webm"
	max_width=700 %}

...Um, well, I was also using immediate mode OpenGL to implement the new water rendering which is surely not what you should be doing nowadays. Most importantly, immediate mode OpenGL does not exist in OpenGL ES 2.0 and above, meaning that the game would not run on my phone anymore.

But now that I was already using raw OpenGL for rendering the water, I looked at the rest of the rendering code that still used the SDL 2D renderer and thought to myself...

## Why am I using the SDL renderer anyway?
That's a great question! For Tensy using the SDL 2D renderer made sense since it fits pretty snugly into the basic graphical needs of the game, and also made it portable to platforms that don't have OpenGL support due to the different backends that SDL provides. But now that I have already tied myself to OpenGL for the water rendering, why don't I just go all the way and make my own renderer?

Well, that's what I did.

However, new to SDL3 there is also the GPU subsystem providing much more advanced cross-platform graphics capabilities including cross-platform shader support. Why did I not go with this one? Well, mostly ideological reasons. The GPU subsystem in SDL3 only supports Vulkan, Direct3D 12 and Metal, with an intentional exclusion of OpenGL.

While this is understandable as OpenGL is very much a "legacy" technology nowadays, it is still a single sorta-cohesive graphics API you can target with very wide compatibility, including older phones with OpenGL ES as well as the web with WebGL (translating to some kind of OpenGL ES). Locking myself into modern graphics APIs would be unfortunate especially since the game wouldn't be very graphically intensive anyway.

As for the target GL version, I went at around OpenGL 2.0 / OpenGL ES 2.0 since this is also the minimum that Principia targets. This is **extremely** old nowadays (OpenGL 2.0 is older than me!) and I would probably bump it up to OpenGL 3.2 Core sometime later, but if it works for Principia then I should have absolutely no problems &mdash; as long as I do not use legacy immediate mode OpenGL then things should be smooth sailing.

## The OpenGL renderer
While I've tried to learn OpenGL from the ground up in the past and have a basic understanding of how things should generally go together from working on Principia, this was very much the first time I have truly diven deep into OpenGL graphics programming. I read through [open.gl](https://open.gl/) once again, grabbed [linmath.h](https://github.com/datenwolf/linmath.h) for some matrix maths and got to work...

The progress of writing an OpenGL renderer typically starts out looking something like this after a while of just writing code:

{% include image.html
	name="gl_renderer_1.webp"
	alt="A white square drawn onto an otherwise completely black screen."
	caption="Humble beginnings."
	max_width=700 %}

Then after being excited of seeing a triangle on the screen, you start drawing more primitives to the screen with some drawing functions...

{% include image.html
	name="gl_renderer_2.webp"
	alt="Wireframe terrain shapes drawn to the screen and sharp circles to represent water particles, all drawn in bright green against a black background."
	caption="Getting basic primitives drawn to the screen."
	max_width=700 %}

Then I started work on getting the water to look like it used to, while also rewriting it to not use immediate mode OpenGL.

{% include image.html
	name="gl_renderer_3.webp"
	alt="The terrain shapes are now filled polygons, and something resembling the water is drawn, but the water particles look chunkier than they should due to the lack of the framebuffer shader."
	caption="Water looks a bit more like how it used to, but the framebuffer shader is still not working."
	max_width=700 %}

And then finally, after getting the framebuffer and shader fully working properly again...

{% include image.html
	name="gl_renderer_4.webp"
	alt="The water is now rendered with the framebuffer shader again and looks much smoother and cohesive now."
	caption="Water looks a bit more like how it used to."
	max_width=700 %}

And just like that, it looked *exactly* like it used to look like a couple days ago. Splendid! But this time it runs without the use of the SDL 2D renderer. And also no immediate mode OpenGL, so I could run it on my phone again with OpenGL ES.

While it does sound impressive, the custom renderer I wrote is still far from perfect. To name an example, it does no attempt at drawcall batching (outside of water particles that get rendered in one go), so every line and polygon is a separate drawcall. This is probably something I would need to address later on to not run into performance issues.

{% include image.html
	name="renderdoc_screenshot.webp"
	alt="Screenshot of the rendering being inspected using RenderDoc. You can see that every line and polygon is a separate drawcall."
	caption="RenderDoc screenshot of the current unoptimised rendering implementation."
	max_width=960 %}

### Addendum: OpenGL function wrangling
Originally when I got the water rendering on top of SDL's 2D renderer working, I was just using GLEW for loading OpenGL functions as that was what I had available on my system. But somewhere along the way I decided I should probably be switching to GLAD for loading OpenGL functions. While GLEW is definitely *not* obsolete, it has not seen a new release in a while and some issues are starting to crop up.

Specifically what I've experienced with Principia is that GLEW does not properly support Wayland out of the box due to preferring GLX over EGL, which some distros (but not all) carry a patch for, and a build issue on macOS which Principia carried a patch for. More generally though GLAD also supports OpenGL ES too in a single file, becoming a simple source and header file pair that you can just drop into your project and have it all just work across platforms.

So just as a productive distraction I went over to [switch Principia from GLEW to GLAD](https://github.com/Bithack/principia/commit/2034ca87e6a1e401ea2d1803087ba696279f7008), and the previous `opengl.h` header in Principia that used to look like [this](https://github.com/Bithack/principia/blob/8929a3bd866d634c99879af80e5f6549e2ae811f/src/tms/backend/opengl.h) completely disappeared and just turns into a single include line wherever we need it:

```c
#include <glad/glad.h>
```

Neat.

## Coordinates, positions, cameras...
The Matrix is a mysterious entity with unknown intentions that keeps humanity subjugated without fully knowing about, or comprehending its existence. This seems to hold true for matrices in mathematics too.

Previously, I had been using world coordinates in the code and then manually converting to screen coordinates on the CPU when rendering, first passing to SDL renderer calls and then directly to OpenGL. While this works, it can get out of hand pretty quickly having to convert everything through this function, and generally you want to move as much of these calculations to the GPU &mdash; that's why you have your bloody Nvidia RTX 6969 Ti SUPER card anyways.

So with the new renderer I now had access to this strange transformation matrix that I can use to move, scale and rotate the rendered representation of the world.

...This is not a university report, so I can freely admit I still don't fully grasp this. However after looking at the code for the camera system in TMS (Principia's in-house engine), I managed to piece together a functional camera system that allows me to move around and rotate the camera, which modifies a transformation matrix that is then passed to and used by the shader when rendering. Pure bliss has been achieved. All CPU code now solely works in world coordinates, and the GPU handles the transformation to screen coordinates.

With this new camera system in place, I also set up so that the camera would track the average position of all water particles, resulting in the camera being centered on the water at all times. I then added some lerping to make the camera movement smooth if there is rapid movement.

{% include video.html
	name="new_camera_gameplay.webm"
	max_width=700 %}

Hey look, now it's starting to feel like an actual game! But those hardcoded terrain polygons are starting to feel a bit boring.

## Tilemap maps with Tiled
Up until now the terrain in the game has basically just been hardcoded rectangles defined in code to get something that can contain the water. That was fine for prototyping purposes, but now I would want to look into some better tooling to create more interesting levels.

I looked to [Tiled](https://www.mapeditor.org/), a general purpose grid-based map editor that saves maps in a versatile format that can be consumed by various libraries. I grabbed [TMX](https://github.com/baylej/tmx) which is a simple C library for loading Tiled maps, began writing some code to render sprites to the screen, and then made it draw tiles from a Tiled map with a given tileset.

{% include image.html
	name="tiled_map_test.webp"
	alt="Screenshot of a test tilemap being rendered in-game. It does not have any physics and appears like it is in the background."
	max_width=700 %}

First of all it made me realise my way of rendering tiles from a tileset was a bit suboptimal. But apart from that I began to wonder how I would best represent the terrain tiles as static physics objects in order to get physics collision working with the water...

I eventually made the conclusion that Tiled honestly wouldn't be well suited for my purposes. While it is great for grid-based maps (think Mario platformers), what I really wanted was something that would work with terrain as polygons directly. That way transferring it into physics bodies would be much more straightforward.

## Terrain editor
The editor was decided to be written in Python using PySide6 (i.e. Qt6 for Python). I had previously experimented with something in-game to create polygons while I was still using the SDL renderer, but it wasn't very usable and I later threw it away when I switched to the OpenGL renderer. Creating it as an external tool with a scripting language and with the creature comforts of a proper GUI toolkit would likely end up being much more productive in the end.

It's basically a vector drawing program where you can plot down and move around vector points to create different polygons in the world. In order to make it easier to create terrain that fits together I added a grid and snapping feature, as well as the ability to pan the view around to create larger cohesive terrain worlds.

{% include image.html
	name="terrain_editor_1.webp"
	alt="Screenshot of the terrain editor showing some polygons with different line colours created in the world."
	max_width=900 %}

Then in order to get this stuff into the game I decided to just export the terrain polygon data in a JSON format, for lack of interest in creating any fancier kind of format. I also added support for defining custom colour values for the fill and outline of terrain polygons, though they remain unimplemented in the game for now.

{% include image.html
	name="terrain_editor_2.webp"
	alt="Screenshot of the terrain editor showing some connected green polygons, and the corresponding JSON data representing the terrain is shown above."
	max_width=900 %}

Then, when putting all this together and writing some code to load this JSON terrain data into the game (after finding this [amazingly tiny C library for parsing JSON](https://gitlab.com/bztsrc/jsonc/-/blob/master/jsonc.c)), the end result looks like this. Being able to add a polygon to the editor, then go and start the game and have the changes take effect makes for a very convenient workflow.

{% include video.html
	name="terrain_editor_showcase.webm"
	max_width=960 %}

Currently the polygons that are created are directly drawn in the game, but I would later want to allow loading and placing down decorative sprites for more detailed terrain, keeping the polygons for general terrain shapes and handle the physics collisions. Probably also adding support for multiple layers including a background layer. This will surely grow into its own project at some point.

## Then...
This blog post is already long enough as it is, so I'll just summarise some smaller things I did after that:

- Porting the game to Windows (I develop on Linux) using a cross-compiler toolchain, which was rather easy thanks to SDL.
- Porting the game to the Web using Emscripten, which was also helped by SDL but became a bit more involved due to WebGL 1.0 having some painful differences from OpenGL ES 2.0 causing the water framebuffer to not render at first. I eventually managed to get that working in the end, but it's still not quite in a state where I could throw up a test version yet.
- Scaling up or down the rendering based on the height rather than showing more of the viewport area. While you can still see more to the sides depending on how wide your screen is, the vertical field of view remains consistent.
- Just like how you could control the game using the accelerometer on a phone, I also implemented support for using the accelerometer of a game controller (such as my DualShock 4 controller) when playing on desktop.

In the end with everything put together, here is a short video showcasing the current state of the game as of this blog post, featuring me playing it with my DualShock 4 controller in the bottom right:

{% include video.html
	name="gameplay_controller_showcase.webm"
	max_width=960 %}

I began working on the project around the beginning of December, and this blog post has detailed the progress of it so far. It has been a very interesting and rewarding experience having learnt a lot along the way, and only time will tell if I will be continuing to work on the project for the foreseeable future.
