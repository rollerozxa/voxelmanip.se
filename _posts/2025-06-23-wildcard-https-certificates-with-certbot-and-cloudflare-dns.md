---
title: Wildcard HTTPS certificates with Certbot and Cloudflare DNS
tags: Guides Web
cover_alt: Screenshot of Firefox viewing the certificate for voxelmanip.se, which includes the wildcard *.voxelmanip.se domain. The Let's Encrypt and Cloudflare logos are shown to the right.
---

Wildcard HTTPS certificates allow you to generate a certificate that will be valid across every subdomain of a domain, which is a great convenience if you manage a lot of subdomains. However with great power comes great responsibility as in order for Let's Encrypt to validate that you are in control of the entire domain, you will need to pass a DNS-based challenge, as compared to a traditional HTTP-based challenge for an individual subdomain.

In order to handle this in an automated fashion you will typically need integration with your DNS provider in order to add the necessary records for the DNS challenge. If you are using Cloudflare for DNS, you're in luck as Certbot has a plugin for managing the DNS through Cloudflare's API. This guide assumes you already have Certbot installed and have generated some certificates, but want to replace it with wildcard certificates spanning entire domains.

<!--more-->

## Generating an API key
Go to the Cloudflare dashboard, press the profile icon in the top right corner, select Profile from the dropdown and then API Tokens in the sidebar. (You can also [go directly to it here](https://dash.cloudflare.com/profile/api-tokens))

Click "Create Token" and select the Edit zone DNS API token template. You may choose to restrict it to a specific domain (zone resource) in your Cloudflare account, or select "All zones" from the dropdown if you want it to work for all your domains.

Click continue, and confirm to create the API token. You'll get a token in the form of an alphanumeric string you should copy and keep for later.

## Certbot setup
You will want to install the Cloudflare DNS plugin for Certbot, which will depend on how you installed Certbot. If you are on Debian or a derivative Linux distribution and you installed Certbot from `apt`, this would be how you install it:

```bash
sudo apt install python3-certbot-dns-cloudflare
```

Create a configuration file inside `/etc/letsencrypt` and edit it with e.g. `nano`:

```bash
sudo nano /etc/letsencrypt/cloudflare.ini
```

Put the token you generated in the previous section into `dns_cloudflare_api_token`, like such:

```ini
dns_cloudflare_api_token = FUNNYCLOUDFLARETOKENAAAAAAA
```

Then change the permissions of the file such that it is not world readable (the plugin will complain otherwise):

```bash
chmod 600 /etc/letsencrypt/cloudflare.ini
```

Now, generate a new certificate containing the wildcard domain as well as the bare domain (which is not covered by the wildcard) using Certbot, passing `--dns-cloudflare` to enable the Cloudflare DNS plugin and `--dns-cloudflare-credentials` to specify the credentials file.

If you already have a certificate for the bare domain (maybe also with a bunch of subdomains) that you want to replace with a wildcard, you can specify it with `--cert-name` in order to update the list of domains it is valid for. As an example:

```bash
sudo certbot certonly --cert-name example.org --dns-cloudflare --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini -d '*.example.org' -d 'example.org'
```

The DNS verification may take a little bit longer than normal HTTP verification due to DNS propagation, but should not take too long. Once complete you'll have a nice wildcard certificate, if you edited an existing certificate you should be able to just restart your web server and see the new one with a wildcard being served.

## Troubleshooting
If the plugin complains about the properties `dns_cloudflare_email` and `dns_cloudflare_api_key` not being found, then it means you're on an old version of the Cloudflare Python library (older than 2.3.1) that don't support the newer fine grained API tokens. You'll most likely run into this if you're on Debian Buster (which has 2.1.0 in the repositories) or some other old distro.

...You should probably update your server, or install Certbot and such in a Python virtualenv to get a newer version of the Cloudflare Python library. But nonetheless, you can find the old global API key on the same [API Tokens](https://dash.cloudflare.com/profile/api-tokens) page under "Global API key", which you can then put alongside the email for your Cloudflare account:

```ini
dns_cloudflare_email = email@example.org
dns_cloudflare_api_key = FUNNYCLOUDFLAREKEYAAAAAAA
```
