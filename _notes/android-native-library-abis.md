---
title: Android Native Library ABIs
last_modified: 2025-10-29
---

While Android apps are primarily written in Java and compiled to Dalvik bytecode, they may also contain libraries compiled to native code (usually referred to as "native libraries"). These typically offer better performance for intensive tasks, or portability for existing codebases. However while Dalvik bytecode is architecture-independent and runs on any Android device, native libraries are compiled for specific CPU architectures (referred to as "ABIs" in Android terminology).

In order to run an app with native libraries, the app must contain libraries compiled for an ABI supported by your device. If you install from Google Play you usually don't have to worry about this, but when sideloading APKs you may run into errors about unsupported ABIs if trying to install an app.

<!--more-->

## Inspecting an APK for native libraries
Opening up an APK file like a zip archive reveals a `lib/` directory. If the app you're inspecting has this folder then it makes use of native libraries, otherwise it's only written in Java and should run on any ABI. Inside the `lib/` folder are subdirectories named after each ABI that the app supports, containing the respective compiled native libraries.

Some apps may be split into multiple APKs for each ABI, which may be especially apparent if you download the APK off a third-party site. If an APK only contains a single ABI folder under `lib/`, then there may be other versions that support different ABIs (or the app only supports `arm64-v8a` as the most common one, which I have seen sometimes in the wild).

## Table of native library ABIs
This is a table of all Android native library ABIs that have ever existed, along with their more human-readable architecture names:

| ABI Name    | Architecture   | Supported by NDK  |
| ----------- | -------------- | ----------------- |
| armeabi     | ARMv5 (32-bit) | No (≤ r16)        |
| armeabi-v7a | ARMv7 (32-bit) | Yes               |
| arm64-v8a   | ARMv8 (64-bit) | Yes               |
| x86         | x86 32-bit     | Yes               |
| x86_64      | x86 64-bit     | Yes               |
| mips        | MIPS 32-bit    | No (≤ r16)        |
| mips64      | MIPS 64-bit    | No (≤ r16)        |
| riscv64     | RISC-V 64-bit  | No (experimental) |

Also see the [Android ABIs](https://developer.android.com/ndk/guides/abis) page in the official Android Developers documentation.

## Checking Supported ABIs
While a given Android device may have a specific CPU architecture, it usually supports running native libraries compiled for multiple ABIs (for example, `arm64-v8a` devices may also be able to run `armeabi-v7a` and `armeabi` libraries).

To check which ABIs are supported by a connected Android device, you can use the following ADB command:

```bash
adb shell getprop ro.product.cpu.abilist
```

*(If you don't have a computer with ADB, you can run the same command in a terminal emulator app such as [Termux](https://f-droid.org/packages/com.termux/), removing the `adb shell` part.)*

Example output for an ARM 64-bit phone that can run 32-bit libraries:

```bash
arm64-v8a,armeabi-v7a,armeabi
```

You can also check which is the native/preferred ABI of the device with this command:

```bash
adb shell getprop ro.product.cpu.abi
```

## ARM64-only devices
Some ARM Android devices released in recent years may only support ARM64 native libraries, dropping support for running 32-bit ARM code. This is something that has happened on the SOC-level and is not something you can simply work around with software. You may want to look for a slightly older Android device inbetween the couch cushions if you want to run a 32-bit only app in this case.
