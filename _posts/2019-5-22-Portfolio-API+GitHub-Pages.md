---
layout: post
comments: true
title: Portfolio API + GitHub Pages
description: Make a REST API for your portfolio and host it on GitHub Pages
tags: [github, rest, api, portfolio]
image: blog6.png
---

![blog6](https://raw.githubusercontent.com/Bhupesh-V/Bhupesh-V.github.io/master/images/blog6.png)

> *This blog was originally posted on [dev.to](dev.to/bhupesh/portfolio-api-github-pages-21ag)*

## Portfolio API + GitHub Pages = 🔥

So I accidentally figured out that we can return JSON response instead of the standard HTML when we access a GitHub Pages site.

I really liked the business card concept by [Tierney Cyren](https://dev.to/bnb)
See the post [here](https://dev.to/wuz/setting-up-a-npx-username-card-1pip)

So I thought instead of creating a user card why not do some *dev* fun 😉 and create a REST API about me.

For example, if you do
```bash
curl bhupeshv.me/me/
```
Gives the following result on the terminal
```bash
{
    "Name 😎":"Bhupesh Varshney",
    "Bio 🤗":"OpenSource Lover, Blogger & CodePervert",
    "Website 🖱":"https://bhupeshv.me/",
    "Github 💻":"https://github.com/Bhupesh-V",
    "DEV 🦄":"https://dev.to/bhupesh",
    "Twitter 🐦":"https://twitter.com/codepervert",
    "LinkedIn 📎":"https://www.linkedin.com/in/bhupesh-v/",
    "blogs":{
        "blog5":{
            "name":"30 Seconds of C++",
            "link":"https://bhupeshv.me/30-Seconds-of-C++/"
        },
        "blog4":{
            "name":"A Simple Scheduler in Python",
            "link":"https://bhupeshv.me/A-Simple-Scheduler-in-Python/"
        },
        "blog3":{
            "name":"Exceptions in C++",
            "link":"https://bhupeshv.me/Exceptions-in-C++/"
        },
        "blog2":{
            "name":"pipreqs - Automatically generate python dependencies",
            "link":"https://bhupeshv.me/pipreqs/"
        },
        "blog1":{
            "name":"My dev life has just started 😎👩‍💻",
            "link":"https://bhupeshv.me/My-dev-life-has-just-started/"
        }
    }
}
```

You can also test it on [apitester](https://apitester.com/) and see that it indeed returns a JSON response, behaving like a normal REST API.
Here is another demo using [HTTPie](https://httpie.org/).
Do
```bash
http GET bhupeshv.me/me/
```

```bash
HTTP/1.1 200 OK
Accept-Ranges: bytes
Access-Control-Allow-Origin: *
Age: 0
Cache-Control: max-age=600
Connection: keep-alive
Content-Length: 1267
Content-Type: application/json; charset=utf-8
Date: Tue, 21 May 2019 06:37:05 GMT
ETag: "5ce3999b-4f3"
Expires: Tue, 21 May 2019 06:35:10 GMT
Last-Modified: Tue, 21 May 2019 06:24:27 GMT
Server: GitHub.com
Vary: Accept-Encoding
Via: 1.1 varnish
X-Cache: MISS
X-Cache-Hits: 0
X-Fastly-Request-ID: e19833ea471f930d8ef9cfb2574ab539530b7df7
X-GitHub-Request-Id: C806:4F97:95A48F:C36F69:5CE399C6
X-Served-By: cache-bom18223-BOM
X-Timer: S1558420625.037150,VS0,VE256

{
    "Bio 🤗": "OpenSource Lover, Blogger & CodePervert",
    "DEV 🦄": "https://dev.to/bhupesh",
    "Github 💻": "https://github.com/Bhupesh-V",
    "LinkedIn 📎": "https://www.linkedin.com/in/bhupesh-v/",
    "Name 😎": "Bhupesh Varshney",
    "Twitter 🐦": "https://twitter.com/codepervert",
    "Website 🖱": "https://bhupeshv.me/",
    "blogs": {
        "blog1": {
            "link": "https://bhupeshv.me/My-dev-life-has-just-started/",
            "name": "My dev life has just started 😎👩‍💻"
        },
        "blog2": {
            "link": "https://bhupeshv.me/pipreqs/",
            "name": "pipreqs - Automatically generate python dependencies"
        },
        "blog3": {
            "link": "https://bhupeshv.me/Exceptions-in-C++/",
            "name": "Exceptions in C++"
        },
        "blog4": {
            "link": "https://bhupeshv.me/A-Simple-Scheduler-in-Python/",
            "name": "A Simple Scheduler in Python"
        },
        "blog5": {
            "link": "https://bhupeshv.me/30-Seconds-of-C++/",
            "name": "30 Seconds of C++"
        }
    }
}
```

## Tell me how ?
![](https://media.giphy.com/media/kQOxxwjjuTB7O/giphy.gif)

Here is how you create a fun static API for your portfolio on GitHub Pages:

- Select the route, you want the users to send a GET request. For example you could choose `https://yourdomain.com/about/`
Or any other route according to your choice.

- Make sure you add a custom domain on GitHub Pages, because sending a request to `https.username.github.io` sounds a bit 🤷🏾‍♂️.

- Now go & make a directory with the same name `about`  and inside it create a new file named `index.json`.

![](https://drive.google.com/uc?export=view&id=1lolJ3T9kVwJLNnCnUxypijhMmuTvNqyx)

- Add the following contents in the JSON file.
```json
{
  "Name 😎": " ",
  "Bio 🤗": " ",
  "Website 🖱": " ",
  "Github 💻": " ",
  "DEV 🦄": " ",
  "Twitter 🐦": " ",
  "LinkedIn 📎": " "
}
```

- Fill in the details as required or create new fields.

- Push your changes and test it.

- Hurray !! You got your first static API ready.
Now go and ask your dev friends to do a **curl on you 😁**

**Note**: _Do not place any other files in the same directory as the one in which your `index.json` file resides.
For example, if you place a `README.md` or `index.html` that will get served instead of the JSON file_.

## Downsides
 - Not able to access parameters through URL `?blogs=blog1`.
 - Only GET method works.
 - Data is static.

**Do share once you make one for yourself 😋 or just say how did you like the post below :)**

