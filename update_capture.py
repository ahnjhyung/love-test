import glob
import re

html_files = glob.glob('*.html') + glob.glob('love-type/*.html')

new_func = """
        function downloadResultImage() {
            const captureEl = document.getElementById('capture-area');
            if (!captureEl) return;
            
            const originalMinHeight = captureEl.style.minHeight;
            const originalDisplay = captureEl.style.display;
            const originalFlexDir = captureEl.style.flexDirection;
            const originalJustify = captureEl.style.justifyContent;
            
            const targetHeight = captureEl.offsetWidth * (16 / 9);
            captureEl.style.minHeight = targetHeight + 'px';
            captureEl.style.display = 'flex';
            captureEl.style.flexDirection = 'column';
            captureEl.style.justifyContent = 'center';
            
            setTimeout(() => {
                html2canvas(captureEl, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: window.getComputedStyle(captureEl).backgroundColor || '#ffffff'
                }).then(canvas => {
                    captureEl.style.minHeight = originalMinHeight;
                    captureEl.style.display = originalDisplay;
                    captureEl.style.flexDirection = originalFlexDir;
                    captureEl.style.justifyContent = originalJustify;
                    
                    const link = document.createElement('a');
                    link.download = '결과_이미지.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                }).catch(err => {
                    captureEl.style.minHeight = originalMinHeight;
                    captureEl.style.display = originalDisplay;
                    captureEl.style.flexDirection = originalFlexDir;
                    captureEl.style.justifyContent = originalJustify;
                });
            }, 50);
        }
"""

for fpath in html_files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Change button text back to '결과 이미지 저장하기'
    content = re.sub(r'>인스타 스토리용 이미지 저장</span', '>결과 이미지 저장하기</span', content)
    
    # Replace function downloadResultImage() {...} completely.
    # We use regex to match from "function downloadResultImage() {" to the matching closing bracket.
    # Since regex for nested brackets is tricky, we can match until "function shareResult()" or "function restartTest()"
    # or just use a simple regex up to the next "function "
    
    if 'function downloadResultImage()' in content:
        content = re.sub(
            r'function downloadResultImage\(\)\s*\{[\s\S]*?(?=function\s+(?:restartTest|shareResult|showScreen|getStoredComments)\s*\()',
            new_func.strip() + '\n\n        ',
            content
        )

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Updated capture to 9:16 and restored button text!")
