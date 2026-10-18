---
title: Principia and the Open Letter from Keep Android Open
tags: Android Anecdotes
cover_alt: Pixel art of the Android robot made inside of Principia
forum_thread: 174
---

[Keep Android Open](https://keepandroidopen.org/) is a grassroots campaign originally launched in October 2025 by Marc Prud'hommeaux as a response to [Google's Android developer verification announcement last year](https://android-developers.googleblog.com/2025/08/elevating-android-security.html), which requires all Android developers to pay a fee and verify their identity with Google even if they do not distribute apps through the Google Play Store.

I have previously written on my blog about the Google Play developer policy update that Google originally announced in July of 2023, and [how my Google Play developer account was suspended in February last year as a result of my refusal to comply](/2025/02/01/goodbye-google-play/). So when Google announced this new policy change for distributing *outside* of Google Play too, I was rather furious by the fact that Google is further exercising control over the Android ecosystem. Safe to say, I wholly supported the Keep Android Open campaign when it was originally launched, and got very intrigued to throw my hat into the ring as the [Principia](https://principia-web.se/) project maintainer.

<!--more-->

## The Open Letter
On the 24th of February 2026, Keep Android Open published an open letter addressed directly to a number of Alphabet and Google executives. The letter called for Google to entirely stop the rollout of the developer verification, arguing that it would have a negative impact on the Android ecosystem, the rights on users as well as individual app developers.

Among the groups of people mentioned to be most affected by the new policies were "Individual developers and small teams with limited resources" and "Open-source projects that rely on volunteer contributors"... hey, those two categories sound familiar. The open letter would then be signed by dozens of organisations and open source projects all standing in unity for the little people against Google. Gosh, this sounds too good to be true, can Principia be part of this?

This was a great plan. But they forgot to directly mention on the page the steps for projects or organisations to actually sign the open letter. Maybe they thought it was just too obvious, but preferably you would want as many projects and organisations to sign it, to show a unified front of collective action.

I had been eyeing the open letter since it was published. Then on the 19th of March, I published a news article on the Principia website titled [The future of Principia on Android](https://principia-web.se/news/25), going over how the new developer verification policy would affect Principia - being from an unverified developer as I will likely still not be registering for the developer verification system.

While posting about this on the Principia Fediverse account, I also [made a follow-up post](https://hachyderm.io/@Principia/116258083901455089) under the same thread as the news announcement mentioning the open letter by Keep Android Open and publicly mentioning the first email I sent to them expressing my interest in signing. I also specifically mentioned the [Keep Android Open Mastodon account](https://techhub.social/@keepandroidopen) in the post:

> I have also sent an email to @keepandroidopen showing my interest in signing this open letter to Google on behalf of Principia:
>
> <https://keepandroidopen.org/open-letter/>

The post received no reply, boost or even favourite from their account. I'm typically used to at least getting a favourite when mentioning others in announcement posts, and especially if you've got a movement going you will want to engage your supporters. But this is obviously no requirement. There are more important things to focus on, and there are also fully automated accounts which post from an RSS feed you should not expect any interactions from. However, they have boosted others' posts mentioning Keep Android Open in the meantime.

Being unsure of how the process went to sign the letter, and where to even send the email, I wrote an email detailing everything.

> From: `ROllerozxa <rollerozxa@voxelmanip.se>` \
> To: `info@keepandroidopen.org` \
> Subject: Signing the open letter to Google \
> Date: Thu, 19 Mar 2026 22:55:25 +0100
>
> Hi, my name is ROllerozxa and I am the project maintainer of Principia
> (<https://principia-web.se>), an open source physics-based sandbox game,
> which is available on Android among other platforms.
>
> I have personally previously been the victim of Google's updated
> developer verification policies on Google Play that would have
> required me to publish my legal name to continue having apps on Google
> Play, something which I refused to do
> (<https://voxelmanip.se/2025/02/01/goodbye-google-play/>).
>
> Principia is not available on Google Play partially for this reason,
> and this new developer verification process also directly affects the
> continued availability of Principia on Android (being distributed as
> an APK from our website) as I do not have high hopes for what personal
> information Google will publish about me as part of the verification
> process. Today, I published a news article on our website about this:
>
> <https://principia-web.se/news/25>
>
> With this context, the fight to keep Android an open platform is very
> important for Principia, and as such I am writing to ask whether it is
> still possible to sign this open letter that was published last month:
>
> <https://keepandroidopen.org/open-letter/>
>
> If so, I would like to sign it on behalf of Principia as the
> maintainer of the project. Thank you.
>
> Kind regards \
> ROllerozxa

Essentially, I did not want to sign the open letter just because it would put more attention to Principia but because we are directly affected by the new verification policies. As well as mentioning my previous personal experiences with Google's developer policy updates that make me so passionate about this issue.

The email received no response. After digging some more, I found that there was a separate `signatories@keepandroidopen.org` email that seemed to have been intended for those wishing to sign the open letter. So I sent another email to that address forwarding the first email.

> From: `ROllerozxa <rollerozxa@voxelmanip.se>` \
> To: `signatories@keepandroidopen.org` \
> Subject: Fwd: Signing the open letter to Google \
> Date: Sat, 28 Mar 2026 18:55:12 +0100
>
> Forwarding the email to this other address since I'm unsure which one
> I was supposed to send to. I'm still interested in signing the open
> letter on behalf of Principia as the maintainer of the project.
>
> [...]

I also went onto the issue tracker for the keepandroidopen.org website and commented in the [How to sign the open letter ? (#220)](https://github.com/keepandroidopen/keepandroidopen.github.io/issues/220) issue, hoping to help others that might have had the same mistake with the email address:

> I've also been trying to sign the open letter on behalf of [Principia](https://principia-web.se) as the project maintainer of it. I originally wrote an email to info@keepandroidopen.org, but apparently you may need to send an email to signatories@keepandroidopen.org - the process to sign the open letter feels a bit unclear.

I got no response to the second email.

On the 16th April, I left another comment in the GitHub issue about still getting no response. I mentioned Marc in the hopes that it maybe would have brought his attention if the emails weren't being received, or if there was someone else managing the signatories.

> Update - still no response about the email I sent on the 28th of March and I'm still unsure how to proceed. @marcprux did you get my email, is it monitored or is there another way I'm supposed to contact you or whoever it is that is managing the signatories?

I received no response from Marc, but I did receive a reply in the issue from p1gp1g, Unified Push maintainer, about how they did get a response:

> For information, I got a response on my side: they told me they took time to answer because of a long backlog of signatories to add

Unified Push had been added to the list of signatories of the open letter [on the 6th of April](https://github.com/keepandroidopen/keepandroidopen.github.io/commit/18c05cbf587e51b61a50c9329fe37d2e254614f1), 10 days after my dialogue with p1gp1g. Them having a large backlog of emails is understandable, and I waited patiently hoping that I would receive a response once they got to me.

But I still received no response, and Principia was not present in the list of signatories. After Unified Push was added, iodé, FACiL, GitHub Store, XMPP Foundation and GNU/Linux València was added during April and May. The whole source of the website is stored and version controlled in a Git repository, and [the full history of the signatures.yaml file can be seen](https://github.com/keepandroidopen/keepandroidopen.github.io/commits/main/src/data/signatures.yaml). They were still accepting signatories at this point.

For open source projects hosted on GitHub, the best thing would really have been to allow them to open a pull request to add themselves to the list of signatories. However, the top of the YAML file tells you specifically not to:

```
# Please do not file pull requests adding signatures to this file.
```

So I did not. The [maintainer of Lemmy tried to](https://github.com/keepandroidopen/keepandroidopen.github.io/pull/329), but was closed on their own accord without being merged. Below the above line, there were some more comments with information:

```
# Signatures from notable organzations (e.g., with a Wikipedia entry)
# should be emailed to signatories@keepandroidopen.org by an
# authorized representative of the group with an attestation that
# the organization's leadership authorized the signing of the letter.
```

I still don't know if this should be interpreted as:

- Only signatures from notable organisations are accepted (but with what criteria?).
- Notable organisations should write to `signatories@keepandroidopen.org` with more formal attestation, smaller projects can just write to `info@keepandroidopen.org`.
- Everyone should write to `signatories@keepandroidopen.org`, but for notable organisations we need a more formal attestation.

I'm the Principia project maintainer. We have no Wikipedia entry, but neither do other signatories that are close to the "scrappy" open source project level that Principia is and which did get added. We are still a mature open source project with history going back over a decade when including the time before the open source release, and not some personal project that started last week. I wrote to both addresses.

Some time passes by, and it falls to the back of my mind. I still receive no response, nor has Principia appeared in the list of signatories.

Later in June, I sent a follow-up email to the same signatories email I forwarded my email to, just in case. A short and direct email that clearly described my intentions and asking if there is anything else I need to do in order to sign the letter.

> From: `ROllerozxa <rollerozxa@voxelmanip.se>` \
> To: `signatories@keepandroidopen.org` \
> Subject: Signing the open letter \
> Date: Mon, 8 Jun 2026 10:25:02 +0200
>
> Following up on the previous emails I sent in March, I'm still interested
> in signing the open letter on behalf of Principia, as the maintainer of the
> project. Let me know if there is anything else that is needed from me.
>
> /ROllerozxa

To this day, I have never received a response, either by email or some other way, and I'm not quite sure how to feel about it.

This would have been a chance for all the little people to band together - along with advocacy groups, non-profit organisations, and also a state-funded Norwegian consumer rights organisation apparently - united for user freedom and against Google's overreach of the Android ecosystem. But it feels a bit bittersweet now.

Keep Android Open's site specifically identifies individual developers, small teams and volunteer projects as among those most affected. Principia is an open-source project maintained by primarily one volunteer, and its Android distribution is directly affected by the policy. It fits squarely into many of the talking points, so I find it disappointing that things ended up this way.

Even if all my emails bounced (which I'm gonna be honest is always a nagging feeling whenever sending email), I had still tried to reach contact through both Mastodon and on the GitHub issue tracker. These may not be as closely monitored (the GitHub issue tracker sits mostly untriaged and seems to be used more as a discussion forum), but I still don't think I did not receive a response due to a lack of trying.

While writing this blog post, I decided to send a final email to `info@keepandroidopen.org` on the 3rd of October to get clarification on whether they received my emails and if so, if there was a reason Principia wasn't added to the list of signatories. Maybe the reason was short and simple. But as of the time of writing (10th of October), I have not received a response, and I'll leave it at that.

No hard feelings to anyone involved, but I still felt like writing this blog post to fully process everything and get it behind me.

I did not privately reach out to Marc or anyone else who may potentially be involved in the open letter, as I did not consider it to be appropriate to side-step their official communication channels. After all, I have this banner on the top of [my own contact page](/contact/) pointing people to the Principia Wiki or other community channels for questions about Principia that do not require my personal attention:

> **Questions about Principia?** \
> Unless there is something that actually needs my personal attention, please ask them in Principia community channels such as the forums or the Discord, or read on the Wiki. I don't have time to give private support to everyone.

## The end
So that is where the story ends, but the consequences of Google's new policies - which started the movement in the first place - will likely be felt for years to come.

{% include image.html
	name="principia_android_warning.webp"
	alt="Starting in 2027, Google will block installation of Principia on Android devices with Google Play. To install Principia onto an Android device running Google Play services going forward, you will need to accept installation of apps from unverified developers. When Google asks you whether someone is instructing you to install the app, answer 'No' to proceed. You will be required to restart and then wait for 24 hours before you can install Principia if this is your first time installing an app from an unverified developer. Installation from a computer with ADB bypasses this restriction. For users in Brazil, Indonesia, Singapore, and Thailand, you may already be blocked from installing Principia as part of Google's early rollout beginning in September of 2026. This is entirely out of our control and not something we can fix." %}

In September 2026, the rollout of the Android developer verification system began in select countries. And a worldwide rollout is slated for 2027.

The advanced app installation flow by Google still remains for those who wish to install apps such as Principia on Android going forward. You will need to wait a bit before you can install it, but ADB will still work without any delay. However Google altered the deal of the Android app ecosystem, and we pray they do not alter it further.

Of course, this would not be such a big blow if the smartphone market wasn't a duopoly of Apple and Google, and an effective monopoly for those where iOS devices are out of reach. This goes far beyond simply mobile gaming. [Nura (formerly postmarketOS)](https://nura.eco/) still gives me hope that the status quo will be challenged sometime in the future, but making it viable for day-to-day use will only be possible when civic services, banks, public transport and other essential functions in modern society that have since become digital don't require an Apple or Google certified device to access. Until then, it remains a secondary device novelty, and I remain on Android.
