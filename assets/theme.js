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
  function iconSVG(theme){
    if(theme === 'dark') {
      // Sun icon
      return '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10-9h2V1h-2v3zm7.04 1.46l1.79-1.8-1.41-1.41-1.8 1.79 1.42 1.42zM17 13h3v-2h-3v2zm-5 8h2v-3h-2v3zm6.24-1.84l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42zM4.22 18.36l-1.79 1.8 1.41 1.41 1.8-1.79-1.42-1.42zM12 6a6 6 0 100 12 6 6 0 000-12z"/></svg>';
    }
    // Moon icon
    return '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12.74 2.01a9 9 0 109.25 9.25 7.5 7.5 0 01-9.25-9.25z"/></svg>';
  }

  function updateIcon(theme){
    if(!toggleBtn) return;
    toggleBtn.innerHTML = iconSVG(theme);
    toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    toggleBtn.title = theme === 'dark' ? 'Light' : 'Dark';
  }

  function injectToggle(){
    const row = document.querySelector('.c-page__header .c-header__row');
    if(!row) return;
    toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'theme-toggle';
    toggleBtn.addEventListener('click', function(){
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
    // 검색폼 오른쪽에 배치
    row.appendChild(toggleBtn);
    updateIcon(document.documentElement.getAttribute('data-theme'));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', injectToggle);
  else injectToggle();
})();


