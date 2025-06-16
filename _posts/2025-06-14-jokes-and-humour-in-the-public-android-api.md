---
title: Jokes and Humour in the public Android API
tags: Android Humourous
cover_alt: Screenshot of a page on the Android developer reference website. The screenshot shows the documentation for a constant by the name of DISALLOW_FUN, which is gone over later in the blog post.
---

Previously I have covered a relatively obscure now-removed placeholder string in Android that doubles as an easter egg, the fictitious carrier by the name of [El Telco Loco](/2024/10/14/el-telco-loco/). But this time it is about methods and other parts of the publicly facing Android API that may generally be more humourous than they are useful. Easter eggs, jokes, whatever you want to call them, that are visible to Android app developers rather than regular users.

<!--more-->

## ActivityManager.isUserAMonkey()
[(reference)](https://developer.android.com/reference/android/app/ActivityManager#isUserAMonkey())

While it may initially look like a joke when it's described as returning true if the UI is "currently being messed with by a monkey" without any further elaboration in the documentation, this is probably the one in the list with the most usefulness attached to it.

It is referring to the [UI Exerciser Monkey](https://developer.android.com/studio/test/other-testing-tools/monkey), which is a developer tool for Android that simulates random sequences of user input in order to stress-test apps. So this method will return a boolean of whether the Monkey is currently running or not.

The introduction of such a method to detect the usage of the Monkey appears to have an origin in something that happened during Android's development, as per a quote from the book *[Androids: The Team that Built the Android Operating System](https://www.chethaase.com/androids)*:

> One day I walked into the monkey lab to hear a voice say, '911 -What's your emergency?" That situation resulted in Dianne adding a new function to the API, `isUserAMonkey()` which is used to gate actions that monkeys shouldn't take during tests (including dialing the phone and resetting the device).

Indeed, when feeding random and inherently unpredictable input into an app, you would want to have some way of locking away portions of an app that may have unintended real-world consequences such as calling emergency services. As such, `isUserAMonkey` was implemented and later made its way into the public API in Android 2.2 Froyo (API 8).

## UserManager.isUserAGoat()
[(reference)](https://developer.android.com/reference/android/os/UserManager.html#isUserAGoat())

This one is more of a joke. The developer documentation says it is "used to determine whether the user making this call is subject to teleportations", which in itself is likely a reference to a hidden column in the Chrome task manager that shows how many goats a browser process has teleported.

It was first introduced in Android 4.2 (API 17), and originally just returned false. However in Android 5.0 Lollipop (API 21) it was changed to "automatically identify goats using advanced goat recognition technology". The game Goat Simulator had released earlier that year and was made available for Android in September during Lollipop's development, so this method was changed to instead detect the presence of the Android version of Goat Simulator being installed on the device:

```java
public boolean isUserAGoat() {
	return mContext.getPackageManager()
		.isPackageAvailable("com.coffeestainstudios.goatsimulator");
}
```

Later in Android 11 (API 30), it was changed such that apps targetting API 30 and above will once again always return false when the method is called. According to the developer documentation this was made to "protect goat privacy".

```java
if (mContext.getApplicationInfo().targetSdkVersion >= Build.VERSION_CODES.R) {
	return false;
}
```

Android 11 is also the version where the `QUERY_ALL_PACKAGES` permission was introduced, meaning that apps targetting Android 11 would not be able to query for information of other apps through the `PackageManager` without this permission. So it makes sense to also wall off this method in order to not leak any information about other apps installed on an user's device, even as a joke.

## UserManager.DISALLOW_FUN
[(reference)](https://developer.android.com/reference/android/os/UserManager.html#DISALLOW_FUN)

This constant refers to a device policy added in Android 6 Marshmallow (API 23) which restricts the user from having "fun". The description given in the developer documentation is, ironically, amusing and reminds me of something GLaDOS would probably say:

> Specifies if the user is not allowed to have fun. In some cases, the device owner may wish to prevent the user from experiencing amusement or joy while using the device.

This is in fact a real device policy that a device owner may change to restrict what users of the device is able to do with it. And third-parties can then hook into this to disable features of their app that are deemed "too fun". I don't know if any third-party apps actually make use of it, but in the Android system it is used to disable the Android version easter egg that shows up when pressing the version label in the settings.

Considering that "fun" easter eggs like the Google Chrome "No internet" Dinosaur minigame end up being distractions that e.g. schools want to disable for enrolled devices ([see Chromium issue #41159706](https://issues.chromium.org/issues/41159706)), maybe the Android version easter egg could very much be a distraction depending on the version.

## Chronometer.isTheFinalCountdown()
[(reference)](https://developer.android.com/reference/android/widget/Chronometer#isTheFinalCountDown())

The `Chronometer` class had a new method by the name of `isTheFinalCountdown` added to it in Android 8 Oreo (API 26). When called, it will send an Intent to open the YouTube video for *The Final Countdown* by Europe.

No really. That's what it does:

```java
try {
	getContext().startActivity(
		new Intent(Intent.ACTION_VIEW, Uri.parse("https://youtu.be/9jK-NcRmVcw"))
			.addCategory(Intent.CATEGORY_BROWSABLE)
			.addFlags(Intent.FLAG_ACTIVITY_NEW_DOCUMENT
				| Intent.FLAG_ACTIVITY_LAUNCH_ADJACENT));
	return true;
} catch (Exception e) {
	return false;
}
```

Marvelous.

## PackageManager.FEATURE_TOUCHSCREEN_MULTITOUCH_JAZZHAND
[(reference)](https://developer.android.com/reference/android/content/pm/PackageManager.html#FEATURE_TOUCHSCREEN_MULTITOUCH_JAZZHAND)

This constant was added in Android 2.3 Gingerbread (API 8) and is used to describe a device that supports tracking 5 simultaneous touch inputs, with the name being a reference to [Jazz hands](https://en.wikipedia.org/wiki/Jazz_hands).

## Log.wtf()
[(reference)](https://developer.android.com/reference/android/util/Log.html#wtf(java.lang.String, java.lang.String, java.lang.Throwable))

According to the developer documentation, WTF stands for "What a Terrible Failure" (sure...), and is intended to log things that should *never* happen. It logs the message at the assertion level.

## AdapterViewFlipper.fyiWillBeAdvancedByHostKThx()
[(reference)](https://developer.android.com/reference/android/widget/AdapterViewFlipper.html#fyiWillBeAdvancedByHostKThx())

This is a method with an oddly humourous informal name, which was likely caused by some developer coming up blank on naming it and has now ended up in the public Android API, being added in Android 3.0 Honeycomb (API 11). It gets called by an `AppWidgetHost` when advancing the views inside of the `AdapterViewFlipper` object.

Indeed, naming things is one of the two hard problems in computer science, the other being off-by-one errors and cache invalidation.

## IBinder.TWEET_TRANSACTION
[(reference)](https://developer.android.com/reference/android/os/IBinder.html#TWEET_TRANSACTION)

The Android Binder system is used for performing IPC and transactions are distinguished using different types, one of them being... `TWEET_TRANSACTION`. It was added in Android 3.2 Honeycomb (API 13) and claims to be used to send a tweet to a target object.

It does not actually do anything, let alone send a tweet. The document mentions that messages have a limit of 130 characters, referencing Twitter's old message character limit.

## IBinder.LIKE_TRANSACTION
[(reference)](https://developer.android.com/reference/android/os/IBinder.html#LIKE_TRANSACTION)

In a similar fashion, a new transaction type by the name of `LIKE_TRANSACTION` was added in Android 4.0.3 ICS (API 15). It's used to tell an app that the caller likes it, there is no counter to keep track of the amount of likes but it is claimed that sending such transactions will improve the app's self-esteem.

## SensorManager.SENSOR_TRICORDER
[(reference)](https://developer.android.com/reference/android/hardware/SensorManager.html#SENSOR_TRICORDER)

I do have to admit I didn't know what a Tricorder is, but it appears to be a fictional device from Star Trek and the constant was "added" in Android 1.0 (meaning it likely was present since before Android's first official release).

The SENSOR_* constants in `SensorManager` have since then been deprecated in API level 15 in favour of the `Sensor` class, which does not include any equivalent reference to the Tricorder. Unfortunate.

## SensorManager.GRAVITY_*
[(reference)](https://developer.android.com/reference/android/hardware/SensorManager.html#GRAVITY_DEATH_STAR_I)

The `SensorManager` class has a lot of constants which store the gravitational velocity of various bodies in our solar system ranging from `GRAVITY_SUN` to `GRAVITY_PLUTO`. While whether any of these outside of `GRAVITY_EARTH` is useful in any real-world scenarios is debatable, there are some that are actually just jokes.

`GRAVITY_DEATH_STAR_I` stores the gravity of the first Death Star in SI units (referred to as Empire units). This appears to be a Star Wars reference.

`GRAVITY_THE_ISLAND` stores the gravity of "the island". Apparently this is a reference to The Island in the 2004 TV show [Lost](https://en.wikipedia.org/wiki/Lost_(TV_series)).

## &lt;blink&gt;
Last one, and this one is particularly crazy. Did you know there is a hidden tag inside the Android view layout system by the name of `<blink>`? Because that is a thing:

```java
// [TAG_1995 = "blink"]
if (name.equals(TAG_1995)) {
	// Let's party like it's 1995!
	return new BlinkLayout(context, attrs);
}
```

It makes any children that is wrapped inside of it blink, like the old `<blink>` HTML tag. This one appears to be completely undocumented in the Android Developer reference, but was added [in a commit in 2011](https://android.googlesource.com/platform/frameworks/base/+/9c1223a71397b565f38015c07cae57a5015a6500%5E%21) with the title "Improve LayoutInflater's compliance" (right...) and is still present in the AOSP master branch.

Whether you should actually use it is debatable however.
