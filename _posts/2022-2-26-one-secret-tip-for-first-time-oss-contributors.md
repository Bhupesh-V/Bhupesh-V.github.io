---
layout: post
comments: true
title: One secret tip for first-time OSS contributors. Shh! 🤫 don't tell anyone else
tags: opensource career
---

I see a lot of folks wandering over the internet asking how to contribute to open-source,
To my disappointment none of the articles, I have read mention what actionable steps should be taken to make your first-time contrib.

Although I see people giving one generic advice like, _"choose a package you already work with and contribute there"_, this still doesn't solve your problem because you might be using packages that are too big, working with these big projects can be sort of overwhelming. 
So to make it easier I am gonna share one secret cheat trick with you that is everlasting

## Secret  🤫

Ready? here it is ...

### "_solve static analyzer issues_"

Yes! I am serious here, Every language you work with nowadays has support for tools that do static analysis of code and point out issues. Helping fix these issues is a task everyone sort of ignores or forgets because building features and resolving bugs is much more good (and important to be honest).

But to have a "head start" in the game, trust me fixing these minor things still counts as a valuable OSS contribution.
Moreover, working on these "code quality cleanup" issues is better than "fixing typos" or waiting around for a "good-first-issue" to open up, right?


## Cool, you have my attention but how?

Any good OSS project also has a bunch of these tools already set up.

- Go ecosystem has [Go Report Card](https://goreportcard.com/)
- Projects based on shell scripting can use [shellcheck](https://github.com/koalaman/shellcheck)
- Python has a bunch of tools like [black](https://github.com/psf/black), [pylint](https://github.com/PyCQA/pylint/), [flake8](https://github.com/PyCQA/flake8).
- Javascript has [ESLint](https://eslint.org/)
- Tools like [deepsource](https://deepsource.io/) has support for finding security related issue for different language stack (which is again just building and finding patterns via static analysis of code)
- Another tool is [CodeQL](https://codeql.github.com/) that detects security issues and gives a grade to the project

Here is a demo run of [lgtm](https://lgtm.com/) on [pachyderm](https://github.com/pachyderm/pachyderm)

<img align="center" width="700" alt="lgtm.com demo for a project" src="https://user-images.githubusercontent.com/34342551/155185620-3bd85c9e-66ea-46eb-b5ed-1ce35b4e5ea0.png">


Run and use these tools over the project you like to contribute to, the probability is there are going to be a bunch of issues reported.

- 📝 Pick the ones that are more common in frequency, 
- ⚠️ report these issues to the project,
- 👀 wait for the maintainers to acknowledge it
- 🙌🏻 ask to assign the issue to yourself

> Filter out issues that can have a positive impact on code quality, say for e.g replacing single quotes with double quotes is not a good issue in comparison to fixing potential unused variables.

If everything works out as expected, congrats! you just took a shortcut to FOSS contribution by opening an issue for yourself, now all you need to do is fix these errors which by now you have already researched about.

Although do note that using these tools can be sort of a hit-trial approach in finding analyzer warnings that matter. I will say don't misuse this trick for contributions by spamming the repo with them, play the game right

So what are you waiting for, surf GitHub and send that PR right now!!