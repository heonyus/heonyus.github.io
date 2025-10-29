(function () {
  'use strict';

  var STORAGE_KEY = 'site-theme';
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  function readStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* ignore storage errors */
    }
    updateToggle(theme);
  }

  function updateToggle(theme) {
    var button = document.getElementById('theme-btn');
    if (!button) {
      return;
    }

    var isDark = theme === 'dark';
    button.textContent = isDark ? 'Light mode' : 'Dark mode';
    button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    button.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }

  function handleToggle() {
    var current = document.documentElement.getAttribute('data-theme');
    var nextTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  }

  function init() {
    var initialTheme = readStoredTheme() || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    var button = document.getElementById('theme-btn');
    if (button) {
      button.addEventListener('click', handleToggle);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
