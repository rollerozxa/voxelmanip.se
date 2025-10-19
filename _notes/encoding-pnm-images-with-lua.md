---
title: Encoding PNM images with Lua
description: A simple Lua function to encode images in the PNM family of formats (PBM, PGM, PPM)
last_modified: 2025-10-19
---

PNM is a family of simple image formats that are easy to encode and decode. They consist of three format types:

1. Portable Bitmap Format (`.pbm`) - black and white images
2. Portable Graymap Format (`.pgm`) - greyscale images
3. Portable Pixmap Format (`.ppm`) - colour images

This is a very simple Lua function that can encode images to the text-based type of each format. It will write to a file with the specified name based on the image type, and it accepts a two-dimensional table representing the pixel data. The resolution of the image is determined by the lengths of the table.

```lua
-- P: The type (1 - PBM, 2 - PGM, 3 - PPM)
-- name: Filename (extension gets automatically appended)
-- data: Two-dimensional table, format depends on type
function encode(P, name, data)
	local buf = {}

	buf[#buf+1] = 'P'..P..'\n'..#data[1]..' '..#data..'\n' -- w & h

	if P == 3 or P == 2 then
		buf[#buf+1] = '255'..'\n'
	end

	for _,row in ipairs(data) do
		for _,cell in ipairs(row) do
			if P == 3 then
				buf[#buf+1] = cell[1]..' '..cell[2]..' '..cell[3]..'\n'
			else
				buf[#buf+1] = cell..'\n'
			end
		end
	end

	local f = io.open(name..'.'..({"pbm", "pgm", "ppm"})[P], "w")
	f:write(table.concat(buf))
	f:close()
end
```

## Test code
Some test code which demonstrates how to use the above function to create images of each type:

```lua
-- .pbm - "OwO"
encode(1, 'output', {
	{0,1,1,0,0,0,0,0,0,0,0,0,1,1,0},
	{1,0,0,1,0,0,0,0,0,0,0,1,0,0,1},
	{1,0,0,1,0,1,0,0,0,1,0,1,0,0,1},
	{1,0,0,1,0,1,0,0,0,1,0,1,0,0,1},
	{1,0,0,1,0,1,0,1,0,1,0,1,0,0,1},
	{0,1,1,0,0,0,1,0,1,0,0,0,1,1,0},
})

-- .pgm - Greyscale gradient 256x5
local greyscale = {}
for i = 255, 0, -1 do
	greyscale[#greyscale+1] = i
end
encode(2, 'output', {
	greyscale, greyscale, greyscale, greyscale, greyscale
})

-- .ppm - RGB and YCM
encode(3, 'output', {
	{ {255,0,0}, {0,255,0}, {0,0,255} },
	{ {255,255,0}, {0,255,255}, {255,0,255} }
})
```
