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
       CH1 – 일간 상호작용
       ═══════════════════════════════════ */
    function renderCH1(container, db) {
        var names = getNames(db);
        var cDb = db.client||db, pDb = db.partner||{};
        var cross = db.crossReference || {};
        var cDM = getDayMasterGan(cDb), pDM = getDayMasterGan(pDb);
        var cOh = getDayMasterOheng(cDb), pOh = getDayMasterOheng(pDb);

        var svgW=280, svgH=160, cx1=70, cx2=210, cy=70, r=36;
        var svg = '<svg viewBox="0 0 '+svgW+' '+svgH+'" style="width:100%;max-width:300px;display:block;margin:0 auto;">';
        svg += '<circle cx="'+cx1+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+(OHENG_COLORS[cOh]||'#c9a96e')+'" stroke-width="2" opacity="0.8"/>';
        svg += '<circle cx="'+cx2+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+(OHENG_COLORS[pOh]||'#6eaac9')+'" stroke-width="2" opacity="0.8"/>';
        svg += '<text x="'+cx1+'" y="'+(cy+2)+'" text-anchor="middle" dominant-baseline="middle" fill="'+(OHENG_COLORS[cOh]||'#c9a96e')+'" font-size="22" font-family="Noto Serif KR,serif">'+esc(cDM)+'</text>';
        svg += '<text x="'+cx2+'" y="'+(cy+2)+'" text-anchor="middle" dominant-baseline="middle" fill="'+(OHENG_COLORS[pOh]||'#6eaac9')+'" font-size="22" font-family="Noto Serif KR,serif">'+esc(pDM)+'</text>';
        svg += '<text x="'+cx1+'" y="'+(cy+r+16)+'" text-anchor="middle" fill="#8a8a7a" font-size="9">'+esc(names.client)+'</text>';
        svg += '<text x="'+cx2+'" y="'+(cy+r+16)+'" text-anchor="middle" fill="#8a8a7a" font-size="9">'+esc(names.partner)+'</text>';

        // 연결
        var midX = (cx1+cx2)/2;
        svg += '<line x1="'+(cx1+r+4)+'" y1="'+cy+'" x2="'+(cx2-r-4)+'" y2="'+cy+'" stroke="#c9a96e" stroke-width="1" stroke-dasharray="6 3" opacity="0.5"/>';

        // 오행 관계 레이블
        var ohRel = cOh + ' ↔ ' + pOh;
        svg += '<rect x="'+(midX-32)+'" y="'+(cy-11)+'" width="64" height="22" rx="11" fill="rgba(201,169,110,0.12)" stroke="#c9a96e" stroke-width="0.5"/>';
        svg += '<text x="'+midX+'" y="'+(cy+2)+'" text-anchor="middle" dominant-baseline="middle" fill="#c9a96e" font-size="9">'+esc(ohRel)+'</text>';

        svg += '</svg>';
        container.innerHTML = '<div style="text-align:center;padding:12px 0;"><div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:12px;">DAY MASTER INTERACTION</div>'+svg+'</div>';
        observeSlot(container);
    }

    /* ═══════════════════════════════════
       CH2 – 합충형 관계 맵 (지지 관계)
       ═══════════════════════════════════ */
    function renderCH2(container, db) {
        var cDb = db.client||db, pDb = db.partner||{};
        var cRels = cDb.earthlyBranchRelations || [];
        var pRels = pDb.earthlyBranchRelations || [];

        var typeColors = {'합':'#50b080','충':'#e85a5a','형':'#e8a85a','파':'#8a5ae8','해':'#5a8ae8','반합(삼합)':'#50b080'};
        var items = [];

        function addItems(rels, who) {
            rels.forEach(function(r) {
                items.push({type: r.type||r.name||'?', desc: r.pair||(r.members?r.members.join(', '):''), who: who, toward: r.toward||r.name||''});
            });
        }
        addItems(cRels, '본인');
        addItems(pRels, '상대');

        if (!items.length) { container.innerHTML=''; return; }

        var html = '<div style="text-align:center;padding:12px 0;">';
        html += '<div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:16px;">EARTHLY BRANCH RELATIONS</div>';
        html += '<div style="max-width:300px;margin:0 auto;text-align:left;">';

        items.slice(0,8).forEach(function(it) {
            var color = typeColors[it.type] || '#c9a96e';
            html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;padding:8px 12px;border-radius:8px;background:rgba(255,255,255,0.03);">';
            html += '<div style="min-width:36px;height:22px;border-radius:11px;background:'+color+'22;border:1px solid '+color+'44;display:flex;align-items:center;justify-content:center;font-size:10px;color:'+color+';">'+esc(it.type.replace('반합(삼합)','반합'))+'</div>';
            html += '<div style="flex:1;font-size:11px;color:var(--text-dim);">'+esc(it.desc)+'</div>';
            if (it.toward) html += '<div style="font-size:9px;color:var(--text-ghost);">→'+esc(it.toward)+'</div>';
            html += '</div>';
        });

        html += '</div></div>';
        container.innerHTML = html;
        observeSlot(container);
    }

    /* ═══════════════════════════════════
       CH3 – 십성 크로스 비교
       ═══════════════════════════════════ */
    function renderCH3(container, db) {
        var names = getNames(db);
        var cDb = db.client||db, pDb = db.partner||{};
        var cGroups = getSipseongGroups(cDb);
        var pGroups = getSipseongGroups(pDb);
        var cats = ['비겁','식상','재성','관성','인성'];
        var catColors = ['#c9a96e','#e8815a','#50b080','#5a8ae8','#b05ac9'];

        var html = '<div style="text-align:center;padding:12px 0;">';
        html += '<div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:16px;">SIPSEONG CROSS MATRIX</div>';
        html += '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;max-width:320px;margin:0 auto;">';

        cats.forEach(function(cat,i) {
            var cVal = Number(cGroups[cat])||0, pVal = Number(pGroups[cat])||0;
            var maxVal = Math.max(cVal, pVal, 1);
            html += '<div style="text-align:center;">';
            html += '<div style="font-size:9px;color:'+catColors[i]+';margin-bottom:6px;">'+esc(cat)+'</div>';
            html += '<div style="height:60px;display:flex;align-items:flex-end;justify-content:center;gap:3px;">';
            html += '<div style="width:10px;height:'+Math.max(4,(cVal/maxVal)*50)+'px;background:#c9a96e;border-radius:2px 2px 0 0;opacity:0.8;"></div>';
            html += '<div style="width:10px;height:'+Math.max(4,(pVal/maxVal)*50)+'px;background:#6eaac9;border-radius:2px 2px 0 0;opacity:0.8;"></div>';
            html += '</div>';
            html += '<div style="font-size:8px;color:var(--text-ghost);margin-top:4px;">'+cVal+' / '+pVal+'</div></div>';
        });

        html += '</div>';
        html += '<div style="display:flex;justify-content:center;gap:16px;margin-top:12px;font-size:9px;">';
        html += '<div style="display:flex;align-items:center;gap:3px;"><div style="width:8px;height:8px;background:#c9a96e;border-radius:1px;"></div><span style="color:var(--text-dim);">'+esc(names.client)+'</span></div>';
        html += '<div style="display:flex;align-items:center;gap:3px;"><div style="width:8px;height:8px;background:#6eaac9;border-radius:1px;"></div><span style="color:var(--text-dim);">'+esc(names.partner)+'</span></div></div>';
        html += '</div>';
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
       CH6 – 감정 소통 파장
       ═══════════════════════════════════ */
    function renderCH6(container, db) {
        var names = getNames(db);
        var svgW=300, svgH=120;
        var svg = '<svg viewBox="0 0 '+svgW+' '+svgH+'" style="width:100%;max-width:320px;display:block;margin:0 auto;">';
        var p1='M 0 60', p2='M 0 60';
        for (var x=0;x<=svgW;x+=2) {
            p1 += ' L '+x+' '+(60+25*Math.sin((x/svgW)*Math.PI*4)).toFixed(1);
            p2 += ' L '+x+' '+(60+25*Math.sin((x/svgW)*Math.PI*4+1.2)).toFixed(1);
        }
        svg += '<path d="'+p1+'" fill="none" stroke="#c9a96e" stroke-width="2" opacity="0.7"/>';
        svg += '<path d="'+p2+'" fill="none" stroke="#6eaac9" stroke-width="2" opacity="0.7"/>';
        svg += '</svg>';

        var html = '<div style="text-align:center;padding:12px 0;">';
        html += '<div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:12px;">EMOTION & COMMUNICATION</div>'+svg;
        html += '<div style="display:flex;justify-content:center;gap:16px;margin-top:8px;font-size:9px;">';
        html += '<div style="display:flex;align-items:center;gap:3px;"><div style="width:12px;height:2px;background:#c9a96e;"></div><span style="color:var(--text-dim);">'+esc(names.client)+'</span></div>';
        html += '<div style="display:flex;align-items:center;gap:3px;"><div style="width:12px;height:2px;background:#6eaac9;"></div><span style="color:var(--text-dim);">'+esc(names.partner)+'</span></div></div>';
        html += '</div>';
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
       CH9 – 2026 월별 관계 가이드
       ═══════════════════════════════════ */
    function renderCH9(container, db) {
        var names = getNames(db);
        var cDb = db.client||db, pDb = db.partner||{};
        var cMonthly = getMonthly(cDb);
        var pMonthly = getMonthly(pDb);

        if (!cMonthly.length && !pMonthly.length) { container.innerHTML=''; return; }

        var months = cMonthly.length ? cMonthly : pMonthly;

        var html = '<div style="padding:12px 0;">';
        html += '<div style="text-align:center;font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:16px;">2026 MONTHLY GUIDE</div>';

        months.forEach(function(m, i) {
            var pm = pMonthly[i] || {};
            var cSip = m.sipseong || '—';
            var pSip = pm.sipseong || '—';
            var cUns = m.unsung || '—';
            var pUns = pm.unsung || '—';
            var monthNum = m.month || (i+1);

            html += '<div style="display:flex;gap:12px;align-items:center;padding:10px 12px;margin-bottom:6px;border-radius:8px;background:rgba(255,255,255,0.02);border:1px solid rgba(201,169,110,0.06);">';

            // 월 라벨
            html += '<div style="min-width:32px;text-align:center;"><div style="font-size:16px;color:var(--gold);font-family:\'Noto Serif KR\',serif;">'+monthNum+'</div><div style="font-size:8px;color:var(--text-ghost);">월</div></div>';

            // 클라이언트
            html += '<div style="flex:1;text-align:center;">';
            html += '<div style="font-size:9px;color:#c9a96e;margin-bottom:2px;">'+esc(names.client)+'</div>';
            html += '<div style="font-size:11px;color:var(--text-dim);">'+esc(cSip)+'</div>';
            html += '<div style="font-size:8px;color:var(--text-ghost);">'+esc(cUns)+'</div></div>';

            // 구분
            html += '<div style="width:1px;height:30px;background:rgba(201,169,110,0.1);"></div>';

            // 파트너
            html += '<div style="flex:1;text-align:center;">';
            html += '<div style="font-size:9px;color:#6eaac9;margin-bottom:2px;">'+esc(names.partner)+'</div>';
            html += '<div style="font-size:11px;color:var(--text-dim);">'+esc(pSip)+'</div>';
            html += '<div style="font-size:8px;color:var(--text-ghost);">'+esc(pUns)+'</div></div>';

            html += '</div>';
        });

        html += '</div>';
        container.innerHTML = html;
        observeSlot(container);
    }

    /* ═══════════════════════════════════
       CH3_simple – 십성 간소화 (직관적 성향 비교)
       ═══════════════════════════════════ */
    function renderCH3_simple(container, db) {
        var names = getNames(db);
        var cDb = db.client||db, pDb = db.partner||{};
        var cGroups = getSipseongGroups(cDb);
        var pGroups = getSipseongGroups(pDb);

        var cats = [
            {key:'비겁', label:'자아·독립', icon:'◎', color:'#c9a96e'},
            {key:'식상', label:'표현·창의', icon:'✧', color:'#e8815a'},
            {key:'재성', label:'현실·재물', icon:'◇', color:'#50b080'},
            {key:'관성', label:'책임·권위', icon:'□', color:'#5a8ae8'},
            {key:'인성', label:'학습·지혜', icon:'○', color:'#b05ac9'}
        ];

        var html = '<div style="text-align:center;padding:16px 0;">';
        html += '<div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:20px;">PERSONALITY COMPARE</div>';
        html += '<div style="max-width:300px;margin:0 auto;">';

        html += '<div style="display:flex;justify-content:space-between;margin-bottom:14px;padding:0 4px;">';
        html += '<span style="font-size:10px;color:#c9a96e;">'+esc(names.client)+'</span>';
        html += '<span style="font-size:10px;color:#6eaac9;">'+esc(names.partner)+'</span></div>';

        cats.forEach(function(cat) {
            var cVal = Number(cGroups[cat.key])||0;
            var pVal = Number(pGroups[cat.key])||0;
            var maxVal = Math.max(cVal, pVal, 1);
            var cPct = Math.round((cVal/maxVal)*100);
            var pPct = Math.round((pVal/maxVal)*100);

            html += '<div style="margin-bottom:16px;">';
            html += '<div style="text-align:center;margin-bottom:6px;">';
            html += '<span style="font-size:11px;color:'+cat.color+';letter-spacing:1px;">'+cat.icon+' '+esc(cat.label)+'</span></div>';

            html += '<div style="display:flex;align-items:center;gap:6px;">';
            html += '<div style="width:24px;text-align:right;font-size:9px;color:#c9a96e;">'+cVal+'</div>';
            html += '<div style="flex:1;height:10px;background:rgba(201,169,110,0.08);border-radius:5px;overflow:hidden;direction:rtl;">';
            html += '<div style="width:'+cPct+'%;height:100%;background:linear-gradient(to left,#c9a96e,rgba(201,169,110,0.3));border-radius:5px;transition:width 0.8s ease;"></div></div>';
            html += '<div style="width:6px;height:6px;background:'+cat.color+';border-radius:50%;opacity:0.5;flex-shrink:0;"></div>';
            html += '<div style="flex:1;height:10px;background:rgba(110,170,201,0.08);border-radius:5px;overflow:hidden;">';
            html += '<div style="width:'+pPct+'%;height:100%;background:linear-gradient(to right,rgba(110,170,201,0.3),#6eaac9);border-radius:5px;transition:width 0.8s ease;"></div></div>';
            html += '<div style="width:24px;text-align:left;font-size:9px;color:#6eaac9;">'+pVal+'</div>';
            html += '</div></div>';
        });

        html += '</div></div>';
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
        var title = (ch && (ch.title || ch.chapterTitle) || '').toLowerCase();

        if (/총론|개요|overview|종합/.test(title)) {
            renderCH0(container, dashboard);
        } else if (/끌림|attraction|이끌|매력/.test(title)) {
            renderCH2(container, dashboard);
        } else if (/일간|day.?master|데이|상호작용|interaction/.test(title)) {
            renderCH1(container, dashboard);
        } else if (/십성|sipseong|성향|성격/.test(title)) {
            renderCH3_simple(container, dashboard);
        } else if (/오행|oheng|균형|밸런스|balance/.test(title)) {
            renderCH4(container, dashboard);
        } else if (/용신|yongshin|보완/.test(title)) {
            renderCH5(container, dashboard);
        } else if (/소통|감정|communication|emotion/.test(title)) {
            renderCH6(container, dashboard);
        } else if (/재물|가치|wealth|values|돈|재정/.test(title)) {
            renderCH7(container, dashboard);
        } else if (/대운|운세|luck.?cycle|타임라인/.test(title)) {
            renderCH8(container, dashboard);
        } else if (/월별|monthly|2026|가이드/.test(title)) {
            renderCH9(container, dashboard);
        } else {
            // 폴백: idx 기반
            switch(idx) {
                case 0: renderCH0(container, dashboard); break;
                case 1: renderCH2(container, dashboard); break;
                case 2: renderCH1(container, dashboard); break;
                case 3: renderCH3_simple(container, dashboard); break;
                case 4: renderCH4(container, dashboard); break;
                case 5: renderCH5(container, dashboard); break;
                case 6: renderCH6(container, dashboard); break;
                case 7: renderCH7(container, dashboard); break;
                case 8: renderCH8(container, dashboard); break;
                case 9: renderCH9(container, dashboard); break;
            }
        }
    }

    return { insertVisual: insertVisual };
})();
