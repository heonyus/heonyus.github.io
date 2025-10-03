# Heonyu's Blog

[paper-jekyll-theme](https://github.com/mkchoi212/paper-jekyll-theme)을 사용한 개인 블로그입니다.

## 로컬에서 실행하기

```bash
bundle install
bundle exec jekyll serve
```

그런 다음 브라우저에서 `http://localhost:4000`으로 접속하세요.

## 새 글 작성하기

`_posts` 디렉토리에 `YYYY-MM-DD-title.md` 형식으로 파일을 생성하세요.

예시:
```markdown
---
layout: post
title: "첫 번째 글"
date: 2025-10-03
tags: [블로그, Jekyll]
---

여기에 글 내용을 작성하세요.
```

## GitHub Pages에 배포하기

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

몇 분 후 `https://heonyus.github.io`에서 블로그를 확인할 수 있습니다.
