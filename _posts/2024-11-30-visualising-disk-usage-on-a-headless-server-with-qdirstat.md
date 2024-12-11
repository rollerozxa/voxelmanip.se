---
title: Visualising disk usage on a headless server with QDirStat
tags: Guides Linux
cover_alt: Screenshot of the treemap of QDirStat showing a lot of coloured blocks representing differently sized files.
---

If you've ever got a long running headless server that gets some amount of use, it will eventually accumulate files and data on the disk until the point where the allocated disk space for the server runs out and you will need to clean some things out. Running `df -h` tells you it is completely full, but how will you be able to see what is taking up the space?

There exists all sorts of graphical programs to visualise disk usage for various operating systems, but when you've got a server that you maybe only have headless SSH access to, your options become quite limited. Fortunately the program QDirStat has a feature that allows you to scan a filesystem into a cache that can be opened and inspected on another system.

<!--more-->

## QDirStat cache files
While QDirStat's primary usage mode is scanning a live filesystem on the same system that you run the program on, you can also write the scanned information into a cache file that the program can later read and show to the user. It can be useful for performing scans of very large directories and disks that you can open again on the same system, but the most useful utility of it for the case of this blog post is of course being able to scan a filesystem on a headless system and view it on a graphical system.

For more information about the cache and generator script there is the [QDirStat for Servers](https://github.com/shundhammer/qdirstat/blob/master/doc/QDirStat-for-Servers.md) page in the QDirStat documentation. But you just want the quick guide for how to generate a cache for your server, then read on.

## The steps
On the graphical system you'd want to run the analysis on, install QDirStat. It can likely be found in the repositories of your Linux distribution, or built from source [with some fairly simple instructions](https://github.com/shundhammer/qdirstat/blob/master/README.md#building). If you're on Windows, well, boot up your Linux VM.

Once installed you should have a Perl script next to the `qdirstat` executable called `qdirstat-cache-writer` in, say, `/usr/bin/`. It is also available in the source tree at [scripts/qdirstat-cache-writer](https://github.com/shundhammer/qdirstat/blob/master/scripts/qdirstat-cache-writer). Move it over to the server in whatever way you would like, such as with SCP:

```bash
scp /usr/bin/qdirstat-cache-writer user@server:/home/user/
```

Connect to the server via SSH and make sure the script is set as executable (`chmod +x`). The script requires Perl and some Perl extensions to be installed on the server, but if you have at least Git installed on the server then all the prerequisites should already be satisfied.

The script has fairly simple instructions for usage. The first argument is the directory it will scan, allowing you to only scan a particular directory in the filesystem recursively. But if you want to see the whole disk usage you would want to pass the root, i.e. `/`. To make it able to scan directories that your regular server user doesn't have read permissions to, you would want to run it with sudo or escalate to root. An example invocation would be:

```bash
sudo ./qdirstat-cache-writer -v /
```

The `-v` parameter stands for verbose and logs the current directory that is being scanned to the terminal to show that it is doing something and has not hung.

Once it's finished the resulting cache file has been written in the root of the directory you scanned it. If you scanned the whole root it will be at `/.qdirstat.cache.gz`. Simply copy it back to your graphical system so that we can open it in QDirStat.

```bash
scp user@server:/.qdirstat.cache.gz ~/
```

When starting up QDirStat, close the Select Directory dialog that shows up once you start it and go to *File -> Read Cache File...* and select the cache file that would be somewhere in your home folder.

{% include image.html
	name="read_cache_file.webp"
	alt="Screenshot of the top left of the QDirStat window showing the 'Read Cache File...' option under the File dropdown." %}

Once opened the directory tree of your server should show up on the top as well as a map of files visualised as coloured boxes, making it easy to pick out folder and files with large sizes.

{% include image.html
	name="directory_tree.webp"
	alt="Screenshot of the directory tree of QDirStat showing some of the largest folders in the root of a server." %}

Do note that since you are looking at the cached information about a filesystem that you are not connected to, the regular file operations that QDirStat provides you such as deleting files and folders will not work. When doing cleanup you will need to SSH and navigate to the stuff you want to delete there.

The cache will also not automatically update when you do that (obviously), so at a certain point you may want to regenerate the cache to get a more accurate view of what is left taking space on your server.

Nonetheless it should still give you a very useful overview of what takes up the disk space on your server in a graphical manner and point to large amounts of potential junk or leftover files that can be removed to free up space.
