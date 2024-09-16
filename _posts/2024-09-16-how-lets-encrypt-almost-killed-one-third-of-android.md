---
title: How Let's Encrypt almost killed 1/3 of Android
tags: Android History
---

Nowadays HTTPS is no longer a luxury only afforded by your bank and other high security websites, but something every website simply should have. Because why shouldn't you, when there are free certificate authorities that allow you to conveniently secure your site for visitors as well as giving you access to transferring over HTTP/2?

But it has not always been this way. In fact, a decade ago it was quite uncommon to see HTTPS for small, personal or noncommercial websites that simply could not afford to pay the obscene prices that old certificate authorities charged. That is, until Let's Encrypt was launched.

<!--more-->

## The little certificate authority that could
Let's Encrypt was originally launched back in 2014 by the Internet Security Research Group as a project to provide free HTTPS certificates and promote the widespread adoption of encrypted HTTPS for websites. It was a promising endeavour and by the next year they had developed a method to automatically verify the ownership of a domain to issue a domain-validated certificate, subsequently issuing the first Let's Encrypt certificate to [helloworld.letsencrypt.org](https://helloworld.letsencrypt.org/).

For their use cases, Let's Encrypt created the ISRG Root X1 root certificate. However in order for HTTPS certificates to be valid to a browser it needs to be signed somewhere in the chain by a certificate authority that exists in the CA store of the operating system. Back in 2015, no operating system or browser contained the ISRG Root X1 certificate and it would take several years for it to trickle down, so until then they would need to bootstrap it by in turn signing it with a certificate authority that had already been in circulation in CA stores for some years. [They ended up being cross-signed](https://letsencrypt.org/2015/10/19/lets-encrypt-is-trusted) by IdenTrust's DST Root CA X3 and all was good for some years, until Let's Encrypt's own CA would proliferate into operating systems and browsers CA stores.

## "Standing on our own feet"
By 2020 the cross-sign was one year away from expiring, and ISRG Root X1 was present in the CA store almost all operating system and browser versions that people were using. You would think that by this point it would be safe for Let's Encrypt to stand on their own with their root certificate. But there was one operating system where it had not fully proliferated yet.

Android.

The Android ecosystem has had a very rough life, and while it has gotten better throughout the years with pressure from Google it still suffers from Android version fragmentation, caused by manufacturers shipping out phones that they barely support with software updates. This has lead to not-so-insignificant parts of the ecosystem stranded on old versions of Android.

For ISRG Root X1, it had only gotten introduced into the CA store in Android 8 Oreo originally released in 2017. Yet at that time in November 2020 about a third of the Android ecosystem was still on a version older than that. Even I personally was using a phone running Android 6 Marshmallow at that time, which had been abandoned by the manufacturer since several years back and of course did not contain the ISRG Root X1 certificate.

Faced with this conundrum, Let's Encrypt published a blog post [Standing on Our Own Two Feet](https://letsencrypt.org/2020/11/06/own-two-feet.html) explaining the situation and how, what at the time consisted of 33.8% of the Android ecosystem, would be cut off from a large part of the modern Internet on the 1st of September 2021.

It is of course never a situation you would want to be in, but Android version fragmentation is a complex issue even predating the existence of Let's Encrypt, and it was out of scope for the Internet Security Research Group to fix. Affected users on Oreo and earlier were recommended to switch to Firefox for Android, which bundles its own CA store updated independently from the system CA store and contains the ISRG Root X1 certificate.

## IdenTrust's comeback
However about a month later, Let's Encrypt published [another blog post](https://letsencrypt.org/2020/12/21/extending-android-compatibility) with an update on the situation. They had come to another agreement with IdenTrust to cross-sign their root certificate with DST Root CA X3 for three more years as a stop-gap measure. But DST Root CA X3 itself was also going to expire within that time! So how would that work?

> This solution works because Android intentionally does not enforce the expiration dates of certificates used as trust anchors.

Oops! Well, that was convenient for Let's Encrypt. Because now IdenTrust could still vouch for ISRG Root X1 for several more years and Android would still happily trust it until ROllerozxa gets his new shiny phone. All is well again, though I did take their suggestion to switch to Firefox for Android, because using uBlock Origin on a phone is quite nifty. Ahem.

## Quiet murder
But of course all things must come to an end, even temporary workarounds. In July of 2023 [Let's Encrypt announced they were finally going to shorten their chain of trust](https://letsencrypt.org/2023/07/10/cross-sign-expiration) with the expiry of the stop-gap measure. At that point I had gotten a new phone, and so had many others because the marketshare for Android phones that contained ISRG Root X1 has risen from 66% to 93.9%. The situation was no longer as dire, and they felt safe proceeding with the shortening of the certificate chain of trust.

On the 8th of February 2024, the cross-signed certificate was no longer provided to people who requested new certificates by default. While it could be configured to keep the cross-signed certificate until the 6th of June 2024, this was the point of no return for the remaining Android devices, who will start to see certificate warnings on any website that uses Let's Encrypt.

{% include image.html
	name="security_warning.webp"
	alt="Screenshot of the security warning message in the built-in Android Kitkat web browser."
	caption="Well, at least you can still continue." %}

On the 30th of September 2024, the last cross-signed certificates will expire and Let's Encrypt will no longer be functional for any websites visited from old versions of Android without the ISRG Root X1 certificate manually installed. While the current state of the Android ecosystem in terms of version fragmentation is still not great, as of writing 95.7% are now using Android Oreo and above.

The disaster was at least greatly mitigated thanks to IdenTrust and a quirk in the Android certificate logic, and Let's Encrypt can now stand on their own feet with their root certificates, succeeding in the mission they set out to complete about a decade ago to promote the widespread adoption of HTTPS.
