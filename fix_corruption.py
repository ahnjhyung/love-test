import os
import subprocess
import re

files_to_restore = [
    "404.html",
    "chuseok-test.html",
    "destiny-match.html",
    "fashion-style.html",
    "halloween-test.html",
    "healing-test.html",
    "saju-life.html",
    "saju-love.html",
    "love-type/Type1.html",
    "love-type/Type2.html",
    "love-type/Type3.html",
    "love-type/Type4.html",
    "love-type/Type5.html",
    "love-type/Type6.html",
    "love-type/Type7.html",
    "love-type/Type8.html",
    "love-type/index.html",
    "articles/mbti별-남자-꼬시는법-연애공략.html",
    "articles/mbti별-플러팅-신호-총정리.html",
    "articles/궁합-잘맞는-사주-특징.html",
    "articles/대운-바뀌기전-징조-5가지.html",
    "articles/도화살-홍염살-화개살-특징.html",
    "articles/사주-연애운-무료.html",
    "articles/심리테스트-종류-모음.html",
    "articles/연애-오래가는-커플-특징.html",
    "articles/연애유형-테스트-종류.html"
]

emoji_pattern = re.compile(
    "([\U00010000-\U0010ffff])" # High surrogate ranges for emojis
)

for fpath in files_to_restore:
    if not os.path.exists(fpath):
        continue
    
    # 1. get content from c97a5f0
    try:
        content_bytes = subprocess.check_output(['git', 'show', f'c97a5f0:{fpath}'])
        content = content_bytes.decode('utf-8')
    except Exception as e:
        print(f"Error restoring {fpath}: {e}")
        continue
        
    # 2. apply patches
    # remove emoji safely
    content = emoji_pattern.sub(r'', content)
    
    # fix vercel app domain
    content = content.replace("testmoeum.vercel.app", "www.testmoeum.com")
    
    # fix naver verification
    content = re.sub(r'naver-site-verification"\s+content="[^"]+"', 'naver-site-verification" content="0023618a24cf37f8b6721ce04113a539f5496457"', content)
    
    # fix google site verification
    if '3gWhqMnwPMO7KWGkTfqSDmvHsJCh0WnIbY0qDAkGM9s' not in content:
        content = re.sub(r'google-site-verification"\s+content="[^"]+"', 'google-site-verification" content="3gWhqMnwPMO7KWGkTfqSDmvHsJCh0WnIbY0qDAkGM9s"', content)

    # 3. fix internal links missing .html
    def add_html_extension(match):
        path = match.group(1)
        if path.startswith(('http', 'https', '#', 'mailto', 'tel')): return match.group(0)
        if path.endswith('.html') or path.endswith('/') or '.' in path.split('/')[-1]: return match.group(0)
        if path == "/": return match.group(0)
        return f'href="{path}.html"'
        
    content = re.sub(r'href="([^"]+)"', add_html_extension, content)
    
    # Write back
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Restored and patched: {fpath}")
