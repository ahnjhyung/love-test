# 테스트모음 SEO & 콘텐츠 운영 지침서

> **대상**: 테스트모음(testmoeum.vercel.app) 플랫폼에 새 테스트·칼럼을 추가하는 모든 에이전트  
> **타깃**: 여성 10대~30대 / 모바일 퍼스트  
> **기술 스택**: 정적 HTML + Tailwind CDN + Vercel  
> **최종 수정**: 2026-08-19

---

## 1. 사이트 기본 정보 (전 페이지 공통)

| 항목 | 값 |
|---|---|
| 도메인(canonical) | `https://testmoeum.vercel.app` |
| Google Analytics | `GT-WRDDWJ26` |
| Google Search Console 인증 | `3gWhqMnwPMO7KWGkTfqSDmvHsJCh0WnIbY0qDAkGM9s` |
| AdSense pub-id | `ca-pub-8530559977181821` |
| Naver 인증 | `e4c8ca2bdf1a0623e4b7e2d826a4f25f9fcbf228` |
| Pretendard 폰트 | CDN `@import url(...)` |
| Tailwind | `https://cdn.tailwindcss.com` |
| 모바일 컨테이너 | `max-w-[480px]` 중앙 정렬 |

---

## 2. 모든 HTML 파일 `<head>` 필수 요소

새 테스트나 칼럼 HTML을 만들 때 **반드시** 아래 요소를 빠짐없이 포함할 것.

```html
<!-- 1. Google Analytics (항상 <head> 최상단) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GT-WRDDWJ26"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GT-WRDDWJ26');
</script>

<!-- 2. 기본 메타 -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="naver-site-verification" content="e4c8ca2bdf1a0623e4b7e2d826a4f25f9fcbf228" />

<!-- 3. SEO 메타 (★ 페이지마다 고유하게 작성) -->
<title>{페이지 고유 타이틀} | 테스트모음</title>
<meta name="description" content="{150자 이내 고유 설명}">
<meta name="keywords" content="{쉼표로 구분된 핵심 키워드 5~8개}">
<link rel="canonical" href="https://testmoeum.vercel.app/{경로}">

<!-- 4. Open Graph (SNS 공유용) -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://testmoeum.vercel.app/{경로}">
<meta property="og:title" content="{공유 시 노출될 제목 — 30자 이내}">
<meta property="og:description" content="{공유 시 노출될 설명 — 80자 이내}">
<meta property="og:image" content="https://testmoeum.vercel.app/img/{썸네일 파일명}">

<!-- 5. 구조화 데이터 (JSON-LD, 테스트 페이지용) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "{테스트 이름}",
  "description": "{테스트 설명}",
  "url": "https://testmoeum.vercel.app/{경로}",
  "applicationCategory": "EntertainmentApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" }
}
</script>

<!-- 5-b. 구조화 데이터 (JSON-LD, 칼럼 페이지용) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{칼럼 제목}",
  "description": "{칼럼 설명}",
  "author": { "@type": "Organization", "name": "테스트모음" },
  "publisher": { "@type": "Organization", "name": "테스트모음" },
  "datePublished": "{YYYY-MM-DD}",
  "url": "https://testmoeum.vercel.app/articles/{파일명}"
}
</script>
```

---

## 3. SEO 타이틀 & 디스크립션 작성 규칙

### 3-1. `<title>` 규칙
- 형식: `{핵심 키워드 포함 제목} | 테스트모음`
- 길이: **30~55자** (구글 검색 결과에서 잘리지 않는 길이)
- 핵심 키워드를 **앞쪽**에 배치
- 예시:
  - `연애 유형 테스트 | 20문항 무료 심리분석 - 테스트모음`
  - `사주로 보는 나의 연애운 | 테스트모음`
  - `도화살 사주 특징과 연애 완전분석 | 테스트모음`

### 3-2. `<meta description>` 규칙
- 길이: **80~150자** (구글 스니펫 표시 범위)
- 핵심 키워드 1~2개 자연스럽게 포함
- 행동 유도 문구 포함 (예: "지금 무료로 확인해보세요")
- **페이지마다 100% 고유**해야 함 (복사 금지!)

