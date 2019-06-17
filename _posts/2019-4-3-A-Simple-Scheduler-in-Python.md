---
layout: post
comments: true
title: A Simple Scheduler in Python
description: Making a scheduler in python
tags: [python, python2, python3]
image: blog4.png
---

![blog4](https://raw.githubusercontent.com/Bhupesh-V/Bhupesh-V.github.io/master/images/blog4.png)


We all encounter things in life which we want to automate, Setting up reminders and schedules are one of them  
Python makes it easy for all the developers out there to make small python scripts that can schedule some boring stuff for you.  
  
![](https://media.giphy.com/media/6kvVGhp7bp2WA/giphy.gif)  
  
Here comes this #awesome library called **schedule**  
(quite a name it got there :wink:)  
  
Let's start around by playing with this  
  
![](https://media.giphy.com/media/zf8yrM8nVERvW/giphy.gif)  
  
## Installation  
First things first let us install the python package first  
  
```python
pip install schedule  
```
  
## Introduction  
[*schedule*](https://pypi.org/project/schedule/) is an in-process scheduler for periodic jobs that uses the builder pattern for configuration. Schedule lets you run Python functions (or any other callable) periodically at predetermined intervals using a simple, human-friendly syntax.  
  
> Python job scheduling for humans.  
  
Let's not worry about what [in-process scheduling](https://en.wikipedia.org/wiki/Scheduling_(computing)) is for now  
Let's write some code  
  
```python  
import schedule  
  
def job():  
    print("A Simple Python Scheduler.")  
  
# run the function job() every 2 seconds  
schedule.every(2).seconds.do(job)  
  
while True:  
    schedule.run_pending()  
```

The above code prints `A Simple Python Scheduler.` every 2 seconds.  
  
  
![scheduler](https://drive.google.com/uc?export=view&id=1g84A87coi30klXJXPav_7-34nWppEeBu)  
  
Let's understand line by line  
  
- **`import schedule`**
This needs no explaining just importing the package to use.


-  **`def job()`**
This is the function which we want to execute according to our schedule.

  
- **`schedule.every(2).seconds.do(job)`**
This is where magic happens  
A job is created and returned by [Scheduler.every()](https://schedule.readthedocs.io/en/stable/api.html#schedule.Scheduler.every) method, which also defines its interval (in *time units*) here the interval is in seconds*.  
The [do()](https://schedule.readthedocs.io/en/stable/api.html#schedule.Job.do) specifies the job_func that should be called every time the job runs.  
Any additional arguments are passed on to job_func when the job runs.  
*i.e* the statement 
`schedule.every(2).seconds.do(job(argument))` would give an error 
instead use  
`schedule.every(2).seconds.do(job, arg1, arg2)`



- **`schedule.run_pending()`**
The run_pending() just runs all jobs that are scheduled to run. 
Make sure to run it in a loop because so that the scheduling task keeps on running all time.

Hurray we wrote our very first Scheduler using Python
![hurray](https://media.giphy.com/media/xjUlxQHkMBqSvLeSTy/giphy.gif)

## Other Variations
```python
import schedule
import time

def job():
    print("I'm working...")

def job2():
    print("yo boiss..")

def job3():
    print("Hello")
    
schedule.every(5).seconds.do(job)
# some other variations 
schedule.every().hour.do(job)
schedule.every().day.at("12:25").do(job)
schedule.every(5).to(10).minutes.do(job)
schedule.every().thursday.at("19:15").do(job)
schedule.every().wednesday.at("13:15").do(job)
schedule.every().minute.at(":17").do(job)
schedule.every(2).seconds.do(job2)

while True:
    schedule.run_pending()
    time.sleep(1)
```

 Above are some other ways through which we can schedule jobs
 - **`schedule.every().hour.do(job)`**

    This executes the `job()` function every hour
 - **`schedule.every().day.at("12:25").do(job)`**

    This executes the `job()` function every day at 12:25 PM 
    By default schedule uses 24 hr format.
 - **`schedule.every().wednesday.at("13:15").do(job)`**

    Do `job()` every Wednesday at 1:15 PM. 
    You can also specify day-names to run a particular job.
    See the [list](https://schedule.readthedocs.io/en/stable/api.html#schedule.Job.second) of available ones. 
 - **`schedule.every(2).to(5).minutes.do(job3)`**

    This one executes `job3()` every 2 to 5 minutes ;)

## Bonus Stuff

![yeahh](https://media.giphy.com/media/3o84UaGEtyayvBIFwc/giphy.gif)

So now you are able to schedule things 
What if you could remind yourself of some items to do ??

`smtplib` comes to the rescue.
 
Using `smtplib` you can send emails (emails will come in the spam folder though 🙃)

Here is a simple script to send emails using python 

```python
import smtplib
  
server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login("youremail", "yourpassword")
  
msg = "FIRST EMAIL USING PYTHON!"
server.sendmail("youremail", "email-of-receiver", msg)
server.quit()
print("Email Sent")
```

Now go check your spam folder 😜

I hope you liked this post :smile:
