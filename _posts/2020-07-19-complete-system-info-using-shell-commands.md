---
layout: post
comments: true
title: Get complete system info using Shell Commands
description: Learn how to get system info like CPU temperature, memory intensive processes etc on your linux or ubuntu machine
tags: linux shell til
---

Below are a bunch of easy one-liner commands that gives information about various aspects of your Linux machine.


### Memory Used/Total

```shell
free -h | awk '/^Mem:/ {print $3 "/" $2}'
```

### Show CPU temperature

```shell
sensors | awk '/^Core*/ {print $1$2, $3}'
```

### Most Memory Intensive processes

```shell
ps axch -o cmd:15,%mem --sort=-%mem | head
```

### Most CPU Intensive processes

```shell
ps axch -o cmd:15,%cpu --sort=-%cpu | head
```

I [wrote a small shell script](https://github.com/Bhupesh-V/.Varshney/blob/master/scripts/sys) to get _(almost)_ real-time update of your system.

If you have any other ideas, drop them below 👇
