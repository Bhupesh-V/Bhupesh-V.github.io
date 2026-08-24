---
layout: post
comments: true
title: Reflections from my visit to GopherCon India 2023
tags: devlife career
---

It's been a long time since I have sent you all something interesting to read. Unfortunately, I haven't been doing anything intriguing for the past few months 😅, but I recently got a chance to visit GopherCon India this year. GopherConIndia is the annual tech conference organized for the Go community in India. It was held on Sep 8-9th in Pune this year. Below is some stuff that I learned during the conference visit.

> Would like to thank my workplace, [Nurdsoft](https://nurdsoft.co/) for sponsoring my visit this year ❤️.

In this email, I wanted to share some intriguing talks and ideas I got to learn during the conference. I would encourage you to go through the whole [schedule](https://www.youtube.com/playlist?list=PLbgP71NCXCqEIgXsrPhkIZvEa3p1OdkBD) to find any other hidden gems.

1. [**Container Checkpoints with Go and CRIU**](https://www.youtube.com/watch?v=UGQgcIz9xGc&list=PLbgP71NCXCqEIgXsrPhkIZvEa3p1OdkBD&index=3) (by Prajwal S N - GSoC mentee).

    * Checkpoints are a way to save the state of a running process and restore it later.
    * CRIU is a tool that can be used to checkpoint and restore processes. It can also be used to checkpoint/restore containers.
    * CRIU is written in C and has a Go wrapper (that was the major point of the talk).
    * CRIU can be used to migrate containers from one host to another.
    * **Resources**:
        * [criu project](https://criu.org/Main_Page)
        * [docker checkpoint](https://docs.docker.com/engine/reference/commandline/checkpoint/)
        * [go-criu (go bindings for CRIU)](https://github.com/checkpoint-restore/go-criu)

2. **Hardening Go concurrency, using formal methods of verifying correctness** (by [Raghav Roy](https://twitter.com/TheOtherRaghav))

    * Formal Methods are a way to mathematically prove the correctness of a program.
    * TLA+ (Temporal Logic of Actions) can be used to describe, and test, each possible state of a distributed system.
    * TLA Specs should be made before writing code. Should be part of the software design process (not an afterthought to verify the correctness of a distributed code/system).
    * **Resources**:
        * [https://buttondown.email/hillelwayne/archive/](https://buttondown.email/hillelwayne/archive/)
        * [Learn TLA+](https://learntla.com/index.html#)
        * [TLA+ Foundation](https://foundation.tlapl.us)

3. **Designing a disk-based key-value store in Golang** (by [Karan Sharma](https://twitter.com/mrkaran_))

    * The author designed a disk-based key-value store by following the [bitcask paper](https://riak.com/assets/bitcask-intro.pdf).
    * The gist was that data was stored in a hash map where the keys were stored in main memory, the value for those keys contained a pointer to the actual location of data on the disk.

4. **Bugs light year away with fuzz** (by [Sagar Sonwane](https://twitter.com/sagarsonwane23))

    * Fuzzy Testing in Go is pretty new.
    * Fuzzing is a way to test your code by generating random inputs and checking if the code panics or not.
    * They help figure out edge cases in your code. That would have crept up in production sooner or later.
    * Why does it stand out in comparison to unit tests?
        * Developers, we are too lazy to write unit tests.
        * If we do end up writing tests, we are opinionated about what to test and what not to test. We would only cover tests for the happy path and might avoid edge cases. Fuzzing helps us find those edge case scenarios that would have during run-time.
    * **Resources**:
        * [Go Fuzzing Official Tutorial](https://go.dev/security/fuzz/)
        * [Bugs caught by fuzzing](https://github.com/golang/go/wiki/Fuzzing-trophy-case)

Hope you all got some things to learn, see you in the next one!