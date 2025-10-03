// Table of Contents Generator
(function() {
  'use strict';

  // TOC를 생성할 컨테이너
  const tocContainer = document.getElementById('toc');
  if (!tocContainer) return;

  // 본문에서 헤딩 요소들 가져오기
  const content = document.querySelector('.c-article__main');
  if (!content) return;

  const headings = content.querySelectorAll('h2, h3, h4');
  
  // 헤딩이 없으면 TOC 숨기기
  if (headings.length === 0) {
    const tocAside = document.querySelector('.c-toc');
    if (tocAside) tocAside.style.display = 'none';
    return;
  }

  // 각 헤딩에 ID 추가 (없는 경우)
  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = 'heading-' + index;
    }
  });

  // TOC 항목 생성
  let tocHTML = '';
  headings.forEach((heading) => {
    const level = heading.tagName.toLowerCase();
    const text = heading.textContent;
    const id = heading.id;
    
    let levelClass = '';
    if (level === 'h2') levelClass = 'c-toc__item--h2';
    else if (level === 'h3') levelClass = 'c-toc__item--h3';
    else if (level === 'h4') levelClass = 'c-toc__item--h4';
    
    tocHTML += `<li class="c-toc__item ${levelClass}">
      <a href="#${id}" class="c-toc__link">${text}</a>
    </li>`;
  });

  tocContainer.innerHTML = tocHTML;

  // 스크롤 시 현재 섹션 하이라이트
  const tocLinks = tocContainer.querySelectorAll('.c-toc__link');
  
  function highlightTOC() {
    let current = '';
    const scrollPosition = window.scrollY + 100;

    headings.forEach((heading) => {
      const sectionTop = heading.offsetTop;
      if (scrollPosition >= sectionTop) {
        current = heading.id;
      }
    });

    tocLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // 스크롤 이벤트 리스너
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(function() {
      highlightTOC();
    });
  });

  // 페이지 로드 시 초기 하이라이트
  highlightTOC();

  // TOC 링크 클릭 시 부드러운 스크롤
  tocLinks.forEach((link) => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
})();

