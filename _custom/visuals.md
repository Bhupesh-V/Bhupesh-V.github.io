---
layout: page
title: Visuals
description: A collection of visual content, diagrams, and illustrations I've created.
permalink: /visuals/
---

This page showcases visual content including diagrams, illustrations, and other visual materials I've created.

{% if site.visuals.size > 0 %}
<div class="all-visuals">
  {% assign sorted_visuals = site.visuals | sort: 'date' | reverse %}
  {% for visual in sorted_visuals %}
    <section>
      <h4>
        <a class="mark" href="{{ site.baseurl }}{{ visual.url }}">{{ visual.title }}</a>
        📅 {{ visual.date | date: "%B %e, %Y" }}
      </h4>
    </section>
  {% endfor %}
</div>
{% else %}
  <p>No visuals yet. Check back soon!</p>
{% endif %}
