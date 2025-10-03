---
layout: content
title: Tags
permalink: /tags/
---

<h2>All Tags</h2>

<ul class="c-tags">
  {% assign all_tags = site.tags | sort %}
  {% for tag in all_tags %}
    {% assign tag_name = tag[0] %}
    {% assign posts = tag[1] %}
    <li class="c-tag"><a href="{{ "/tags/#tag-" | prepend: site.baseurl }}{{ tag_name | slugify }}">#{{ tag_name }} ({{ posts | size }})</a></li>
  {% endfor %}
  {% if all_tags == empty %}
    <p>아직 태그가 없습니다.</p>
  {% endif %}
</ul>

<div class="c-archives">
{% assign all_tags = site.tags | sort %}
{% for tag in all_tags %}
  {% assign tag_name = tag[0] %}
  {% assign posts = tag[1] %}
  {% assign slug = tag_name | slugify %}
  <h2 id="tag-{{ slug }}" class="c-archives__year">
    <a href="#tag-{{ slug }}" class="c-archives__year-link">#{{ tag_name }}</a>
    <span class="c-archives__post-count">({{ posts | size }})</span>
  </h2>
  <div class="c-archives__list">
    {% for post in posts %}
      <a href="{{ post.url | prepend: site.baseurl }}" class="c-archives__item">
        <time datetime="{{ post.date | date_to_xmlschema }}" class="c-archives__date">{{ post.date | date: "%b %-d, %Y" }}</time>
        <h3 class="c-archives__title">{{ post.title }}</h3>
      </a>
    {% endfor %}
  </div>
{% endfor %}
</div>

