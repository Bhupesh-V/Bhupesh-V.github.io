---
layout: post
comments: true
title: How I reduced the size of my very first published docker image by 40% - A lesson in dockerizing shell scripts
description: My learnings from publishing my first ever Dockerfile for ugit (a shell script based tool to undo git command) and writing the most optimized dockerfile for it.
tags: shell linux git
---

I interact with Dockerfiles every day at work, have written a few myself, built containers, and all that. But never published one on the docker hub registry. I wanted to make [**ugit** - a tool to undo git commands](https://github.com/Bhupesh-V/ugit) (written as a shell script) available to folks who don't like installing random shell scripts from the internet.

Yeah, I know, I know. REWRITE IT IN GO/RUST/MAGICLANG. The script is now more than 500+ lines of bash. I am not rewriting it in any other language unless someone holds a gun to my head (or maybe ends up sponsoring??). Moreover, ugit is close to being feature complete (only a few commands left to undo, which are not that commonly used).

Anyway, the rest of the article is about how I went about writing the official Dockerfile for [**ugit (a shell script)**](https://github.com/Bhupesh-V/ugit/blob/master/ugit) and reduced the image size by almost **40%** (_going from 31.4 MB to 17.6 MB_) by performing step-by-step guided optimization attempts. I hope this motivates other shell enthusiasts to also publish their scripts as docker images!

> PS: I am not a DevOps or Docker expert, so if you are and see something wrong or something that could be done better, please let me know in the comments below or reachout [somewhere](https://bhupesh.me/about/#-connect). The final docker image is available on [docker hub](https://hub.docker.com/r/bhupeshimself/ugit)


- [The very first `Dockerfile` ~attempt~](#the-very-first-dockerfile-attempt)
- [Path to optimization - reducing image size by 40%](#path-to-optimization---reducing-image-size-by-40)
- [2nd attempt - `alpine` on `alpine`](#2nd-attempt---alpine-on-alpine)
  - [Looks like `xargs` and `awk` came free?](#looks-like-xargs-and-awk-came-free)
- [3rd attempt - Using `scratch` at 2nd stage](#3rd-attempt---using-scratch-at-2nd-stage)
  - [Identifying transitive dependencies](#identifying-transitive-dependencies)
    - [Primer on shared libraries](#primer-on-shared-libraries)
  - [Shebangs `#!` are useless](#shebangs--are-useless)
  - [A look at `terminfo` db](#a-look-at-terminfo-db)
- [Everything needed to run `ugit`](#everything-needed-to-run-ugit)
- [Could we reduce the size further?](#could-we-reduce-the-size-further)
  - [Reason 1: Pin minimum version of `fzf`?](#reason-1-pin-minimum-version-of-fzf)
  - [Reason 2: Use the latest bash features?](#reason-2-use-the-latest-bash-features)
- [You didn't try `docker-slim`?](#you-didnt-try-docker-slim)
- [You didn't try `docker-squash`?](#you-didnt-try-docker-squash)
- [Learnings](#learnings)
- [Acknowledgements](#acknowledgements)
- [Resources](#resources)

## The very first `Dockerfile` ~attempt~

```Dockerfile
# Use an official Alpine runtime as a parent image
FROM alpine:3.18

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install dependencies
RUN apk add --no-cache \
    bash \
    gawk \
    findutils \
    coreutils \
    git \
    ncurses \
    fzf

# Set permissions and move the script to path
RUN chmod +x ugit && mv ugit /usr/local/bin/

# Run ugit when the container launches
CMD ["ugit"]
```

Looks pretty simple, right? It is. You could copy-paste this Dockerfile and build the image yourself assuming you have ugit cloned in the current directory,

```bash
docker build -t ugit .
docker run --rm -it -v $(pwd):/app ugit
```

This should successfully run ugit inside the container.

<!-- add screenshot -->

`ugit` requires binaries like `bash (>=4.0)`, `awk`, `xargs`, `git`, `fzf`, `tput`, `cut`, `tr`, `nl`.

- We had to install [findutils](https://www.gnu.org/software/findutils/) because it ships with `xargs`.
- We had to install [coreutils](https://wiki.debian.org/coreutils) because it ships with `tr`, `cut` and `nl`.
- `ncurses` is required by `tput` (which is used to get the terminal info).

That's all we need to run ugit on a UNIX-based machine or well, a container. The image size sits at `31.4 MB` at this point. Not bad for a first attempt. Let's see how we can reduce it further.

## Path to optimization - reducing image size by 40%

During our (desperate) micro-optimization attempts in the upcoming sections, we will be covering the following high-level goals:

- Use multi-stage builds to reduce image size.
- Get rid of binaries like `sleep`, `watch`, `du` etc. Anything that is not required by `ugit` to run.
- Get rid of unnecessary dependencies that these binaries bring in.
- Get a minimum version of all dependencies that are required by `ugit` to run.
- Load up only the required binaries and their dependencies in the final image.


## 2nd attempt - `alpine` on `alpine`

I now choose to create a multi-stage build. The 2nd stage will be used to copy only the required binaries and their dependencies. I again choose to use `alpine` as the base image for this stage.

```Dockerfile
# First stage: Install packages
FROM alpine:3.18 as builder

RUN apk add --no-cache \
    bash \
    gawk \
    findutils \
    coreutils \
    git \
    ncurses \
    fzf

# Copy only the ugit script into the container at /app
WORKDIR /app
COPY ugit .

# Set permissions and move the script to path
RUN chmod +x ugit && mv ugit /usr/local/bin/

# Second stage: Copy only necessary binaries and their dependencies
FROM alpine

COPY --from=builder /usr/local/bin/ugit /usr/bin/
COPY --from=builder /usr/bin/git /usr/bin/
COPY --from=builder /usr/bin/fzf /usr/bin/
COPY --from=builder /usr/bin/tput /usr/bin/
COPY --from=builder /usr/bin/cut /usr/bin/
COPY --from=builder /usr/bin/tr /usr/bin/
COPY --from=builder /usr/bin/nl /usr/bin/
COPY --from=builder /usr/bin/gawk /usr/bin/
COPY --from=builder /usr/bin/xargs /usr/bin
COPY --from=builder /usr/bin/env /bin/
COPY --from=builder /bin/bash /bin/

WORKDIR /app
# Run ugit when the container launches
CMD ["ugit"]
```

Just by a straightforward multi-stage build, we were able to reduce the image size to an impressive `20.6` MB. Now the image builds successfully, but it won't run ugit yet.

```
Error loading shared library libreadline.so.8: No such file or directory (needed by /bin/bash)
```

Turns out, we are missing transitive dependencies. More about this on our [3rd attempt](/publishing-my-first-ever-dockerfile-optimization-ugit/#3rd-attempt---using-scratch-at-2nd-stage).


### Looks like `xargs` and `awk` came free?

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3M4ZjRtdnk0ZGp2NWdiejJhbzFmZmF0aWNydnVka3Q4eHkzcjRtaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KEHFEuWHeRVNBwbcaS/giphy.gif)

Turns out, that both `xargs` and `awk` are present by default on the Alpine image. You can verify this by running the following commands:

```bash
docker run -it alpine /bin/sh -c "awk --help"
docker run -it alpine /bin/sh -c "xargs --help"
```

Rookie mistake. Let's scratch `gawk` and `findutils` from our `Dockerfile`.

```Dockerfile
# First stage: Install packages
FROM alpine:3.18 as builder

RUN apk add --no-cache \
    bash \
    coreutils \
    git \
    ncurses \
    fzf

# Copy only the ugit script into the container at /app
WORKDIR /app
COPY ugit .

# Set permissions and move the script to path
RUN chmod +x ugit && mv ugit /usr/local/bin/

# Second stage: Copy only necessary binaries and their dependencies
FROM alpine:3.18

COPY --from=builder /usr/local/bin/ugit /usr/bin/
COPY --from=builder /usr/bin/git /usr/bin/
COPY --from=builder /usr/bin/fzf /usr/bin/
COPY --from=builder /usr/bin/tput /usr/bin/
COPY --from=builder /usr/bin/cut /usr/bin/
COPY --from=builder /usr/bin/tr /usr/bin/
COPY --from=builder /usr/bin/nl /usr/bin/
COPY --from=builder /usr/bin/env /bin/
COPY --from=builder /bin/bash /bin/

WORKDIR /app
# Run ugit when the container launches
CMD ["ugit"]
```

The image size is now down to `20 MB`. We are getting there. ugit still won't run, though.

## 3rd attempt - Using [`scratch`](https://hub.docker.com/_/scratch/) at 2nd stage

This is the part, that most folks don't attempt. It's a bit scary and requires a huge commitment. I was a bit scared to go this route as well because I knew everything could be ~~SCRATCHED~~ 🙃.

A SCRATCH docker image is just an empty file system. It doesn't have anything at all. To try out a SCRATCH image, you can refer to [docker hub's README on it](https://hub.docker.com/_/scratch).

The only thing you need to know is that everything has to be put together by us. Let's keep our hands on our hearts and replace `alpine` with `scratch`.

```Dockerfile
# First stage: Install packages
FROM alpine:3.18 as builder

RUN apk add --no-cache \
    bash \
    coreutils \
    git \
    ncurses \
    fzf

# Copy only the ugit script into the container at /app
COPY ugit .

# Set permissions and move the script to path
RUN chmod +x ugit && mv ugit /usr/local/bin/

# Second stage: Copy only necessary binaries and their dependencies
FROM scratch

COPY --from=builder /usr/local/bin/ugit /usr/bin/
COPY --from=builder /usr/bin/git /usr/bin/
COPY --from=builder /usr/bin/fzf /usr/bin/
COPY --from=builder /usr/bin/tput /usr/bin/
COPY --from=builder /usr/bin/cut /usr/bin/
COPY --from=builder /usr/bin/tr /usr/bin/
COPY --from=builder /usr/bin/nl /usr/bin/
COPY --from=builder /usr/bin/env /bin/
COPY --from=builder /bin/bash /bin/

WORKDIR /app
# Run ugit when the container launches
CMD ["ugit"]
```

Doing this reduced the size of our image to `12.4MB`, a 60% reduction?? Did we just rickroll ourselves? Let's try to run ugit.

```
$ docker run --rm -it -v $(pwd):/app ugit-a3
exec /usr/bin/ugit: no such file or directory

$ docker run --rm -it --entrypoint /bin/bash ugit-a4
exec /bin/bash: no such file or directory

```

![resitas laughing](https://media1.tenor.com/m/3KONHAjX7LAAAAAC/el-risitas-risitaslaughing.gif)

Turns out, we broke the bash binary by not shipping its dependencies. Let's see what we can do about it.

### Identifying transitive dependencies

Okay, time to talk about transitive dependencies. Our script relies on binaries like `git`, `tput`, `bash`; now some of these utils may have their dependencies.

We technically call these dependencies, shared libraries. Shared libraries are `.so` (or in Windows `.dll`, or in OS X `.dylib`) files. [**ldd**](https://man7.org/linux/man-pages/man1/ldd.1.html) is a great tool to identify these dependencies. It lists all the libraries needed by a binary to execute. For example, if we run `ldd /bin/bash` on a fresh Alpine container, we get the following output:

```bash
/ # ldd /bin/ls
	/lib/ld-musl-aarch64.so.1 (0xffff8c9c0000)
	libc.musl-aarch64.so.1 => /lib/ld-musl-aarch64.so.1 (0xffff8c9c0000)
/ # ldd /bin/bash
	/lib/ld-musl-aarch64.so.1 (0xffffb905a000)
	libreadline.so.8 => /usr/lib/libreadline.so.8 (0xffffb8f06000)
	libc.musl-aarch64.so.1 => /lib/ld-musl-aarch64.so.1 (0xffffb905a000)
	libncursesw.so.6 => /usr/lib/libncursesw.so.6 (0xffffb8e95000)
```


#### Primer on shared libraries

- Each lib has a _soname_, which is the name of the library file without the version number. They start with the prefix `lib` and end with `.so`. For example, `libpcre2-8.so.0` has a soname `libpcre2-8.so`.
- A fully qualified lib includes the directory where it is located. For example, `/usr/lib/libpcre2-8.so.0`.
- Each lib has a real name, which is the name of the library file with the version number. For example, `libpcre2-8.so.0.3.6` could be a real name.
- The hexadecimal is the base memory address where this library is loaded in memory. Not useful for us. We are only interested in the library names. Let's do it for all the binaries we need to run ugit.
- The path to the right-hand side of `=>` symbol indicates the real path to that shared library.
- The lib name starting with `libc`is the C library for that architecture. Remember our "exec /bin/bash: no such file or directory" error? This is the reason we got it. We didn't ship the C library for our architecture.


Below is an excerpt from [Douglas Creager's](https://twitter.com/dcreager/) article on [Shared library versions](https://dcreager.net/2017/10/shared-library-versions/) which sums up shared libraries, please read the full article if you want to learn more about shared libraries.
> With a shared library, you compile the library once and install it into a shared location in the filesystem (typically `/usr/lib` on Linux systems). Any project that depends on that shared library can use that shared, already compiled representation as-is.<br>
> Most Linux distributions further reduce compile times by distributing **binary packages** of popular libraries, where the distribution's packaging system has compiled the code for you. By installing the package, you download a (hopefully signed) copy of the compiled library, and place it into the shared location, all without ever having to invoke the compiler (or any other part of the build chain that produced the library).
> 


We use a similar approach to identify all the unique dependencies for all the binaries we need to run ugit.

> ℹ️ We did this by running a command like `for cmd in /bin/*; do echo $cmd; ldd $cmd; done`

```Dockerfile
# copy lib files
COPY --from=ugit-ops /usr/lib/libncursesw.so.6 /usr/lib/
COPY --from=ugit-ops /usr/lib/libncursesw.so.6.4 /usr/lib/
COPY --from=ugit-ops /usr/lib/libpcre* /usr/lib/
COPY --from=ugit-ops /usr/lib/libreadline* /usr/lib/

COPY --from=ugit-ops /lib/libacl.so.1 /lib/
COPY --from=ugit-ops /lib/libattr.so.1 /lib/
COPY --from=ugit-ops /lib/libc.musl-* /lib/
COPY --from=ugit-ops /lib/ld-musl-* /lib/
COPY --from=ugit-ops /lib/libutmps.so.0.1 /lib/
COPY --from=ugit-ops /lib/libskarnet.so.2.13 /lib/
COPY --from=ugit-ops /lib/libz.so.1 /lib/
```

Notice, that we are copying `libc.musl-*` and `ld-musl-*` from the builder image. This is because the build for these libs depends on the architecture of the host machine.


### Shebangs `#!` are useless

If you look at the very [first line of ugit](https://github.com/Bhupesh-V/ugit/blob/master/ugit#L1), you'll see a shebang `#!/usr/bin/env bash`. The use of `env` is considered a good practice when writing shell scripts, used to tell the OS which shell interpreter to use to run the script, this is ideal in an everyday dev machine. Linux (and older versions of macOS) get shipped with `sh`, `bash`, and on top of it, folks install `zsh` etc.

But since using shebangs is optional, and we already copy the `bash` binary, we just need to invoke our script using it. This saves us a couple of bytes in the image size as well. Close to 1.9 MB to be precise.

![get rid of shebang](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWNmdHQ3bGQ0czN1eG9vYTlicGd0aXRjeDJqbXg5aXZreTNhM3hoeiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o6Mbi2vzeke98ApAA/giphy.gif)

```Dockerfile
# Run ugit when the container launches
CMD ["/bin/bash", "/bin/ugit"]
# or 
# ENTRYPOINT ["/bin/bash", "/bin/ugit"]
```


### A look at `terminfo` db

ugit has colors, thanks to `tput`. We load up a bare-bones Alpine image with `bash` and head over to the `/etc/terminfo` directory. This directory contains the terminal info database.

```bash
37a1a77f70ed:/app# cd /etc/terminfo/
37a1a77f70ed:/etc/terminfo# ls
a  d  g  k  l  p  r  s	t  v  x
```

Each of these letter-based "directories" represents different `$TERM` types. For example, `xterm` is a terminal type. If you run `tput -T xterm colors` on your local machine, you'll get the number of colors your terminal supports. For `xterm` it should be `8`, and in the case of `xterm-256color` it should be `256`.

Now here's our chance, to only support 1 terminal type amongst the 40+ that are present in the `terminfo` db. We can get rid of the rest of the terminal types. This saves us another 97Kb, very little but needed to clear up the clutter.

```Dockerfile
# copy terminfo database for only xterm-256color
COPY --from=ugit-ops /etc/terminfo/x/xterm-256color /usr/share/terminfo/x/

# Gib me all the colors
ENV TERM=xterm-256color
```



## Everything needed to run `ugit`

![everything-everywhere](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3N1YWJsbm84anNydG5rN3NoNTh2b3RramJ0NWMzcWZjcnZtMDhwNiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/TejmLnMKgnmPInMQjV/giphy.gif)

The final Docker image sits at 17.6 MB with no security vulnerabilities (as reported by [docker scout](https://docs.docker.com/scout/), at the time of writing this article). We have successfully reduced the image size by 40% compare to our [first attempt](/publishing-my-first-ever-dockerfile-optimization-ugit/#the-very-first-dockerfile-attempt).


Here's the final Dockerfile:

```Dockerfile
FROM alpine:3.18 as ugit-ops

RUN apk add --no-cache \
    bash \
    coreutils \
    git \
    ncurses \
    curl

# Download fzf binary from GitHub, pin to 0.46.0, ugit requires minimum 0.21.0
RUN curl -L -o fzf.tar.gz https://github.com/junegunn/fzf/releases/download/0.46.0/fzf-0.46.0-linux_amd64.tar.gz && \
    tar -xzf fzf.tar.gz && \
    mv fzf /usr/bin/

# Copy only the ugit script into the container at /app
COPY ugit .

# Set permissions and move the script to path
RUN chmod +x ugit && mv ugit /usr/bin/

# Second stage: Copy only necessary binaries and their dependencies
FROM scratch

COPY --from=ugit-ops /usr/bin/ugit /bin/
COPY --from=ugit-ops /usr/bin/git /usr/bin/
COPY --from=ugit-ops /usr/bin/fzf /usr/bin/
COPY --from=ugit-ops /usr/bin/tput /usr/bin/
COPY --from=ugit-ops /usr/bin/nl /usr/bin/
COPY --from=ugit-ops /usr/bin/awk /usr/bin/
COPY --from=ugit-ops /usr/bin/xargs /usr/bin/
COPY --from=ugit-ops /usr/bin/cut /usr/bin/cut
COPY --from=ugit-ops /usr/bin/tr /usr/bin/tr
COPY --from=ugit-ops /bin/bash /bin/
COPY --from=ugit-ops /bin/sh /bin/

# copy lib files
COPY --from=ugit-ops /usr/lib/libncursesw.so.6 /usr/lib/
COPY --from=ugit-ops /usr/lib/libncursesw.so.6.4 /usr/lib/
COPY --from=ugit-ops /usr/lib/libpcre* /usr/lib/
COPY --from=ugit-ops /usr/lib/libreadline* /usr/lib/

COPY --from=ugit-ops /lib/libacl.so.1 /lib/
COPY --from=ugit-ops /lib/libattr.so.1 /lib/
COPY --from=ugit-ops /lib/libc.musl-* /lib/
COPY --from=ugit-ops /lib/ld-musl-* /lib/
COPY --from=ugit-ops /lib/libutmps.so.0.1 /lib/
COPY --from=ugit-ops /lib/libskarnet.so.2.13 /lib/
COPY --from=ugit-ops /lib/libz.so.1 /lib/

# copy terminfo database
COPY --from=ugit-ops /etc/terminfo/x/xterm-256color /usr/share/terminfo/x/

# Gib me all the colors
ENV TERM=xterm-256color

WORKDIR /app
# Run ugit when the container launches
CMD ["/bin/bash", "/bin/ugit"]
```

I decided to pin the version of `fzf` to `0.46.0` (the latest at the time of writing this article) because ugit requires a minimum `0.21.0` to run, and I figured what the heck, let's pin it to the latest version.

> ℹ️ `docker run --rm -it -v $(pwd):/app ugit` will run the ugit container. Make sure your current directory is a git repo.

This is how the final file system tree looks like: <br>

<script src="https://gist.github.com/Bhupesh-V/0d5d922a98923fa8d8cf8ecd45c4ad7e.js"></script>

This is everything to make our shell app work. No more, no less. Time for a beer? 🍺

> PS: The final docker image came down to 16.2 MB. You can find the updated Dockerfile [here](https://github.com/Bhupesh-V/ugit/blob/master/Dockerfile). For the sake of this article, I kept the image size at 17.6 MB.

## Could we reduce the size further?

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDh5dzF6cHUzbWtybDY4dmc3b3BwNmRvaWpkOG1yanJhc2p0d2xkNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tAFVuG6fanerHd6VOf/giphy.gif)

Yes, but there are 2 reasons why I didn't go any further:

### Reason 1: Pin minimum version of `fzf`?

At the time of writing ugit, the script relied on [`fzf` minimum version `0.20.0`](https://github.com/junegunn/fzf/releases/tag/0.20.0), it’s granted that the latest version is going to be larger than the minimum required version. So we should pin the old version, right? No. because then it introduces security vulnerabilities with fzf's dependencies, i.e., Golang. As reported by `docker scout quickview`, the older version of Golang has a total of 66 security issues. Maybe they affect the image, maybe they don't. But I am not taking that risk, I want to keep the image as clean as possible.

<img width="877" alt="security issues in golang" src="https://github.com/Bhupesh-V/Bhupesh-V.github.io/assets/34342551/f0edf2b9-063b-4fc3-b928-754eb7d7f9af">

> ℹ️ In the Alpine ecosystem, it is generally not advised to pin minimum versions of packages.

### Reason 2: Use the latest bash features?

At the time of writing ugit, I relied on [`bash` version `4.0`](https://ftp.gnu.org/gnu/bash/). Both tr and cut could be replaced, if I shifted to a newer version of bash. i.e, _5.0_. And that my friends is a breaking change. Getting rid of and would have saved me a couple of bytes, but I didn't want to break the script for folks who are still on bash 4.0. It doesn't matter if I am the only one left, my machine still has bash.


## You didn't try `docker-slim`?

- I did, it did slim down my image, but it also broke the script with missing dependencies. Slim is great, the reader should check it out. Unfortunately, I couldn't get it to work for ugit in my limited time.
- Moreover, I wanted to learn how to do it with my own hands, rather than rely on a tool to do it for me.

## You didn't try `docker-squash`?

I did, and the size optimization was nearly negligible. Here's a log of the squash process which I ran on a Linux (AMD) machine (ignore the size of the image, since we are on different architecture, the image size is different):

<script src="https://gist.github.com/Bhupesh-V/29549bc7c70d3a3dbd7944c306cd3b67.js"></script>

## Learnings

- Linux is awesome. Everything, every design decision, every tool inspiration that came out of it inherits the same awesomeness.
- Never shy away from going into deep 🐇 rabbit holes of micro-optimizations. You learn a lot. There's always something new to learn.

## Acknowledgements

- Big thanks to the authors of `ldd`, and everyone in the `docker` & `alpine` linux community.
- Thanks to folks on the **developersIndia** discord for helping out with advice & suggestions.
- [dive](https://github.com/wagoodman/dive) for helping me visualize the image layers.

## Resources

- [TLDP.org - Shared Libraries](https://tldp.org/HOWTO/Program-Library-HOWTO/shared-libraries.html)
- [Dockerfile best practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [About docker storage drivers](https://docs.docker.com/storage/storagedriver/)

I hope you guys got something interesting to read today. Until next time, happy hacking & before you go please give [ugit](https://github.com/Bhupesh-V/ugit) a star & a [docker pull](https://hub.docker.com/r/bhupeshimself/ugit)? 🧡

---

<br>

<small>Read what the community is saying on <a href="https://news.ycombinator.com/item?id=39240471">hackernews</a> & <a href="https://www.reddit.com/r/programming/comments/1ahwyx2/how_i_reduced_the_size_of_my_very_first_published/?utm_source=share&utm_medium=web2x&context=3">reddit</a>.</small>

<br>
<br>
