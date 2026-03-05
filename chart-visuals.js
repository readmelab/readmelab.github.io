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
  // 스크롤 트리거
  // ═══════════════════════════════════
  function observeSlot(container) {
    if (!('IntersectionObserver' in window)) {
      container.classList.add('cv-visible');
      return;
    }
    container.style.opacity = '0';
    container.style.transform = 'translateY(24px)';
    container.style.transition = 'opacity 1s ease, transform 1s ease';

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // 등장 애니메이션
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.classList.add('cv-visible');

          // SVG animate 재시작
          var svgs = entry.target.querySelectorAll('svg');
          svgs.forEach(function(svg) {
            if (svg.pauseAnimations) {
              svg.pauseAnimations();
              svg.setCurrentTime(0);
              svg.unpauseAnimations();
            }
          });

          // 등장 후 미세 반복 애니메이션 시작 (2초 뒤)
          setTimeout(function() {
            entry.target.style.transition = 'transform 3s ease-in-out';
            var phase = 0;
            setInterval(function() {
              if (!document.body.contains(entry.target)) return;
              phase++;
              var y = Math.sin(phase * 0.5) * 3;  // 위아래 3px
              var s = 1 + Math.sin(phase * 0.3) * 0.003; // 0.3% 스케일
              entry.target.style.transform = 'translateY(' + y + 'px) scale(' + s + ')';
            }, 2000);
          }, 2000);

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    observer.observe(container);
  }

  // ═══════════════════════════════════
  // CH1: 사주팔자 — 네 기둥
  // ═══════════════════════════════════
  function renderCh1(container, db) {
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
      var gan = p.gan || '—', ji = p.ji || '—';
      var ganOheng = p.ganOheng || '', jiOheng = p.jiOheng || '';
      var ganColor = OHENG_COLORS[ganOheng] || '#c9a84c';
      var jiColor = OHENG_COLORS[jiOheng] || '#c9a84c';
      var x = 45 + i * 90, isDay = (key === '일주'), delay = (3 - i) * 0.15;
      svg += '<g style="opacity:0;animation:cvPillarRise 0.6s ease both;animation-delay:'+delay+'s;">';
      svg += '<rect x="'+(x-30)+'" y="20" width="60" height="70" rx="6" fill="rgba(201,168,76,0.04)" stroke="'+(isDay?'#c9a84c':'rgba(201,168,76,0.15)')+'" stroke-width="'+(isDay?'1.5':'0.5')+'"/>';
      svg += '<text x="'+x+'" y="14" text-anchor="middle" fill="#6a6050" font-size="9" letter-spacing="2">'+key+'</text>';
      svg += '<text x="'+x+'" y="60" text-anchor="middle" fill="'+ganColor+'" font-size="26" font-weight="700" font-family="Noto Serif KR,serif">'+gan+'</text>';
      if (ganOheng) { svg += '<circle cx="'+x+'" cy="80" r="8" fill="'+ganColor+'" opacity="0.15"/>'; svg += '<text x="'+x+'" y="83" text-anchor="middle" fill="'+ganColor+'" font-size="7">'+ganOheng+'</text>'; }
      svg += '<rect x="'+(x-30)+'" y="100" width="60" height="70" rx="6" fill="rgba(201,168,76,0.02)" stroke="'+(isDay?'#c9a84c':'rgba(201,168,76,0.1)')+'" stroke-width="'+(isDay?'1.5':'0.5')+'"/>';
      svg += '<text x="'+x+'" y="142" text-anchor="middle" fill="'+jiColor+'" font-size="26" font-weight="700" font-family="Noto Serif KR,serif">'+ji+'</text>';
      if (jiOheng) { svg += '<circle cx="'+x+'" cy="162" r="8" fill="'+jiColor+'" opacity="0.15"/>'; svg += '<text x="'+x+'" y="165" text-anchor="middle" fill="'+jiColor+'" font-size="7">'+jiOheng+'</text>'; }
      svg += '</g>';
      if (isDay) {
        svg += '<circle cx="'+x+'" cy="100" r="38" fill="none" stroke="#c9a84c" stroke-width="0.5" opacity="0.4"><animate attributeName="r" values="38;44;38" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite"/></circle>';
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
  // CH2: 오행 — 레이더
  // ═══════════════════════════════════
  function renderCh2(container, db) {
    var oheng = db.ohengDistribution;
    if (!oheng) return;
    var keys = ['목','화','토','금','수'], values = [], total = 0;
    keys.forEach(function(k) {
      var v = 0;
      if (oheng[k]) v = typeof oheng[k] === 'object' ? (oheng[k].count || 0) : Number(oheng[k]) || 0;
      values.push(v); total += v;
    });
    if (total === 0) return;
    var el = document.createElement('div');
    el.className = 'cv-oheng-radar';
    el.innerHTML = '<div class="cv-section-label">오 행 분 포</div>';
    var cx = 150, cy = 130, maxR = 90;
    var svg = '<svg viewBox="0 0 300 280" width="100%" style="max-width:360px;display:block;margin:0 auto;">';
    [1, 0.66, 0.33].forEach(function(scale) {
      var pts = [];
      for (var i = 0; i < 5; i++) { var a = (Math.PI*2*i/5)-Math.PI/2; pts.push((cx+maxR*scale*Math.cos(a)).toFixed(1)+','+(cy+maxR*scale*Math.sin(a)).toFixed(1)); }
      svg += '<polygon points="'+pts.join(' ')+'" fill="none" stroke="rgba(201,168,76,0.1)" stroke-width="0.5"/>';
    });
    for (var i = 0; i < 5; i++) { var a = (Math.PI*2*i/5)-Math.PI/2; svg += '<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+maxR*Math.cos(a)).toFixed(1)+'" y2="'+(cy+maxR*Math.sin(a)).toFixed(1)+'" stroke="rgba(201,168,76,0.08)" stroke-width="0.5"/>'; }
    var maxVal = Math.max.apply(null, values) || 1, dp = [];
    for (var i = 0; i < 5; i++) { var a = (Math.PI*2*i/5)-Math.PI/2, r = maxR*Math.max(values[i]/maxVal, 0.08); dp.push((cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1)); }
    svg += '<polygon points="'+dp.join(' ')+'" fill="rgba(201,168,76,0.1)" stroke="#c9a84c" stroke-width="1.5"><animate attributeName="opacity" from="0" to="1" dur="0.8s" fill="freeze"/></polygon>';
    for (var i = 0; i < 5; i++) {
      var a = (Math.PI*2*i/5)-Math.PI/2, r = maxR*Math.max(values[i]/maxVal, 0.08);
      var dx = cx+r*Math.cos(a), dy = cy+r*Math.sin(a), lx = cx+(maxR+20)*Math.cos(a), ly = cy+(maxR+20)*Math.sin(a);
      var pct = Math.round(values[i]/total*100), color = OHENG_COLORS[keys[i]];
      svg += '<circle cx="'+dx.toFixed(1)+'" cy="'+dy.toFixed(1)+'" r="4" fill="'+color+'"><animate attributeName="r" values="0;4" dur="0.5s" begin="'+(0.3+i*0.1)+'s" fill="freeze"/></circle>';
      svg += '<text x="'+lx.toFixed(1)+'" y="'+(ly-4).toFixed(1)+'" text-anchor="middle" fill="'+color+'" font-size="13" font-weight="700">'+OHENG_LABELS[keys[i]]+'</text>';
      svg += '<text x="'+lx.toFixed(1)+'" y="'+(ly+10).toFixed(1)+'" text-anchor="middle" fill="#8a7a5a" font-size="9">'+pct+'%</text>';
    }
    svg += '</svg>';
    el.innerHTML += svg;
    container.appendChild(el);
    observeSlot(el);
  }

  // ═══════════════════════════════════
  // CH3: 십성 — 버블 맵
  // ═══════════════════════════════════
  function renderCh3(container, db) {
    var counts = db.sipseongCounts;
    if (!counts) return;
    var groups = counts.groups || {};
    var el = document.createElement('div');
    el.className = 'cv-sipseong-map';
    el.innerHTML = '<div class="cv-section-label">십 성 분 포</div>';
    var gd = [
      {name:'비겁',label:'자아',color:'#F44336',val:groups['비겁']||0},
      {name:'식상',label:'표현',color:'#FF9800',val:groups['식상']||0},
      {name:'재성',label:'재물',color:'#FFC107',val:groups['재성']||0},
      {name:'관성',label:'명예',color:'#2196F3',val:groups['관성']||0},
      {name:'인성',label:'지혜',color:'#9C27B0',val:groups['인성']||0}
    ];
    var maxVal = Math.max.apply(null, gd.map(function(g){return g.val;})) || 1;
    var totalVal = gd.reduce(function(s,g){return s+g.val;},0) || 1;
    var svg = '<svg viewBox="0 0 300 200" width="100%" style="max-width:360px;display:block;margin:0 auto;">';
    var pos = [{x:75,y:70},{x:225,y:70},{x:150,y:65},{x:90,y:145},{x:210,y:145}];
    gd.forEach(function(g, i) {
      var p = pos[i], ratio = g.val/maxVal, r = 18+ratio*25, delay = i*0.12;
      svg += '<circle cx="'+p.x+'" cy="'+p.y+'" r="0" fill="'+g.color+'" opacity="0.12"><animate attributeName="r" from="0" to="'+r+'" dur="0.6s" begin="'+delay+'s" fill="freeze"/></circle>';
      svg += '<circle cx="'+p.x+'" cy="'+p.y+'" r="0" fill="none" stroke="'+g.color+'" stroke-width="1" opacity="0.4"><animate attributeName="r" from="0" to="'+r+'" dur="0.6s" begin="'+delay+'s" fill="freeze"/></circle>';
      if (g.val === maxVal) { svg += '<circle cx="'+p.x+'" cy="'+p.y+'" r="'+r+'" fill="none" stroke="'+g.color+'" stroke-width="0.5" opacity="0.3"><animate attributeName="r" values="'+r+';'+(r+8)+';'+r+'" dur="2s" repeatCount="indefinite"/></circle>'; }
      svg += '<text x="'+p.x+'" y="'+(p.y-4)+'" text-anchor="middle" fill="'+g.color+'" font-size="12" font-weight="700" opacity="0">'+g.name+'<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="'+(delay+0.3)+'s" fill="freeze"/></text>';
      svg += '<text x="'+p.x+'" y="'+(p.y+10)+'" text-anchor="middle" fill="#8a7a5a" font-size="9" opacity="0">'+g.label+' '+g.val+'개<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="'+(delay+0.3)+'s" fill="freeze"/></text>';
    });
    svg += '</svg>';
    el.innerHTML += svg;
    container.appendChild(el);
    observeSlot(el);
  }

  // ═══════════════════════════════════
  // CH4: 십이운성 — 에너지 곡선
  // ═══════════════════════════════════
  function renderCh4(container, db) {
    var unsung = db.unsung;
    if (!unsung) return;
    var el = document.createElement('div');
    el.className = 'cv-unsung-curve';
    el.innerHTML = '<div class="cv-section-label">에 너 지  곡 선</div>';
    var stages = ['절','태','양','장생','목욕','관대','건록','제왕','쇠','병','사','묘'];
    var sv = {}; stages.forEach(function(s,i){sv[s]=(12-i)/12;});
    var keys = ['year','month','day','hour'], labels = ['년','월','일','시'];
    var vals = keys.map(function(k){ var u = unsung[k]||''; return sv[u]!==undefined?sv[u]:0.5; });
    var svg = '<svg viewBox="0 0 300 160" width="100%" style="max-width:360px;display:block;margin:0 auto;">';
    for(var i=0;i<=4;i++){svg+='<line x1="40" y1="'+(20+i*28)+'" x2="280" y2="'+(20+i*28)+'" stroke="rgba(201,168,76,0.06)" stroke-width="0.5"/>';}
    var pts = vals.map(function(v,i){return{x:70+i*60,y:130-v*110};});
    var pathD = 'M'+pts[0].x+','+pts[0].y;
    for(var i=1;i<pts.length;i++){var pr=pts[i-1],cu=pts[i];pathD+=' C'+(pr.x+(cu.x-pr.x)*0.4)+','+pr.y+' '+(pr.x+(cu.x-pr.x)*0.6)+','+cu.y+' '+cu.x+','+cu.y;}
    svg += '<defs><linearGradient id="cvUG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c9a84c" stop-opacity="0.15"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0.01"/></linearGradient></defs>';
    svg += '<path d="'+pathD+' L'+pts[3].x+',132 L'+pts[0].x+',132 Z" fill="url(#cvUG)" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.8s" fill="freeze"/></path>';
    svg += '<path d="'+pathD+'" fill="none" stroke="#c9a84c" stroke-width="2" stroke-linecap="round" stroke-dasharray="300" stroke-dashoffset="300"><animate attributeName="stroke-dashoffset" from="300" to="0" dur="1.2s" fill="freeze"/></path>';
    pts.forEach(function(pt,i){
      var nm = unsung[keys[i]]||'', d=0.3+i*0.15;
      svg+='<circle cx="'+pt.x+'" cy="'+pt.y+'" r="0" fill="#c9a84c" stroke="#0a0a14" stroke-width="2"><animate attributeName="r" from="0" to="5" dur="0.3s" begin="'+d+'s" fill="freeze"/></circle>';
      svg+='<text x="'+pt.x+'" y="'+(pt.y-12)+'" text-anchor="middle" fill="#c9a84c" font-size="10" font-weight="700" opacity="0">'+nm+'<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="'+d+'s" fill="freeze"/></text>';
      svg+='<text x="'+pt.x+'" y="148" text-anchor="middle" fill="#6a6050" font-size="9">'+labels[i]+'</text>';
    });
    svg += '</svg>';
    el.innerHTML += svg; container.appendChild(el); observeSlot(el);
  }

  // ═══════════════════════════════════
  // CH5: 살·귀인 — 카드 플립
  // ═══════════════════════════════════
  function renderCh5(container, db) {
    var sinsal = db.sinsal;
    if (!sinsal || sinsal.length === 0) return;
    var el = document.createElement('div');
    el.className = 'cv-sinsal-cards';
    el.innerHTML = '<div class="cv-section-label">살 · 귀 인</div>';
    var INFO = {'도화살':{icon:'🌸',desc:'매력·인기'},'화개살':{icon:'🎨',desc:'예술·영감'},'역마살':{icon:'🐎',desc:'이동·변화'},'천을귀인':{icon:'⭐',desc:'귀인·보호'},'천덕귀인':{icon:'🌟',desc:'덕·복'},'월덕귀인':{icon:'🌙',desc:'은덕·자비'},'문창귀인':{icon:'📚',desc:'학문·지혜'},'학당귀인':{icon:'🏫',desc:'배움·성장'}};
    var html = '<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:12px;">';
    sinsal.forEach(function(name,i){
      var info=null; for(var k in INFO){if(name.indexOf(k)!==-1){info=INFO[k];break;}} if(!info) info={icon:'✦',desc:''};
      html+='<div class="cv-sinsal-card" style="opacity:0;animation:cvCardFlip 0.6s ease both;animation-delay:'+(i*0.15)+'s;"><div class="cv-sinsal-icon">'+info.icon+'</div><div class="cv-sinsal-name">'+name.replace(/\(.*\)/,'').trim()+'</div>'+(info.desc?'<div class="cv-sinsal-desc">'+info.desc+'</div>':'')+'</div>';
    });
    if(db.gongmang&&db.gongmang.hasGongmang){html+='<div class="cv-sinsal-card cv-gongmang" style="opacity:0;animation:cvCardFlip 0.6s ease both;animation-delay:'+(sinsal.length*0.15)+'s;"><div class="cv-sinsal-icon">🕳️</div><div class="cv-sinsal-name">공망 '+(db.gongmang.hangeul||'')+'</div><div class="cv-sinsal-desc">비움·전환</div></div>';}
    html += '</div>';
    el.innerHTML += html; container.appendChild(el); observeSlot(el);
  }

  // ═══════════════════════════════════
  // CH6: 사주×MBTI 교차 — 벤 다이어그램
  // ═══════════════════════════════════
  function renderCh6(container, db) {
    var el = document.createElement('div');
    el.className = 'cv-pillars-anim';
    el.innerHTML = '<div class="cv-section-label">사 주  ×  M B T I</div>';
    var dm = db.dayMaster || {};
    var ys = db.yongShin || {};
    var mbti = db.mbti || (db.customerInfo && db.customerInfo.mbti) || '';
    var dmOheng = dm.oheng || '';
    var dmColor = OHENG_COLORS[dmOheng] || '#c9a84c';
    var strength = db.strength || {};
    var strengthText = strength.result || '';

    var svg = '<svg viewBox="0 0 300 200" width="100%" style="max-width:360px;display:block;margin:0 auto;">';

    // 사주 원 (왼쪽)
    svg += '<circle cx="115" cy="95" r="0" fill="'+dmColor+'" opacity="0.08"><animate attributeName="r" from="0" to="70" dur="0.8s" fill="freeze"/></circle>';
    svg += '<circle cx="115" cy="95" r="0" fill="none" stroke="'+dmColor+'" stroke-width="1" opacity="0.4"><animate attributeName="r" from="0" to="70" dur="0.8s" fill="freeze"/></circle>';

    // MBTI 원 (오른쪽)
    svg += '<circle cx="185" cy="95" r="0" fill="#6C63FF" opacity="0.08"><animate attributeName="r" from="0" to="70" dur="0.8s" begin="0.2s" fill="freeze"/></circle>';
    svg += '<circle cx="185" cy="95" r="0" fill="none" stroke="#6C63FF" stroke-width="1" opacity="0.4"><animate attributeName="r" from="0" to="70" dur="0.8s" begin="0.2s" fill="freeze"/></circle>';

    // 교차 영역 펄스
    svg += '<ellipse cx="150" cy="95" rx="30" ry="55" fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,0.2)" stroke-width="0.5" stroke-dasharray="4,4"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite"/></ellipse>';

    // 사주 라벨
    svg += '<text x="80" y="85" text-anchor="middle" fill="'+dmColor+'" font-size="11" font-weight="700" opacity="0">사주<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.5s" fill="freeze"/></text>';
    svg += '<text x="80" y="102" text-anchor="middle" fill="'+dmColor+'" font-size="16" font-weight="700" font-family="Noto Serif KR,serif" opacity="0">'+(OHENG_LABELS[dmOheng]||dm.gan||'')+'<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.6s" fill="freeze"/></text>';
    if (strengthText) { svg += '<text x="80" y="118" text-anchor="middle" fill="#6a6050" font-size="9" opacity="0">'+strengthText+'<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.7s" fill="freeze"/></text>'; }

    // MBTI 라벨
    svg += '<text x="220" y="85" text-anchor="middle" fill="#6C63FF" font-size="11" font-weight="700" opacity="0">MBTI<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.5s" fill="freeze"/></text>';
    svg += '<text x="220" y="105" text-anchor="middle" fill="#6C63FF" font-size="18" font-weight="700" font-family="Noto Sans KR,sans-serif" opacity="0">'+(mbti||'?')+'<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.6s" fill="freeze"/></text>';

    // 교차 라벨
    svg += '<text x="150" y="90" text-anchor="middle" fill="#c9a84c" font-size="9" font-weight="500" opacity="0">교차점<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.8s" fill="freeze"/></text>';
    svg += '<text x="150" y="105" text-anchor="middle" fill="#c9a84c" font-size="11" font-weight="700" opacity="0">운명 코드<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.9s" fill="freeze"/></text>';

    // 용신·희신 하단
    if (ys.yongShin) {
      svg += '<text x="150" y="185" text-anchor="middle" fill="#6a6050" font-size="9" opacity="0">용신 <tspan fill="'+(OHENG_COLORS[ys.yongShin]||'#c9a84c')+'" font-weight="700">'+ys.yongShin+'</tspan> · 희신 <tspan fill="'+(OHENG_COLORS[ys.huiShin]||'#c9a84c')+'" font-weight="700">'+(ys.huiShin||'')+'</tspan><animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="1s" fill="freeze"/></text>';
    }

    svg += '</svg>';
    el.innerHTML += svg; container.appendChild(el); observeSlot(el);
  }

  // ═══════════════════════════════════
  // CH7: 올해 운세 총론 — 세운 + 용신 밸런스
  // ═══════════════════════════════════
  function renderCh7(container, db) {
    var lc = db.luckCycles;
    if (!lc) return;
    var seun = lc.currentSeun || lc.seun || [];
    var currentSeun = null;
    seun.forEach(function(s){ if(s.year===2026) currentSeun = s; });
    if (!currentSeun && seun.length > 0) currentSeun = seun[0];
    var ys = db.yongShin || {};
    var el = document.createElement('div');
    el.className = 'cv-pillars-anim';
    el.innerHTML = '<div class="cv-section-label">2 0 2 6  운 세  총 론</div>';

    var svg = '<svg viewBox="0 0 300 160" width="100%" style="max-width:360px;display:block;margin:0 auto;">';

    // 올해 세운 중앙
    if (currentSeun) {
      var pillar = currentSeun.pillar || currentSeun.hangul || currentSeun.hanja || '';
      svg += '<circle cx="150" cy="70" r="0" fill="rgba(201,168,76,0.08)" stroke="#c9a84c" stroke-width="1.5"><animate attributeName="r" from="0" to="50" dur="0.8s" fill="freeze"/></circle>';
      svg += '<text x="150" y="60" text-anchor="middle" fill="#6a6050" font-size="9" opacity="0">2026 세운<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.5s" fill="freeze"/></text>';
      svg += '<text x="150" y="82" text-anchor="middle" fill="#c9a84c" font-size="24" font-weight="700" font-family="Noto Serif KR,serif" opacity="0">'+pillar+'<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.6s" fill="freeze"/></text>';
      // 펄스
      svg += '<circle cx="150" cy="70" r="50" fill="none" stroke="#c9a84c" stroke-width="0.5" opacity="0.3"><animate attributeName="r" values="50;58;50" dur="2.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;0.05;0.3" dur="2.5s" repeatCount="indefinite"/></circle>';
    }

    // 용신·희신 양쪽
    if (ys.yongShin) {
      var yc = OHENG_COLORS[ys.yongShin]||'#c9a84c', hc = OHENG_COLORS[ys.huiShin]||'#c9a84c';
      svg += '<circle cx="45" cy="70" r="0" fill="'+yc+'" opacity="0.15"><animate attributeName="r" from="0" to="25" dur="0.5s" begin="0.3s" fill="freeze"/></circle>';
      svg += '<text x="45" y="67" text-anchor="middle" fill="'+yc+'" font-size="14" font-weight="700" opacity="0">'+(OHENG_LABELS[ys.yongShin]||'')+'<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.5s" fill="freeze"/></text>';
      svg += '<text x="45" y="82" text-anchor="middle" fill="'+yc+'" font-size="8" opacity="0">용신<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.5s" fill="freeze"/></text>';

      svg += '<circle cx="255" cy="70" r="0" fill="'+hc+'" opacity="0.12"><animate attributeName="r" from="0" to="22" dur="0.5s" begin="0.4s" fill="freeze"/></circle>';
      svg += '<text x="255" y="67" text-anchor="middle" fill="'+hc+'" font-size="13" font-weight="700" opacity="0">'+(OHENG_LABELS[ys.huiShin]||'')+'<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.6s" fill="freeze"/></text>';
      svg += '<text x="255" y="82" text-anchor="middle" fill="'+hc+'" font-size="8" opacity="0">희신<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.6s" fill="freeze"/></text>';

      // 연결선
      svg += '<line x1="70" y1="70" x2="100" y2="70" stroke="'+yc+'" stroke-width="0.5" stroke-dasharray="3,3" opacity="0"><animate attributeName="opacity" from="0" to="0.4" dur="0.5s" begin="0.7s" fill="freeze"/></line>';
      svg += '<line x1="200" y1="70" x2="233" y2="70" stroke="'+hc+'" stroke-width="0.5" stroke-dasharray="3,3" opacity="0"><animate attributeName="opacity" from="0" to="0.4" dur="0.5s" begin="0.7s" fill="freeze"/></line>';
    }

    // 하단 격국
    if (ys.reasoning) {
      svg += '<text x="150" y="145" text-anchor="middle" fill="#6a6050" font-size="9" opacity="0">'+ys.reasoning+' · '+(db.gyeokguk&&db.gyeokguk.name||'')+'<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.8s" fill="freeze"/></text>';
    }

    svg += '</svg>';
    el.innerHTML += svg; container.appendChild(el); observeSlot(el);
  }

function renderCh8(container, db) {
    var counts = db.sipseongCounts;
    var fp = db.fourPillars;
    var el = document.createElement('div');
    el.className = 'cv-pillars-anim';
    el.innerHTML = '<div class="cv-section-label">연 애 · 결 혼 운</div>';

    var jae = (counts && counts.groups) ? (counts.groups['재성']||0) : 0;
    var gwan = (counts && counts.groups) ? (counts.groups['관성']||0) : 0;
    var detail = (counts && counts.detail) || {};
    var pyeonJae = detail['편재']||0, jeongJae = detail['정재']||0;
    var pyeonGwan = detail['편관']||0, jeongGwan = detail['정관']||0;

    // 배우자궁 (일지)
    var spouseChar = '';
    if (fp && fp.day) spouseChar = fp.day.ji || fp.day.branch || '';

    // 연애 에너지 점수 (재성+관성 기반, 최대 100)
    var loveScore = Math.min(100, Math.round((jae + gwan) * 12 + 20));

    var W = 300, H = 200;
    var svg = '<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:380px;display:block;margin:0 auto;">';

    // 중앙 원형 게이지 — 연애 에너지
    var cx = 150, cy = 70, r = 45;
    var circumference = 2 * Math.PI * r;
    var dashOffset = circumference * (1 - loveScore / 100);

    svg += '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="rgba(201,168,76,0.08)" stroke-width="6"/>';
    svg += '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#c9a84c" stroke-width="6" stroke-linecap="round" stroke-dasharray="'+circumference+'" stroke-dashoffset="'+circumference+'" transform="rotate(-90 '+cx+' '+cy+')"><animate attributeName="stroke-dashoffset" from="'+circumference+'" to="'+dashOffset+'" dur="1.2s" fill="freeze"/></circle>';
    // 펄스
    svg += '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#c9a84c" stroke-width="1" opacity="0.3"><animate attributeName="r" values="'+r+';'+(r+8)+';'+r+'" dur="2.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite"/></circle>';
    // 점수
    svg += '<text x="'+cx+'" y="'+(cy-5)+'" text-anchor="middle" fill="#c9a84c" font-size="22" font-weight="700" opacity="0">'+loveScore+'<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.8s" fill="freeze"/></text>';
    svg += '<text x="'+cx+'" y="'+(cy+12)+'" text-anchor="middle" fill="#6a6050" font-size="9" opacity="0">연애 에너지<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.9s" fill="freeze"/></text>';

    // 배우자궁 (있으면)
    if (spouseChar) {
      svg += '<text x="'+cx+'" y="'+(cy+28)+'" text-anchor="middle" fill="rgba(201,168,76,0.5)" font-size="8" opacity="0">배우자궁 '+spouseChar+'<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="1s" fill="freeze"/></text>';
    }

    // 하단 바 — 재성
    var barY1 = 145, barY2 = 170;
    var barMaxW = 100;
    var jaeW = Math.max(8, jae * 25);
    var gwanW = Math.max(8, gwan * 25);

    // 재성 바
    svg += '<text x="45" y="'+(barY1+4)+'" text-anchor="end" fill="#FFC107" font-size="9" font-weight="600" opacity="0">재성 '+jae+'<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="1.1s" fill="freeze"/></text>';
    svg += '<rect x="50" y="'+(barY1-5)+'" width="0" height="10" rx="5" fill="rgba(255,193,7,0.15)" stroke="#FFC107" stroke-width="0.5"><animate attributeName="width" from="0" to="'+jaeW+'" dur="0.8s" begin="1.1s" fill="freeze"/></rect>';
    if (pyeonJae > 0 || jeongJae > 0) {
      svg += '<text x="'+(55+jaeW)+'" y="'+(barY1+4)+'" fill="#8a7a5a" font-size="7" opacity="0">편재'+pyeonJae+' 정재'+jeongJae+'<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.5s" fill="freeze"/></text>';
    }

    // 관성 바
    svg += '<text x="45" y="'+(barY2+4)+'" text-anchor="end" fill="#64B5F6" font-size="9" font-weight="600" opacity="0">관성 '+gwan+'<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="1.3s" fill="freeze"/></text>';
    svg += '<rect x="50" y="'+(barY2-5)+'" width="0" height="10" rx="5" fill="rgba(100,181,246,0.15)" stroke="#64B5F6" stroke-width="0.5"><animate attributeName="width" from="0" to="'+gwanW+'" dur="0.8s" begin="1.3s" fill="freeze"/></rect>';
    if (pyeonGwan > 0 || jeongGwan > 0) {
      svg += '<text x="'+(55+gwanW)+'" y="'+(barY2+4)+'" fill="#8a7a5a" font-size="7" opacity="0">편관'+pyeonGwan+' 정관'+jeongGwan+'<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.7s" fill="freeze"/></text>';
    }

    svg += '</svg>';
    el.innerHTML += svg; container.appendChild(el); observeSlot(el);
  }


  // ═══════════════════════════════════
  // CH9: 관계운 — 사람 연결 네트워크
  // ═══════════════════════════════════
  function renderCh9(container, db) {
    var el = document.createElement('div');
    el.className = 'cv-pillars-anim';
    el.innerHTML = '<div class="cv-section-label">관 계 운</div>';
    var svg = '<svg viewBox="0 0 300 130" width="100%" style="max-width:360px;display:block;margin:0 auto;">';

    var nodes = [{x:150,y:50,label:'나',color:'#c9a84c',r:20},{x:60,y:45,label:'가족',color:'#4CAF50',r:14},{x:240,y:45,label:'직장',color:'#2196F3',r:14},{x:80,y:110,label:'친구',color:'#FF9800',r:14},{x:220,y:110,label:'연인',color:'#F44336',r:14}];

    // 연결선
    for(var i=1;i<nodes.length;i++){
      svg+='<line x1="150" y1="50" x2="'+nodes[i].x+'" y2="'+nodes[i].y+'" stroke="rgba(201,168,76,0.15)" stroke-width="0.5" stroke-dasharray="4,3" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="'+(i*0.1)+'s" fill="freeze"/></line>';
    }

    nodes.forEach(function(n,i){
      var d = i*0.12;
      svg+='<circle cx="'+n.x+'" cy="'+n.y+'" r="0" fill="'+n.color+'" opacity="'+(i===0?'0.15':'0.1')+'"><animate attributeName="r" from="0" to="'+n.r+'" dur="0.5s" begin="'+d+'s" fill="freeze"/></circle>';
      svg+='<circle cx="'+n.x+'" cy="'+n.y+'" r="0" fill="none" stroke="'+n.color+'" stroke-width="'+(i===0?'1.5':'0.8')+'" opacity="0.5"><animate attributeName="r" from="0" to="'+n.r+'" dur="0.5s" begin="'+d+'s" fill="freeze"/></circle>';
      svg+='<text x="'+n.x+'" y="'+(n.y+4)+'" text-anchor="middle" fill="'+n.color+'" font-size="'+(i===0?'11':'9')+'" font-weight="'+(i===0?'700':'500')+'" opacity="0">'+n.label+'<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="'+(d+0.2)+'s" fill="freeze"/></text>';
    });

    if(nodes[0]){svg+='<circle cx="150" cy="50" r="20" fill="none" stroke="#c9a84c" stroke-width="0.5" opacity="0.3"><animate attributeName="r" values="20;26;20" dur="2.5s" repeatCount="indefinite"/></circle>';}

    svg += '</svg>';
    el.innerHTML += svg; container.appendChild(el); observeSlot(el);
  }

function renderCh10(container, db) {
    var counts = db.sipseongCounts;
    var el = document.createElement('div');
    el.className = 'cv-pillars-anim';
    el.innerHTML = '<div class="cv-section-label">재 물 운</div>';

    var detail = (counts && counts.detail) || {};
    var pyeonJae = detail['편재']||0, jeongJae = detail['정재']||0;
    var jaeTotal = pyeonJae + jeongJae;
    var wealthScore = Math.min(100, Math.round(jaeTotal * 18 + 15));

    // 성향 판단
    var tendency = '균형형';
    var tendencyColor = '#c9a84c';
    if (pyeonJae > jeongJae + 1) { tendency = '투자·도전형'; tendencyColor = '#FF9800'; }
    else if (jeongJae > pyeonJae + 1) { tendency = '저축·안정형'; tendencyColor = '#4CAF50'; }
    else if (pyeonJae > 0 && jeongJae > 0) { tendency = '균형형'; tendencyColor = '#c9a84c'; }
    else if (jaeTotal === 0) { tendency = '정신적 가치 추구형'; tendencyColor = '#9C27B0'; }

    var W = 300, H = 210;
    var svg = '<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:380px;display:block;margin:0 auto;">';

    // 상단: 재물 점수 반원 게이지
    var cx = 150, cy = 80, r = 55;
    var halfCirc = Math.PI * r;
    var gaugeOffset = halfCirc * (1 - wealthScore / 100);

    svg += '<path d="M'+(cx-r)+','+cy+' A'+r+','+r+' 0 0,1 '+(cx+r)+','+cy+'" fill="none" stroke="rgba(201,168,76,0.08)" stroke-width="8" stroke-linecap="round"/>';
    svg += '<path d="M'+(cx-r)+','+cy+' A'+r+','+r+' 0 0,1 '+(cx+r)+','+cy+'" fill="none" stroke="'+tendencyColor+'" stroke-width="8" stroke-linecap="round" stroke-dasharray="'+halfCirc+'" stroke-dashoffset="'+halfCirc+'"><animate attributeName="stroke-dashoffset" from="'+halfCirc+'" to="'+gaugeOffset+'" dur="1.2s" fill="freeze"/></path>';

    // 점수
    svg += '<text x="'+cx+'" y="'+(cy-15)+'" text-anchor="middle" fill="#c9a84c" font-size="26" font-weight="700" opacity="0">'+wealthScore+'<animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.8s" fill="freeze"/></text>';
    svg += '<text x="'+cx+'" y="'+(cy+2)+'" text-anchor="middle" fill="#6a6050" font-size="9" opacity="0">재물 에너지<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.9s" fill="freeze"/></text>';

    // 성향 태그
    svg += '<rect x="'+(cx-35)+'" y="'+(cy+10)+'" width="70" height="18" rx="9" fill="rgba(201,168,76,0.06)" stroke="'+tendencyColor+'" stroke-width="0.5" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="1s" fill="freeze"/></rect>';
    svg += '<text x="'+cx+'" y="'+(cy+23)+'" text-anchor="middle" fill="'+tendencyColor+'" font-size="9" font-weight="600" opacity="0">'+tendency+'<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="1.1s" fill="freeze"/></text>';

    // 하단: 편재 vs 정재 비교 바
    var barY = 150;
    var totalW = 200;
    var pjW = jaeTotal > 0 ? Math.round(totalW * pyeonJae / Math.max(jaeTotal,1)) : totalW/2;
    var jjW = totalW - pjW;
    var barX = 50;

    svg += '<text x="'+(barX-5)+'" y="'+(barY+5)+'" text-anchor="end" fill="#FF9800" font-size="8" opacity="0">편재<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.2s" fill="freeze"/></text>';
    svg += '<text x="'+(barX+totalW+5)+'" y="'+(barY+5)+'" text-anchor="start" fill="#4CAF50" font-size="8" opacity="0">정재<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.2s" fill="freeze"/></text>';

    // 편재 바
    svg += '<rect x="'+barX+'" y="'+(barY-6)+'" width="0" height="12" rx="6" fill="rgba(255,152,0,0.2)" stroke="#FF9800" stroke-width="0.5"><animate attributeName="width" from="0" to="'+pjW+'" dur="0.8s" begin="1.2s" fill="freeze"/></rect>';
    svg += '<text x="'+(barX+pjW/2)+'" y="'+(barY+5)+'" text-anchor="middle" fill="#FF9800" font-size="10" font-weight="700" opacity="0">'+pyeonJae+'<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.6s" fill="freeze"/></text>';

    // 정재 바
    svg += '<rect x="'+(barX+pjW)+'" y="'+(barY-6)+'" width="0" height="12" rx="6" fill="rgba(76,175,80,0.2)" stroke="#4CAF50" stroke-width="0.5"><animate attributeName="width" from="0" to="'+jjW+'" dur="0.8s" begin="1.4s" fill="freeze"/></rect>';
    svg += '<text x="'+(barX+pjW+jjW/2)+'" y="'+(barY+5)+'" text-anchor="middle" fill="#4CAF50" font-size="10" font-weight="700" opacity="0">'+jeongJae+'<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.8s" fill="freeze"/></text>';

    // 설명
    svg += '<text x="'+cx+'" y="'+(barY+30)+'" text-anchor="middle" fill="#6a6050" font-size="8" opacity="0">편재 = 투자·사업  |  정재 = 월급·저축<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="2s" fill="freeze"/></text>';

    svg += '</svg>';
    el.innerHTML += svg; container.appendChild(el); observeSlot(el);
  }


  // ═══════════════════════════════════
  // CH11: 건강운 — 오행 인체 매핑
  // ═══════════════════════════════════
  function renderCh11(container, db) {
    var oheng = db.ohengDistribution;
    var el = document.createElement('div');
    el.className = 'cv-pillars-anim';
    el.innerHTML = '<div class="cv-section-label">건 강 · 오 행</div>';
    var svg = '<svg viewBox="0 0 300 150" width="100%" style="max-width:360px;display:block;margin:0 auto;">';

    var organs = [
      {name:'간·담',oheng:'목',x:60,y:45,icon:'🌿'},
      {name:'심장',oheng:'화',x:150,y:30,icon:'❤️'},
      {name:'비위',oheng:'토',x:240,y:45,icon:'🟡'},
      {name:'폐·대장',oheng:'금',x:90,y:110,icon:'🫁'},
      {name:'신장',oheng:'수',x:210,y:110,icon:'💧'}
    ];

    organs.forEach(function(o,i){
      var count = 0;
      if(oheng && oheng[o.oheng]) count = typeof oheng[o.oheng]==='object' ? (oheng[o.oheng].count||0) : Number(oheng[o.oheng])||0;
      var r = 16 + count * 6;
      var color = OHENG_COLORS[o.oheng];
      var d = i * 0.12;
      var alertClass = (count === 0) ? ' opacity="0.3"' : '';

      svg+='<circle cx="'+o.x+'" cy="'+o.y+'" r="0" fill="'+color+'" opacity="'+(count===0?'0.05':'0.12')+'"'+alertClass+'><animate attributeName="r" from="0" to="'+r+'" dur="0.5s" begin="'+d+'s" fill="freeze"/></circle>';
      svg+='<text x="'+o.x+'" y="'+(o.y-2)+'" text-anchor="middle" font-size="16" opacity="0">'+o.icon+'<animate attributeName="opacity" from="0" to="'+(count===0?'0.3':'1')+'" dur="0.3s" begin="'+(d+0.2)+'s" fill="freeze"/></text>';
      svg+='<text x="'+o.x+'" y="'+(o.y+16)+'" text-anchor="middle" fill="'+(count===0?'#ff6b6b':color)+'" font-size="8" font-weight="500" opacity="0">'+o.name+(count===0?' ⚠':'')+'<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="'+(d+0.3)+'s" fill="freeze"/></text>';
    });

    svg += '</svg>';
    el.innerHTML += svg; container.appendChild(el); observeSlot(el);
  }
  // ═══════════════════════════════════
  // CH12: 대운 — 인생 운세 타임라인
  // ═══════════════════════════════════
  function renderCh12(container, db) {
    // 데이터 경로 수정
    var lc = db.luckCycles || {};
    var daeunData = lc.currentDaeun || db.daeun || null;
    if (!daeunData) return;
    var daeuns = daeunData.daeuns || [];
    if (daeuns.length === 0) return;

    // 현재 대운 정보
    var currentPillar = lc.currentDaeunPillar || {};
    var currentAge = currentPillar.age || 0;

    // 생년 역산
    var birthYear = 0;
    if (currentPillar.startYear && currentPillar.age) {
      birthYear = currentPillar.startYear - currentPillar.age;
    } else if (daeuns[0]) {
      birthYear = daeuns[0].startYear - daeuns[0].age;
    }
    var nowAge = 2026 - birthYear;

    // 용신 오행
    var yongShinOheng = (db.yongShin && db.yongShin.yongShin) || '';
    var GAN_OHENG = {
      '甲':'목','乙':'목','丙':'화','丁':'화','戊':'토',
      '己':'토','庚':'금','辛':'금','壬':'수','癸':'수'
    };
    var SANGSAENG = {'목':'화','화':'토','토':'금','금':'수','수':'목'};
        var HJ = {
      '甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무',
      '己':'기','庚':'경','辛':'신','壬':'임','癸':'계',
      '子':'자','丑':'축','寅':'인','卯':'묘','辰':'진',
      '巳':'사','午':'오','未':'미','申':'신','酉':'유',
      '戌':'술','亥':'해'
    };
    function toH(str){if(!str)return '';var r='';for(var c=0;c<str.length;c++)r+=HJ[str[c]]||str[c];return r;}

    function scoreForPillar(gan, ji) {
      var oh = GAN_OHENG[gan] || '';
      var jiOh = GAN_OHENG[ji] || '';
      var s = 55;
      if (oh === yongShinOheng) s = 90;
      else if (SANGSAENG[oh] === yongShinOheng) s = 80;
      else if (SANGSAENG[yongShinOheng] === oh) s = 75;
      else { var hash = gan.charCodeAt(0) + (ji ? ji.charCodeAt(0) : 0); s = 45 + (hash % 16); }
      // 지지 보정
      if (jiOh === yongShinOheng) s = Math.min(s + 8, 98);
      else if (SANGSAENG[jiOh] === yongShinOheng) s = Math.min(s + 5, 95);
      return s;
    }

    var el = document.createElement('div');
    el.className = 'cv-pillars-anim';
    el.innerHTML = '<div class="cv-section-label">대 운  타 임 라 인</div>';

    var n = daeuns.length;
    var W = 600, H = 320;
    var padL = 60, padR = 30, padT = 50, padB = 60;
    var chartW = W - padL - padR;
    var chartH = H - padT - padB;

    var svg = '<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="display:block;margin:0 auto;">';

    // 배경 격자
    for (var g = 0; g <= 4; g++) {
      var gy = padT + (chartH / 4) * g;
      var label = (100 - g * 25);
      svg += '<line x1="'+padL+'" y1="'+gy+'" x2="'+(W-padR)+'" y2="'+gy+'" stroke="rgba(201,168,76,0.06)" stroke-width="0.5"/>';
      svg += '<text x="'+(padL-8)+'" y="'+(gy+3)+'" text-anchor="end" fill="#6a6050" font-size="8" opacity="0.5">'+label+'</text>';
    }

    var pts = [];
    var currentIdx = -1;
    var bestIdx = 0, bestScore = 0;

    daeuns.forEach(function(d, i) {
      var score = scoreForPillar(d.gan, d.ji);
      var x = padL + (chartW / (n - 1 || 1)) * i;
      var y = padT + chartH * (1 - score / 100);
      pts.push({ x: x, y: y, score: score, d: d });

      if (score > bestScore) { bestScore = score; bestIdx = i; }

      // 현재 대운 판별
      var nextAge = daeuns[i + 1] ? daeuns[i + 1].age : d.age + 10;
      if (nowAge >= d.age && nowAge < nextAge) { currentIdx = i; }
    });

    // 그라데이션
    svg += '<defs>';
    svg += '<linearGradient id="cvDaeunGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c9a84c" stop-opacity="0.2"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0.01"/></linearGradient>';
    svg += '<radialGradient id="cvNowGlow"><stop offset="0%" stop-color="#c9a84c" stop-opacity="0.4"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0"/></radialGradient>';
    svg += '</defs>';

    // 곡선
    if (pts.length > 1) {
      var pathD = 'M' + pts[0].x + ',' + pts[0].y;
      for (var i = 1; i < pts.length; i++) {
        var pr = pts[i-1], cu = pts[i];
        pathD += ' C'+(pr.x+(cu.x-pr.x)*0.4)+','+pr.y+' '+(pr.x+(cu.x-pr.x)*0.6)+','+cu.y+' '+cu.x+','+cu.y;
      }
      var areaD = pathD + ' L'+pts[pts.length-1].x+','+(padT+chartH)+' L'+pts[0].x+','+(padT+chartH)+' Z';
      svg += '<path d="'+areaD+'" fill="url(#cvDaeunGrad)" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="1s" fill="freeze"/></path>';
      svg += '<path d="'+pathD+'" fill="none" stroke="#c9a84c" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="800" stroke-dashoffset="800"><animate attributeName="stroke-dashoffset" from="800" to="0" dur="2s" fill="freeze"/></path>';
    }

    // 포인트
    pts.forEach(function(p, i) {
      var delay = 0.5 + i * 0.15;
      var isCurrent = (i === currentIdx);
      var isBest = (i === bestIdx);
      var dotR = isCurrent ? 7 : (isBest ? 6 : 4);
      var dotColor = isCurrent ? '#FFD700' : (isBest ? '#4CAF50' : '#c9a84c');

      svg += '<circle cx="'+p.x+'" cy="'+p.y+'" r="0" fill="'+dotColor+'" stroke="#0a0a14" stroke-width="2"><animate attributeName="r" from="0" to="'+dotR+'" dur="0.4s" begin="'+delay+'s" fill="freeze"/></circle>';

      if (isCurrent) {
        svg += '<circle cx="'+p.x+'" cy="'+p.y+'" r="20" fill="url(#cvNowGlow)"><animate attributeName="r" values="15;25;15" dur="2s" repeatCount="indefinite"/></circle>';
        svg += '<circle cx="'+p.x+'" cy="'+p.y+'" r="'+dotR+'" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.6"><animate attributeName="r" values="'+dotR+';'+(dotR+6)+';'+dotR+'" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite"/></circle>';
        svg += '<rect x="'+(p.x-18)+'" y="'+(p.y-32)+'" width="36" height="16" rx="8" fill="#FFD700" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="'+(delay+0.2)+'s" fill="freeze"/></rect>';
        svg += '<text x="'+p.x+'" y="'+(p.y-21)+'" text-anchor="middle" fill="#0a0a14" font-size="9" font-weight="700" opacity="0">지금<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="'+(delay+0.2)+'s" fill="freeze"/></text>';
      }
      if (isBest && !isCurrent) {
        svg += '<text x="'+p.x+'" y="'+(p.y-14)+'" text-anchor="middle" fill="#4CAF50" font-size="8" font-weight="700" opacity="0">★ 최고운<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="'+(delay+0.2)+'s" fill="freeze"/></text>';
      }
      if (isCurrent || isBest) {
        var scoreY = isCurrent ? (p.y+18) : (p.y-6);
        svg += '<text x="'+p.x+'" y="'+scoreY+'" text-anchor="middle" fill="'+dotColor+'" font-size="10" font-weight="700" opacity="0">'+p.score+'점<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="'+(delay+0.3)+'s" fill="freeze"/></text>';
      }

      svg += '<text x="'+p.x+'" y="'+(padT+chartH+16)+'" text-anchor="middle" fill="'+(isCurrent?'#FFD700':'#6a6050')+'" font-size="'+(isCurrent?'11':'9')+'" font-weight="'+(isCurrent?'700':'400')+'" opacity="0">'+p.d.age+'세<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="'+delay+'s" fill="freeze"/></text>';
      svg += '<text x="'+p.x+'" y="'+(padT+chartH+30)+'" text-anchor="middle" fill="'+(isCurrent?'#FFD700':'#8a7a5a')+'" font-size="'+(isCurrent?'12':'10')+'" font-weight="700" font-family="Noto Serif KR,serif" opacity="0">'+toH(p.d.pillar)+'<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="'+delay+'s" fill="freeze"/></text>';
      svg += '<text x="'+p.x+'" y="'+(padT+chartH+44)+'" text-anchor="middle" fill="#6a6050" font-size="7" opacity="0">'+p.d.startYear+'~<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="'+delay+'s" fill="freeze"/></text>';
    });

    svg += '<circle cx="'+padL+'" cy="'+(H-8)+'" r="4" fill="#FFD700"/><text x="'+(padL+8)+'" y="'+(H-5)+'" fill="#6a6050" font-size="8">현재</text>';
    svg += '<circle cx="'+(padL+55)+'" cy="'+(H-8)+'" r="4" fill="#4CAF50"/><text x="'+(padL+63)+'" y="'+(H-5)+'" fill="#6a6050" font-size="8">최고운</text>';
    svg += '</svg>';

    // 요약
    var summaryHtml = '';
    if (currentIdx >= 0) {
      var cd = daeuns[currentIdx];
      var endAge = daeuns[currentIdx+1] ? daeuns[currentIdx+1].age : cd.age+10;
      summaryHtml = '<div style="text-align:center;margin-top:12px;padding:12px;background:rgba(255,215,0,0.04);border:1px solid rgba(255,215,0,0.1);border-radius:10px;">';
summaryHtml += '<span style="color:#FFD700;font-weight:700;">현재 '+toH(cd.pillar)+' 대운</span>';
summaryHtml += '<span style="color:#6a6050;font-size:12px;"> ('+cd.age+'~'+endAge+'세, '+cd.startYear+'~'+(cd.startYear+10)+'년)</span>';
if (bestIdx !== currentIdx) {
  summaryHtml += '<br><span style="color:#4CAF50;font-size:12px;">★ 최고 운세 시기: '+daeuns[bestIdx].age+'세 ('+toH(daeuns[bestIdx].pillar)+', '+daeuns[bestIdx].startYear+'년~)</span>';
}
      summaryHtml += '</div>';
    }

    el.innerHTML += svg + summaryHtml;
    container.appendChild(el);
    observeSlot(el);
  }

  // ═══════════════════════════════════
  // CH13: 2026 월별 운세 — 실제 API 데이터 사용!
  // ═══════════════════════════════════
  function renderCh13(container, db) {
    var lc = db.luckCycles || {};
    var monthly = lc.monthly2026 || db.monthly2026;
    var el = document.createElement('div');
    el.className = 'cv-pillars-anim';
    el.innerHTML = '<div class="cv-section-label">2 0 2 6  월 별  운 세</div>';

    var scores = [];
    var labels = [];
    var hasData = (monthly && monthly !== 'NONE' && Array.isArray(monthly) && monthly.length > 0);

    if (hasData) {
      // 십이운성 → 점수 변환
      var UNSUNG_SCORE = {
        '절':20,'태':30,'양':40,'장생':75,'목욕':55,
        '관대':80,'건록':90,'제왕':95,'쇠':50,'병':35,'사':25,'묘':15
      };
      monthly.forEach(function(m) {
        var score = UNSUNG_SCORE[m.unsung] || 50;
        scores.push(score);
        labels.push(m.label || (m.month+'월'));
      });
    } else {
      // 폴백: 천간 기반 추정
      var monthGans2026 = ['庚','辛','壬','癸','甲','乙','丙','丁','戊','己','庚','辛'];
      var monthJis2026 = ['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑'];
      var yongShinOheng = (db.yongShin && db.yongShin.yongShin) || '';
      var GAN_OHENG = {'甲':'목','乙':'목','丙':'화','丁':'화','戊':'토','己':'토','庚':'금','辛':'금','壬':'수','癸':'수'};
      var SANGSAENG = {'목':'화','화':'토','토':'금','금':'수','수':'목'};
      monthGans2026.forEach(function(gan, i) {
        var oh = GAN_OHENG[gan] || '';
        var ji = monthJis2026[i] || '';
        var s = 55;
        if (oh === yongShinOheng) s = 88;
        else if (SANGSAENG[oh] === yongShinOheng) s = 78;
        else if (SANGSAENG[yongShinOheng] === oh) s = 72;
        else { var hash = gan.charCodeAt(0) + ji.charCodeAt(0) + i; s = 45 + (hash % 16); }
        scores.push(s);
        labels.push((i+1)+'월');
      });
    }

    while (scores.length < 12) { scores.push(50); labels.push((scores.length)+'월'); }

    var currentMonthIdx = new Date().getMonth(); // 0=1월, 1=2월, 2=3월...
    var bestMonth = 0, worstMonth = 0;
    scores.forEach(function(s, i) {
      if (s > scores[bestMonth]) bestMonth = i;
      if (s < scores[worstMonth]) worstMonth = i;
    });

    var W = 500, H = 280;
    var padL = 40, padR = 20, padT = 40, padB = 55;
    var chartW = W - padL - padR;
    var chartH = H - padT - padB;

    var svg = '<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="display:block;margin:0 auto;">';

    for (var g = 0; g <= 4; g++) {
      var gy = padT + (chartH / 4) * g;
      svg += '<line x1="'+padL+'" y1="'+gy+'" x2="'+(W-padR)+'" y2="'+gy+'" stroke="rgba(201,168,76,0.06)" stroke-width="0.5"/>';
    }

    var barW = chartW / 12 * 0.6;
    var gap = chartW / 12;

    scores.forEach(function(score, i) {
      var x = padL + gap * i + gap * 0.2;
      var barH = chartH * (score / 100);
      var y = padT + chartH - barH;
      var delay = i * 0.08;
      var isCurrent = (i === currentMonthIdx);
      var isBest = (i === bestMonth);
      var isWorst = (i === worstMonth);

      var color = isCurrent ? '#FFD700' : (isBest ? '#4CAF50' : (isWorst ? '#F44336' : '#c9a84c'));
      var opacity = isCurrent ? '0.35' : '0.15';

      svg += '<rect x="'+x+'" y="'+(padT+chartH)+'" width="'+barW+'" height="0" rx="3" fill="'+color+'" opacity="'+opacity+'"><animate attributeName="height" from="0" to="'+barH+'" dur="0.5s" begin="'+delay+'s" fill="freeze"/><animate attributeName="y" from="'+(padT+chartH)+'" to="'+y+'" dur="0.5s" begin="'+delay+'s" fill="freeze"/></rect>';
      svg += '<rect x="'+x+'" y="'+(padT+chartH)+'" width="'+barW+'" height="0" rx="3" fill="none" stroke="'+color+'" stroke-width="'+(isCurrent?'1.5':'0.5')+'" opacity="0.6"><animate attributeName="height" from="0" to="'+barH+'" dur="0.5s" begin="'+delay+'s" fill="freeze"/><animate attributeName="y" from="'+(padT+chartH)+'" to="'+y+'" dur="0.5s" begin="'+delay+'s" fill="freeze"/></rect>';

      if (isCurrent || isBest || isWorst) {
        svg += '<text x="'+(x+barW/2)+'" y="'+(y-6)+'" text-anchor="middle" fill="'+color+'" font-size="9" font-weight="700" opacity="0">'+score+'<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="'+(delay+0.3)+'s" fill="freeze"/></text>';
      }

      if (isCurrent) {
        svg += '<rect x="'+(x+barW/2-14)+'" y="'+(y-22)+'" width="28" height="14" rx="7" fill="#FFD700" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="'+(delay+0.4)+'s" fill="freeze"/></rect>';
        svg += '<text x="'+(x+barW/2)+'" y="'+(y-12)+'" text-anchor="middle" fill="#0a0a14" font-size="8" font-weight="700" opacity="0">지금<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="'+(delay+0.4)+'s" fill="freeze"/></text>';
      }
      if (isBest && !isCurrent) {
        svg += '<text x="'+(x+barW/2)+'" y="'+(y-14)+'" text-anchor="middle" fill="#4CAF50" font-size="7" font-weight="700" opacity="0">★최고<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="'+(delay+0.3)+'s" fill="freeze"/></text>';
      }
      if (isWorst) {
        svg += '<text x="'+(x+barW/2)+'" y="'+(y-14)+'" text-anchor="middle" fill="#F44336" font-size="7" font-weight="700" opacity="0">⚠주의<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="'+(delay+0.3)+'s" fill="freeze"/></text>';
      }

      // 월 라벨 (십이운성 표시)
      var monthLabel = (i+1)+'월';
      svg += '<text x="'+(x+barW/2)+'" y="'+(padT+chartH+16)+'" text-anchor="middle" fill="'+(isCurrent?'#FFD700':'#6a6050')+'" font-size="'+(isCurrent?'10':'8')+'" font-weight="'+(isCurrent?'700':'400')+'">'+monthLabel+'</text>';

      if (hasData && monthly[i]) {
        svg += '<text x="'+(x+barW/2)+'" y="'+(padT+chartH+28)+'" text-anchor="middle" fill="#8a7a5a" font-size="7">'+monthly[i].unsung+'</text>';
      }
    });

    svg += '<circle cx="'+padL+'" cy="'+(H-10)+'" r="3" fill="#FFD700"/><text x="'+(padL+7)+'" y="'+(H-7)+'" fill="#6a6050" font-size="7">현재</text>';
    svg += '<circle cx="'+(padL+42)+'" cy="'+(H-10)+'" r="3" fill="#4CAF50"/><text x="'+(padL+49)+'" y="'+(H-7)+'" fill="#6a6050" font-size="7">최고</text>';
    svg += '<circle cx="'+(padL+82)+'" cy="'+(H-10)+'" r="3" fill="#F44336"/><text x="'+(padL+89)+'" y="'+(H-7)+'" fill="#6a6050" font-size="7">주의</text>';
    svg += '</svg>';

    var summaryHtml = '<div style="text-align:center;margin-top:10px;font-size:12px;color:#6a6050;">';
    summaryHtml += '<span style="color:#4CAF50;font-weight:700;">'+(bestMonth+1)+'월</span>이 가장 좋고, ';
    summaryHtml += '<span style="color:#F44336;font-weight:700;">'+(worstMonth+1)+'월</span>은 조심하세요. ';
    summaryHtml += '<span style="color:#FFD700;font-weight:700;">지금('+(currentMonthIdx+1)+'월)</span>은 '+scores[currentMonthIdx]+'점입니다.';
    summaryHtml += '</div>';

    el.innerHTML += svg + summaryHtml;
    container.appendChild(el);
    observeSlot(el);
  }

  // ═══════════════════════════════════
  // CH14: 편지 — 봉투 애니메이션 (에러 방지)
  // ═══════════════════════════════════
  function renderCh14(container, db) {
    var name = '';
    if (db && db.customerInfo) name = db.customerInfo.name || '';
    if (!name && db && db.luckCycles && db.luckCycles.customerInfo) name = db.luckCycles.customerInfo.name || '';
    var el = document.createElement('div');
    el.className = 'cv-pillars-anim';
    el.innerHTML = '<div class="cv-section-label">마 음  편 지</div>';
    var svg = '<svg viewBox="0 0 300 120" width="100%" style="max-width:360px;display:block;margin:0 auto;">';
    svg+='<rect x="100" y="30" width="100" height="70" rx="4" fill="rgba(201,168,76,0.06)" stroke="#c9a84c" stroke-width="0.8" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.6s" fill="freeze"/></rect>';
    svg+='<polygon points="100,30 150,60 200,30" fill="rgba(201,168,76,0.04)" stroke="#c9a84c" stroke-width="0.5" stroke-linejoin="round"><animateTransform attributeName="transform" type="rotate" from="0 150 30" to="-180 150 30" dur="1s" begin="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0.3" dur="1s" begin="0.3s" fill="freeze"/></polygon>';
    svg+='<rect x="115" y="10" width="70" height="50" rx="2" fill="#12121f" stroke="rgba(201,168,76,0.3)" stroke-width="0.5" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="0.8s" fill="freeze"/><animate attributeName="y" from="50" to="10" dur="0.6s" begin="0.8s" fill="freeze"/></rect>';
    svg+='<text x="150" y="35" text-anchor="middle" fill="#c9a84c" font-size="9" font-family="Noto Serif KR,serif" opacity="0">'+(name?name+' 님에게':'당신에게')+'<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="1.2s" fill="freeze"/></text>';
    svg+='<text x="150" y="55" text-anchor="middle" font-size="14" opacity="0">💌<animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="1.4s" fill="freeze"/></text>';
    svg += '</svg>';
    el.innerHTML += svg; container.appendChild(el); observeSlot(el);
  }


  // ═══════════════════════════════════
  // 메인 분기
  // ═══════════════════════════════════
  function insertVisual(chapterIndex, container, dashboard) {
    if (!dashboard) return;
    switch(chapterIndex) {
      case 0:  renderCh1(container, dashboard); break;
      case 1:  renderCh2(container, dashboard); break;
      case 2:  renderCh3(container, dashboard); break;
      case 3:  renderCh4(container, dashboard); break;
      case 4:  renderCh5(container, dashboard); break;
      case 5:  renderCh6(container, dashboard); break;
      case 6:  renderCh7(container, dashboard); break;
      case 7:  renderCh8(container, dashboard); break;
      case 8:  renderCh9(container, dashboard); break;
      case 9:  renderCh10(container, dashboard); break;
      case 10: renderCh11(container, dashboard); break;
      case 11: renderCh12(container, dashboard); break;  // 대운
      case 12: renderCh13(container, dashboard); break;  // 월운
      case 13: renderCh14(container, dashboard); break;         // 편지
    }
  }

  return { insertVisual: insertVisual };
})();
