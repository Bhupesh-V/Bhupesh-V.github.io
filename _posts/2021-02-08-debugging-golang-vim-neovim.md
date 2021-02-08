---
layout: post
comments: true
title: Debugging Go in Vim
description: Learn how to setup makeprg for Go. How to setup make for Go development, make command in vim/neovim. Setting Vim for Golang
tags: go vim
---

Using `make` in Vim/NeoVim can be a handy utility if you want to quickly build, run & debug programs. The make command is governed by the program set in `makeprg`.

By default `makeprg` is set to the **make** utility, popular in C/C++ development. Let's see how to configure this for Go.
Before we do that, lets create a sample Go file with some errors 😅️ 

```golang
package main

import (
	"fmt"
)

func main() {
	fmtPrintln("Hello")
	fmtPrintln("World")
}
```

If you want to **run** your Go programs directly:

```vim
:set makeprg=go\ run\ %
```

If you just instead want to **build**:

```vim
:set makeprg=go\ build\ %
```

Note: the make command will automatically create a binary with the same file (buffer) name. So you don't need to specify the `-o` flag.

Now all you need to do is run `:make`, you can also set some accessible key bindings. I have these in my vimrc

```vim
nnoremap <A-m> :make<bar>cw<CR>
inoremap <A-m> <Esc>:make<bar>cw<CR>
```

To take things further, you can also combine the **golint** tool with **go run**

```vim
:set makeprg=golint\ %\ &&\ go\ run\ %
```

Since you are probably using multiple languages at once, you need to set the make command on each FileType.
Add this auto-command in you `.vimrc` or `init.vim`

```vim
autocmd FileType go setlocal makeprg=go\ run\ %
```

> Make sure to use `setlocal` and not `set`

## How to fix errors

Vim provides a separate window to show errors called the error-window more formally know as the _quickfix_ window.

Combine the make command with `copen` to open a **quickfix** window

```vim
:make | copen
```

This will first build the program then open a new window at the bottom, listing all the errors.

I prefer `cw` instead of `copen` since it opens the quick fix window only if there are any errors. This makes it a perfect match with the make command

```vim
:make | cw
```

You can press Enter (\<CR\>) on each error listed to directly go the error line in the program (vim will open the open the file, if it isn't already opened)


Use `cn` and `cp` to go to next & previous item in quickfix list respectively. Add these mappings

```vim
map <C-j> :cn<CR>
map <C-k> :cp<CR>

\" I prefer these instead. Suit yourself!
nnoremap <kPlus> :cn<CR>
nnoremap <kMinus> :cp<CR>
```

Let's see how all this setup works

![go-make-demo](https://drive.google.com/uc?export=view&id=1IdMIzKAgOyntAOwRkXeVTmh2dOGhe-1S)

## Resources

Read the following vim manual pages for more insights:

1. `:help makeprg`
2. `:help quickfix`

