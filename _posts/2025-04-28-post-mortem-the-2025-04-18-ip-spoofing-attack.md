---
title: "Post-mortem: The 2025-04-18 IP spoofing attack"
tags: Anecdotes Sysadmin
cover_alt: "Screenshot of the reminder email received from OVH's abuse team the day after the attack. The background is a tiling list of firewall logs that were attached to the abuse reports showing a bunch of dropped and blocked connections to a certain IP. Some text in the email is scaled up which is the following: 'As explained in a previous message, this problem requires immediate action. Should the abusive behavior continue, we would be forced to suspend your service, as per our Terms. Please answer to this e-mail indicating which measures you've taken to stop the abuse behaviour.'"
---

DDoS attacks are an unfortunate reality on the Internet when you are hosting websites, or any other kind of service. The concept of a DDoS attack is relatively simple - You have a bunch of attacker controlled computers, and you have one victim. They all send requests to the victim at once and the target gets overloaded, happening either at the network or at the software layer.

But there are countless other possible attacks an Internet accessible server could receive, some possibly rarer than others. And the target ended up being me on the 18th of April 2025, when a regular DDoS attack ended up being something more that I had definitively not anticipated. An IP spoofing attack.

<!--more-->

## The attack
During the morning on Friday the 18th, I received an email from my cloud provider OVH that they have detected a DDoS attack, and that they have enabled their L4 DDoS mitigation to protect against the attack. All is well and nice.

Shortly thereafter I receive another email from OVH, but this time it is from abuse.ovh.net. Oh no.

It was an abuse report from another cloud provider saying that *my* IP address was part of malicious port scanning traffic. Attached was logs of traffic, my IP address as the source and a bunch of destination addresses operated by the other cloud provider performing requests to various ports such as the SSH port 22. That looks very concerning.

And then before I could finish reading it, there was another similar email, about a honeypot being triggered at a university in the Czech Republic. Same thing, malicious network traffic, fix it NOW.

It felt very unreal. Indeed, the reports were coming from other large cloud providers and reputable universities, so obviously this was not exactly being faked at their end. I already had a fuzzy idea about the concept of "IP spoofing" at this stage, but I also wanted to be absolutely clear it wasn't an actual compromise.

I quickly SSH'd into my server, took some measurements, looked at the system usage, sifted through the logs. A DDoS attack was undoubtedly still ongoing, but this malicious traffic that was being reported on just didn't exist.

I temporarily shut down all the services that were being hosted to try to isolate any potential malicious traffic. But it straight up did not exist. It's almost like something was being spoofed, and I'm merely the target for someone else's malicious traffic.

I checked the OVH dashboard, and the DDoS attack was still ongoing. TCP_RST, TCP_SYN and ICMP attack vectors. Surely this must be the cause of all this.

