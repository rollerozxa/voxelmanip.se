---
title: How to check if you are behind CGNAT
---

Carrier-grade NAT (CGNAT) is a technique used by some ISPs where many customers will share one single public IP address, in order to mitigate IPv4 address exhaustion. However this also has the added downside that you cannot easily host a publicly accessible server from home, even if you have port forwarded.

So if you are planning to set up a publicly accessible from home, whether it be hosting a game server to just making something at home remotely accessible when you're on the go, it is useful to check if you are behind CGNAT by running a traceroute on your external IP. This post goes over the steps to do so as well as suggestions if you are behind CGNAT.

<!--more-->

## Obtaining your external IP
To prepare, you will need to obtain your external IP as websites on the internet see it. There are many places that can tell you it but one way is to go to [DuckDuckGo](https://duckduckgo.com) and simply search "what is my ip address". It will show your IP address below the search field (along with a GeoIP lookup which may or may not be accurate).

{% include image.html
	name="external_ip.webp"
	alt="Screenshot of DuckDuckGo, searching for 'what is my ip address'. Below it shows the IP address as well as an approximate location." %}

## Performing a traceroute

### Windows
1. Press `Win + X`

2. Type "cmd.exe" into the run dialog that appears and press Enter.

3. Type `tracert <external IP>` into the command prompt.

### Linux, macOS, etc.
1. Open a terminal.

2. Type `traceroute <external IP>` (requires `traceroute` to be installed on Linux, usually available in your package manager)

## Analysing the traceroute
After you've done a traceroute on your own external IP you can inspect the text it outputs. Whether you are behind CGNAT or not can be determined based on the amount of hops the traceroute will return. If the traceroute returns a single hop like such and then finishes then you **are not** behind CGNAT:

```
traceroute to 78.71.XX.XX (78.71.XX.XX), 30 hops max, 60 byte packets
 1  78-71-XX-XX.example.org (78.71.XX.XX)  0.567 ms  0.643 ms  0.702 ms
```

However if there are multiple hops to the external IP, especially ones within the `100.64.0.0` to `100.127.255.255` range that are reserved for CGNAT, or if the traceroute doesn't complete at all then you **are** behind CGNAT.

## Circumventing CGNAT
The best way of circumventing CGNAT would be of course to get rid of it altogether, if possible. Some ISPs may allow you to be allocated a public IP free of charge if you contact them or fill out a form to request one, for example the Swedish ISP Bahnhof [has a form to do so](https://bahnhof.se/privat/kundservice/bestall-publik-ip/). You will need to do some research as it varies wildly depending on your ISP, they may also be unwilling to do this even for personal use and require you to upgrade to a business plan to provide such a service.

If you have a VPS or other accessible server in the cloud you can set up a tunnel to your home network that will be accessible through that cloud server. However this usually means renting a server for a certain amount of money a month and you may as well want to host it fully in the cloud there. If you know friend with a cloud server and some bandwidth to spare who would be willing to tunnel it then that could also be a viable solution. Otherwise there are also freemium services offering to tunnel your connection such as [playit.gg](https://playit.gg/) that allow other people to connect without installing any additional software.

There is also the Free [Yggdrasil network](https://yggdrasil-network.github.io/) which allows you to host services on the network without even needing to port forward. However everyone wanting to connect will also need to be connected to the Yggdrasil network.

This post has focused primarily on IPv4, but [if you have access to IPv6](https://ipv6-test.com/) then it is likely that it is public as the IPv6 address space doesn't suffer as much from exhaustion as IPv4, allowing you to host over IPv6 only. But keep in mind there are still a lot of people who do not have any IPv6 connectivity (myself included!) who wouldn't be able to connect.
