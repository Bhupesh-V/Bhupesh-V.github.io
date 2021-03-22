---
layout: post
comments: true
title: Making grep searches sexier 🌶️
description: Beautifying grep searches & using AWK to modify grep output. Changing grep colors. 
tags: shell linux awk
banner_image: https://ik.imagekit.io/bhupesh/banners/sexy-grep__3__mi_pC8-ge.png
---

grep is a life-saver for many but it is not so good with terminal UX, in this short tutorial I share some tips that can help make your grep experience a bit more pleasant!


## Changing grep colors 🌈️

GNU Grep offers the `GREP_COLORS` environment variable to modify the grep colors. You can read more about this in the [GNU grep manual](https://www.gnu.org/software/grep/manual/grep.html#index-GREP_005fCOLORS-environment-variable)

The colors are controlled using Select Graphic Rendition (SGR) commands which is a colon-separated list of ANSI color sequences, concatenated via semicolons. Under the hood grep assembles converts this list into a complete SGR sequence (‘\33[’...‘m’) which you already might know about.
Below is a slightly better combination of colors then plain old red & pink,

```bash
export GREP_COLORS='ms=1;38;5;214:fn=1;38;5;154:ln=1;38;5;111'
```

1. [`ms`] **Search word** = bold orange foreground
2. [`fn`] **Filename** = bold green foreground
3. [`ln`] **Line no** = bold blue foreground

You can set background colors as well by continuing the color sequence,
```
fn=1;38;5;154;1;48;5;236
```
the first part `1;38;5;154` sets the foreground to parrot green color and the part `1:48;5;236` is responsible for setting the background color to darkish gray. This of course works both ways you could set background followed by foreground

Other text styling attributes include,

- Underline: `fn=4;38;5;154`
- Bold & Underline: `fn=1;4;38;5;154`
- Bold & Italics: `fn=1;3;38;5;154`

See the complete chart for other capabilities [here](https://askubuntu.com/a/1042242/1001787)

### Must include options

grep can be used as a codebase-exploration tool, below are some must include options

- Excluding directories:
  The exclude-dir option requires a _glob_ pattern as an argument.
  ```bash
  --exclude-dir={_site,.git,node_modules,__pycache__}
  ```
- Excluding files
  ```bash
  --exclude='*.gitignore'
  ```
- `--w` : only match whole "words"
- `--i` : ignore-case
- `--n` : print line number with output lines
- `--r` : do a recursive search
- `--I` : prevent searching inside binary files


## Improving Output Format using `AWK`

```awk

# Utility to print grep searches in a human-friendly way

BEGIN {
  FS=":"
  file=""
  filestarted=0
  GREEN_FG="\033[1;38;5;154m"
  RESET="\033[m"
}

{
  if($1 != file && $1 != ""){
    file=$1
    print "\n" $1 ":"
    filestarted=0;
  }
  if(filestarted != 0){
    print GREEN_FG "|" RESET
  }
  out=substr($0, length($1 ":" $2 ": "))
  print $2 " " out
  filestarted=1;
}
```

The `BEGIN` block declares some variables including `FS`, which is used to split the input string using `:` as a field separator.
Since grep's output format can be separated into 3 records `filename:line_no:match_line` as each line is processed the segregated outputs are available in the following records:

1. `$1` : file-path
2. `$2` : line number
3. `$3` : the rest of the line

> Note that the current line being processed is always available in the record `$0`

The FS variable can also be set using the `-F` flag, 
```bash
$ awk -F ":" '/pattern/{action}'
```

Awk performs any actions associated with the `BEGIN` pattern once, before processing the input file/text. Following that we use a very naive logic to print grep results, continue printing the output match line (stored in `$3`) until the filename record changes. We are instead getting the substring from `$0` as we will have problems printing results that contain a colon (considering our FS is also set to a colon)

The complete and up to date script is [**available here**](https://github.com/Bhupesh-V/.Varshney/blob/master/scripts/pretty-grep.awk)

All you need to do is just pipe the output of grep to this script, using the `-f` option.

```bash
grep --winr --color=always | awk -f pretty-grep.awk
```

I have this in my [`.bash_functions`](https://github.com/Bhupesh-V/.Varshney/blob/master/.bash_functions),

```bash
lk (){ 
    grep -wnirI --color=always --exclude='*.gitignore' --exclude-dir={_site,.git,.github} "$@" | awk '{$1=$1};1' | awk -f ~/Documents/.Varshney/scripts/pretty-grep.awk
}
```

And there you have it, a slightly better grep.

### Resources & Credits \<3
- [Using Awk to beautify grep searches](https://www.endpoint.com/blog/2017/01/18/using-awk-to-beautify-grep-searches)
- [Standout and Appearance Modes](https://www.gnu.org/software/termutils/manual/termcap-1.3/html_node/termcap_33.html#SEC33)

