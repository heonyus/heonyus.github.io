---
layout: content
title: Tags
permalink: /tags/
---

<div class="c-archives">
{% assign tags = site.tags | sort %}
{% for tag in tags %}
  <h2 id="{{ tag[0] | slugify }}" class="c-archives__year">
    <a href="#{{ tag[0] | slugify }}" class="c-archives__year-link">#{{ tag[0] }}</a>
    <span class="c-archives__post-count">({{ tag[1] | size }})</span>
  </h2>
  <div class="c-archives__list">
    {% for post in tag[1] %}
      <a href="{{ post.url | prepend: site.baseurl }}" class="c-archives__item">
        <time datetime="{{ post.date | date_to_xmlschema }}" class="c-archives__date">{{ post.date | date: "%b %-d, %Y" }}</time>
        <h3 class="c-archives__title">{{ post.title }}</h3>
      </a>
    {% endfor %}
  </div>
{% endfor %}
</div>

