---
layout: post
comments: true
title: Copy one file to multiple files using Bash
description: Copy one file to multiple files using Bash
tags: linux shell tips
---

To copy one file contents to multiple files, simply use this

```bash
for f in file{1..10}.py; do cp main.py $f; done
```

> this will create new files file_1.py, file_2.py etc and copy contents of _main.py_ file to all of them.