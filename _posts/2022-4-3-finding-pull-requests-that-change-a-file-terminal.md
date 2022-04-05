---
layout: post
comments: true
title: Find pull requests that modify a file path in the terminal
description: Using GitHub's command-line tool and some shell magic to find pull requests that modify a specific filepath right inside your terminal
tags: github shell git
banner_image: https://user-images.githubusercontent.com/34342551/161421468-598f7f1b-24db-4529-8fc1-fa99c1d88413.png
---

Ever wondered how others are changing the same file you are working on? It can give insights into what a particular piece of code will look like in the future. Certainly, it can also help OSS newcomers to identify how others are building a particular feature

Well, today's post is to solve just that. Let's build a simple shell script for ourselves, shall we?


## Pre-requisities

Before we start working on anything, make sure you have the following CLI tools installed

1. [`gh`- Github's CLI tool](https://cli.github.com/)
2. [`fzf` - A command-line fuzzy finder](https://github.com/junegunn/fzf#installation)
3. [`jq` - Command-line JSON processor](https://github.com/stedolan/jq/releases)

> Once you install `gh`, make sure to authenticate yourself using `gh auth login`

## Gimme pull requests

Our first job is to ask the user to choose a local file path to look for. This can be done by parsing `git ls-files`, for better interactivity we are going to use `fzf` as well

```bash
git_file=$(git ls-files | fzf \
  --prompt="Choose File: " \
  --height 40% --reverse \
  --header="Choose a file to find pull requests on github that modify it"
)
```

Once that's settled we need to find all the open pull requests, this is done by `gh pr list`

```bash
fetch_prs() {
  pr_fetch_limit=100
  printf "%s\n\n" "Hold tight while we look for PRs ✋👀 that modify $git_file"
  all_open_prs=$(gh pr list --limit $pr_fetch_limit --json number,title,url,files,author,baseRefName,headRefName)
  total_prs=$(jq length <<< "$all_open_prs")
}
```

By default `gh` only loads 30 open pull requests. For now, we have increased that limit to 100, later we will fix this by giving user the control on this value.

If you execute this above code we will get an output similar to this

```json
[
    {
      "author": {
        "login": "authorUsername"
      },
      "baseRefName": "somebranch",
      "files": [
        {
          "path": ".gitmodules",
          "additions": 2,
          "deletions": 2
        },
        ...
      ],
      "headRefName": "dev",
      "number": 300,
      "title": "my new feature",
      "url": "https://github.com/user/repo/pull/300"
    },
    ...
]
```

Notice we get all the files changed in a PR inside the `files` array. We can simply loop over all the elements of this JSON array to filter our `git_file`

```bash
find_files_prs(){
  for (( pri=0; pri<total_prs; pri++ )); do
      readarray -t changed_files < <(echo "$all_open_prs" | jq .["$pri"].files[].path)

      if [[ "${changed_files[*]}" =~ ${git_file} ]]; then
          pr_branch=$(jq -r .["$pri"].headRefName <<< "$all_open_prs")
          base_branch=$(jq -r .["$pri"].baseRefName <<< "$all_open_prs")

          printf "%s " "$(jq -r .["$pri"].title <<< "$all_open_prs") ($pr_branch ➜ $base_branch)"
          printf "%s\n" "by $(jq -r .["$pri"].author.login <<< "$all_open_prs")"
          printf "%s\n\n" "PR Link: $(jq -r .["$pri"].url <<< "$all_open_prs")"

          prs_count=$((prs_count+1))
      fi
  done
  
  if [[ $prs_count == 0 ]]; then
    printf "%s\n" "Oops!, No pull requests found that modify this file path"
  else
    printf "%s\n" "Found $prs_count open pull requests that modify $git_file"
  fi
}
```

A bunch of things are going on in this piece of code
1. We convert our JSON array of changed files path to a bash array `changed_files`.
2. We loop over each path to see if it matches the user-provided path or not.
3. We output any necessary info we need to, like PR link, base and target branches, and author username


Wait something's missing right 🤔? What about diffs? The `gh pr list` command doesn't provide the diff data, although we can use a different command `gh pr diff` to get diff for a particular PR

```bash
show_diff=0

get_diff() {
  if [[ $show_diff = 1 ]];then
    printf "%s\n" "Getting diff for PR #$2"
    # filepath with escaped slashes
    clean_filepath=${1//\//\\/}
    gh pr diff --color always "$2" | sed -n "/diff --git a\/$clean_filepath/d;/diff/q;p"
    printf "\n"
  fi
}
```

`show_diff` is gonna be a global flag that we are gonna control through script arguments. More on that later
Note that we need to show diff for only 1 file path, which the user provided. To do that we have used `sed` to get everything between the pattern `1,/diff --git a/<filepath>` and `diff` which marks the diff for the next file change.


It's time to put everything together. Let's add some driver code to execute our script correctly

```bash
while getopts "dl:" o; do
    case "${o}" in
        d)
            d=${OPTARG}
            if [[ "$d" == "" ]]; then
              show_diff=1
            fi
            ;;
        l)
            l=${OPTARG}
            ;;
        *)
            printf "%s\n" "You seem to be lost" && exit
            ;;
    esac
done

if [[ $l != "" ]];then
  pr_fetch_limit=$l
  printf "%s\n" "Using $pr_fetch_limit as PR fetch limit."
else
  printf "%s\n" "Using $pr_fetch_limit as default PR fetch limit. Pass the -l flag to modify it"
fi

fetch_prs
find_files_prs
```

## Demo & Source

The source is [**available here**](https://github.com/Bhupesh-V/.Varshney/blob/master/scripts/git/git-prs) if you want to reference or hack anything.
You can install the script

```bash
# make sure to move it somewhere in your path like /usr/local/bin
wget -q https://raw.githubusercontent.com/Bhupesh-V/.Varshney/master/scripts/git/git-prs && chmod +x git-prs
```

I took the liberty to beautify the output from our script. Here is how the finalized version looks like

<video width="100%" controls>
  <source src="https://user-images.githubusercontent.com/34342551/161429903-7bd4879e-3f82-4150-b966-5f75a37c0f82.mp4" type="video/mp4">
</video>


## Todos & Takeaways

There are a bunch of things that can take this script to the next level

1. We need to provide a permalink to the file change inside a PR, although its limited by Github's API.
2. Support for fetching closed/merged PRs as well using `gh pr list --state all` or better asking the user what they want.
3. Although we were able to parse out diff for a single file path, I believe it's a very nasty & error-prone way to do it and ideally, this feature should exist within `gh`. I have created an [**issue**](https://github.com/cli/cli/issues/5398) to track this, let's see where it goes.
