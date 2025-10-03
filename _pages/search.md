---
layout: content
title: Search
permalink: /search/
---

<div id="search-app">
  <input id="search-input" type="text" placeholder="검색어를 입력하세요" style="width:100%;padding:12px 14px;border:1px solid #ddd;border-radius:6px;">
  <p id="search-meta" style="color:#888;margin-top:8px;"></p>
  <div id="search-results" class="c-archives__list" style="margin-top:16px;"></div>
</div>

<script src="{{ '/assets/bm25.js' | prepend: site.baseurl }}"></script>
<script>
  window.__POST_INDEX__ = [
    {% for post in site.posts %}
    {
      url: '{{ post.url | prepend: site.baseurl }}',
      title: {{ post.title | jsonify }},
      date: '{{ post.date | date: "%Y-%m-%d" }}',
      content: {{ post.content | strip_html | normalize_whitespace | jsonify }}
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ];
</script>

