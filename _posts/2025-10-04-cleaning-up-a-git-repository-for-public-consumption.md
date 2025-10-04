---
title: Cleaning up a Git repository for public consumption
tags: Git Guides
cover_alt: Screenshot of the most recent Git commit history in flower-web, as seen in gitui.
---

When you're considering making a previously private Git repository public, with all the history potentially spanning back years, it's rarely an easy decision. The repository and its history may contain all sorts of things you don't want to inadvertently publish, whether it be sensitive information or even just embarrassing things you never expected to end up being public when developing it in private.

The simplest way would be to just clean up the final state of the repository. Then create an empty repository importing everything into a new initial commit, throwing away the old commit history. But this also throws away a lot of context and history of the project. If someone else interested in your newly opened repository ever wanted to look back at how something was done or why a certain decision was made, it would be much harder without the commit history.

<!--more-->

This blog post will go through some of the methods I used for cleaning up a Git repository when I recently made [an old project of mine public](https://github.com/rollerozxa/flower-web) including the commit history, which required some cleanups to get it up in a state I deemed okay to put out there.

## Introducing our power tool, git filter-repo
When a lot of people talk about commit history in a Git repository, they say that it is immutable. A lot of people also say that you should never rewrite history. While this is generally good advice for repositories that are already public and have local clones and mirrors floating around, in this case we have the freedom of being the sole source of truth for the repository, and we can rewrite history as we see fit before making it public.

Git filter-repo (subsequently just called filter-repo) is a third-party Python-based tool that runs on top of Git, and you install it like how you usually obtain your Python packages, whether it be from `pip` or your system's package manager. For me on Arch it is packaged as `git-filter-repo`. It is a very powerful tool that can perform a lot of bulk operations on a Git repository, and is what will be used for most of the blog post.

One thing that is likely useful to note is the usage of `--force` in most usage examples in the blog post. By default filter-repo will refuse to perform any if it believes the repository is not a fresh clone. This can be triggered by something as simple as putting a file with replacement patterns in the repository. The `--force` argument simply bypasses these checks.

It is assumed that you are doing this on a copy of the repository, and that you have a clean backup of the repository somewhere else in case something goes wrong. We are going deep into the depths of destructive editing of Git repositories after all.

## Replacing commit authorship
You might be familiar with [mailmap](https://git-scm.com/docs/gitmailmap) files in the context of Git. They are usually placed as `.mailmap` in the root of a Git repository and can be used to alias commit authorship to a canonical author, with the first one being the canonical while all subsequent authors on the same line will alias to the canonical author:

```bash
ROllerozxa <rollerozxa@voxelmanip.se> ROllerozxa <rollerozxa@principia-web.se> Micke <micke@voxelmanip.se>
```

But of course, just putting this file in the root is not gonna change anything in the history. To some, this is seen as _good enough_, and for public repositories where local clones, forks, mirrors, etc. are widely circulated, this would be about as good as you're gonna get with how Git commit authorship is permanently etched into the history.

I have the privilege of my real name being effectively immutable, so the commonly mentioned issue of deadnames being stuck in commit history does not directly affect me, but putting it everywhere on the Internet is something I strive to avoid nowadays. Back then I didn't seem as worried, though the repository was never public anyway.

You might have other reasons to rewrite commit authorship in the history, e.g. if you want to anonymise the commits of other colleagues or contributors who have worked on the project while it was private. While you may still be crediting them somewhere, you may not want to put them on blast if you haven't gotten back in touch with them and gotten the OK from them.

Thankfully filter-repo is able to very conveniently rewrite all of this for us. Simply write a mailmap file with how you think the authorship should look like, then pass it with the `--mailmap` argument:

```bash
git filter-repo --force --mailmap .mailmap
```

This will go through every commit in your repository and update the author/committer fields according to your mailmap file, producing a commit history with cleaned up authorship information. If you want to check the result, `git shortlog -sne` will give you a nice overview of what commit authors now exist in the repository.

## Find-and-replace in commit messages
Just like you might want to replace authorship information, you may also want to bulk edit the messages of commits following some kind of text replacement pattern. Perhaps there are some sensitive details that shows up in commit messages that you want to simply redact.

filter-repo makes this easy with the `--replace-message` option, which then takes an argument for a replacement file with a set of replacements on each line, with the substring and replacement string separated by two equals signs (`==`). For example:

```
secretremote.example==[REDACTED]
```

Then you can simply run the following command, specifying the replacements file:

```bash
git filter-repo --force --replace-message replacements.txt
```

This will go through every commit message in your repository history and perform the replacements.

## Find-and-replace in text content
In addition to doing replacements on commit messages, you may also want to perform replacements for text content in the repository that spans through the entire commit history.

If it's a private repository, you might have checked in config files with secrets, passwords, database credentials and other secret strings. It might not be best practice to do that, but hey, it must have been convenient at the time. And that was probably why I did that.

Luckily, git filter-repo has a `--replace-text` option which works very similarly to doing replacements in commit messages. You provide a file in the same format which contains lines describing what to replace in your codebase across all revisions, for example:

```
password123==<REMOVED>
internalserver.local==example.com
```

Then run the following command specifying the name of the text file:

```bash
git filter-repo --force --replace-text replacements.txt
```

This way, the secrets or internal references vanish from every commit, not just the current tip of the branch. If you ever accidentally published a secret in your repository that spans deep into the commit history, this is the safest way to purge it completely before making things public.

## Grepping through history
Now you might have gotten all the commit authorship and commit messages sorted, and you've done a sweep of the contents of the latest state of the repository. But what if there is something lurking within the depths of the commit history? Let's dig through it.

If you've just cloned the repository from a remote, or otherwise run any commands to optimise and compress the Git repository, all of the objects stored within `.git` will likely be inside of one or several `.pack` files. While they are not traditional archive files you can simply open with an archiver, Git has a built-in command to unpack them (`git unpack-objects`) however it can be a bit unwieldy to use.

First of all you'll need to move out or rename the pack folder found at `.git/objects/pack/`, otherwise Git will not unpack any objects because all the objects are already in the repository (so silly):

```bash
mv .git/objects/pack/ .git/objects/pack_/
```

Then from the root of the repository, run `git unpack-objects` and pipe the name of the .pack file in via `stdin`:

```bash
git unpack-objects < .git/objects/pack_/pack-<hash>.pack
```

If you go into `.git/objects/` you will now see a large amount of files categorised by their leading two characters. This is good! These object files are in turn just zlib compressed, and you could use the following Bash snippet to grep over them (using `zlib-flate` from qpdf):

```bash
for obj in .git/objects/[0-9a-f][0-9a-f]/*; do
	zlib-flate -uncompress < "$obj" 2>/dev/null | grep -aH '<string to grep after>' && echo "Found in: $obj"
done
```

You will then get a list of object files (also known as blob IDs) where that string exists in. You can then use `git show <blob ID>` to see the file contents and get an idea of where it is.

## Deleting entire files from history
If performing surgical replacements of text in the history isn't enough, you may want to just delete entire files. Maybe you accidentally committed in a whole zip archive with some proprietary SDK you can't distribute, whatever it is. (In that case you might find `--strip-blobs-bigger-than` useful, if the file you want to delete is much bigger than anything else. But otherwise read on.)

For each time a file is changed, it is tracked as a new blob in the repository with its own ID. So if you have a file you need to delete that has five changes in the commit history, you will need to delete the five blob IDs that correspond with each revision of the file.

If you run the previously mentioned Bash snippet for searching through blobs for a certain string you might already have a set of blob IDs (they look basically like commit hashes). You can also run `git ls-tree` on specific commits to get the blob ID of a given file.

You can use `git show <blob ID>` to check the file the ID corresponds to, just to verify. Once you have gotten a set of blob IDs to remove, put it into a text file (let's call it `blob-ids.txt`) with a blob ID on each line, then run:

```bash
git filter-repo --force --strip-blobs-with-ids blob-ids.txt
```

## Nice things
If you are reading this blog post you're likely doing an open source release for something that has previously been private or closed source. And for that reason I'll just quickly go over some general advice I would find useful for doing so.

Don't be afraid of just completely bulldozing the original README. It will be present in the commit history anyway, so you might as well make the front page of your repository polished and welcoming for new visitors. A clean README with interesting background about the project in addition to the typical setup instructions and license is usually appreciated.

Providing a set of screenshots for the project is also very useful. Depending on what the project you are releasing is, it may be difficult for others to get it set up or compiled. You have likely gotten it running right now, but you may not be able to set it up without modifications in the future either as technology progresses. Bitrot comes for everything eventually, but screenshots can preserve some amount of photographic memory and make it easily accessible.
