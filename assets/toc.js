// Table of Contents Generator
(function() {
  'use strict';

  // TOC를 생성할 컨테이너
  const tocContainer = document.getElementById('toc');
  if (!tocContainer) return;

  // 본문에서 헤딩 요소들 가져오기
  const content = document.querySelector('.c-article__main');
  if (!content) return;

  const headings = content.querySelectorAll('h1, h2, h3, h4');
  
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

  // 베이스 레벨(문서에서 처음 등장하는 헤딩의 깊이)을 계산해
  // 거기에 상대적인 번호를 매깁니다. (예: 첫 헤딩이 h2여도 1부터 시작)
  // 문서 내 최소 헤딩 레벨을 베이스로 사용 (예: H1 있으면 1, 없고 H2만 있으면 2)
  const firstLevel = headings.length
    ? Array.from(headings).reduce((min, h) => Math.min(min, parseInt(h.tagName.substring(1), 10)), 6)
    : 1;

  // 계층 번호 카운터 (1~6 사용)
  const counters = [0, 0, 0, 0, 0, 0, 0];
  let prevRel = 0;

  function nextNumber(rawLevel) {
    // 상대 레벨 (첫 헤딩이 h2면 h2는 1레벨, h3는 2레벨)
    let rel = Math.max(1, rawLevel - firstLevel + 1);

    // 더 깊게 점프할 경우(예: 1에서 바로 3) 중간 레벨을 1로 채움
    if (rel > prevRel + 1) {
      for (let l = prevRel + 1; l < rel; l++) counters[l] = counters[l] || 1;
      counters[rel] = 1;
    } else if (rel === prevRel + 1) {
      counters[rel] = 1;
    } else {
      counters[rel] = (counters[rel] || 0) + 1;
    }

    // 더 깊은 레벨 초기화
    for (let l = rel + 1; l < counters.length; l++) counters[l] = 0;

    prevRel = rel;
    return counters.slice(1, rel + 1).filter(n => n > 0).join('.');
  }

  // TOC 항목 생성 (번호 접두사 포함)
  let tocHTML = '';
  headings.forEach((heading) => {
    const rawLevel = parseInt(heading.tagName.substring(1), 10);
    const level = heading.tagName.toLowerCase();
    const text = heading.textContent;
    const id = heading.id;

    let levelClass = '';
    if (level === 'h1') levelClass = 'c-toc__item--h1';
    else if (level === 'h2') levelClass = 'c-toc__item--h2';
    else if (level === 'h3') levelClass = 'c-toc__item--h3';
    else if (level === 'h4') levelClass = 'c-toc__item--h4';

    const number = nextNumber(rawLevel);

    tocHTML += `<li class="c-toc__item ${levelClass}">
      <a href="#${id}" class="c-toc__link"><span class="c-toc__num">${number}</span> ${text}</a>
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

