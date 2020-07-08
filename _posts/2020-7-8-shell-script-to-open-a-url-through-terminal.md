---
layout: post
comments: true
title: Shell script to open a url through terminal
description: Shell script to open a url through terminal
tags: linux shell til
---

If you are a developer then fixing bugs takes time because you have to shift from terminal to your fav browser & then type your query.
(and then in between you open reddit/twitter 😅 for some reason, which wanders your attention).

We can lighten this process a little bit by writing a shell script which will open a URL directly in the browser.

```bash
#!/usr/bin/env bash

# Simple script to search internet

read -p "Search Query : " search_term

# replace spaces " " with "+"
urlencode="${search_term// /+}"

# Replace firefox with either "chromium-browser" or command to open your fav browser
# Search using DuckDuckGo Lite
firefox --new-tab "lite.duckduckgo.com/lite/?q=${urlencode}"

```
You can also view other options to the `firefox` command by invoking help.

```bash
firefox --help
```

> Note : If you are on Debian, the command `gnome-www-browser` will point to the default browser which comes in with your OS, i.e **firefox**. So both the commands can be easily swapped.

Save this somewhere in your scripts folder and add an alias for it.

```bash
alias ddg="/path/to/script.sh"
alias helpme="/path/to/script.sh"
alias search="/path/to/script.sh"
```

Hope you learned something new today.
Take Care 🤗

