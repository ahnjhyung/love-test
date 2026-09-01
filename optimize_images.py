import glob
import os
import re
from PIL import Image

image_files = glob.glob('img/*.jpg') + glob.glob('img/*.png') + glob.glob('*.jpg') + glob.glob('*.png')

# 1. Convert to webp
for img_path in image_files:
    if img_path.endswith('.webp'): continue
    
    webp_path = os.path.splitext(img_path)[0] + '.webp'
    
    try:
        with Image.open(img_path) as img:
            img.save(webp_path, 'webp', quality=85)
        print(f"Converted {img_path} to {webp_path}")
    except Exception as e:
        print(f"Failed to convert {img_path}: {e}")

# 2. Update HTML files
html_files = glob.glob('*.html') + glob.glob('love-type/*.html') + glob.glob('articles/*.html')

for html_path in html_files:
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace <img src="...">
    def replace_img_src(match):
        ext = match.group(2).lower()
        if ext in ['jpg', 'jpeg', 'png']:
            return f'src="{match.group(1)}.webp"'
        return match.group(0)
    
    content = re.sub(r'src="([^"]+)\.(jpg|jpeg|png)"', replace_img_src, content, flags=re.IGNORECASE)
    
    # Replace background-image: url(...)
    def replace_url(match):
        ext = match.group(2).lower()
        if ext in ['jpg', 'jpeg', 'png']:
            return f"url('{match.group(1)}.webp')"
        return match.group(0)
        
    content = re.sub(r"url\(['\"]?([^'\"]+)\.(jpg|jpeg|png)['\"]?\)", replace_url, content, flags=re.IGNORECASE)

    # Note: og:image often uses content="..." so the src="..." replacement above skips it safely!

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Image paths updated in HTML!")
