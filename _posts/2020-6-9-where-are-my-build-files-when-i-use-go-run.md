---
layout: post
comments: true
title: Where are my build files when I use go run
description: Where are my build files when I use go run
tags: go til
---

By default, `go run` runs the compiled binary directly.
The binaries are stored in a `temp` work folder, to see where they are stored use the `-work` flag.


## Demo

```bash
go run --work fizzbuzz.go
```

Sample Output

```bash
WORK=/tmp/go-build645222420
[1 2 Fizz]
```

When you run this go will not delete the temporary build when exiting.
The default directory may vary with your system & `GOPATH`.