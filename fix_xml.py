import re

# Fix sitemap.xml
with open('sitemap.xml', 'r', encoding='utf-8') as f:
    content = f.read()

def add_html(m):
    url = m.group(1)
    if not url.endswith('.html') and url != 'https://www.testmoeum.com/' and url != 'https://www.testmoeum.com/love-type':
        return f'<loc>{url}.html</loc>'
    return m.group(0)

new_content = re.sub(r'<loc>(https://www.testmoeum.com/[^<]+)</loc>', add_html, content)
with open('sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(new_content)

# Fix rss.xml
with open('rss.xml', 'r', encoding='utf-8') as f:
    content = f.read()

def add_html_rss(m):
    url = m.group(1)
    if not url.endswith('.html') and not url.endswith('/'):
        return f'{url}.html'
    return m.group(0)

new_content = re.sub(r'<link>(https://www.testmoeum.com/[^<]+)</link>', lambda m: f'<link>{add_html_rss(m)}</link>', content)
new_content = re.sub(r'<guid>(https://www.testmoeum.com/[^<]+)</guid>', lambda m: f'<guid>{add_html_rss(m)}</guid>', new_content)

with open('rss.xml', 'w', encoding='utf-8') as f:
    f.write(new_content)
