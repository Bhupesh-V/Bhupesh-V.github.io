---
layout: post
comments: true
title: Prettifying JSON using Vim, Python & Bash 
description: Combining the power of Bash, Python and Vim to prettify JSON files without any external plugins
tags: python bash
---


So I recently switched my editor to Vim (last month to be exact), I will probably post my experience sometime later on. If you are interested I am documenting my vim journey (or cheatsheet) [**here**](https://github.com/Bhupesh-V/til/blob/master/Miscellaneous/my-vim-cheatsheet.md).

Let me show you how to combine 3 most powerful tools I use in my daily workflow to achieve this. Note that this post is only for users who are on *nix environments because they probably have Bash, Python & Vim installed anyways.

So the heavy lifting is done by Python's json CLI tool

```bash
$ python3 -m json.tool ugly.json
```

This will print the JSON files in a nice readable format, you can also sort key using the `--sort-keys` argument

Ok then that's settled we now just need to redirect the output to the same file.
Let's write a small bash function to make this portable. Open your `.bashrc` or `.bash_functions` & put this bad boy in!

```bash
pj() {
    # prettify json using python3
    if [[ -z "$1" ]]; then
        echo "No file path"
        exit 1
    fi
    pretty_json=$(python3 -m json.tool "$1") && echo "$pretty_json" > "$1"
}
```

Cool now you can just do `pj ugly.json` to do the work.

If you had like an in-editor solution, all you need to do is add this in your `vimrc` or `init.vim`

```vim
:command Pretty !pj %:p
```

This will create a Vim `Ex` command called Pretty which invokes our external bash function. `%:p` gives us the full path of the file in buffer.

That's it, Everything is Sexy now. Invoke the `:Pretty` command on your current buffer & `pj` will do its job.

<video width="100%" controls style="margin-top: 12px">
  <source src="https://user-images.githubusercontent.com/34342551/102857778-0c09b500-444f-11eb-9028-69dca7627ce5.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

> Always know your tools. Master the fuck outta them!

What's the use if I have a plugin?

Well I love plugins too but I know this is a very simple thing to do & can be easily achieved using things I already know, so why install an external plugin?

Wait Wait not everything is lilies and roses. This might not be very efficient for large JSON files. Let me know if the reader finds a better way to do it.

