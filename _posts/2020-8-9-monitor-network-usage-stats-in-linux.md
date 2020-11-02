---
layout: post
comments: true
title: Monitor network (data) usage in linux
description: Learn how to find network usage statistics of your linux machine by writing a shell script .
tags: linux shell til
---

The amount of data sent (uploaded) & received (downloaded) can be found out
using the following bash script.

```bash

netu() {
    # [net]work [u]sage: check network usage stats

    net_device=$(ip route | awk '/via/ {print $5}')
    TRANSMITTED=$(ifconfig "$net_device" | awk '/TX packets/ {print $6$7}')
    RECEIVED=$(ifconfig "$net_device" | awk '/RX packets/ {print $6$7}')

    printf "%s\n" "$(tput bold)🔼 TRANSMITTED $(tput sgr0): $TRANSMITTED"
    printf "%s\n" "$(tput bold)🔽 RECEIVED    $(tput sgr0): $RECEIVED"
}

```

- Only works per session, i.e stats are gathered once you power up your PC (or login) and are lost when you shutdown.
- Good to have if you have limited data availability & want to montior your data usage.

Let's just review on what utilities we used here.

## `ip`

Our first step is to find your default networking device (i.e the default networking interface) and its name. 

```bash
default via 192.168.42.129 dev enp0s20u4u1 proto dhcp metric 100 
169.254.0.0/16 dev enp0s20u4u1 scope link metric 1000 
192.168.42.0/24 dev enp0s20u4u1 proto kernel scope link src 192.168.42.149 metric 100
```

The first line of output lists our default network interface (the string followed by your PC name, mine is `dev`). The interface name will be different in your case.


## `ifconfig`

This is a good old tool used by network professionals to configure a network interface. `ifconfig $net_device` will display the status of our default net device.

```bash
$ ifconfig enp0s20u4u1
enp0s20u4u1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.42.149  netmask 255.255.255.0  broadcast 192.168.42.255
        inet6 fe80::d464:9bdb:2b16:b27  prefixlen 64  scopeid 0x20<link>
        inet6 2405:204:322e:53d:18ef:6496:fbb7:9309  prefixlen 64  scopeid 0x0<global>
        inet6 2405:204:322e:53d:93c3:cff8:8680:78bb  prefixlen 64  scopeid 0x0<global>
        ether 96:a3:91:8e:68:de  txqueuelen 1000  (Ethernet)
  -->   RX packets 19334  bytes 14292555 (14.2 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
  -->   TX packets 16514  bytes 3008589 (3.0 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

You see the `RX` and `TX` packets ? Yup thats our stats. Now we will use `awk` to extract those packet infos.

## `awk`

AWK is a pattern scanning language, generally used for data manipulation needs.

Now this is not a tutorial about awk but lets just understand our usecase here. A simple awk statement might look like this.

```bash
awk '/pattern/ { action }'
```

So in our case we want to look for _pattern_ which matches `TX packets`.

```bash
$ ifconfig enp0s20u4u1 |  awk '/TX packets/'
        TX packets 18554  bytes 3411366 (3.4 MB)
```

Meh, this doesn't look good. We want that human readable format `3.4MB`. One thing which excites me is that we can access/read each individual field (or word or record) in that line. Each word can then be printed using `print $<field-no>` (an [_action_](http://kirste.userpage.fu-berlin.de/chemnet/use/info/gawk/gawk_9.html#SEC87))


<figure align="center">
	<img alt="awk fields when using ifconfig command in linux" src="https://drive.google.com/uc?export=view&id=1Zx4J4VdcufOlCGEjClrG-vdFbmdYEBhj">
	<figcaption>I know the last two rows are f**ked up. Maybe its a bug ?</figcaption>
</figure>

Now we just print both the `$6` and `$7` fields.

```bash
$ ifconfig enp0s20u4u1 |  awk '/TX packets/ { print $6$7 }'
(5.7MB)
```

### Demo 🍲

![netu-monitor-network-data-usage](https://user-images.githubusercontent.com/34342551/97838566-75e6c780-1d06-11eb-86ae-6b3f562969a1.png)


And of-course you can `watch` this script to get a realtime feedback as well.

```bash
watch -ct -n0 netu.sh
```

> **Homework**: Figure out how to make this data persist.


If you have any other ideas, drop them below 👇

> Seems interesting?, [Subscribe 🚀](https://buttondown.email/bhupesh) to receive more such cool stuff or just connect with me on [![bhupesh-twitter-image](https://kutt.it/bhupeshimself)](https://twitter.com/bhupeshimself).

Also have you ever been a class montior in your school?, I was once in 9th grade :)
