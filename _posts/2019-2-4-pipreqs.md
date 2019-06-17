---
layout: post
comments: true
title: pipreqs
description: Automatically generate python dependencies
tags: [pipreqs, python, python2, python3]
image: blog2.jpg
---

![blog2](https://raw.githubusercontent.com/Bhupesh-V/Bhupesh-V.github.io/master/images/blog2.jpg)

> *This blog was originally posted on [dev.to](https://dev.to/bhupesh/pipreqs-automatically-generate-python-dependencies-30nl)*

I recently found out this alternative method to automatically generate python dependencies for python project management. 
It generates **requirements.txt** file based on the modules & packages you import in your project.
Through this short tutorial I will give you a brief overview on how to use [pipreqs](https://pypi.org/project/pipreqs/).

## Installing pipreqs
Installation is pretty straight forward.

```
pip install pipreqs 
```

## Usage

To generate a requirements.txt file run.

```
pipreqs /<your_project_path>/
```

![pipreqs](https://drive.google.com/uc?export=view&id=1Lf1sJfl4qTdHuIJAilSyr7VUOgOYej6N)

You can verify that the **requirements.txt** appears in the same folder.

![pipreqs](https://drive.google.com/uc?export=view&id=1HzA9OSeJeWJ2A8maFyUj_wkdAYKEEq4L)

You can also list the requirements in command terminal itself by using
**--print** additional flag.


![pipreqs](https://drive.google.com/uc?export=view&id=1cslm9_LzUSyHVf0SFY9L1Wv3uNn-shQd)

Also for other options you can always run 

```
pipreqs --help
```

Here is the help screen

```python
Usage:
    pipreqs [options] <path>

Options:
    --use-local           Use ONLY local package info instead of querying PyPI
    --pypi-server <url>   Use custom PyPi server
    --proxy <url>         Use Proxy, parameter will be passed to requests library. You can also just set the
                          environments parameter in your terminal:
                          $ export HTTP_PROXY="http://10.10.1.10:3128"
                          $ export HTTPS_PROXY="https://10.10.1.10:1080"
    --debug               Print debug information
    --ignore <dirs>...    Ignore extra directories
    --encoding <charset>  Use encoding parameter for file open
    --savepath <file>     Save the list of requirements in the given file
    --print               Output the list of requirements in the standard output
    --force               Overwrite existing requirements.txt
    --diff <file>         Compare modules in requirements.txt to project imports.
    --clean <file>        Clean up requirements.txt by removing modules that are not imported in project.
```

## Why not use pip freeze ?

As the github [repo](https://github.com/bndr/pipreqs) of pipreqs says: <br>

1. **pip freeze** saves all packages in the environment including even those that you don't use in your current project.
2. Also **pip freeze** is harmful.<br>
Read the [following](https://medium.com/@tomagee/pip-freeze-requirements-txt-considered-harmful-f0bce66cf895) post to know more. 