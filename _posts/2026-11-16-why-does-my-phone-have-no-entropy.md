---
title: Why does my phone have no entropy?
cover_alt: Bugdroid lying on its back with the stomach open and a red warning sign in front.
tags: Android Anecdotes
forum_thread: 187
---

In mbedTLS 3.6.6, the fallback entropy generator was switched from `/dev/urandom` to `/dev/random` as a result of CVE-2026-34871 published on the 31st of March 2026, to ensure that the library always gets cryptographically secure randomness for entropy initialisation. Some months later, I was sitting with my previous phone to test Principia on it, but was greeted with nothing but a black screen as it hanged right when attempting to initialise libcurl. After debugging, the hang was traced into mbedTLS, and it turned out that my phone just had no entropy.

<!--more-->

## The phone
My previous phone which I had between 2016 and 2021 was the Vernee Apollo Lite. Vernee was this interesting Chinese manufacturer in the late 2010s owned by New-Bund that offered really good phones for the low-end prices that they were sold at. The Apollo Lite was one of their first phones and was released in 2016. At the time, it was like a huge technological advancement to see the phablet form factor in the low-end phone market, which previously consisted of a lot of small terrible Samsung phones running Android Jelly Bean or KitKat.

Anyway, the Apollo Lite runs Android 6 and its last security update was in July of 2016. The last update to the phone from the manufacturer was in late 2017 and changed the background colour of the quick settings menu from dark grey to complete black. I'm not sure why they did this, but I guess nonsensical cosmetic changes are easier than shipping actual security updates.

{% include image.html
	name="black_quick_settings.webp"
	max_width=320 %}

I switched to the Nokia 5.4 in 2021, basically solely to get a newer Android version. It got significantly more software updates, but had its last security in December 2023. But that's all I have for now and I hope it can last at least a few more years.

However, I still have my old Vernee phone. The hardware still works even though the software is unfortunately obsolete, and it is useful as a test device for working on Principia and other apps.

## The hang
So when I was installing the latest development version of Principia onto the phone, it would just hang on the loading screen. I tried the latest stable and it did the same thing. I tried some older versions from this year and it also did the same. At that point I became quite concerned as I wondered for how long this had been broken!

When running logcat, it would log "Initializing curl..." and then hang. With a little bit more logging lines, I saw that it was getting stuck right at `curl_global_init`, initialising the global state of libcurl. I booted up Android Studio and tried debugging it, having rebuilt libcurl with debug symbols. As I stepped into that function, it went deeper into mbedTLS code which it just had the function names for.

Then I also built mbedTLS with debug symbols to better see what was going on. After going into function after function, I eventually got to the `mbedtls_platform_entropy_poll` function. Specifically the codepath which opens a file and tries to read it.

```c
file = fopen(mbedtls_platform_dev_random, "rb");
// [...]
read_len = fread(output, 1, len, file);
```

Once it reached the `fread` call, it would not go any further. But what is it trying to read anyway? `mbedtls_platform_dev_random` is set to `MBEDTLS_PLATFORM_DEV_RANDOM` by default, which by default is the `/dev/random` device:

```c
#if !defined(MBEDTLS_PLATFORM_DEV_RANDOM)
#define MBEDTLS_PLATFORM_DEV_RANDOM "/dev/random"
#endif
```

