@echo off
REM Jekyll Development Server with LiveReload
REM 파일 수정 시 자동으로 브라우저가 새로고침됩니다.

echo Jekyll 개발 서버를 시작합니다...
echo 브라우저에서 http://localhost:4000 으로 접속하세요
echo 파일을 수정하면 자동으로 새로고침됩니다.
echo 중지하려면 Ctrl+C를 누르세요.
echo.

set JEKYLL_ENV=development
set SCRIPT_DIR=%~dp0
set JEKYLL_BIN=%SCRIPT_DIR%bin\jekyll
ruby "%JEKYLL_BIN%" serve --livereload --incremental --open-url

