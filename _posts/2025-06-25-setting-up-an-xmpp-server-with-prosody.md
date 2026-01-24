---
title: Setting up an XMPP server with Prosody
tags: Guides XMPP
cover_alt: Screenshot of the index page of the Prosody web server
---

[XMPP](https://en.wikipedia.org/wiki/XMPP) (also known as Jabber) is an open chat protocol for instant messaging. It is also federated meaning that everyone can talk and communicate with people on other XMPP servers, one-to-one or in multi-user chats (MUCs). It supports transport layer encryption using TLS, as well as end-to-end encryption using OMEMO.

[Prosody](https://prosody.im/) is a modern XMPP server written in Lua that aims to be simple and very light on resources. I've been running my own XMPP server using Prosody for the past couple *years* at this point, and this blog post is a guide from what I've learned for setting up an XMPP server using Prosody, complete with HTTP file sharing for sending images and other files and MUCs for creating group chats and public chat rooms on your server.

<!--more-->

## Requirements
What you'll want ready at hand:

- Some kind of Internet accessible Linux server you can run 24/7.
	- For demonstration I'm hosting mine on Debian, and some instructions will be specifically for Debian and derivatives, but should be possible to follow along on other distro branches.
	- In terms of specs: Just about anything can work, down to the cheapest VPS you can find.
- A domain name you can set up some subdomains underneath.
- Certbot for requesting certificates for the XMPP server.
- Nginx for reverse proxying the HTTP file share. (highly recommended...)

I'll be showing what is more or less exactly my setup, which has the added bonus that the subdomains and paths I show will be accessible for you to check. But of course you'll want to change things to point to your domain, server, etc.

It's probably also worth iterating that specs of the server *really* does not matter for XMPP, absolutely anything will work. It is extremely lightweight and the memory usage of Prosody is in the range of 25MB or so. You will be amazed, especially if you have looked at the resource usage of other software such as Matrix' Synapse server.

### Domains
XMPP supports SRV records to point a domain to another server, allowing you to use a domain that has an A record pointing elsewhere than the server that is hosting the XMPP server.

For a more concrete example: This website as `voxelmanip.se` is in fact hosted on the same server which would make this unnecessary. But if this website were to move somewhere else (say some fancy serverless static site hosting solution), my XMPP server could remain functional with `@voxelmanip.se` addresses even though the A record does not actually point to the server that Prosody is hosted on.

So for the DNS records I use to make it happen:

| type | name                                | port | target             |
| ---- | ----------------------------------- | ---- | ------------------ |
| A    | xmpp.voxelmanip.se                  | N/A  | [my server's IP]   |
| A    | files.voxelmanip.se                 | N/A  | [my server's IP]   |
| SRV  | _xmpp-client._tcp.voxelmanip.se     | 5222 | xmpp.voxelmanip.se |
| SRV  | _xmpp-server._tcp.voxelmanip.se     | 5269 | xmpp.voxelmanip.se |
| SRV  | _xmpp-server._tcp.muc.voxelmanip.se | 5269 | xmpp.voxelmanip.se |

I then use `voxelmanip.se` as the main XMPP domain that will show up in user addresses, `files.voxelmanip.se` is reused for HTTP file sharing, and `muc.voxelmanip.se` is used for hosting MUCs (and points back to the same `xmpp.voxelmanip.se` subdomain with a SRV record).

You don't need to have a certificate that's valid for xmpp.voxelmanip.se, though for simplicity's sake if your DNS provider has support for it you could go with a wildcard certificate that is valid for all subdomains. If you're using Cloudflare's DNS as I do, I have [another blog post for that](/2025/06/23/wildcard-https-certificates-with-certbot-and-cloudflare-dns/).

Otherwise you'd want want to generate a single certificate using Certbot that is valid for the main XMPP server domain, the HTTP file share and the MUC subdomain, passing a comma separated list like such:

```bash
sudo certbot certonly -d voxelmanip.se,files.voxelmanip.se,muc.voxelmanip.se
```

## Installing Prosody
First, [install Prosody](https://prosody.im/download/). On Debian & derivatives you can find a package in the repositories. If you are on the latest Debian Stable or similar, this should be recent enough:

```bash
sudo apt install prosody
```

However Prosody also [provides their own custom `apt` repository for Debian and Ubuntu](https://prosody.im/download/package_repository) that will give you the very latest version of Prosody, which may be preferred.

In addition to Prosody, you should also install the Lua DBI SQLite3 backend module, since we'll be configuring Prosody to use a SQLite data storage rather than the built-in flatfile storage:

```bash
sudo apt install lua-dbi-sqlite3
```

## Initial set-up
Once installed you can find the configuration files in `/etc/prosody/`, of most interest being `/etc/prosody/prosody.cfg.lua`. Open it with some text editor (e.g. nano, you will also need root to access it):

```bash
sudo nano /etc/prosody/prosody.cfg.lua
```

By default Prosody will use a built-in flatfile data store. There are a lot of different backends, including ones that use more fully featured SQL database systems such as PostgreSQL, but SQLite should be more than enough for even medium sized XMPP servers. To make Prosody use the SQLite data store uncomment the following lines in the "Storage" section:

```lua
storage = "sql"

sql = { driver = "SQLite3", database = "prosody.sqlite" }
```

Then we will add the main VirtualHost. Remove the placeholder `VirtualHost "localhost"` and put a VirtualHost with the domain that you will want to use for the domain portion of user addresses. You should also point to an encryption key and certificate, the name should be the name of the certificate that Certbot uses (usually the main domain, like in this case). They don't exist there right now but we'll put them there:

```lua
VirtualHost "voxelmanip.se"
	ssl = {
		key = "/etc/prosody/certs/voxelmanip.se.key";
		certificate = "/etc/prosody/certs/voxelmanip.se.crt";
	}
```

Because of permissions you can't directly point to the certs you have obtained from Certbot (and Prosody heavily discourages you from messing with permissions to make that possible). But `prosodyctl` has a useful command to automatically import certificates that match the domain used by the XMPP server from Certbot's data directory:

```bash
sudo prosodyctl --root cert import /etc/letsencrypt/live
```

To then have it automatically import when renewing the certificate, you can add a deploy hook in Certbot that will run the above command on each new renewal, so your copied certificate for the XMPP server won't accidentally expire.

```bash
sudo certbot renew --deploy-hook "prosodyctl --root cert import /etc/letsencrypt/live"
```

Then allow ports 5222 and 5269 (for client-to-server and server-to-server communication respectively) in your firewall on TCP. As an example for UFW:

```bash
sudo ufw allow 5222,5269/tcp
```

Now enable and start the `prosody` service, restarting it if it was already running.

```bash
sudo systemctl enable prosody
sudo systemctl restart prosody
```

By default Prosody doesn't allow open registrations from XMPP clients, which is likely what you want if you just want to run a server for yourself and maybe some other people you invite. To create your account from the terminal you can use `prosodyctl`, entering a user address with the domain you are using:

```bash
sudo prosodyctl adduser user@example.org
```

It will then prompt you to enter a password, and to confirm the password. You should then also add your own account to the list of admins in the Prosody config file:

```lua
admins = { "user@example.org" }
```

## Getting an XMPP client
To test your newly set up XMPP server you'll first need to install some kind of XMPP client.

On desktop I use [Gajim](https://gajim.org/), which works on Windows, macOS and Linux. On my phone I use [Conversations](https://f-droid.org/en/packages/eu.siacs.conversations/) for Android. [But of course there are more clients to choose between](https://xmpp.org/software/).

For the XMPP client you have chosen, log in with your credentials. If everything works right it should now be functional! If you get certificate errors then there would be some issue with getting the certificates. You should be able to view the certificate that is being used in your XMPP client, but Prosody also comes with a handy command `prosodyctl check` in order to troubleshoot issues with configuration and certificates.

If you don't want to be able to send images, or create group chats on your server, then you would be done at this point... But by all means, continue reading, as setting up the rest isn't too complicated.

## HTTP file share
XMPP supports a convenient way of uploading and sharing files during conversation through [XEP-0363: HTTP File Upload](https://xmpp.org/extensions/xep-0363.html). Prosody supports this with [`mod_http_file_share`](https://prosody.im/doc/modules/mod_http_file_share) (available since 0.12), allowing you to send images and other files to people you talk over XMPP.

By default when creating a `http_file_share` component, Prosody will start a HTTP server listening on port 5280. You could expose this to the Internet... But I would really recommend using the web server you likely already have running on the server, such as Nginx, to act as a reverse proxy.

I have the file share under the `files.voxelmanip.se` subdomain, which is also where I have [my public file dump](/files/). So I have a location block for the `/~xmpp` directory in Nginx that will pass requests on to localhost on port 5280:

```nginx
location /~xmpp {
	proxy_pass http://127.0.0.1:5280/;
	proxy_set_header Host $host;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_set_header X-Forwarded-Proto $scheme;
	proxy_buffering off;
	tcp_nodelay on;
}
```

If you have made a dedicated subdomain for the file share, then you could of course just put it at the root with `location /`. But either way, in order to make your Prosody server aware of your reverse proxied file share, you'll need to set the `http_external_url` value to the full URL including any directory it's in:

```lua
Component "files.voxelmanip.se" "http_file_share"
	http_external_url = "https://files.voxelmanip.se/~xmpp/"
```

Restart Prosody, and now if you go to the root of the proxied HTTP file share you should see a "Prosody is running!" message with a witty random phrase underneath. In your XMPP client the ability to attach files should now no longer be grayed out, and you can select something to

The default limit for files in Prosody is 10MB and can be adjusted with `http_file_share_size_limit`. But Nginx also has a limit on the size of request bodies controlled using the `client_max_body_size` setting which defaults to 1MB. You will want to raise the limit to be greater or equal to the limit in Prosody, or else you'll run into HTTP 413 errors on the Nginx side.

## MUC (Multi-User Chat/Group chats/Channels)
There are many names for it, but the component itself is called a multi-user chat (shortened MUC), and can be used for setting up private group chats you invite people to, or public channels that anyone who know the room address (which are formatted like user addresses) of it can join.

MUCs are a separate component, and as such lives on a separate subdomain. You might want something short like `muc` as the subdomain. You'll want to give it a nice name, and probably want to make it so that only admins can create rooms (or `"local"` for only users on the same server) as compared to the default where *everyone* can create rooms:

```lua
Component "muc.voxelmanip.se" "muc"
	name = "Voxelmanip MUC systems"
	restrict_room_creation = true
```

If you are on Prosody 13.0 or newer then that should be everything!

However if you are on Prosody 0.12 (e.g. you are on Debian 12 Bookworm and are using Prosody from the official Debian repositories), then in order to allow setting the icon of a MUC you will need to install and enable the `mod_vcard_muc` module for the MUC component. In Debian and derivatives can be found in the `prosody-modules` package:

```bash
sudo apt install prosody-modules
```

And then you will add a line below the MUC component (*not* in the global server-wide settings) to enable the module:

```lua
modules_enabled = { "vcard_muc" }
```

### Advertising public channels
The most popular directory for public channels on the XMPP network is [search.jabber.network](https://search.jabber.network). The list is integrated into most XMPP clients and is where a lot of people will be browsing for channels to join on XMPP.

If you are on a popular XMPP server then the directory's crawler will automatically discover it, but when you are running your own XMPP server it will very likely not discover it. So in order to list a public channel that you have created from your own XMPP server you should invite `crawler@search.jabber.network`, which is the address of their crawler bot.

For more information about getting a channel listed see [Documentation for Channel Owners](https://search.jabber.network/docs/owners).

## Final thoughts
I originally set up an XMPP server in spring of 2023, but it stayed dormant for a while until I picked it up again in early 2024 to talk to what was my SO at the time. I have since brought on some other friends and people I occasionally talk to onto XMPP in a MUC group chat. XMPP has been a great platform from my personal experience over these years and Prosody has been running well during that time, remaining very light on resources and needing little maintenance once things were set up. Indeed, Prosody's tagline "A study in simplicity" very much holds true.

Gushing about this could fit another whole blog post but I'll remain brief and just mention some things I like about XMPP compared to other chat platforms:

- Compared to IRC it has built-in support for attaching files and media, message history when you're offline, profile pictures and E2E encryption.
- Compared to Matrix it has E2E encryption that actually works more often, and self-hosting a server is a much more realistic proposition than bloated Synapse (blergh).
- Compared to Telegram and Signal it does not require you to maintain a phone number and be tethered to a phone session to keep using it.
- Compared to Discord you are not locked into a single (bloated) app across all platforms, obviously you'll get E2E encryption too, and when self-hosting you are in control of your own account instead of Discord's Trust and Safety team.

I'm sure there are more examples. However XMPP is still a very niche platform, and you may have difficulty convincing others to join you on it if they are not already on it. But with your own XMPP server, you can also invite them in a more personal way by giving them an account on it, if you so desire.
