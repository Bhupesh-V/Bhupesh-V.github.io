---
layout: page
title: Lists
description: Curated collection of various resources on topics that I'm into.
permalink: /lists/
---

This page lists the different topics I explore, along with the resources I use to learn about each one.

{% if site.lists.size > 0 %}
<div class="all-lists">
  {% assign sorted_lists = site.lists | sort: 'date' | reverse %}
  {% for list in sorted_lists %}
    <section>
      <h4>
        <a class="mark" href="{{ site.baseurl }}{{ list.url }}">{{ list.title }}</a>
        📅 {{ list.date | date: "%B %e, %Y" }}
      </h4>
    </section>
  {% endfor %}
</div>
{% else %}
  <p>No lists yet. Check back soon!</p>
{% endif %}
