---
layout: post
comments: true
title: The unholy way of using virtual environments
description: A look down at different ways you can setup a python virtual environment in 2020 (spoiler-there are 3 ways)
image: unholy-way-of-virtual-envs.png
tags: python
---

I try to explain different ways a python project can be setup in 2020 using virtual environments without relying much on external utilities.
Remember the goal is not to discuss about the good or bad practices of using envs but rather to show that there are other ways of doing things which can subtly improve your workflow and productivity as a python developer.

<blockquote align="center" class="twitter-tweet"><p lang="en" dir="ltr">Most developers/people accept the ways thing are as how they have to be. Don&#39;t do that.</p>&mdash; Ryland (@taillogs) <a href="https://twitter.com/taillogs/status/1318648735287619586?ref_src=twsrc%5Etfw">October 20, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

> Note that I won't be discussing virtual environment management tools, there is probably no limit to them.


## Type A : the moral way

> Your project contains the venv.

```bash
project-folder
├── .git
├── .github
├── .. other files/folders ..
└── venv
    ├── bin
    ├── include
    └── lib
```

This is the most traditional way tutorials on internet teach you. While this is the most used approach I sometimes don't understand it. I mean what is a virtual environment anyway?

It is used for running your application in isolation i.e your app runs "inside" a environment so if that's the case then "logically" why are we storing the env inside the project?, Shouldn't this be the other way around.


## Pros

1. Easily portable. Can remove and create new envs instantly.

### Cons

1. You accidentally commit your virtual env (first time setup, rookie mistake).
2. Can't create envs with custom name. If we do they need to be present inside `.gitignore` (again causing the first problem). Now of-course you have specialised tools to do this task for you (but common you really need a tool for this?).


## Type B : the offbeat way

> A folder contains your main project and a venv as a sibling.

```sh
root-project-folder
├── your-project-folder-or-repo
│	├── .git
│	└── .. other files/folders ..
└── venv
	├── bin
	├── include
	└── lib
```

Or should I say this is the "holy" approach. While this approach fixes the cons of Type A approach but it sometimes can be a little daunting to setup a new project using this technique.

### Pros

1. You cannot accidentally commit your virtual environment.
2. No need to add it in `.gitignore`.
3. Can easily swap environments.
4. Can use custom names in env i.e you won't forget where is your project and/or its dependencies.

### Cons

1. Can be confusing while navigating (a bit tricky to distinguish which folder is the actual project folder).


## Type C: the unholy way 😈

> Project is stored inside the virtual env. (bet you didn't see that coming)

```bash
virtual-env-folder
├── bin
├── include
├── lib
└── your-project-folder-or-repo
    ├── .git
    └── .. other files/folders ..
```

### Pros

1. You can't accidentally commit your virtual environment.
2. No need to add it in `.gitignore`.
3. You don't forget which env holds dependencies of your project (you are literally inside the env).
4. Can use custom names in env (Tip: always suffix _venv_ with your project name while using this approach. E.g projecName-venv)

### Cons

1. Portability is lost. If dependencies gets messed up the whole project must be moved on to a new environment.


## A little automation is fine

I just emphasized that we shouldn't require any 3rd party tools but hey as a dev its in our blood to automate the boring stuff.
I wrote a small shell script to automatically activate/deactivate environments when you change/switch your current directory.

For your ease I wrote different versions for all the 3 approaches. Below is a boilerplate code that is used in all 3 approaches

```bash
vcd() {
    # [v]env [cd]

    userpath=$1

    # deactivate any existing virtual env
    [[ $VIRTUAL_ENV ]] && deactivate

    if [[ $userpath != "" ]]; then
        case $1 in
            ".." ) cd .. && return;;
            "-" )  cd -  && return;;
            "/" )  cd /  && return;;
            * )    cd "$userpath" || return;;
        esac
        ## BEGIN ACTIVATOR LOGIC

        ## END ACTIVATOR LOGIC
    fi
}

```

The variable `VIRTUAL_ENV` is updated every time you activate an environment. It stores the absolute path of your env folder and is responsible for showing that env (prompt) in your terminal. We wrote this scaffold code so that retains the original function of the `cd` command remains intact.

### For Type A

```bash
## BEGIN ACTIVATOR LOGIC

for dir in $(echo */); do
    if [[ -f "$dir/bin/activate" ]]; then
        source "$dir/bin/activate"; break;
    fi
done

## END ACTIVATOR LOGIC
```

`$(echo */)` would result in an array of directories inside the present working directory.  This can then be filtered for finding the `activate` script which is present inside every virtual environment.

> Note that there are other variations of the activate script for different shells `activate.csh` and `activate.fish`.

### For Type B

```bash
## BEGIN ACTIVATOR LOGIC

current_dir=$(pwd)
# extract the parent directory path
parent_dir="${current_dir%/*}"
for dir in $(ls -d "$parent_dir"/*/); do
    # you need to make sure only 1 env exists else just change this logic
    [[ -f "$dir/bin/activate" ]] && source "$dir/bin/activate" && break
done

## END ACTIVATOR LOGIC
```

Due to complex nature of this approach, we need to get the parent directory of your project which will have a virtual env as a sibling.
The command `ls -d Documents/*/` will list only the directories inside _Documents_ directory.


### For Type C

```bash
## BEGIN ACTIVATOR LOGIC

current_dir=$(pwd)
while [[ "$current_dir" != "$HOME" ]]; do
    # check if current dir contains an activate script (the venv folder)
    if [[ -f "$current_dir/bin/activate" ]]; then
        source "$current_dir/bin/activate"; break;
    fi
    # remove base directory name
    current_dir="${current_dir%/*}"
done

## END ACTIVATOR LOGIC
```


Save this in your `.bashrc`, [`.bash_functions`](https://github.com/Bhupesh-V/.Varshney/blob/master/.bash_functions) or a compatible shell config. You can alias this to the `cd` command for maximum productivity and you are good to go 🏃.

```bash
alias cd=vcd
```

I consider both the Type B & C approaches to be good enough to setup a python project and this doesn't require any 3rd party tools except the `venv` module itself.
I have been using the 3rd approach ever since I started python programming, I don't care if its a wrong or right approach but it works for me. What's your approach for handling this ? Do you need a environment manager ?

What do you think?

