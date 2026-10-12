/*
 * 테스트모음 공통 테스트 엔진
 *
 * 새 테스트는 HTML에 시작 화면(#screen-start)과 해설글만 정적으로 쓰고,
 * 질문·결과는 TestEngine.init(config)로 넘긴다. 질문 화면, 생년월일 입력,
 * 로딩, 결과 화면, 이미지 저장, 공유(js/viral.js), GA4 이벤트는 엔진이 처리한다.
 * 사용 예시는 _templates/quiz-test.html, newyear-2027.html 참고.
 *
 * config = {
 *   id: 'newyear',                 // js/viral.js TESTS 키 (공유 카드·GA 이벤트에 사용)
 *   mode: 'quiz' | 'birth',
 *   accent: 'rose',                // Tailwind 색 이름 (rose, indigo, purple, teal, amber ...)
 *   resultLabel: '나의 결과',       // 결과 카드 상단 문구
 *   loadingTitle, loadingDesc,     // 로딩 화면 문구 (선택)
 *
 *   // quiz 모드
 *   questions: [{ q: '질문', category: '상황', answers: [{ text: '답', scores: { E: 1 } }] }],
 *   decide: function (scores, answers) { return 결과 인덱스; },   // answers = 고른 답 번호 배열
 *
 *   // birth 모드
 *   askName: true,                 // 이름/닉네임 입력 칸 표시
 *   compute: function (birth) { return 결과 인덱스; },   // birth = { name, year, month, day }
 *
 *   results: [{
 *     name, badge, img, tags: [], summary,
 *     sections: [{ title, text } | { title, items: [] } | { title, pairs: [[라벨, 값]] }]
 *   }],
 *   related: [{ title, href }]     // 결과 화면 하단 추천 테스트
 * }
 */
