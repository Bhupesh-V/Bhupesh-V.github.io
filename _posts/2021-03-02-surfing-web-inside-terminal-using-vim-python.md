---
layout: post
comments: true
title: Surfing web inside a terminal, because why not?
description: How to search the internet inside a terminal. How to use searx inside a terminal, python script to browse web inside vim & terminal
tags: linux vim python
image: surf-script.png
---


I recently wrote a python script to **surf** the web (see search results) directly into the terminal.

Here is a demo
<center>
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Wrote a python script to surf the web 🔎 from inside the terminal with 0 external dependencies (yeah no pip install ;)<br><br>You can find the script on my github 🔽<a href="https://t.co/EKHahIcUTz">https://t.co/EKHahIcUTz</a><br><br>Feedback/Suggestions welcome<a href="https://twitter.com/hashtag/python?src=hash&amp;ref_src=twsrc%5Etfw">#python</a> <a href="https://t.co/U0cVg9lFSc">pic.twitter.com/U0cVg9lFSc</a></p>&mdash; Bhupesh Varshney 🐧🐍 (@bhupeshimself) <a href="https://twitter.com/bhupeshimself/status/1362779641639890958?ref_src=twsrc%5Etfw">February 19, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</center>

The script is available on my [github](https://github.com/Bhupesh-V/.Varshney/blob/master/scripts/surf)

It's not that big of a deal since all credit goes to [searx](https://github.com/searx/searx) a privacy respecting FOSS metasearch engine

## Why Searx

Why not?

- It respects your privacy. No user-tracking
- Open-source
- You can even set up your own (private/public) searx instance on a VPS. [List of public instances](https://searx.space/)
- Aggregates results from more than 70 search services (DuckDuckGo, Wikipedia, etc)


## Installation

The script doesn't require any dependencies (except Python 3), just download the script and run it.

> Note that surf was written for/as a Linux user. It should work on Mac without any problems. If you are on Windows consider sending patches if the script breaks. Thanks!

```bash
wget -q https://raw.githubusercontent.com/Bhupesh-V/.Varshney/master/scripts/surf

chmod +x surf && mv surf $HOME/.local/bin/
```

If you are more of a bad boy/girl then add the location of surf script to your `PATH`

```bash
export PATH="DIR_PATH_WHICH_CONTAINS_SURF:$PATH"
# e.g
export PATH="$HOME/Documents/.Varshney/scripts:$PATH"
```

You can view help & usage on surf by doing a simple `surf --help`. Let's go through all the options available.

## Usage


1. Just run the script, without any arguments. surf will prompt you for a search query:
   ```bash
   $ surf
   ```

2. Show link description.
   ```bash
   $ surf -d
   ```
   ![surf-demo](https://ik.imagekit.io/bhupesh/surf-demo-1_WLHCXe2iBg.png)

3. Provide search query as an argument (also `--query`):
   ```bash
   $ surf -dq "how to change the world"
   ```

4. You can also pipe data to surf `¯\_(ツ)_/¯`:
   ```bash
   $ echo "search this" | surf
   ```

5. Use `-c` to specify search category (default: general):
   ```bash
   $ surf -c "videos" -dq "how to make a pizza"
   ```
   Other categories include: "news", "files", "images", "map"

   ![surf-demo](https://ik.imagekit.io/bhupesh/surf-demo-2_ivVXqxuhI1.png)

6. Update searx instance cache list before fetching results:
   ```bash
   $ surf -udq "when is doomsday"
   ```
   Updating cache is not usually required, I recommend running it once/twice a week to get a list of active instances.

   The cache is located at `$HOME/.local/.searx_instances` on linux and `$HOME/Library/Caches/.searx_instances` on Mac

   ![surf-demo](https://ik.imagekit.io/bhupesh/surf-demo-3_8nvOFnym5.png)

7. Show only top N results (also `--top`):
   ```bash
   $ surf -t 5 -dq "check if key exists in map"
   ```


searx supports those sneaky search tricks as well,

```bash
surf -dq "site:youtube.com how to make pizza"
surf -dq "site:stackoverflowcom <my-error-message>"
surf -dq "intitle:best vim plugins"
surf -dq "inurl:docs.djangoproject.com templates"
```


Well now you would be asking "what's the use of this bhupesh, If I have to open the link in the browser at the end"

But what I realized is that it may accidentally fit right into my/your workflow if you use Vim, let me show how

## Browsing Inside Vim, _say whaat_

We need a way to open links right from our vim terminal. Add this to your `vimrc` or `init.vim`

```vim
" Open hyper link in current line
function! OpenLink()
    let links = []
    try
        call substitute(getline('.'), 'http[s]\?:\/\/[^) \"]*', '\=add(links, submatch(0))', 'g')
        echo "Opening " . links[0]
        exe "silent! !xdg-open " . links[0]
    catch E684
        echo "No link found :("
        return
    endtry
endfunction
```

The line

```vim
exe "silent! !xdg-open " . links[0]
```

will directly open your default browser with the link.

If you are not using X11, then you can just swap it directly with the browser of your choice or your default file manager

1. Firefox
   ```
   exe "silent! !firefox --new-tab " . links[0]
   ```

2. Chromium
   ```
   exe "silent! !chromium-browser " . links[0]
   ```

Also, I recently found a less bulky approach on [vimtricks.com](https://vimtricks.com/p/open-url-under-cursor/)

```vim
function! OpenURLUnderCursor()
  let s:uri = expand('<cWORD>')
  let s:uri = substitute(s:uri, '?', '\\?', '')
  let s:uri = shellescape(s:uri, 1)
  if s:uri != ''
    silent exec "!open '".s:uri."'"
    :redraw!
  endif
endfunction
nnoremap gx :call OpenURLUnderCursor()<CR>
```

### Searching Error messages inside Vim

Say I am debugging something and end up with a never before seen Error message. I can quickly send the error string to `surf` and get links to StackOverflow or GitHub!

Here is a demo of me using **flake** on surf & searching about rules:

![surf-demo-inside-vim-terminal](https://ik.imagekit.io/bhupesh/demo-surf-term_CpgT93vVj.gif)

How this works is pretty straightforward. We just need to get the current visual selection.

```vim
function! GetVisualSelection()
    " Thanks: https://stackoverflow.com/a/6271254/8209510
    let [line_start, column_start] = getpos("'<")[1:2]
    let [line_end, column_end] = getpos("'>")[1:2]
    let lines = getline(line_start, line_end)
    let lines[-1] = lines[-1][: column_end - (&selection == 'inclusive' ? 1 : 2)]
    let lines[0] = lines[0][column_start - 1:]
    return join(lines, "\n")
endfunction

xnoremap <leader>t <esc>:split <bar> call SendQueryToTerm()<CR>

function! SendQueryToTerm()
    let selection = GetVisualSelection()
    exe ":term surf -dq \'" . selection . "\'"
endfunction
```

This will open a split above with a new terminal buffer.


### Convinced yet?

Maybe not

If you liked **surf** make sure to subscribe to the [Atom Feed](https://github.com/Bhupesh-V/.Varshney/commits/master/scripts/surf.atom) or watch my [dotfiles](https://github.com/Bhupesh-V/.Varshney) repo for the latest development or better fork & hack your own features!!

