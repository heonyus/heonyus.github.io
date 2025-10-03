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

  // 헤더에 토글 버튼 추가
  let toggleBtn;
  function iconEmoji(theme){
    if(theme === 'light') {
      return '☀️'; // 라이트 모드일 때 해
    }
    return '🌙'; // 다크 모드일 때 초승달
  }

  function updateIcon(theme){
    if(!toggleBtn) return;
    toggleBtn.textContent = iconEmoji(theme);
    toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    toggleBtn.title = theme === 'dark' ? 'Light mode' : 'Dark mode';
  }

  function injectToggle(){
    const top = document.querySelector('.c-page__header .c-header__top');
    if(!top) return;
    toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'theme-toggle';
    toggleBtn.addEventListener('click', function(){
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
    top.appendChild(toggleBtn);
    updateIcon(document.documentElement.getAttribute('data-theme'));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', injectToggle);
  else injectToggle();
})();


