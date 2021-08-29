---
layout: post
comments: true
title: Converting video to high-quality gif using ffmpeg
description: A quick guide on how to create high-quality GIFs using ffmpeg. Learn how to convert videos using ffmpeg and ffprobe
tags: shell
---

Converting videos to GIFs using ffmpeg is a pain in the ass if you don't know what's happening.
GIF size getting 10x the size of original video ? Don't worry, I got you!

Below are few points that can help:

1. Always create a custom palette
2. Don't increase/decrease file dimensions
3. Save unnecessary frame conversion by skipping timeframes (using `-t`).
4. Experiment with `fps` (default value is 24)

```bash
# Get video dimensions
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 video.mp4
# generate a palette
ffmpeg -i video.mp4 -vf "fps=22,scale=1024:-1:flags=lanczos,palettegen" palette.png
# use the generated palette
ffmpeg -t 29 -i video.mp4 -i palette.png -filter_complex "fps=22,scale=1024:-1:flags=lanczos[x];[x][1:v]paletteuse" output.gif
```

A more generic version in a simple bash script

```bash

#!/usr/bin/env bash

# Utility to convert video files to GIFs using ffmpeg
#
# Usage: convert-to-gif.sh <video-file-path>
# To skip frames: convert-to-gif.sh <video-file-path> <time-in-seconds>
# Example:
# convert-to-gif.sh video.mp4 28


if [[ -z "$1" ]]; then
    echo "No video file specified"
    exit 1
fi

# get everything after last /
video=${1##*/}
# remove everything after .
filename=${video%.*}

echo -e "$(tput bold)Getting video dimensions $(tput sgr0)"
# Get video dimensions
dimensions=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$1")

echo -e "$(tput bold)Generating Palette $(tput sgr0)"
# Generate palette
ffmpeg -i "$1" -vf "fps=22,scale=${dimensions%x*}:-1:flags=lanczos,palettegen" "$filename".png

echo -e "$(tput bold)Converting Video to GIF $(tput sgr0)"

if [[ "$2" ]]; then
    ffmpeg -t "$2" -i "$1" -i "$filename".png -filter_complex "fps=22,scale=${dimensions%x*}:-1:flags=lanczos[x];[x][1:v]paletteuse" "$filename".gif
else
    ffmpeg -i "$1" -i "$filename".png -filter_complex "fps=22,scale=${dimensions%x*}:-1:flags=lanczos[x];[x][1:v]paletteuse" "$filename".gif
fi

echo -e "Removing palette"
rm "$filename".png

```

[**🔽️ Download complete script**](https://github.com/Bhupesh-V/.Varshney/blob/master/scripts/gif)

## Resources

- [High quality GIF from video](https://d12frosted.io/posts/2018-10-13-gifify.html)
