---
title: TOTP - The most misunderstood 2FA method
tags: Informational Guides
cover_alt: "'TOTP - Time-based one time password'. The Google Authenticator logo is used as an asterisk above TOTP, in the background are screenshots of 2FA instructions for various services."
---

Time-based one-time password (TOTP), RFC 6238, is an authentication method commonly provided as a means of 2FA for many services. It is a great alternative to other 2FA methods such as SMS.

It is unfortunately also very misunderstood due to the common misconception that it requires a phone or a proprietary app, but the algorithm is fully open and the process to generate a code does not depend on any external sources other than the fabric of time itself.

<!--more-->

There are also a number of lightweight implementations of the algorithm available that allow you to use TOTP without locking yourself into some proprietary app, some which I will go over in this blog post.

## How does it work?
The algorithm works by taking a key, which can be basically any value and is usually shown as a Base32 encoded string, and combining it with the current (Unix) timestamp to generate a numeric code, usually 6 digits in length.

```
           unix timestamp
                v
key string -> [TOTP] -> numeric code
```

I won't go into the technical details about the algorithm (you've got HMAC and then you sprinkle in the time...) but the timestamp gets divided into 30 second window segments where the code always stays the same when given the same key, until the next window occurs. To note however is that this process works fully offline, and uses publicly available cryptography functions making an implementation of the algorithm not too complicated.

## That's great, so what is the issue?
As mentioned in the introduction it is very commonly misunderstood due to the instructions provided by various services imply that it requires a phone or a proprietary app. The method is also commonly referred to as just an "Authenticator App" and proprietary phone apps such as Authy or Google Authenticator get mentioned, which are TOTP implementations that are very opaque and don't give you any way to retrieve the underlying key that the algorithm works on, causing lock-in in the process.

{% include image.html
	name="discord-auth.webp"
	alt="Download an authenticator app - Download and install Authy or Google Authenticator for your phone or tablet."
	caption="Discord's instructions for 2FA installing an \"Authenticator App\"" %}

The most common way of adding keys to common authenticator apps is by a QR code you would scan with your phone, but the key itself is usually provided next to it or hidden behind a dialog box. This is what you'd actually want to obtain.

{% include image.html
	name="github_totp_key.webp"
	alt="Scan the QR code - The QR code is scribbled out, a green link 'setup key' points to a dialog with a two-factor secret (key)."
	caption='Github "Authenticator App" instructions. If you ignore the QR code you can just grab the key itself.' %}

If the website does not give you the key itself you can of course also obtain the key from the data that is encoded in the QR code.

```bash
>>> qrtool decode qr.png
otpauth://totp/GitHub:ozxabot?secret=344PJ3AS6BRFOAJ3&issuer=GitHub
                                     ^ (This is the key)
```

## Anatomy of a key
The most common keys you'll come across are Base32 encoded strings of arbitrary length looking like alphanumeric strings. They are case insensitive meaning it does not matter if the letters are capitalised or not, it will always generate the same code. Sometimes the key may be provided with spaces, but they are merely for human consumption and will not affect the generated code.

```
2A2X5LZVVI5Y
2a2x5lzvvi5y
2a2x 5lzv vi5y
2a 2x 5l zv vi 5y
```

...Are all the same code, and any compliant implementation will generate the same code for each within the same time window.

## oathtool
`oathtool` is a command line utility part of the [OATH toolkit](https://www.nongnu.org/oath-toolkit/) that can be used to generate various one-time passwords used for authentication, including TOTP when using the `--totp` argument. It is broadly available across Linux, including inside of Termux on Android, and can be made to work on Windows if you really want to.

To generate a code, simply pass the key you got from the website along with the `-b` argument to signify it's Base32 encoded, like such:

```bash
oathtool --totp -b "<key>"
```

You can also generate several codes at the same time by passing a `-w` argument with the amount. The following generates the 5 following codes:

```bash
oathtool --totp -w 5 -b "<key>"
```

For simplicity's sake I'm showing how to pass the key directly as an argument to `oathtool`, but doing it this way also makes it show up in your terminal history which may not be desired. You can make `oathtool` read the key from a text file by passing the filename after an @ in place of the actual key:

```bash
oathtool --totp -b "@key.txt"
```

And if you pass `-` as the key it will read from stdin:

```bash
< key | oathtool --totp -b "-"
```

Devising a clever Bash oneliner to retrieve the key from an encrypted text file is left up as an exercise to the reader, but in general `oathtool` is very flexible about how you want to input the key if you want to make things fancier.

## A web-based TOTP code generator
Reading up on the specification of RFC 6238 made me wonder how difficult it would be to write a web-based TOTP code generator, using the Web Crypto API to provide the necessary cryptographic functions.

Turns out, not that much. The resulting generator is available on **[totp.voxelmanip.se](https://totp.voxelmanip.se/)** and runs entirely on the client side with JavaScript.

I previously used `oathtool` for all my TOTP needs, including using it inside of Termux on my phone, but now I have been using this generator ever since I first created it. It has worked well enough for me that I am confident in recommending it.

It is hosted on GitHub Pages and the website is fully open source, with the JavaScript code powering it available to read [here](https://github.com/rollerozxa/totp.voxelmanip.se/blob/master/js/script.js).

## Storing the key
Usually you would want to store the key like any other secret. I store it in my password manager.

Storing your TOTP key in a password manager may be a bit controversial, but realistically it should be fine. If you are using a password manager you are likely in the 0.01% that take their accounts' security seriously, with randomly generated unique 50-character passwords. And the convenience of having it encrypted in your password manager and synced across devices makes it likely more secure than trying to store it out-of-band in a way that might not even be encrypted.

## Do you even need 2FA?
When the topic of requiring 2FA on websites comes up, there is usually the question of "Do I even need 2FA?", and of course that depends on the account and what is tied to it as well as how good your password hygiene is in general.

If you have been entrusted with knowing the passwords of less computer savvy relatives or friends you likely know that the vast majority have extremely poor password hygiene and use one or a handful of easily memorable passwords, maybe with some permutations but that's about it. If any one of those accounts were of any value they would be very easily compromised using credential stuffing attacks, and in that case 2FA would be a very effective deterrent to stop account compromise.

If you're among the minority that use a password manager and keep long randomly generated passwords, then the the need may not be as dire. However if the security of an account is critical then there would not be any reason *not* to add TOTP if it is supported. Because even if your key is stored in your password manager alongside your very strong password, the rolling codes have the special attribute of being time sensitive and expiring after a short while and are undoubtedly another security mechanism for your account.

If you are required to enable some method of 2FA on a service, such as how GitHub has been requiring it for any account with substantial activity, then using the TOTP method would be the most convenient for ensuring compliance with that guideline. Some people have accused GitHub/Microsoft of harvesting phone numbers with forced 2FA because of the fact people believe the only way of doing 2FA is through SMS or an "Authenticator app" on your phone, but that is very far from the truth and as shown with e.g. `oathtool` you do not need to compromise on privacy in any way to enable 2FA on your accounts.
