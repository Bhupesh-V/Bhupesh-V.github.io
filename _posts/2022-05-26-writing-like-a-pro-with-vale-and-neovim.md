---
layout: post
comments: true
title: Writing like a pro with vale & neovim
description: Learn how to setup and use vale, a syntax-aware prose linter with neovim
tags: vim
banner_image: https://user-images.githubusercontent.com/34342551/170456293-0464b805-6c22-4b8d-8a44-e5f929cd846a.png
---


[Vale](https://vale.sh) is a syntax-aware prose linter built for all you writers out there. With more than 100 releases so far vale is 5 year old project and is used by writing folks in companies like Google, Microsoft, IBM, RedHat to name a few. I have recently started to use vale in my everyday writing workflow and it has a significant impact on what words I choose to convey ideas. I mostly use neovim for writing, so we will be covering how to setup `vale` and use it with neovim.

Just like when writing software we use static analysis tools to find common problems, `vale` aims to help writers configure what words/prose to choose while writing technical documentation.

## Installing `vale`

Download a latest version of vale from their [github releases page](https://github.com/errata-ai/vale/releases).

## Writing styles & the vale config

Vale requires to have a `.vale.ini` config file located either in your `$HOME` directory or a relative project directory. Below is a sample configuration that I use personally

```ini
# This goes in a file named either `.vale.ini` or `_vale.ini`.
StylesPath = styles
MinAlertLevel = suggestion

# External packages
Packages = Google, Readability, alex, proselint, IBM
# Only Markdown and .txt files; change to whatever you're using.
[*.{md,txt}]
# List of styles to load.
BasedOnStyles = alex, proselint
```

Once you create this file, run `vale sync` to download/update any External packages you have mentioned in the config.

A vale style is a repository of "rules" that define what words need to be reported by vale. The rules are defined in a `yml` file.

> If you prefer to customize the config yourself, I recommend using the [config generator](https://vale.sh/generator/)

The vale project has come up with [7 style packages](https://vale.sh/types/style/). Some of the popular styles are based on writing rules from organisations like Google & Microsoft, some of which are listed below:

1. [Microsoft Writing Style Guide ](https://docs.microsoft.com/en-us/style-guide/welcome/)
2. [Google Developer Documentation Style Guide ](https://developers.google.com/style/)
3. [IBM's Developer Editorial Style Guide](https://www.ibm.com/developerworks/library/styleguidelines/index.html)

You can find more vale styles on github by [vale-style topic](https://github.com/topics/vale-style).

Choosing what styles suits best for your writing needs depends on your writing style, If you are working with a team of writers in a organisation I would suggest using styles from Google & Microsoft which are more strict but good for teams. If you have a personal blog or you write solo, use styles like `alex` or `proselint` whose rules are more lenient, I recommend give all the rules a try by switching the `BasedOnStyles` property in vale config.

## Setting up Neovim

The [null-ls.nvim](https://github.com/jose-elias-alvarez/null-ls.nvim) neovim plugin let's you use vale as a pose linter.

Install null-ls.nvim using `Plug`

```vim
Plug 'jose-elias-alvarez/null-ls.nvim'
```

Require the lua plugin,

```lua
require("null-ls").setup({
    sources = {
        require("null-ls").builtins.diagnostics.vale,
    },
})
```

If you are using a native `vim` config use lua HERE doc.

```vim
lua << EOF
require("null-ls").setup({
    sources = {
        require("null-ls").builtins.diagnostics.vale,
    },
})
EOF
```

> Make sure you have a `.vale.ini` or `_vale.ini` somewhere in `$HOME` or at the current working directory.

Here is how the in-editor suggestions look like

![vale-with-null-ls](https://user-images.githubusercontent.com/34342551/170453421-9e610662-0d37-48c3-876b-e80dd1f8f17f.png)

As you can see, some of the suggestions are not being rendered by NeoVim correctly. To fix this, you can use the [trouble.nvim](https://github.com/folke/trouble.nvim) plugin to get a nice VSCode like interface for diagnostics.

![vale-vim-demo](https://user-images.githubusercontent.com/34342551/167239725-338a212b-877a-4f7a-a66f-3edd5483e7d1.png)

And that's it, enjoy writing!
