---
layout: post
comments: true
title: 10 key lessons from my first engineering job
tags: devlife career
---

## Background

I recently left my first ever software engineering job at [Backstage.Army](https://backstage.army), a nice product for all you creators out there. While I was there I encountered a bunch of new things about Product Engineering & working within a team in general, This issue lists down a brief version of what I learned. I hope this helps folks new to the industry, or anyone. Note that all of them were my learnings, and some lessons might only apply to startups.

## Lessons

### 1. Please Help!
Always, always! Ask for help if you feel stuck on something for too long, especially if you're at the early stages of your career. Depending upon your skill level, never waste too much time debugging one thing. Say if you can't figure out something in an hour and have tried all available options, contact someone in the team for help, discuss with them and figure out a solution.

### 2. Docs? What are they?
Write documentation for yourself. No one is going to do it for you. This can also help plan out a massive feature. Writing your thoughts has always helped me, even before I entered the professional world. This also proved right on at my job as well. 

Although I am a bit disappointed with the fact that even though almost everyone talks about the lack of docs in our ecosystem, practically nobody writes them (or wants to?). Especially senior folks who have been in the company for long enough and thus usually have a lot more context than anyone. This is not to blame anyone, but I believe as a long-term member of your team, it becomes part of the job to document things in case you are not available or decide to leave someday.
I believe the lack of docs is going to be a problem for startups at every level.

### 3. Product Thinking
In a product-based company, “Product thinking” is a pseudo for “User-Oriented thinking”. To build a product for users, you need to build empathy towards your target audience, how that issue affects their lives, and how your product can help improve their life.

### 4. Hunt for a mentor 👀
Pick a mentor inside your team if possible, doesn't matter if they work with the front-end or back-end extensively. Find someone who can answer your stupid questions.

This is not going to be an easy task, especially in small companies where folks are always busy, there is no guarantee that whoever you look up to will guide you always. Nevertheless, try to find someone you can communicate freely with.
Although, I think I failed at this, something to learn from. Let's see where it goes.

### 5. Work of art
If you don't value the work you do, you won't be able to become the best version of yourself. Figure out a way to make sure to put your heart into your work.

Now, of course I don't want to romanticize software engineering, but I believe our ecosystem has become more about art than science. Building stuff requires a constant balance of both things, make sure to steer accordingly when you find yourself off-road.

### 6. Being less stupid
Instead of being smart, try to make one less stupid decision every day. Mistakes are fine, you can't avoid them, but recovering & communicating about these mistakes is more important than the mistake itself.

### 7. Multiple Approaches

Always try to come up with multiple solutions after going through a ticket and then pick the solution that suits well in the feature/bug delivery time. 
Can you write a solution from scratch? Is the problem generic enough to add a dependency? Can the dependency be modified to make things work in a limited amount of time?

### 8. Keeping the team in the loop.

Always over-communicate (especially devs in early career) if you are in a remote environment. Always make sure that QA, Product, and the rest of the engineering team are in the same context, especially while estimating deadlines (lay all cards on the table). I believe this ideally becomes necessary for early-stage companies, where everyone is responsible for almost everything.

2 sub lessons that I encountered personally:

1. Never work on non-logged bugs. i.e, always report the bug through the company's bug reporting mechanism first (Jira, GitHub issues), only after that consult the product team to assign priority accordingly.
2. Don't rush to send a PR for a bug fix, sometimes you might solve it incorrectly or send dirty fixes. Involve the person who worked on this feature recently to validate your fix.


### 9. Product Job Mentality
There are a bunch of sub lessons on this, working for a Product Job is a fun but challenging job.

1. The mentality while working at a product-based company should NOT be to `write code; commit code`, You were hired to think, anyone can code. We are paid to THINK and not to be code monkeys, anyone can do that. Thinking's what cuts the plate.
2. Don't Start working unless the requirements are 100% understood, Brian talks about understanding requirements before doing anything in [Slow Down, Finish Faster](https://briandicroce.com/slow-down-finish-faster/)
3. Never work on a feature for more than 2 weeks without validating it with users.
4. Grooming is the start of the collaboration b/w engineering and product, not the end of it.

### 10. Code reviews
Code Reviews can take time, I mean a hell lot of time, especially if you have big PR (anything with more than 20-30 file changes). The usual advice is to break down the PRs into short reviewable ones. This might cause problems on your end. Maintaining different branches for a single feature can be daunting, but this is something you have to do while working in a team.

If your team is small, you can invite external code reviews with services like [pullrequest.com](https://pullrequest.com) as well. The ultimate goal is to ship code quickly which doesn't take much time to review.
