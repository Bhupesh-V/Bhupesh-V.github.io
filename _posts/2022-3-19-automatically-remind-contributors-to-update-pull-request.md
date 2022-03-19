---
layout: post
comments: true
title: Automatically remind contributors to update their pull requests
description: Automatically remind contributors to update their branches whenever there is a new commit in base branch
tags: github shell git
banner_image: https://user-images.githubusercontent.com/34342551/158306923-519008b8-16ab-4117-a597-2b678ebedabd.png

---

So from my short professional experience, I have realised that if you are working with a small team of individuals a lot of folks 
end-up authoring multiple pull-requests across X different repositories in an organisation which sometimes leads to managing multiple feature PRs at a time.

This can sometimes leads to author forgetting to update their branches and test their code with the most stable (or latest) version possible. Since a lifetime of a pull request can be anything from 1 day to 1 week, its important to keep your branches up to date. But we developers forget to do this timely.

This is not a problem of just small teams, opensource projects (be it small or big) usually have this problem as well.

## How to fix?
I went ahead and made a minimal github action to solve the above problem by reminding contributors to update their branches whenever base branch gets a new commit. We can do this by simply leaving a comment on pull requests (you can see a demo in the banner of this post)

[![Bhupesh-V/update-pr-reminder-action - GitHub](https://gh-card.dev/repos/Bhupesh-V/update-pr-reminder-action.svg?fullname=)](https://github.com/Bhupesh-V/update-pr-reminder-action)

Here is a simple workflow on how to setup this action


```yaml
name: PR Update Reminder
on:
  push:
    branches:
      - main
      - dev

env:
  # make sure to set this as env
  GITHUB_TOKEN: {% raw %} ${{ secrets.GITHUB_TOKEN }} {% endraw %}

jobs:
  remind_authors:
    runs-on: ubuntu-latest
    name: Update PR Reminder Test
    steps:
      - uses: actions/checkout@v2
      - uses: Bhupesh-V/update-pr-reminder-action@main
```

In the above workflow we are telling github to "watch" the `main` and `dev` branches of our repository for any new pushes and run the corressponding action.
So what' happening behind the scenes at *update-pr-reminder-action*?

We use a simple shell script combined with [github's CLI tool, `gh`](https://cli.github.com/) and some some shell wizadry ✨

```bash
#!/bin/bash

all_open_prs=$(gh pr list --base "${GITHUB_REF#refs/*/}" --json author,number)
printf "%s\n" "PRs with base ${GITHUB_REF#refs/*/}: $all_open_prs"
prs_count=$(echo "$all_open_prs" | jq length)
printf "%s\n" "There are currently $prs_count open PRs"

for (( c=0; c<$prs_count; c++ )); do
    pr_id=$(echo "$all_open_prs" | jq .["$c"].number)
    author=$(echo "$all_open_prs" | jq .["$c"].author.login | tr -d '"')
    printf "%s\n" "Author for PR $pr_id is $author"
    gh pr comment $pr_id --body "Hey @$author 👋🏽 friendly reminder to update your PR/branch because there was a recent commit ($(git rev-parse HEAD)) to the base branch"
done
```

The first thing we need to do is find the current branch, which is done by `${GITHUB_REF#refs/*/}` where `GITHUB_REF` is an [environment variable](https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables) which is set automatically in every github action

Next we find all the open PRs open using the `gh` tool

```bash
gh pr list --base main --json author,number
```

> Note: `gh` needs to authenticate before you can use it, we have already done this by setting the env `GITHUB_TOKEN`. [`gh` uses this token](https://cli.github.com/manual/gh_help_environment) to make any API requests

This will return a json output of all the open PRs like this

```
[
  {
    "author": {
      "login": "Bhupesh-V"
    },
    "number": 400
  },
  {
    "author": {
      "login": "some-dev"
    },
    "number": 402
  },
  ...
 ] 
```

To parse json, we are using `jq` here,

```bash
# get pull request id
basename "$(echo "$all_open_prs" | jq .["$c"].number)"
```


Creating a comment is easy,

```bash
gh pr comment $pr_id --body "Comment body"
```

If you see the comment body in our action, we are also referencing the latest commit to base branch using `git rev-parse HEAD`

```
Hey @$author 👋🏽 friendly reminder to update your PR/branch because there was a recent merge ($(git rev-parse HEAD)) to the base branch
```

## TODO
To reduce spam in case a pull request takes longer to get merged, we can also check if the branch is up to date by check if the base branches latest `HEAD` is present inside the authors PR

## Closing Thoughts

Ideally this feature should exist alongside [scheduled reminders](https://docs.github.com/en/organizations/organizing-members-into-teams/managing-scheduled-reminders-for-your-team) nonetheless I believe its a good enough solution for now.


## Resources

A bunch of resources that helped me write this workflow

- [Using Github CLI in workflows](https://docs.github.com/en/actions/using-workflows/using-github-cli-in-workflows)
- [`jq` cheatsheet](https://docs.github.com/en/actions/using-workflows/using-github-cli-in-workflows)


