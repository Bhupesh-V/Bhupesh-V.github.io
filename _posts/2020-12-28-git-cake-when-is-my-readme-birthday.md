---
layout: post
comments: true
title: "git cake: when is my README's birthday?"
description: Use git log command to find when was a file was added or created in your git repository
tags: git shell 
image: git-cake-day-demo.png
---

Do you want to know when was a file/directory committed in your git history?
Well here is `git log` at your rescue

```bash
git log --date=format:'%d %b %Y' --diff-filter=A --name-only --pretty='%n%C(yellow bold)🎂️ %ad%Creset by (%C(blue bold)%h%Creset)'

```

![git-cake-demo-paager](https://user-images.githubusercontent.com/34342551/103223519-6b366080-494c-11eb-9d54-acebd0179ffb.png)


Ok ok! Let me explain for you lazy asses

- `--date=format:'%d %b %Y'`

  This is pretty much self explanatory, suit this to your own preferred date format.

- `--diff-filter=A --name-only`

  This lets you filter nodes that were Added(A). Other filters include: Copied(C), Deleted(D), Modified(M) or Renamed(R).
  Multiple filters can be used together e.g `--diff-filter=AC`.

  The `--name-only` shows only names of changed files. If you had like to print some status as well use `--name-status`

- `--pretty='%n%C(yellow bold)🎂️ %ad%Creset by (%C(blue bold)%h%Creset)`

  This is the beauty that is responsible for the line `🎂️ 18 Jun 2019 by (f72312c)`.

  Git provides us with various format specifiers these include.
  - %n  : newline
  - %h  : abbreviated commit hash (short version, use %H for complete hash)
  - %ad : author date that respects the previously specified --date= option

[**Read git pretty docs**](https://git-scm.com/docs/git-log#_pretty_formats) for info. on all 50+ options

> When you feel you are absolutely free do a `git log --help` & read that manual.


You should add this in your `.gitconfig`.

```
[user]
	email = varshneybhupesh@gmail.com
	name = Bhupesh-V
[commit]
	template = /home/bhupesh/.gitmessage
[core]
	editor = nano
[credential]
	helper = store
[alias]
        cake = log --date=format:'%d %b %Y' --diff-filter=A --name-only --pretty='%n%C(yellow bold)🎂️ %ad%Creset by (%C(blue bold)%h%Creset)'
``` 


Now send me some presents, will ya?
Please?
