import re
with open('destiny-match.html', 'r', encoding='utf-8') as f:
    content = f.read()

btn_html = """
                    <button onclick="downloadResultImage()" class="w-full bg-pink-500 hover:bg-pink-600 active:scale-[0.98] text-white font-bold py-4 rounded-xl text-sm shadow-md transition-all flex items-center justify-center space-x-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        <span>결과 이미지 저장하기</span>
                    </button>"""
if 'downloadResultImage()' not in content:
    content = content.replace('<button onclick="copyShareLink()"', btn_html + '\n                    <button onclick="copyShareLink()"')

js_code = """
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
                    link.download = '궁합_결과.png';
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
if 'function downloadResultImage()' not in content:
    content = content.replace('function copyShareLink()', js_code + '\n        function copyShareLink()')

with open('destiny-match.html', 'w', encoding='utf-8') as f:
    f.write(content)
