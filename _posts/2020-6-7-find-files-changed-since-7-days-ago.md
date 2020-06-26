---
layout: post
comments: true
title: Find files changed since 7 days ago
description: Find files changed 7 days ago
tags: linux shell tips
---


To find last modified file
```bash
find Documents/ -mtime -1
```
where `mtime` means "Last Modification Time"

To find files Accessed (read operation)
```bash
find Documents/ -atime -7
```
where `atime` means "Last Access Time"

**-7** signifies anything changed 7 days or less.
**+7** signifies anything changed atleast 7 days ago.
**7** signifies anything changed exactly 7 days ago.

an alternative version

```bash
find Documents/ -newermt "7 days ago" -ls
```