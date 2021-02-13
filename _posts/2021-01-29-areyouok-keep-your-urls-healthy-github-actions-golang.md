---
layout: post
comments: true
title: Keep your URLs healthy using Github Actions and Go
description: URL Health checker. Check and audit link/URL health using github actions. Test dead links in a fast and efficient manner
tags: go github 
image: areyouok-demo-html.png
---

Dead links, huh!. Too many dead links? How do I test a bunch of URLs?
Don't worry I got you, I recently release [**areyouok**](https://github.com/Bhupesh-V/areyouok) a nice, portable and easy to use URL Auditor.
Its built using Go and leverages go routines (literally the best form of concurrency).

One handy thing with AreYouOk is that its a standalone binary, so you don't need any package managers like `npm` or `pip` to install it.


- Linux (amd64)
  ```bash
  curl -LJO https://github.com/Bhupesh-V/areyouok/releases/latest/download/areyouok-linux-amd64
  ```

- MacOS (amd64)
  ```bash
  curl -LJO https://github.com/Bhupesh-V/areyouok/releases/latest/download/areyouok-darwin-amd64
  ```

- Windows
  ```bash
  curl -LJO https://github.com/Bhupesh-V/areyouok/releases/latest/download/areyouok-windows-amd64.exe
  ```

Or you can just directly download them from [releases](https://github.com/Bhupesh-V/areyouok/releases)

Once that's done, check if you have the latest version installed

```bash
$ ./areyouok-linux-amd64 --version
AreYouOk v1.1.0 built on (26 Jan 2021)

```

Using it is pretty straight-forward, AreYouOk accepts 3 optional arguments followed by a directory path

1. `-t` type of files to scan for links<br>
   The default value has been set to Markdown since a lot of OSS documentation & personal blogs are written in markdown these days. You can also scan HTML, or literally any valid text file!!

2. `-i` list of files or directories to ignore for links (`node_modules`, `.git`)<br>
  This is handy if you are sure that certain files or directories won't contain any URLs, plus this makes areyouok work quickly too!

3. `-r` type of report to generate (available formats include _json_, _html_, _txt_ & _github_)<br>
  The most superior format is HTML which gives a visual perspective on all the URLs scanned (you can see this in the blog header as well)<br>
  ![aro-html-demo](https://user-images.githubusercontent.com/34342551/105046278-e80db380-5a8e-11eb-8371-124fae8b3d7f.png)


OK! Enough talking, lets see it in action on my [til](https://github.com/bhupesh-v/til) repository

```bash
$ areyouok-linux-amd64 -i=_layouts,.git,_site,README.md,build.py,USAGE.md -r=txt ~/Documents/til/

```

We are ignoring folders: `_layouts`, `.git`, `_site` & files `README.md`, `USAGE.md` & `build.py` using the `i` flag.

The `r` flag is used to specify the type of report to generate.

Here is a demo

![aro-1 1 0-demo](https://user-images.githubusercontent.com/34342551/106291191-57468d00-6271-11eb-9480-b53fe433f581.gif)


This is good but a more precise to use AreYouOk is by adding it in your CI/CD workflow.

Create a Github Action workflow in your repository with following contents

```yml
name: Audit Links using AreYouOk
on:
  workflow_dispatch:
  schedule:
    # At 06:00 AM, every 30 days
    - cron:  '0 6 */30 * *'
      
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Download & Run AreYouOk
        run: |
          wget -q https://github.com/Bhupesh-V/areyouok/releases/latest/download/areyouok-linux-amd64
          chmod +x areyouok-linux-amd64
          ./areyouok-linux-amd64 -i=_layouts,.git,_site,README.md,build.py,USAGE.md -r=github
      - name: Create Issue
        uses: peter-evans/create-issue-from-file@v2
        with:
          title: AreYouOk URL Health Report
          content-filepath: ./report.github
      - name: Cleanup
        run: rm report.github
```

Our workflow will execute every 30 days then downloads a fresh copy of areyouok using curl & executes it inside the repo. Note the report format is `github` here. Its largely HTML but is compatible with GitHub's commonmark markdown renderer.

> Make sure you set the executable permissions on areyouok once downloaded

Our action uses the [peter-evans/create-issue-from-file](https://github.com/peter-evans/create-issue-from-file) action which is used to report back the results to user via github issues.
This is how it looks like

![demo-action](https://user-images.githubusercontent.com/34342551/105579706-169cce80-5dae-11eb-8dd6-b51bf23e63ee.png)

You can see the generated [issue here](https://github.com/Bhupesh-V/til/issues/4). Also the [Action Summary](https://github.com/Bhupesh-V/til/runs/1792142963?check_suite_focus=true)

And there you have it, no more dead 💀️ links!

