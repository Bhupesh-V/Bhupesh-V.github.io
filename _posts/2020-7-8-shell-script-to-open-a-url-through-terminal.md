---
layout: post
comments: true
title: Shell script to open a url through terminal
description: Shell script to open a url through terminal
tags: linux shell til
---

If you are a developer then fixing bugs takes time because you have to shift from terminal to your fav browser & then type your query.
(and then in between you open reddit/twitter 😅 for some reason, which wanders your attention).

We can lighten this process a little bit by writing a shell script which will open a URL directly in the browser.

```bash
#!/bin/bash


# Simple script to invoke browser using terminal
# Search using DuckDuckGo Lite

urlencode() {
  local string="${1}"
  local strlen=${#string}
  local encoded=""
  local pos c o

  for (( pos=0 ; pos<${#string} ; pos++ )); do
     c=${string:$pos:1}
     echo -e "$c"
     case "$c" in
        [-_.~a-zA-Z0-9] )
                # these characters are url safe (permitted)
                o="${c}" ;;
        * )     
                # Encode special characters
                # Assign output to o, instead of printing to console
                # ' in "'$c" is used to convert the charchter into numeric ASCII value
                # %02x converts the character into hexadecimal notation
                printf -v o '%%%02x' "'$c"
     esac
     encoded+="${o}"
  done
  # return "encoded" to outer scope
  echo "${encoded}" 
}
read -p "Search Query : " search_term
# Replace firefox with either "chromium-browser" or command to open your fav browser
firefox --new-tab "lite.duckduckgo.com/lite/?q=$(urlencode "${search_term}")"

```
You can also view other options to the `firefox` command by invoking help.

```bash
firefox --help
```

> Note : If you are on Debian, the command `gnome-www-browser` will point to the default browser which comes in with your OS, i.e **firefox**. So both the commands can be easily swapped.

Save this somewhere in your scripts folder and add an alias for it.

```bash
alias ddg="/path/to/script.sh"
alias helpme="/path/to/script.sh"
alias search="/path/to/script.sh"
```

Hope you learned something new today.
Take Care 🤗

### Resources
- [How to urlencode data for curl command?](https://stackoverflow.com/questions/296536/how-to-urlencode-data-for-curl-command)
- [URL Encoding of Special Characters](https://secure.n-able.com/webhelp/NC_9-1-0_SO_en/Content/SA_docs/API_Level_Integration/API_Integration_URLEncoding.html)