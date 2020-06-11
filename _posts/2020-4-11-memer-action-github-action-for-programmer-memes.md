---
layout: post
comments: true
title: Memer Action - GitHub Action for Programmer Memes
description: A GitHub Action for Programmer Memes, greet contributors with some programmer humor ;)
tags: [github, python, developers, memes]
image: blog13.png
---

TLDR;
> I created a small github action to greet contributors with random programmer memes


[![Bhupesh-V/memer-action - GitHub](https://gh-card.dev/repos/Bhupesh-V/memer-action.svg)](https://github.com/Bhupesh-V/memer-action)

> **[View on GitHub Marketplace](https://github.com/marketplace/actions/memer-action)**

## Why ?
You can say thanks to contributors by greeting them with some programmer humour & btw almost everyone likes memes so having some fun while contributing to OpenSource would be great :)

## Demo
Here is a sample of memer-action in action

<div align="center">
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Here is a short(slow) demo <a href="https://t.co/58u95HQQDs">pic.twitter.com/58u95HQQDs</a></p>&mdash; Bhupesh 👾 (@bhupeshimself) <a href="https://twitter.com/bhupeshimself/status/1248954061442826242?ref_src=twsrc%5Etfw">April 11, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

## How 
The action was built using python, here is how the magic happens
```python
import feedparser
import random
import os
import sys

HOST_URL = "https://www.reddit.com/r/ProgrammerHumor"


def getMeme(filter_posts="hot"):
    memelist = []
    memedict = {}
    f = feedparser.parse(f"{HOST_URL}/{filter_posts}.rss")
    for entry in f.entries:
        x = entry['content'][0]['value']
        img = x[x.find("https://i.redd.it"): x.find("link") - 3]
        if img != "":
            memedict["title"] = entry["title"]
            memedict["src"] = str(entry["link"])
            memedict["meme"] = img
            memelist.append(memedict)
        random.shuffle(memelist)
        return memelist[0]


def main():
    filter_by = os.environ["INPUT_FILTER"]
    if filter_by not in ["hot", "top", "new", "rising"]:
        sys.exit(0)
    meme = getMeme(filter_by)
    print(f"::set-output name=meme::{meme['meme']}")
    print(f"::set-output name=title::{meme['title']}")
    print(f"::set-output name=source::{meme['src']}")


if __name__ == "__main__":
    main()

```
The above script runs inside a docker container. Below are some of the resources that (I used) you can use to build you own actions using Python

- [Creating GitHub Actions in Python](https://www.jacobtomlinson.co.uk/posts/2019/creating-github-actions-in-python/)
- [Creating a Docker container action](https://help.github.com/en/actions/building-actions/creating-a-docker-container-action)

<figure>
<img src="https://media.giphy.com/media/mCRJDo24UvJMA/giphy.gif">
<figcaption style="color: #c7b9b9; text-align: center;"> have fun !! </figcaption>
</figure>

