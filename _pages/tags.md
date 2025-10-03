---
layout: content
title: Tags
permalink: /tags/
---

<h2>All Tags</h2>

<ul class="c-tags">
  {% assign tag_names = site.tags | map: 0 | sort_natural %}
  {% for tag_name in tag_names %}
    <li class="c-tag"><a href="{{ "/tags/" | prepend: site.baseurl }}{{ tag_name | slugify }}/">#{{ tag_name }} ({{ site.tags[tag_name].size }})</a></li>
  {% endfor %}
  {% if tag_names == empty %}
    <p>아직 태그가 없습니다.</p>
  {% endif %}
</ul>

