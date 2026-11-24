---
title: Info-ZIP Security Findings (November 2026)
last_modified: 2026-11-24
---

This page contains notes on the discoveries I made in Info-ZIP Unzip when looking through the codebase while writing [my blog post about Info-ZIP](/2026/11/13/info-zip-widespread-and-unmaintained/). The details were sent via email to Debian's security team on the 9th of November 2026, and are now being published for public consumption. Neither of the issues are of critical severity, but still describe unexpected behaviour triggerable by a specially crafted ZIP file that results in memory safety issues.

<!--more-->

## EF_UNIPATH out-of-bounds heap read
- Date of discovery: 2026-11-08
- Source file: `process.c`
- Function: `getUnicodeData`
- Build conditions: Unzip needs to be built with `UNICODE_SUPPORT` defined.

The `if eb_id == EF_UNIPATH` block in the `getUnicodeData` function expects a certain size for the extra field data, but is susceptible to an integer underflow if the extra field data in a ZIP file is malformed and ends up being smaller than 5 bytes:

```c
ush ULen = eb_len - 5;
```

"ush" is an unsigned short, and when it overflows the length would be around the upper limit of a 16-bit integer. This length variable is then passed as the limit to a strncpy call:

```c
strncpy(G.unipath_filename, (ZCONST char *)(offset + ef_buf), ULen);
```

The destination `G.unipath_filename` is properly sized (heap allocation of `ULen + 1`) regardless of if the size underflows, and contains checks for if allocation is NULL or zero length. But the underflowed length variable means that the `strncpy` call will read past the end of the source buffer (which isn't a null-terminated string) up until it finds a null terminator byte, theoretically up to 65k bytes.

### Fix
Any ZIP archives that exhibit this issue should just be considered malformed and we can just return out of the function early with `PK_ERR` if `eb_len` is shorter than 5, right at the top of the `if (eb_id == EF_UNIPATH)` block:

```c
if (eb_len < 5) {
	/* UNIPATH extra field is too short */
	return PK_ERR;
}
```

`eb_len` of exactly 5 should be safe as there is specifically code to handle a case where the `ULen` is 0, as well as if the memory allocation of `G.unipath_filename` fails.

### Notes
Most distributions build Unzip with `UNICODE_SUPPORT` enabled and end up being affected by this. This issue appears to also have been independently discovered by Vladimir Akparov around the same time, and a public bug report [#1153750](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=1153750) was opened at Debian on the 11th of November 2026 with a fix for the issue attached.

References for distributions taking action:

- [Debian Security Tracker: TEMP-1153750-98581D](https://security-tracker.debian.org/tracker/TEMP-1153750-98581D)

## Out-of-bounds array access in DOS datetime conversion
- Date of discovery: 2026-11-09
- Source file: `fileio.c`
- Function: `dos_to_unix_time`
- Build conditions: Unzip needs to be built without `HAS_MKTIME` defined on a Unix platform.

In the `dos_to_unix_time` function which converts a DOS datetime value found in a ZIP file into a Unix timestamp, it unpacks the DOS datetime into year, month and day values:

```c
/* dissect date */
yr = ((int)(dosdatetime >> 25) & 0x7f) + (1980 - YRBASE);
mo = ((int)(dosdatetime >> 21) & 0x0f) - 1;
dy = ((int)(dosdatetime >> 16) & 0x1f) - 1;
```

`mo` becomes a potential range between -1 and 14 after unpacking. This is later then calculated upon to get the number of days since the start of the epoch:

```c
days = (yr * 365) + (leap - 492) + ydays[mo];
```

The `ydays` array is 13 elements long:

```c
ZCONST ush ydays[] = { 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365 };
```

Meaning that a specially crafted ZIP file with a DOS datetime that unpacks the month field to -1, 13 and 14 will cause out-of-bounds array access.

### Fix
The direct fix would be to range check right before the array index happens in `dos_to_unix_time`:

```c
if (mo < 0) mo = 0;
if (mo > 12) mo = 12;
```

However, this entire codepath only gets used when `HAVE_MKTIME` is not defined, which seems to be intended as a fallback for systems that don't have `mktime` available. As `mktime` is a function part of the C standard library since C89, it would be a good idea to build Unzip with `HAVE_MKTIME` defined if possible. Unzip does not use Autotools  similar, and the human-written Unix `configure` script does not check for the presence of `mktime`, so if you do not explicitly define this when building then the fallback codepath will always be used on Unix.

### Notes
Most distributions of Unzip appear to be building without `HAVE_MKTIME` defined, meaning that the fallback codepath with the issue is used. A fix has not yet been picked up by any distributions.
