---
layout: post
comments: true
title: Creating a smart alternative to 'cd' command
description: Shell function to automatically find absolute paths and change directories
image: scd.png
tags: linux shell
---

Do you sometimes forget the actual location of directories & have to juggle through `cd` & `ls` to know the right path?
In this short post, we discuss how to make a "smart" alternative to `cd` command on Linux (& probably MacOS 🙄).

The problem is simple we just need to automate this task of finding the actual location of directories and the 2 most popular commands to do that are `find` & `locate`:

## 1. `locate`

- Used to search for files, much faster than `find`.
- Limited functionality.
- Depends on external database for fast finding (`/var/lib/mlocate/mlocate.db`).
```bash
# search file paths which exactly match the pattern, "memes"
locate -r '/memes$' | grep $HOME
```

## 2. `find`

- Extensive options.
- Can search for both files & directories.
- Slower than `locate`.
```bash
# search for directory "memes" inside your home dir.
find -O2 $HOME -name "memes" -type d
```

Ok then basics clear, now we write a small `bash` function to create `scd` (smart `cd`).

```bash

scd() {
    if [[ $1 != "" ]]; then
        while read -r value; do
            if [[ -d $value ]]; then
                printf "%s\n" "Hit 🎯: $value"
                cd "$value"
            fi
        done < <( locate -e -r "/$1$" | grep "$HOME" )
    else
        cd "$HOME" || exit
    fi
}

```

That's it, 12 liner (a little) better alternative to cd.
Now you can add it to your `.bashrc` or better create a <a href="https://github.com/Bhupesh-V/.Varshney/blob/master/.bash_functions"><span class="mark">.bash_functions</span></a> file and source it in your default shell config.

```bash
if [ -f ~/.bash_functions ]; then
    . ~/.bash_functions
fi
```

> Note: If you are on Mac, `locate` would probably be not available, use `find` instead.

Not yet convinced?
Ok, a more advance version with options like `..`, `-`

```bash
scd() {
    if [[ $1 != "" ]]; then
        case $1 in
            [".."]* ) cd .. ;;
            ["-"]* ) cd - ;;
            ["/"]* ) cd / ;;
            * ) while read -r value; do
                    if [[ -d $value ]]; then
                        printf "%s\n" "Hit 🎯: $value"
                        cd "$value"
                    fi
                done < <( locate -e -r "/$1$" | grep "$HOME" ) ;;
        esac
    else
        cd "$HOME" || exit
    fi
}
```

### Cons 😤

- Well, one of the problems with our bash function is that we wouldn't be able to leverage "tab" auto-suggestions.
- Newly created directories won't be readily available with the `locate` command as it depends on its own database `mlocate.db`. The database is updated automatically by our system through a cron job. Although you can still do it manually.
```bash
sudo updatedb
```

### Pros 📈

- Don't have to search for directory paths & cd into it.
- Even if `scd` switches to the wrong directory (in case of multiple matches), you will still be able to see what's the actual path in output & then switch to it manually.

<span class="mark">UPDATE: 9 Aug 2020</span>

Thanks to Santosh's comment on my [LinkedIn post](https://www.linkedin.com/feed/update/urn:li:activity:6696322663343910912/) there is another way of switching directories "smartly".

#### The `CDPATH`

It is used as a search path for the cd command. A colon-separated list of directories in which the shell looks for destination directories specified by the cd command.

It gives you a limited functionality to cd into sub-directories of a specific parent directory.

For e.g in your `.bashrc` or `.zshrc` add this line.

```bash
export CDPATH=".:/home/bhupesh/Desktop"
```

And now you can freely switch directories inside Desktop & would not have to use `cd ~/Desktop/dirB` or `cd /home/username/Desktop/dirB`.
Well of-course now you need to do this manually & find out which directories you usually spent more time in.


what do you think?