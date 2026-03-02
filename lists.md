---
layout: page
title: Lists
description: Curated collection of various resources on topics that I'm into.
permalink: /lists/
---

This page lists the different topics I explore, along with the resources I use to learn about each one.

{% if site.lists.size > 0 %}
<div class="lists">
  {% for list in site.lists reversed %}
    <article class="list-item">
      <h2><a href="{{ site.baseurl }}{{ list.url }}">{{ list.title }}</a></h2>
      <!-- {% if list.tags %}
      <div class="postTags" style="margin: 10px 0;">
        {% for tag in list.tags %}
          <span id="pagetags" class="mark">
            <a href="/tag/{{ tag }}/"><b>📌 {{ tag }}</b></a>
          </span>
        {% endfor %}
      </div>
      {% endif %} -->
      <div class="description">
        {{ list.description }}
      </div>
      <hr>
    </article>
  {% endfor %}
</div>
{% else %}
  <p>No lists yet. Check back soon!</p>
{% endif %}
