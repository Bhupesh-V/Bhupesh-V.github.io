---
layout: post
comments: true
title: defe - All your Tech Updates at one place
description: defe is a Tech Feed Aggregator for developers & Tech Enthusiasts
tags: [devfeed, tech, python, javascript]
image: blog12.png
---


TLDR;
> I created defe (devfeed), a WebApp & CLI for aggregating popular "Tech" feeds for developers & Tech Enthusiasts


![blog12](https://raw.githubusercontent.com/Bhupesh-V/Bhupesh-V.github.io/master/images/blog12.png)


## Why did I built this ¯\_(ツ)_/¯

Well I like reading tech, this involves subscribing to newsletters & listening to various podcasts.
But the only problem with this is that all of this is distributed causing me to waste my time by installing various apps (which I open only once per day) & subscribing to a number of newsletters.


<figure>
<img height="600px" width="300px" src="https://drive.google.com/uc?export=view&id=1x_ZKI5I0BCAebabsuRjXRyYWUkRGkJe0">
<figcaption>
How Am I suppose to read these quickly :sweat_smile:
</figcaption>
</figure>


Well of course you have *feedly* but hey its not free right ?
That's why I thought of creating a FOSS alternative which is
- Simple Enough to use (Minimal UI)
- Is available for multiple clients (PWA & CLI for terminal lovers)
- Can show me information while I'm travelling

## Features ✨
- PWA
![PWA Stats](https://drive.google.com/uc?export=view&id=1edOOY73phTkFDFOK3LnutQGk2K5y7TGy)
- Read & Share Stories
- Dark Mode *
<img height="300px" width="300px" src="https://drive.google.com/uc?export=view&id=1FThDzTgy0SkQsSvjZ0DRVSBw05dpqiWN">
- Minimal UI
- CLI
<img height="300px" src="https://drive.google.com/uc?export=view&id=1bu9MOuUXUIjr7KpDIjwp6hgpPcH64jJ7">
- Filter Feed
<img height="200px" width="200px" src="https://drive.google.com/uc?export=view&id=1rtymay0PaQX6D8wNJ6xekzzgSkmTbRYm">


<br>
Is that it ?
No
**defe is a package**, so you can make Bots 🤖 using it.

```python
from defe import defe
import pprint

f = defe.feed()

pprint.pprint(f.news())

```
This will print all the News from available News Feeders. You can read the [documentation](https://defe.readthedocs.io/en/latest/) on how to use the package.

## How its built 🤔

The architecture is fairly simple

<figure>
<img height="500px" src="https://drive.google.com/uc?export=view&id=1C9etr79l2jjMdM5fP997SpHk3RH2mmT2">
<figcaption>
An Overview of how defe works
</figcaption>
</figure>

Multiple feeders are fetched at the same time using [`ThreadPoolExecutor()`](https://docs.python.org/3/library/concurrent.futures.html#threadpoolexecutor) & are kept in a cache.

> Feeders are web-sources which have a public feed (RSS/Atom) link
You can have a look at all the feeders [here](https://github.com/Bhupesh-V/defe/tree/master/core/feeders).

Let's say you request `/news` or run `defe news` (on CLI) all the available feeders under _News_ category would be fetched simultaneously and are pushed in a [_disk based cache_](https://en.wikipedia.org/wiki/Cache_(computing)#Disk_cache), subsequent requests will come from this cache.
For now the cache expiry time-limit is set to 1 hr by default (future releases might have a option to clear cache manually)

I used the following stack to build defe
- Python
- JavaScript

Few pre-built libraries/components which helped me build defe
- [MaterialzeCSS](https://materializecss.com/)
For the front-end of WebApp
- [feedparser](https://github.com/kurtmckee/feedparser)
For parsing RSS/Atom feeds of web sources.
- [diskcache](http://www.grantjenks.com/docs/diskcache/)
Used for temporarily storing feeds for faster access.


## How it looks :fire:

Here is a demo for the defe CLI

<img src="https://drive.google.com/uc?export=view&id=1RRMZ_99TGkn3sgv4X3S3rfGcuFLs7QDh">

And the WebApp Looks like

<img src="https://drive.google.com/uc?export=view&id=1fk7dloBeopGYT0VhAgMqoKjoHIx3A28E">


## Contribute 🤗

<img height="400px" src="https://drive.google.com/uc?export=view&id=1cVAkT8fFnC-uWILY4PGypeEG2VxYIwsp">

[![Bhupesh-V/defe - GitHub](https://gh-card.dev/repos/Bhupesh-V/defe.svg?fullname=)](https://github.com/Bhupesh-V/defe)

I still have a lot of ideas to improve defe, but not all of it I can do alone, I require your help :heart:
Feel free to contribute at

You can also request feeders by commenting your favourite sites below
or add them [yourself](https://github.com/Bhupesh-V/defe/issues/1)


## Future Visions 👐
Some of the things I wish to implement in future

- Push Notifications
- Bookmark Stories
- Play Podcasts right in terminal (for defe CLI)
- Custom Feeds

You can have a look at [projects](https://github.com/Bhupesh-V/defe/projects) board for more upcoming features in defe.

## Feedback 💭

Did you like **defe** ? or maybe its something you want to say, comment below
You can reach me directly at
[Telegram](https://t.me/bhupeshimself) | [Twitter](https://twitter.com/intent/tweet?screen_name=bhupeshimself&ref_src=twsrc%5Etfw) | [E-mail](mailto:varshneybhupesh@gmail.com)