### 3-3. 절대 하지 말 것 (금지 사항)
- 같은 description을 여러 페이지에 복사 사용 금지
- 키워드 나열식 title (예: "사주,운세,궁합,무료,2026") 금지
- **이모지 일체 사용 금지**: `<title>`, `<meta>`, 본문 텍스트, 버튼, 결과창 등 사이트 내 모든 곳에 유니코드 이모지(🔮, 🌸, 📖, 🃏, ✨ 등) 사용 절대 금지 (AI 생성 티 방지 및 전문적인 텍스트/SVG 뱃지 UI 유지)
- **마크다운 기호(**) 본문 노출 금지**: HTML 텍스트나 사용자 화면에 `**` 같은 마크다운 문법 기호가 그대로 노출되지 않도록 `<strong>` 태그나 CSS 클래스로 작성할 것 (AI 생성 티 방지)

---

## 4. URL & 파일 구조 규칙

### 4-1. 디렉토리 구조

```
/                          ← 플랫폼 메인 허브
/love-type/                ← 연애유형 테스트 시작
/love-type/Type1.html      ← 결과 페이지
/saju-love.html            ← 사주 연애운 테스트
/{테스트슬러그}/            ← 새 테스트 (폴더 방식 권장)
/{테스트슬러그}/result-{n}.html  ← 결과 페이지들
/articles/{슬러그}.html    ← SEO 칼럼
/img/                      ← 이미지 에셋
```

### 4-2. URL 슬러그 규칙
- 한글 슬러그 OK (구글 한국어 검색에 유리)
- 단어 구분: 하이픈(`-`) 사용
- 소문자 통일
- 예시: `articles/사주-연애운-무료.html`, `mbti-성격-테스트/`

### 4-3. 새 페이지 추가 시 반드시 할 일
1. `sitemap.xml`에 URL 추가 (한글은 퍼센트 인코딩)
2. `index.html` 메인 허브에 카드 추가
3. `lastmod` 날짜를 오늘 날짜로 갱신

---

## 5. 이미지 최적화 규칙

| 항목 | 기준 |
|---|---|
| 포맷 | JPEG (사진/일러스트), PNG (투명 필요 시) |
| 카드 썸네일 크기 | 640px 너비, 3:2 비율 |
| 파일 크기 | **최대 80KB** (모바일 3G에서도 즉시 로딩) |
| 파일명 | `thumb-{테스트슬러그}.jpg` |
| alt 텍스트 | 반드시 작성 (핵심 키워드 포함, 자연스러운 한국어) |
| 로딩 | 메인 첫 이미지: `loading="eager"`, 나머지: `loading="lazy"` |
| 저장 경로 | `/img/` 폴더 |
| 그림체 통일 | 몽환적 파스텔 마법 오브젝트 타로카드 감성 일러스트 |

### 이미지 압축 스크립트 (PowerShell)
```powershell
Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Image]::FromFile("원본.jpg")
$newW = 640; $newH = [int]($src.Height * ($newW / $src.Width))
$dest = New-Object System.Drawing.Bitmap($newW, $newH)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.InterpolationMode = "HighQualityBicubic"
$g.DrawImage($src, 0, 0, $newW, $newH)
$src.Dispose(); $g.Dispose()
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatDescription -eq "JPEG" }
$p = New-Object System.Drawing.Imaging.EncoderParameters(1)
$p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 82)
$dest.Save("img\thumb-{슬러그}.jpg", $enc, $p)
$dest.Dispose()
```

---

## 6. 새 테스트 페이지 템플릿

### 6-1. HTML 구조 (모바일 앱 뷰)

```html
<body class="min-h-screen flex justify-center">
  <div class="w-full max-w-[480px] bg-white min-h-screen flex flex-col shadow-sm relative pb-8">

    <!-- 헤더: 뒤로가기 + 카테고리 뱃지 -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <a href="/" class="text-sm font-semibold text-gray-500 flex items-center space-x-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        <span>테스트모음</span>
      </a>
      <span class="text-xs font-bold text-{테마색}-600 bg-{테마색}-50 px-2.5 py-1 rounded-full">{카테고리}</span>
    </header>

    <!-- 메인 콘텐츠 -->
    <main class="flex-1 px-5 py-4">
      <!-- 시작 화면: 썸네일 → 제목 → 설명 → 버튼 (공백 없이 컴팩트) -->
      <div id="start-screen" class="space-y-4 text-center">
        <div class="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xs border">
          <img src="../img/thumb-{슬러그}.jpg" alt="{테스트명}" class="w-full h-full object-cover">
        </div>
        <div class="pt-1 space-y-1.5">
          <span class="badge-tag">{카테고리 뱃지}</span>
          <h1 class="text-2xl font-black text-gray-900 leading-tight">{테스트 제목}</h1>
          <p class="text-xs text-gray-500">{테스트 설명}</p>
        </div>
        <div class="pt-2 space-y-2.5">
          <!-- 입력 필드 (필요시) -->
          <button class="w-full py-4 bg-{테마색}-500 active:scale-[0.98] text-white rounded-xl font-bold text-base shadow-md">
            시작하기
          </button>
          <p class="text-[11px] text-gray-400">무료 · 약 N분 소요</p>
        </div>
      </div>
    </main>

    <footer class="mt-auto border-t border-gray-100 bg-white px-4 py-4 text-center text-xs text-gray-400">
      <p>© 2026 테스트모음. All rights reserved.</p>
    </footer>
  </div>
</body>
```

