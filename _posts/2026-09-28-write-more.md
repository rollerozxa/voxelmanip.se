---
title: Write More
tags: Meta Personal
cover_alt: Standing on a big rock overlooking the sea, seeing more rocky formations in the distance.
---

During the past year or so, I have not been writing for my blog as much as I was doing previously. I find this unfortunate, not because I haven't been productive and doing other stuff in the meantime, but I feel that I enjoy writing and should write more blog posts. But sometimes it is hard to actually find the motivation and "spark" that makes the writing just flow out.

As such, I wrote a blog post about not writing blog posts.

<!--more-->

## My Blog
In August of 2024, I picked back up writing posts for my blog. I had accumulated a list of ideas for blog posts and gradually began to write and flesh out drafts for them, typically having several drafts in progress at once. For a while I was on quite a roll, and in 2024-2025 I published a significant amount of blog posts with ranging topics, resulting in a lot of words in total.

- 2024: **20** posts, **20 644** words
- 2025: **16** posts, **26 115** words

This graph also shows all the previous blog posts put in a time scale, where the bar height is how many words the post has. [Washing your Blåhaj](/2023/09/29/washing-your-blaahaj/) in September of 2023 was the last post from the "first season", and then there was a big gap until August of next year when I began blogging again.

{% include image.html
	name="blog_post_timescale_graph.webp"
	max_width=1000 %}

Then around June of 2025, the output began to slow down again and I have only been publishing a couple of blog posts since then.

When looking at the three last blog posts, as well as sifting through my published blog posts, I get a feeling that the scope of blog posts have gradually increased. There is no clear trend where posts have gone from being short to long, but the three last blog posts are among the longest I have published, and I feel that.

