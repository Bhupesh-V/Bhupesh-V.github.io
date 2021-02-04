---
layout: post
comments: true
title: Embedding static files in Go
description: Learn how to embed or add static files in Golang binaries using the embed package
tags: go
---

Embedding static files in 2021 has become a bit easier since the release of [Go 1.16](https://golang.org/dl/#unstable). The new release comes with a new module `embed` which provides a handy set of interface and methods to attach static file in go binaries

Let's have a short look at how to use this.

First of all you will need Go 1.16

```bash
$ go get golang.org/dl/go1.16rc1
$ go1.16rc1 download
$ go1.16rc1 version
go version go1.16rc1
```

Now before we do that, let's create a project directory

```bash
$ tree
.
├── assets
│   └── report.html
├── sample.txt
└── static-demo.go

```

Our code will be in `static-demo.go`

Go provides us with 3 ways to embed content:

1. On type `string`
2. On type `byte`
3. On type `FS`

Let's explore each one of these one by one

```golang
package main

import (
	_ "embed"
	"fmt"
)

func main() {

    //go:embed sample.txt
    var s string
    fmt.Println(s)

}
```

To specify what variable holds our static file, go directive `//go:embed` is used followed by the name of file or a pattern to embed. Note that there must be no space between `//` and `go` because that is a regular one line comment in Go.

The **//go:embed** directive requires importing "embed", even when using a
string or []byte & since we are not referring to the `embed` module directly we are using a blank _ import.
In our code we are embedding a text file `sample.txt` here is what it contains

```
This is a sample file
with multiple lines

and 🐧️ emojis too!
```

Now lets execute our code to see if actually works

```bash
$ go run static-demo.go
This is a sample file
with multiple lines

and 🐧️ emojis too!

```

Ok that's pretty cool (dodge this Javascript!). Now lets see how to share some data to a text file

```golang

package main

import (
	"embed"
	"fmt"
	"html/template"
	"os"
)

func main() {
	//go:embed assets/*
	var assetData embed.FS
	t, err := template.ParseFS(assetData, "assets/report.html")
	if err != nil {
		fmt.Println(err)
	}
	templateData := struct {
		Title string
	}{
		Title: "File inside Go",
	}
	t.Execute(os.Stdout, templateData)
}

```

`embed.FS` enables us to embed a tree of static files i.e in our case the **assets** directory as dictated by the directive `//go:embed assets/*` which contains a file report.html with following contents

```html
<html>
  <head>
    <title>{% raw %}{{$.Title}}{% endraw %}</title>
  </head>
  <body>
    <h1>Go is cool af!</h1>
  </body>
</html>
```

Patterns in the go directive cannot contain ‘.’ or ‘..’ path elements nor begin with a leading slash. To match everything in the current directory, use ‘*’

> A FS (file system) in Go is a read-only collection of files, usually initialized with a //go:embed directive.

`template.ParseFS` takes a FS as first argument followed by a list of glob patterns, 

Running this prints out our title correctly inside the HTML template.

```bash
$ go run static-demo.go 
<html>
  <head>
    <title>File inside Go</title>
  </head>
  <body>
    <h1>Go is cool af!</h1>
  </body>
</html>

```

It worked!

Embedding files inside the binaries itself opens up emense out of opportunities that we would see as this feature gets stable 

