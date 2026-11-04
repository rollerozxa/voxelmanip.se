---
title: My Ly config
last_modified: 2026-11-04
---

My configuration file for the display manager [Ly](https://codeberg.org/fairyglade/ly), as featured in my blog post [Display Managers, and Ly](/2025/02/19/display-managers-and-ly/).

<!--more-->

```ini
# Allow empty password or not when authenticating
allow_empty_password = true

# The active animation
animation = matrix

# The number of failed authentications before a special animation is played... ;)
auth_fails = 0

# Change the state and language of the big clock
bigclock = en

# Blank main box background
blank_box = true

# Border foreground color id
border_fg = 0x00FFFFFF

# Erase password input on failure
clear_password = true

# Format string for clock in top right corner (see strftime specification). Example: %c
# If null, the clock won't be shown
clock = %Y-%m-%d %H:%M:%S

# Input box active by default on startup
# Available inputs: info_line, session, login, password
default_input = password

# Render true colors (if supported)
full_color = true

# Remove main box borders
hide_borders = false

# Remove power management command hints
hide_key_hints = true

# Remove version number from the top left corner
hide_version_string = true

# Input boxes length
input_len = 40

# Active language
lang = en

margin_box_h = 6
margin_box_v = 3

# Show the shell session in the session list
shell = false
```