(function () {
    var cfg = null;
    var state = { step: 0, scores: {}, answers: [], birth: null, resultIdx: -1 };

    function $(id) { return document.getElementById(id); }

    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function track(name, params) {
        try { if (typeof gtag === 'function') gtag('event', name, params || {}); } catch (e) {}
    }

    var SCREENS = ['screen-start', 'screen-input', 'screen-question', 'screen-loading', 'screen-result'];

    function show(id) {
        SCREENS.forEach(function (s) {
            var el = $(s);
            if (el) { el.classList.add('hidden'); el.classList.remove('flex'); }
        });
        var el = $(id);
        if (el) {
            el.classList.remove('hidden');
            if (id === 'screen-loading') el.classList.add('flex');
        }
        var bar = $('tm-progress');
        if (bar) bar.classList.toggle('hidden', id !== 'screen-question');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ---------- 화면 뼈대 생성 ----------
    function buildScreens() {
        var a = cfg.accent;
        var app = $('tm-app');

        var progress = document.createElement('div');
        progress.id = 'tm-progress';
        progress.className = 'hidden w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4';
        progress.innerHTML = '<div id="tm-progress-bar" class="h-full bg-' + a + '-500 transition-all duration-300" style="width:0%"></div>';
        app.insertBefore(progress, app.firstChild);

        if (cfg.mode === 'birth') {
            var input = document.createElement('section');
            input.id = 'screen-input';
            input.className = 'hidden space-y-5 py-1';
            var nameField = cfg.askName === false ? '' :
                '<div><label class="block text-xs font-bold text-gray-700 mb-1.5" for="tm-name">이름 또는 닉네임 (선택)</label>' +
                '<input id="tm-name" type="text" maxlength="12" placeholder="예: 테스트모음" class="w-full border border-gray-200 rounded-xl py-3 px-3 text-sm bg-white focus:outline-none focus:border-' + a + '-500"></div>';
            input.innerHTML =
                '<div class="text-left space-y-1">' +
                    '<h2 class="text-xl font-bold text-gray-900">생년월일을 알려주세요</h2>' +
                    '<p class="text-xs text-gray-400">입력한 정보는 브라우저 안에서만 계산하고 저장하지 않아요</p>' +
                '</div>' +
                '<div class="space-y-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">' + nameField +
                    '<div><label class="block text-xs font-bold text-gray-700 mb-1.5">생년월일 (양력)</label>' +
                    '<div class="grid grid-cols-3 gap-2">' +
                        '<select id="tm-year" aria-label="태어난 해" class="w-full border border-gray-200 rounded-xl py-3 px-2 text-sm bg-white"></select>' +
                        '<select id="tm-month" aria-label="태어난 달" class="w-full border border-gray-200 rounded-xl py-3 px-2 text-sm bg-white"></select>' +
                        '<select id="tm-day" aria-label="태어난 날" class="w-full border border-gray-200 rounded-xl py-3 px-2 text-sm bg-white"></select>' +
                    '</div></div>' +
                '</div>' +
                '<button type="button" id="tm-submit-birth" class="w-full bg-' + a + '-600 hover:bg-' + a + '-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl text-base shadow-md transition-all">결과 보기</button>';
            app.appendChild(input);
            fillDateSelects();
            $('tm-submit-birth').addEventListener('click', submitBirth);
        } else {
            var q = document.createElement('section');
            q.id = 'screen-question';
            q.className = 'hidden space-y-5 py-2';
            q.innerHTML =
                '<div class="flex justify-between items-center text-xs font-bold text-gray-400">' +
                    '<span id="tm-q-category" class="text-' + a + '-500"></span><span id="tm-q-num"></span>' +
                '</div>' +
                '<h2 id="tm-q-text" class="text-lg font-black text-gray-900 leading-snug min-h-[3.5rem] flex items-center"></h2>' +
                '<div id="tm-answers" class="space-y-3 pt-2"></div>';
            app.appendChild(q);
        }

        var loading = document.createElement('section');
        loading.id = 'screen-loading';
        loading.className = 'hidden flex-col items-center justify-center py-20 space-y-4 text-center';
        loading.innerHTML =
            '<div class="w-9 h-9 rounded-full border-[3px] border-gray-100 border-t-' + a + '-500 animate-spin"></div>' +
            '<div class="space-y-1"><h3 class="text-base font-bold text-gray-800">' + esc(cfg.loadingTitle || '결과를 분석하고 있어요...') + '</h3>' +
            '<p class="text-xs text-gray-400">' + esc(cfg.loadingDesc || '잠시만 기다려 주세요') + '</p></div>';
        app.appendChild(loading);

        var result = document.createElement('section');
        result.id = 'screen-result';
        result.className = 'hidden space-y-4 pb-6 text-left';
        app.appendChild(result);
    }

    function fillDateSelects() {
        var y = $('tm-year'), m = $('tm-month'), d = $('tm-day');
        var now = new Date().getFullYear();
        for (var i = now - 10; i >= 1940; i--) y.add(new Option(i + '년', i, false, i === 1998));
        for (i = 1; i <= 12; i++) m.add(new Option(i + '월', i));
        for (i = 1; i <= 31; i++) d.add(new Option(i + '일', i));
    }

    // ---------- 진행 ----------
    function start() {
        state = { step: 0, scores: {}, answers: [], birth: null, resultIdx: -1 };
        if (window.TM) TM.start(cfg.id);
        if (cfg.mode === 'birth') {
            show('screen-input');
        } else {
            show('screen-question');
            renderQuestion();
        }
    }

    function renderQuestion() {
        var q = cfg.questions[state.step];
        if (!q) return;
        var total = cfg.questions.length;
        $('tm-progress-bar').style.width = ((state.step + 1) / total * 100) + '%';
        $('tm-q-category').textContent = q.category || '';
        $('tm-q-num').textContent = 'Q' + (state.step + 1) + ' / ' + total;
        $('tm-q-text').textContent = q.q;
        var box = $('tm-answers');
        box.innerHTML = '';
        q.answers.forEach(function (ans, i) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'w-full text-left p-4 rounded-2xl border border-gray-200 bg-white hover:border-' + cfg.accent + '-400 hover:bg-' + cfg.accent + '-50/50 active:scale-[0.99] text-sm font-medium text-gray-800 leading-relaxed transition-all';
            b.textContent = ans.text;
            b.addEventListener('click', function () { answer(i); });
            box.appendChild(b);
        });
    }

    var locked = false;
    function answer(i) {
        if (locked) return;
        locked = true;
        var q = cfg.questions[state.step];
        var scores = q.answers[i].scores || {};
        for (var k in scores) state.scores[k] = (state.scores[k] || 0) + scores[k];
        state.answers.push(i);
        state.step++;
        setTimeout(function () {
            locked = false;
            if (state.step < cfg.questions.length) renderQuestion();
            else finish(cfg.decide(state.scores, state.answers));
        }, 120);
    }

    function submitBirth() {
        if (locked) return;
        var nameEl = $('tm-name');
        state.birth = {
            name: nameEl ? nameEl.value.trim() : '',
            year: parseInt($('tm-year').value, 10),
            month: parseInt($('tm-month').value, 10),
            day: parseInt($('tm-day').value, 10)
        };
        var dim = new Date(state.birth.year, state.birth.month, 0).getDate();
        if (state.birth.day > dim) {
            alert(state.birth.month + '월은 ' + dim + '일까지 있어요. 날짜를 다시 확인해 주세요.');
            return;
        }
        finish(cfg.compute(state.birth));
    }

    function finish(idx) {
        if (!(idx >= 0 && idx < cfg.results.length)) {
            if (window.console) console.error('[TestEngine] 결과 인덱스가 범위를 벗어났습니다:', idx);
            idx = 0;
        }
        state.resultIdx = idx;
        locked = true;
        show('screen-loading');
        setTimeout(function () { locked = false; renderResult(idx); show('screen-result'); }, 1600);
    }

    // ---------- 결과 ----------
    function renderSection(sec) {
        var a = cfg.accent;
        var body = '';
        if (sec.text) body += '<p class="text-[13px] text-gray-700 leading-relaxed">' + esc(sec.text) + '</p>';
        if (sec.items) {
            body += '<ul class="space-y-1.5 text-[13px] text-gray-700 leading-relaxed list-disc pl-4">' +
                sec.items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
        }
        if (sec.pairs) {
            body += '<div class="grid grid-cols-2 gap-2">' + sec.pairs.map(function (p) {
                return '<div class="p-3 bg-' + a + '-50/60 rounded-xl border border-' + a + '-100 text-center">' +
                    '<span class="block text-[11px] font-bold text-' + a + '-700">' + esc(p[0]) + '</span>' +
                    '<span class="block text-sm font-black text-gray-800 mt-0.5">' + esc(p[1]) + '</span></div>';
            }).join('') + '</div>';
        }
        return '<div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">' +
            '<h3 class="text-sm font-bold text-gray-900 flex items-center gap-1.5"><span class="w-1.5 h-3.5 bg-' + a + '-500 rounded-full"></span>' + esc(sec.title) + '</h3>' +
            body + '</div>';
    }

    function renderResult(idx) {
        var r = cfg.results[idx];
        var a = cfg.accent;
        var who = state.birth && state.birth.name ? esc(state.birth.name) + '님의 ' : '';
        var tags = (r.tags || []).map(function (t) {
            return '<span class="bg-white border border-' + a + '-100 px-2 py-0.5 rounded-md">' + esc(t) + '</span>';
        }).join('');

        var related = (cfg.related || []).map(function (t) {
            return '<a href="' + esc(t.href) + '" class="block w-full text-center bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl text-sm border border-gray-200 hover:bg-gray-100">' + esc(t.title) + ' &rarr;</a>';
        }).join('');

        $('screen-result').innerHTML =
            '<div id="tm-capture" class="space-y-4 bg-white">' +
                '<div class="bg-gradient-to-br from-' + a + '-50 via-white to-' + a + '-50/40 p-6 rounded-2xl border border-' + a + '-100 text-center space-y-3">' +
                    '<span class="inline-block text-[11px] font-bold px-2.5 py-1 rounded-md bg-white border border-' + a + '-200 text-' + a + '-700">' + who + esc(cfg.resultLabel || '나의 결과') + '</span>' +
                    (r.img ? '<div class="w-32 h-32 mx-auto rounded-2xl overflow-hidden border border-white shadow-sm bg-white"><img src="' + esc(r.img) + '" alt="' + esc(r.name) + '" class="w-full h-full object-cover"></div>' : '') +
                    (r.badge ? '<div class="inline-block px-3 py-0.5 rounded-md text-xs font-black text-white bg-' + a + '-600">' + esc(r.badge) + '</div>' : '') +
                    '<h2 class="text-2xl font-black text-gray-900 leading-tight">' + esc(r.name) + '</h2>' +
                    '<div class="flex flex-wrap justify-center gap-1.5 text-[11px] font-bold text-' + a + '-600">' + tags + '</div>' +
                    '<p class="p-3.5 bg-white rounded-xl border border-' + a + '-50 text-left text-[13px] text-gray-700 leading-relaxed">' + esc(r.summary) + '</p>' +
                '</div>' +
                (r.sections || []).map(renderSection).join('') +
            '</div>' +
            '<div class="space-y-2.5 pt-2">' +
                '<button type="button" id="tm-share" class="w-full bg-' + a + '-600 hover:bg-' + a + '-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl text-sm shadow-md transition-all">친구에게 결과 보내고 비교하기</button>' +
                '<button type="button" id="tm-save" class="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition-all">결과 이미지 저장하기</button>' +
                related +
                '<button type="button" id="tm-restart" class="w-full bg-gray-100 text-gray-500 font-bold py-3 rounded-xl text-xs hover:bg-gray-200">다시 하기</button>' +
            '</div>';

        $('tm-share').addEventListener('click', function () { if (window.TM) TM.share(cfg.id); });
        $('tm-save').addEventListener('click', saveImage);
        $('tm-restart').addEventListener('click', function () { show('screen-start'); });

        if (window.TM) TM.result(cfg.id, idx);
    }

    function saveImage() {
        if (typeof html2canvas !== 'function') { alert('이미지 저장을 지원하지 않는 환경이에요.'); return; }
        var el = $('tm-capture');
        html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true }).then(function (canvas) {
            var link = document.createElement('a');
            link.download = 'testmoeum-' + cfg.id + '.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            track('result_save', { test_name: cfg.id });
        });
    }

    // ---------- 사주 계산 도우미 ----------
    function jdn(y, m, d) {
        return Math.floor((1461 * (y + 4800 + Math.trunc((m - 14) / 12))) / 4)
            + Math.floor((367 * (m - 2 - 12 * Math.trunc((m - 14) / 12))) / 12)
            - Math.floor((3 * Math.floor((y + 4900 + Math.trunc((m - 14) / 12)) / 100)) / 4)
            + d - 32075;
    }

    window.TestEngine = {
        init: function (config) {
            cfg = config;
            cfg.accent = cfg.accent || 'rose';
            var go = function () {
                buildScreens();
                document.querySelectorAll('[data-tm-start]').forEach(function (b) {
                    b.addEventListener('click', start);
                });
            };
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
            else go();
        },
        start: start,
        saju: {
            STEMS: ['갑목(甲木)', '을목(乙木)', '병화(丙火)', '정화(丁火)', '무토(戊土)', '기토(己土)', '경금(庚金)', '신금(辛金)', '임수(壬水)', '계수(癸水)'],
            // 태어난 날의 천간(일간) 인덱스: 0=갑 ... 9=계
            dayStem: function (y, m, d) { return (jdn(y, m, d) + 9) % 10; },
            // 태어난 날의 지지 인덱스: 0=자 ... 11=해
            dayBranch: function (y, m, d) { return (jdn(y, m, d) + 1) % 12; }
        }
    };
})();
