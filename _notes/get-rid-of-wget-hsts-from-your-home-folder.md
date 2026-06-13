---
title: Get rid of .wget-hsts from your home folder
last_modified: 2026-06-13
---

By default, wget creates a file `~/.wget-hsts` to store HSTS information for websites that wget makes requests to. If you find this annoying that wget is putting such a file right in the root of your home folder, wget has a command line argument `--hsts-file` that allows you to specify a different location for this file.

You could then wrap wget in an alias to point it somewhere else:

```bash
alias wget="wget --hsts-file $HOME/.config/wget-hsts"
```

...However, this will not work for scripts that will call wget. For that, you may want to create a wrapper script somewhere with higher priority in your PATH than the actual wget binary. For example, I have `~/.local/bin` in my PATH before anything else, so I can create a file `~/.local/bin/wget` with the following contents:

```sh
#!/bin/sh
exec /usr/bin/wget --hsts-file "$HOME/.config/wget-hsts" "$@"
```

Wget also has a global configuration file `/etc/wgetrc` where you could set the `hsts-file` option, but then you would need to hardcode it to somewhere all users on the system will write to. The per-user configuration file `~/.wgetrc` can also be used... but that would defeat the point if you want to remove a file from your home folder.

If you want to disable HSTS in wget altogether there is also the `--no-hsts` argument, but I don't know if I would recommend that.
