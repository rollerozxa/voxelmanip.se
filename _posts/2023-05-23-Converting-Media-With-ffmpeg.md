---
title: Converting multimedia with ffmpeg
---

`ffmpeg` is a very versatile and useful tool with the capability to compose and manipulate multimedia in all sort of complicated ways... Emphasis on complicated. However it is still possible to use `ffmpeg` for simpler things without having to learn all of its syntax and arguments. And one of the simplest things you could use `ffmpeg` for is to simply convert between various media formats.

---

`ffmpeg` is rather smart. Very smart, in fact. If you want to convert between formats, it can usually detect what you want to do just by the file extension alone. For instance, if you want to convert an .mp3 file into an .ogg file, you simply specify the input file (preceded with a `-i`), and then a new output filename with the file extension for the format you'd want to convert it into.

```bash
ffmpeg -i music.mp3 music.ogg
```

---

If you specify the same file extension then it will simply reencode the file. Depending on how the original file was produced, it could significantly decrease the filesize even with just the default encoder settings `ffmpeg` provides. When reencoding videos I take on my phone this way, they usually almost halve their filesize.

```bash
ffmpeg -i music.mp4 music.mp4
```

---

Even though `ffmpeg` is mostly associated with video and audio, it can also work on images too. Say, you've downloaded an image from somewhere on the internet, but it is a WEBP and you'd rather want it in PNG. Converting it from the terminal is as simple as:

```bash
ffmpeg -i image.webp image.png
```

---

If you've downloaded some music video using `yt-dlp` or the like, but didn't specify to extract the audio (which can be done with `-x`, by the way), you can do this with `ffmpeg`. However, if you try to convert into an Ogg Vorbis audio file, you may (or may not) be surprised to see an Ogg Theora video file being produced instead.

As .ogg is merely a container, it supports more than the Vorbis audio format, including the Theora video format. So when you specify a video file, `ffmpeg` expects to put both the audio and video in the output file, even though most of the time you only want audio in an .ogg file. To specify to `ffmpeg` that you only want the audio in Vorbis format to be put in the .ogg file, you'd want to add the `-vn` argument after the input argument:

```bash
ffmpeg -i music.mp4 -vn music.ogg
```

---

Depending on the build of `ffmpeg` you have at your disposal, it might have been compiled with libopenmpt support allowing you to render tracker music into a more traditional audio format:

```bash
ffmpeg -i pod.s3m pod.ogg
```

However, if your `ffmpeg` build for some reason does not include `libopenmpt` (**/!\\** *or it uses* `libmodplug` *which has terrible playback quality* **/!\\**), `openmpt123` also has the ability to render tracker music into a traditional audio format. The formats supported are unfortunately limited, only FLAC and WAV are supported... But of course, you could render to FLAC and then convert to a more well compressed format like OGG Vorbis, using `ffmpeg`!

```bash
openmpt123 --output-type flac --render pod.s3m
ffmpeg -i pod.s3m.flac pod.ogg
```

---

I hope these examples show `ffmpeg`'s usefulness even when doing something with it that doesn't require learning a lot of its arguments and syntax.
