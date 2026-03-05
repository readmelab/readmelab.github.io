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

    var count = 20; // 모바일 성능 고려
    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      p.className = 'gp';
      var size = 2 + Math.random() * 3;
      var left = Math.random() * 100;
      var dur = 12 + Math.random() * 18;
      var delay = Math.random() * dur;
      p.style.cssText =
        'width:' + size + 'px;height:' + size + 'px;' +
        'left:' + left + '%;' +
        'bottom:-10px;' +
        'animation-duration:' + dur + 's;' +
        'animation-delay:-' + delay + 's;';
      container.appendChild(p);
    }

    // 리포트 활성화 시에만 파티클 표시
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
        '.chapter-body p:not(.txt-visible),' +
        '.chapter-bridge:not(.txt-visible),' +
        '.highlight-quote:not(.txt-visible)'
      );
      els.forEach(function(el) { observer.observe(el); });
    }

    // 챕터가 동적으로 생성되므로 반복 체크
    setInterval(observeTexts, 2000);
    setTimeout(observeTexts, 3000);
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
      var divs = document.querySelectorAll('.chapter-divider:not(.div-visible)');
      divs.forEach(function(el) { observer.observe(el); });
    }

    setInterval(observeDividers, 2000);
    setTimeout(observeDividers, 3000);
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
