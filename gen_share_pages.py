"""
결과별 공유 페이지(r/{test}-{n}.html) 생성기.

카카오톡·인스타 등은 링크 미리보기를 만들 때 JavaScript를 실행하지 않으므로,
결과마다 og:title / og:image가 다른 정적 페이지가 필요하다.
사람이 열면 즉시 해당 테스트로 이동하며(?from=n), 테스트 페이지에서
js/viral.js가 "친구의 결과" 배너를 보여준다.

결과 이름·이미지는 js/viral.js의 TESTS 설정을 그대로 읽어 온다.
테스트 결과를 추가·변경했다면 viral.js를 고친 뒤 이 스크립트를 다시 실행:
    python gen_share_pages.py
"""
import html, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent
SITE = 'https://www.testmoeum.com'

src = (ROOT / 'js' / 'viral.js').read_text(encoding='utf-8')
block = re.search(r'var TESTS = \{(.*?)\n    \};', src, re.S).group(1)

def str_list(text):
    return re.findall(r"'([^']*)'", text)

tests = {}
for m in re.finditer(r"'([\w-]+)': \{(.*?)\n        \}", block, re.S):
    key, body = m.group(1), m.group(2)
    tests[key] = {
        'path': re.search(r"path: '([^']+)'", body).group(1),
        'title': re.search(r"title: '([^']+)'", body).group(1),
        'noun': re.search(r"noun: '([^']+)'", body).group(1),
        'names': str_list(re.search(r'names: \[(.*?)\]', body, re.S).group(1)),
        'imgs': str_list(re.search(r'imgs: \[(.*?)\]', body, re.S).group(1)),
    }

TEMPLATE = """<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{og_title} | 테스트모음</title>
    <meta name="robots" content="noindex, follow">
    <link rel="canonical" href="{test_url}">
    <meta name="description" content="{og_desc}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="테스트모음">
    <meta property="og:url" content="{share_url}">
    <meta property="og:title" content="{og_title}">
    <meta property="og:description" content="{og_desc}">
    <meta property="og:image" content="{image}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{og_title}">
    <meta name="twitter:description" content="{og_desc}">
    <meta name="twitter:image" content="{image}">
    <meta http-equiv="refresh" content="0; url={target}">
    <script>location.replace({target_js});</script>
</head>
<body style="font-family:sans-serif; text-align:center; padding:50px;">
    <p>{og_title}</p>
    <p><a href="{target}">테스트하러 가기</a></p>
</body>
</html>
"""

out_dir = ROOT / 'r'
out_dir.mkdir(exist_ok=True)
count = 0
for key, t in tests.items():
    assert len(t['names']) == len(t['imgs']), key
    for i, name in enumerate(t['names'], start=1):
        if key == 'destiny':
            og_title = f"친구 커플의 궁합은 '{name}'! 우리 궁합은?"
            og_desc = f"{t['title']} · 두 사람 생년월일만 있으면 무료로 확인"
        else:
            og_title = f"친구는 '{name}'! 나는 어떤 {t['noun']}일까?"
            og_desc = f"{t['title']} · 회원가입 없이 무료로 3분이면 끝"
        target = f"{t['path']}?from={i}&utm_source=share&utm_medium=social&utm_campaign={key}"
        page = TEMPLATE.format(
            og_title=html.escape(og_title, quote=False),
            og_desc=html.escape(og_desc, quote=False),
            share_url=f"{SITE}/r/{key}-{i}",
            test_url=SITE + t['path'],
            image=f"{SITE}/img/{t['imgs'][i - 1]}.jpg",
            target=html.escape(target),
            target_js="'" + target + "'",
        )
        (out_dir / f'{key}-{i}.html').write_text(page, encoding='utf-8', newline='\n')
        count += 1
print(f'{count} share pages written to r/')
