---
title: El Telco Loco
tags: Android History
no_cover: true
---

When developers need to put placeholder strings or values in code, they tend to be very creative in what they come up with. Sometimes it may be obscene and cause issues for their company when it eventually shows up in binaries or released source code. But most of the time it is nothing more than an amusing joke, maybe an inside joke in the development team with a backstory.

Such was likely the case with El Telco Loco, a fictional mobile operator that used to exist as a placeholder name in Android, and was inadvertently exposed to users through a peculiar turn of events.

<!--more-->

## Jajaja... Va?
El Telco Loco is Spanish for "The Crazy Telco", Telco referring to a company providing telecommunications services. You can also tell how well it rhymes and rolls off the tongue when you say it, and it existed in the `SimulatedCommands` class of the telephony component in the Android Open Source Project:

```java
// [com.android.internal.telephony.test.SimulatedCommands]
public void getOperator(Message result) {
	String[] ret = new String[3];

	ret[0] = "El Telco Loco";
	ret[1] = "Telco Loco";
	ret[2] = "001001";

	resultSuccess(result, ret);
}
```

The string is present as far back as the Android M3 RC20a pre-release SDK build from November 2007, and I am sure the person on the original Android development team felt very proud about their funny pun. (Edit: Someone pointed out that the name may have been a play on the restaurant name El Taco Loco, which sounds like a plausible origin considering it does exist on the US west coast)

Normally the values present in `SimulatedCommands` should not be visible on any end user build of Android, as they are only used to simulate the presence of telephony in a testing environment. And every Android device that gets released to consumers will have functioning telephony, right? A phone would be quite useless without being able to use it like a phone after all.

## The Tablet
In 2009 there were rumours of Apple releasing a touchscreen device with a very large screen and running the iPhone OS. Big as a table, the rumours said. A tablet! It ended up being released in 2010 as the iPad we all know and... accept.

Everyone else didn't want to get left in the dust like when Apple released the iPhone, so they thought about upsizing Android to run on tablets. This was still back in the Android 1.x-2.x days before Honeycomb made tablets a first class citizen and long before the "phablet" form factor was made into the norm, let alone high density screens. But manufacturers made do and ended up releasing some tablets to compete with the iPad on the price, for people who maybe didn't mind the half-optimised software.

Most early Android tablets came with telephony support allowing you to plug in a SIM card and browse on the go with mobile data, just like the "WiFi + 3G" model of the iPad, and even just as a novelty being able to place phone calls and send SMS with it. But in the name of lowering costs and making that tablet all the more enticing for people comparing prices, removing telephony altogether sounded like an interesting idea.

For (almost) every Android version, Google releases a [Compatibility Definition document](https://source.android.com/docs/compatibility/cdd) which contains a list of requirements that manufacturers are required to follow for their devices to be considered "Android" and eligible for pre-installing Google Mobile Services. For [Android 1.6](https://source.android.com/static/docs/compatibility/1.6/android-1.6-cdd.pdf), the *Appendix C: Future Considerations* mentions devices without telephony support, stating that they are required:

> Android 1.6 is intended exclusively for telephones; telephony functionality is not optional. Future versions of the Android platform are expected to make telephony optional (and thus allow for non-phone Android devices), but only phones are compatible with Android 1.6.

However, in the subsequent documents for [Android 2.1](https://source.android.com/static/docs/compatibility/2.1/android-2.1-cdd.pdf), 2.2 and 2.3, the policy on devices without telephony has changed to allow it, though with some caveats:

> Android [2.1/2.2/2.3] MAY be used on devices that do not include telephony hardware. That is, Android [2.1/2.2/2.3] is compatible with devices that are not phones. However, if a device implementation does include GSM or CDMA telephony, it MUST implement the full support for the API for that technology. Device implementations that do not include telephony hardware MUST implement the full APIs as no-ops.

Namely the APIs must still be implemented, as to not crash apps that may call into telephony APIs, but can simply be stubbed out. But it seems that some manufacturers discovered the `SimulatedCommands` class as a quick fix to provide the telephony functionality needed for Android compatibility, and went with it.

Some manufacturers may have changed the operator name to something resembling a placeholder name to hide it, but some left it in. An example of a manufactured Android tablet that appears to report its mobile carrier as El Telco Loco is the Augen Gentouch Tablet, where you can find many old forum posts about people confused, or perhaps amused by the name, or thinking it is a device name they can customise.

Some old builds from the Android-x86 project, such as their initial Android 1.6 Donut build also report its carrier as El Telco Loco, not exactly a manufactured device but this was where I first saw this while testing old Android-x86 versions in a virtual machine. The baseband version is listed as "SimulatedCommands" and of course, El Telco Loco as the carrier.

{% include image.html
	name="android-x86-carrier-info.webp"
	alt="Two screenshots shown side-to-side. One screenshot shows the Network name as 'El Telco Loco', and the second screenshot shows the Baseband version as being 'SimulatedCommands'." %}

## The aftermath
After Android 2.3 Gingerbread, Google went on to develop Android Honeycomb which was designed for the larger screens of tablets in mind. Assumedly other considerations were made during Honeycomb's development to bring tablets up to a first class citizen in the Android ecosystem, such as Android natively understanding the concept of a telephonyless device without manufacturers needing to resort to workarounds.

Nowadays the 3.x Honeycomb line is mostly forgotten, both due to Google not releasing AOSP sources for it and being very quickly overshadowed by 4.0 Ice Cream Sandwich and the subsequent 4.x versions. But it was undeniably a big step for Android that shaped it into what it became during 4.x and later versions, 4.1 Jelly Bean being the version that shipped by the original Nexus 7 tablet for example.

As for our crazy telecommunications company, it was removed and replaced with a more obviously fake carrier name [in an AOSP commit in January 2016](https://android.googlesource.com/platform/frameworks/opt/telephony/+/59d1e823d9a%5E%21/#F0) corresponding with some development version of Android Nougat, and the story ends there.
