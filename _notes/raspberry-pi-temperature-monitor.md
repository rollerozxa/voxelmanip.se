---
title: Raspberry Pi temperature monitor
last_modified: 2025-09-04
---

`vcgencmd` is a tool that can be used to retrieve information from the VideoCore GPU on the Raspberry Pi. It is typically found at `/opt/vc/bin/vcgencmd` in Raspberry Pi OS. The full documentation is available [here on the Raspberry Pi website](https://www.raspberrypi.com/documentation/computers/os.html#vcgencmd).

<!--more-->

Among other things, this command can be used to retrieve the current temperature of the SoC on the Pi:

```bash
$ /opt/vc/bin/vcgencmd measure_temp
temp=50.0'C
```

If you have a web server with PHP running on the Raspberry Pi you can expose this value from a page that will automatically refresh to always show the current temperature of your Pi.

```php
<!DOCTYPE html>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="1">
<title>Raspberry Pi Temperature Monitor</title>
<style>
html, body {
    height: 100%;
    background-color: #111111;
    display: flex;
    justify-content: center;
    align-items: center; }
.number {
    color: #dadada;
    font-family: sans-serif;
    font-size: clamp(80px, 20vw, 260px); }
</style>
<span class="number">
	<?php echo substr(shell_exec("/opt/vc/bin/vcgencmd measure_temp"), 5); ?>
</span>
```
