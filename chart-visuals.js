/**
 * chart-visuals.js — 챕터 내 SVG 시각화 (나를읽다)
 * index.html의 renderChapters()에서 호출
 */

var ChartVisuals = (function() {

  var OHENG_COLORS = {
    '목': '#4CAF50', '화': '#F44336', '토': '#FFC107',
    '금': '#9E9E9E', '수': '#2196F3'
  };

  var OHENG_LABELS = {
    '목': '木', '화': '火', '토': '土', '금': '金', '수': '水'
  };

  // ═══════════════════════════════════
  // 스크롤 트리거: 화면에 보일 때 애니메이션 시작
  // ═══════════════════════════════════
  function observeSlot(container) {
    if (!('IntersectionObserver' in window)) {
      container.classList.add('cv-visible');
      return;
    }
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    container.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.classList.add('cv-visible');
          // SVG animate 다시 트리거
          var svgs = entry.target.querySelectorAll('svg');
          svgs.forEach(function(svg) {
            svg.pauseAnimations && svg.pauseAnimations();
            svg.setCurrentTime && svg.setCurrentTime(0);
            svg.unpauseAnimations && svg.unpauseAnimations();
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    observer.observe(container);
  }

  // ═══════════════════════════════════
  // CH1: 사주팔자 — 네 기둥 애니메이션
  // ═══════════════════════════════════
  function renderCh1Pillars(container, db) {
    var fp = db.fourPillars;
    if (!fp) return;

    var keys = ['년주','월주','일주','시주'];
    var dm = db.dayMaster || {};

    var el = document.createElement('div');
    el.className = 'cv-pillars-anim';
    el.innerHTML = '<div class="cv-section-label">사 주 팔 자</div>';

    var svg = '<svg viewBox="0 0 360 220" width="100%" style="max-width:400px;display:block;margin:0 auto;">';

    keys.forEach(function(key, i) {
      var p = fp[key] || {};
      var gan = p.gan || '—';
      var ji = p.ji || '—';
      var ganOheng = p.ganOheng || '';
      var jiOheng = p.jiOheng || '';
      var ganColor = OHENG_COLORS[ganOheng] || '#c9a84c';
      var jiColor = OHENG_COLORS[jiOheng] || '#c9a84c';
      var x = 45 + i * 90;
      var isDay = (key === '일주');
      var delay = (3 - i) * 0.15;

      svg += '<g style="opacity:0;transform:translateY(24px);animation:cvPillarRise 0.6s ease both;animation-delay:'+delay+'s;">';
      svg += '<rect x="'+(x-30)+'" y="20" width="60" height="70" rx="6" fill="rgba(201,168,76,0.04)" stroke="'+(isDay?'#c9a84c':'rgba(201,168,76,0.15)')+'" stroke-width="'+(isDay?'1.5':'0.5')+'"/>';
      svg += '<text x="'+x+'" y="14" text-anchor="middle" fill="#6a6050" font-size="9" letter-spacing="2">'+key+'</text>';
      svg += '<text x="'+x+'" y="60" text-anchor="middle" fill="'+ganColor+'" font-size="26" font-weight="700" font-family="Noto Serif KR,serif">'+gan+'</text>';
      if (ganOheng) {
        svg += '<circle cx="'+x+'" cy="80" r="8" fill="'+ganColor+'" opacity="0.15"/>';
        svg += '<text x="'+x+'" y="83" text-anchor="middle" fill="'+ganColor+'" font-size="7">'+ganOheng+'</text>';
      }
      svg += '<rect x="'+(x-30)+'" y="100" width="60" height="70" rx="6" fill="rgba(201,168,76,0.02)" stroke="'+(isDay?'#c9a84c':'rgba(201,168,76,0.1)')+'" stroke-width="'+(isDay?'1.5':'0.5')+'"/>';
      svg += '<text x="'+x+'" y="142" text-anchor="middle" fill="'+jiColor+'" font-size="26" font-weight="700" font-family="Noto Serif KR,serif">'+ji+'</text>';
      if (jiOheng) {
        svg += '<circle cx="'+x+'" cy="162" r="8" fill="'+jiColor+'" opacity="0.15"/>';
        svg += '<text x="'+x+'" y="165" text-anchor="middle" fill="'+jiColor+'" font-size="7">'+jiOheng+'</text>';
      }
      svg += '</g>';

      if (isDay) {
        svg += '<circle cx="'+x+'" cy="100" r="38" fill="none" stroke="#c9a84c" stroke-width="0.5" opacity="0.4">';
        svg += '<animate attributeName="r" values="38;44;38" dur="2s" repeatCount="indefinite"/>';
        svg += '<animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite"/>';
        svg += '</circle>';
      }
    });

    if (dm.gan) {
      var dmColor = OHENG_COLORS[dm.oheng] || '#c9a84c';
      svg += '<rect x="130" y="188" width="100" height="24" rx="12" fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,0.2)" stroke-width="0.5"/>';
      svg += '<text x="180" y="204" text-anchor="middle" fill="'+dmColor+'" font-size="10" font-family="Noto Serif KR,serif">일간 <tspan font-weight="700">'+dm.gan+'</tspan> · '+(dm.oheng||'')+'</text>';
    }

    svg += '</svg>';
    el.innerHTML += svg;
    container.appendChild(el);
    observeSlot(el);
  }

  // ═══════════════════════════════════
  // CH2: 오행 — 레이더 차트
  // ═══════════════════════════════════
  function renderCh2Oheng(container, db) {
    var oheng = db.ohengDistribution;
    if (!oheng) return;

    var keys = ['목','화','토','금','수'];
    var values = [];
    var total = 0;
    keys.forEach(function(k) {
      var v = 0;
      if (oheng[k]) {
        v = typeof oheng[k] === 'object' ? (oheng[k].count || oheng[k].percentage || 0) : Number(oheng[k]) || 0;
      }
      values.push(v);
      total += v;
    });
    if (total === 0) return;

    var el = document.createElement('div');
    el.className = 'cv-oheng-radar';
    el.innerHTML = '<div class="cv-section-label">오 행 분 포</div>';

    var cx = 150, cy = 130, maxR = 90;
    var svg = '<svg viewBox="0 0 300 280" width="100%" style="max-width:360px;display:block;margin:0 auto;">';

    [1, 0.66, 0.33].forEach(function(scale) {
      var pts = [];
      for (var i = 0; i < 5; i++) {
        var angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
        pts.push((cx + maxR * scale * Math.cos(angle)).toFixed(1) + ',' + (cy + maxR * scale * Math.sin(angle)).toFixed(1));
      }
      svg += '<polygon points="'+pts.join(' ')+'" fill="none" stroke="rgba(201,168,76,0.1)" stroke-width="0.5"/>';
    });

    for (var i = 0; i < 5; i++) {
      var angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
      var ex = cx + maxR * Math.cos(angle);
      var ey = cy + maxR * Math.sin(angle);
      svg += '<line x1="'+cx+'" y1="'+cy+'" x2="'+ex.toFixed(1)+'" y2="'+ey.toFixed(1)+'" stroke="rgba(201,168,76,0.08)" stroke-width="0.5"/>';
    }

    var maxVal = Math.max.apply(null, values) || 1;
    var dataPoints = [];
    for (var i = 0; i < 5; i++) {
      var angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
      var ratio = values[i] / maxVal;
      var r = maxR * Math.max(ratio, 0.08);
      dataPoints.push((cx + r * Math.cos(angle)).toFixed(1) + ',' + (cy + r * Math.sin(angle)).toFixed(1));
    }
    svg += '<polygon points="'+dataPoints.join(' ')+'" fill="rgba(201,168,76,0.1)" stroke="#c9a84c" stroke-width="1.5" stroke-linejoin="round">';
    svg += '<animate attributeName="opacity" from="0" to="1" dur="0.8s" fill="freeze"/>';
    svg += '</polygon>';

    for (var i = 0; i < 5; i++) {
      var angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
      var ratio = values[i] / maxVal;
      var r = maxR * Math.max(ratio, 0.08);
      var dx = cx + r * Math.cos(angle);
      var dy = cy + r * Math.sin(angle);
      var lx = cx + (maxR + 20) * Math.cos(angle);
      var ly = cy + (maxR + 20) * Math.sin(angle);
      var pct = total > 0 ? Math.round(values[i] / total * 100) : 0;
      var color = OHENG_COLORS[keys[i]];

      svg += '<circle cx="'+dx.toFixed(1)+'" cy="'+dy.toFixed(1)+'" r="4" fill="'+color+'" opacity="0.9">';
      svg += '<animate attributeName="r" values="0;4" dur="0.5s" begin="'+(0.3+i*0.1)+'s" fill="freeze"/>';
      svg += '</circle>';
      svg += '<text x="'+lx.toFixed(1)+'" y="'+(ly-4).toFixed(1)+'" text-anchor="middle" fill="'+color+'" font-size="13" font-weight="700">'+OHENG_LABELS[keys[i]]+'</text>';
      svg += '<text x="'+lx.toFixed(1)+'" y="'+(ly+10).toFixed(1)+'" text-anchor="middle" fill="#8a7a5a" font-size="9">'+pct+'%</text>';
    }

    if (db.yongShin) {
      var ys = db.yongShin;
      svg += '<text x="150" y="268" text-anchor="middle" fill="#c9a84c" font-size="10" font-family="Noto Serif KR,serif">';
      svg += '용신 <tspan font-weight="700" fill="'+(OHENG_COLORS[ys.yongShin]||'#c9a84c')+'">'+( ys.yongShin||'')+'</tspan>';
      svg += '  ·  희신 <tspan font-weight="700" fill="'+(OHENG_COLORS[ys.huiShin]||'#c9a84c')+'">'+( ys.huiShin||'')+'</tspan>';
      svg += '</text>';
    }

    svg += '</svg>';
    el.innerHTML += svg;
    container.appendChild(el);
    observeSlot(el);
  }

  // ═══════════════════════════════════
  // CH3: 십성 — 원형 버블 맵
  // ═══════════════════════════════════
  function renderCh3Sipseong(container, db) {
    var counts = db.sipseongCounts;
    if (!counts) return;

    var groups = counts.groups || {};
    var el = document.createElement('div');
    el.className = 'cv-sipseong-map';
    el.innerHTML = '<div class="cv-section-label">십 성 분 포</div>';

    var groupData = [
      { name: '비겁', label: '자아', color: '#F44336', val: groups['비겁'] || 0 },
      { name: '식상', label: '표현', color: '#FF9800', val: groups['식상'] || 0 },
      { name: '재성', label: '재물', color: '#FFC107', val: groups['재성'] || 0 },
      { name: '관성', label: '명예', color: '#2196F3', val: groups['관성'] || 0 },
      { name: '인성', label: '지혜', color: '#9C27B0', val: groups['인성'] || 0 }
    ];

    var maxVal = Math.max.apply(null, groupData.map(function(g){ return g.val; })) || 1;
    var totalVal = groupData.reduce(function(s,g){ return s + g.val; }, 0) || 1;

    var svg = '<svg viewBox="0 0 300 200" width="100%" style="max-width:360px;display:block;margin:0 auto;">';
    var positions = [{x:75,y:70},{x:225,y:70},{x:150,y:65},{x:90,y:145},{x:210,y:145}];

    groupData.forEach(function(g, i) {
      var pos = positions[i];
      var ratio = g.val / maxVal;
      var r = 18 + ratio * 25;
      var delay = i * 0.12;

      svg += '<circle cx="'+pos.x+'" cy="'+pos.y+'" r="0" fill="'+g.color+'" opacity="0.12">';
      svg += '<animate attributeName="r" from="0" to="'+r+'" dur="0.6s" begin="'+delay+'s" fill="freeze"/>';
      svg += '</circle>';
      svg += '<circle cx="'+pos.x+'" cy="'+pos.y+'" r="0" fill="none" stroke="'+g.color+'" stroke-width="1" opacity="0.4">';
      svg += '<animate attributeName="r" from="0" to="'+r+'" dur="0.6s" begin="'+delay+'s" fill="freeze"/>';
      svg += '</circle>';

      if (g.val === maxVal) {
        svg += '<circle cx="'+pos.x+'" cy="'+pos.y+'" r="'+r+'" fill="none" stroke="'+g.color+'" stroke-width="0.5" opacity="0.3">';
        svg += '<animate attributeName="r" values="'+r+';'+(r+8)+';'+r+'" dur="2s" repeatCount="indefinite"/>';
        svg += '<animate attributeName="opacity" values="0.3;0.05;0.3" dur="2s" repeatCount="indefinite"/>';
        svg += '</circle>';
      }

      svg += '<text x="'+pos.x+'" y="'+(pos.y-4)+'" text-anchor="middle" fill="'+g.color+'" font-size="12" font-weight="700" opacity="0">';
      svg += g.name;
      svg += '<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="'+(delay+0.3)+'s" fill="freeze"/>';
      svg += '</text>';
      svg += '<text x="'+pos.x+'" y="'+(pos.y+10)+'" text-anchor="middle" fill="#8a7a5a" font-size="9" opacity="0">';
      svg += g.label+' '+g.val+'개';
      svg += '<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="'+(delay+0.3)+'s" fill="freeze"/>';
      svg += '</text>';
    });

    svg += '</svg>';
    el.innerHTML += svg;
    container.appendChild(el);
    observeSlot(el);
  }

  // ═══════════════════════════════════
  // CH4: 십이운성 — 에너지 곡선
  // ═══════════════════════════════════
  function renderCh4Unsung(container, db) {
    var unsung = db.unsung;
    if (!unsung) return;

    var el = document.createElement('div');
    el.className = 'cv-unsung-curve';
    el.innerHTML = '<div class="cv-section-label">에 너 지  곡 선</div>';

    var stages = ['절','태','양','장생','목욕','관대','건록','제왕','쇠','병','사','묘'];
    var stageValues = {};
    stages.forEach(function(s, i) { stageValues[s] = (12 - i) / 12; });

    var pillars = ['년주','월주','일주','시주'];
    var pillarLabels = ['년','월','일','시'];
    var vals = pillars.map(function(k) {
      var u = unsung[k.replace('주','')] || unsung[k] || '';
      return stageValues[u] !== undefined ? stageValues[u] : 0.5;
    });

    var svg = '<svg viewBox="0 0 300 160" width="100%" style="max-width:360px;display:block;margin:0 auto;">';

    for (var i = 0; i <= 4; i++) {
      var gy = 20 + i * 28;
      svg += '<line x1="40" y1="'+gy+'" x2="280" y2="'+gy+'" stroke="rgba(201,168,76,0.06)" stroke-width="0.5"/>';
    }

    var points = vals.map(function(v, i) {
      return { x: 70 + i * 60, y: 130 - v * 110, val: v };
    });

    var pathD = 'M' + points[0].x + ',' + points[0].y;
    for (var i = 1; i < points.length; i++) {
      var prev = points[i-1], curr = points[i];
      var cpx1 = prev.x + (curr.x - prev.x) * 0.4;
      var cpx2 = prev.x + (curr.x - prev.x) * 0.6;
      pathD += ' C'+cpx1+','+prev.y+' '+cpx2+','+curr.y+' '+curr.x+','+curr.y;
    }

    var areaD = pathD + ' L'+points[points.length-1].x+',132 L'+points[0].x+',132 Z';
    svg += '<defs><linearGradient id="cvUnsungGrad" x1="0" y1="0" x2="0" y2="1">';
    svg += '<stop offset="0%" stop-color="#c9a84c" stop-opacity="0.15"/>';
    svg += '<stop offset="100%" stop-color="#c9a84c" stop-opacity="0.01"/>';
    svg += '</linearGradient></defs>';
    svg += '<path d="'+areaD+'" fill="url(#cvUnsungGrad)" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.8s" fill="freeze"/></path>';

    svg += '<path d="'+pathD+'" fill="none" stroke="#c9a84c" stroke-width="2" stroke-linecap="round" stroke-dasharray="300" stroke-dashoffset="300">';
    svg += '<animate attributeName="stroke-dashoffset" from="300" to="0" dur="1.2s" fill="freeze"/>';
    svg += '</path>';

    points.forEach(function(pt, i) {
      var unsungName = unsung[pillars[i].replace('주','')] || unsung[pillars[i]] || '';
      var delay = 0.3 + i * 0.15;
      svg += '<circle cx="'+pt.x+'" cy="'+pt.y+'" r="0" fill="#c9a84c" stroke="#0a0a14" stroke-width="2">';
      svg += '<animate attributeName="r" from="0" to="5" dur="0.3s" begin="'+delay+'s" fill="freeze"/>';
      svg += '</circle>';
      svg += '<text x="'+pt.x+'" y="'+(pt.y-12)+'" text-anchor="middle" fill="#c9a84c" font-size="10" font-weight="700" opacity="0">';
      svg += unsungName;
      svg += '<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="'+delay+'s" fill="freeze"/>';
      svg += '</text>';
      svg += '<text x="'+pt.x+'" y="148" text-anchor="middle" fill="#6a6050" font-size="9">'+pillarLabels[i]+'</text>';
    });

    svg += '</svg>';
    el.innerHTML += svg;
    container.appendChild(el);
    observeSlot(el);
  }

  // ═══════════════════════════════════
  // CH5: 살·귀인 — 카드 플립
  // ═══════════════════════════════════
  function renderCh5Sinsal(container, db) {
    var sinsal = db.sinsal;
    if (!sinsal || sinsal.length === 0) return;

    var el = document.createElement('div');
    el.className = 'cv-sinsal-cards';
    el.innerHTML = '<div class="cv-section-label">살 · 귀 인</div>';

    var SINSAL_INFO = {
      '도화살': { icon: '🌸', desc: '매력·인기' }, '화개살': { icon: '🎨', desc: '예술·영감' },
      '역마살': { icon: '🐎', desc: '이동·변화' }, '천을귀인': { icon: '⭐', desc: '귀인·보호' },
      '천덕귀인': { icon: '🌟', desc: '덕·복' }, '월덕귀인': { icon: '🌙', desc: '은덕·자비' },
      '문창귀인': { icon: '📚', desc: '학문·지혜' }, '학당귀인': { icon: '🏫', desc: '배움·성장' }
    };

    var cardsHtml = '<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:12px;">';
    sinsal.forEach(function(name, i) {
      var info = null;
      for (var key in SINSAL_INFO) { if (name.indexOf(key) !== -1) { info = SINSAL_INFO[key]; break; } }
      if (!info) info = { icon: '✦', desc: '' };
      cardsHtml += '<div class="cv-sinsal-card" style="opacity:0;animation:cvCardFlip 0.6s ease both;animation-delay:'+(i*0.15)+'s;">';
      cardsHtml += '<div class="cv-sinsal-icon">'+info.icon+'</div>';
      cardsHtml += '<div class="cv-sinsal-name">'+name.replace(/\(.*\)/,'').trim()+'</div>';
      if (info.desc) cardsHtml += '<div class="cv-sinsal-desc">'+info.desc+'</div>';
      cardsHtml += '</div>';
    });

    if (db.gongmang && db.gongmang.hasGongmang) {
      cardsHtml += '<div class="cv-sinsal-card cv-gongmang" style="opacity:0;animation:cvCardFlip 0.6s ease both;animation-delay:'+(sinsal.length*0.15)+'s;">';
      cardsHtml += '<div class="cv-sinsal-icon">🕳️</div>';
      cardsHtml += '<div class="cv-sinsal-name">공망 '+(db.gongmang.hangeul||'')+'</div>';
      cardsHtml += '<div class="cv-sinsal-desc">비움·전환</div>';
      cardsHtml += '</div>';
    }

    cardsHtml += '</div>';
    el.innerHTML += cardsHtml;
    container.appendChild(el);
    observeSlot(el);
  }

  // ═══════════════════════════════════
  // CH6: 용신 — 오행 밸런스 스케일
  // ═══════════════════════════════════
  function renderCh6Yongshin(container, db) {
    var ys = db.yongShin;
    if (!ys) return;

    var el = document.createElement('div');
    el.className = 'cv-pillars-anim';
    el.innerHTML = '<div class="cv-section-label">용 신 · 희 신</div>';

    var yColor = OHENG_COLORS[ys.yongShin] || '#c9a84c';
    var hColor = OHENG_COLORS[ys.huiShin] || '#c9a84c';
    var gColor = OHENG_COLORS[ys.giShin] || '#666';

    var svg = '<svg viewBox="0 0 300 180" width="100%" style="max-width:360px;display:block;margin:0 auto;">';

    // 천칭 중심축
    svg += '<line x1="150" y1="20" x2="150" y2="80" stroke="rgba(201,168,76,0.3)" stroke-width="1"/>';
    svg += '<circle cx="150" cy="20" r="4" fill="#c9a84c" opacity="0.6"/>';

    // 수평 바 (기울어짐 애니메이션)
    svg += '<g><animateTransform attributeName="transform" type="rotate" from="0 150 80" to="-8 150 80" dur="1s" fill="freeze"/>';
    svg += '<line x1="50" y1="80" x2="250" y2="80" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round"/>';

    // 용신 (왼쪽 - 무거움)
    svg += '<g>';
    svg += '<line x1="80" y1="80" x2="80" y2="110" stroke="rgba(201,168,76,0.3)" stroke-width="0.5"/>';
    svg += '<circle cx="80" cy="120" r="28" fill="'+yColor+'" opacity="0.15">';
    svg += '<animate attributeName="r" from="0" to="28" dur="0.6s" fill="freeze"/>';
    svg += '</circle>';
    svg += '<circle cx="80" cy="120" r="28" fill="none" stroke="'+yColor+'" stroke-width="1.5" opacity="0.6">';
    svg += '<animate attributeName="r" from="0" to="28" dur="0.6s" fill="freeze"/>';
    svg += '</circle>';
    svg += '<text x="80" y="116" text-anchor="middle" fill="'+yColor+'" font-size="16" font-weight="700" font-family="Noto Serif KR,serif">'+(OHENG_LABELS[ys.yongShin]||'')+'</text>';
    svg += '<text x="80" y="132" text-anchor="middle" fill="'+yColor+'" font-size="9" opacity="0.8">용신</text>';
    svg += '</g>';

    // 희신 (오른쪽)
    svg += '<g>';
    svg += '<line x1="220" y1="80" x2="220" y2="100" stroke="rgba(201,168,76,0.3)" stroke-width="0.5"/>';
    svg += '<circle cx="220" cy="110" r="22" fill="'+hColor+'" opacity="0.12">';
    svg += '<animate attributeName="r" from="0" to="22" dur="0.6s" begin="0.2s" fill="freeze"/>';
    svg += '</circle>';
    svg += '<circle cx="220" cy="110" r="22" fill="none" stroke="'+hColor+'" stroke-width="1" opacity="0.5">';
    svg += '<animate attributeName="r" from="0" to="22" dur="0.6s" begin="0.2s" fill="freeze"/>';
    svg += '</circle>';
    svg += '<text x="220" y="106" text-anchor="middle" fill="'+hColor+'" font-size="14" font-weight="700" font-family="Noto Serif KR,serif">'+(OHENG_LABELS[ys.huiShin]||'')+'</text>';
    svg += '<text x="220" y="120" text-anchor="middle" fill="'+hColor+'" font-size="9" opacity="0.8">희신</text>';
    svg += '</g>';

    svg += '</g>';

    // 기신 하단
    if (ys.giShin) {
      svg += '<text x="150" y="170" text-anchor="middle" fill="#6a6050" font-size="9">기신 <tspan fill="'+gColor+'" font-weight="500">'+(OHENG_LABELS[ys.giShin]||ys.giShin)+'</tspan> · '+(ys.reasoning||'')+'</text>';
    }

    svg += '</svg>';
    el.innerHTML += svg;
    container.appendChild(el);
    observeSlot(el);
  }

  // ═══════════════════════════════════
  // CH7: 대운 — 타임라인 흐름
  // ═══════════════════════════════════
  function renderCh7Daeun(container, db) {
    var lc = db.luckCycles;
    if (!lc || !lc.daeun || lc.daeun.length === 0) return;

    var el = document.createElement('div');
    el.className = 'cv-pillars-anim';
    el.innerHTML = '<div class="cv-section-label">대 운  흐 름</div>';

    var daeun = lc.daeun;
    var currentAge = lc.currentDaeun ? lc.currentDaeun.age : null;
    var w = Math.max(daeun.length * 60, 300);

    var svg = '<svg viewBox="0 0 '+w+' 120" width="100%" style="display:block;margin:0 auto;overflow-x:auto;">';

    // 타임라인 기본선
    svg += '<line x1="20" y1="50" x2="'+(w-20)+'" y2="50" stroke="rgba(201,168,76,0.15)" stroke-width="1"/>';

    // 진행선 애니메이션
    svg += '<line x1="20" y1="50" x2="'+(w-20)+'" y2="50" stroke="#c9a84c" stroke-width="1.5" stroke-dasharray="'+(w-40)+'" stroke-dashoffset="'+(w-40)+'">';
    svg += '<animate attributeName="stroke-dashoffset" from="'+(w-40)+'" to="0" dur="1.5s" fill="freeze"/>';
    svg += '</line>';

    daeun.forEach(function(d, i) {
      var x = 30 + i * 60;
      var isCurrent = (d.age === currentAge);
      var delay = i * 0.08;
      var pillar = d.hangul || d.hanja || '';
      var age = d.age || '';

      // 점
      svg += '<circle cx="'+x+'" cy="50" r="0" fill="'+(isCurrent?'#c9a84c':'#12121f')+'" stroke="'+(isCurrent?'#c9a84c':'rgba(201,168,76,0.3)')+'" stroke-width="'+(isCurrent?'2':'1')+'">';
      svg += '<animate attributeName="r" from="0" to="'+(isCurrent?'7':'5')+'" dur="0.3s" begin="'+delay+'s" fill="freeze"/>';
      svg += '</circle>';

      // 현재 대운 펄스
      if (isCurrent) {
        svg += '<circle cx="'+x+'" cy="50" r="7" fill="none" stroke="#c9a84c" stroke-width="0.5" opacity="0.4">';
        svg += '<animate attributeName="r" values="7;14;7" dur="2s" repeatCount="indefinite"/>';
        svg += '<animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite"/>';
        svg += '</circle>';
      }

      // 기둥명
      svg += '<text x="'+x+'" y="30" text-anchor="middle" fill="'+(isCurrent?'#c9a84c':'#a09880')+'" font-size="'+(isCurrent?'13':'11')+'" font-weight="'+(isCurrent?'700':'400')+'" font-family="Noto Serif KR,serif" opacity="0">';
      svg += pillar;
      svg += '<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="'+(delay+0.15)+'s" fill="freeze"/>';
      svg += '</text>';

      // 나이
      svg += '<text x="'+x+'" y="75" text-anchor="middle" fill="#6a6050" font-size="9" opacity="0">';
      svg += age+'세';
      svg += '<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="'+(delay+0.15)+'s" fill="freeze"/>';
      svg += '</text>';
    });

    svg += '</svg>';
    el.innerHTML += svg;
    container.appendChild(el);
    observeSlot(el);
  }

  // ═══════════════════════════════════
  // CH8: 세운(올해 운세) — 월별 리듬
  // ═══════════════════════════════════
  function renderCh8Seun(container, db) {
    var lc = db.luckCycles;
    if (!lc || !lc.seun || lc.seun.length === 0) return;

    var el = document.createElement('div');
    el.className = 'cv-pillars-anim';
    el.innerHTML = '<div class="cv-section-label">세 운  흐 름</div>';

    var seun = lc.seun;
    var svg = '<svg viewBox="0 0 300 130" width="100%" style="max-width:360px;display:block;margin:0 auto;">';

    var barW = 36, gap = (300 - seun.length * barW) / (seun.length + 1);

    seun.forEach(function(s, i) {
      var x = gap + i * (barW + gap);
      var h = 20 + Math.random() * 50; // 높이는 시각적 구분용
      var isCurrent = (s.year === 2026);
      var delay = i * 0.1;
      var pillar = s.hangul || s.hanja || '';

      svg += '<rect x="'+x+'" y="'+(90-h)+'" width="'+barW+'" height="0" rx="4" fill="'+(isCurrent?'url(#cvSeunGradCurrent)':'url(#cvSeunGrad)')+'">';
      svg += '<animate attributeName="height" from="0" to="'+h+'" dur="0.5s" begin="'+delay+'s" fill="freeze"/>';
      svg += '<animate attributeName="y" from="90" to="'+(90-h)+'" dur="0.5s" begin="'+delay+'s" fill="freeze"/>';
      svg += '</rect>';

      if (isCurrent) {
        svg += '<rect x="'+x+'" y="'+(90-h-2)+'" width="'+barW+'" height="'+(h+2)+'" rx="4" fill="none" stroke="#e8c44c" stroke-width="1" opacity="0.4">';
        svg += '<animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite"/>';
        svg += '</rect>';
      }

      svg += '<text x="'+(x+barW/2)+'" y="106" text-anchor="middle" fill="'+(isCurrent?'#c9a84c':'#6a6050')+'" font-size="9" font-family="Noto Serif KR,serif">'+pillar+'</text>';
      svg += '<text x="'+(x+barW/2)+'" y="118" text-anchor="middle" fill="#3a3530" font-size="8">'+(s.year||'')+'</text>';
    });

    svg += '<defs>';
    svg += '<linearGradient id="cvSeunGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c9a84c" stop-opacity="0.6"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0.2"/></linearGradient>';
    svg += '<linearGradient id="cvSeunGradCurrent" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e8c44c" stop-opacity="0.9"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0.4"/></linearGradient>';
    svg += '</defs>';

    svg += '</svg>';
    el.innerHTML += svg;
    container.appendChild(el);
    observeSlot(el);
  }

  // ═══════════════════════════════════
  // CH9: 월운(2026) — 12개월 물결
  // ═══════════════════════════════════
  function renderCh9Monthly(container, db) {
    var monthly = db.monthly2026 || db.monthlyFortune;
    if (!monthly || monthly.length === 0) return;

    var el = document.createElement('div');
    el.className = 'cv-pillars-anim';
    el.innerHTML = '<div class="cv-section-label">2 0 2 6  월 운</div>';

    var svg = '<svg viewBox="0 0 380 140" width="100%" style="display:block;margin:0 auto;">';

    var points = monthly.map(function(m, i) {
      var x = 25 + i * 30;
      var y = 50 + Math.sin(i * 0.8) * 25 - (m.score || 50) * 0.3;
      return { x: x, y: Math.max(15, Math.min(100, y)) };
    });

    // 곡선
    var pathD = 'M' + points[0].x + ',' + points[0].y;
    for (var i = 1; i < points.length; i++) {
      var prev = points[i-1], curr = points[i];
      pathD += ' C'+(prev.x+15)+','+prev.y+' '+(curr.x-15)+','+curr.y+' '+curr.x+','+curr.y;
    }

    svg += '<path d="'+pathD+'" fill="none" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="500" stroke-dashoffset="500">';
    svg += '<animate attributeName="stroke-dashoffset" from="500" to="0" dur="2s" fill="freeze"/>';
    svg += '</path>';

    // 월 점 + 라벨
    points.forEach(function(pt, i) {
      var m = monthly[i];
      var delay = 0.2 + i * 0.1;
      var month = (i + 1) + '월';
      var pillar = m.hangul || m.hanja || '';

      svg += '<circle cx="'+pt.x+'" cy="'+pt.y+'" r="0" fill="#c9a84c" stroke="#0a0a14" stroke-width="1.5">';
      svg += '<animate attributeName="r" from="0" to="4" dur="0.2s" begin="'+delay+'s" fill="freeze"/>';
      svg += '</circle>';

      svg += '<text x="'+pt.x+'" y="118" text-anchor="middle" fill="#6a6050" font-size="8">'+month+'</text>';
      svg += '<text x="'+pt.x+'" y="130" text-anchor="middle" fill="#3a3530" font-size="7" font-family="Noto Serif KR,serif">'+pillar+'</text>';
    });

    svg += '</svg>';
    el.innerHTML += svg;
    container.appendChild(el);
    observeSlot(el);
  }

  // ═══════════════════════════════════
  // CH10~13: 텍스트 장식 (간결한 시각 요소)
  // ═══════════════════════════════════
  function renderChGeneric(container, chapterIndex) {
    var themes = [
      { label: '관 계 · 궁 합', icon: '💫', color: '#FF9800' },
      { label: '재 물 · 직 업', icon: '💰', color: '#FFC107' },
      { label: '건 강 · 리 듬', icon: '🌿', color: '#4CAF50' },
      { label: '종 합  메 시 지', icon: '✨', color: '#c9a84c' }
    ];
    var idx = chapterIndex - 9;
    if (idx < 0 || idx >= themes.length) return;

    var t = themes[idx];
    var el = document.createElement('div');
    el.className = 'cv-pillars-anim';

    var svg = '<svg viewBox="0 0 300 60" width="100%" style="max-width:360px;display:block;margin:0 auto;">';

    // 장식선 + 아이콘
    svg += '<line x1="40" y1="30" x2="120" y2="30" stroke="'+t.color+'" stroke-width="0.5" opacity="0" stroke-linecap="round">';
    svg += '<animate attributeName="opacity" from="0" to="0.4" dur="0.8s" fill="freeze"/>';
    svg += '<animate attributeName="x2" from="40" to="120" dur="0.8s" fill="freeze"/>';
    svg += '</line>';

    svg += '<text x="150" y="35" text-anchor="middle" fill="'+t.color+'" font-size="20" opacity="0">';
    svg += t.icon;
    svg += '<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.3s" fill="freeze"/>';
    svg += '</text>';

    svg += '<line x1="180" y1="30" x2="180" y2="30" stroke="'+t.color+'" stroke-width="0.5" opacity="0" stroke-linecap="round">';
    svg += '<animate attributeName="opacity" from="0" to="0.4" dur="0.8s" fill="freeze"/>';
    svg += '<animate attributeName="x2" from="180" to="260" dur="0.8s" fill="freeze"/>';
    svg += '</line>';

    svg += '</svg>';

    el.innerHTML = '<div class="cv-section-label">'+t.label+'</div>' + svg;
    container.appendChild(el);
    observeSlot(el);
  }

  // ═══════════════════════════════════
  // 메인: 챕터 인덱스로 분기
  // ═══════════════════════════════════
  function insertVisual(chapterIndex, container, dashboard) {
    if (!dashboard) return;
    switch(chapterIndex) {
      case 0: renderCh1Pillars(container, dashboard); break;
      case 1: renderCh2Oheng(container, dashboard); break;
      case 2: renderCh3Sipseong(container, dashboard); break;
      case 3: renderCh4Unsung(container, dashboard); break;
      case 4: renderCh5Sinsal(container, dashboard); break;
      case 5: renderCh6Yongshin(container, dashboard); break;
      case 6: renderCh7Daeun(container, dashboard); break;
      case 7: renderCh8Seun(container, dashboard); break;
      case 8: renderCh9Monthly(container, dashboard); break;
      case 9:  renderChGeneric(container, chapterIndex); break;
      case 10: renderChGeneric(container, chapterIndex); break;
      case 11: renderChGeneric(container, chapterIndex); break;
      case 12: renderChGeneric(container, chapterIndex); break;
    }
  }

  return { insertVisual: insertVisual };

})();