### 6-2. 테마 색상 팔레트

| 카테고리 | 메인 색 | Tailwind 클래스 |
|---|---|---|
| 연애·궁합 | 로즈 핑크 | `rose-500`, `rose-50` |
| 사주·운세 | 인디고 보라 | `indigo-600`, `indigo-50` |
| 성격·심리 | 틸 그린 | `teal-600`, `teal-50` |
| 재미 | 앰버 옐로 | `amber-500`, `amber-50` |

---

## 7. 메인 허브(index.html) 카드 추가 규칙

새 테스트를 만들면 메인 `index.html`의 `#test-grid`에 카드를 추가해야 함.

```html
<div class="poomang-card test-item cursor-pointer" data-category="{love|saju|mbti|fun}" onclick="location.href='./{경로}'">
  <div>
    <div class="thumb-wrap" style="padding-top: 75%;">
      <img src="./img/thumb-{슬러그}.jpg" alt="{테스트명}" loading="lazy">
      <div class="absolute top-2 left-2">
        <span class="badge-tag bg-{색상} text-white text-[10px]">{NEW|HOT|추천}</span>
      </div>
    </div>
    <div class="p-3 space-y-1">
      <span class="badge-tag bg-{색상}-50 text-{색상}-600 text-[10px]">{카테고리}</span>
      <h4 class="font-bold text-sm text-gray-900 leading-snug line-clamp-1">{테스트 제목}</h4>
      <p class="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{20자 내외 한줄 설명}</p>
    </div>
  </div>
</div>
```

- `data-category` 값: `love`, `saju`, `mbti`, `fun`, `article` 중 택 1
- 카드 순서: 최신 또는 인기 테스트를 상단에 배치

---

## 8. sitemap.xml 관리 규칙

### 새 URL 추가 형식
```xml
<url>
  <loc>https://testmoeum.vercel.app/{정확한 경로}</loc>
  <lastmod>{YYYY-MM-DD}</lastmod>
  <priority>{0.3~1.0}</priority>
</url>
```

### Priority 기준
| 페이지 유형 | priority |
|---|---|
| 메인 허브 `/` | 1.0 |
| 테스트 시작 페이지 | 0.9 |
| 칼럼 | 0.7 |
| 테스트 결과 페이지 | 0.6 |
| 블로그, 약관 등 | 0.3~0.5 |

### 한글 URL 처리
- sitemap.xml 내에서는 반드시 **퍼센트 인코딩** 사용
- 예: `사주-연애운-무료.html` → `%EC%82%AC%EC%A3%BC-%EC%97%B0%EC%95%A0%EC%9A%B4-%EB%AC%B4%EB%A3%8C.html`

---

## 9. 보안 필수 체크리스트

모든 테스트 페이지에 반드시 적용:

- [ ] API 키가 코드에 포함되어 있지 않은가?
- [ ] 사용자 입력을 표시할 때 `textContent`만 사용했는가? (`innerHTML` 절대 금지)
- [ ] 생년월일 등 개인정보 입력 시 비저장 안내 문구가 있는가?
  ```
  입력하신 정보는 서버에 저장되지 않으며, 브라우저에서만 계산 후 즉시 삭제됩니다.
  ```
- [ ] 쿠팡 파트너스 수수료 고지 문구가 있는가?
  ```
  이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
  ```

---

## 10. 애드센스 승인 & 배치 가이드

### 10-1. 승인 전 조건
- 텍스트 콘텐츠가 풍부한 페이지 최소 **10개 이상**
- 각 페이지 본문 **500자 이상** (코드 제외 순수 텍스트)
- 개인정보처리방침(`/privacy.html`) & 이용약관(`/terms.html`) 페이지 필수
- 빈 광고 슬롯 박스를 미리 배치하지 말 것 (빈 흰색 사각형 절대 금지)
- 자동 생성 콘텐츠처럼 보이지 않도록 자연스러운 문체 사용

