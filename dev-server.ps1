# Jekyll Development Server with LiveReload
# 파일 수정 시 자동으로 브라우저가 새로고침됩니다.

Write-Host "Jekyll 개발 서버를 시작합니다..." -ForegroundColor Green
Write-Host "브라우저에서 http://localhost:4000 으로 접속하세요" -ForegroundColor Cyan
Write-Host "파일을 수정하면 자동으로 새로고침됩니다." -ForegroundColor Yellow
Write-Host "중지하려면 Ctrl+C를 누르세요." -ForegroundColor Yellow
Write-Host ""

$env:JEKYLL_ENV = "development"
$jekyllBinstub = Join-Path $PSScriptRoot "bin/jekyll"
& ruby $jekyllBinstub serve --livereload --incremental --open-url
