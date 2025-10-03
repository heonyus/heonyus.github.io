#!/usr/bin/env ruby

require 'yaml'
require 'date'
require 'fileutils'
require 'cgi'

# Read all posts and collect tags
tags = {}
Dir.glob('_posts/*.md').each do |post_file|
  content = File.read(post_file)
  if content =~ /^---\s*\n(.*?)\n---\s*\n/m
    front_matter = YAML.safe_load(
      $1,
      permitted_classes: [Date],
      permitted_symbols: [],
      aliases: true
    )
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
    # Escape Liquid delimiters to avoid premature evaluation
    liquid_open  = '{{'
    liquid_close = '}}'

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
        <a href="#{liquid_open} post.url | prepend: site.baseurl #{liquid_close}" class="c-archives__item">
          <time class="c-archives__date" datetime="#{liquid_open} post.date | date_to_xmlschema #{liquid_close}">#{liquid_open} post.date | date: "%b %-d, %Y" #{liquid_close}</time>
          <h3 class="c-archives__title">#{liquid_open} post.title #{liquid_close}</h3>
        </a>
      {% endfor %}
    {% else %}
      <p>이 태그에 해당하는 글이 없습니다.</p>
    {% endif %}
  </div>
</div>

<p><a href="#{liquid_open} "/tags/" | prepend: site.baseurl #{liquid_close}">← 모든 태그 보기</a></p>
HTML
  end
end

puts "Generated #{tags.length} tag pages"
