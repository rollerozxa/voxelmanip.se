---
title: Installing Let's Encrypt certificates on old versions of Android
tags: Android Guides
cover_alt: Image showing the Let's Encrypt logo to the left and the Android robot to the right holding a marshmallow (referencing Android 6), the marshmallow has the Let's Encrypt padlock logo edited onto it.
---

If you have tried to use any older Android device running Android Oreo 7.1 or below, you might have noticed insecure connection errors when trying to access websites in the browser, or Webview boxes in apps that show a blank page. The problem you are running into is likely that the site uses Let's Encrypt for their HTTPS certificates, who began dropping support for Android 7.1 and below in February of 2024 as a result of dropping the certificate that provided compatibility for older versions of Android.

While there are alternative browsers such as Firefox that bundle their own CA store and will still work without any further configuration, you can also manually install the missing certificate to make websites function again without security warnings in all apps that rely on the system's CA store.

<!--more-->

If you'd like to learn more about the cause of this happening to websites secured by Let's Encrypt, [the previous blog post](/2024/09/16/how-lets-encrypt-almost-killed-one-third-of-android/) goes over this in great narrative detail. But if you just want to fix it, then read on in this blog post.

## First things first
In order to access most of the encrypted Internet nowadays you need to support TLSv1.2. Android has supported TLSv1.2 since Android 4.1, but was disabled unless the target API level was high enough. Android 4.4 Kitkat and onwards should always have TLSv1.2 support, which includes Android 5 Lollipop, Android 6 Marshmallow and Android 7 Oreo which support TLSv1.2 but do not have the Let's Encrypt certificate.

If you connect to a website, say this website, on an even older Android version you will get an error message that a connection could not be made at all. In that case the issue is more than just lacking certificates and the whole encryption stack is obsolete. In order to access websites on such a device you would need some kind of proxy that you connect to that supports TLSv1.2 but that will communicate with your device over a connection that it understands, but that is out of scope for this post.

## Instructions
The instructions and screenshots are for stock Android. Most customised vendor ROMs should also have the ability to do this, but the settings app may look different.

### Download certificate

First of all you'd want to download the root certificate [ISRG Root X1 (`isrgrootx1.pem`)](https://letsencrypt.org/certs/isrgrootx1.pem) from Let's Encrypt's website. This can also be found from the [Chain of Trust](https://letsencrypt.org/certificates/) page.

Preferably you should download the root certificate on a system with functional certificates and transfer it to the Android device to prevent the downloaded root certificate from being possibly tampered. With ADB you could push it onto the phone like `adb push isrgrootx1.pem /sdcard/`. But whether you find this to be necessary is up to you.

### Install the certificate
Go to the Settings app and go into the Security page.

{% include image.html
	name="1.webp"
	alt="Screenshot of the main settings app dialog. The Security button is outlined." %}

Scroll down to the "Credential Storage" section and select the "Install from SD card" option. It works even if you don't have an SD card, as all Android versions past a certain point emulate an external storage.

{% include image.html
	name="2.webp"
	alt="Screenshot of the 'Credential Storage' section of the 'Security' page. The 'Install from SD card' button is outlined." %}

Select the `isrgrootx1.pem` file in the file picker that shows up.

{% include image.html
	name="3.webp"
	alt="Screenshot of the filepicker, a file called 'isrgrootx1.pem' is outlined." %}

It will ask you to name the certificate. The name you give it does not matter or need to match, but we'll write "ISRG Root X1" for correctness sake. For "Credential Use" the default "VPN and apps" works fine.

{% include image.html
	name="4.webp"
	alt="Name the certificate - Certificate name is 'ISRG Root X1', Credential use is 'VPN and apps'." %}

If you haven't set up a lock screen PIN yet it will prompt you to add one.

{% include image.html
	name="5.webp"
	alt="Attention - You need to set a lock screen PIN or password before you can use credential storage." %}

Once that is done it should have been installed.

{% include image.html
	name="6.webp"
	alt="ISRG Root X1 is installed." %}

Once a custom root certificate is installed, Android will send a warning notification on each boot telling you that the network may be monitored.

{% include image.html
	name="7.webp"
	alt="Network may be monitored by an unknown third party." %}

This is because a custom untrusted root certificate being installed without your knowledge could make an attacker able to perform MITM attacks on encrypted connections without causing certificate errors, as the certificate is trusted on the device. But Let's Encrypt is a trusted certificate authority and if you downloaded the root certificate over a trusted connection you can simply ignore the notification, and swipe it away.
