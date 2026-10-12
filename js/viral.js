/*
 * 테스트모음 공유/바이럴 헬퍼
 * - TM.start(test): 테스트 시작 이벤트
 * - TM.result(test, idx): 결과 확정 (GA4 test_complete + 공유 대상 기억)
 * - TM.share(): 결과별 공유 페이지(/r/{test}-{n}) 링크를 공유
 * - ?from=n 으로 들어오면 시작 화면 위에 "친구의 결과" 배너를 보여줌
 */
(function () {
    var SITE = 'https://www.testmoeum.com';

    var TESTS = {
        'love': {
            path: '/love-type', title: '나의 연애유형 테스트', noun: '연애 캐릭터',
            names: ['냉철한 현실 분석가 냥이', '낭만 가득 사랑꾼 곰돌이', '다정다감 평화주의 토끼', '열정 불꽃 직진 댕댕이',
                    '쿨한 마이웨이 펭귄', '유쾌한 티키타카 햄찌', '든든한 수호천사 사슴', '포근한 감성 예술 여우'],
            imgs: ['love-type1', 'love-type2', 'love-type3', 'love-type4', 'love-type5', 'love-type6', 'love-type7', 'love-type8']
        },
        'healing': {
            path: '/healing-test', title: '나의 힐링 성격 유형 테스트', noun: '힐링 캐릭터',
            names: ['포근한 집콕 테라피 나무늘보', '따뜻한 감성 찻집 냥이', '햇살 산책 탐험가 댕댕이', '열정 몰입 에너지 다람쥐'],
            imgs: ['healing-type1', 'healing-type2', 'healing-type3', 'healing-type4']
        },
        'chuseok': {
            path: '/chuseok-test', title: '한가위 디저트 테스트', noun: '한가위 디저트 캐릭터',
            names: ['달콤 쫀득 꿀송편', '겉바속촉 찹쌀 개성주악', '바삭 고소 알밤 약과', '시원 달콤 살얼음 식혜',
                    '든든하고 고소한 모둠전', '정갈하고 부드러운 잣설기', '달달 쫄깃 호두 곶감말이', '향긋하고 알싸한 계피 수정과'],
            imgs: ['dessert-songpyeon', 'dessert-juak', 'dessert-yakgwa', 'dessert-sikhye',
                   'dessert-jeon', 'dessert-baekseolgi', 'dessert-persimmon', 'dessert-sujeonggwa']
        },
        'fashion': {
            path: '/fashion-style', title: '퍼스널 스타일링 테스트', noun: '스타일 무드',
            names: ['내추럴 꾸안꾸 놈코어룩', '로맨틱 페미닌 러블리룩', '시크 모던 올드머니룩', '힙 스트릿 트렌디룩',
                    '포근한 빈티지 코티지룩', '세련된 스마트 포멀 오피스룩', '액티브 스포티 에슬레저룩', '유니크 아티스틱 무드룩'],
            imgs: ['look-natural', 'look-feminine', 'look-classic', 'look-street',
                   'look-feminine', 'look-classic', 'look-street', 'look-natural']
        },
        'halloween': {
            path: '/halloween-test', title: '할로윈 캐릭터 성격 테스트', noun: '할로윈 몬스터',
            names: ['달콤한 꼬마 마녀', '시크한 뱀파이어 귀족', '몽글몽글 유령 친구', '유쾌한 잭오랜턴',
                    '든든한 늑대인간 수호자', '도도한 검은 고양이', '솔직 순수 프랑켄슈타인', '붕대 감은 집콕 미라'],
            imgs: ['monster-witch', 'monster-vampire', 'monster-ghost', 'monster-pumpkin',
                   'monster-werewolf', 'monster-cat', 'monster-franken', 'monster-mummy']
        },
        'saju-love': {
            path: '/saju-love', title: '사주 연애운 테스트', noun: '사주 연애 캐릭터',
            names: ['대나무 지킴이', '꽃비 요정', '태양 에너자이저', '촛불 감성러', '든든한 산지킴이',
                    '포근한 들판', '날카로운 결단파', '세련된 보석', '거침없는 파도', '고요한 샘물'],
            imgs: ['element-wood', 'element-wood', 'element-fire', 'element-fire', 'element-earth',
                   'element-earth', 'element-metal', 'element-metal', 'element-water', 'element-water']
        },
        'saju-life': {
            path: '/saju-life', title: '종합 사주팔자 인생 운세', noun: '사주 기질 유형',
            names: ['푸른 거목 리더형', '들꽃 생명력 전략가형', '태양 스포트라이트형', '등불 지혜 멘토형', '황금 대지 수호형',
                    '풍요로운 들판 기획자형', '강철의 결단 승부사형', '다이아몬드 아티스트형', '대양의 지혜 전략가형', '새벽 이슬 힐러형'],
            imgs: ['element-wood', 'element-wood', 'element-fire', 'element-fire', 'element-earth',
                   'element-earth', 'element-metal', 'element-metal', 'element-water', 'element-water']
        },
        'newyear': {
            path: '/newyear-2027', title: '2027 정미년 신년운세', noun: '2027년 운세',
            names: ['재능을 꽃피우는 갑목', '즐거움이 열매 맺는 을목', '라이벌과 함께 크는 병화', '내 편이 늘어나는 정화', '배움이 쌓이는 무토',
                    '영감이 깨어나는 기토', '인정받고 자리 잡는 경금', '압박을 넘어 단단해지는 신금', '성실함이 재물이 되는 임수', '기회를 낚아채는 계수'],
            imgs: ['element-wood', 'element-wood', 'element-fire', 'element-fire', 'element-earth',
                   'element-earth', 'element-metal', 'element-metal', 'element-water', 'element-water']
        },
        'destiny': {
            path: '/destiny-match', title: '운명의 붉은 실 궁합 테스트', noun: '궁합',
            names: ['우주가 맺어준 천생연분 찰떡궁합', '서로에게 힘이 되어주는 든든한 동반자', '짜릿한 불꽃과 자극을 주는 열정 궁합'],
            imgs: ['thumb-destiny', 'thumb-destiny', 'thumb-destiny']
        }
    };

    var current = null;

    function track(name, params) {
        try { if (typeof gtag === 'function') gtag('event', name, params || {}); } catch (e) {}
    }

    // 마지막 글자 받침 여부로 '이/가' 선택
    function josaIGa(word) {
        var code = word.charCodeAt(word.length - 1) - 0xAC00;
        if (code < 0 || code > 11171) return '이';
        return code % 28 ? '이' : '가';
    }

    function shareUrl(test, idx) {
        return SITE + '/r/' + test + '-' + (idx + 1);
    }

    function shareText(test, idx) {
        var t = TESTS[test];
        var name = t.names[idx];
        if (test === 'destiny') return '우리 궁합은 [' + name + ']! 너희도 궁합 확인해 봐';
        return '나는 [' + name + '] 나왔어! 너는 어떤 ' + t.noun + '일지 해 봐';
    }

    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        return Promise.resolve();
    }

    var TM = {
        start: function (test) {
            track('test_start', { test_name: test });
        },
        result: function (test, idx) {
            if (!TESTS[test] || idx < 0 || idx >= TESTS[test].names.length) return;
            current = { test: test, idx: idx };
            track('test_complete', { test_name: test, result_index: idx + 1, result_name: TESTS[test].names[idx] });
        },
        share: function (fallbackTest) {
            var test = current ? current.test : fallbackTest;
            var url, text;
            if (!test || !TESTS[test]) {
                // viral.js에 등록되지 않은 테스트: 현재 페이지 주소를 그대로 공유
                url = location.origin + location.pathname;
                text = document.title + ' 해 봐!';
                if (navigator.share) navigator.share({ title: document.title, text: text, url: url }).catch(function () {});
                else copyText(text + '\n' + url).then(function () { alert('링크가 복사되었어요! 친구에게 붙여넣어 보내보세요.'); });
                return;
            }
            if (current) {
                url = shareUrl(current.test, current.idx);
                text = shareText(current.test, current.idx);
            } else {
                url = SITE + TESTS[test].path;
                text = TESTS[test].title + ' 해 봐!';
            }
            if (navigator.share) {
                navigator.share({ title: TESTS[test].title, text: text, url: url })
                    .then(function () { track('share', { method: 'web_share', content_type: test, item_id: url }); })
                    .catch(function () {});
            } else {
                copyText(text + '\n' + url).then(function () {
                    track('share', { method: 'copy_link', content_type: test, item_id: url });
                    alert('공유 문구와 링크가 복사되었어요!\n카카오톡이나 인스타그램 DM에 붙여넣어 친구에게 보내보세요.');
                });
            }
        }
    };
    window.TM = TM;

    // 공유 링크(?from=n)로 들어온 친구에게 "친구의 결과" 배너 표시
    function showFriendBanner() {
        var params = new URLSearchParams(location.search);
        var from = parseInt(params.get('from'), 10);
        if (!from) return;
        var test = null;
        for (var key in TESTS) {
            var p = TESTS[key].path;
            if (location.pathname === p || location.pathname === p + '/' || location.pathname === p + '.html' || location.pathname === p + '/index.html') { test = key; break; }
        }
        if (!test) return;
        var t = TESTS[test];
        var idx = from - 1;
        if (idx < 0 || idx >= t.names.length) return;
        var screen = document.getElementById('screen-start') || document.getElementById('start-screen');
        if (!screen) return;

        var headline = test === 'destiny'
            ? '친구 커플은 <strong class="text-rose-600">' + t.names[idx] + '</strong>' + josaIGa(t.names[idx]) + ' 나왔어요'
            : '친구는 <strong class="text-rose-600">' + t.names[idx] + '</strong> 나왔어요';
        var sub = test === 'destiny' ? '우리 둘의 궁합은 몇 점일까요?' : '나는 어떤 ' + t.noun + '일까요?';

        var box = document.createElement('div');
        box.className = 'flex items-center gap-3 p-3 mb-1 rounded-2xl border border-rose-100 bg-rose-50/70 text-left';
        box.innerHTML =
            '<img src="/img/' + t.imgs[idx] + '.webp" alt="" class="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-white">' +
            '<div class="min-w-0">' +
                '<p class="text-[11px] font-bold text-rose-500">친구가 보낸 결과</p>' +
                '<p class="text-sm text-gray-800 leading-snug">' + headline + '</p>' +
                '<p class="text-xs text-gray-500 mt-0.5">' + sub + ' 아래에서 바로 시작해 보세요!</p>' +
            '</div>';
        screen.insertBefore(box, screen.firstChild);
        track('friend_landing', { test_name: test, result_index: from });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showFriendBanner);
    } else {
        showFriendBanner();
    }
})();
