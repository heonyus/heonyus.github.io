My personal [blog](https://heonyus.github.io/)

## 🚀 개발 서버 실행 (자동 새로고침)

파일을 수정하면 브라우저가 자동으로 새로고침됩니다!

### Windows
```powershell
# PowerShell
.\dev-server.ps1

# 또는 커맨드 프롬프트
dev-server.bat

# 또는 직접 실행
bundle exec jekyll serve --livereload --incremental
```

### macOS/Linux
```bash
# 1) 번들러 설치 (최초 1회만)
gem install --user-install bundler

# 2) 프로젝트 의존성 설치 (최초 1회만)
bundle config set --local path 'vendor/bundle'
bundle install

# 3) 개발 서버 실행
bundle exec jekyll serve --livereload --incremental
```

서버가 실행되면 `http://localhost:4000` 으로 접속하세요.

## 📝 설정

블로그 엔진에 자동 새로고침 기능이 내장되어 있습니다:
- `_config.yml`: livereload 설정 포함
- `_layouts/default.html`: 개발 환경에서 자동으로 livereload 스크립트 주입
- 프로덕션 빌드 시에는 livereload 코드가 포함되지 않습니다