## Shared trauma
Through a series of search queries, I ended up at a [blog post from Delroth](https://delroth.net/posts/spoofed-mass-scan-abuse/) detailing a peculiar abuse report he received one night from a server he had hosting a Tor relay node. In contrast to Tor exit nodes, which funnel traffic straight into the wider Internet, Tor relay nodes only communicate with other relay nodes in the Tor network to transport your client's traffic to an exit node.

Nonetheless, Tor relay nodes are under the same scrutiny as exit nodes, and it appears to have been targeted as part of a wider attack on the Tor network in order to put pressure on nodes through generating abuse reports to their cloud provider.

From this point on, things started to make a tiny bit more sense. It was still fucked up, and the kind of thing I didn't even know was possible on the modern Internet. Digital swatting, [a Hacker News commenter likens it to](https://news.ycombinator.com/item?id=41988607).

But we'll get more into that later. Right now I had still a virtual server fire to take out.

## The damage
In the end, the DDoS attack lasted for about 4 hours. In that time, seemingly every corner of the internet had been reporting this spoofed traffic as coming from me, even during times when I had shut down everything on the server. [Checking the AbuseIPDB records for the IP 51.68.173.17](https://www.abuseipdb.com/check/51.68.173.17) lists 97 reports, from 59 sysadmins, all reporting traffic that straight up did not exist.

Somehow, AbuseIPDB had also detected the abusive activity as being spoofed and put my IP on a spoof protection whitelist.

> Important Note: 51.68.173.17 is an IP address from within our whitelist belonging to the subnet 51.68.0.0/16, which we identify as: "Spoof Protection".

Thanks, I suppose? First time I've seen AbuseIPDB do that. It was a small comfort to see from AbuseIPDB that, however they detected it, they confirmed the same thing I very likely assumed was the case.

These reports are all bogus.

I had responded to every abuse report I got from OVH, in a timely manner, explaining that I have taken steps to investigate the issue, and my conclusion that it is very likely a case of IP spoofing as a result of the DDoS attack that they are helping me mitigate. And that there appeared to be no compromise on my server, I'm the target in all of this and not a malicious actor.

I never heard back from them during Friday, but was hoping things could be resolved in an amicable manner. Day went to night, and I went to bed.

## The next day
I woke up on Saturday, and after an hour or two I got another email from OVH's abuse team. I assume it was an automated email, because it contained some of the abuse reports concatenated into one mess of an email, and a message at the top stating in no uncertain terms that I need to respond, or risk having the server be suspended.

Well, I sent a response, I would have hoped they could read my emails...

Easter holiday. Right. So how long will it take until some automated system suspends the server due to perceived inaction on my part? This is not going to go well.

I've been with OVH for about three years at that point, and I have heard various horror stories from people on the Internet about their experience with OVH. I always chalked it up as people who can't maintain unmanaged servers, dishonest people who got caught doing actual nefarious things and getting kicked out, and occasional blips in service quality (including [that time one of OVH's datacenters literally went up into the cloud in a fiery manner](https://www.reuters.com/article/world/millions-of-websites-offline-after-fire-at-french-cloud-services-firm-idUSKBN2B20NT/)).

But now I was the one seemingly getting fucked over. And I'm obviously not incompetent, nor dishonest (right?).

Feeling the heat that things could go down at any time, I felt the need to inform the most popular user-facing service I'm hosting on, that being [the website for the game Principia](https://principia-web.se). I put a red banner at the top of the website, with the following information:

> Urgent: OVH is currently threatening to terminate service following a DDoS attack on the server that Principia's web infrastructure is hosted on. The Principia community site will likely go offline at any point, with prolonged downtime while things are being moved to a new server.

In the end though, I acted fast before any downtime could possibly happen, because at the time I felt the only way out of this would be to move out to another provider. I went through all the names of cloud providers I have heard about in my head, and looked further into some of them.

After some selection I settled on Hetzner as the way forward. I ordered their cheapest VPS and began getting to work rebuilding everything on this new server, and managed to finish the most urgent things by the end of the day, pointing all the DNS records to the new server.

The sleep that night was fantastic.

## But who would do such a thing? And how?
Prior to this event I did still know that you could, in some way (...if all conditions are right and you are lucky and you have the right access...) spoof the source IP address of packets, and both cause DDoS attacks and other kinds of pressure from hosting providers. I was also under the impression that pulling off such an attack would be very difficult and only be used for very high profile targets, [unfathomably evil ones](https://en.wikipedia.org/wiki/Kiwi_Farms) at that. Or the Tor network, which another group likely celebrate any disruptions to it.

In reality, it seems like the Internet is completely broken, and the vulnerabilities in the infrastructure affects everyone eventually. Even people who just want to host their friendly blog and a site for people to upload their Principia levels, apparently.

Going into some more technical details for a moment, the reason IP spoofing is possible on the modern Internet is that there are *still* networks in use that do not validate the source IP of packets according to the [BCP38 spec](https://www.rfc-editor.org/info/bcp38). Meaning that someone with access to such a network can craft packets with source IPs that aren't even residing in that network and send them off to the Internet. And once it has gone too far into the Internet it is too late, and nobody knows the true origin of the packet (classic [confused deputy problem](https://en.wikipedia.org/wiki/Confused_deputy_problem)).

It's truly a mind boggling flaw of the Internet that I don't know how this is still around in the modern day.

I have some ideas for possible motives behind the attack, if any. Some are mundane, some are petty, and some are pretty uncomfortable scenarios. I'll leave those out from the public record for now.

## Conclusion
After going through all of this, I definitively know now that IP spoofing is actually a thing that occurs on the modern Internet, and is common enough of an occurrence that I was the target of it.

As of writing it has gone over a week since it occurred and while OVH has not responded to the responses to the abuse reports they sent out, the old server is still not terminated. I am not sure if they have resolved the tickets without saying anything, or if the server is simply in limbo now. But at least they ended up being more patient than I initially assumed they were going to be. Which, you know, is good!

I hope this post does not sour anyone's view on OVH, if they are currently using it or are considering using it. In fact a while back I was eyeing their new lineup of [AMD VPSes](https://www.ovhcloud.com/en-ie/vps/vps-epyc/) and was considering migrating to one of those from their previous-gen lineup of Intel VPSes I was on at the time. The prices of the new ones seem to be quite competitive for the specs you are getting.

But the new VPS I got at Hetzner was a bit of an upgrade too. So things worked out well in the end, either way.
