---
title: Wii savegame format notes
last_modified: 2026-11-09
---

This page contains notes about the Wii savegame format originally written back in October 2023.

On the NAND, savegames are stored in `data` directories in the game's title ID directory. Within that directory there is a `banner.bin` file, as well as the actual savegame files which differ depending on the game. The `banner.bin` file is a custom binary format that contains metadata about the game.

<!--more-->

## `banner.bin` Kaitai
Kaitai Struct file describing the `banner.bin` file format in its unencrypted form, which is what is stored on the NAND (SD card saves are encrypted).

```yaml
meta:
  id: savegame_banner
  file-extension: bin
  endian: be
seq:
  - id: magic
    contents: ["W","I","B","N"]
  - id: flags
    type: u4
  - id: anim_speed
    type: u2
  - id: reserved
    size: 22
  - id: game_title
    type: str
    size: 64
    encoding: UTF-16BE
  - id: game_subtitle
    type: str
    size: 64
    encoding: UTF-16BE
  - id: banner
    size: 24576
  - id: icon_frames
    size: 4608
    repeat: eos
```

This can be generated into a parser for various programming languages, such as Python, with the [Kaitai IDE](https://ide.kaitai.io/).

## List savegames from a NAND
The following Python script can be used to iterate in the `title` directory of a NAND and print out the title IDs (both hex and the human-readable 4-character code), the game title and subtitle for each savegame found.

```python
from pathlib import Path
from savegame_banner import SavegameBanner
import sys

if len(sys.argv) < 2:
    print(f"Usage: {sys.argv[0]} <path>")
    sys.exit(1)

nand_path = Path(sys.argv[1])

for path in sorted(nand_path.rglob("banner.bin")):
    try:
        banner = SavegameBanner.from_file(path)

        base_id = path.parent.parent.parent.name
        title_id = path.parent.parent.name
        human_id = bytes.fromhex(title_id[-8:]).decode("ascii", errors="replace")
        print(
            f"{base_id}{title_id} ({human_id}) - "
            f"{banner.game_title} - {banner.game_subtitle}")
    except Exception as e:
        print(f"Failed to parse {path}: {e}")
```

Example output, if you wanted to run it against your Dolphin NAND:

```
$ python list-titles.py ~/.local/share/dolphin-emu/Wii/title
0001000052555550 (RUUP) - Animal Crossing - Let's Go to the City Deluxe
0001000157334b50 (W3KP) - ThruSpace - Slip through the gap!
0001000157464c50 (WFLP) - Hydroventure - A water adventure!
```
