---
title: Goodbye Google Play
tags: Android
cover_alt: Screenshot of the Google Play Console dashboard, with a red banner at the top saying "Your Developer Profile and all apps will be removed from Google Play on 3 February 2025", as well as a red warning message on the home page saying the same thing.
---

As of the 3rd of February this year, my Google Play developer account will be permanently deleted, along with the apps I had published throughout the years. It was my decision to do it, but my hand was more or less forced by Google's new Google Play developer verification policy update which makes it not really viable for me as an individual app developer to remain on Google Play anymore.

<!--more-->

## The beginning
I initially created my Google Play developer account back in January of 2023. At the time, it was just a *fun little thing*, and the first thing I had published after paying the developer fee was a fork of the Luanti engine bundled with the [NodeCore game](https://content.luanti.org/packages/Warr1024/nodecore/) and some modifications to make it feel like a standalone game. Later I also published ROllertest, a fork of Luanti particularly focused on improving the mobile gameplay experience, [Box Smasher](https://boxsmasher.voxelmanip.se) and some more stuff.

It was quite interesting having the ability to publish apps to the Play Store and having any Android user be able to install it in a convenient manner. Because while Android is still an open ecosystem where you can install APKs from anywhere, for most regular people the process of allowing unknown sources is scary enough that Google holds an effective monopoly over Android app distribution, barring a few exceptions.

In particular when I released ROllertest onto Google Play, it got quite a lot of traction at a time where it was a much better experience than the upstream Luanti app. But after some time things ended up souring when Google announced a certain upcoming policy update.

## The policy update
Back in July of 2023 Google published information about an upcoming policy update for developers on Google Play, namely a new developer verification process that all developers will have to go through if they want to keep their app on the Play store. You will need to provide them varying identification documents to prove you're a real person who has this name, lives at this address, and so on.

Of note is that before this update Google *still required verification* of varying kinds to open a developer account. What I provided to Google was a picture of my ID card with my legal name, my home address, phone number, an email address for correspondence and because of the payment fee, I also gave them my debit card information. This is information that Google assumedly already and still has on-file for me, and why they decided to implement this new process to verify what they already know is beyond me.

Personally I would have no issue giving this information privately to Google a second time as a Google Play developer. Because even though Google has a track record of *doing some shit*, what they also have is practically a clean record for data breaches of core account data in recent times.

But in addition to keeping this information privately, Google will at the very least publish the full legal name of developers who have gone through the new verification process on their developer profile.

Err... no thanks.

It is unclear if the phone number used for verification will also be public for individual developers, but that could be easily solved. Legal name is a whole another story since I live in a country with practically nonexistent privacy laws for citizens which puts yourself in a quite vulnerable position by giving that out, and I don't have a sea of namesakes I can hide in either. So I generally prefer to be pseudonomous when public on the Internet, and will likely stay so for the foreseeable future.

It's also worth noting however that people who have been selling paid apps or in-app-purchases have already been required by Google to provide a public address on their developer profile, your home address in the case of individual developers. This is certainly more understandable when you are actually charging people money and run a personal business as an app developer. But in my case the apps have been free and also open source, take them or leave them, you do not need to know where I live to determine whether the app is good, safe or useful.

## The deadline
For some reason, Google laid out the roll-out of the verification over a very long time, where developers could select a given date to be verified with an accompanying deadline as long as the date is available.

So of course, I picked the date that was as far in the future as possible, and my deadline ended up being the 3rd of February 2025. At the time it felt very far into the future, and I also felt a tiny glimmer of hope that conditions maybe would have changed for the better until then, whether it be in my country or at Google.

Very naïve of me, I know.

It probably goes without saying that I do not plan on following the verification process, and what likely will happen now is that my developer account will be permanently deleted alongside the apps I had published. It's a bit unfortunate, but I also do not see myself wanting to publish any more apps to Google Play as an individual in the future, so I do not regret the decision.

## Moving forward
Moving forward I'll hope to get the things I care about onto **[F-Droid](https://f-droid.org/)** instead. As all the apps I had ever published on Google Play were free and open source, there's nothing about them that couldn't have been available on F-Droid had I followed the process to get it included there.

Of most importance would be my game [Box Smasher](https://boxsmasher.voxelmanip.se) which is currently in the pipeline for being published onto F-Droid while things such as the Base64 converter app will come in due time, along with various other apps I'll have available for Android in the future. However apps that are past their end of life, such as ROllertest, I will simply take the opportunity to let them finally disappear for good. The official Luanti Android app has been significantly improved since then, both by me and other contributors, that I feel like it has been completely surpassed now.

I have previously done the work to get [Principia](https://f-droid.org/packages/com.bithack.principia/) onto F-Droid, which in turn gave me a lot of knowledge about how F-Droid's app packaging system works. Compared to other app stores such as Google Play, the developer does not simply upload a binary APK that they will then distribute, but you will need to write a YAML file containing the app's metadata as well as commands to build the app from source. It is more similar to traditional Linux distribution repositories and their packaging system.

In addition to this, no binary program blobs are allowed to even exist in the build environment either, and every library and component of the app need to be fully built from source during the build process. The result is an app store containing apps which are fully auditable and, while simply having available source code does not mean it is safe, their app analysis and behaviour scanning process help to make F-Droid as safe as it can possibly be.

But most importantly, F-Droid respects developers' right to privacy. Because the code can simply speak for itself.
