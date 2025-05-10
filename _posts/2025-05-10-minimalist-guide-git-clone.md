---
layout: post
comments: true
title: The minimalist's guide to cloning git repositories
description: A look at 10 different ways to clone a git repository by optimizing for size.
tags: git
---

Late last year, I launched [_osscooking.com_](https://osscooking.com) to provide real-time analysis of open-source projects on certain opinionated metrics. One of the first optimization techniques while doing on-demand git analysis is to have a copy of the repository locally. Waiting time with plain git clones can gradually increase as the repository size grows ultimately affecting the response time. The topic of cloning is simple, yet complex, so much so that companies like TikTok & Microsoft had to build [their own tools](#what-are-the-big-players-doing) to improve the git mono-repo experience with cloning being one of the key areas of focus.

For instance, the [obsproject](https://github.com/obsproject/obs-studio.git) repo is around **136MB** in size at the time of publishing this post and takes around _**~7**_ seconds to get it on my machine with a stable Internet speed of _~210Mbps_.

In this post, I will try to explore 10 different ways to clone a git repository with the goal of **analyzing git metadata**. For the sake of simplicity, I will be using the vanilla git CLI with no additional tools. There's a clear winner according to my acceptance criteria, however, it's important to understand that the best approach depends on the use case. For folks, who can't wait, please jump to the [conclusion](#conclusion). For the rest, let's dive in.

- [Acceptance Criteria](#acceptance-criteria)
- [Setup](#setup)
- [Single Branch Clone](#single-branch-clone)
- [Bare Clone](#bare-clone)
- [Shallow Clone (Limited Depth Clone)](#shallow-clone-limited-depth-clone)
- [Bare Blobless Clone (aka Partial Clone)](#bare-blobless-clone-aka-partial-clone)
  - [What is a blob?](#what-is-a-blob)
- [Bare Treeless Clone](#bare-treeless-clone)
  - [What is a tree?](#what-is-a-tree)
- [Combining Approaches](#combining-approaches)
  - [1. Bare + Blobless + Shallow](#1-bare--blobless--shallow)
  - [2. Bare + Blobless + Single branch](#2-bare--blobless--single-branch)
  - [3. Bare + Blobless + Single branch + Shallow](#3-bare--blobless--single-branch--shallow)
  - [4. Bare + Treeless + Single branch](#4-bare--treeless--single-branch)
  - [5. Bare + Treeless + Single branch + Shallow](#5-bare--treeless--single-branch--shallow)
- [What are the big players doing?](#what-are-the-big-players-doing)
  - [sparo](#sparo)
  - [scalar](#scalar)
- [Conclusion](#conclusion)
- [Resources](#resources)

## Acceptance Criteria

1. **Full commit history**
2. **Only fetch the main branch**
3. **Include Git tags**
4. **Exclude file contents (blobs)**

## Setup

- Git version: 2.47.1

## Single Branch Clone

```bash
git clone --single-branch
# Size: ~136M
```

**Requirements met?**

- [x] Full commit history
- [x] Only main branch
- [x] Access to git tags
- [ ] Exclude file contents

Now, I used the `--single-branch` flag under the assumption that pulling fewer branches would surely reduce the size of the cloned repository. However, the size of the repository is somehow a bit large than the plain clone?

The reason this happens is ordinary (plain) clones usually just download the server’s preexisting [packfile](https://git-scm.com/book/en/v2/Git-Internals-Packfiles)(s) (which tend to be delta-compressed against all branches/tags). But once you ask only for one branch, the server frequently has to repack on the fly for just that branch’s objects—which can yield a slightly bigger pack overall despite fetching fewer commits, simply because it loses the delta relationships with other branches or with the full set of objects.

## Bare Clone

A bare clone or as I would like to call it is a naked git repository.

```
git clone --bare https://github.com/obsproject/obs-studio.git
# Size: 84MB
```

Git documentation defines a bare repository as:

> A bare repository is normally an appropriately named directory with a `.git` suffix that does not have a locally checked-out copy of any of the files under revision control. That is, all of the Git administrative and control files that would normally be present in the hidden `.git` sub-directory are directly present in the `repository.git` directory instead, and no other files are present and checked out. Usually, publishers of public repositories make bare repositories available.

**Requirements met?**

- [x] Full commit history
- [ ] Only main branch
- [x] Access to git tags
- [x] Exclude file contents

<!-- Mention the archive tip

> git clone --bare https://github.com/user/repo.git repo.git
> git --git-dir=repo.git archive --remote=repo.git main src | tar -x -->

## Shallow Clone (Limited Depth Clone)

A shallow clone is a way to clone a Git repository with limited commit history. Instead of pulling the entire project’s lifetime of commits, you only grab the most recent ones, usually just the latest one.

```bash
git clone https://github.com/obsproject/obs-studio.git --depth=1
# Size: 66 MB
```

Similarly, `--depth=4` will fetch the last 4 commits.

> Create a shallow clone with a history truncated to the specified number of commits. Implies --single-branch unless `--no-single-branch` is given to fetch the histories near the tips of all branches.

**Requirements met?**

- [ ] Full commit history (No access to git history beyond the depth specified.)
- [x] Only main branch
- [ ] Access to git tags
- [ ] Exclude file contents

Shallow clones can be an ideal approach to clone a repo for ephemeral purposes, like CI/CD pipelines, or to quickly build the latest code images.

## Bare Blobless Clone (aka Partial Clone)

### What is a blob?

For a git refresher, a blob is a git object that stores the content of a file. Blobs are stored in the `.git/objects` directory. If you were to clone the source of this blog, and run the following command, you would see the content of the file in the blob represented by the hash, `0015c5c42b1eeb1590fdb1a487a560b47cbd2975`.

```
git cat-file -p 0015c5c42b1eeb1590fdb1a487a560b47cbd2975
---
layout: page
title: Work with Bhupesh
description: Interested to work with me professionally? I can assist you as a Software Developer, Technical Writer, or Dev Community Builder. Find out more about my work domains and how I can help you.
image: hire.png
permalink: /hire/
---

![hire-bhupesh]({{ site.baseurl }}/images/hire.png)
.....
```

Anywho, As mentioned earlier, the goal is to clone the repository without the blobs.

```
git clone --bare --filter=blob:none https://github.com/obsproject/obs-studio.git
# Size: 15MB
```

**Requirements met?**

- [x] Full commit history
- [ ] Only main branch
- [x] Access to git tags
- [x] Exclude file contents

## Bare Treeless Clone

### What is a tree?

A tree is a git object that represents the directory structure of the repository. Trees are simply directories.

```
git clone --bare --filter=tree:0 https://github.com/obsproject/obs-studio.git
# Size: 5.4 MB
```

**Requirements met?**

- [x] Full commit history (Fetching `git log` with this approach increases the final size of the repository, i.e. giving access to the full commit history)
- [ ] Only main branch
- [x] Access to git tags
- [x] Exclude file contents

## Combining Approaches

### 1. Bare + Blobless + Shallow

```
git clone --bare --filter=blob:none --depth=1 https://github.com/obsproject/obs-studio.git
# Size: 272K
```

**Requirements met?**

- [ ] Full commit history
- [x] Only main branch
- [ ] Access to git tags
- [x] Exclude file contents

### 2. Bare + Blobless + Single branch

```
git clone --bare --filter=blob:none --single-branch https://github.com/obsproject/obs-studio.git
# Size: 15MB
```

**Requirements met?**

- [x] Full commit history
- [x] Only main branch
- [x] Access to git tags
- [x] Exclude file contents

### 3. Bare + Blobless + Single branch + Shallow

```
git clone --bare --filter=blob:none --single-branch --depth=1 https://github.com/obsproject/obs-studio.git
# Size: 272K
```

**Requirements met?**

- [ ] Full commit history (only latest commit)
- [x] Only main branch
- [ ] Access to git tags
- [x] Exclude file contents

### 4. Bare + Treeless + Single branch

```
git clone --bare --filter=tree:0 --single-branch https://github.com/obsproject/obs-studio.git
# Size: 6.6MB
```

**Requirements met?**

- [ ] Full commit history (Fetching the git log with this approach increases the final size of the repository)
- [x] Only main branch
- [x] Access to git tags
- [x] Exclude file contents

### 5. Bare + Treeless + Single branch + Shallow

```
git clone --bare --filter=tree:0 --single-branch --depth=1 https://github.com/obsproject/obs-studio.git
# Size: 104K
```

**Requirements met?**

- [ ] Full commit history (only latest commit)
- [x] Only main branch
- [ ] Access to git tags
- [x] Exclude file contents

## What are the big players doing?

I spent some time poking around TikTok's [sparo](https://tiktok.github.io/sparo/) & Microsoft's [scalar](https://github.com/microsoft/scalar) (both of which are wrappers over the Git CLI btw), here's what I found:

### sparo

sparo uses the following combinations:

- blobless clone is a **blobless** + **sparse** + **single branch clone**.
- treeless clone is a **treeless** + **sparse** + **single branch clone**.

At the time of publishing this post, the git clone service is available in [`GitCloneService.ts`](https://github.com/tiktok/sparo/blob/main/apps/sparo-lib/src/services/GitCloneService.ts).

### scalar

scalar which is now part of [Microsoft's fork of git](https://github.com/microsoft/git/blob/vfs-2.47.1/contrib/scalar/docs/philosophy.md), uses a similar approach to sparo. The scalar documentation mentions that the fork is needed to support the following features that stand out:

1. Use Git's partial clone feature to only download the files you need for your current checkout.
2. Use Git's [sparse-checkout](https://git-scm.com/docs/git-sparse-checkout) feature to minimize the number of files required in your working directory.

<!-- https://github.com/microsoft/git?tab=readme-ov-file#why-is-this-fork-needed -->

## Conclusion

Here's each approach, ranked by the size of the cloned repository:

| Approach                                 | Size    | Full Commit History | Access to Tags | Only Main Branch | Excludes File Contents | ✅ Meets All Criteria | Use Case                                                                 |
|------------------------------------------|---------|----------------------|----------------|------------------|------------------------|-----------------------|--------------------------------------------------------------------------|
| Single Branch Clone                      | 135MB   | ✅                   | ✅             | ✅               | ❌                     | ❌                    | Minimal default clone for builds where blobs are needed.                |
| Bare Clone                               | 84MB    | ✅                   | ✅             | ❌               | ✅                     | ❌                    | Used for mirrors or server-side setups without working trees.           |
| Shallow Clone (`--depth=1`)              | 66MB    | ❌                   | ❌             | ✅               | ❌                     | ❌                    | Fast and ephemeral; ideal for CI and latest-commit builds.              |
| Bare Blobless Clone                      | 15MB    | ✅                   | ✅             | ❌               | ✅                     | ❌                    | Ideal for analyzing commit and tag metadata, not for file contents.     |
| Bare Treeless Clone                      | 5.4MB   | ✅                   | ✅             | ❌               | ✅                     | ❌                    | Extremely lightweight; needs fetch for log/history.                     |
| Blobless + Shallow                       | 272KB   | ❌                   | ❌             | ✅               | ✅                     | ❌                    | Lowest size; just HEAD + shallow metadata.                              |
| Blobless + Single Branch                 | 15MB    | ✅                   | ✅             | ✅               | ✅                     | ✅ Best Option        | Best for git metadata analysis; matches **all** acceptance criteria.  |
| Blobless + Single Branch + Shallow       | 272KB   | ❌                   | ❌             | ✅               | ✅                     | ❌                    | Variant of best-case option but with limited history.                   |
| Treeless + Single Branch                 | 6.6MB   | ❌                   | ✅             | ✅               | ✅                     | ❌                    | Useful for resolving refs/tags; no log access until fetch.              |
| Treeless + Single Branch + Shallow       | 104KB   | ❌                   | ❌             | ✅               | ✅                     | ❌                    | Ultra-light for pointer-level analysis or HEAD-only introspection.      |

The source code for running a similar cloning test can be found [here](https://github.com/Bhupesh-V/pocs/tree/main/git/clone-variations). Here's a sample run:

```
Using branch: master
Cloning into bare repository 'clones/blobless-shallow'...
Cloning into bare repository 'clones/treeless-single-branch'...
Cloning into bare repository 'clones/bare-treeless'...
Cloning into bare repository 'clones/bare-blobless-single-branch-shallow'...
Cloning into bare repository 'clones/bare-treeless-single-branch-shallow'...
Cloning into 'clones/shallow'...
Updating files: 100% (5014/5014), done.
Cloning into bare repository 'clones/blobless-single-branch'...
Cloning into bare repository 'clones/bare-blobless'...
Cloning into 'clones/single-branch'...
Cloning into bare repository 'clones/bare'...
Cloning into 'clones/plain'...

Results:

104K    clones/bare-treeless-single-branch-shallow
272K    clones/bare-blobless-single-branch-shallow
272K    clones/blobless-shallow
5.9M    clones/bare-treeless
5.9M    clones/treeless-single-branch
 14M    clones/bare-blobless
 14M    clones/blobless-single-branch
 66M    clones/shallow
 84M    clones/bare
134M    clones/plain
135M    clones/single-branch
```

According to our [acceptance criteria](#acceptance-criteria), the winner is the **Bare + Treeless** approach, I ended up rolling it out on [`osscooking.com`](https://osscooking.com). The migration was beneficial as it reduced the repo lookup response time by seconds on the current production deployment.

![blobless](https://bhupesh.me/images/blobless.png)

<br>

![treeless](https://bhupesh.me/images/treeless.png)

## Resources

- [Get up to speed with partial clone and shallow clone](https://github.blog/open-source/git/get-up-to-speed-with-partial-clone-and-shallow-clone/)
- [git glossary](https://git-scm.com/docs/gitglossary/2.39.0#Documentation/gitglossary.txt)
