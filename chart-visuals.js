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

      // 기둥 배경
      svg += '<g class="cv-pillar-group" style="animation:cvPillarRise 0.6s ease both;animation-delay:'+delay+'s;">';

      // 천간 박스
      svg += '<rect x="'+(x-30)+'" y="20" width="60" height="70" rx="6" fill="rgba(201,168,76,0.04)" stroke="'+(isDay?'#c9a84c':'rgba(201,168,76,0.15)')+'" stroke-width="'+(isDay?'1.5':'0.5')+'"/>';

      // 라벨
      svg += '<text x="'+x+'" y="14" text-anchor="middle" fill="#6a6050" font-size="9" letter-spacing="2">'+key+'</text>';

      // 천간
      svg += '<text x="'+x+'" y="60" text-anchor="middle" fill="'+ganColor+'" font-size="26" font-weight="700" font-family="Noto Serif KR,serif">'+gan+'</text>';

      // 오행 태그 (천간)
      if (ganOheng) {
        svg += '<circle cx="'+x+'" cy="80" r="8" fill="'+ganColor+'" opacity="0.15"/>';
        svg += '<text x="'+x+'" y="83" text-anchor="middle" fill="'+ganColor+'" font-size="7">'+ganOheng+'</text>';
      }

      // 지지 박스
      svg += '<rect x="'+(x-30)+'" y="100" width="60" height="70" rx="6" fill="rgba(201,168,76,0.02)" stroke="'+(isDay?'#c9a84c':'rgba(201,168,76,0.1)')+'" stroke-width="'+(isDay?'1.5':'0.5')+'"/>';

      // 지지
      svg += '<text x="'+x+'" y="142" text-anchor="middle" fill="'+jiColor+'" font-size="26" font-weight="700" font-family="Noto Serif KR,serif">'+ji+'</text>';

      // 오행 태그 (지지)
      if (jiOheng) {
        svg += '<circle cx="'+x+'" cy="162" r="8" fill="'+jiColor+'" opacity="0.15"/>';
        svg += '<text x="'+x+'" y="165" text-anchor="middle" fill="'+jiColor+'" font-size="7">'+jiOheng+'</text>';
      }

      svg += '</g>';

      // 일주 강조 펄스
      if (isDay) {
        svg += '<circle cx="'+x+'" cy="100" r="38" fill="none" stroke="#c9a84c" stroke-width="0.5" opacity="0.4">';
        svg += '<animate attributeName="r" values="38;44;38" dur="2s" repeatCount="indefinite"/>';
        svg += '<animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite"/>';
        svg += '</circle>';
      }
    });

    // 일간 배지
    if (dm.gan) {
      var dmColor = OHENG_COLORS[dm.oheng] || '#c9a84c';
      svg += '<rect x="130" y="188" width="100" height="24" rx="12" fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,0.2)" stroke-width="0.5"/>';
      svg += '<text x="180" y="204" text-anchor="middle" fill="'+dmColor+'" font-size="10" font-family="Noto Serif KR,serif">일간 <tspan font-weight="700">'+dm.gan+'</tspan> · '+( dm.oheng||'')+'</text>';
    }

    svg += '</svg>';
    el.innerHTML += svg;
    container.appendChild(el);
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

    // 배경 오각형 (3단계)
    [1, 0.66, 0.33].forEach(function(scale) {
      var pts = [];
      for (var i = 0; i < 5; i++) {
        var angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
        pts.push((cx + maxR * scale * Math.cos(angle)).toFixed(1) + ',' + (cy + maxR * scale * Math.sin(angle)).toFixed(1));
      }
      svg += '<polygon points="'+pts.join(' ')+'" fill="none" stroke="rgba(201,168,76,0.1)" stroke-width="0.5"/>';
    });

    // 축선
    for (var i = 0; i < 5; i++) {
      var angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
      var ex = cx + maxR * Math.cos(angle);
      var ey = cy + maxR * Math.sin(angle);
      svg += '<line x1="'+cx+'" y1="'+cy+'" x2="'+ex.toFixed(1)+'" y2="'+ey.toFixed(1)+'" stroke="rgba(201,168,76,0.08)" stroke-width="0.5"/>';
    }

    // 데이터 다각형
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

    // 꼭짓점 + 라벨
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

      // 데이터 점
      svg += '<circle cx="'+dx.toFixed(1)+'" cy="'+dy.toFixed(1)+'" r="4" fill="'+color+'" opacity="0.9">';
      svg += '<animate attributeName="r" values="0;4" dur="0.5s" begin="'+(0.3+i*0.1)+'s" fill="freeze"/>';
      svg += '</circle>';

      // 라벨
      svg += '<text x="'+lx.toFixed(1)+'" y="'+(ly-4).toFixed(1)+'" text-anchor="middle" fill="'+color+'" font-size="13" font-weight="700">'+OHENG_LABELS[keys[i]]+'</text>';
      svg += '<text x="'+lx.toFixed(1)+'" y="'+(ly+10).toFixed(1)+'" text-anchor="middle" fill="#8a7a5a" font-size="9">'+pct+'%</text>';
    }

    // 용신 표시
    if (db.yongShin) {
      var ys = db.yongShin;
      svg += '<text x="150" y="268" text-anchor="middle" fill="#c9a84c" font-size="10" font-family="Noto Serif KR,serif">';
      svg += '용신 <tspan font-weight="700" fill="'+( OHENG_COLORS[ys.yongShin]||'#c9a84c')+'">'+( ys.yongShin||'')+'</tspan>';
      svg += '  ·  희신 <tspan font-weight="700" fill="'+( OHENG_COLORS[ys.huiShin]||'#c9a84c')+'">'+( ys.huiShin||'')+'</tspan>';
      svg += '</text>';
    }

    svg += '</svg>';
    el.innerHTML += svg;
    container.appendChild(el);
  }

  // ═══════════════════════════════════
  // CH3: 십성 — 원형 버블 맵
  // ═══════════════════════════════════
  function renderCh3Sipseong(container, db) {
    var counts = db.sipseongCounts;
    if (!counts) return;

    var groups = counts.groups || {};
    var detail = counts.detail || {};

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

    var positions = [
      {x:75, y:70}, {x:225, y:70}, {x:150, y:65},
      {x:90, y:145}, {x:210, y:145}
    ];

    groupData.forEach(function(g, i) {
      var pos = positions[i];
      var ratio = g.val / maxVal;
      var r = 18 + ratio * 25;
      var pct = Math.round(g.val / totalVal * 100);
      var delay = i * 0.12;

      // 버블
      svg += '<circle cx="'+pos.x+'" cy="'+pos.y+'" r="0" fill="'+g.color+'" opacity="0.12">';
      svg += '<animate attributeName="r" from="0" to="'+r+'" dur="0.6s" begin="'+delay+'s" fill="freeze"/>';
      svg += '</circle>';
      svg += '<circle cx="'+pos.x+'" cy="'+pos.y+'" r="0" fill="none" stroke="'+g.color+'" stroke-width="1" opacity="0.4">';
      svg += '<animate attributeName="r" from="0" to="'+r+'" dur="0.6s" begin="'+delay+'s" fill="freeze"/>';
      svg += '</circle>';

      // 맥동 (가장 큰 그룹)
      if (g.val === maxVal) {
        svg += '<circle cx="'+pos.x+'" cy="'+pos.y+'" r="'+r+'" fill="none" stroke="'+g.color+'" stroke-width="0.5" opacity="0.3">';
        svg += '<animate attributeName="r" values="'+r+';'+(r+8)+';'+r+'" dur="2s" repeatCount="indefinite"/>';
        svg += '<animate attributeName="opacity" values="0.3;0.05;0.3" dur="2s" repeatCount="indefinite"/>';
        svg += '</circle>';
      }

      // 텍스트
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

    // 배경 그리드
    for (var i = 0; i <= 4; i++) {
      var gy = 20 + i * 28;
      svg += '<line x1="40" y1="'+gy+'" x2="280" y2="'+gy+'" stroke="rgba(201,168,76,0.06)" stroke-width="0.5"/>';
    }

    // 데이터 포인트 좌표
    var points = vals.map(function(v, i) {
      var px = 70 + i * 60;
      var py = 130 - v * 110;
      return { x: px, y: py, val: v };
    });

    // 곡선 경로
    var pathD = 'M' + points[0].x + ',' + points[0].y;
    for (var i = 1; i < points.length; i++) {
      var prev = points[i-1];
      var curr = points[i];
      var cpx1 = prev.x + (curr.x - prev.x) * 0.4;
      var cpx2 = prev.x + (curr.x - prev.x) * 0.6;
      pathD += ' C'+cpx1+','+prev.y+' '+cpx2+','+curr.y+' '+curr.x+','+curr.y;
    }

    // 그라데이션 영역
    var areaD = pathD + ' L'+points[points.length-1].x+',132 L'+points[0].x+',132 Z';
    svg += '<defs><linearGradient id="cvUnsungGrad" x1="0" y1="0" x2="0" y2="1">';
    svg += '<stop offset="0%" stop-color="#c9a84c" stop-opacity="0.15"/>';
    svg += '<stop offset="100%" stop-color="#c9a84c" stop-opacity="0.01"/>';
    svg += '</linearGradient></defs>';
    svg += '<path d="'+areaD+'" fill="url(#cvUnsungGrad)">';
    svg += '<animate attributeName="opacity" from="0" to="1" dur="0.8s" fill="freeze"/>';
    svg += '</path>';

    // 라인
    svg += '<path d="'+pathD+'" fill="none" stroke="#c9a84c" stroke-width="2" stroke-linecap="round" stroke-dasharray="300" stroke-dashoffset="300">';
    svg += '<animate attributeName="stroke-dashoffset" from="300" to="0" dur="1.2s" fill="freeze"/>';
    svg += '</path>';

    // 포인트 + 라벨
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
      '도화살': { icon: '🌸', desc: '매력·인기' },
      '화개살': { icon: '🎨', desc: '예술·영감' },
      '역마살': { icon: '🐎', desc: '이동·변화' },
      '천을귀인': { icon: '⭐', desc: '귀인·보호' },
      '천덕귀인': { icon: '🌟', desc: '덕·복' },
      '월덕귀인': { icon: '🌙', desc: '은덕·자비' },
      '문창귀인': { icon: '📚', desc: '학문·지혜' },
      '학당귀인': { icon: '🏫', desc: '배움·성장' }
    };

    var cardsHtml = '<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:12px;">';

    sinsal.forEach(function(name, i) {
      var info = null;
      for (var key in SINSAL_INFO) {
        if (name.indexOf(key) !== -1) { info = SINSAL_INFO[key]; break; }
      }
      if (!info) info = { icon: '✦', desc: '' };

      var delay = i * 0.15;
      cardsHtml += '<div class="cv-sinsal-card" style="animation:cvCardFlip 0.6s ease both;animation-delay:'+delay+'s;">';
      cardsHtml += '<div class="cv-sinsal-icon">'+info.icon+'</div>';
      cardsHtml += '<div class="cv-sinsal-name">'+name.replace(/\(.*\)/,'').trim()+'</div>';
      if (info.desc) cardsHtml += '<div class="cv-sinsal-desc">'+info.desc+'</div>';
      cardsHtml += '</div>';
    });

    // 공망 표시
    if (db.gongmang && db.gongmang.hasGongmang) {
      cardsHtml += '<div class="cv-sinsal-card cv-gongmang" style="animation:cvCardFlip 0.6s ease both;animation-delay:'+( sinsal.length*0.15)+'s;">';
      cardsHtml += '<div class="cv-sinsal-icon">🕳️</div>';
      cardsHtml += '<div class="cv-sinsal-name">공망 '+( db.gongmang.hangeul||'')+'</div>';
      cardsHtml += '<div class="cv-sinsal-desc">비움·전환</div>';
      cardsHtml += '</div>';
    }

    cardsHtml += '</div>';
    el.innerHTML += cardsHtml;
    container.appendChild(el);
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
    }
  }

  // public
  return { insertVisual: insertVisual };

})();
