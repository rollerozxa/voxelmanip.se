---
title: Dump app metadata from an APK file
last_modified: 2025-09-10
---

The `aapt` command-line tool from the Android SDK build tools can be used in order to dump various metadata about an APK file:

<!--more-->

```bash
aapt dump badging <APK file>
```

Some things I have found useful from the information in the past:

- Quickly check the `versionCode` and `versionName` of an APK I'm looking at. Some APK downloader sites may contain release versions that mismatch with what the APK actually says.
- Being able to see which minimum API level (`sdkVersion`) of Android is required to install it. See [apilevels.com](https://apilevels.com/) for a table on API levels and how they correspond to Android versions.

Example output:

```
package: name='se.voxelmanip.tensy' versionCode='1' versionName='1.0' platformBuildVersionName='15' platformBuildVersionCode='35' compileSdkVersion='35' compileSdkVersionCodename='15'
install-location:'auto'
sdkVersion:'21'
targetSdkVersion:'35'
uses-permission: name='android.permission.VIBRATE'
application-label:'Tensy'
application-icon-160:'res/GX.png'
application: label='Tensy' icon='res/GX.png'
launchable-activity: name='se.voxelmanip.tensy.GameActivity'  label='' icon=''
feature-group: label=''
  uses-gl-es: '0x20000'
  uses-feature-not-required: name='android.hardware.touchscreen'
main
other-activities
supports-screens: 'small' 'normal' 'large' 'xlarge'
supports-any-density: 'true'
locales: '--_--'
densities: '160'
native-code: 'arm64-v8a' 'armeabi-v7a' 'x86_64'
```
