(function(){
  'use strict';

  const STORAGE_KEY = 'site-theme';
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch(e){}
  }

  function currentTheme(){
    try { return localStorage.getItem(STORAGE_KEY); } catch(e){ return null; }
  }

  // 초기 적용
  applyTheme(currentTheme() || (prefersDark ? 'dark' : 'light'));

  // 헤더에 토글 버튼 추가
  function injectToggle(){
    const header = document.querySelector('.c-page__header p');
    if(!header) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Theme';
    btn.style.marginLeft = '10px';
    btn.className = 'theme-toggle';
    btn.addEventListener('click', function(){
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
    header.appendChild(document.createTextNode(' '));
    header.appendChild(btn);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', injectToggle);
  else injectToggle();
})();


