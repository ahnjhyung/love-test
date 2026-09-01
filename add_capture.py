import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add html2canvas if not present
    if 'html2canvas' not in content:
        content = content.replace('</head>', '    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>\n</head>')

    # 2. Add id="capture-area" to the first bg-gradient card inside result-screen
    # saju-love and saju-life have similar structure
    if 'id="capture-area"' not in content:
        content = content.replace(
            '<div class="bg-gradient-to-br', 
            '<div id="capture-area" class="bg-gradient-to-br', 
            1
        )

    # 3. Add the image save button before the shareResult button
    btn_html = """
                    <button onclick="downloadResultImage()" class="w-full bg-pink-500 hover:bg-pink-600 active:scale-[0.98] text-white font-bold py-4 rounded-xl text-sm shadow-md transition-all flex items-center justify-center space-x-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        <span>결과 이미지 저장하기</span>
                    </button>"""
    if 'downloadResultImage()' not in content:
        content = content.replace('<button onclick="shareResult()"', btn_html + '\n                    <button onclick="shareResult()"')

    # 4. Add the JS function
    js_code = """
        function downloadResultImage() {
            const captureEl = document.getElementById('capture-area');
            if (!captureEl) return;

            alert('결과 카드 이미지를 저장합니다. 잠시만 기다려주세요!');

            html2canvas(captureEl, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = '사주_결과.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).catch(err => {
                alert('이미지 저장 중 오류가 발생했습니다. 화면을 캡처해서 사용해주세요!');
            });
        }
        """
    if 'function downloadResultImage()' not in content:
        content = content.replace('function shareResult()', js_code + '\n        function shareResult()')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Processed {filepath}")

process_file('saju-love.html')
process_file('saju-life.html')
