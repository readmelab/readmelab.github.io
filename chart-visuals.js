/* ============================================================
   chart-visuals-couple.js  v1.0
   궁합(W) 리포트 전용 SVG 비주얼 모듈
   ── 의존: OHENG_COLORS, OHENG_BG, OHENG_LABELS (chart-visuals.js)
   ============================================================ */
var ChartVisualCouple = (function () {
    'use strict';

    /* ── 공통 유틸 ── */
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

    function escHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    function normalizeScore(raw, min, max) {
        if (raw == null) return 50;
        var v = parseFloat(raw);
        if (isNaN(v)) return 50;
        return Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
    }

    function extractOhengValues(oheng) {
        var data = [];
        var total = 0;
        OHENG_KEYS.forEach(function (key) {
            var val = 0;
            if (oheng && typeof oheng === 'object') {
                if (typeof oheng[key] === 'number') val = oheng[key];
                else if (oheng[key] != null) {
                    if (typeof oheng[key] === 'object') val = Number(oheng[key].count) || Number(oheng[key].percentage) || 0;
                    else val = parseFloat(oheng[key]) || 0;
                }
            }
            data.push({ key: key, value: val });
            total += val;
        });
        return { data: data, total: total || 1 };
    }

    function getNames(db) {
        var rd = window.reportData || {};
        var cd = window.certData || {};
        var name1 = (rd.meta && rd.meta.name) || cd.name || '본인';
        var name2 = (rd.meta && rd.meta.partnerName) || cd.name2 || '상대방';
        return { client: name1, partner: name2 };
    }

    function observeSlot(container) {
        if (!('IntersectionObserver' in window)) {
            container.classList.add('cv-visible');
            return;
        }
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('cv-visible');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });
        obs.observe(container);
    }

    /* ── CH0: 2인 사주 + 오행 오버뷰 ── */
    function renderDualPillarsOverview(container, db) {
        var names = getNames(db);
        var clientDb = db.client || db;
        var partnerDb = db.partner || {};

        var html = '<div class="cv-couple-overview" style="text-align:center;padding:16px 0;">';
        html += '<div style="font-size:11px;color:var(--text-muted);letter-spacing:3px;margin-bottom:16px;">TWO FATES OVERVIEW</div>';

        // 2인 일간 표시
        var clientDM = (clientDb.dayMaster || clientDb.ilgan || '?');
        var partnerDM = (partnerDb.dayMaster || partnerDb.ilgan || '?');
        var clientOheng = (clientDb.dayMasterOheng || '');
        var partnerOheng = (partnerDb.dayMasterOheng || '');

        html += '<div style="display:flex;justify-content:center;align-items:center;gap:40px;margin-bottom:20px;">';
        // Client
        html += '<div style="text-align:center;">';
        html += '<div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;">' + escHtml(names.client) + '</div>';
        html += '<div style="width:56px;height:56px;border-radius:50%;border:2px solid ' + (OHENG_COLORS[clientOheng] || 'var(--gold)') + ';display:flex;align-items:center;justify-content:center;font-size:24px;font-family:\'Noto Serif KR\',serif;color:' + (OHENG_COLORS[clientOheng] || 'var(--gold)') + ';margin:0 auto;">' + escHtml(clientDM) + '</div>';
        html += '<div style="font-size:9px;color:' + (OHENG_COLORS[clientOheng] || 'var(--text-muted)') + ';margin-top:4px;">' + escHtml(clientOheng) + '</div>';
        html += '</div>';

        // 가운데 연결선
        html += '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">';
        html += '<svg width="60" height="24" viewBox="0 0 60 24"><line x1="0" y1="12" x2="60" y2="12" stroke="var(--gold-dim)" stroke-width="1" stroke-dasharray="4 3"/><polygon points="56,8 60,12 56,16" fill="var(--gold-dim)"/><polygon points="4,8 0,12 4,16" fill="var(--gold-dim)"/></svg>';
        html += '<div style="font-size:9px;color:var(--gold-dim);">인연</div>';
        html += '</div>';

        // Partner
        html += '<div style="text-align:center;">';
        html += '<div style="font-size:10px;color:var(--text-dim);margin-bottom:6px;">' + escHtml(names.partner) + '</div>';
        html += '<div style="width:56px;height:56px;border-radius:50%;border:2px solid ' + (OHENG_COLORS[partnerOheng] || 'var(--gold)') + ';display:flex;align-items:center;justify-content:center;font-size:24px;font-family:\'Noto Serif KR\',serif;color:' + (OHENG_COLORS[partnerOheng] || 'var(--gold)') + ';margin:0 auto;">' + escHtml(partnerDM) + '</div>';
        html += '<div style="font-size:9px;color:' + (OHENG_COLORS[partnerOheng] || 'var(--text-muted)') + ';margin-top:4px;">' + escHtml(partnerOheng) + '</div>';
        html += '</div>';

        html += '</div>'; // flex row

        // 간단한 오행 분포 미니 바
        var clientOhengData = extractOhengValues(clientDb.oheng || clientDb.ohengDistribution);
        var partnerOhengData = extractOhengValues(partnerDb.oheng || partnerDb.ohengDistribution);

        html += '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:12px;">';
        OHENG_KEYS.forEach(function (key, i) {
            var cPct = Math.round((clientOhengData.data[i].value / clientOhengData.total) * 100);
            var pPct = Math.round((partnerOhengData.data[i].value / partnerOhengData.total) * 100);
            html += '<div style="text-align:center;min-width:40px;">';
            html += '<div style="font-size:9px;color:' + OHENG_COLORS[key] + ';">' + OHENG_LABELS[key] + '</div>';
            html += '<div style="font-size:10px;color:var(--text-dim);">' + cPct + '<span style="color:var(--text-ghost);"> / </span>' + pPct + '</div>';
            html += '</div>';
        });
        html += '</div>';

        html += '</div>';
        container.innerHTML = html;
        observeSlot(container);
    }

    /* ── CH1: 일간 상호작용 다이어그램 ── */
    function renderDayGanInteraction(container, db) {
        var names = getNames(db);
        var clientDb = db.client || db;
        var partnerDb = db.partner || {};
        var cross = db.crossReference || {};

        var clientDM = clientDb.dayMaster || clientDb.ilgan || '?';
        var partnerDM = partnerDb.dayMaster || partnerDb.ilgan || '?';
        var clientOh = clientDb.dayMasterOheng || '';
        var partnerOh = partnerDb.dayMasterOheng || '';
        var relationType = cross.dayGanRelation || cross.ilganRelation || '—';

        var svgW = 280, svgH = 160;
        var svg = '<svg viewBox="0 0 ' + svgW + ' ' + svgH + '" style="width:100%;max-width:300px;display:block;margin:0 auto;">';

        // 두 원
        var cx1 = 70, cx2 = 210, cy = 70, r = 36;
        svg += '<circle cx="' + cx1 + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + (OHENG_COLORS[clientOh] || '#c9a96e') + '" stroke-width="2" opacity="0.8"/>';
        svg += '<circle cx="' + cx2 + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + (OHENG_COLORS[partnerOh] || '#c9a96e') + '" stroke-width="2" opacity="0.8"/>';

        // 글자
        svg += '<text x="' + cx1 + '" y="' + (cy + 2) + '" text-anchor="middle" dominant-baseline="middle" fill="' + (OHENG_COLORS[clientOh] || '#c9a96e') + '" font-size="22" font-family="Noto Serif KR,serif">' + escHtml(clientDM) + '</text>';
        svg += '<text x="' + cx2 + '" y="' + (cy + 2) + '" text-anchor="middle" dominant-baseline="middle" fill="' + (OHENG_COLORS[partnerOh] || '#c9a96e') + '" font-size="22" font-family="Noto Serif KR,serif">' + escHtml(partnerDM) + '</text>';

        // 이름 레이블
        svg += '<text x="' + cx1 + '" y="' + (cy + r + 18) + '" text-anchor="middle" fill="#8a8a7a" font-size="9">' + escHtml(names.client) + '</text>';
        svg += '<text x="' + cx2 + '" y="' + (cy + r + 18) + '" text-anchor="middle" fill="#8a8a7a" font-size="9">' + escHtml(names.partner) + '</text>';

        // 연결 화살표
        svg += '<line x1="' + (cx1 + r + 4) + '" y1="' + cy + '" x2="' + (cx2 - r - 4) + '" y2="' + cy + '" stroke="#c9a96e" stroke-width="1.5" stroke-dasharray="6 3" opacity="0.6"/>';

        // 관계 레이블
        var midX = (cx1 + cx2) / 2;
        svg += '<rect x="' + (midX - 30) + '" y="' + (cy - 12) + '" width="60" height="24" rx="12" fill="rgba(201,169,110,0.15)" stroke="#c9a96e" stroke-width="0.5"/>';
        svg += '<text x="' + midX + '" y="' + (cy + 2) + '" text-anchor="middle" dominant-baseline="middle" fill="#c9a96e" font-size="10">' + escHtml(relationType) + '</text>';

        // 하단 오행 관계
        var ohengRel = cross.dayOhengRelation || cross.ohengInteraction || '';
        if (ohengRel) {
            svg += '<text x="' + midX + '" y="' + (svgH - 10) + '" text-anchor="middle" fill="#6a6a5a" font-size="9">' + escHtml(ohengRel) + '</text>';
        }

        svg += '</svg>';
        container.innerHTML = '<div style="text-align:center;padding:12px 0;"><div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:12px;">DAY MASTER INTERACTION</div>' + svg + '</div>';
        observeSlot(container);
    }

    /* ── CH2: 오행 레이더 오버레이 ── */
    function renderOhengRadarOverlay(container, db) {
        var names = getNames(db);
        var clientDb = db.client || db;
        var partnerDb = db.partner || {};

        var cData = extractOhengValues(clientDb.oheng || clientDb.ohengDistribution);
        var pData = extractOhengValues(partnerDb.oheng || partnerDb.ohengDistribution);

        var svgW = 280, svgH = 280;
        var cx = svgW / 2, cy = svgH / 2, maxR = 100;

        var svg = '<svg viewBox="0 0 ' + svgW + ' ' + svgH + '" style="width:100%;max-width:300px;display:block;margin:0 auto;">';

        // 배경 오각형 (3단계)
        for (var level = 1; level <= 3; level++) {
            var lr = maxR * (level / 3);
            var bgPath = '';
            for (var k = 0; k < 5; k++) {
                var angle = (Math.PI * 2 * k / 5) - Math.PI / 2;
                var px = cx + lr * Math.cos(angle);
                var py = cy + lr * Math.sin(angle);
                bgPath += (k === 0 ? 'M' : 'L') + px.toFixed(1) + ',' + py.toFixed(1);
            }
            bgPath += 'Z';
            svg += '<path d="' + bgPath + '" fill="none" stroke="rgba(201,169,110,0.15)" stroke-width="0.5"/>';
        }

        // 축 라인 + 레이블
        OHENG_KEYS.forEach(function (key, i) {
            var angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
            var ex = cx + maxR * Math.cos(angle);
            var ey = cy + maxR * Math.sin(angle);
            svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + ex.toFixed(1) + '" y2="' + ey.toFixed(1) + '" stroke="rgba(201,169,110,0.1)" stroke-width="0.5"/>';
            var lx = cx + (maxR + 16) * Math.cos(angle);
            var ly = cy + (maxR + 16) * Math.sin(angle);
            svg += '<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle" dominant-baseline="middle" fill="' + OHENG_COLORS[key] + '" font-size="11">' + OHENG_LABELS[key] + '</text>';
        });

        // 데이터 다각형 그리기 함수
        function drawPolygon(dataObj, color, opacity) {
            var path = '';
            dataObj.data.forEach(function (d, i) {
                var pct = d.value / dataObj.total;
                var r = maxR * Math.min(pct * 5, 1); // 20%이면 maxR
                var angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
                var px = cx + r * Math.cos(angle);
                var py = cy + r * Math.sin(angle);
                path += (i === 0 ? 'M' : 'L') + px.toFixed(1) + ',' + py.toFixed(1);
            });
            path += 'Z';
            svg += '<path d="' + path + '" fill="' + color + '" fill-opacity="' + (opacity * 0.3) + '" stroke="' + color + '" stroke-width="1.5" stroke-opacity="' + opacity + '"/>';
        }

        drawPolygon(cData, '#c9a96e', 0.8); // 클라이언트 (금색)
        drawPolygon(pData, '#6eaac9', 0.8); // 파트너 (파란색)

        svg += '</svg>';

        // 범례
        var legend = '<div style="display:flex;justify-content:center;gap:20px;margin-top:8px;font-size:10px;">';
        legend += '<div style="display:flex;align-items:center;gap:4px;"><div style="width:12px;height:3px;background:#c9a96e;border-radius:2px;"></div><span style="color:var(--text-dim);">' + escHtml(names.client) + '</span></div>';
        legend += '<div style="display:flex;align-items:center;gap:4px;"><div style="width:12px;height:3px;background:#6eaac9;border-radius:2px;"></div><span style="color:var(--text-dim);">' + escHtml(names.partner) + '</span></div>';
        legend += '</div>';

        container.innerHTML = '<div style="text-align:center;padding:12px 0;"><div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:8px;">OHENG RADAR OVERLAY</div>' + svg + legend + '</div>';
        observeSlot(container);
    }

    /* ── CH3: 십성 크로스 매트릭스 ── */
    function renderSipseongCross(container, db) {
        var names = getNames(db);
        var clientDb = db.client || db;
        var partnerDb = db.partner || {};
        var cross = db.crossReference || {};

        var clientSipseong = clientDb.sipseong || clientDb.sipseongDistribution || {};
        var partnerSipseong = partnerDb.sipseong || partnerDb.sipseongDistribution || {};

        var categories = ['비겁', '식상', '재성', '관성', '인성'];
        var catColors = ['#c9a96e', '#e8815a', '#50b080', '#5a8ae8', '#b05ac9'];

        var html = '<div style="text-align:center;padding:12px 0;">';
        html += '<div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:16px;">SIPSEONG CROSS MATRIX</div>';
        html += '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;max-width:320px;margin:0 auto;">';

        categories.forEach(function (cat, i) {
            var cVal = Number(clientSipseong[cat]) || 0;
            var pVal = Number(partnerSipseong[cat]) || 0;
            var maxVal = Math.max(cVal, pVal, 1);

            html += '<div style="text-align:center;">';
            html += '<div style="font-size:9px;color:' + catColors[i] + ';margin-bottom:6px;">' + escHtml(cat) + '</div>';

            // 미니 듀얼 바
            html += '<div style="height:60px;display:flex;align-items:flex-end;justify-content:center;gap:3px;">';
            var cH = Math.max(4, (cVal / maxVal) * 50);
            var pH = Math.max(4, (pVal / maxVal) * 50);
            html += '<div style="width:10px;height:' + cH + 'px;background:#c9a96e;border-radius:2px 2px 0 0;opacity:0.8;"></div>';
            html += '<div style="width:10px;height:' + pH + 'px;background:#6eaac9;border-radius:2px 2px 0 0;opacity:0.8;"></div>';
            html += '</div>';

            html += '<div style="font-size:8px;color:var(--text-ghost);margin-top:4px;">' + cVal + ' / ' + pVal + '</div>';
            html += '</div>';
        });

        html += '</div>';

        // 범례
        html += '<div style="display:flex;justify-content:center;gap:16px;margin-top:12px;font-size:9px;">';
        html += '<div style="display:flex;align-items:center;gap:3px;"><div style="width:8px;height:8px;background:#c9a96e;border-radius:1px;"></div><span style="color:var(--text-dim);">' + escHtml(names.client) + '</span></div>';
        html += '<div style="display:flex;align-items:center;gap:3px;"><div style="width:8px;height:8px;background:#6eaac9;border-radius:1px;"></div><span style="color:var(--text-dim);">' + escHtml(names.partner) + '</span></div>';
        html += '</div>';

        html += '</div>';
        container.innerHTML = html;
        observeSlot(container);
    }

    /* ── CH4: 합/충/형 인터랙션 맵 ── */
    function renderHapChungMap(container, db) {
        var cross = db.crossReference || {};
        var interactions = cross.hapChung || cross.pillarInteractions || [];

        // interactions가 배열이 아니면 텍스트로 표시
        if (!Array.isArray(interactions) || interactions.length === 0) {
            var textData = cross.hapChungSummary || cross.combinationAnalysis || '';
            if (!textData) {
                container.innerHTML = '';
                return;
            }
            container.innerHTML = '<div style="text-align:center;padding:16px;font-size:11px;color:var(--text-dim);line-height:1.8;">' + escHtml(textData) + '</div>';
            observeSlot(container);
            return;
        }

        var svgW = 300, svgH = 200;
        var svg = '<svg viewBox="0 0 ' + svgW + ' ' + svgH + '" style="width:100%;max-width:320px;display:block;margin:0 auto;">';

        var typeColors = { '합': '#50b080', '충': '#e85a5a', '형': '#e8a85a', '파': '#8a5ae8', '해': '#5a8ae8' };

        interactions.forEach(function (item, i) {
            var y = 30 + i * 36;
            if (y > svgH - 20) return;

            var type = item.type || '?';
            var from = item.from || item.client || '?';
            var to = item.to || item.partner || '?';
            var color = typeColors[type] || '#c9a96e';

            svg += '<text x="40" y="' + y + '" text-anchor="middle" fill="#c9a96e" font-size="14" font-family="Noto Serif KR,serif">' + escHtml(from) + '</text>';
            svg += '<line x1="65" y1="' + (y - 4) + '" x2="195" y2="' + (y - 4) + '" stroke="' + color + '" stroke-width="1.5" stroke-dasharray="' + (type === '충' ? '4 3' : 'none') + '" opacity="0.7"/>';
            svg += '<rect x="115" y="' + (y - 14) + '" width="30" height="20" rx="10" fill="' + color + '" fill-opacity="0.2" stroke="' + color + '" stroke-width="0.5"/>';
            svg += '<text x="130" y="' + (y - 1) + '" text-anchor="middle" fill="' + color + '" font-size="10">' + escHtml(type) + '</text>';
            svg += '<text x="220" y="' + y + '" text-anchor="middle" fill="#6eaac9" font-size="14" font-family="Noto Serif KR,serif">' + escHtml(to) + '</text>';
        });

        svg += '</svg>';
        container.innerHTML = '<div style="text-align:center;padding:12px 0;"><div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:12px;">PILLAR INTERACTIONS</div>' + svg + '</div>';
        observeSlot(container);
    }

    /* ── CH5: 감정 & 소통 파장 비교 ── */
    function renderEmotionWaves(container, db) {
        var names = getNames(db);
        var cross = db.crossReference || {};
        var emotionSync = cross.emotionSync || cross.communicationScore || null;

        var svgW = 300, svgH = 120;
        var svg = '<svg viewBox="0 0 ' + svgW + ' ' + svgH + '" style="width:100%;max-width:320px;display:block;margin:0 auto;">';

        // 클라이언트 사인 웨이브
        var path1 = 'M 0 60';
        var path2 = 'M 0 60';
        for (var x = 0; x <= svgW; x += 2) {
            var y1 = 60 + 25 * Math.sin((x / svgW) * Math.PI * 4);
            var y2 = 60 + 25 * Math.sin((x / svgW) * Math.PI * 4 + 1.2); // 위상차
            path1 += ' L ' + x + ' ' + y1.toFixed(1);
            path2 += ' L ' + x + ' ' + y2.toFixed(1);
        }

        svg += '<path d="' + path1 + '" fill="none" stroke="#c9a96e" stroke-width="2" opacity="0.7"/>';
        svg += '<path d="' + path2 + '" fill="none" stroke="#6eaac9" stroke-width="2" opacity="0.7"/>';

        svg += '</svg>';

        var html = '<div style="text-align:center;padding:12px 0;">';
        html += '<div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:12px;">EMOTION & COMMUNICATION</div>';
        html += svg;

        // 범례
        html += '<div style="display:flex;justify-content:center;gap:16px;margin-top:8px;font-size:9px;">';
        html += '<div style="display:flex;align-items:center;gap:3px;"><div style="width:12px;height:2px;background:#c9a96e;"></div><span style="color:var(--text-dim);">' + escHtml(names.client) + '</span></div>';
        html += '<div style="display:flex;align-items:center;gap:3px;"><div style="width:12px;height:2px;background:#6eaac9;"></div><span style="color:var(--text-dim);">' + escHtml(names.partner) + '</span></div>';
        html += '</div>';

        if (emotionSync != null) {
            html += '<div style="margin-top:10px;font-size:11px;color:var(--gold);">소통 싱크율: ' + emotionSync + '%</div>';
        }

        html += '</div>';
        container.innerHTML = html;
        observeSlot(container);
    }

    /* ── CH6: 재물 & 가치관 비교 게이지 ── */
    function renderWealthCompare(container, db) {
        var names = getNames(db);
        var clientDb = db.client || db;
        var partnerDb = db.partner || {};

        var categories = [
            { label: '재물운', cKey: 'wealthScore', pKey: 'wealthScore' },
            { label: '저축 성향', cKey: 'savingTendency', pKey: 'savingTendency' },
            { label: '투자 성향', cKey: 'investTendency', pKey: 'investTendency' },
            { label: '소비 성향', cKey: 'spendTendency', pKey: 'spendTendency' }
        ];

        var html = '<div style="text-align:center;padding:12px 0;">';
        html += '<div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:16px;">WEALTH & VALUES</div>';

        categories.forEach(function (cat) {
            var cVal = normalizeScore(clientDb[cat.cKey], 0, 100);
            var pVal = normalizeScore(partnerDb[cat.pKey], 0, 100);

            html += '<div style="margin-bottom:12px;max-width:280px;margin-left:auto;margin-right:auto;">';
            html += '<div style="font-size:9px;color:var(--text-dim);margin-bottom:4px;">' + escHtml(cat.label) + '</div>';

            // 듀얼 바
            html += '<div style="display:flex;gap:4px;align-items:center;">';
            // 클라이언트 (오른쪽으로)
            html += '<div style="flex:1;height:8px;background:rgba(201,169,110,0.1);border-radius:4px;overflow:hidden;direction:rtl;">';
            html += '<div style="width:' + cVal + '%;height:100%;background:linear-gradient(to right,#c9a96e,rgba(201,169,110,0.4));border-radius:4px;"></div>';
            html += '</div>';
            // 가운데 구분
            html += '<div style="width:2px;height:12px;background:var(--gold-dim);border-radius:1px;"></div>';
            // 파트너 (왼쪽으로)
            html += '<div style="flex:1;height:8px;background:rgba(110,170,201,0.1);border-radius:4px;overflow:hidden;">';
            html += '<div style="width:' + pVal + '%;height:100%;background:linear-gradient(to right,rgba(110,170,201,0.4),#6eaac9);border-radius:4px;"></div>';
            html += '</div>';
            html += '</div>';

            html += '<div style="display:flex;justify-content:space-between;font-size:8px;color:var(--text-ghost);margin-top:2px;">';
            html += '<span>' + Math.round(cVal) + '</span><span>' + Math.round(pVal) + '</span>';
            html += '</div>';

            html += '</div>';
        });

        // 범례
        html += '<div style="display:flex;justify-content:center;gap:16px;margin-top:8px;font-size:9px;">';
        html += '<div style="display:flex;align-items:center;gap:3px;"><div style="width:8px;height:8px;background:#c9a96e;border-radius:1px;"></div><span style="color:var(--text-dim);">' + escHtml(names.client) + '</span></div>';
        html += '<div style="display:flex;align-items:center;gap:3px;"><div style="width:8px;height:8px;background:#6eaac9;border-radius:1px;"></div><span style="color:var(--text-dim);">' + escHtml(names.partner) + '</span></div>';
        html += '</div>';

        html += '</div>';
        container.innerHTML = html;
        observeSlot(container);
    }

    /* ── CH7: 대운 싱크 타임라인 ── */
    function renderDaeunSync(container, db) {
        var names = getNames(db);
        var clientDb = db.client || db;
        var partnerDb = db.partner || {};
        var cross = db.crossReference || {};

        var clientDaeun = clientDb.daeun || clientDb.daeunCycles || [];
        var partnerDaeun = partnerDb.daeun || partnerDb.daeunCycles || [];
        var syncData = cross.luckSync || cross.daeunSync || [];

        if (!clientDaeun.length && !partnerDaeun.length) {
            container.innerHTML = '';
            return;
        }

        var maxCycles = Math.max(clientDaeun.length, partnerDaeun.length, 1);
        var svgW = 300, svgH = 140;
        var svg = '<svg viewBox="0 0 ' + svgW + ' ' + svgH + '" style="width:100%;max-width:320px;display:block;margin:0 auto;">';

        // 기준선
        svg += '<line x1="20" y1="70" x2="' + (svgW - 20) + '" y2="70" stroke="rgba(201,169,110,0.2)" stroke-width="0.5"/>';

        var segW = (svgW - 40) / Math.min(maxCycles, 8);

        // 클라이언트 라인
        var cPath = '';
        clientDaeun.slice(0, 8).forEach(function (d, i) {
            var x = 20 + i * segW + segW / 2;
            var score = normalizeScore(d.score || d.luck || 50, 0, 100);
            var y = 130 - (score / 100) * 120;
            cPath += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
            svg += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3" fill="#c9a96e" opacity="0.8"/>';

            // 나이/시기 레이블
            var age = d.age || d.startAge || '';
            if (age) svg += '<text x="' + x.toFixed(1) + '" y="' + (svgH - 2) + '" text-anchor="middle" fill="var(--text-ghost)" font-size="7">' + age + '</text>';
        });
        if (cPath) svg += '<path d="' + cPath + '" fill="none" stroke="#c9a96e" stroke-width="1.5" opacity="0.7"/>';

        // 파트너 라인
        var pPath = '';
        partnerDaeun.slice(0, 8).forEach(function (d, i) {
            var x = 20 + i * segW + segW / 2;
            var score = normalizeScore(d.score || d.luck || 50, 0, 100);
            var y = 130 - (score / 100) * 120;
            pPath += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
            svg += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3" fill="#6eaac9" opacity="0.8"/>';
        });
        if (pPath) svg += '<path d="' + pPath + '" fill="none" stroke="#6eaac9" stroke-width="1.5" opacity="0.7"/>';

        svg += '</svg>';

        var html = '<div style="text-align:center;padding:12px 0;">';
        html += '<div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:12px;">LUCK CYCLE SYNC</div>';
        html += svg;

        // 싱크율 표시
        var syncRate = cross.luckSyncRate || cross.daeunSyncRate || null;
        if (syncRate != null) {
            html += '<div style="margin-top:10px;font-size:11px;color:var(--gold);">대운 싱크율: ' + syncRate + '%</div>';
        }

        // 범례
        html += '<div style="display:flex;justify-content:center;gap:16px;margin-top:8px;font-size:9px;">';
        html += '<div style="display:flex;align-items:center;gap:3px;"><div style="width:12px;height:2px;background:#c9a96e;"></div><span style="color:var(--text-dim);">' + escHtml(names.client) + '</span></div>';
        html += '<div style="display:flex;align-items:center;gap:3px;"><div style="width:12px;height:2px;background:#6eaac9;"></div><span style="color:var(--text-dim);">' + escHtml(names.partner) + '</span></div>';
        html += '</div>';

        html += '</div>';
        container.innerHTML = html;
        observeSlot(container);
    }

    /* ── CH8: 종합 궁합 스코어 대시보드 ── */
    function renderCompatScore(container, db) {
        var cross = db.crossReference || {};
        var score = parseFloat(cross.compatScore || cross.totalScore || 0);

        var svgW = 200, svgH = 120;
        var cx = 100, cy = 100, r = 80;
        var circumference = Math.PI * r; // 반원
        var pct = Math.min(score, 100) / 100;
        var dashLen = circumference * pct;

        var svg = '<svg viewBox="0 0 ' + svgW + ' ' + svgH + '" style="width:100%;max-width:220px;display:block;margin:0 auto;">';

        // 배경 반원
        svg += '<path d="M ' + (cx - r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy + '" fill="none" stroke="rgba(201,169,110,0.1)" stroke-width="10" stroke-linecap="round"/>';

        // 점수 반원
        var color = score >= 80 ? '#50b080' : score >= 60 ? '#c9a96e' : score >= 40 ? '#e8a85a' : '#e85a5a';
        svg += '<path d="M ' + (cx - r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy + '" fill="none" stroke="' + color + '" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + dashLen.toFixed(1) + ' ' + circumference.toFixed(1) + '" opacity="0.8"/>';

        // 점수 텍스트
        svg += '<text x="' + cx + '" y="' + (cy - 20) + '" text-anchor="middle" fill="' + color + '" font-size="32" font-family="Noto Serif KR,serif" font-weight="bold">' + Math.round(score) + '</text>';
        svg += '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" fill="var(--text-dim)" font-size="10">/ 100</text>';

        svg += '</svg>';

        // 세부 항목
        var categories = [
            { label: '오행 조화', key: 'ohengHarmony' },
            { label: '일간 궁합', key: 'dayGanCompat' },
            { label: '십성 밸런스', key: 'sipseongBalance' },
            { label: '대운 싱크', key: 'luckSyncRate' },
            { label: '감정 교류', key: 'emotionSync' }
        ];

        var detailHtml = '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;max-width:300px;margin:12px auto 0;">';
        categories.forEach(function (cat) {
            var val = cross[cat.key] || cross[cat.key.toLowerCase()] || '—';
            detailHtml += '<div style="text-align:center;">';
            detailHtml += '<div style="font-size:8px;color:var(--text-ghost);margin-bottom:3px;">' + escHtml(cat.label) + '</div>';
            detailHtml += '<div style="font-size:12px;color:var(--gold);">' + escHtml(val) + '</div>';
            detailHtml += '</div>';
        });
        detailHtml += '</div>';

        var html = '<div style="text-align:center;padding:16px 0;">';
        html += '<div style="font-size:10px;color:var(--text-muted);letter-spacing:2px;margin-bottom:12px;">COMPATIBILITY SCORE</div>';
        html += svg + detailHtml;
        html += '</div>';

        container.innerHTML = html;
        observeSlot(container);
    }

    /* ── CH9: 편지 봉투 (N 버전과 유사, 2인 수신자) ── */
    function renderCoupleLetter(container, db) {
        var names = getNames(db);

        var html = '<div class="cv-letter-envelope" style="text-align:center;padding:20px;">';
        html += '<div style="font-size:40px;margin-bottom:12px;opacity:0;animation:cvFadeIn 1s 0.3s forwards;">💌</div>';
        html += '<div style="font-size:12px;color:var(--gold);font-family:\'Noto Serif KR\',serif;opacity:0;animation:cvFadeIn 1s 0.6s forwards;">';
        html += escHtml(names.client) + '님 & ' + escHtml(names.partner) + '님께</div>';
        html += '<div style="width:40px;height:1px;background:var(--gold-dim);margin:12px auto;opacity:0;animation:cvFadeIn 1s 0.9s forwards;"></div>';
        html += '<div style="font-size:9px;color:var(--text-ghost);opacity:0;animation:cvFadeIn 1s 1.2s forwards;">나를읽다 연구소</div>';
        html += '</div>';

        // fadeIn 애니메이션 CSS 주입 (한 번만)
        if (!document.getElementById('cvCoupleLetterStyle')) {
            var style = document.createElement('style');
            style.id = 'cvCoupleLetterStyle';
            style.textContent = '@keyframes cvFadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}';
            document.head.appendChild(style);
        }

        container.innerHTML = html;
        observeSlot(container);
    }

    /* ── insertVisual: 챕터 인덱스별 분기 ── */
    function insertVisual(chapterIndex, container, dashboard) {
        if (!container || !dashboard) return;

        // 커플 대시보드 감지
        var isCouple = !!(dashboard.client && dashboard.partner);
        if (!isCouple) return; // 이 모듈은 커플 전용

        switch (chapterIndex) {
            case 0: renderDualPillarsOverview(container, dashboard); break;
            case 1: renderDayGanInteraction(container, dashboard); break;
            case 2: renderOhengRadarOverlay(container, dashboard); break;
            case 3: renderSipseongCross(container, dashboard); break;
            case 4: renderHapChungMap(container, dashboard); break;
            case 5: renderEmotionWaves(container, dashboard); break;
            case 6: renderWealthCompare(container, dashboard); break;
            case 7: renderDaeunSync(container, dashboard); break;
            case 8: renderCompatScore(container, dashboard); break;
            case 9: renderCoupleLetter(container, dashboard); break;
            default: break;
        }
    }

    /* ── Public API ── */
    return {
        insertVisual: insertVisual
    };

})();
