#!/bin/bash

for file in *.webp; do
	convert $file -resize 640 -unsharp 0x0.55+0.55+0.008 -quality 99% low/$file
done
