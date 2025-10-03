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
    <li class="c-tag"><a href="{{ "/tags/" | prepend: site.baseurl }}{{ tag_name | url_encode }}/">#{{ tag_name }} ({{ posts | size }})</a></li>
  {% endfor %}
  {% if all_tags == empty %}
    <p>아직 태그가 없습니다.</p>
  {% endif %}
</ul>