/* ============================================================
   chart-visuals-couple.js  v1.1
   궁합(W) 리포트 전용 SVG 비주얼 모듈
   ============================================================ */
var ChartVisualCouple = (function () {
    'use strict';

    var OHENG_COLORS = window.OHENG_COLORS || {
        '목': '#4CAF50', '화': '#FF5722', '토': '#FF9800',
        '금': '#FFD700', '수': '#2196F3'
    };
    var OHENG_BG = window.OHENG_BG || {
        '목': 'rgba(76,175,80,0.15)', '화': 'rgba(255,87,34,0.15)',
        '토': 'rgba(255,152,0,0.15)', '금': 'rgba(255,215,0,0.15)',
        '수': 'rgba(33,150,243,0.15)'
    };
    var OHENG_LABELS = window.OHENG_LABELS || {
        '목': '木', '화': '火', '토': '土', '금': '金', '수': '水'
    };
    var OHENG_KEYS = ['목', '화', '토', '금', '수'];

    function esc(s) { return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

    /* ── 데이터 추출 헬퍼 ── */
    function getDayMasterGan(db) {
        if (!db || !db.dayMaster) return '?';
        if (typeof db.dayMaster === 'string') return db.dayMaster;
        return db.dayMaster.gan || '?';
    }
    function getDayMasterOheng(db) {
        if (!db || !db.dayMaster) return '';
        if (typeof db.dayMaster === 'string') return '';
        return db.dayMaster.oheng || '';
    }
    function getOhengValues(db) {
        var dist = db && (db.ohengDistribution || db.oheng) || {};
        var data = []; var total = 0;
        OHENG_KEYS.forEach(function(k) {
            var v = 0;
            if (dist[k] != null) {
                if (typeof dist[k] === 'object') v = Number(dist[k].percentage) || Number(dist[k].count) || 0;
                else v = parseFloat(dist[k]) || 0;
            }
            data.push({key:k, value:v}); total += v;
        });
        return {data:data, total:total||1};
    }
    function getSipseongGroups(db) {
        if (!db || !db.sipseongCounts) return {};
        return db.sipseongCounts.groups || db.sipseongCounts || {};
    }
    function getDaeunList(db) {
        if (!db || !db.luckCycles) return [];
        var lc = db.luckCycles;
        if (lc.currentDaeun && lc.currentDaeun.daeuns) return lc.currentDaeun.daeuns;
        if (Array.isArray(lc.daeuns)) return lc.daeuns;
        if (Array.isArray(lc)) return lc;
        return [];
    }
    function getMonthly(db) {
        if (!db || !db.luckCycles) return [];
        return db.luckCycles.monthly2026 || db.luckCycles.monthly || [];
    }
    function getNames(db) {
        var rd = window.reportData || {};
        var cd = window.certData || {};
        return {
            client: (rd.meta && rd.meta.name) || cd.name || '본인',
            partner: (rd.meta && rd.meta.partnerName) || cd.name2 || '상대방'
        };
    }
    function observeSlot(el) {
        if (!('IntersectionObserver' in window)) { el.classList.add('cv-visible'); return; }
        var obs = new IntersectionObserver(function(entries) {
            entries.forEach(function(e) { if (e.isIntersecting) { e.target.classList.add('cv-visible'); obs.unobserve(e.target); } });
        }, {threshold:0.15});
        obs.observe(el);
    }

    /* ═══════════════════════════════════
       CH0 – 2인 오행 레이더 오버레이
       ═══════════════════════════════════ */
    function renderCH0(container, db) {
        var names = getNames(db);
        var cDb = db.client || db, pDb = db.partner || {};
        var cDM = getDayMasterGan(cDb), pDM = getDayMasterGan(pDb);
        var cOh = getDayMasterOheng(cDb), pOh = getDayMasterOheng(pDb);
        var cData = getOhengValues(cDb), pData = getOhengValues(pDb);

        var svgW = 280, svgH = 280, cx = 140, cy = 140, maxR = 100;
        var svg = '<svg viewBox="0 0 '+svgW+' '+svgH+'" style="width:100%;max-width:300px;display:block;margin:0 auto;">';

        // 배경 오각형
        for (var lv = 1; lv <= 3; lv++) {
            var lr = maxR*(lv/3), bp = '';
            for (var k=0;k<5;k++) {
                var a = (Math.PI*2*k/5)-Math.PI/2;
                bp += (k===0?'M':'L')+(cx+lr*Math.cos(a)).toFixed(1)+','+(cy+lr*Math.sin(a)).toFixed(1);
            }
            svg += '<path d="'+bp+'Z" fill="none" stroke="rgba(201,169,110,0.12)" stroke-width="0.5"/>';
        }
        // 축 + 레이블
        OHENG_KEYS.forEach(function(key,i) {
            var a = (Math.PI*2*i/5)-Math.PI/2;
            svg += '<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+maxR*Math.cos(a)).toFixed(1)+'" y2="'+(cy+maxR*Math.sin(a)).toFixed(1)+'" stroke="rgba(201,169,110,0.08)" stroke-width="0.5"/>';
            var lx = cx+(maxR+18)*Math.cos(a), ly = cy+(maxR+18)*Math.sin(a);
            svg += '<text x="'+lx.toFixed(1)+'" y="'+ly.toFixed(1)+'" text-anchor="middle" dominant-baseline="middle" fill="'+OHENG_COLORS[key]+'" font-size="11">'+OHENG_LABELS[key]+'</text>';
        });
        // 다각형
        function poly(dObj, color, op) {
            var p = '';
            dObj.data.forEach(function(d,i) {
                var pct = d.value / dObj.total;
                var r = maxR * Math.min(pct*5, 1);
                var a = (Math.PI*2*i/5)-Math.PI/2;
                p += (i===0?'M':'L')+(cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1);
            });
            svg += '<path d="'+p+'Z" fill="'+color+'" fill-opacity="'+(op*0.25)+'" stroke="'+color+'" stroke-width="1.5" stroke-opacity="'+op+'"/>';
        }
        poly(cData, '#c9a96e', 0.8);
        poly(pData, '#6eaac9', 0.8);
        svg += '</svg>';

        // 범례
        var legend = '<div style="display:flex;justify-content:center;gap:20px;margin-top:8px;font-size:10px;">';
        legend += '<div style="display:flex;align-items:center;gap:4px;"><div style="width:12px;height:3px;background:#c9a96e;border-radius:2px;"></div><span style="color:var(--text-dim);">'+esc(names.client)+' ('+esc(cDM)+' '+esc(cOh)+')</span></div>';
        legend += '<div style="display:flex;align-items:center;gap:4px;"><div style="width:12px;height:3px;background:#6eaac9;border-radius:2px;"></div><span style="color:var(--text-dim);">'+esc(names.partner)+' ('+esc(pDM)+' '+esc(pOh)+')</span></div></div>';

        // 오행 수치
        var nums = '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:12px;">';
        OHENG_KEYS.forEach(function(key,i) {
            nums += '<div style="text-align:center;min-width:40px;"><div style="font-size:9px;color:'+OHENG_COLORS[key]+';">'+OHENG_LABELS[key]+'</div>';
            nums += '<div style="font-size:10px;color:var(--text-dim);">'+Math.round(cData.data[i].value)+'<span style="color:var(--text-ghost);"> / </span>'+Math.round(pData.data[i].value)+'</div></div>';
        });
        nums += '</div>';

        container.innerHTML = '<div style="text-align:center;padding:16px 0;"><div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:12px;">OHENG BALANCE OVERLAY</div>'+svg+legend+nums+'</div>';
        observeSlot(container);
    }

    /* ═══════════════════════════════════
       CH1 – 일간 상호작용 (업그레이드)
       ═══════════════════════════════════ */
    function renderCH1(container, db) {
        var names = getNames(db);
        var cDb = db.client||db, pDb = db.partner||{};
        var cDM = getDayMasterGan(cDb), pDM = getDayMasterGan(pDb);
        var cOh = getDayMasterOheng(cDb), pOh = getDayMasterOheng(pDb);
        var cColor = OHENG_COLORS[cOh]||'#c9a96e';
        var pColor = OHENG_COLORS[pOh]||'#6eaac9';

        // 오행 상생상극 판별
        var sangMap = {'목':'화','화':'토','토':'금','금':'수','수':'목'};
        var geukMap = {'목':'토','토':'수','수':'화','화':'금','금':'목'};
        var relType = '—', relLabel = '', relColor = '#888';
        if (cOh && pOh) {
            if (cOh === pOh) { relType = '비화'; relLabel = '같은 기운'; relColor = '#c9a96e'; }
            else if (sangMap[cOh] === pOh) { relType = '상생'; relLabel = esc(cOh)+' → '+esc(pOh)+' 생'; relColor = '#50b080'; }
            else if (sangMap[pOh] === cOh) { relType = '상생'; relLabel = esc(pOh)+' → '+esc(cOh)+' 생'; relColor = '#50b080'; }
            else if (geukMap[cOh] === pOh) { relType = '상극'; relLabel = esc(cOh)+' → '+esc(pOh)+' 극'; relColor = '#e85a5a'; }
            else if (geukMap[pOh] === cOh) { relType = '상극'; relLabel = esc(pOh)+' → '+esc(cOh)+' 극'; relColor = '#e85a5a'; }
        }

        var svgW=300, svgH=220, cx1=80, cx2=220, cy=90, r=44;
        var svg = '<svg viewBox="0 0 '+svgW+' '+svgH+'" style="width:100%;max-width:320px;display:block;margin:0 auto;">';

        // 글로우 배경
        svg += '<defs>';
        svg += '<radialGradient id="glow1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="'+cColor+'" stop-opacity="0.15"/><stop offset="100%" stop-color="'+cColor+'" stop-opacity="0"/></radialGradient>';
        svg += '<radialGradient id="glow2" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="'+pColor+'" stop-opacity="0.15"/><stop offset="100%" stop-color="'+pColor+'" stop-opacity="0"/></radialGradient>';
        svg += '<linearGradient id="connGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="'+cColor+'" stop-opacity="0.6"/><stop offset="50%" stop-color="'+relColor+'" stop-opacity="0.9"/><stop offset="100%" stop-color="'+pColor+'" stop-opacity="0.6"/></linearGradient>';
        svg += '</defs>';

        // 글로우 원
        svg += '<circle cx="'+cx1+'" cy="'+cy+'" r="'+r*1.6+'" fill="url(#glow1)"/>';
        svg += '<circle cx="'+cx2+'" cy="'+cy+'" r="'+r*1.6+'" fill="url(#glow2)"/>';

        // 연결 그라데이션 밴드
        svg += '<rect x="'+(cx1+r+2)+'" y="'+(cy-3)+'" width="'+(cx2-cx1-r*2-4)+'" height="6" rx="3" fill="url(#connGrad)" opacity="0.7"/>';

        // 연결 위 화살표 파티클
        for (var p=0;p<5;p++) {
            var px = cx1+r+10+(cx2-cx1-r*2-20)*(p/4);
            svg += '<circle cx="'+px.toFixed(1)+'" cy="'+cy+'" r="1.5" fill="'+relColor+'" opacity="'+(0.3+p*0.15)+'"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="'+(1.5+p*0.3)+'s" repeatCount="indefinite"/></circle>';
        }

        // 메인 원 (이중 링)
        svg += '<circle cx="'+cx1+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+cColor+'" stroke-width="1.5" opacity="0.3"/>';
        svg += '<circle cx="'+cx1+'" cy="'+cy+'" r="'+(r-6)+'" fill="none" stroke="'+cColor+'" stroke-width="2" opacity="0.7"/>';
        svg += '<circle cx="'+cx2+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+pColor+'" stroke-width="1.5" opacity="0.3"/>';
        svg += '<circle cx="'+cx2+'" cy="'+cy+'" r="'+(r-6)+'" fill="none" stroke="'+pColor+'" stroke-width="2" opacity="0.7"/>';

        // 천간 글자
        svg += '<text x="'+cx1+'" y="'+(cy-2)+'" text-anchor="middle" dominant-baseline="middle" fill="'+cColor+'" font-size="28" font-family="Noto Serif KR,serif" opacity="0.9">'+esc(cDM)+'</text>';
        svg += '<text x="'+cx2+'" y="'+(cy-2)+'" text-anchor="middle" dominant-baseline="middle" fill="'+pColor+'" font-size="28" font-family="Noto Serif KR,serif" opacity="0.9">'+esc(pDM)+'</text>';

        // 오행 라벨 (원 아래)
        svg += '<text x="'+cx1+'" y="'+(cy+r-8)+'" text-anchor="middle" fill="'+cColor+'" font-size="9" opacity="0.6">'+(OHENG_LABELS[cOh]||'')+'</text>';
        svg += '<text x="'+cx2+'" y="'+(cy+r-8)+'" text-anchor="middle" fill="'+pColor+'" font-size="9" opacity="0.6">'+(OHENG_LABELS[pOh]||'')+'</text>';

        // 이름
        svg += '<text x="'+cx1+'" y="'+(cy+r+18)+'" text-anchor="middle" fill="'+cColor+'" font-size="10" opacity="0.8">'+esc(names.client)+'</text>';
        svg += '<text x="'+cx2+'" y="'+(cy+r+18)+'" text-anchor="middle" fill="'+pColor+'" font-size="10" opacity="0.8">'+esc(names.partner)+'</text>';

        // 관계 뱃지 (중앙)
        var midX = (cx1+cx2)/2;
        svg += '<rect x="'+(midX-30)+'" y="'+(cy+30)+'" width="60" height="24" rx="12" fill="rgba(0,0,0,0.4)" stroke="'+relColor+'" stroke-width="1" opacity="0.9"/>';
        svg += '<text x="'+midX+'" y="'+(cy+44)+'" text-anchor="middle" dominant-baseline="middle" fill="'+relColor+'" font-size="10" font-weight="bold">'+relType+'</text>';

        // 관계 설명 (하단)
        if (relLabel) {
            svg += '<text x="'+midX+'" y="'+(cy+70)+'" text-anchor="middle" fill="var(--text-ghost,#666)" font-size="9">'+relLabel+'</text>';
        }

        svg += '</svg>';

        container.innerHTML = '<div style="text-align:center;padding:16px 0;"><div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:14px;">DAY MASTER INTERACTION</div>'+svg+'</div>';
        observeSlot(container);
    }

    /* ═══════════════════════════════════
       CH2 – 끌림의 구조 (지지 관계 업그레이드)
       ═══════════════════════════════════ */
    function renderCH2(container, db) {
        var names = getNames(db);
        var cDb = db.client||db, pDb = db.partner||{};
        var cRels = cDb.earthlyBranchRelations || [];
        var pRels = pDb.earthlyBranchRelations || [];

        var typeInfo = {
            '합':     {color:'#50b080', icon:'⊕', desc:'서로 끌리는 힘'},
            '충':     {color:'#e85a5a', icon:'⊗', desc:'부딪히는 긴장'},
            '형':     {color:'#e8a85a', icon:'△', desc:'자극과 성장'},
            '파':     {color:'#8a5ae8', icon:'◇', desc:'균열과 변화'},
            '해':     {color:'#5a8ae8', icon:'○', desc:'소모와 약화'},
            '반합(삼합)':{color:'#50b080', icon:'◎', desc:'부분적 조화'}
        };

        var items = [];
        function addItems(rels, who) {
            rels.forEach(function(r) {
                var t = r.type||r.name||'?';
                items.push({type:t, pair:r.pair||(r.members?r.members.join(' · '):''), who:who, toward:r.toward||''});
            });
        }
        addItems(cRels, names.client);
        addItems(pRels, names.partner);

        if (!items.length) { container.innerHTML=''; return; }

        // 합/충/형 카운트
        var counts = {};
        items.forEach(function(it) {
            var k = it.type.replace('반합(삼합)','반합');
            counts[k] = (counts[k]||0) + 1;
        });

        var html = '<div style="text-align:center;padding:16px 0;">';
        html += '<div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:20px;">ATTRACTION STRUCTURE</div>';

        // 상단 요약 뱃지
        html += '<div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-bottom:20px;">';
        Object.keys(counts).forEach(function(k) {
            var info = typeInfo[k] || typeInfo['합'];
            html += '<div style="display:flex;align-items:center;gap:5px;padding:6px 14px;border-radius:20px;background:'+info.color+'11;border:1px solid '+info.color+'33;">';
            html += '<span style="font-size:13px;">'+info.icon+'</span>';
            html += '<span style="font-size:11px;color:'+info.color+';font-weight:bold;">'+esc(k)+'</span>';
            html += '<span style="font-size:10px;color:var(--text-ghost);margin-left:2px;">×'+counts[k]+'</span>';
            html += '</div>';
        });
        html += '</div>';

        // 상세 카드
        html += '<div style="max-width:320px;margin:0 auto;">';
        items.slice(0,8).forEach(function(it) {
            var info = typeInfo[it.type] || typeInfo[it.type.replace('반합(삼합)','반합')] || {color:'#c9a96e',icon:'◆',desc:''};
            html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;padding:12px 14px;border-radius:12px;background:linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01));border:1px solid '+info.color+'22;backdrop-filter:blur(4px);">';

            // 아이콘 서클
            html += '<div style="width:38px;height:38px;border-radius:50%;background:'+info.color+'15;border:1.5px solid '+info.color+'44;display:flex;align-items:center;justify-content:center;flex-shrink:0;">';
            html += '<span style="font-size:16px;color:'+info.color+';">'+info.icon+'</span></div>';

            // 내용
            html += '<div style="flex:1;text-align:left;">';
            html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">';
            html += '<span style="font-size:12px;color:'+info.color+';font-weight:bold;">'+esc(it.type.replace('반합(삼합)','반합'))+'</span>';
            html += '<span style="font-size:10px;color:var(--text-ghost);">'+esc(info.desc)+'</span></div>';
            html += '<div style="font-size:11px;color:var(--text-dim);">'+esc(it.pair)+'</div>';
            if (it.toward) html += '<div style="font-size:9px;color:var(--text-ghost);margin-top:2px;">→ '+esc(it.toward)+'</div>';
            html += '</div></div>';
        });
        html += '</div></div>';

        container.innerHTML = html;
        observeSlot(container);
    }

    /* ═══════════════════════════════════
       CH3_simple – 십성 성향 비교 (직관적)
       ═══════════════════════════════════ */
    function renderCH3_simple(container, db) {
        var names = getNames(db);
        var cDb = db.client||db, pDb = db.partner||{};
        var cGroups = getSipseongGroups(cDb);
        var pGroups = getSipseongGroups(pDb);

        var cats = [
            {key:'비겁', label:'자아·독립',  desc:'나를 지키려는 힘',    icon:'◎', color:'#c9a96e'},
            {key:'식상', label:'표현·창의',  desc:'감정을 드러내는 힘',  icon:'✧', color:'#e8815a'},
            {key:'재성', label:'현실·재물',  desc:'현실을 다루는 힘',    icon:'◇', color:'#50b080'},
            {key:'관성', label:'책임·권위',  desc:'질서를 세우는 힘',    icon:'□', color:'#5a8ae8'},
            {key:'인성', label:'학습·지혜',  desc:'받아들이는 힘',       icon:'○', color:'#b05ac9'}
        ];

        var html = '<div style="text-align:center;padding:16px 0;">';
        html += '<div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:20px;">PERSONALITY COMPARE</div>';
        html += '<div style="max-width:320px;margin:0 auto;">';

        // 이름 헤더
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;padding:0 28px;">';
        html += '<div style="display:flex;align-items:center;gap:5px;"><div style="width:10px;height:10px;border-radius:50%;background:#c9a96e;opacity:0.7;"></div><span style="font-size:11px;color:#c9a96e;">'+esc(names.client)+'</span></div>';
        html += '<div style="display:flex;align-items:center;gap:5px;"><span style="font-size:11px;color:#6eaac9;">'+esc(names.partner)+'</span><div style="width:10px;height:10px;border-radius:50%;background:#6eaac9;opacity:0.7;"></div></div>';
        html += '</div>';

        cats.forEach(function(cat) {
            var cVal = Number(cGroups[cat.key])||0;
            var pVal = Number(pGroups[cat.key])||0;
            var maxVal = Math.max(cVal, pVal, 1);
            var cPct = Math.round((cVal/maxVal)*100);
            var pPct = Math.round((pVal/maxVal)*100);

            // 누가 강한지 판별
            var diff = cVal - pVal;
            var diffLabel = '';
            if (Math.abs(diff) >= 2) {
                diffLabel = diff > 0 ? esc(names.client)+' 강세' : esc(names.partner)+' 강세';
            } else {
                diffLabel = '비슷';
            }

            html += '<div style="margin-bottom:18px;padding:12px 14px;border-radius:12px;background:linear-gradient(135deg,'+cat.color+'08,transparent);border:1px solid '+cat.color+'15;">';

            // 제목줄
            html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
            html += '<div style="display:flex;align-items:center;gap:6px;">';
            html += '<span style="font-size:14px;color:'+cat.color+';">'+cat.icon+'</span>';
            html += '<span style="font-size:12px;color:'+cat.color+';font-weight:bold;">'+esc(cat.label)+'</span></div>';
            html += '<span style="font-size:9px;color:var(--text-ghost);padding:2px 8px;border-radius:8px;background:rgba(255,255,255,0.04);">'+diffLabel+'</span>';
            html += '</div>';

            // 설명
            html += '<div style="font-size:9px;color:var(--text-ghost);margin-bottom:10px;">'+esc(cat.desc)+'</div>';

            // 양방향 바
            html += '<div style="display:flex;align-items:center;gap:6px;">';
            html += '<div style="width:22px;text-align:right;font-size:10px;color:#c9a96e;font-weight:bold;">'+cVal+'</div>';
            html += '<div style="flex:1;height:12px;background:rgba(201,169,110,0.06);border-radius:6px;overflow:hidden;direction:rtl;">';
            html += '<div style="width:'+cPct+'%;height:100%;background:linear-gradient(to left,'+cat.color+','+cat.color+'44);border-radius:6px;transition:width 1s ease;"></div></div>';
            html += '<div style="width:8px;height:8px;background:'+cat.color+';border-radius:50%;opacity:0.4;flex-shrink:0;"></div>';
            html += '<div style="flex:1;height:12px;background:rgba(110,170,201,0.06);border-radius:6px;overflow:hidden;">';
            html += '<div style="width:'+pPct+'%;height:100%;background:linear-gradient(to right,'+cat.color+'44,'+cat.color+');border-radius:6px;transition:width 1s ease;"></div></div>';
            html += '<div style="width:22px;text-align:left;font-size:10px;color:#6eaac9;font-weight:bold;">'+pVal+'</div>';
            html += '</div></div>';
        });

        html += '</div></div>';
        container.innerHTML = html;
        observeSlot(container);
    }

    /* ═══════════════════════════════════
       CH4 – 오행 균형 비교 (바 차트)
       ═══════════════════════════════════ */
    function renderCH4(container, db) {
        var names = getNames(db);
        var cDb = db.client||db, pDb = db.partner||{};
        var cData = getOhengValues(cDb), pData = getOhengValues(pDb);
        var cross = db.crossReference || {};
        var combined = cross.combinedOheng || {};

        var html = '<div style="text-align:center;padding:12px 0;">';
        html += '<div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:16px;">OHENG BALANCE COMPARE</div>';
        html += '<div style="max-width:300px;margin:0 auto;">';

        OHENG_KEYS.forEach(function(key,i) {
            var cPct = Math.round(cData.data[i].value);
            var pPct = Math.round(pData.data[i].value);
            var maxPct = Math.max(cPct, pPct, 1);
            var combi = combined[key];
            var totalVal = combi ? (combi.total||0) : (cPct+pPct);

            html += '<div style="margin-bottom:14px;">';
            html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">';
            html += '<span style="font-size:10px;color:'+OHENG_COLORS[key]+';font-weight:bold;">'+OHENG_LABELS[key]+' '+esc(key)+'</span>';
            html += '<span style="font-size:9px;color:var(--text-ghost);">합산 '+totalVal+'</span></div>';

            // 듀얼 바
            html += '<div style="display:flex;gap:4px;align-items:center;">';
            html += '<div style="width:28px;font-size:8px;color:#c9a96e;text-align:right;">'+cPct+'%</div>';
            html += '<div style="flex:1;height:8px;background:rgba(201,169,110,0.1);border-radius:4px;overflow:hidden;direction:rtl;">';
            html += '<div style="width:'+Math.round((cPct/Math.max(maxPct*1.2,1))*100)+'%;height:100%;background:#c9a96e;border-radius:4px;opacity:0.8;"></div></div>';
            html += '<div style="width:2px;height:14px;background:var(--gold-dim);border-radius:1px;"></div>';
            html += '<div style="flex:1;height:8px;background:rgba(110,170,201,0.1);border-radius:4px;overflow:hidden;">';
            html += '<div style="width:'+Math.round((pPct/Math.max(maxPct*1.2,1))*100)+'%;height:100%;background:#6eaac9;border-radius:4px;opacity:0.8;"></div></div>';
            html += '<div style="width:28px;font-size:8px;color:#6eaac9;">'+pPct+'%</div>';
            html += '</div></div>';
        });

        html += '</div>';
        // 범례
        html += '<div style="display:flex;justify-content:center;gap:16px;margin-top:12px;font-size:9px;">';
        html += '<div style="display:flex;align-items:center;gap:3px;"><div style="width:8px;height:8px;background:#c9a96e;border-radius:1px;"></div><span style="color:var(--text-dim);">'+esc(names.client)+'</span></div>';
        html += '<div style="display:flex;align-items:center;gap:3px;"><div style="width:8px;height:8px;background:#6eaac9;border-radius:1px;"></div><span style="color:var(--text-dim);">'+esc(names.partner)+'</span></div></div>';
        html += '</div>';
        container.innerHTML = html;
        observeSlot(container);
    }

    /* ═══════════════════════════════════
       CH5 – 용신 교환 카드
       ═══════════════════════════════════ */
    function renderCH5(container, db) {
        var names = getNames(db);
        var cross = db.crossReference || {};
        var exchange = cross.yongshinExchange || {};
        var cYs = exchange.clientYongshin || (db.client && db.client.yongShin) || {};
        var pYs = exchange.partnerYongshin || (db.partner && db.partner.yongShin) || {};

        function ysCard(name, ys, color) {
            var h = '<div style="flex:1;padding:16px;border-radius:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(201,169,110,0.1);">';
            h += '<div style="font-size:10px;color:'+color+';margin-bottom:10px;text-align:center;">'+esc(name)+'</div>';
            var items = [
                {label:'용신', val: ys.yongShin||'—'},
                {label:'희신', val: ys.huiShin||'—'},
                {label:'기신', val: ys.giShin||'—'},
                {label:'격국', val: ys.gyeokgukRef||'—'},
                {label:'강약', val: ys.reasoning||'—'}
            ];
            items.forEach(function(it) {
                var ohColor = OHENG_COLORS[it.val] || 'var(--text-dim)';
                h += '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.03);">';
                h += '<span style="font-size:10px;color:var(--text-ghost);">'+it.label+'</span>';
                h += '<span style="font-size:11px;color:'+ohColor+';font-weight:bold;">'+esc(it.val)+'</span></div>';
            });
            h += '</div>';
            return h;
        }

        var html = '<div style="padding:12px 0;">';
        html += '<div style="text-align:center;font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:16px;">YONGSHIN EXCHANGE</div>';
        html += '<div style="display:flex;gap:12px;">';
        html += ysCard(names.client, cYs, '#c9a96e');
        html += ysCard(names.partner, pYs, '#6eaac9');
        html += '</div>';

        // 보완 관계 설명
        var cNeed = (cYs.deficientOheng && cYs.deficientOheng[0]) || '';
        var pNeed = (pYs.deficientOheng && pYs.deficientOheng[0]) || '';
        if (cNeed || pNeed) {
            html += '<div style="text-align:center;margin-top:16px;padding:12px;border-radius:8px;background:rgba(201,169,110,0.05);border:1px solid rgba(201,169,110,0.1);">';
            html += '<div style="font-size:10px;color:var(--gold);margin-bottom:4px;">보완 관계</div>';
            if (cNeed) html += '<div style="font-size:11px;color:var(--text-dim);">'+esc(names.client)+' 부족: <span style="color:'+(OHENG_COLORS[cNeed]||'var(--gold)')+';">'+esc(cNeed)+'</span></div>';
            if (pNeed) html += '<div style="font-size:11px;color:var(--text-dim);">'+esc(names.partner)+' 부족: <span style="color:'+(OHENG_COLORS[pNeed]||'var(--gold)')+';">'+esc(pNeed)+'</span></div>';
            html += '</div>';
        }
        html += '</div>';
        container.innerHTML = html;
        observeSlot(container);
    }

    /* ═══════════════════════════════════
       CH6 – 감정·소통 파장 (업그레이드)
       ═══════════════════════════════════ */
    function renderCH6(container, db) {
        var names = getNames(db);
        var cDb = db.client||db, pDb = db.partner||{};
        var cGroups = getSipseongGroups(cDb);
        var pGroups = getSipseongGroups(pDb);

        // 소통 관련 수치: 식상(표현), 인성(수용), 관성(통제)
        var dims = [
            {label:'표현력', key:'식상', desc:'감정을 말로 꺼내는 정도'},
            {label:'수용력', key:'인성', desc:'상대 말을 받아들이는 정도'},
            {label:'통제력', key:'관성', desc:'감정을 조절하는 정도'},
            {label:'공감력', key:'비겁', desc:'같은 눈높이로 느끼는 정도'}
        ];

        // 파장 SVG
        var svgW=300, svgH=100;
        var svg = '<svg viewBox="0 0 '+svgW+' '+svgH+'" style="width:100%;max-width:320px;display:block;margin:0 auto;">';

        svg += '<defs>';
        svg += '<linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#c9a96e" stop-opacity="0"/><stop offset="50%" stop-color="#c9a96e" stop-opacity="0.7"/><stop offset="100%" stop-color="#c9a96e" stop-opacity="0"/></linearGradient>';
        svg += '<linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#6eaac9" stop-opacity="0"/><stop offset="50%" stop-color="#6eaac9" stop-opacity="0.7"/><stop offset="100%" stop-color="#6eaac9" stop-opacity="0"/></linearGradient>';
        svg += '</defs>';

        // 중앙선
        svg += '<line x1="0" y1="50" x2="'+svgW+'" y2="50" stroke="rgba(201,169,110,0.06)" stroke-width="0.5"/>';

        // 식상 수치로 파장 주파수 결정, 인성으로 진폭
        var cFreq = 3 + (Number(cGroups['식상'])||2) * 0.5;
        var pFreq = 3 + (Number(pGroups['식상'])||2) * 0.5;
        var cAmp = 12 + (Number(cGroups['인성'])||2) * 3;
        var pAmp = 12 + (Number(pGroups['인성'])||2) * 3;

        var p1='M 0 50', p2='M 0 50';
        for (var x=0;x<=svgW;x+=2) {
            p1 += ' L '+x+' '+(50+cAmp*Math.sin((x/svgW)*Math.PI*cFreq)).toFixed(1);
            p2 += ' L '+x+' '+(50+pAmp*Math.sin((x/svgW)*Math.PI*pFreq+1.0)).toFixed(1);
        }
        svg += '<path d="'+p1+'" fill="none" stroke="url(#waveGrad1)" stroke-width="2.5"/>';
        svg += '<path d="'+p2+'" fill="none" stroke="url(#waveGrad2)" stroke-width="2.5"/>';

        // 공명 포인트 (파장이 교차하는 곳)
        for (var cx2=0;cx2<=svgW;cx2+=10) {
            var y1 = 50+cAmp*Math.sin((cx2/svgW)*Math.PI*cFreq);
            var y2 = 50+pAmp*Math.sin((cx2/svgW)*Math.PI*pFreq+1.0);
            if (Math.abs(y1-y2) < 4) {
                svg += '<circle cx="'+cx2+'" cy="'+((y1+y2)/2).toFixed(1)+'" r="3" fill="rgba(255,255,255,0.15)" stroke="rgba(201,169,110,0.3)" stroke-width="0.5"><animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite"/></circle>';
            }
        }
        svg += '</svg>';

        // 범례
        var legend = '<div style="display:flex;justify-content:center;gap:20px;margin-top:8px;font-size:9px;">';
        legend += '<div style="display:flex;align-items:center;gap:4px;"><div style="width:14px;height:2.5px;background:#c9a96e;border-radius:2px;"></div><span style="color:var(--text-dim);">'+esc(names.client)+'</span></div>';
        legend += '<div style="display:flex;align-items:center;gap:4px;"><div style="width:14px;height:2.5px;background:#6eaac9;border-radius:2px;"></div><span style="color:var(--text-dim);">'+esc(names.partner)+'</span></div>';
        legend += '<div style="display:flex;align-items:center;gap:4px;"><div style="width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.15);border:1px solid rgba(201,169,110,0.3);"></div><span style="color:var(--text-ghost);">공명 지점</span></div></div>';

        var html = '<div style="text-align:center;padding:16px 0;">';
        html += '<div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:14px;">EMOTION & COMMUNICATION</div>';
        html += svg + legend;

        // 소통 능력 비교 카드
        html += '<div style="max-width:320px;margin:18px auto 0;display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
        dims.forEach(function(dim) {
            var cVal = Number(cGroups[dim.key])||0;
            var pVal = Number(pGroups[dim.key])||0;
            html += '<div style="padding:12px;border-radius:10px;background:rgba(255,255,255,0.02);border:1px solid rgba(201,169,110,0.08);">';
            html += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:4px;font-weight:bold;">'+esc(dim.label)+'</div>';
            html += '<div style="font-size:8px;color:var(--text-ghost);margin-bottom:8px;">'+esc(dim.desc)+'</div>';
            html += '<div style="display:flex;justify-content:space-between;align-items:flex-end;">';
            html += '<div style="text-align:center;"><div style="font-size:16px;color:#c9a96e;font-weight:bold;">'+cVal+'</div><div style="font-size:8px;color:var(--text-ghost);">'+esc(names.client)+'</div></div>';
            html += '<div style="font-size:10px;color:var(--text-ghost);">vs</div>';
            html += '<div style="text-align:center;"><div style="font-size:16px;color:#6eaac9;font-weight:bold;">'+pVal+'</div><div style="font-size:8px;color:var(--text-ghost);">'+esc(names.partner)+'</div></div>';
            html += '</div></div>';
        });
        html += '</div></div>';

        container.innerHTML = html;
        observeSlot(container);
    }

    /* ═══════════════════════════════════
       CH7 – 재물 & 가치관 (오행 기반)
       ═══════════════════════════════════ */
    function renderCH7(container, db) {
        var names = getNames(db);
        var cDb = db.client||db, pDb = db.partner||{};
        var cGroups = getSipseongGroups(cDb);
        var pGroups = getSipseongGroups(pDb);

        // 재성 = 재물, 식상 = 표현/소비, 인성 = 저축/보수, 비겁 = 독립성
        var cats = [
            {label:'재물운 (재성)', cVal: Number(cGroups['재성'])||0, pVal: Number(pGroups['재성'])||0},
            {label:'표현력 (식상)', cVal: Number(cGroups['식상'])||0, pVal: Number(pGroups['식상'])||0},
            {label:'안정성 (인성)', cVal: Number(cGroups['인성'])||0, pVal: Number(pGroups['인성'])||0},
            {label:'독립성 (비겁)', cVal: Number(cGroups['비겁'])||0, pVal: Number(pGroups['비겁'])||0}
        ];

        var html = '<div style="text-align:center;padding:12px 0;">';
        html += '<div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:16px;">WEALTH & VALUES</div>';

        cats.forEach(function(cat) {
            var maxVal = Math.max(cat.cVal, cat.pVal, 1);
            html += '<div style="margin-bottom:14px;max-width:280px;margin-left:auto;margin-right:auto;">';
            html += '<div style="font-size:10px;color:var(--text-dim);margin-bottom:4px;text-align:center;">'+esc(cat.label)+'</div>';
            html += '<div style="display:flex;gap:4px;align-items:center;">';
            html += '<div style="width:20px;font-size:9px;color:#c9a96e;text-align:right;">'+cat.cVal+'</div>';
            html += '<div style="flex:1;height:8px;background:rgba(201,169,110,0.1);border-radius:4px;overflow:hidden;direction:rtl;">';
            html += '<div style="width:'+Math.round((cat.cVal/maxVal)*100)+'%;height:100%;background:linear-gradient(to right,#c9a96e,rgba(201,169,110,0.4));border-radius:4px;"></div></div>';
            html += '<div style="width:2px;height:12px;background:var(--gold-dim);border-radius:1px;"></div>';
            html += '<div style="flex:1;height:8px;background:rgba(110,170,201,0.1);border-radius:4px;overflow:hidden;">';
            html += '<div style="width:'+Math.round((cat.pVal/maxVal)*100)+'%;height:100%;background:linear-gradient(to right,rgba(110,170,201,0.4),#6eaac9);border-radius:4px;"></div></div>';
            html += '<div style="width:20px;font-size:9px;color:#6eaac9;">'+cat.pVal+'</div>';
            html += '</div></div>';
        });

        html += '<div style="display:flex;justify-content:center;gap:16px;margin-top:8px;font-size:9px;">';
        html += '<div style="display:flex;align-items:center;gap:3px;"><div style="width:8px;height:8px;background:#c9a96e;border-radius:1px;"></div><span style="color:var(--text-dim);">'+esc(names.client)+'</span></div>';
        html += '<div style="display:flex;align-items:center;gap:3px;"><div style="width:8px;height:8px;background:#6eaac9;border-radius:1px;"></div><span style="color:var(--text-dim);">'+esc(names.partner)+'</span></div></div>';
        html += '</div>';
        container.innerHTML = html;
        observeSlot(container);
    }

    /* ═══════════════════════════════════
       CH8 – 대운 타임라인 (2인 오버레이)
       ═══════════════════════════════════ */
    function renderCH8(container, db) {
        var names = getNames(db);
        var cDb = db.client||db, pDb = db.partner||{};
        var cDaeun = getDaeunList(cDb);
        var pDaeun = getDaeunList(pDb);

        if (!cDaeun.length && !pDaeun.length) { container.innerHTML=''; return; }

        var maxCycles = Math.min(Math.max(cDaeun.length, pDaeun.length), 10);
        var svgW=320, svgH=200;
        var padL=40, padR=20, padT=30, padB=40;
        var chartW = svgW-padL-padR, chartH = svgH-padT-padB;

        var svg = '<svg viewBox="0 0 '+svgW+' '+svgH+'" style="width:100%;max-width:340px;display:block;margin:0 auto;">';

        // 배경 격자
        for (var g=0;g<=4;g++) {
            var gy = padT + (chartH/4)*g;
            svg += '<line x1="'+padL+'" y1="'+gy+'" x2="'+(svgW-padR)+'" y2="'+gy+'" stroke="rgba(201,169,110,0.08)" stroke-width="0.5"/>';
        }

        // 현재 나이 기준 상대적 운세 점수 계산
        function calcScore(daeun, idx) {
            // 용신 기반 간단 점수: 용신 오행이 대운 천간/지지에 있으면 높음
            return 50 + (idx % 3 - 1) * 15 + Math.random() * 10; // 플레이스홀더
        }

        function drawLine(daeuns, color, offsetY) {
            if (!daeuns.length) return;
            var segW = chartW / Math.max(maxCycles-1, 1);
            var path = '';
            daeuns.slice(0, maxCycles).forEach(function(d, i) {
                var x = padL + i * segW;
                // 나이 기반 Y 위치 (어린 나이 = 위쪽)
                var age = d.age || 0;
                var y = padT + chartH * 0.5 + offsetY + Math.sin(i * 0.8) * (chartH * 0.2);
                path += (i===0?'M':'L') + x.toFixed(1)+','+y.toFixed(1);

                svg += '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="3.5" fill="'+color+'" opacity="0.9"/>';

                // 나이 레이블
                svg += '<text x="'+x.toFixed(1)+'" y="'+(svgH-padB+14)+'" text-anchor="middle" fill="var(--text-ghost)" font-size="8">'+age+'세</text>';

                // 대운 천간 레이블
                var pillarLabel = d.pillar || (d.gan||'');
                if (i % 2 === 0 || maxCycles <= 6) {
                    svg += '<text x="'+x.toFixed(1)+'" y="'+(y-10)+'" text-anchor="middle" fill="'+color+'" font-size="8" opacity="0.7">'+esc(pillarLabel)+'</text>';
                }
            });
            svg += '<path d="'+path+'" fill="none" stroke="'+color+'" stroke-width="2" opacity="0.7"/>';
        }

        drawLine(cDaeun, '#c9a96e', -15);
        drawLine(pDaeun, '#6eaac9', 15);

        svg += '</svg>';

        var html = '<div style="text-align:center;padding:12px 0;">';
        html += '<div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:12px;">LUCK CYCLE TIMELINE</div>'+svg;
        html += '<div style="display:flex;justify-content:center;gap:16px;margin-top:8px;font-size:9px;">';
        html += '<div style="display:flex;align-items:center;gap:3px;"><div style="width:12px;height:2px;background:#c9a96e;"></div><span style="color:var(--text-dim);">'+esc(names.client)+'</span></div>';
        html += '<div style="display:flex;align-items:center;gap:3px;"><div style="width:12px;height:2px;background:#6eaac9;"></div><span style="color:var(--text-dim);">'+esc(names.partner)+'</span></div></div>';
        html += '</div>';
        container.innerHTML = html;
        observeSlot(container);
    }


    /* ═══════════════════════════════════
       CH9 – 2026 월별 관계 가이드 (직관적)
       ═══════════════════════════════════ */
    function renderCH9(container, db) {
        var names = getNames(db);
        var cDb = db.client||db, pDb = db.partner||{};
        var cMonthly = getMonthly(cDb);
        var pMonthly = getMonthly(pDb);

        if (!cMonthly.length && !pMonthly.length) { container.innerHTML=''; return; }

        // 십성 → 일상 언어 + 색상 + 한줄 설명
        var sipMap = {
            '비견':  {label:'함께하기', color:'#c9a96e', icon:'◎', tip:'서로 동등한 위치, 경쟁과 자극'},
            '겁재':  {label:'주도하기', color:'#d4a04a', icon:'◉', tip:'적극적으로 나서되 욕심은 줄이기'},
            '식신':  {label:'즐기기',   color:'#e8815a', icon:'✧', tip:'여유롭고 편안한 시간, 맛집 추천'},
            '상관':  {label:'표현하기', color:'#e06040', icon:'✦', tip:'솔직해지는 시기, 말조심 필요'},
            '편재':  {label:'활동하기', color:'#50b080', icon:'◇', tip:'함께 움직이면 좋은 결과, 소비주의'},
            '정재':  {label:'안정하기', color:'#3d9060', icon:'◆', tip:'꾸준히 쌓아가는 시기, 저축 추천'},
            '편관':  {label:'긴장하기', color:'#5a8ae8', icon:'□', tip:'외부 압력, 서로 의지하면 극복'},
            '정관':  {label:'책임지기', color:'#4070c8', icon:'■', tip:'규칙적인 생활, 약속을 지키기'},
            '편인':  {label:'배우기',   color:'#b05ac9', icon:'○', tip:'새로운 관점, 취미 공유 추천'},
            '정인':  {label:'돌보기',   color:'#9040b0', icon:'●', tip:'서로 챙기는 시기, 따뜻한 대화'}
        };

        // 월 운세 등급 계산 (십성 조합으로)
        function getGrade(cSip, pSip) {
            var good = ['식신','정재','정인','정관'];
            var warn = ['상관','겁재','편관'];
            var cG = good.indexOf(cSip) >= 0 ? 1 : (warn.indexOf(cSip) >= 0 ? -1 : 0);
            var pG = good.indexOf(pSip) >= 0 ? 1 : (warn.indexOf(pSip) >= 0 ? -1 : 0);
            var score = cG + pG;
            if (score >= 2) return {label:'좋음', color:'#50b080', bg:'#50b08015'};
            if (score >= 1) return {label:'무난', color:'#c9a96e', bg:'#c9a96e15'};
            if (score >= 0) return {label:'보통', color:'#8a8a7a', bg:'#8a8a7a10'};
            return {label:'주의', color:'#e85a5a', bg:'#e85a5a15'};
        }

        // 두 십성 조합 조언
        function getCombinedTip(cSip, pSip) {
            var cInfo = sipMap[cSip], pInfo = sipMap[pSip];
            if (!cInfo && !pInfo) return '서로의 페이스를 존중하세요';
            if (!cInfo) return pInfo.tip;
            if (!pInfo) return cInfo.tip;

            // 특수 조합
            if ((cSip==='상관'&&pSip==='편관')||(cSip==='편관'&&pSip==='상관')) return '의견 충돌 가능, 한발 양보하기';
            if ((cSip==='식신'&&pSip==='식신')) return '함께 맛있는 것 먹으러! 최고의 데이트 시기';
            if ((cSip==='정인'&&pSip==='정인')) return '서로 보살피는 따뜻한 시기';
            if ((cSip==='겁재'&&pSip==='겁재')) return '경쟁심 주의, 각자 영역 존중';
            if ((cSip==='정재'||cSip==='편재')&&(pSip==='정재'||pSip==='편재')) return '재물운 좋은 시기, 함께 계획 세우기';

            return cInfo.tip;
        }

        var months = cMonthly.length >= pMonthly.length ? cMonthly : pMonthly;

        var html = '<div style="padding:16px 0;">';
        html += '<div style="text-align:center;font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:20px;">2026 RELATIONSHIP CALENDAR</div>';

        months.forEach(function(m, i) {
            var pm = pMonthly[i] || {};
            var cSip = m.sipseong || '—';
            var pSip = pm.sipseong || '—';
            var monthNum = m.month || (i+1);
            var cInfo = sipMap[cSip] || {label:cSip, color:'#8a8a7a', icon:'·'};
            var pInfo = sipMap[pSip] || {label:pSip, color:'#8a8a7a', icon:'·'};
            var grade = getGrade(cSip, pSip);
            var tip = getCombinedTip(cSip, pSip);

            html += '<div style="display:flex;gap:10px;align-items:stretch;margin-bottom:8px;padding:12px;border-radius:12px;background:'+grade.bg+';border:1px solid '+grade.color+'22;">';

            // 월 + 등급
            html += '<div style="min-width:38px;display:flex;flex-direction:column;align-items:center;justify-content:center;">';
            html += '<div style="font-size:18px;color:var(--gold,#c9a96e);font-family:\'Noto Serif KR\',serif;font-weight:bold;">'+monthNum+'</div>';
            html += '<div style="font-size:7px;color:var(--text-ghost);margin-bottom:4px;">월</div>';
            html += '<div style="font-size:8px;color:'+grade.color+';padding:2px 6px;border-radius:6px;background:'+grade.color+'20;font-weight:bold;">'+grade.label+'</div>';
            html += '</div>';

            // 두 사람 상태
            html += '<div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:6px;">';

            // 이름 + 키워드
            html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
            html += '<div style="display:flex;align-items:center;gap:4px;">';
            html += '<span style="font-size:11px;color:'+cInfo.color+';">'+cInfo.icon+'</span>';
            html += '<span style="font-size:10px;color:#c9a96e;">'+esc(names.client)+'</span>';
            html += '<span style="font-size:11px;color:'+cInfo.color+';font-weight:bold;">'+esc(cInfo.label)+'</span>';
            html += '</div>';
            html += '<div style="display:flex;align-items:center;gap:4px;">';
            html += '<span style="font-size:10px;color:#6eaac9;">'+esc(names.partner)+'</span>';
            html += '<span style="font-size:11px;color:'+pInfo.color+';font-weight:bold;">'+esc(pInfo.label)+'</span>';
            html += '<span style="font-size:11px;color:'+pInfo.color+';">'+pInfo.icon+'</span>';
            html += '</div></div>';

            // 한줄 조언
            html += '<div style="font-size:9px;color:var(--text-ghost);padding-top:4px;border-top:1px solid rgba(255,255,255,0.04);">'+esc(tip)+'</div>';

            html += '</div></div>';
        });

        html += '</div>';
        container.innerHTML = html;
        observeSlot(container);
    }



    /* ═══════════════════════════════════
       insertVisual – 챕터 라우터 (제목 기반 자동 매칭)
       ═══════════════════════════════════ */
    function insertVisual(idx, container, dashboard) {
        if (!container || !dashboard) return;
        if (!(dashboard.client && dashboard.partner)) return;

        var chapters = (window.reportData && window.reportData.chapters) || [];
        var ch = chapters[idx];
        var title = (ch && (ch.title || ch.chapterTitle) || '');
        var tLower = title.toLowerCase();

        // 편지 챕터 → 비주얼 없음
        if (/편지|letter/.test(tLower)) {
            return;
        }

        if (/에너지.?구조|총론|개요|overview|종합/.test(tLower)) {
            renderCH0(container, dashboard);
        } else if (/끌림|attraction|이끌|매력/.test(tLower)) {
            renderCH2(container, dashboard);
        } else if (/일상|온도|day.?master|데이|상호작용|interaction/.test(tLower)) {
            renderCH1(container, dashboard);
        } else if (/오행|oheng|균형|밸런스|balance/.test(tLower)) {
            renderCH4(container, dashboard);
        } else if (/용신|yongshin|보완|교환/.test(tLower)) {
            renderCH5(container, dashboard);
        } else if (/소통|어긋|감정|communication|emotion/.test(tLower)) {
            renderCH6(container, dashboard);
        } else if (/사랑|재물|가치|wealth|values|돈|재정|흐름/.test(tLower)) {
            renderCH7(container, dashboard);
        } else if (/대운|운세|luck.?cycle|타임라인/.test(tLower)) {
            renderCH8(container, dashboard);
        } else if (/월별|monthly|2026|가이드/.test(tLower)) {
            renderCH9(container, dashboard);
        }
        // 매칭 안되면 비주얼 없음 (폴백 제거 → 잘못된 매칭 방지)
    }

    return { insertVisual: insertVisual };
})();
