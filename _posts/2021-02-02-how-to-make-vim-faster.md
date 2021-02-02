---
layout: post
comments: true
title: How to make Vim faster ⚡️
description: How to increase vim/neovim startup time. A list of things to add in your vimrc that will make Vim run more faster than you
tags: vim
---


Apart from not loading shit ton of plugins, there are some other tricks that can be used to make Vim more faster:

1. `set noswapfile`

   If you are a single user on your system, you probably don't need swap files.

2. `set lazyredraw`

   When this option is set, the screen will not be redrawn while executing macros, registers and other commands that have not been typed.

3. `set shada=NONE` (NeoVim) or `set viminfo=NONE` (Vanilla Vim)

   The shada or viminfo file is used to store a lot of things like command line history, marks, input-line history, search history.
   Disabling this for real dev work won't be a wise choice but it can be a life-saver if you are using Vim over SSH. Most of the features wont be required in that case.

Below is the startup time **with** & **without** these settings enabled.

You can generate the startup log using `vim --startuptime startup.log`

![vim-startup-time-comparison](https://drive.google.com/uc?export=view&id=1aCI2gHiGvj3JYVDE9AI2QsaJ_6sU1hqS)


> This is a progressive document, I will add more things here as I learn & discover. If you have any suggestion, please comment them below.

