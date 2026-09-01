import glob, re

html_files = glob.glob('*.html') + glob.glob('love-type/*.html') + glob.glob('articles/*.html')
for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = re.sub(r'(\./img/[^"\'`]+?)\.(jpg|jpeg|png)', r'\1.webp', content, flags=re.IGNORECASE)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
