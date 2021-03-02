---
layout: post
comments: true
title: How to use code snippets in Vim like a cowboy 🤠️
description: A quick tour on how to get started with code snippets in Vim. Learn how to setup Ultisnips & vim-snippets in Vim and Neovim. How to install vim-snippets, How to use snippets in vim.
tags: vim go python shell
image: vim-snippets-banner.png
---

Its time to increase your horsepower and write code faster than before. In this tutorial I will cover how to setup and use code-snippets in Vim or NeoVim for Go, Python, Bash and Markdown (since I deal with them everyday)

Also note that this tutorial is for people who have recently started to use Vim as their main editor, or for people who are looking for reasons to switch to Vim gang (don’t worry Vim has everything a modern editor can provide & much more!)

- [Introduction](#introduction)
  - [Installing Plugins](#installing-plugins)
  - [How to use ultisnips](#how-to-use-ultisnips)
- [Code Snippets for Go](#code-snippets-for-go)
- [Code Snippets for Python](#code-snippets-for-python)
- [Code Snippets for Bash/Shell Scripts](#code-snippets-for-shell)
- [Code Snippets for Markdown](#code-snippets-for-markdown)
- [How to create your own snippets](#how-to-create-your-own-snippets)

## Introduction

Code snippet ecosystem in Vim is segregated into different plugins, here is how it looks like in a generic way

```

                ---------------------
                |  Snippet Provider | [vim-snippets]
                ---------------------
                          | 
                          v
                --------------------
                |  Snippet Manager | [Ultisnips, snipMate]
                --------------------
                          |
                          v
                --------------------
                |  Code Completion | [YCM, deoplete, coc]
                --------------------

```

### Installing Plugins

For this tutorial, we will be installing Ultisnips and vim-snippets.

If you use [Plug](https://github.com/junegunn/vim-plug),

```vim
Plug 'SirVer/ultisnips'
Plug 'honza/vim-snippets'
```

For Vundle,

```vim
Plugin 'SirVer/ultisnips'
Plugin 'honza/vim-snippets'
```

For vanilla vim, run the following commands

```bash
mkdir -p ~/.vim/pack/bundle/start && cd $_
git clone https://github.com/SirVer/ultisnips.git
git clone https://github.com/honza/vim-snippets.git
```

_Let me know if the above commands don't work on vanilla vim, I nuked mine 😛️_

Once you have installed both the plugins, open your **vimrc** or **init.vim** to configure some key mappings for ultisnips

```vim
let g:UltiSnipsExpandTrigger="<tab>"
" list all snippets for current filetype
let g:UltiSnipsListSnippets="<c-l>"
```

### How to use ultisnips

1. Type the “snippet trigger” (listed below in the 1st column) and press TAB in insert mode to evaluate the snippet block.
2. Use `Ctrl` + `j` to jump forward within the snippet.
3. Use `Ctrl` + `k` to jump backward within the snippet.
4. Use `Ctrl` + `l` to list all the snippets available for the current file-type

Below are some of the **most common snippets** you should start using right now!

## Code Snippets for Go

| Snippet Trigger | Description |
| --- | --- |
| `fun` | Go function |
| `fum` | Go Method |
| `for` | Infinite for loop |
| `forr` | Range based for loop |
| `err` | Go Basic Error Handling |
| `im` | Import Packages |
| `pf` | fmt.Printf(…) |
| `pl` | fmt.Println(…) |
| `ps` | fmt.Sprintf(…) |
| `om` | _if key in map_ |
| `if` | Go basic `if` statement |
| `ife` | Go basic `if/else` statement |
| `sw` | Switch statement |
| `sl` | Go `select` for channels |
| `ga` | goroutine anonymous function |
| `test` | Go Test function |
| `testt` | Go Table test function |

[All Go snippets](https://github.com/honza/vim-snippets/blob/master/snippets/go.snippets). Also, see Ultisnips specific [snippets](https://github.com/honza/vim-snippets/blob/master/UltiSnips/go.snippets)

## Code Snippets for Python

| Snippet Trigger | Description |
| --- | --- |
| `cl` | New Python class |
| `def` | New Python function definition |
| `adef` | Python Async function definition |
| `err` | Go Basic Error Handling |
| `try` | Try/Except Block |
| `trye` | Try/Except/Else Block |
| `tryf` | Try/Except/Finally Block |
| `tryef` | Try/Except/Else/Finally Block |
| `"` | Python docstring |
| `if` | Python basic `if` statement |
| `el` | Python basic `else` statement |
| `for` | Range based for loop |
| `lcp` | List comprehension |

[All python snippets](https://github.com/honza/vim-snippets/blob/master/snippets/python.snippets). Also see Ultisnips specific [snippets](https://github.com/honza/vim-snippets/blob/master/UltiSnips/python.snippets)

> Bonus [Django Snippets](https://github.com/honza/vim-snippets/blob/master/UltiSnips/django.snippets)

## Code Snippets for Shell

| Snippet Trigger | Description |
| --- | --- |
| `for` | Basic `for` loop with iterator |
| `fori` | Range based `for` loop |
| `while` | Bash basic `while` loop |
| `case` | Bash `switch` statement |
| `if` | Bash basic `if` statement |
| `fun` | Bash basic function definition |
| `sbash` | shebang with secure guard |

[All shell snippets](https://github.com/honza/vim-snippets/blob/master/snippets/sh.snippets). Also, see Ultisnips specific [snippets](https://github.com/honza/vim-snippets/blob/master/UltiSnips/sh.snippets)

## Code Snippets for Markdown

| Snippet Trigger | Description |
| --- | --- |
| `*` | Italics text |
| `**` | Bold text |
| `/*` | Markdown/HTML Comment |
| `cbl` | Code block |
| `link` or `[` | Markdown link |
| `img` or `![` | Markdown image |
| `detail` | Details/Summary Tag |
| `tb` | Markdown Table |
| `tbN,M` | Responsive Table |
|   | (tb12 creates a table with 1 row & 2 columns) |

[All shell snippets](https://github.com/honza/vim-snippets/blob/master/snippets/markdown.snippets). Also, see Ultisnips specific [snippets](https://github.com/honza/vim-snippets/blob/master/UltiSnips/markdown.snippets)

You can also power up note-taking in markdown with some more plugins like [vim-markdown](https://github.com/plasticboy/vim-markdown) & [tabular](https://github.com/godlygeek/tabular)

## How to create your own snippets

vim-snippets stores its code-snippets in 2 different directories:

- `$HOME/.config/nvim/plugged/vim-snippets/snippets/` snipMate compatible
- `$HOME/.config/nvim/plugged/vim-snippets/UltiSnips/` for people who use vim-snippets with ultisnips (the snippet format is different)

The variable `g:UltiSnipsSnippetDirectories` can be used to specify different locations to look for snippets

```vim
let g:UltiSnipsSnippetDirectories=["UltiSnips", $HOME.'/Documents/.Varshney/snippets/']

```

Creating a snippet is fairly easy, the basic format is as follows

```vim-snippet
snippet <trigger_word> "Description" [options]
# code block
endsnippet

```

> Read more about snippet options in manual `:help UltiSnips-snippet-options`

Below is an example of a Jekyll Post header from my [dotfiles](https://github.com/Bhupesh-V/.Varshney)

```vim-snippet
snippet head "Jekyll Post Header" b
---
layout: post
comments: true
title: ${1:title}
description: ${2:description}
tags: ${3:tags}
image: ${4:image}
---

$0
endsnippet

```

The part in braces `{1:title}` is called a placeholder. When the snippet is expanded, `Ctrl` + `j` will visually select the next placeholder so that you can change the text. In the same way, `Ctrl` + `k` will visually select the previously entered placeholder

Here is a short demo of how this works

![snippet-demo-vim](https://ik.imagekit.io/bhupesh/snippet-demo_1uAx9czbh.gif)

> Read more about authoring snippets in manual `:help UltiSnips-authoring-snippets`

That’s it for this tutorial, why don’t you share your code snippets below 👇️

