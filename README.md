My personal [blog](https://heonyus.github.io/)

- windows에서 실행하려면:
```
ruby .\bin\jekyll serve --livereload --trace
```

- macOS에서 실행하려면:
```
 # 1) 번들러를 사용자 홈에 설치
gem install --user-install bundler:2.4.22

# 2) 현재 프로젝트에서 vendor/bundle로 설치 경로 고정
cd /Users/jay/Desktop/Code/heonyus.github.io
bundle config set --local path 'vendor/bundle'

# 3) 의존성 설치 (이제 /Library 아래가 아니라 프로젝트 안에 설치됨)
bundle install

# 4) 서버 실행
bundle exec jekyll serve --livereload --trace
```