### 10-2. 승인 후 광고 배치 원칙
- 테스트 진행 화면: 질문 하단에 인피드 1개
- 결과 페이지: 궁합 섹션과 쿠팡 사이에 1개
- 칼럼: 본문 중간(첫 섹션 직후)에 1개
- 메인 허브: 테스트 그리드와 칼럼 섹션 사이에 1개
- **절대 하지 말 것**: 팝업 광고, 콘텐츠를 가리는 광고, 빈 광고 박스

---

## 11. 쿠팡 파트너스 배치 규칙

### 현재 사용 중인 링크
| 상품 | 링크 |
|---|---|
| 커플 백문백답 | `https://link.coupang.com/a/ddJLjO` |
| 커플 대화카드 | `https://link.coupang.com/a/ddJLnf` |

### 배치 위치
- 테스트 결과 페이지의 **궁합 분석 하단** (가장 자연스러운 위치)
- 칼럼 하단 "관련 추천 상품" 영역
- **광고 느낌을 줄이고** "연인과 함께하기 좋은 아이템" 등 자연스러운 큐레이션으로 연결

---

## 12. 배포 & 커밋 규칙

### Git 커밋 메시지 형식
```
feat: 새 {테스트명} 테스트 추가
fix: {무엇을} 수정
style: {UI 변경 내용}
chore: {유지보수 내용}
content: {칼럼명} SEO 칼럼 추가
```

### 배포 플로우
1. 파일 작성/수정
2. `git add -A; git commit -m "{메시지}"; git push origin main`
3. Vercel 자동 배포 (1~2분 소요)
4. 배포 후 Google Search Console에서 URL 검사 → 색인 요청

---

## 13. Google Search Console 활용법

### 등록 직후 할 일
1. 속성 추가: `https://testmoeum.vercel.app`
2. sitemap 제출: `https://testmoeum.vercel.app/sitemap.xml`
3. 주요 페이지 URL 검사 → "색인 생성 요청" 클릭

### 새 페이지 추가할 때마다
1. sitemap.xml 업데이트 & push
2. Search Console → URL 검사 → 새 URL 입력 → "색인 생성 요청"

### 정기 점검 (주 1회)
- "페이지" 보고서에서 색인 오류 확인
- "실적" 보고서에서 검색어·클릭수·CTR 확인
- CTR 낮은 페이지 → title/description 개선

---

## 14. 핵심 SEO 키워드 타깃 목록

### Tier 1 (메인 공략 — 테스트 페이지)
| 키워드 | 예상 월 검색량 | 담당 페이지 |
|---|---|---|
| 연애유형테스트 | 45,000 | `/love-type/` |
| 심리테스트 모음 | 33,000 | `/` (메인) |
| 사주 연애운 무료 | 28,000 | `/saju-love.html` |
| MBTI 연애 궁합 | 22,000 | `/love-type/` |
| 무료 사주 궁합 테스트 | 18,000 | `/saju-love.html` |

### Tier 2 (칼럼 공략 — 롱테일)
| 키워드 | 예상 월 검색량 | 담당 페이지 |
|---|---|---|
| 도화살 사주 특징 | 12,000 | 칼럼 |
| 회피형 애착유형 | 9,500 | 칼럼 |
| 사주 연애운 보는법 | 8,000 | 칼럼 |
| 심리테스트 종류 | 7,500 | 칼럼 |
| 연애유형 종류 | 6,000 | 칼럼 |

### Tier 3 (향후 테스트 확장 시)
| 키워드 | 예상 월 검색량 |
|---|---|
| 오늘의 운세 무료 | 60,000+ |
| MBTI 성격 테스트 무료 | 40,000+ |
| 커플 궁합 테스트 | 25,000 |
| 나의 TMI 테스트 | 15,000 |

---

## 15. 체크리스트: 새 테스트 추가 시

새 테스트를 만들 때 이 체크리스트를 순서대로 진행:

- [ ] 1. 테스트 HTML 파일 생성 (섹션 6 템플릿 참조)
- [ ] 2. `<head>` 필수 메타태그 전부 포함 (섹션 2)
- [ ] 3. JSON-LD 구조화 데이터 삽입
- [ ] 4. 썸네일 이미지 생성 → 640px/80KB 이하로 압축 → `/img/` 저장
- [ ] 5. `index.html` 메인 허브에 카드 추가 (섹션 7)
- [ ] 6. `sitemap.xml`에 URL 추가 (섹션 8)
- [ ] 7. 보안 체크리스트 점검 (섹션 9)
- [ ] 8. `git commit & push`
- [ ] 9. Google Search Console에서 색인 요청
