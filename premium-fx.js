/**
 * premium-fx.js — 프리미엄 시각 효과
 * 1. 금빛 파티클  2. 텍스트 등장  3. 구분선 애니메이션
 */
(function() {

  // ═══════════════════════════════════
  // 1. 금빛 파티클 배경
  // ═══════════════════════════════════
  function initParticles() {
    var container = document.createElement('div');
    container.id = 'goldParticles';
    document.body.appendChild(container);

    var count = 15;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      p.className = 'gp';
      var size = 2 + Math.random() * 3;
      var left = Math.random() * 100;
      var dur = 14 + Math.random() * 16;
      var delay = Math.random() * dur;
      p.style.cssText =
        'width:' + size + 'px;height:' + size + 'px;' +
        'left:' + left + '%;' +
        'bottom:-10px;' +
        'animation-duration:' + dur + 's;' +
        'animation-delay:-' + delay + 's;';
      container.appendChild(p);
    }

    function checkActive() {
      var report = document.querySelector('.report-section.active');
      if (report) {
        container.classList.add('active');
      } else {
        container.classList.remove('active');
      }
    }

    var obs = new MutationObserver(checkActive);
    obs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    checkActive();
  }

  // ═══════════════════════════════════
  // 2. 텍스트 한 줄씩 등장
  // ═══════════════════════════════════
  function initTextReveal() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('txt-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    function observeTexts() {
      var els = document.querySelectorAll(
        '.chapter-body p:not(.txt-visible):not([data-txt-watched]),' +
        '.chapter-bridge:not(.txt-visible):not([data-txt-watched]),' +
        '.highlight-quote:not(.txt-visible):not([data-txt-watched])'
      );
      els.forEach(function(el) {
        el.setAttribute('data-txt-watched', '1');
        observer.observe(el);
      });
    }

    // 3번만 체크 (동적 렌더링 대응)
    setTimeout(observeTexts, 2000);
    setTimeout(observeTexts, 5000);
    setTimeout(observeTexts, 10000);
  }

  // ═══════════════════════════════════
  // 3. 챕터 구분선 애니메이션
  // ═══════════════════════════════════
  function initDividerAnim() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('div-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    function observeDividers() {
      var divs = document.querySelectorAll('.chapter-divider:not(.div-visible):not([data-div-watched])');
      divs.forEach(function(el) {
        el.setAttribute('data-div-watched', '1');
        observer.observe(el);
      });
    }

    setTimeout(observeDividers, 2000);
    setTimeout(observeDividers, 5000);
    setTimeout(observeDividers, 10000);
  }

  // ═══════════════════════════════════
  // 초기화
  // ═══════════════════════════════════
  function init() {
    initParticles();
    initTextReveal();
    initDividerAnim();
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }

})();
