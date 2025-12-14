---
layout: page
title: Interviewing Bhupesh
description: Wanna interview me? I help you ask questions that matter!
permalink: /interview/
last_modified_at: 2025-12-14
---

I help you interview me better. Here's a list of questions that matter, with my answers, saving you the time to analyze how I think or preceive my work domain.

<!-- omit from toc -->
## Disclaimers

- This document is meant to be read by folks who take the final decision in hiring me & have an engineering background. i.e, Senior/Staff Devs, EMs, CTOs, Founders, etc. It would be great if you read this very early in the hiring process.
- This is a live document, i.e the responses will change with time. If this was shared to you by me, assume it's the latest version.

<!-- omit from toc -->
## Questions

- [What makes you who you are today?](#what-makes-you-who-you-are-today)
- [What's the best thing you've made without anybody asking?](#whats-the-best-thing-youve-made-without-anybody-asking)
- [What's the first thing you built? When and Why did you build it?](#whats-the-first-thing-you-built-when-and-why-did-you-build-it)
- [Can you build scalable systems or system design `INSERT_FAMOUS_LIVE_PRODUCT`?](#can-you-build-scalable-systems-or-system-design-insert_famous_live_product)
- [Do you prefer working on coding projects alone or with a team?](#do-you-prefer-working-on-coding-projects-alone-or-with-a-team)
- [What sets you apart from other applicants for `ABC` position?](#what-sets-you-apart-from-other-applicants-for-abc-position)
- [Do you know how to use `INSERT_DEVTOOL`?](#do-you-know-how-to-use-insert_devtool)
- [Do you know about `INSERT_PRACTICE` or `INSERT_PRINCIPLE`?](#do-you-know-about-insert_practice-or-insert_principle)
- [How does an ideal codebase look like?](#how-does-an-ideal-codebase-look-like)
- [How often do you contribute to Open-source?](#how-often-do-you-contribute-to-open-source)
  - [The world is a canvas](#the-world-is-a-canvas)
  - [The world is pragmatic](#the-world-is-pragmatic)
- [How good are you with Infra or DevOps?](#how-good-are-you-with-infra-or-devops)
- [Thoughts on AI-assisted programming?](#thoughts-on-ai-assisted-programming)
- [What are you working on right now?](#what-are-you-working-on-right-now)

### What makes you who you are today?

Reading & Writing, at least from a career POV. Both have had a huge impact on how I think and approach problems. I have been reading since I was a high-school kid, mostly fiction and non-fiction. I have been writing [since 2019](/archive/), mostly technical stuff.

> I have a dedicated digital bookshelf, head over to [bookshelf.bhupesh.me](https://bookshelf.bhupesh.me/) to see what I am reading at the moment & some of my personal recommendations.

<!-- ### Tell us about a really difficult technical problem you solved. What was it, and what did you build?

Really? I don't remember at all. -->

### What's the best thing you've made without anybody asking?

[**ugit**](https://github.com/bhupesh-v/ugit), well not exactly, people indeed [asked for it](https://bhupesh.me/undo-your-last-git-mistake-with-ugit/#story-behind-ugit). Till date its probably the most popular project I have made.

### What's the first thing you built? When and Why did you build it?

I think the first ever actual software I made was [**tutorialdb**](https://github.com/bhupesh-v/tutorialdb) in 2017. Back then, I described it as a search engine for programming tutorials. The main motivation behind this to stop asking questions like "Can you share resources to learn ABC".
Now that I look back at it, it wasn't a full-fledged search engine but more of a glorified link aggregator.

However, it did have indexing like capabilities, given a webpage URL it could detect whether it was a tutorial or not. It was built using Python and SQLite.

> To be fair, the first thing I ever built was a simple calculator using Visual Basic 6.0 during my school days.

### Can you build scalable systems or system design `INSERT_FAMOUS_LIVE_PRODUCT`?

No. "Scalable" for me means the "[Potential] Business" & "Team" is changing (in either direction), so we need to account for that in the engineering decisions we make. It's not an exercise to put a bunch of boxes and arrows on a whiteboard.

Let's talk about scalability once the product you work for is going through an exponential growth. However, I am eager to build _stable_ systems.

So no, I cannot design a system for a product that scales to million magical users a day. If you see me doing (or talk about) this, **don't trust me**.

### Do you prefer working on coding projects alone or with a team?

Both, both is good. I require alone time to be productive solo, and I need a team to get things done faster. I am very much open to brainstorming sessions, pair programming, etc.

### What sets you apart from other applicants for `ABC` position?

Nothing, honestly. I consider myself as an average human with average skills. I am not going to sit here gloat about things that can change your perspective. A lot of public stuff that I have, like my [blog](https://bhupesh.me/), [digital garden](https://til.bhupesh.me/), [github](https://github.com/bhupesh-V/) justifies my skills & knowledge. If you disagree, you are free to reject. At the end of the day, hiring humans is basically a trust exercise.

<!-- ### Talk to me, in a free form back & forth way about software development -->

### Do you know how to use `INSERT_DEVTOOL`?

Probably not, I use tools to the extent it helps me get the job done. As much us devs cherish our devtools, I believe that we create problems for ourselves with each new tool we add to our stack.

If the tool you are talking about is something that is absolutely necessary for the job (like shit will go down if this tool didn't exist), you can assume that I will learn to use it or adapt to it to a point where we can discuss it.

### Do you know about `INSERT_PRACTICE` or `INSERT_PRINCIPLE`?

I might have heard about it, but I am not sure. I am not a big fan of practices or principles, However I am always reading, so expect a generic answer about the practice or principle. My work gets influenced by an amalgamation of real world experiences:

- My failed attempts at introducing something new I learned at my workplace.
- Tools & Practices the team at my workplace collectively decides.
- Occasional FAFO (Fuck Around & Find Out) concepts.

### How does an ideal codebase look like?

1. Has unit-tests.
2. Has monitoring data exposed (memory/CPU usage).
3. Has tools in place to check for security vulnerabilities.
4. Automated/Low-effort linting in place.
5. Config files don't exceed 1000 lines (don't ask the backstory for this).
6. Documentation is handled right inside the codebase in forms of "Diagrams As Code" i.e, Sequence & ER diagrams are checked into VCS.
7. Makefiles (or related) setup to get ready with codebase in a new machine.

### How often do you contribute to Open-source?

Rarely, I need strong motivations to help upstream. I see the world of open-source through 2 lenses:

#### The world is a canvas

The code is made source available to the public by the author, they did that because they were _lost in a creative drive_ i.e., the code was used as a _way of communication_, and the finished project was/is a message to the world. The other necessities like writing thorough documentation, tests, fostering community contributions, etc. are secondary, and in the grand scheme of things, don't matter.

It's possible that **I may voluntarily contribute if I somehow agree with the author's (artist's) vision of the project, or I just couldn't see myself letting a certain project die**. In either case, **the choice is a personal one**, just as it was for the author.

#### The world is pragmatic

We are talking business. All crucial (big or small) dependencies, main-stream frameworks, and languages fit into this.

For this category, I am not going to spend any time contributing unless I have a strong motivation to do so, and that motivation is _responsibility_, **if you ask me, hey bhupesh we can't move forward unless we fix this upstream, I would be the first person to volunteer, I would put a ticket on the board & get to working**.

Learning is subjective, toiling through millions of lines of code from Kubernetes is not worth my time if I clearly don't see an end goal.

### How good are you with Infra or DevOps?

- Good enough to get the job done, given realistic contraints.
- Not good enough to do it quickly or efficiently enough in comparison to someone whose career has been in these domains.

### Thoughts on AI-assisted programming?

I have two schools of thought:

1. At a personal level:
   I came into this industry with a [hobbyist mindset](https://bhupesh.me/my-first-loop/). I enjoy the process more than the end result, so I don’t see programming as a chore. I love all parts of it, boring and exciting alike. That makes these tools largely redundant in my own programming process.
2. At a professional level:
   If a company can afford to pay for such tools, it should invest in them and share them with its engineers. Avoid micromanagement, and let the team figure out whether they can move faster with these tools or without them.

### What are you working on right now?

This is documented on my [now page](https://bhupesh.me/now/).

<!-- omit from toc -->
## More about me

- [Understand my remote work style](https://bhupesh.me/open-letter-remote-tech-worker/).
- [My contract/freelance work domains](https://bhupesh.me/hire/).
  