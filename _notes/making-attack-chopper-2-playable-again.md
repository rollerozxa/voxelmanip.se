---
title: Making Attack Chopper 2 playable again
last_modified: 2026-10-08
---

Attack Chopper 2 is a J2ME phone game released by Adam Schmelzle in March of 2007, as the sequel to Attack Chopper. Being a free game, it was monetised through advertisements with an option to pay to remove ads. The only version of the game I could find on the web used the MobileRated ad system, which requires a connection to the ad servers to display an ad before the game can be played.

Since the ad servers are down for MobileRated as well as the option for payment being unavailable, this makes it effectively impossible to play the game now (not to mention the shutdown of 2G networks in large parts of the world). Thankfully there is a way of inputting a key, originally intended to be generated after payment, to manually unlock the game without network connectivity. This key can be guessed in order to make the game playable again.

The games that use the MobileRated monetisation system would be about two decades old and for a platform generally considered obsolete now. The company behind MobileRated (Kalador Technologies Inc.) has also been defunct for a decade. As such, I don't see any issue with documenting the algorithm and offering a way to generate a key for the game.

<!--more-->

## Key generator
This is a simple JavaScript tool which runs entirely in your browser.

Start the game, and navigate to Purchase Game -> Pay Online in the MobileRated menu. Then enter the code shown into the input field and click "Generate key".

<div id="js-key-container"></div>

<script src="generate-key.js"></script>

You will get a key that can be input in the manual activation screen (Press OK in the Pay Online menu and then select Enter Key Manually). Once the key is accepted, the game is playable again and the MobileRated menu will no longer be shown on startup.

{% include image.html
	url="mobilerated_activated.webp"
	alt="MobileRated: Key accepted - you will no longer have to download advertisements." %}

## The algorithm
This is a description of the algorithm used in Attack Chopper 2. I assume this is general for all games using MobileRated's monetisation system except for the values of X and Y which would be game-specific, but I don't have any other games to compare. Let me know if you have any other game using MobileRated that you want to play again and I can try to figure out what differs.

- Let X be 4042. This is the game ID specific for Attack Chopper 2, which is visible to the user and would likely differ for another game with the same activation system.
- Let Y be 1585. This is a secret value stored within the game's code, which may or may not be the same for all games.
- Let Z be a currently unknown number between 0 and 9999. This is generated upon first launch and stored to create a persistent unique ID for the install.

When going into Purchase Game -> Pay Online, a code will be shown which is generated based on X and Z, concatenating three different parts together:

`code = X + "-01" + (2 * X + 3 * Z)` (example: `4042-0122640`)

As X is known, we can retrieve the Z that was generated for the install.

```
22640 = 2 * 4042 + 3 * Z
Z = (22640 - 2 * 4042) / 3
Z = 4852
```

Once Z is known, we can generate a key which can be input in the manual activation screen (Purchase Game -> Activate (after payment) -> Enter Key Manually).

`key = 3 * Y + 2 * Z`

So resulting key in this example becomes `3 * 1585 + 2 * 4852 = 14459`.
