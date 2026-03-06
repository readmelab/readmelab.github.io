/**
 * premium-fx.js — 프리미엄 시각 효과
 * 개인: 금빛 / 궁합: 분홍-보라 (자동 분기)
 */
(function() {

  function isCouple() {
    try {
      var rd = window.reportData;
      return !!(rd && rd.dashboard && rd.dashboard.client && rd.dashboard.partner);
    } catch(e) { return false; }
  }

  // ═══════════════════════════════════
  // 1. 파티클 배경 (ID 유지: goldParticles)
  // ═══════════════════════════════════
  function initParticles() {
    if (document.getElementById('goldParticles')) return;
    var container = document.createElement('div');
    container.id = 'goldParticles';  // ★ 기존 ID 그대로 유지
    document.body.appendChild(container);

    var couple = isCouple();

    var goldColors = [
      'rgba(201,169,110,0.6)',
      'rgba(201,169,110,0.4)',
      'rgba(255,215,0,0.3)'
    ];
    var pinkColors = [
      'rgba(199,91,138,0.6)',
      'rgba(232,138,175,0.5)',
      'rgba(180,100,200,0.4)',
      'rgba(201,168,76,0.3)'
    ];

    var colors = couple ? pinkColors : goldColors;

    for (var i = 0; i < 15; i++) {
      var p = document.createElement('div');
      p.className = 'gp';  // ★ 기존 클래스 그대로 유지
      var size = 2 + Math.random() * 3;
      var color = colors[Math.floor(Math.random() * colors.length)];
      p.style.cssText =
        'width:' + size + 'px;height:' + size + 'px;' +
        'left:' + (Math.random() * 100) + '%;' +
        'bottom:-10px;' +
        'background:' + color + ';' +
        'box-shadow:0 0 ' + (4 + Math.random() * 6) + 'px ' + color + ';' +
        'animation-duration:' + (14 + Math.random() * 16) + 's;' +
        'animation-delay:-' + (Math.random() * 20) + 's;';
      container.appendChild(p);
    }
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

    function scan() {
      document.querySelectorAll(
        '.chapter-body p:not(.txt-visible):not([data-tw]),' +
        '.chapter-bridge:not(.txt-visible):not([data-tw]),' +
        '.highlight-quote:not(.txt-visible):not([data-tw])'
      ).forEach(function(el) {
        el.setAttribute('data-tw', '1');
        observer.observe(el);
      });
    }

    setTimeout(scan, 2000);
    setTimeout(scan, 5000);
    setTimeout(scan, 10000);
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

    function scan() {
      document.querySelectorAll('.chapter-divider:not(.div-visible):not([data-dw])').forEach(function(el) {
        el.setAttribute('data-dw', '1');
        observer.observe(el);
      });
    }

    setTimeout(scan, 2000);
    setTimeout(scan, 5000);
    setTimeout(scan, 10000);
  }

  // ═══════════════════════════════════
  // 4. 파티클 표시/숨김
  // ═══════════════════════════════════
  function checkParticles() {
    var container = document.getElementById('goldParticles');
    if (!container) return;
    var report = document.querySelector('.report-section.active');
    if (report) {
      container.classList.add('active');
    } else {
      container.classList.remove('active');
    }
  }

  // ═══════════════════════════════════
  // 초기화
  // ═══════════════════════════════════
  function init() {
    initParticles();
    initTextReveal();
    initDividerAnim();
    setInterval(checkParticles, 3000);
    checkParticles();
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }

})();
