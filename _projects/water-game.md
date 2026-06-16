---
title: Water Game
image: water-game
date: 2025-12-03
timeframe: "2025-"
technologies: C, OpenGL & SDL3
license: N/A
repo: https://github.com/rollerozxa/eddy
---

Water Game (alternate working title "Eddy", from the character in Hydroventure Spin Cycle) is a physics-based water game I began working on in December of 2025. It is inspired by the WiiWare game Hydroventure (also known as Fluidity in NA) which is one of my favourite games.

The game is written in C using SDL3 for cross-platform support, Box2D for physics, and OpenGL for the graphics renderer written from scratch. I wrote about the beginning of the game's development in [this post on my blog at the end of December](/2025/12/26/a-wet-physics-gamedev-adventure/), and by the end of January I uploaded this video showcasing more progress on the game such as antialiasing, rendering MSDF fonts and a slightly bigger test map:

{% include youtube.html id="xFuWrYYYfiY" max_width=640 %}

It is unknown when I will continue working on the game past this prototype. Writing a custom renderer and working with OpenGL directly was an interesting learning experience but ended up being a lot of additional work needed to push it beyond being just a simple game prototype, such as implementing draw batching.
