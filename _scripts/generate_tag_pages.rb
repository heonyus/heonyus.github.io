#!/usr/bin/env ruby

require 'yaml'
require 'fileutils'
require 'cgi'

# Read all posts and collect tags
tags = {}
Dir.glob('_posts/*.md').each do |post_file|
  content = File.read(post_file)
  if content =~ /^---\s*\n(.*?)\n---\s*\n/m
    front_matter = YAML.load($1)
    if front_matter['tags']
      front_matter['tags'].each do |tag|
        tags[tag] ||= []
        tags[tag] << post_file
      end
    end
  end
end

# Create tag directory
FileUtils.mkdir_p('tags')

# Generate a page for each tag
tags.each do |tag, posts|
  tag_slug = CGI.escape(tag)
  tag_dir = File.join('tags', tag_slug)
  FileUtils.mkdir_p(tag_dir)
  
  File.open(File.join(tag_dir, 'index.html'), 'w') do |f|
    f.write <<~HTML
---
layout: content
title: "Tag: #{tag}"
---

<h2>##{tag}</h2>

<div class="c-archives">
  <div class="c-archives__list">
    {% assign posts = site.tags['#{tag}'] %}
    {% if posts and posts != empty %}
      {% for post in posts %}
        <a href="{{ post.url | prepend: site.baseurl }}" class="c-archives__item">
          <time class="c-archives__date" datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d, %Y" }}</time>
          <h3 class="c-archives__title">{{ post.title }}</h3>
        </a>
      {% endfor %}
    {% else %}
      <p>이 태그에 해당하는 글이 없습니다.</p>
    {% endif %}
  </div>
</div>

<p><a href="{{ "/tags/" | prepend: site.baseurl }}">← 모든 태그 보기</a></p>
HTML
  end
end

puts "Generated #{tags.length} tag pages"
