---
title: The Linux File Structure
---

When I first tried out Linux, one of the things that stood out to me was its file structure. It is structured in a completely different way to Windows, and I believe that when you understand it you can see how it clearly is a superior way of structuring things.

# The root (/)
In Linux, everything begins at the primary partition where your core system is installed, which might also be referred to as the root filesystem. This is where **everything** resides.

Compared to Windows where other partitions and storage mediums are referred to as separate directory structures, in Linux they are mounted inside of the root filesystem. If you mount from a graphical file manager it might be mounted to `/run/media/$USER/$PARTITION`, but you can choose to mount additional partitions to wherever. For example you can have an external hard drive that gets mounted to `~/Videos/` if you have a large video collection.

## /dev/
As Linux follows the Unix philosophy of everything being a file, things such as low-level disk partitions, the display and TTYs, device buses and RNG modules are available as files you can interact with in `/dev/`. A basic example is `/dev/null` which acts as a black hole, you can pipe a command into it and the command output will completely disappear.

## /etc/
This directory contains global configuration files for programs and services that run as their own user, and ones that are user-agnostic. Usually configuration changes that happen here apply for all users on the system as compared to changes in a single user's home folder configuration.

## /home/
This is a directory that contains all the users' home folders, and is the equivalent to the Windows `C:\Users\` directory. Sometimes you may choose to mount home folders on a separate partition allowing for the system partition to be reinstalled while keeping the home folder intact. In Bash and most other shells, the tilde will autocomplete to the current user's directory (`~/Documents` == `/home/$USER/Documents`)

While the user is mostly in control of organising their home folder the way they please, there are various standardised locations in the home folder as part of the XDG specification.

### ~/.cache/
Standard location for XDG_CACHE_HOME where programs run as the user can store their cache.

### ~/.config/
Standard location for XDG_CONFIG_HOME where programs should keep user-specific configuration files. This is preferred over putting a new folder prefixed with a dot in the root of the home folder, as the latter creates a lot of clutter where the users' actual files should be.

### ~/.local/
This is a folder that mimics the structure of `/usr`, similar to `/usr/local/` but user-specific. Some programs store user data in `~/.local/share/`, but you can also e.g. put your own desktop files into `~/.local/share/applications/` and your own executables or scripts into `~/.local/bin/`.

## /mnt/
This folder is intended for users themselves to mount things.

## /opt/
Short for `optional`, this folder is intended to house large, mostly self-contained software. This is a bit dirty, but occurs sometimes with proprietary software, or very large software that has its own ecosystem.

## /proc/
Similar to `/dev/`, this folder contains file references to processes currently running.

## /root/
The root user's home directory. If you run a graphical program as root with `sudo` or the like it will not respect your theming changes, since these configurations exist in your own user's home folder and not the root user's.

## /run/
This folder is usually intended for general temporary stuff. Some file managers might mount external filesystems into here.

## /srv/
Standard location for server content. For example, /srv/http/ for web applications not installed with your package manager. They usually already have proper permissions in place to allow for the server to access their respective folder.

## /sys/
Similar to /dev/ and /proc/, this folder contains various file references pointing to various kernel functionality.

## /tmp/
This is a global temporary folder. Depending on your distro, this might be mounted as tmpfs, i.e. as a ramdisk. In this case everything written into this folder only exists in memory and will be automatically cleared on restart.

## /usr/
This folder is where a significant majority of programs and their files reside, and this folder itself has a structure in itself.

This structure is also mirrored inside your home folder at `~/.local/`, where you can e.g. put your own files such as your own scripts in `~/.local/bin/` and your own application launcher entries in `~/.local/share/applications/`.

### /usr/bin/
Contains all program binaries in one tidy place. This folder is in the PATH, which means you can execute any program located in here from the terminal whereas there is no standard binary location on Windows, all programs need to be added to PATH yourself.

### /usr/include/
Contains header files for programs and libraries you have installed, useful for building from source or for C/C++ development.

### /usr/lib/
Contains shared library objects (.so) other programs can use, instead of statically linking their own versions of libraries. Python also uses this directory to put its site-packages (reusable Python code turned into a library).

### /usr/local/
This folder mirrors the /usr/ directory structure, and is intended for users to manually install. I personally do not use this directory, preferring to package up all my software or put it in `~/.local/` in my home folder. This is because installing stuff into /usr/local means you are going to be installing things that will not be tracked by your package manager (i.e. lost files), and will be lost on a reinstall.

### /usr/share/
This folder contains data for programs. While on Windows the program's executable is stored in its `Program Files` directory along with its data, on Linux this is split up into `/usr/bin/` for the executable and `/usr/share/` for the data.

There are also some standard directories in `/usr/share` that contains more... shared content;

#### /usr/share/applications/
Contains .desktop files for every installed program. Your application launcher will usually read the applications from this folder.

#### /usr/share/doc/
Contains documentation for packages if it has any. If the package is a library it might also put example code in here.

#### /usr/share/man/
Contains your manpage database, it is where the manual pages you can bring up with the `man` command resides.

#### /usr/share/mime/
Contains a list of all MIME types, i.e. descriptions of every file type. You could use this to see what kind of image format a specific image file has.

#### /usr/share/icons/
Contains icons for system-installed programs, categorised into icon pack. If you install new icon packs they get installed as a subfolder in here.

#### /usr/share/locale/
Contains most of programs' locale files for translations. This folder may get large if you have lots of packages installed, and there are techniques to purge it of any languages you don't use (e.g. `localepurge` or pacman `NoExtract`).

## /var/
Short for 'variable' (as in 'varying'), this folder is intended for large files that can vary in size. Most software running as their own user or running at root privileges put their log files in `/var/log/`, there is `/var/cache/` for cache that should persist for longer periods of time and `/var/tmp/` for cache that **is** temporary.