I researched and wrote the blog post about [Claude's C Compiler](/2026/02/06/trying-out-claudes-c-compiler/) in an extreme crunch session over the course of a single day, publishing it late into the night. The subsequent day I then woke up with serious pain in my right shoulder blade the next day. I still find it to be a good piece of writing and do not regret what it took to get it out, and my quick publishing led it to gain a lot of traction while the topic was still current, which was quite satisfying.

Most notably, it gave a critical human look and reflection of the compiler, which I felt was lacking at the time I began writing it - the blogs that I saw covering it at that point were either people bullish on AI, or regurgitating the Anthropic press release's talking points using AI writing.

However, I really need to make blogging more relaxed, and also try to lessen the scope of posts. If a post grows too long I should split it up into multiple parts that each are more manageable.

## University
During my university studies over the years, I have kept up a very high writing throughput week-after-week when writing reports and other texts for course assignments. While there has been a certain pressure to perform when doing this, sometimes it has been even more relaxed knowing that my writing will likely just be skimmed through by a single examiner following a checklist. If I pass, I will never have to think about how I wrote it, and it disappears into my folder of course archives.

Most of the writing isn't really anything that would be of interest to external people, detailing internal assignment frameworks, boilerplate, programs or things too trivial to be of general interest. And a great deal of fluff:

> The goal of adding missing logic to the source file based on provided pseudocode was successful, in that the implementation's results correspond with the expected output. In order to write the code an understanding of data types and casting between them, mathematical and comparison operators, and conditional logic was utilised, which covers the programming fundamentals in the purpose of the laboration.

The entire code for that assignment in question can be compressed into:

```python
OUTPUT = True if str((-5 + int('8') + int(7.6))) in "bla 10" else False
print(OUTPUT) # should be True
```

In retrospective, being able to write a 700 word report on this might have been a better exercise than I thought. However there are some pieces of writing during university that I think turned out quite well and could actually stand on their own.

Specifically in the Software Security course, we did laborations based on those by the SEED project, which I found to be quite enjoyable. I believe the reports I wrote for them ended up being quite good when combined with my general previous knowledge going into the course, so I recently went ahead and published the reports [here on my website](/software-security/).

There's always a bit of a concern I have with publishing university coursework about whether it will allow others to cheat if subsequent runs of the course are very similar. But at this point, I'm not sure whether classic plagiarism has straight up become obsolete due to something even more alluring.

For the past three years that I have studied at university, I have noticed a steady increase in the use of AI among coursemates during peer review or group projects. There are undoubtedly ways that people would argue AI usage is study is acceptable from a academic integrity standpoint (make my text more formal, fix all grammars and typos fixes pls), but generating large swathes of clearly AI generated text and handing it in should never be acceptable. Even though the uncanny effect of AI writing can be very strong sometimes, punishing students for illegitimate AI use needs more definite proof like hallucinated sources. I do get that.

I also can't help but feel like that generative AI has caused a deep rot inside educational institutions. While I went through most of my K-12 schooling without the influence of modern AI (news of the GPT-3 autocompletor had already spread by 12th grade & later in the year ChatGPT released), I can only imagine how bad it is in lower grades by now.

In spring of 2026 I was intended to write my bachelor's thesis. The ready made topics we were given were essentially all LLMs, supposedly the only thing novel enough now. Generate security patches with Claude against known patched software vulnerabilities and compare against the original human patch. Sure, I guess that has academic value. (How in the world do you isolate this LLM with unknown training data from the original human patches? I digress, stuff it in the discussion section where nobody will see it.)

No bachelor's thesis is going to be truly groundbreaking but it is the first (and usually only, unless you remain in academia) academic paper you will publish under your name. So it has to count for something at least. I didn't manage to get a topic approved before the given deadline to begin writing the thesis (I had unfinished parts of other courses I had to get through), so as such I have to wait until next spring to write my thesis. It will probably be babysitting an LLM in some way, but I will try to make it worthwhile. That's the least I can do.

This transitions great into the next section.

## AI
When I first published this website and the blog back in October of 2021, the Internet was a much different place. There were some rumours of GPT-3's capabilities, but access was limited and ChatGPT was a long way's off back then. If you found a piece of writing on the Internet you could be sure that, regardless of its quality and effort, a human was the one writing it in some capacity, regardless of the quality of it. Maybe it was run through machine translation, or you struck some GPT-2 generated text which was typically always nonsensical.

This is not really the case anymore. Unless you have entirely given up, you will always scrutinise every piece of writing you read on the Internet for signs of AI writing or just a general feel that something is off.

Of course, there are different levels to it. Sometimes you can tell whether the AI was used to "touch-up" a human text, if it was given a well-researched outline or bulletpoint, or if it was entirely generated from a prompt. But then it sooner or later hits you with pure filler.

> **Why this matters**
> - Actually; it does not, but let us consult the AI to make up some.
> - Human writing keeps the human factor &mdash; for humans in the future.
> - No human writing? No human vibes.
> - Human writing generate real meaning, not robotic prose.
> - Because "raw, messy and chaotic" is an advantage now.
> - And honestly, it takes courage to divulge your raw ideas.

I actually wrote the above blockquote myself but the point still stands. I'm sure you've seen it. Even if it does not start out sounding AI, by the end you may be left with a sour taste in your mouth.

This distaste for AI writing does not even seem to be very controversial, even among developers who are otherwise very bullish on agentic AI workloads for coding. I've seen enough similar blog posts posted onto Hacker News with similar sentiment that repeating this all here feels a bit redundant. But in general - people like reading words written from people more than anything else. However, those who do write using AI can generate large amounts of text, and the equation that writing was the cause of a human spending some amount of time on the text has completely gone out of the window, meaning that search engines and any sites with user generated content are now filled with it.

I hear a lot of talk about how Google search is "dead" because of this. In some ways it is, and I don't deny that Google is also doing things that are counter-productive to the user experience. But from Search Console statistics, my unique human writing still holds up month after month. For those who end up on it, it's probably a diamond in the rough compared to surrounding low-quality results, but from my perspective it still seems to work in _some_ way. Even though it could likely be much better.

I use spellcheck and proofread my blog posts repeatedly. Anything that gets through that is just part of the charm of human writing. Using AI to generate blog posts from bullet points, for what? To lose the distinguishing factor? I will not do that.

That remains my promise.

## But why write?
There are many reasons one may write blog posts. Ego and enjoying your own voice can certainly be part of it, but there is also something very satisfying about sharing thoughts, experiences and knowledge with the world. I used to want to make YouTube content, first let's play videos, later video essay-type content. I never managed to make that happen due to a number of factors, but just publishing text to the Internet cuts out a lot of the excess work for voice narration and video editing.

Publish enough informative blog posts and it is likely one of them will end up getting some amount of traction in search engines. Your post will (hopefully!) become a diamond in the rough for whoever is searching for something. [Washing your Blåhaj](/2023/09/29/washing-your-blaahaj/) still remains the most popular blog post, but [Installing Let's Encrypt certificates on old versions of Android](/2024/09/17/installing-lets-encrypt-certificates-on-old-android/) has gotten quite a lot of traffic too.

{% include image.html
	name="search_console_stats.webp"
	alt="Google Search Console statistics for voxelmanip.se the past 6 months"
	caption="~12k clicks from Google Search to somewhere on voxelmanip.se the past 6 months." %}

Or they will get pointed to it by an AI chatbot which is a thing now too I guess. (lots of occurrences of `?utm_source=chatgpt.com` in my access logs...)

But there is also something more existential that keeps me going and writing for the blog.

When I sit late into the night at the computer feeling a sense of emptiness as years of bad decisions has led to becoming increasingly socially isolated. I work on so much stuff but I don't really have anyone close to share it with.

Then I remember I still have a blog. This is the platform I have, it's been in front of me the whole time. I just have to use it...

I currently have several drafts in progress, and am also revisiting a lot of early drafts and other post ideas that have been in the backlog. Hopefully I can get back into doing this again after publishing this post.