For a quick summary, on Unix-like operating systems there is this de-facto standard for two different RNG devices that are exposed as files you can read from in the `/dev` directory. While the behaviour of them in Linux has changed over the years (and we'll get to that), the general idea was that:

- `/dev/random` is a random device that will block until it has enough entropy to generate random bytes. This device would therefore always generate random bytes that are cryptographically secure.
- `/dev/urandom` is a random device that will never block, but if the system entropy pool is too low then this may not generate random bytes that are cryptographically secure.

For a cryptography library such as mbedTLS, using a cryptographically secure RNG is important for entropy, but what happens if you just don't have any entropy and try to read from the cryptographically secure `/dev/random`? You'll just hang until you've read enough bytes that were requested.

To confirm this I went into the shell via `adb` and tried reading from `/dev/random` directly:

```bash
$ dd if=/dev/random of=/sdcard/random_secure.bin bs=4096 count=256
^C
0+6 records in
0+6 records out
36 bytes transferred in 817.495 secs (0 bytes/sec)
```

23 seconds to generate a single random byte, that's just horrible. Of course, trying the same with `/dev/urandom` works fine and finishes very quickly:

```bash
$ dd if=/dev/urandom of=/sdcard/urandom.bin bs=4096 count=256
256+0 records in
256+0 records out
1048576 bytes transferred in 0.242 secs (4332958 bytes/sec)
```

But I swear I have been able to run Principia on this phone before, what happened?

I discovered that the default fallback source for entropy on Unix platforms was changed from `/dev/urandom` to `/dev/random` in [mbedTLS 3.6.6](https://github.com/Mbed-TLS/mbedtls/releases/tag/mbedtls-3.6.6) as a result of [CVE-2026-34871](https://mbed-tls.readthedocs.io/en/latest/security-advisories/mbedtls-security-advisory-2026-03-dev-random/), describing the previous default as a security issue:

> Using `/dev/urandom` for cryptography on Linux is fine except in one specific scenario: if the device has recently booted and has not had time to accumulate enough entropy yet, `/dev/urandom` may return predictable data. This is especially a concern on embedded devices without any peripherals that have significant entropy.

That is correct... but, embedded devices without any peripherals? It does not feel like a phone would fit under that category.

## So how bad is the entropy?
When you think of a device that has no entropy, you might think of something that is completely deprived of any hardware sensors. A virtual machine running on a headless server, it gets no input and does not have any access to the potential hardware sources of entropy that the host might have.

But a phone is nothing but sensors and input devices - it receives wireless signals in the form of Wi-Fi, Bluetooth, cellular, GPS, it has a human that is both tapping the screen and holding it in their hand, and it has a camera that can see the world. That should be enormous amounts of potential sources to generate entropy from, right? Let's query the kernel to see how much entropy is available on the phone:

```bash
$ cat /proc/sys/kernel/random/entropy_avail
4
```

Hmm, well, that's not a lot. While the entropy value can accumulate slightly over time, it doesn't go very high and as soon as I try to read from `/dev/random` it will exhaust the entropy pool after reading a handful of bytes and then block.

Of course, `/dev/urandom` still keeps spewing out random bytes as quickly as it can even without any entropy available. Dumping a 100MB file from `/dev/urandom` and calculating the Shannon entropy of it gives a result of 7.99999822. That's a good sanity check, but still doesn't guarantee true randomness. Determining if something really is truly random is difficult.

Comparing with the amount of entropy that is on my Nokia 5.4, it reports a much higher amount of bits available for entropy:

```bash
$ cat /proc/sys/kernel/random/entropy_avail
3183
```

And trying to read from `/dev/random` on the Nokia phone will spew out random bytes extremely quickly, on par of that of reading from `/dev/urandom`.

However, my desktop computer running a fully up to date Linux kernel reports a fixed value of 256 bits:

```bash
$ cat /proc/sys/kernel/random/entropy_avail
256
```

Which gets me to how the Linux kernel has drastically changed the behaviour of `/dev/random` over the years. Most notably in Linux 5.6 the behaviour of `/dev/random` was changed to never block after the RNG has been initialised on bootup. 5.6 was released in March 2020, but Android devices lag significantly behind the Linux kernel releases and my Nokia 5.4 is running Linux 4.19.

This change in behaviour in the Linux kernel that makes devices on older kernels potentially needlessly block was in fact mentioned in the release notes of mbedTLS 3.6.6:

> The default device for reading entropy on platforms without a dedicated system call is now /dev/random instead of /dev/urandom. This is safer on Linux in case the application runs early after the kernel boots, but may block needlessly on Linux <= 5.6. Reported by supers1ngular (BayLibre).

This still does not explain why my Nokia phone has so much entropy while the Vernee has so little. I don't know if other similar Android phones from the same era have the same issue, and I don't have any other devices to test with. Of course, if you have some old Android phone lying around, you can check the amount of entropy available on it by running the same commands I did above in `adb shell` when USB debugging is enabled.

## The fix
For mbedTLS, the fix is to change the fallback entropy generator back to `/dev/urandom`. The default can be changed at build-time for mbedTLS with the `MBEDTLS_PLATFORM_DEV_RANDOM` define, but you can also conveniently do this at runtime by setting the `mbedtls_platform_dev_random` global variable in your own code.

Just make sure you set it sometime before initialising the global curl state, or it will be too late and you'll already be stuck trying to read `/dev/random`.

```c++
#ifdef __ANDROID__
extern const char *mbedtls_platform_dev_random;
#endif

void network::init() {
	// [...]
#ifdef __ANDROID__
	mbedtls_platform_dev_random = "/dev/urandom";
#endif

	tms_infof("Initializing curl (v" LIBCURL_VERSION ")...");
	CURLcode r = curl_global_init(CURL_GLOBAL_ALL);
	/// [...]
}
```

I don't know what the security implications of this are, but realistically there likely aren't any. Other than the fact that more phones can play Principia again.
