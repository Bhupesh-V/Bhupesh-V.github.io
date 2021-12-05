---
layout: post
comments: true
title: Why and How to add changelog in your next CLI
description: Using golang to embed and parse changelogs for your next CLI
tags: golang
---

Your CLI application might be good but its not great, you know what would be great. If it had release notes shipped with it. 
I mean seriously you have

- `--help` to look for help
- `--version` to check version
- `--update` possibly to update it

What's holding us back to add a `--changelog` as well?


## Why add changelogs?
A. Because its the only thing left in a CLI that qualify them as a "fully package piece of software".

B. You can save a bunch of time debugging what's wrong with a command just by reading the release notes.

<figure>
<a href="https://twitter.com/Dayvee87/status/1456355351922622467">
<img src="https://pbs.twimg.com/media/FDYDeYNX0AE3DKD?format=jpg&name=small" alt="just-read-release-notes"><br>
<figcaption align="center" style="color: #939393;">Source - @Dayvee87</figcaption>
</a>
</figure>

## How to?

Before we go into technicality of how to embed changelogs, Consider a sample `CHANGELOG.md` file like this which is usually included in all well maintained open-source projects.

```
# Changelog

All notable changes to this project will be documented in this file.

## [0.4] - Nov 11, 2019

### Added

- `getSubmissionDate()`, `getExitCode` new methods.
- Official Documentation.

### Changed

- Class Run `init` - Now you can pass _source code_, _input_ and _output_ to program as strings (limited to file paths in prior versions).


## [0.3] - Nov 9, 2019

### Added

- Removed redundant imports
- Added Module/Class docstrings for documentation
- Formatted Code


## [0.2] - Oct 31, 2019

### Changed

- Fix import requests problem.


## [0.1] - Oct 30, 2019
- Initial Release
```

This format is inspired from [keepachangelog](https://keepachangelog.com/en/1.0.0/). We will be using this format to build our changelog parser.
The following golang code can be used to extract the changelog for a requested version


```golang
package main

import (
	"fmt"
        _ "embed"
	"os"
	"regexp"
	"strings"
)

//go:embed CHANGELOG.md
var changelog string

func Parse(match string, rem string) string {
	// remove the enclosing pattern of previous release from end of output
	temp := strings.TrimSuffix(match, rem)
	return strings.Trim(temp, "\r\n")
}


func main() {
        // take care of special chars inside verison string
	enclosingPattern := `## \[`
	// prefixing verion number 0.6 with v won't work
	ver := "0.3"
	// Every header of new version looks like this: ## [1.4.0] - Jan 12, 2069
	// regexp.MustCompile(`(?s)## \[0.6.*?## \[`)
	var re = regexp.MustCompile(`(?s)` + enclosingPattern + ver + `.*?` + enclosingPattern)
        submatchall := re.FindAllString(changelog, 1)
	if len(submatchall) == 1 {
		fmt.Println(Parse(submatchall[0], "## ["))
	} else {
		fmt.Println("No release notes found for version", ver)
		os.Exit(0)
	}
}
```

The regexp can be broken down

```
(?s) + <enclosingPattern> + <version-number> + .* + </enclosingPattern>
```

- `(?s)` : Make the dot match all characters including line break characters
- `.*` : `.` (dot) indicates any character whereas `*` specifies 0 or more instances of previous token


Here is a sample output

```
## [0.3] - Nov 9, 2019

### Added

- Removed redundant imports
- Added Module/Class docstrings for documentation
- Formatted Code

```

## Shipping with the changelog

With go this is much easier since the release of Go 1.16, which has support for [embedding static files inside go binaries](https://bhupesh-v.github.io/embedding-static-files-in-golang/) 

In the above code notice the `//go:embed` directive which facilitates this. Go will include the file `CHANGELOG.md` in your current directory during build time.
> To learn more about embedding static files in Go use `go doc embed`

## Beautifying the output

We can also beautify our markdown output using [glamour](https://github.com/charmbracelet/glamour)

> Run `go get github.com/charmbracelet/glamour` to install glamour

Modify our code above

```golang

...
if len(submatchall) == 1 {
	cleanOutput := Parse(submatchall[0], "## [")
	out, _ := glamour.Render(cleanOutput, "dark")
	fmt.Print(out)
} else {
	fmt.Println("No release notes found for version", ver)
	os.Exit(0)
}
...
```

Here is how it looks


![demo-changelog-parser-glamour](https://ik.imagekit.io/bhupesh/blog_content_pics/demo-changelog-parser_BwiGGar7O.png?updatedAt=1638685940195)
