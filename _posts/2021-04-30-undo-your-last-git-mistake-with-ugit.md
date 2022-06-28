---
layout: post
comments: true
title: Undo your last git mistake with ugit
description: Learn how to use ugit or git undo to undo git commands like git commit, git push, git merge among many more. ugit helps you fix your last git fuck-up without any hassle
tags: linux git
last_modified_at: 2020-06-28
banner_image: https://ik.imagekit.io/bhupesh/banners/Untitled__4___FERl1OiR.png
---


So I have been working on this little tool called [**ugit**](https://github.com/Bhupesh-V/ugit) (and was finally able to release a stable version), the goal is to make it easier for beginner to intermediate git users to undo their last (accidental) git command.
Because we are not perfect and commit mistakes.

"Oh wait I deleted the _auth-jwt_ branch without merging!! fuck" <br>
_Opens browser_<br>
"How to restore deleted branch"<br>
_Wastes 5 minutes reading the thread,_<br>
_Brain context switch, losses focus_<br>
"Aarrgh, Git sucks"

Failure is a good way to learn something new but how many times are you going to mess up with git, if your ultimate goal is to deliver the new feature in your startup as fast as possible, huh?
Git is great but it's not really good with developer experience (DX).

Yo bhupesh, I can just you know _alias_ this command. Oh cool, good luck remembering that alias after 1 month when you fuck-up again.

If you are in the gang of getting things done, adding **ugit** might be a good choice for you.

Ok enough talking.

## What is `ugit`?

It's just a simple shell script with guided programmatic steps to undo your last git command, powered by [FZF]() built for people who live and work with terminals every day.


## Guided Tutorials

Below are some GIF demos of undoing some git operations, the list is long (around 17 scenarios) but I am only demonstrating some common ones.

> Head over to [installation instructions](https://github.com/Bhupesh-V/ugit#installation) for ugit

### Undoing `git add`

<video width="100%" controls>
  <source src="https://user-images.githubusercontent.com/34342551/121651365-29dbdc80-cab8-11eb-8c43-6d0c4b1509ad.mp4" type="video/mp4">
</video>

### Undoing `git branch -D` (Restore deleted branch)

<video width="100%" controls>
  <source src="https://user-images.githubusercontent.com/34342551/121650985-c487eb80-cab7-11eb-9b6a-9257fa704d1c.mp4" type="video/mp4">
</video>

## Undoing/Restoring file to previous version

<video width="100%" controls>
  <source src="https://drive.google.com/uc?export=view&id=1BrUdWc9EbPtuUHZfNIyfLT0NSBu802RR" type="video/mp4">
</video>

### Undoing `git merge`

<video width="100%" controls>
  <source src="https://user-images.githubusercontent.com/34342551/121651071-d9fd1580-cab7-11eb-929d-d9359a64f0eb.mp4" type="video/mp4">
</video>


## Story behind `ugit`

Part of credits go to [Anthony](https://twitter.com/anthonypjshaw) & [Trey](https://twitter.com/treyhunner) for the idea, I stumbled upon [their tweet](https://twitter.com/anthonypjshaw/status/1377162020554874886?s=20) while lurking on Twitter.
So thanks!

## I don't like your stupid script

<img alt="sad dogo crying" height="120px" src="https://ik.imagekit.io/bhupesh/blog_content_pics/sed-doggo_e7RD-mM7L.webp">

Cool, I mean we are still friends right??
Friends help friends avoid git mistakes, that's why I wrote an accompanying text guide on [How to undo anything in Git](https://bhupesh.gitbook.io/notes/git/how-to-undo-anything-in-git).

Share it with your friends, co-workers. No hard feelings

Peace ✌️

Update: Woke up to an email, that ugit was [Featured on Changelog News](https://changelog.com/news/ugit-helps-you-undo-your-last-git-command-with-grace-8X6L#discussion), yay 🎉️

Update: I also covered a talk at GitHub India Constellation 2022, regarding the git tooling ecosystem & why we need a `git-undo` right now.

<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/jpR9BMFmh4Y?start=15240" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>
