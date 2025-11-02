// Table of Contents Generator
(function() {
  'use strict';

  // DOM이 완전히 로드된 후 실행
  function initTOC() {
    // TOC를 생성할 컨테이너
    const tocContainer = document.getElementById('toc');
    if (!tocContainer) {
      console.warn('TOC: 컨테이너를 찾을 수 없습니다.');
      return;
    }

    // 본문에서 헤딩 요소들 가져오기
    const content = document.querySelector('.c-article__main');
    if (!content) {
      console.warn('TOC: 본문 컨테이너를 찾을 수 없습니다.');
      return;
    }

    const headings = content.querySelectorAll('h1, h2, h3, h4');
    
    // 헤딩이 없으면 TOC 숨기기
    if (headings.length === 0) {
      const tocAside = document.querySelector('.c-toc');
      if (tocAside) tocAside.style.display = 'none';
      console.warn('TOC: 헤딩을 찾을 수 없습니다.');
      return;
    }

    console.log(`TOC: ${headings.length}개의 헤딩을 찾았습니다.`);

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

    console.log(`TOC: 베이스 레벨은 ${firstLevel}입니다.`);

    // 계층 번호 카운터 배열 (인덱스 1부터 사용, 최대 6레벨)
    const counters = [0, 0, 0, 0, 0, 0, 0];
    let prevLevel = 0;

    function nextNumber(rawLevel) {
      // 상대 레벨 계산 (첫 헤딩이 h2면 h2는 1레벨, h3는 2레벨)
      const relLevel = Math.max(1, rawLevel - firstLevel + 1);
      
      // 첫 번째 헤딩 처리
      if (prevLevel === 0) {
        counters[relLevel] = 1;
        prevLevel = relLevel;
        return '1';
      }
      
      // 현재 레벨이 이전 레벨보다 작거나 같으면 (같은 레벨 또는 상위 레벨)
      if (relLevel <= prevLevel) {
        // 같은 레벨이면 카운터 증가
        counters[relLevel] = (counters[relLevel] || 0) + 1;
        // 더 깊은 레벨들은 모두 초기화
        for (let i = relLevel + 1; i < counters.length; i++) {
          counters[i] = 0;
        }
      } 
      // 현재 레벨이 이전 레벨 바로 다음 레벨이면 (하위 레벨로 한 단계 내려감)
      else if (relLevel === prevLevel + 1) {
        counters[relLevel] = 1;
        // 더 깊은 레벨들은 모두 초기화
        for (let i = relLevel + 1; i < counters.length; i++) {
          counters[i] = 0;
        }
      }
      // 레벨을 건너뛰는 경우 (예: h1에서 h3로 바로 이동)
      else {
        // 중간 레벨들을 모두 1로 설정
        for (let i = prevLevel + 1; i < relLevel; i++) {
          counters[i] = 1;
        }
        counters[relLevel] = 1;
        // 더 깊은 레벨들은 모두 초기화
        for (let i = relLevel + 1; i < counters.length; i++) {
          counters[i] = 0;
        }
      }
      
      prevLevel = relLevel;
      
      // 번호 문자열 생성 (1.2.3 형식)
      const parts = [];
      for (let i = 1; i <= relLevel; i++) {
        if (counters[i] > 0) {
          parts.push(counters[i]);
        }
      }
      
      const result = parts.join('.');
      return result || '1'; // 결과가 없으면 기본값 '1' 반환
    }

    // TOC 항목 생성 (번호 접두사 포함)
    let tocHTML = '';
    const tocItems = [];
    
    headings.forEach((heading) => {
      const rawLevel = parseInt(heading.tagName.substring(1), 10);
      const level = heading.tagName.toLowerCase();
      const text = heading.textContent.trim();
      const id = heading.id;

      let levelClass = '';
      if (level === 'h1') levelClass = 'c-toc__item--h1';
      else if (level === 'h2') levelClass = 'c-toc__item--h2';
      else if (level === 'h3') levelClass = 'c-toc__item--h3';
      else if (level === 'h4') levelClass = 'c-toc__item--h4';

      const number = nextNumber(rawLevel);
      
      // 번호가 없으면 기본값으로 설정
      const displayNumber = number && number.length > 0 ? number : '1';

      // 디버깅: 각 헤딩의 번호 생성 로그
      console.log(`TOC 항목: [${displayNumber}] ${level.toUpperCase()} - "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);

      tocItems.push({
        number: displayNumber,
        level: level,
        text: text
      });

      tocHTML += `<li class="c-toc__item ${levelClass}">
      <a href="#${id}" class="c-toc__link"><span class="c-toc__num">${displayNumber}</span> ${text}</a>
    </li>`;
    });

    tocContainer.innerHTML = tocHTML;
    
    // 디버깅: 생성된 번호 확인
    console.log('TOC 생성 완료:', {
      총항목수: tocItems.length,
      항목들: tocItems.map(item => `[${item.number}] ${item.level}: ${item.text.substring(0, 30)}...`)
    });

    // 생성된 HTML 구조 확인 (개발용)
    const numElements = tocContainer.querySelectorAll('.c-toc__num');
    console.log(`TOC: ${numElements.length}개의 번호 요소가 생성되었습니다.`);
    numElements.forEach((el, idx) => {
      console.log(`  번호[${idx}]: "${el.textContent}" (표시: ${window.getComputedStyle(el).display}, 가시성: ${window.getComputedStyle(el).visibility})`);
    });

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
  }

  // DOMContentLoaded 또는 이미 로드된 경우 즉시 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTOC);
  } else {
    // DOM이 이미 로드된 경우 즉시 실행
    initTOC();
  }
})();

