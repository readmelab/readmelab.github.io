/**
 * premium-fx-couple.js — 궁합 리포트 프리미엄 시각 효과
 * 분홍-보라 파티클 + 텍스트 리빌 + 구분선 애니메이션
 */
(function() {

  // ═══════════════════════════════════
  // 1. 분홍 파티클 배경
  // ═══════════════════════════════════
  function initParticles() {
    if (document.getElementById('pinkParticles')) return;
    var container = document.createElement('div');
    container.id = 'pinkParticles';
    document.body.appendChild(container);

    var colors = [
      'rgba(199,91,138,0.6)',   // 핑크
      'rgba(232,138,175,0.5)',  // 연핑크
      'rgba(180,100,200,0.4)',  // 보라
      'rgba(201,168,76,0.3)'    // 골드 살짝
    ];

    for (var i = 0; i < 18; i++) {
      var p = document.createElement('div');
      p.className = 'pp';
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

    // 스타일 주입
    if (!document.getElementById('ppStyles')) {
      var style = document.createElement('style');
      style.id = 'ppStyles';
      style.textContent =
        '#pinkParticles{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0;transition:opacity 1s;}' +
        '#pinkParticles.active{opacity:1;}' +
        '.pp{position:absolute;border-radius:50%;animation:ppFloat linear infinite;}' +
        '@keyframes ppFloat{' +
          '0%{transform:translateY(0) translateX(0) scale(1);opacity:0;}' +
          '10%{opacity:1;}' +
          '50%{transform:translateY(-50vh) translateX(' + (Math.random()>0.5?'':'-') + '30px) scale(1.2);opacity:0.7;}' +
          '90%{opacity:0;}' +
          '100%{transform:translateY(-105vh) translateX(' + (Math.random()>0.5?'':'-') + '50px) scale(0.8);opacity:0;}' +
        '}';
      document.head.appendChild(style);
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
    var container = document.getElementById('pinkParticles');
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
