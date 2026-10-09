---
title: That time I broke the laws of physics
tags: School
cover_alt: 3D render of an overbalanced wheel in what looks like a lab environment.
---

During the first year of Gymnasiet (equiv. to 10th grade) we had an assignment about creating a perpetual motion machine - a machine that can be run indefinitely without an energy source to produce energy and by extension, electricity.

Obviously, such a machine does not exist in reality due to physics (on this blog we obey the laws of thermodynamics!), but it is a funny title and assignment description. The assignment was focused more on product development: sketching and designing a product, creating a manual and marketing materials, and presenting a pitch of your product to potential investors.

<!--more-->

## But should we do it?
As is typical with all school projects here, you will need to do some reflection on your work to show that you have basic reasoning skills and understand that not everything is as simple as it seems. So initially in preparation of the project we had a writing assignment about the impact to society and the world if such a machine were to be invented, both the good and the bad.

We watched a film about [William Kamkwamba](https://en.wikipedia.org/wiki/William_Kamkwamba), who became well-known after building a wind turbine out of a bicycle and other scrap parts from a local junkyard in his village in Malawia. While wind power has become a controversial subject across the political spectrum in Western countries, the debate about whether wind power plants ruin the scenery feels very quaint when contrasted with an African community where it genuinely made a huge impact in the face of famine and other problems facing their community.

For our advanced society, we basically need all the energy we can get our hands on to keep it going with the life and standards that we expect. However, the pursuit of increasing amounts of energy to fuel our lifestyles also have a bad side to it. The discovery of oil in the Middle East has caused an enormous amount of conflict in the area as the world's demand for fossil fuels remain, and the wealth from this generally only favour a small elite in the local population.

Another thing we brought up discussed was the construction of solar power plants in Africa, specifically the countries that get the highest amount of sunlight throughout the year. This offers a lot of opportunity for constructing plants that can generate fully renewable energy in large deserts that get a lot of sunlight throughout the year. Environmentally, this sounds great! However, there is a question whether the local communities benefit from this or just the totalitarian regimes who are doing business with Western countries and China. The energy is renewable and free of fossil fuels, but still ends up being exploitative.

Later in my Environmental studies course we had an assignment about writing [a text about how the world could look like in 50 years](/the-world-in-2072/). To contrast from things that were almost a bit naively optimistic, I also extrapolated this previous point to its logical conclusion by describing a global south that has become entirely conquered to keep the rest of the world running:

> Take Africa and South America for example, which many regard as the world’s power stations and factories due to the vast solar power plants that supply a large proportion of the world’s energy via the global electricity grid [...]. It is a grim truth, but also something that many choose to ignore so that they can enjoy a more luxurious everyday life.

Regardless of diversification efforts for energy sources and financial portfolios, there are still a huge number of wealthy people and groups who derive their wealth solely from the production of energy, fossil fuels or not. An actually functional perpetual motion machine would disrupt this overnight - it'd bring a "post-scarcity" economy regarding energy, but what would happen next is the question. Fossil fuels and the problems that come with them would be eradicated, but would the world accept this new paradigm?

Really, if you were to have actually invented a perfect perpetual motion machine, you might as well keep it to yourself and generate energy through it while staying under the radar - enriching yourself while living an ordinary life from the outside, not too different from if one were to win big at the lottery. The world would not be ready for such a technology, which is probably for the better that it is physically impossible to do so.

Now that the reflection is over, we no longer need to concern ourselves with the consequences of our actions, and can go ahead with it anyway.

## The Design
Initially we would design our machine, choosing a type of perpetual motion machine and sketching out the design on paper with measurements.

There are various versions of perpetual motion machines, that in one way or the other could theoretically function were the laws of thermodynamics not to exist. I chose the overbalanced wheel (aka [Bhāskara's wheel](https://en.wikipedia.org/wiki/Bh%C4%81skara%27s_wheel)) which consists of a wheel with some kind of free rolling weights that cause the wheel to constantly spin due to the center of balance repeatedly shifting due to the wheel spinning. Confusing? Well that's because it is, as the way it would function is essentially a paradox.

{% include image.html
	name="wheel_balls.webp"
	alt="A wheel with insets with a free-rolling ball in each."
	max_width=640 %}

Initially we were meant to make a sketch of the machine with precise measurements. To get in all the measurements I sketched it both from the front and in a cut side view. I've never been particularly good at making circles on paper, and we did not have any grid paper for this assignment. Oh well.

{% include image.html
	name="sketch.webp"
	alt="Sketch"
	caption="I was complimented by my teacher about my well drawn circles."
	max_width=640 %}

Once the sketch was done, we have the specifications to design it in a CAD program. We had previously been using Autodesk Inventor in a recent CAD course to model out objects from provided schematics, but this time we were designing it based on our own. Once all the measurements, constraints as well as all the damn marbles were in place, I was able to make an isometric lineart render out of it.

{% include image.html
	name="machine_linedraw.webp"
	alt="Isometric lineart of the machine, showing a wheel with marbles in each spoke sitting on a stand."
	max_width=400 %}

I also made a simple stand for the machine to sit on, attached via a stick that would allow it to still rotate. For generating power I just made a literal black box generator that would connect to the backside and generate power for two power sockets and a USB port (modern technology!), but for aesthetics I did not make the generator visible in the simple linedraw render.

In addition to a linedrawn render I also made a very fancy photorealistic render while playing with Autodesk Inventor's 3D rendering capabilities. This lab-like setting felt quite fitting to use for the render, and it also includes the transparent cover and generator on the back.

{% include image.html
	name="machine_render.webp"
	alt="3D render of an overbalanced wheel in what looks like a lab environment."
	caption="Infinite energy is now (photo)real(istic)."
	max_width=700 %}

## The Manual
With almost everything you buy you get some sort of manual, whether it is in physical form or a link to a digital PDF, even if it may be something the use of which you would think is obvious. *(How do I use my mouse mat now again? Wonder if it supports Linux...)* And of course if our perpetual energy machine is going to be a success we will need a manual for assembly instructions and troubleshooting information.

While most my other classmates used Google Docs for this, I chose LibreOffice Writer to the amusement of some in the class. Google Docs' main distinguishing factor is the ability to collaborate on documents in real-time, but when you don't need the collaboration features its limited featureset and lack of control over the document layout becomes quite apparent.

We were told that our machine needs to be assembled from parts by the user, and we could not just simply say that it comes pre-assembled out of the box. So I took all of the parts of the CAD model and made isolated lineart renders of them for a parts list: A wheel, 40 marbles, a transparent cover, a stick, a stand and the power generator.

{% include image.html
	name="manual_parts.webp"
	alt="Parts - In the box there should be: Wheel, Marbles (x40), Cover, Stick, Stand, Generator" %}

The instructions were made to be as simple to follow as possible. While I _did_ write instructions for each steps, I also made illustrations for each: Putting the marbles in each spoke, putting on the transparent cover and waiting for the glue to stick, putting the wheel onto the stand and then connecting the generator. The manual was all in Swedish, but the illustrations make it easy to get what you're supposed to do anyways.

{% include image.html
	name="manual_instructions.webp"
	alt=""
	caption="Bargain bin IKEA instruction manual."
	max_width=700 %}

In addition to creating assembly instructions that are simple and easy to follow with illustrations for reference, there is also some worldbuilding involved to make the manual feel more authentic, such as an introduction section thanking you for purchasing the product:

> **Your new eternal machine** \
> Thank you for purchasing our perpetual motion machine, Perpetulium™! This is a marvelous contraption<sup>1</sup> which can achieve a lot of great things! It is like your own power plant, which can create energy for you at no cost whatsoever – since it doesn't need any!
>
> It has two power outlets and a USB port which it can deliver power to when it is running. You can connect any electronics to these - it could be a lamp, a kettle, or a power cable to a computer.

<sup>1\.</sup> The original Swedish manual phrases it as "en makalös manick", which is a reference to the song [Den Makalösa Manicken](https://www.youtube.com/watch?v=Vtua8rqCNC0) by Michael B Tretow (of ABBA fame) - featuring a "mad scientist" figure inventing a overcomplicated Rube Goldberg machine which is able to cook porridge during the summer, if you are lucky.

As nothing is perfect and issues may arise with our product, we were supposed to include a section for common troubleshooting issues and how to fix them. I also added a section on maintenance of the machine to keep it in good working order, and instructions for relubricating the machine or removing the cover if necessary.

> **Tips for a happy machine**
> - Keep it in a room-temperature environment.
> - Do not expose it to excessively humid conditions.
> - Handle with care when moving it.

The result ended up being quite a sleek and professional looking manual. As part of the marketing material, I also made an edit of the manual's front page on top of a wooden texture to make it look like it was lying on a table.

{% include image.html
	name="manual_on_table.webp"
	alt="The front page of the manual with the title Perpetulium lying on top of a wooden background"
	max_width=960 %}

<p class="center">I also had the time to meme around a bit.</p>

{% include image.html
	name="perpetööm_måbile.webp"
	alt="Faux IKEA manual with the title 'Perpetööm Måbile', a lineart render of the machine in the middle and a modified IKEA logo in the bottom left that says 'EEEE'."
	max_width=240 %}

## The Pitch
Finally, we were supposed to create a pitch for our product, a presentation targeted at investors to convince them to invest in our product.

I'm not quite sure why we would need this as the prospect of infinite energy would likely make any investor fall out of their chair from the sheer force that they will throw money at you, but we continue the product development roleplay.

The pitch consisted of a slide deck introducing the problem, my solution in the form of the Perpetulium machine, how it works and how it will change the world.

> **The world with Perpetulium™**
> - What would happen in the world with Perpetulium™?
> - The world's carbon emissions would plummet
> - All across the world, Perpetulium™ would be standing in households
>   - The dependence and need for the power grid is greatly reduced
> - The power grid more or less consists of Perpetulium machines
> - In production and factories, Perpetulium™ machines are used
>   - "Produced by clean energy!"

The investors were very keen throughout all this, and by the time I was at the final slide with the call to action "Do you want to be a part to change the world?", the crowd cheered with a standing ovation.

Or something along those lines. Our way of handing in the pitch was as a pre-recorded video of the presentation with voice narration, and I edited it together with Kdenlive. At this point I was already daily driving Linux at home so that was the video editor I had been using for a while.

{% include image.html
	name="kdenlive_timeline.webp"
	alt="The timeline for a Kdenlive project showing a video clip with several cuts that have been made in it." %}

## Google sabotages the discovery of infinite energy
On the 14th of December 2020 [Google had a large-scale outage](https://en.wikipedia.org/wiki/Google_services_outages#December_2020_services_outage) affecting more or less all Google services that required authentication. As our school used the Google Suite for Education for basically everything, it crippled all of our infrastructure for the period that Google services were nonfunctional and later had degraded performance during the subsequent hours.

It was also the day we were gonna hand in all our assignments for the perpetual motion machine!

Thankfully we were allowed a deadline extension by a couple of days for compensation, and I handed in everything in time. Large-scale prolonged outages across several services of a major tech company are very rare and far between, but when they do happen it's hard to not notice. Some other outages in recent memory that I remember being very eventful when they happened was the 2021 Facebook outage where all of Facebook's services were completely down for a period of [six to seven hours](/67/), or the 2025 Cloudflare outage where all websites proxied behind Cloudflare were down, causing cascading failures across the Internet.

Typically people remember these moments as major occasions, due to how they may disrupt what they were doing at the time. It gives some time to reflect when potential responsibilities associated with the service in question disappear briefly. What were _you_ doing when Google went down that day in December 2020?

I was researching infinite energy while it happened.
