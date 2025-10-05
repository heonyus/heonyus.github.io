---
layout: page
title: Categories
permalink: /categories/
---

<div class="c-categories">
  {% assign categories = site.posts | map: 'category' | uniq | sort %}
  
  {% for category in categories %}
    {% if category %}
      <section class="c-category-section" id="{{ category | slugify }}">
        <h2 class="c-category-title">{{ category }}</h2>
        <ul class="c-category-list">
          {% assign posts_in_category = site.posts | where: 'category', category %}
          {% for post in posts_in_category %}
            <li class="c-category-item">
              <div class="c-category-item__header">
                <h3 class="c-category-item__title">
                  <a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
                </h3>
                <time class="c-category-item__date">{{ post.date | date: "%b %-d, %Y" }}</time>
              </div>
              {% if post.description %}
              <p class="c-category-item__description">{{ post.description }}</p>
              {% endif %}
              {% if post.tags %}
              <div class="c-category-item__tags">
                {% for tag in post.tags %}
                  <span class="c-category-tag">{{ tag }}</span>
                {% endfor %}
              </div>
              {% endif %}
            </li>
          {% endfor %}
        </ul>
      </section>
    {% endif %}
  {% endfor %}
</div>

<style>
.c-categories {
  margin-top: 3rem;
}

.c-category-section {
  margin-bottom: 5rem;
  scroll-margin-top: 12rem;
}

.c-category-title {
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border);
  color: var(--text);
}

.c-category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.c-category-item {
  padding: 2rem 0;
  border-bottom: 1px solid var(--border);
}

.c-category-item:last-child {
  border-bottom: none;
}

.c-category-item__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 2rem;
  margin-bottom: 0.5rem;
}

.c-category-item__title {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.c-category-item__title a {
  color: var(--text);
  text-decoration: none;
}

.c-category-item__title a:hover {
  color: var(--link);
}

.c-category-item__date {
  font-size: 1.4rem;
  color: var(--muted);
  white-space: nowrap;
}

.c-category-item__description {
  font-size: 1.4rem;
  color: var(--muted);
  margin: 0.5rem 0 1rem 0;
}

.c-category-item__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.c-category-tag {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 3px;
  font-size: 1.2rem;
  color: var(--muted);
}

@media (max-width: 768px) {
  .c-category-item__header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .c-category-item__date {
    font-size: 1.2rem;
  }
}
</style>
