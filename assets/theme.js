(function(){
  'use strict';

  const STORAGE_KEY = 'site-theme';
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch(e){}
    updateIcon(theme);
  }

  function currentTheme(){
    try { return localStorage.getItem(STORAGE_KEY); } catch(e){ return null; }
  }

  // 초기 적용
  applyTheme(currentTheme() || (prefersDark ? 'dark' : 'light'));

  // 테마 토글 버튼 설정
  function iconEmoji(theme){
    if(theme === 'light') {
      return '☀️'; // 라이트 모드일 때 해
    }
    return '🌙'; // 다크 모드일 때 초승달
  }

  function updateIcon(theme){
    const btn = document.getElementById('theme-btn');
    if(!btn) return;
    btn.textContent = iconEmoji(theme);
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    btn.title = theme === 'dark' ? 'Light mode' : 'Dark mode';
  }

  function setupToggle(){
    const btn = document.getElementById('theme-btn');
    if(!btn) return;
    btn.addEventListener('click', function(){
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
    updateIcon(document.documentElement.getAttribute('data-theme'));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', setupToggle);
  else setupToggle();
})();


