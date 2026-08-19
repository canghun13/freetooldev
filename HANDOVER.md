# FreeToolDev — 프로젝트 인수인계 문서

마지막 업데이트: 2026-08-19 (**신규 제작 세션** — 사용자가 "폭넓게 키워드 뽑고 경쟁 강도 체크, GSC 안에서만 보지 말 것, 새 클러스터 추가 환영" 지시. 기존 26개 툴과 겹치지 않는 영역 5개 검토 → **4개 정직 기각, 1개 채택**. 신규 툴 `tools/frontmatter-checker.html`(27번째) + 페어링 블로그 `blog/markdown-front-matter-mistakes.html`. **채택 근거는 "경쟁이 전부 설치형(CLI/npm/VS Code확장/빌드타임)이고 웹에서 여러 포스트를 서로 비교하는 도구가 없다"** — 이번에 3차 필터로 새로 확립. 기존 결함 1건도 같이 수정(4개 파일 푸터에 barcode-batch 누락). 전체 83파일 = sitemap 83 = llms.txt 83, 푸터 83/83 정합.)

[이전] 2026-08-04 (분석 전용 세션 — 사용자가 GSC/GA 스냅샷 업로드. **이 세션에서 사이트 HTML 파일은 하나도 수정하지 않음.** Opus가 데이터 분석 + 중복체크 + 웹검색 경쟁강도 확인까지만 하고, 실제 콘텐츠 작업은 Sonnet에게 프롬프트로 넘김. 무결성 재검증 통과: 전체 80파일 = sitemap `<url>` 80개, 끊긴 내부링크 0건, 고아 페이지 0건, tools/index 카드 26개 = tools 파일 26개, blog/index 링크 48개 = blog 글 48개. **신규 확정 방침: AdSense에 의존하지 않음 — 9번 참고.**)

---

## 1. 프로젝트 개요

- **사이트명**: FreeToolDev
- **도메인**: https://freetooldev.com
- **컨셉**: 개발자/디자이너 대상 무료 "배치/벌크" 유틸리티 툴 모음. 대부분의 무료 툴이 파일 1개씩만 처리하는 데 반해, 이 사이트는 처음부터 "여러 개를 한 번에" 처리하는 걸 차별점으로 잡음.
- **핵심 포지셔닝**: No-upload / 브라우저에서만 처리 (프라이버시), 계정 불필요, 완전 무료
- **수익 모델**: **AdSense 비의존 원칙(2026-08-04 확정)**. 수익화 가능한 제휴/광고면 종류 안 가리고 전부 검토·적용. 상세 정책은 9번 참고.
- **타겟**: 글로벌(영어), 개발자/디자이너

---

## 2. 인프라

| 항목 | 내용 |
|---|---|
| 호스팅 | GitHub Pages |
| GitHub repo | `canghun13/freetooldev` (main 브랜치) |
| DNS/CDN | Cloudflare (DNS only 모드, 프록시 안 켬) |
| HTTPS | GitHub Pages Enforce HTTPS 켜짐 |
| Analytics | GA4, 측정 ID `G-6PV8P7CQ31` |
| Search Console | 도메인 속성으로 인증 완료, sitemap 제출은 사용자가 직접 관리. 성과 데이터(zip)는 사용자가 그때그때 채팅에 업로드 |
| 서버리스 백엔드 | Cloudflare Worker (`freetooldev-crawler.canghun13.workers.dev`) — 6번 참고 |

### GitHub 작업 방식 (중요)
- 사용자가 **그날그날 GitHub Fine-grained PAT(read/write, 이 repo 한정)를 발급**해서 채팅에 붙여넣어줌
- Claude는 토큰으로 `git clone`(또는 기존 clone에 `git remote set-url`) → 수정 → `commit` → `push`까지 직접 처리
- 작업 완료 후 사용자가 토큰을 **revoke**함 — Claude는 토큰을 별도로 저장하거나 재사용하지 않음
- git identity가 컨테이너에 기본 설정 안 되어 있으므로 최초 커밋 전에 `git config user.name/user.email` 필요
- 세션 사이에 원격에 새 커밋(사용자가 GitHub 웹에서 직접 수정한 것 등)이 있을 수 있으므로, push 전 항상 `git fetch origin main` → `git rebase origin/main` 후 push. **강제 push 금지.**
- **이 방식 도입 이후로는 zip 파일을 만들어서 드릴 필요 없음.** (혹시 토큰 없이 진행하는 세션이면 예전 zip 방식으로 돌아가면 됨)

---

## 3. 사이트 구조 (전체 파일, 2026-08-04 재검증 기준 80개)

```
/
├── index.html                  홈
├── about.html
├── privacy.html
├── contact.html
├── HANDOVER.md                 이 문서
├── README.md                   GitHub 프로필용 gitanimals 위젯 (프로젝트와 무관, 사용자가 추가함)
├── CNAME, robots.txt, sitemap.xml, llms.txt
├── favicon.ico
├── assets/
│   ├── css/style.css           디자인 시스템 전부 여기
│   ├── js/nav-behavior.js      헤더/푸터는 정적 HTML, 이 JS는 모바일메뉴/연도/활성링크만 처리
│   └── img/                    favicon.svg, apple-touch-icon.png, og-image.png(신규) 등
├── tools/                      25개, index.html은 검색/필터 포함 목록. 필터 카테고리 6개: All/Image/Data/Encoding/SEO·Content/Text/Network
└── blog/                       47개, index.html은 목록
```
**카운트 정합성 검증 완료(2026-07-25)**: tools/index.html 그리드 카드 수=25=homepage 그리드, blog/index.html 카드 수=47=blog/ 파일 수, sitemap.xml `<url>` 개수=78=전체 html 파일 수, llms.txt 항목 수(툴 25개/블로그 48개=47+index)도 전부 일치. 내부링크 스캔 끊긴 링크 0건, 고아 페이지 0건, 전체 `<script>` 블록 node --check 통과.
**이번 세션에 잡아서 고친 실수**: (1) `blog/api-schema-drift-explained.html` 생성 시 create_file 파라미터 실수로 파일이 head 태그 중간에서 잘림 — 즉시 발견, 삭제 후 재작성. (2) 신규 툴 3개를 순차적으로 만들다 보니 먼저 만든 파일들의 footer가 나중에 만든 툴들을 못 담고 있었음(6개 파일) — 스크립트로 전체 footer를 정확히 스코프해서 검사하는 방식으로 발견·수정(단순 문자열 포함 여부 체크는 그리드 카드의 href를 footer로 오판할 수 있어 부정확함을 재확인 — 11번 17항 원칙 재적용). (3) 블로그 6개 중 2개(api-schema-drift-explained, check-og-tags-localhost-staging)가 자기 컴패니언 툴 페이지에서 링크를 못 받아 고아 상태였음 — 툴 페이지 프로즈에 문장 추가해서 해결.
**카운트 정합성 검증 완료(2026-07-20 2차)**: tools/index.html 그리드 카드 수=22=footer 링크 기준 tools/ 파일 수=homepage 그리드, blog/index.html 카드 수=41=blog/ 파일 수, sitemap.xml `<url>` 개수=69=전체 html 파일 수, llms.txt 항목 수(툴 22개/블로그 42개=41+index)도 전부 일치. python 스크립트로 전 파일 내부링크 스캔해서 끊긴 링크 0건, 고아 페이지 0건 확인, 신규/수정된 모든 `<script>` 블록 node --check 통과. **이번 세션에 실제로 잡아서 고친 버그 2건**: (1) 신규 diff 결과박스가 다크섹션(`#081729`) 배경인데 밝은섹션용 텍스트색을 그대로 써서 명암비 미달이 될 뻔함 — 직접 명암비 계산해서 WCAG AA 통과하는 색상(7.79:1~15.1:1)으로 교체(11번 20항 원칙 재적용 사례). (2) 블로그 글 1개의 meta description에 이스케이프 안 된 큰따옴표가 들어가 HTML 속성이 깨질 뻔함 — 발견 즉시 수정. (3) footer 일괄치환 스크립트가 tools/index.html을 "이미 반영됨"으로 오판(그리드 카드 href와 footer href를 구분 못 함)해서 건너뛴 걸 뒤늦게 발견해 직접 수정 — 11번 17항에서 이미 경고했던 유형의 실수가 반복됨, 앞으로 footer 검증은 `<div class="footer-grid">...</div>` 블록 내부만 정확히 스코프해서 확인할 것.

**중요 — 헤더/푸터 구조**: `include.js`는 삭제됨, 전부 **정적 HTML로 하드코딩**. 새 페이지/툴/블로그 추가할 때마다 헤더/푸터를 모든 페이지에 반복 삽입 필요. footer의 "Tools" 링크 목록도 전체 페이지에 일괄 반영 필요 (python find-replace 스크립트로 처리, 누락 없는지 `grep -L`로 재확인). `nav-behavior.js`는 모바일 메뉴 토글, 연도, 활성 링크 하이라이트만 담당.

**⚠️ Footer 배지 관련 매우 중요한 규칙**:
- footer 우측 하단에 **twelve.tools, Findly.tools, Fazier, Smol Launch** 배지 4개가 사용자 본인이 직접 삽입한 상태로 이미 들어가 있음 (index.html에만 있음, 다른 페이지엔 없어도 정상 — 홈페이지 한 곳만 요구하는 디렉토리가 대부분이라 버그 아님)
- **이 배지들은 사용자가 직접 넣고 직접 관리한다.** Claude는 앞으로 footer를 수정/편집할 일이 있어도 이 배지들을 **추가하지도, "이상해 보인다"는 이유로 제거하지도 말 것.** 절대 원칙.

---

## 4. 디자인 시스템

- **컨셉**: 엔지니어링 블루프린트(청사진). "배치 처리"라는 주제를 도면/제도 언어로 표현
- **색상**: 네이비(`#0E2340` 배경) + 앰버(`#E8A33D` 강조) + 크림(`#EDEBE2`, 밝은 섹션용)
- **폰트**: 헤딩 = JetBrains Mono, 본문 = Inter (Google Fonts CDN)
- **로고**: "배치 큐" 막대 3개 모티프 (증가하는 바 차트 형태), navy 배경 + amber 막대
  - `assets/img/favicon.svg`, `favicon.ico`, `apple-touch-icon.png` 등 사이트에 반영됨
  - 디렉토리 등록용 로고 PNG 4종(정사각형/가로형, 투명/흰배경)은 사이트 파일엔 없고 대화 중 첨부파일로만 전달됨. 필요하면 재생성 가능 (`/home/claude/make_logo.py` 로직 참고, 없으면 새로 만들어야 함)
  - **(신규, 2026-07-07)** 소셜 공유용 OG 이미지(`assets/img/og-image.png`, 1200×630)를 PIL로 새로 제작함. 로고 모티프 + "FreeToolDev" 워드마크("Dev"는 amber) + 태그라인 + "NO SIGNUP / NO UPLOADS / 100% FREE" 조합. 전체 39페이지에 og:/twitter: 메타태그로 연결됨.

---

## 5. 툴 27개 현황 (2026-08-19 기준)

| 툴 | 파일 | 상태 | 비고 |
|---|---|---|---|
| Base64 Encode/Decode | `tools/base64.html` | 검증완료 | 완전 클라이언트, 배치 줄단위 처리 |
| Bulk URL Encoder/Decoder | `tools/url-encoder.html` | 검증완료 | encodeURIComponent(Component)/encodeURI(Full URL) 모드 분리, 줄단위 배치. 외부 라이브러리 없음 |
| CSV to JSON | `tools/csv-to-json.html` | 검증완료 | UTF-8/EUC-KR/UTF-16 자동 인코딩 감지, 8MB 제한, 청크 파싱(멈춤 방지) |
| **(신규) JSON ↔ YAML Converter** | `tools/json-yaml-converter.html` | 검증완료(node로 실제 변환 결과까지 확인) | js-yaml(cdnjs 4.1.1) 라이브러리. `---`로 구분된 멀티 YAML 문서 → JSON 배열 변환 지원 |
| **(신규) CSV ↔ TSV Converter** | `tools/csv-tsv-converter.html` | 검증완료(node로 라운드트립 테스트까지 확인) | 외부 라이브러리 없이 자체 구현한 quote-aware 파서/시리얼라이저 (따옴표 안 콤마/탭/개행, `""` 이스케이프 전부 처리) |
| Bulk Image Resize/Convert/Compress | `tools/image-batch.html` | 검증완료 | Canvas API, 20MB/장·60장 제한, 순차처리+진행률. Crop to exact size(center-crop) 모드 포함. **(2026-07-27 2차, 사용자 피드백 반영) 저장된 프리셋 기능 추가** — resizeMode/targetSize/targetHeight/format/quality 5개 값을 이름 붙여 localStorage에 저장, 드롭다운으로 재적용, 삭제 가능. jsdom으로 저장/덮어쓰기/불러오기/삭제/빈이름거부 5개 시나리오 검증완료. 사이트 최초의 localStorage 사용 사례(서버 전송 없음 유지) |
| **(신규) Bulk SVG Optimizer** | `tools/svg-optimizer.html` | 검증완료(node로 실제 최적화 결과까지 확인, 644B→175B 72.8% 축소 케이스 테스트) | 외부 라이브러리 없이 자체 구현 — 주석/DOCTYPE/XML선언/에디터 네임스페이스(inkscape·sodipodi)/metadata 블록 제거, d·points 속성 좌표 소수점 반올림, 빈 g·defs 제거. title/desc/aria는 기본 보존(체크박스로 해제 가능) |
| **(신규, 2026-07-31 3차) Bulk PDF Merge & Compress** | `tools/pdf-merge-compress.html` | 검증완료 — jsdom+node-canvas로 none/safe/aggressive 3개 모드 전부 실제 실행 후 pdf-lib로 round-trip 재검증(페이지 수 일치 확인) | 외부 사용자 피드백(launch 플랫폼 댓글, "PDF 합치기+압축을 한번에 처리하고 싶다")에서 출발. `pdf-lib`(cdnjs, v1.17.1)로 페이지 복사 병합(항상 무손실) + `pdfjs-dist`(jsDelivr, legacy 빌드 v3.11.174 — **cdnjs는 pdf.js가 2.6.347에서 멈춰있어서 이 라이브러리만 예외적으로 jsDelivr 사용**)로 "Aggressive" 모드에서 페이지를 캔버스에 렌더 후 JPG로 재인코딩. 3단계 모드: None(순수 병합)/Safe(무손실, useObjectStreams+메타데이터 제거, 효과는 미미)/Aggressive(페이지를 이미지화 — 텍스트 선택/검색 불가가 되는 트레이드오프를 UI 경고문구로 명시, 기본값 아님). 파일당 50MB·배치당 20개, Aggressive 모드는 총 200페이지 캡. 신규 카테고리 "Documents"(`data-cat="doc"`) 신설. 신규 블로그 `blog/why-merged-pdf-is-bigger.html` 페어링 |
| RSS Generator | `tools/rss-generator.html` | 검증완료 | "계정불필요/스크래핑아님" 차별점 보강. **GSC 신호 있는 페이지 (아래 8번 참고)** |
| Sitemap Generator | `tools/sitemap-generator.html` | 검증완료 | |
| **(신규) Bulk Sitemap Validator** | `tools/sitemap-validator.html` | 검증완료(jsdom으로 7개 케이스 테스트: 정상/상대경로/우선순위범위초과/changefreq오류/loc누락/중복URL/XML파싱오류/sitemapindex) | 여러 sitemap.xml을 `-----` 구분선으로 붙여넣어 한번에 검증. DOMParser(브라우저 내장)로 XML 파싱, 외부 라이브러리 없음. Sitemap Protocol 스펙 기준 검사(well-formed XML/절대경로/priority 0.0-1.0/changefreq 7개값/lastmod 날짜형식/중복URL/50000개 한도/sitemapindex 구조). **경쟁사는 전부 "URL 1개 입력→서버fetch" 방식인데 우리는 여러 개 붙여넣기 배치 검증으로 차별화, CORS 문제 자체가 없음(URL fetch 안 하니까)** |
| robots.txt Generator | `tools/robots-txt-generator.html` | 검증완료 | Disallow/Allow/Sitemap 라인 + GPTBot/ClaudeBot/Google-Extended 등 AI 크롤러 개별 차단 체크박스 |
| llms.txt Generator | `tools/llms-txt-generator.html` | 검증완료 | `섹션 \| 제목 \| URL \| 설명` 포맷 파싱 → 카테고리별 마크다운 인덱스 생성 |
| **(신규, 2026-07-20) Humans.txt Generator** | `tools/humans-txt-generator.html` | 검증완료(node로 생성 로직 3케이스 테스트: 전체입력/최소입력(이름만)/빈입력) | `Role \| Name \| Contact \| Location` 파이프 포맷으로 팀원 여러 명 한 번에 입력 → humanstxt.org 스펙 형식(`/* TEAM */`, `/* THANKS */`, `/* SITE */`, `/* NOTE */`) 텍스트 생성. 외부 라이브러리 없음. **차별화 포인트: 경쟁사(rushax.com, rankplusplus.com, beewits 등)는 이메일 발송 방식이거나 URL을 서버에 넣어야 하는 방식인데, 우리는 즉시 브라우저에서 생성+복사/다운로드, 이메일·가입 불필요.** robots.txt/llms.txt Generator와 함께 "사이트 루트의 3종 텍스트 파일" 세트를 완성 — 상호 링크로 토픽 클러스터 형성 |
| **(신규, 2026-07-20 2차) Bulk Meta Title & Description Length Checker** | `tools/meta-length-checker.html` | 검증완료(node로 파싱/분류 로직 테스트: 정상/짧음/누락/너무김 케이스) | `### Page name` + `Title:` / `Description:` 라벨 + `-----` 구분선으로 여러 페이지를 한 번에 붙여넣기 → 글자수 기준(title 30-60/desc 70-158) 분류. 외부 라이브러리 없음. **차별화 포인트: 경쟁사 대부분(seranking, contentpowered, sanishtech 등)은 "URL 붙여넣기→서버 fetch"(최대 200개) 방식인데, 우리는 텍스트 직접 붙여넣기(fetch 자체가 없음)+여러 쌍 배치 이중 차별화.** 기존에 "서버 fetch 필요해서 보류" 상태였던 항목(구 12번 다음할일)을 접근 방식을 바꿔서 해결함 — Worker 확장 불필요. |
| **(신규, 2026-07-20 2차) Bulk Text Diff Checker** | `tools/text-diff-checker.html` | 검증완료(node로 LCS diff 알고리즘 7개 케이스 테스트: 동일/추가/삭제/변경/완전히다름/빈텍스트/실제config diff) | `### Label`(옵션) + 원본텍스트 + `===` + 수정본텍스트, `-----`로 여러 쌍 구분. LCS(최장공통부분수열) 기반 라인 단위 diff를 직접 구현(외부 라이브러리 없음, git diff와 같은 기본 원리). **차별화 포인트: diffchecker.com·draftable·textcompare.io 등 헤드키워드 장악한 대형 경쟁사 포함 검색 결과 전부 예외없이 "1쌍씩만" 비교 — "여러 쌍 한번에" 배치 앵글이 단 하나도 없어 배치 차별화 필터가 깨끗하게 통과.** 신규 카테고리 "Text" 개설의 계기가 된 툴. **(세션 중 발견/수정)** 결과박스가 다크섹션 배경(`#081729`)인데 처음엔 밝은섹션용 텍스트색을 그대로 써서 명암비 미달이 될 뻔함 — 명암비 직접 계산해서 WCAG AA 통과 색상으로 교체 후 커밋. |
| **(신규) Bulk Heading Structure Checker** | `tools/heading-structure-checker.html` | 검증완료(jsdom으로 실제 파싱/계층분석 로직 6개 케이스 테스트) | 여러 페이지 HTML을 `-----` 구분선으로 붙여넣어 한번에 H1-H6 계층 체크. DOMParser(브라우저 내장) 사용, 외부 라이브러리 없음. Missing H1/Multiple H1/Skipped level/Empty heading 4종 검사. **경쟁사는 전부 "URL 1개 입력" 방식인데 우리는 여러 페이지 동시 배치 체크로 차별화** |
| IP/DNS/SSL Bulk Lookup | `tools/ip-dns-ssl.html` | 검증완료 | DNS는 Google DoH, SSL은 Worker→crt.sh 경유. SSL 큐잉 동시 2개 제한. 페이지 최상단 "내 현재 IP" 카드(`api.ipify.org`) 포함 |
| Site Crawler & Audit | `tools/site-crawler.html` | 검증완료 | Worker `/crawl` 호출, 최대 40페이지, sitemap/rss/llms.txt 동시생성+깨진링크+메타태그 체크 |
| JWT Decoder (Batch) | `tools/jwt-decoder.html` | 검증완료(모바일 포함) | 서명 검증 안 함 명시, 완전 클라이언트 |
| Bulk QR Code Generator | `tools/qr-batch.html` | 검증완료(실제 스캔까지) | qrcodejs(cdnjs) 라이브러리, 100개 제한 |
| Bulk Barcode Generator | `tools/barcode-batch.html` | 검증완료 | UPC-A/EAN-13/Code128, JsBarcode(cdnjs 3.12.1) 라이브러리. UPC/EAN은 체크섬 검증 후 불합격 코드는 결과 하단에 별도 표시. 100개 제한 |
| **(신규, 2026-07-18) Bulk JSON Validator & Formatter** | `tools/json-validator.html` | 검증완료(node로 12개 케이스 테스트: 정상/트레일링콤마/작은따옴표/따옴표없는키/콤마누락/빈입력/문자열미종료 등, line/column 에러 위치 추출 로직 포함). **(2026-07-18 사용자가 스크린샷으로 발견/수정) 결과 박스 색상 대비 버그 있었음** — 다크 섹션 전제 스타일(`rgba(0,0,0,0.2)` 배경 + 앰버 글자)을 밝은 섹션(`section-paper`)에 그대로 써서 명암비 1.25:1(WCAG 기준 미달, 사실상 안 보임)이었음. 고정 다크배경(`#081729`)+크림/밝은앰버 글자로 교체해 15.1:1/10.1:1로 수정. **교훈: 새 툴 결과박스 스타일은 어느 section(navy/paper)에 들어가는지 확인 후 명암비 검증할 것 — 코드 작성 시 시각적 확인이 안 되므로 특히 주의.** | 여러 JSON 스니펫을 `-----` 구분선으로 붙여넣어 한번에 검증+포맷팅. 브라우저 내장 `JSON.parse`만 사용, 외부 라이브러리 없음. **경쟁사는 전부 파일 업로드 기반 배치 처리인데 우리는 파일 업로드 없이 텍스트 붙여넣기만으로 배치 처리 — "배치 자체"가 아니라 "업로드 없는 배치"가 차별화 지점** (12번 참고, 기존 "경쟁사는 단일처리" 필터와는 다른 신규 패턴) |
| **(신규, 2026-07-25) Bulk JSON Schema Validator** | `tools/json-schema-validator.html` | 검증완료(node로 14개 검증 케이스 테스트: 정상/필수누락/타입불일치/범위초과/패턴불일치/enum불일치/중복항목/추가속성/중첩배열 등) | 스키마 1개를 한 번 붙여넣고, 문서 여러 개를 `-----`로 구분해서 한 번에 검증. type/required/properties/items/enum/min·max/pattern/uniqueItems/additionalProperties/format(email·uri·date) 지원, `$ref`/`allOf` 등은 명시적으로 미지원(FAQ에 정직하게 고지). **차별화 포인트: 경쟁사 중 하나(jsonutils.org 계열)가 "여러 JSON 파일 배치 검증은 유료 엔터프라이즈 플랜"이라고 명시 — 무료 배치 검증 자체가 실질적으로 비어있는 자리였음.** json-validator(구문검사)와는 다른 계층의 기능이라 카니발 없이 Data 클러스터 보강 |
| **★(신규, 2026-08-19) Bulk Markdown Front Matter Checker** | `tools/frontmatter-checker.html` | 검증완료 — node로 로직 9케이스 + **jsdom으로 실제 DOM 6시나리오** 테스트 | 여러 Markdown 포스트를 `-----`로 구분해 붙여넣어 **서로 비교**. js-yaml(cdnjs 4.1.1) 사용. **검사 2계층**: (파일별) 펜스 누락·첫 줄 아님·미종료·YAML 오류·필수필드 누락/빈값·중복키 / (교차) 일부 파일에만 있는 필드·타입 드리프트·날짜포맷 혼용·중복 title/slug/permalink/url·**필드명 드리프트**. **핵심 차별화 = 필드명 드리프트 휴리스틱**: 비슷한 두 이름이 "**한 파일에서 절대 같이 안 쓰이면** 같은 필드"로 판정 → `date`/`publishDate`는 잡고 `title`/`subtitle`은 오탐 안 냄. 배치로만 가능한 판정이라 단일파일 툴이 원리적으로 못 따라옴. **세션 중 발견/수정한 버그 4건**: ①빈 front matter(`---\n---`)를 파싱실패 처리(Jekyll에선 합법) ②중복키를 파싱실패 처리(js-yaml은 throw하지만 실제 SSG는 마지막 값 사용 → 경고로 강등) ③필드명 유사판정이 `title`/`subtitle` 오탐 ④**푸터 추출 시 heading-checker의 `<script>`가 통째로 딸려와 신규 툴이 "Missing H1"을 출력** — jsdom 테스트 없었으면 그대로 배포될 뻔함. 추가로 CDN 로드 실패 시 전 파일이 "Invalid YAML"로 오표시되는 문제도 가드 추가. **명암비 직접 계산**: 다크 결과박스 9.67~15.72:1 통과, 단 기존 툴에서 물려받은 `#2e8b57`(3.97:1)·`#8a8578`(3.44:1)이 **AA 미달**이라 `#1f6b41`(6.06:1)·`#6b675d`(5.27:1)로 교체 |
| **(신규, 2026-07-25) Bulk Open Graph & Twitter Card Checker** | `tools/og-card-checker.html` | 검증완료(node로 6개 메타태그 파싱 케이스 테스트: 속성순서 정순/역순/홑따옴표/자체닫힘태그/태그누락/무관태그혼재) | `<meta>` 태그(또는 전체 HTML)를 여러 페이지분 붙여넣기 → og:/twitter: 속성만 정규식으로 추출해 Facebook·X 카드 미리보기 렌더링 + 누락 태그 표시. twitter: 태그 누락 시 og: 값으로 폴백하는 실제 스펙 동작 그대로 구현. **차별화 포인트: myog.social은 이미 사이트맵 기반 배치 체커가 있지만 서버 fetch 방식이고, wildandfreetools.com은 붙여넣기 방식이지만 1페이지씩만 — "붙여넣기+배치" 두 축을 동시에 하는 곳이 없음을 재확인 후 채택.** 로컬호스트/스테이징/로그인 뒤 페이지도 확인 가능하다는 게 fetch 기반 경쟁사 전부가 못 하는 지점 |
| **(신규, 2026-07-25) Bulk OG Image Generator** | `tools/og-image-generator.html` | 검증완료(node로 텍스트 줄바꿈 알고리즘 mock-measureText 테스트 + slugify 5개 엣지케이스 테스트) | 타이틀 목록(줄바꿈으로 구분, `Title \| Subtitle` 포맷)을 한 번에 1200×630 캔버스로 렌더링 → PNG 개별 다운로드 + JSZip(cdnjs 3.10.1, qr-batch/image-batch와 동일 라이브러리) 기반 ZIP 일괄 다운로드. 4가지 그라디언트 스타일(Navy/Amber/Paper/Violet), `document.fonts.ready` 대기 후 렌더링(폰트 로딩 타이밍 버그 방지). 30개/배치 제한. **차별화 포인트: CommonNinja/Screenhance/PicsSizer 등 OG 이미지 생성기 다수 있지만 전부 "한 장씩" 편집기 방식 — 여러 타이틀을 한 번에 배치로 뽑아 ZIP으로 받는 곳은 검색 결과에 없었음.** qr-batch/barcode-batch/image-batch와 동일한 "캔버스 배치 렌더→ZIP" 패턴을 재사용해 기술적 리스크 낮음 |

**카테고리 확장 (2026-07-13 2차 세션)**: 기존엔 Encode/Decode·SEO·Network·Media(이미지) 4개 카테고리뿐이었고, 사이트 태그라인("developers & designers")에도 불구하고 디자이너 전용 툴이 하나도 없었음. 사용자가 직접 카테고리 확장을 지시해서 데이터포맷 변환(JSON↔YAML, CSV↔TSV) + 디자인/미디어(SVG 옵티마이저) 방향으로 3개 추가함.

**신규 툴 후보 리서치 누적 결과 (총 33개 후보 검증, 4개 채택)**:
- 1차: Password Generator, Markdown→HTML, URL 단축기, Hash Generator, Timestamp Converter, Text Case Converter
- 2차(2026-07-11 세션): Bulk Redirect Checker, Bulk EXIF Remover, Bulk OG/Twitter Card Checker, Bulk Favicon Generator, Bulk UTM Builder, Batch Regex Tester, Bulk Color Contrast Checker(WCAG), Bulk Barcode(→이후 실제 채택), Bulk 텍스트 인코딩 변환, Bulk 파일 이름 변경기, Cron Expression Parser, CORS Preflight Tester, Bulk 색상 포맷 변환, 여러 이미지 팔레트 동시 추출
- 3차(같은 세션, robots.txt/llms.txt 검토 중): 자체 robots.txt/llms.txt Generator도 "포화" 판정이었으나, **수익화(페이지 수) 관점에서 포화 여부와 무관하게 채택하기로 사용자가 방향 전환**
- 4차(2026-07-13 세션 1차): Bulk URL Encoder/Decoder(→채택), Bulk 메타태그(title/description) 길이 체커(→Worker 새 엔드포인트 필요해서 보류, 아래 12번 참고), Bulk Slug Generator(→미채택)
- 5차(2026-07-13 세션 2차, 카테고리 확장 지시): CSS Gradient Generator, Typography/Spacing Scale Generator, Bulk Color Contrast/Palette(재확인) — 전부 매우 포화 + 경쟁 툴들이 기능적으로 훨씬 풍부(Colorffy, TypeScale Pro 등)해서 디자인 카테고리에서는 미채택. 대신 **Bulk SVG Optimizer**를 "image-batch와 바로 짝이 맞는 미디어 배치 처리" 기준으로 채택 (이것도 SVGO 기반 경쟁자 다수 있지만, 자체 구현이 가볍게 가능하고 image-batch 사용자층과 직접 겹침). 데이터포맷 쪽은 JSON↔YAML, CSV↔TSV 둘 다 채택.
- 6차(2026-07-16 세션, "신규 계속 해야한다" 지시): CSS px↔rem/em 변환기(→10곳 이상 경쟁, 미채택), CSS 커스텀 프로퍼티(변수) 추출기(→6곳 이상 경쟁, 미채택), Heading 구조 체커(→10곳 이상 경쟁이지만 **전부 "URL 1개" 방식**이라 "여러 페이지 동시 배치 체크"로 차별화 가능해서 채택). "웹디자인" 계열 신규 후보는 이번 세션까지 총 7개 검증했는데 전부 대형 경쟁자가 기능적으로 훨씬 풍부해서 대부분 미채택 — **디자인 카테고리는 SVG Optimizer 이후로 사실상 막힌 상태.** SEO/기술감사 계열("체커" 툴)도 동일 니치를 도는 클론 사이트(webaloha, nuwtonic, go-seo, inspiringclicks 등)가 10곳 이상씩 있어 매우 포화 — 다만 우리 쪽 "batch" 차별화 포인트를 못 쓰는 경쟁사가 대부분이라, "여러 개 한번에" 앵글을 못 쓰는 후보는 계속 피하고 쓸 수 있는 후보만 채택하는 식으로 걸러야 함.
- 7차(2026-07-16 세션, 같은 세션 계속 확장 지시): 대기 중이던 3개 후보(Color Palette Extractor/EXIF Remover/File Renamer)를 새로 배운 "배치 차별화" 필터로 재검토 → **셋 다 경쟁사가 이미 배치 모드를 갖추고 있어서 필터 탈락, 만들지 않기로 결정.** 대신 새로 검색해서 **Bulk Sitemap Validator** 채택 — 경쟁사 10곳 이상 있지만 전부 "URL 1개 입력→서버에서 fetch" 방식인 반면 우리는 "여러 sitemap.xml 붙여넣기 배치 검증"이라 명확히 차별화됨. 게다가 URL을 직접 fetch 안 하므로 CORS 문제도 원천적으로 없어서(다른 후보였던 메타태그 체커와 달리) Worker 확장 없이 바로 구현 가능했음. sitemap-generator 사용자층과도 직접 겹침.
- **결론: 순수 "경쟁 없는 아이디어" 기준은 더 이상 안 나옴.** "포화됐어도 브랜드에 맞고 빠르게 만들 수 있는 것" 기준으로 계속 운영 중이며, 카테고리 자체를 넓히는 것도 유효한 확장 축으로 확인됨. **다만 최근 세션들에서 확인된 패턴: 경쟁사가 전부 "단일 항목" 처리인데 우리만 "배치/여러개 동시" 처리를 제공할 수 있는 후보가 채택 성공률이 훨씬 높음** (SVG Optimizer, Heading Checker, Sitemap Validator 전부 이 패턴). 앞으로 신규 후보 검토 시 이 차별화 포인트를 먼저 확인할 것 — **"이미 만든 대기 후보"라도 이 필터로 재검토해서 탈락시킬 수 있음**(2026-07-16 세션에서 실제로 3개 탈락시킴), 오래됐다고 자동으로 만들지 말 것.
- 8차(2026-07-18 세션, "공격적으로 확장" 지시 — 사용자가 경쟁 있어도 롱테일로 피해서 진행하라고 명확히 지시함): Hash Generator, Timestamp Converter, robots.txt Tester(다중 URL), Cron Expression Parser(crontab 배치), JSON Validator 5개 후보를 웹 검색으로 검토. **5개 전부 "경쟁사가 이미 배치/다중 처리를 지원"하는 상태라 기존 "경쟁사는 단일 처리" 필터로는 하나도 통과 못 함** — 이 필터가 사실상 소진됐음을 재확인. 사용자 지시대로 "경쟁 존재를 인정하고 롱테일 포지셔닝으로 승부" 방침으로 전환해서 **Bulk JSON Validator & Formatter**를 채택함 — 근거는 "배치 자체"가 아니라 "파일 업로드 없이 텍스트 붙여넣기만으로 배치 처리"라는 포지셔닝(경쟁사 다수가 파일 업로드 방식이라 우리 브랜드의 "no-upload" 정체성과 자연스럽게 결합되는 지점). 기존 CSV-to-JSON·JSON-YAML Converter와 동일 사용자층 공유. **패턴 갱신: "경쟁사는 단일처리, 우리는 배치" 필터가 막히면 "경쟁사는 파일업로드 필요, 우리는 텍스트 붙여넣기만으로 가능(no-upload 브랜드 정체성)" 필터를 2차 대안으로 쓸 것.**

- 9차(2026-07-20 세션, GSC에서 "humans txt generator" 1노출 신규 키워드 발견 → 리서치): 웹 검색 결과 rushax.com/rankplusplus.com/beewits.com 등 기존 생성기 다수 존재하지만 이메일 발송 방식이거나 URL을 서버에 제출해야 하는 방식 — "no-upload 차별화 필터"(8차 패턴)로 채택 가능. 볼륨 자체는 1노출로 약한 신호지만, (1) robots.txt/llms.txt Generator와 자연스러운 "사이트 루트 3종 텍스트 파일" 세트를 완성해 토픽 클러스터 형성에 유리하고 (2) 제작 난이도가 매우 낮고 (3) 9번 원칙(수익화 국면엔 포화 여부보다 페이지 총량이 우선) 기준에 부합해 채택함.

- 10차(2026-07-20 2차 세션, 사용자가 "공격적으로 확장해야된다... 경쟁 세면 롱테일 키워드로 어떻게든 뚫고 가야된다" 방향 재확인/강화 지시 — 카테고리 확장도 명시적으로 환영): 웹 검색으로 Hash Generator(MD5/SHA), Regex Tester(다중 패턴), Bulk Meta Title/Description Length Checker, Bulk Text Diff Checker 4개 후보 검토. **Hash Generator·Regex Tester는 기각** — 둘 다 경쟁사가 이미 멀티라인/배치 처리를 갖춤(miraclesalad는 "여러 줄=여러 문자열" 지원, onlinestringtools는 "multi-string option"으로 여러 줄 동시 테스트 지원 등) — 배치 차별화 필터가 안 먹힘. **Meta Length Checker·Text Diff Checker는 채택** — 자세한 근거는 5번 표 참고. 특히 Text Diff Checker는 diffchecker.com 같은 초대형 브랜드조차 전부 "1쌍씩"만 지원하는 게 확인돼서, 헤드키워드 경쟁이 아무리 세도 "배치" 앵글 자체가 비어있으면 채택 가치가 있다는 걸 보여준 사례 — 이 패턴은 앞으로도 신규 후보 스크리닝의 핵심 기준으로 유지.

- 11차(2026-07-25 세션, "전부 다 해야지... 후순위도 할 수 있으면 하는게 맞다, 가치없는 콘텐츠 안되게" 지시 — 폭넓은 리서치 후 4개 후보 전량 재검토): 구글 외 소스(Reddit 파생, 개발자 커뮤니티, GitHub)까지 포함해 훨씬 넓게 검토. **기각(롱테일도 안 뚫림, 강제로 안 만듦)**: Bulk Unix Timestamp Converter(경쟁사 5곳+ 이미 배치+CSV export), Bulk Email Validator(산업 자체가 거대+ 진짜 검증은 서버 필요), Bulk Cron Parser(crontap.com이 이미 멀티cron 비교 지원), Bulk URL Slug Generator(상위 7개 전부 배치+CSV), Bulk HTML Entity Encoder(배치 지원 경쟁사 있음+개념 자체가 너무 얕음), **Bulk Favicon Generator**(10곳+ 전부 "1장→전체사이즈"가 이미 배치 개념이라 차별화 불가), **Bulk Color Contrast Checker**(재조사 결과 6곳 이상이 이미 멀티컬러/매트릭스 배치 지원 — jansensan.github.io, bushe.co, netlify 앱들, PolicyViz, Coolors Pro 등. CSS 커스텀 프로퍼티 결합 앵글도 GitHub 프로젝트·npm 패키지·PaletteChecker.com이 이미 커버 — **양쪽 다 롱테일 진입로 자체가 안 보여서 최종 기각, 억지로 안 만듦**). **채택(3개 전량 제작)**: Bulk JSON Schema Validator(유료플랜 뒤에 숨은 기능 발견), Bulk Open Graph & Twitter Card Checker(붙여넣기+배치 이중 차별화), Bulk OG Image Generator(배치 렌더 자체가 시장에 없음) — 상세 근거는 5번 표 참고. **패턴 갱신: 롱테일을 아무리 찾아도 "경쟁사가 이미 배치까지 다 해놨다"는 신호가 나오면(특히 CSV export·매트릭스·멀티라인 지원까지 명시된 경우), 무리하게 롱테일 각도를 짜내지 말고 정직하게 기각할 것 — 가치 없는 중복 콘텐츠보다는 후보 하나를 덜 만드는 게 낫다.**

- 12차(2026-08-11 세션, "공격적 확장전략 유지, 진짜 할 거 없으면 안 하는 게 맞다" 지시): GSC 데이터에서 신규 툴 수요 신호가 잡히는 게 없어서, **우리 최고 신호 클러스터(RSS, llms.txt, SEO체커)에 인접한 후보 3개**를 웹 검색으로 검토 → **3개 전량 기각.**
  - **Bulk RSS Feed Validator (기각)**: rss-generator(456노출, 사이트 1위 툴)와 직접 인접해서 기대가 컸으나, **경쟁사가 이미 배치를 다 갖춤** — rsskit.co.uk("bulk validate multiple feeds at once"), rssvalidator.ru(다중 피드 동시 검증 + JSON/CSV/TXT export), rssfeedslist.com(수십~수백 개 URL 일괄 체크), finder.wprssaggregator.com(25개씩 + OPML export). 11차에서 확립한 "경쟁사가 CSV export까지 갖췄으면 정직하게 기각" 기준에 정확히 걸림.
  - **Bulk Hreflang Checker (기각, 가장 뼈아픈 케이스)**: 왕복 태그(return tag) 검증이 본질적으로 여러 페이지를 요구해서 배치 차별화가 될 줄 알았으나 — lumina-seo.com이 sitemap 모드로 **2,000 URL 병렬 검증**, sanishtech.com이 sitemap 단위 + CSV export, 결정적으로 **klartext-tools.com이 "CSV 또는 raw HTML 붙여넣기, no upload, 브라우저 로컬 실행"** 으로 **우리 차별화 공식 3개(배치·붙여넣기·no-upload)를 전부 이미 구현**해놓음. 배치 필터·no-upload 필터 둘 다 탈락.
  - **llms-full.txt Generator (기각)**: 8/4 분석의 "경쟁사가 유료로 잠가둠" 전제가 **이번 재조사에서 무효화됨** — llmstxtgen.com/llmstxtgenerate.com이 무료 제공, WordPress 플러그인 존재, Mintlify·GitBook은 자동 생성. 게다가 우리는 크롤러(Worker 40페이지 한도)로 본문을 추출해야 하는데 경쟁사는 AI 요약까지 붙여줌 → **명백히 열등한 카피가 됨(11번 16항)**. 관련해서 기존 페이지의 부정확한 서술도 정정함(8번 8/11 블록 4항).
  - **⚠️ 신규 경쟁사 인지 — `klartext-tools.com`**: robots.txt / hreflang / sitemap validation / crawl check를 **"no upload, runs locally in your browser"** 포지셔닝으로 묶어서 운영 중. **우리와 컨셉이 사실상 동일한 직접 경쟁자.** 앞으로 SEO/체커 계열 신규 후보를 검토할 때 이 사이트를 먼저 확인할 것 — "우리만 할 수 있다"고 판단하기 전에 여기 이미 있는지부터 보는 게 빠름.
  - **결론: 이번 세션 신규 툴 0개.** 억지로 만들지 않음(11차 원칙 유지). 사용자 지시대로 공격적 확장 전략 자체는 유지하되, 이번엔 만들 게 실제로 없었음.

- **13차(2026-08-19 세션, "신규를 해볼까 싶어서 왔다 / 키워드 폭넓게 / GSC 안에서만 보지 말고 구글·네이버·레딧 등에서 문서수 적은데 관심 있는 걸 찾아라 / 새 클러스터 추가해도 좋다" 지시): 우리 기존 26개 툴과 겹치지 않는 영역으로 5개 검토 → 4개 기각, 1개 채택.**
  - **i18n 로케일 JSON 키 비교 (기각, 가장 아까웠던 건)**: 새 클러스터로 딱 맞고 배치 친화적(1개 소스 vs N개 타겟)이라 기대가 컸으나 — jsonutils.org가 웹에서 2개 로케일 비교를 이미 제공, translater.sukerokulabs.com이 **"compare locale files, runs entirely in your browser, no data uploaded"**, 결정적으로 **i18next 공식 FAQ가 "JSON 로케일 파일을 넣으면 누락 번역·중복·플레이스홀더 불일치를 잡아주는 무료 i18n health check, 전부 브라우저에서 실행, 업로드 없음"을 직접 안내**함. **우리 차별화 3종(배치·붙여넣기·no-upload)이 전부 선점.** 11차 원칙대로 정직 기각.
  - **JSON-LD/구조화 데이터 배치 검증 (기각)**: scrawl.tools가 500 URL 배치, schemavalidator.com이 50 URL 배치 + sitemap 입력, easyprotools가 URL/크롤/배치/붙여넣기 4모드 + CSV·TXT export. "CSV export까지 갖췄으면 기각"(11차) 기준 명확히 해당.
  - **.env / .env.example 비교 (기각)**: filediffs.com·envdiff.com·codesmith.in·jaconir.online 전부 웹 기반 + 붙여넣기 + 브라우저 로컬 실행 명시. no-upload 필터가 안 먹힘.
  - **★ Bulk Markdown Front Matter Checker (채택 — 27번째 툴)**: 이 영역은 **검증 도구가 전부 설치형**이었음 — python-frontmatter, testmd(pypi), vinicioslc/frontmatter-validator(CLI), frontmatter.codes(VS Code 확장), Astro Zod(빌드타임), R frontmatter. 웹에 있는 건 **생성기**(tools.jarhalab.com)와 **단일 파일 편집기**(toolsbox.io), 문법만 보는 범용 YAML 밸리데이터(uibakery·yamllint)뿐. **여러 포스트를 서로 비교하는 웹 도구가 없음.** Jekyll Talk에 "front matter를 어떻게 검증하냐"는 질문이 답 없이 남아있는 것도 확인.
    - **차별화가 롱테일 각도가 아니라 문제의 본질이라는 게 이 후보의 강점**: front matter 실패의 대부분(필드명 드리프트, 타입 드리프트, 날짜포맷 혼용, 중복 slug)은 **개별 파일이 전부 유효한 YAML**이라서 단일 파일 검사로는 원리적으로 못 잡음. 배치가 마케팅 문구가 아니라 기능 요건임.
    - **기존 최강 클러스터에 직결**: `blog/sitemap-static-sites.html`이 구글 12.8위(사이트 최고 콘텐츠 페이지), Bing에서 "github pages sitemap robots static site" 2위. 정적 사이트(Jekyll/Hugo/Astro/Eleventy) 운영자가 그대로 이 툴의 관객임. `meta-length-checker`와도 연결(front matter의 title/description이 곧 메타태그).

**대기 중인 신규 툴 후보**: 없음 (13차에서 5개 검토 후 4개 기각·1개 채택으로 소진). 다음 세션에서도 "배치 차별화" 우선, 막히면 "no-upload 차별화"(8차), 그마저 없으면 "경쟁사가 전부 단일 항목만 처리하는 헤드키워드"(10차) 순으로 확인하고, **전부 막히면 억지로 만들지 말고 정직하게 기각 보고할 것**(11차에서 확립된 원칙).

**⚠️ 13차에서 갱신된 경쟁 인식 (다음 후보 검토 시 먼저 확인할 것)**:
- **공식 문서가 무료 웹툴을 직접 안내하는 경우가 생겼음** — i18next FAQ 사례처럼, 라이브러리/프레임워크 공식 문서에서 특정 무료 툴을 추천하면 그 니치는 사실상 닫힌 것으로 볼 것. 검색 상위 경쟁사만 보지 말고 **해당 기술의 공식 문서·FAQ를 반드시 확인**할 것.
- **"설치가 필요한가"가 새로 유효한 필터로 확인됨** — front matter 영역처럼 경쟁이 CLI/npm/VS Code 확장/빌드타임에 몰려 있으면, 웹에서 즉시 쓰는 것 자체가 차별화가 됨. 배치·no-upload 필터가 둘 다 막혔을 때 **3차 필터로 "경쟁이 전부 설치형인가"를 볼 것.**

---

## 6. Cloudflare Worker (`freetooldev-crawler`)

- **주소**: `https://freetooldev-crawler.canghun13.workers.dev`
- **엔드포인트**:
  - `GET /crawl?url=https://example.com` — 사이트 크롤링(최대 40페이지, 서브리퀘스트 45개 제한), sitemap.xml/rss.xml/llms.txt/브로큰링크/메타태그 리포트 반환 (JSON)
  - `GET /ssl?domain=example.com` — crt.sh(Certificate Transparency 로그, API키 불필요) 조회로 SSL 만료일 확인. exact-match 쿼리 문법은 정상 도메인까지 결과없음 처리하는 버그가 있어서 롤백함 — **절대 다시 넣지 말 것.** 30초 타임아웃 + 502/503 시 1회 재시도 구현됨.
- **배포 방식**: Cloudflare 대시보드에서 수동으로 코드 편집/Deploy (Claude가 API로 직접 배포 못 함). 코드는 대화 중 파일로 전달, repo에는 백업 안 해둠 (필요시 사용자 판단으로 나중에 추가 가능)
- **HTMLRewriter** API로 title/meta description/링크 추출 (Cloudflare Workers 전용 스트리밍 HTML 파서)

---

## 7. 블로그 현황 (48개, 2026-08-04 재검증)

**툴별 커버리지 (2026-07-25 세션 기준, 25개 툴 전부 최소 2개 이상)**:

| 툴 | 개수 |
|---|---|
| image-batch, rss-generator, site-crawler | 3 |
| base64, jwt-decoder, csv-to-json, ip-dns-ssl, qr-batch, sitemap-generator, barcode-batch, url-encoder, json-yaml-converter, csv-tsv-converter, svg-optimizer, heading-structure-checker, sitemap-validator, json-validator, meta-length-checker, text-diff-checker, json-schema-validator, og-card-checker, og-image-generator | 2 |
| robots-txt-generator, llms-txt-generator, humans-txt-generator | 1개씩 전용 + "robots.txt vs llms.txt vs humans.txt" 3자비교 1개 공유 = 사실상 2개씩 |

**2026-07-07 세션 이전 (13개)**: jwt-claims-explained, find-broken-links-free-tool, rss-generator-no-account, free-alternative-screaming-frog, rss-for-automation, bulk-qr-code-use-cases, ssl-expiry-monitoring-free, csv-encoding-gibberish, sitemap-static-sites, debug-jwt-base64-locally, webp-vs-avif-2026, no-upload-image-compression, batch-vs-ai-image-convert

**2026-07-07 세션 추가 (4개, 언더커버 툴 보강)**: sitemap-vs-robots-txt, csv-to-json-data-types, dns-records-explained, static-vs-dynamic-qr-codes

**2026-07-11 세션 추가 (4개, 신규 툴 3개 세트)**: robots-txt-mistakes, robots-txt-vs-llms-txt, upc-vs-ean-vs-code128, bulk-barcode-use-cases

**2026-07-13 세션 1차 추가 (1개)**: encodeuricomponent-vs-encodeuri

**2026-07-13 세션 2차 추가 (3개, 카테고리 확장 세트)**: svg-export-bloat, json-vs-yaml, csv-vs-tsv

**2026-07-13 세션 3차 추가 (4개, 1개뿐이던 신규 툴 4개 전부 2개로 보강)**: double-url-encoding, yaml-anchors-aliases, excel-csv-number-mangling, inline-svg-vs-img-vs-css-background

**2026-07-16 세션 2차 추가 (2개, 신규 툴 1개 세트)**: skipped-heading-levels, multiple-h1-tags

**2026-07-16 세션 3차 추가 (2개, 신규 툴 1개 세트)**: sitemap-priority-changefreq, sitemap-index-files

**2026-07-18 세션 2차 추가 (2개, 신규 툴 1개 세트)**: json-syntax-errors-explained(문제해결형 — JSON이 JS 문법을 거부하는 이유 6가지), json-validator-no-upload(비교분석형 — 파일업로드 vs 브라우저전용 JSON 툴, 민감데이터 다룰 때 실질적 차이)

**2026-07-20 세션 추가 (2개, 신규 툴 1개 세트)**: humans-txt-explained(문제해결형 — humans.txt가 뭐고 왜 크롤러/AI가 안 읽는지, 언제 추가할 가치가 있는지), robots-llms-humans-txt-compared(비교분석형 — robots.txt/llms.txt/humans.txt 3개 파일을 독자·역할·SEO영향 기준으로 나란히 비교하는 표 포함, 기존 robots-txt-vs-llms-txt 글에서도 상호링크 추가)

**2026-07-20 2차 세션 추가 (4개, 신규 툴 2개 세트 — 사용자 "공격적 확장" 지시)**: meta-title-pixel-truncation(문제해결형 — 픽셀폭 vs 글자수 절단 이슈), meta-description-vs-google-snippet(비교분석형 — 구글이 description을 언제/왜 무시하고 자체 스니펫으로 바꾸는지), bulk-text-diff-use-cases(문제해결형, "When You Actually Need X in Bulk" 기존 네이밍 컨벤션 유지 — config 감사/콘텐츠 마이그레이션 검수/번역 동기화/생성 출력물 검증 4개 실사용 시나리오), line-diff-vs-character-diff(비교분석형 — 라인단위 vs 문자단위 diff의 실질적 차이와 각각의 적합한 상황)

**2026-07-25 세션 추가 (6개, 신규 툴 3개 세트)**: json-validator-vs-schema-validator(비교분석형 — 구문검사 vs 스키마검사는 다른 질문이라는 것), api-schema-drift-explained(문제해결형 — API 응답 형태가 아무도 모르게 바뀌는 과정과 어떻게 잡는지), check-og-tags-localhost-staging(문제해결형 — fetch기반 체커들이 전부 못 하는 로컬호스트/스테이징 확인법, 우리 툴의 핵심 차별점을 직접 설명하는 글), og-image-vs-twitter-image(비교분석형 — X의 og: 태그 폴백 동작과 언제 별도 twitter: 태그가 필요한지), generic-og-image-problem(문제해결형 — 사이트 전체가 같은 OG 이미지를 쓸 때 피드에서 실제로 손해보는 것), static-vs-dynamic-og-images(비교분석형 — 정적 배치 생성 vs Vercel식 요청시점 동적 생성, 우리 툴 포지셔닝 근거)

**참고**: jwt-claims-explained는 신규 작성이 아니라 2026-07-16 1차 세션에서 대폭 보강됨(RFC 7519 registered/public/private 용어 섹션 추가, 500→1157단어) — 8번 참고.

**(신규, 2026-07-20) 고아 페이지(본문 내부링크 0건) 25개 전량 해소**: 2026-07-18 세션에서 4개만 처리하고 "잔여 23개"로 남겨뒀던 과제(실측 재검사 결과 25개)를 이번 세션에서 전부 처리함. 방식은 기존 패턴(예: rss-generator.html의 "See this post for..." 인라인 링크) 그대로 유지 — 별도 "관련 글" 블록을 새로 만들지 않고, 각 블로그의 진짜 컴패니언 툴 페이지의 기존 FAQ/본문 문단에 자연스러운 한 문장을 추가하는 방식으로 11개 툴 페이지(csv-to-json, csv-tsv-converter, url-encoder, svg-optimizer, json-yaml-converter, image-batch, barcode-batch, qr-batch, robots-txt-generator, sitemap-generator, sitemap-validator, heading-structure-checker, jwt-decoder, ip-dns-ssl)를 편집. python 스크립트로 헤더/푸터를 제외한 본문 링크만 집계해서 처리 전/후 고아 페이지 수를 직접 검증(25→0). 이 작업이 Coverage의 "발견됨-미색인" 문제 완화에도 도움될 수 있음(12번 다음할일 참고).

**(2026-07-25 세션, 고아 페이지 재발 확인)**: 신규 툴 3개를 순차 제작하는 과정에서 블로그 2개(api-schema-drift-explained, check-og-tags-localhost-staging)가 일시적으로 고아 상태가 됐던 걸 커밋 전 검증 단계에서 발견해 즉시 해소함(0건 확인). **원인: 툴 페이지를 먼저 만들고 컴패니언 블로그를 나중에 쓰다 보니, 정작 툴 페이지 본문에는 블로그로 가는 링크를 깜빡함.** 앞으로는 신규 툴+블로그 세트를 만들 때 "툴 페이지 프로즈에 각 컴패니언 블로그 링크 삽입"을 파일 작성 직후 체크리스트 항목으로 명시적으로 확인할 것.

---

## 8. GA4 / Search Console 데이터 추이 (스냅샷 비교)

| 날짜 | 총 클릭 | 총 노출 | 노출 잡힌 페이지 수 |
|---|---|---|---|
| 2026-07-06 | 1 | 111 | 소수 |
| 2026-07-10 | 2 | 305 | 5~6개 |
| 2026-07-11 | 3 | 421 (+38%) | 16개로 확대 |
| 2026-07-13 | 3 | 498 (+18%) | 18개 |
| 2026-07-16 | 3 | 869 (+75%) | 20개 |
| 2026-07-18 | 4 (+1) | 1149 (+32%) | 22개 |
| 2026-07-20 | 4 (변화없음) | 1111 (-3%, GSC 처리지연 감안 시 사실상 flat) | 22개 |
| 2026-07-27 | 5 (+1) | 1649 (+48%) | 35개 |

**2026-08-18 세션 — 데이터 재확인 및 조치 사항**:

- **전체 지표**: 클릭 7→**7 (3주 연속 증가 0)**, 노출 2457→**3255(+27%)**, 노출 페이지 52→53, 쿼리 331→397. **마지막 클릭은 여전히 7/27 — 19일 연속 0건.**
- **★ 노출 변곡점**: 8/1~8/11 하루 35~59 → **8/12부터 134/143/122/116으로 2배 이상 급증.** 8/11 lastmod 푸시 다음날부터라 시점은 맞지만, 아래 색인 항목과 합쳐 보면 단정 불가. **다음 스냅샷에서 이 수준이 유지되는지가 판정 기준.**
- **★ 색인 23→17 (6개 해소).** 빠져나간 6개: check-og-tags-localhost-staging, csv-encoding-gibberish, csv-to-json-data-types, generic-og-image-problem, sitemap-vs-robots-txt, static-vs-dynamic-og-images.
  - **효과 즉시 확인됨**: `csv-to-json-data-types.html`이 색인되자마자 **57노출**, `csv-encoding-gibberish.html` 8노출. **"색인만 되면 노출이 붙는다"가 실증됨** → 미크롤링 해소가 노출 성장의 1순위 레버라는 게 확정.
  - **⚠️ 다만 lastmod 공로로 보면 안 됨(정직 기록).** Coverage 차트상 **23→19는 8/8**, 19→17이 8/11인데 푸시는 8/11이었음. **감소분 대부분이 lastmod 이전에 시작됨** → 자연 크롤링일 가능성이 큼. lastmod 효과 판정은 다음 스냅샷으로 미룰 것.
  - 남은 17개에 **핵심 툴 4개(csv-tsv-converter, image-batch, pdf-merge-compress, sitemap-generator)** 포함. "크롤링됨-미색인"은 upc-vs-ean-vs-code128 1건 유지(8/8~8/10 일시적으로 5까지 올랐다가 복귀).
- **★★ 8/11 세션의 결론을 자체 반증함 (28항 개정 근거)**: 지난주 "미색인 23개 평균 인바운드 2.3 vs 색인 2.89 → 내부링크 문제 아님"이라고 결론냈는데, **그건 링크의 *출처*를 무시한 분석이었음.** 출처 페이지의 노출량으로 가중치를 줘서 재분석하니 정반대 그림이 나옴:

  | 페이지 | 노출 | 본문 링크 수 |
  |---|---|---|
  | free-alternative-screaming-frog | 858 | **1개** |
  | jwt-claims-explained | 361 | **1개** |
  | base64.html | 174 | **0개** |
  | meta-length-checker | 149 | 2개 |

  - **지난주 카운트가 비슷하게 나온 이유는 푸터가 26개 툴을 전부 링크하고 있어서였음.** 푸터/네비 링크는 보일러플레이트라 크롤 유도력이 거의 없는데, 개수 집계에는 잡히지 않아도 미색인 페이지들의 실제 본문 인바운드가 대부분 `blog/index.html`(14노출)·`tools/index.html`(23노출)뿐이라는 사실이 가려졌음. **그 두 허브 자체가 거의 안 읽힘.**
  - 즉 **우리 최대 크롤 자석들이 전부 막다른 골목**이었고, 유입된 크롤 수요가 다른 페이지로 흐르지 않았음. **이게 미크롤링 17개의 진짜 원인.**
- **Bing 웹마스터 (이번 세션 처음 확보)**: 총 노출 14건으로 볼륨은 미미하지만 **순위대가 Google과 완전히 다름.**

  | 페이지 | Bing | Google |
  |---|---|---|
  | json-validator | **4위 (클릭 1)** | 68.2 |
  | dns-records-explained | **3위** | 38.0 |
  | yaml-anchors-aliases | **3위** | **Google 미색인** |
  | barcode-batch | **5위** | 52.5 |
  | csv-encoding-gibberish | **6위** | 37.1 |
  | why-merged-pdf-is-bigger | **8위** | **Google 미색인** |

  - "bulk json file validator" 4위에서 **클릭 1건** — Google에서 19일간 못 만든 클릭을 Bing이 만듦. 키워드도 "github pages sitemap robots static site"(2위) 등 우리 롱테일과 정확히 일치.
  - **해석: 우리 "bulk + no-upload + 롱테일" 포지셔닝이 틀린 게 아니라 Google 도메인 권위에 막혀 있다는 방증.** 콘텐츠 방향을 의심할 근거가 아님.
  - **⚠️ 전략은 바꾸지 않았음(11번 19항 유지).** Bing 특화 전략은 사용자 판단 사항이라 임의로 채택 안 함. IndexNow도 검토했으나 컨테이너 네트워크 화이트리스트에 api.indexnow.org가 없어 제출 자체가 불가 → **제안만 남기고 미실행.**
- **순위 15~40 구간 변화**: humans txt generator 32→**45노출/28.64위**(4스냅샷 연속 상승, 단 상업가치 0이라 추적만), zapier rss 15노출/29.33위(3주째 완전 동일), llms.txt 클러스터 전부 동일(18~36위), bulk meta title and description checker 4→5노출/16.4위.
- **신규 등장 클러스터**: **"csv to json" 31노출/56.87위로 신규 진입**(8/11엔 없던 쿼리). 다만 헤드텀이라 순위대가 절망적. `tools/csv-to-json.html`은 15노출/22.87위에 **CTR 6.67%로 사이트 최고** — 롱테일에서는 먹힌다는 뜻.
- **GA4(7/21~8/17)**: 활성 61명. (direct)/(none) 51명 + Council Bluffs 6·Frankfurt 4·Ashburn 3 → 11번 25항대로 봇. **실사용자는 google/organic 3 + twelve.tools 2 + producthunt 1 + bing/organic 1 = 7명 수준.** Busan 5는 사용자 본인. 8/11 추정(8명)과 사실상 동일 — **트래픽 정체.**
- **수익화**: 9-1-1 트래픽 조건 전부 미달(클릭 0). 보고에서 제외함.

**2026-08-18 세션 조치 내역 (실제 커밋한 것)**:

1. **고노출 페이지 → 미크롤링 페이지 본문 링크 8개 신설 (이번 세션 최우선 작업).** 위 반증 분석에 근거. **문맥상 자연스러운 것만 넣고 억지 연결은 배제**(링크 스팸 방지):
   - `free-alternative-screaming-frog`(858) → find-broken-links-free-tool, sitemap-generator, sitemap-priority-changefreq
   - `base64`(174, 본문링크 0개였음) → image-batch (Base64가 바이너리를 1/3 부풀린다는 실제 논점으로 연결)
   - `meta-length-checker`(149) → og-image-vs-twitter-image (검색용 태그 ≠ 소셜 태그 경계 설명)
   - `json-validator`(76) → json-vs-yaml / `llms-txt-generator`(46) → robots-txt-vs-llms-txt
   - `csv-to-json-data-types`(57, 이번에 색인됨) → csv-tsv-converter / `sitemap-static-sites`(116) → sitemap-priority-changefreq / `no-upload-image-compression`(16) → pdf-merge-compress
   - **결과**: sitemap-generator 최대출처 130→**858**, image-batch 130→**174**, csv-tsv-converter에 57 추가. **pdf-merge-compress만 문맥 맞는 고노출 페이지가 없어 130(index) 유지 — 억지로 안 넣었음.**
   - ⚠️ 작성 중 `site-crawler`가 priority/changefreq를 출력한다고 쓸 뻔했으나 실제로는 Worker가 생성해서 확인 불가 → 문장 수정함(29항 적용).
2. **신규 글 1개: `blog/sitemap-lastmod-git-commit-date.html`** (1,281단어). **중복 확인 완료** — sitemap-static-sites(호스팅 위치), sitemap-priority-changefreq(두 태그 무시됨), sitemap-index-files(인덱스 파일)와 주제 겹치지 않음.
   - **경쟁 회피 앵글(웹 검색으로 확인)**: generate-sitemap GitHub Action, gatsby-plugin-git-lastmod, Docusaurus, johnnyreilly 등 **기존 자료가 전부 "파일별 마지막 커밋일을 쓰라"고만 함.** 그런데 푸터 한 줄·애널리틱스 스니펫·연도 갱신 같은 전역 편집 한 번이면 전 파일 커밋일이 하루로 붕괴되고, 이건 Google이 "가짜"로 판정하는 바로 그 패턴(Illyes: 신뢰는 이분법 / Lumar: 날짜가 전부 같으면 틀린 걸로 간주). **이 실패 모드를 다룬 글이 없음 = 롱테일 공백.**
   - **1차 경험 자산**: 우리 repo에서 실측한 수치를 그대로 씀(75/80이 7/31 = 94%, 필터 적용 후 13개 날짜로 분산·최다일 28%). 남이 복제할 수 없는 데이터라 차별화 강도가 높음.
   - 헤드텀 "sitemap lastmod"는 seroundtable·digitalapplied·sitemapexplorer·lumar가 선점 → **의도적으로 "git commit date × static site × 날짜 균일화"라는 교집합만 노림.**
3. **`tools/sitemap-validator.html` 기능 신설 — lastmod 3종 검사.** 기존엔 형식(W3C 날짜)만 봤음. 추가한 것: (a) **전 URL 날짜 동일** 경고, (b) **80% 이상 한 날짜 클러스터** 경고, (c) **미래 날짜** 경고, (d) 일부만 lastmod 있음(부분 누락) 안내. 5개 미만이면 판정 안 함(작은 사이트는 하루에 만들었을 수 있으므로).
   - **경쟁 우위**: 경쟁 밸리데이터들은 스펙(스키마) 검사만 하고 이 휴리스틱은 없음. **스펙 위반이 아니면서 가장 손해가 큰 실패**를 잡아주는 게 차별점.
   - node로 9개 케이스 테스트 완료(전부동일/95%클러스터/자연분산/lastmod전무/부분누락/미래날짜/임계미만/ISO시간포함/형식오류). **우리 sitemap은 26%라 경고 안 뜸** 확인.
   - 신규 글 ↔ 밸리데이터 ↔ sitemap-static-sites가 상호 링크되어 클러스터를 이룸.
4. **sitemap.xml**: 신규 글 1건 추가(81개), 이번 세션 실제 콘텐츠 수정한 10개 파일만 lastmod를 2026-08-18로 갱신(27항 준수). 최다일 비율 26%로 균일성 문제 없음. llms.txt·blog/index·tools/index 동기화 완료.

**2026-08-11 세션 — 데이터 재확인 및 조치 사항**:

- **8/4 A~D 작업 완료 확인**: 커밋 로그로 A(rss-for-automation Zapier 트러블슈팅), B(llms-txt-generator llms-full.txt 섹션), C(meta-length-checker bulk 문구 강화), D(llms.txt 누락 2건) 전부 실행 완료 확인. E(n8n 제휴 신청)는 사용자 직접 실행 항목이라 상태 미확인 — **다음 세션에서 신청했는지 먼저 물어볼 것.**
- **전체 지표**: 클릭 7→**7 (증가 0)**, 노출 2092→2457(+17%), 노출 잡힌 페이지 47→52. CTR 0.33%→0.28%. 디바이스는 데스크톱 7/모바일 0/태블릿 0으로 **모바일 클릭 0 패턴 6개 스냅샷 연속.**
- **★ 가장 중요한 신호 — 클릭이 12일째 0건.** 일별 차트상 클릭 발생일은 7/3, 7/6, 7/9, 7/14, 7/22, 7/26, 7/27뿐이고 **7/28~8/8 사이 클릭이 단 한 건도 없음.** 노출은 같은 기간 계속 늘었으므로 "노출 증가 → 클릭 전환" 경로가 여전히 안 열려 있음. 8/4에 확립한 "죽은 노출" 기준이 다시 확인된 셈.
- **페이지별 변화**:
  - `blog/sitemap-static-sites.html`: 82→**107 노출(+30%)**, 순위 12.38→13.01, 클릭 1 유지. **2개 스냅샷 연속 노출 증가 — 7/27 보강 효과가 계속 유지되고 있는 유일한 사례.**
  - `tools/rss-generator.html`: 399→456(+14%), 클릭 3 유지, 순위 66.48.
  - `blog/rss-for-automation.html`: 120→122 노출, 순위 36.84→**36.48**. 8/4의 A 작업(Zapier 섹션) 반영 후 1주일 — 아직 유의미한 변화 없음, **다음 스냅샷까지 계속 관찰**(GSC 반영에 2~4주 걸리는 게 보통).
  - `tools/llms-txt-generator.html`: 45노출/47.96위로 8/4와 **완전히 동일한 수치** — B 작업 효과 아직 없음.
  - `tools/meta-length-checker.html`: 107노출/60.1위. 헤드 키워드 "bulk meta title and description checker"는 노출 2→4로 늘고 순위 13.5→16.25로 소폭 하락 — C 작업 효과 판단하기엔 이름.
  - `blog/free-alternative-screaming-frog.html` 768→781(0클릭, 63.32위), `blog/jwt-claims-explained.html` 220→**296**(+35%, 0클릭, 61.03위) — **투자중단 결정 유지가 옳았음을 재확인.** jwt-claims는 노출이 계속 크게 늘지만 클릭은 5개 스냅샷 연속 0.
- **순위 15~40위 구간(작업 가치 있는 구간) 갱신**:
  - **humans.txt 클러스터가 이번 스냅샷 최대 상승폭.** "humans txt generator" 19노출/35.05위 → **32노출/30.53위**(3개 스냅샷 연속 상승: 1→19→32). 담당 페이지 45노출/35.76위. **단 수익화 가치는 사실상 0인 키워드**(상업적 의도 없는 vanity 파일)라 이번 세션엔 콘텐츠 투자 안 함 — 순위만 계속 추적.
  - llms.txt 클러스터: "llms text generator" 18위, "llm.txt generator" 19.25위, "llms.txt generator" 35.43위, "free llms.txt generator" 36.25위. 여전히 사이트 최고 순위 축.
  - Zapier RSS 클러스터: "zapier rss" 15노출/29.33위 — 8/4와 완전 동일.
  - **신규 등장(소볼륨)**: "txt vs cname" 2노출/**38위**(담당 `blog/dns-records-explained.html` 11노출/33.91위), "url encode double quote" 2노출/**19위**, "encodeuri vs encodeuricomponent" 1노출/30위. 전부 볼륨이 한 자릿수라 단독 조치 대상은 아니지만, url-encoder 클러스터가 순위대는 좋다는 신호.
- **★ Coverage — 이번 스냅샷에서 처음으로 URL 목록이 나옴(중요)**: "발견됨 - 현재 색인 생성 안 됨" 19→**23페이지**, 전부 **최종 크롤링 1970-01-01 = 한 번도 크롤링된 적 없음**. 즉 **사이트 80페이지 중 29%가 구글에 아예 안 읽힌 상태.** 목록: about, privacy / blog 18개(batch-vs-ai-image-convert, check-og-tags-localhost-staging, csv-encoding-gibberish, csv-to-json-data-types, find-broken-links-free-tool, generic-og-image-problem, json-vs-yaml, og-image-vs-twitter-image, robots-llms-humans-txt-compared, robots-txt-vs-llms-txt, rss-generator-no-account, sitemap-priority-changefreq, sitemap-vs-robots-txt, static-vs-dynamic-og-images, static-vs-dynamic-qr-codes, why-merged-pdf-is-bigger, yaml-anchors-aliases) / **tools 4개(csv-tsv-converter, image-batch, pdf-merge-compress, sitemap-generator)**. "크롤링됨-미색인"은 `blog/upc-vs-ean-vs-code128.html` 1건(동일).
  - **내부링크 부족이 원인인지 직접 검증함 → 아님.** 파이썬으로 헤더/푸터 제외 본문 인바운드 링크를 전수 집계한 결과 미색인 23개 평균 2.3개 vs 색인된 57개 평균 2.89개로 **유의미한 차이 없음.** image-batch(인바운드 5), sitemap-generator(4)처럼 링크가 충분한 핵심 툴도 미색인 상태 → **고아 페이지 문제가 아니라 크롤 예산/도메인 권위 문제로 확정.**
  - **조치: sitemap.xml에 `<lastmod>` 전면 도입** — 아래 조치 항목 참고.
- **GA4(7/14~8/10)**: 활성 사용자 92명이지만 소스별로 (direct)/(none) 84명, 도시별 상위가 Council Bluffs 13 / Ashburn 3 / The Dalles 2 / Frankfurt 4 — **11번 25항 기준 그대로 봇 트래픽.** 실제 사람 트래픽은 google/organic 3명 + producthunt 3명 + twelve.tools 2명 = **8명 + 일부 direct**. 8/4의 "월 30~50명" 추정보다 오히려 더 낮게 봐야 함. 홈 이탈률 57%, 평균 참여시간 35초. **Busan 6명은 사용자 본인 트래픽으로 보임.**
- **수익화**: 클릭 7→7, 12일 연속 신규 클릭 0, RSS 자동화 클러스터 실클릭 0. **9-1-1 트래픽 조건 전부 미달 — 이 세션 이후로는 조건 충족 전까지 수익화 항목을 보고에 포함하지 않는다.**(8/11 사용자 지시)

**2026-08-11 세션 조치 내역 (실제 커밋한 것)**:

1. **`sitemap.xml` 전체 80개 URL에 `<lastmod>` 추가.** 근거: 구글 공식 문서상 lastmod는 **"이미 발견된 URL의 크롤링 일정을 잡는 신호"**로 실제 사용된다고 명시돼 있는데, 우리 사이트의 문제가 정확히 "발견은 됐는데 한 번도 크롤링 안 된 23페이지"임. 기존 sitemap엔 lastmod가 **아예 하나도 없었고**, 구글은 priority/changefreq는 무시하므로 **URL별 우선순위 신호가 사실상 0인 상태였음.**
   - **⚠️ 날짜 산출 방식이 핵심 — 그냥 git 최종 커밋일을 쓰면 안 됨.** 실제로 확인해보니 80개 중 76개가 `2026-07-31`로 동일했는데, 이건 pdf-merge-compress 추가 때 **푸터 링크 한 줄만 일괄 삽입한 커밋**이라 콘텐츠 변경이 아님. 이대로 넣으면 76페이지가 같은 날짜를 주장하는 가짜 신선도 신호가 되고, **부정확한 lastmod는 없느니만 못하다**(구글 Gary Illyes가 버그로 잘못된 날짜가 찍히는 사이트는 차라리 lastmod를 빼는 게 낫다고 공개적으로 답변한 사례 있음).
   - 그래서 파일별로 git 히스토리를 거슬러 올라가며 **"변경된 라인이 전부 푸터 링크 패턴이면 콘텐츠 변경이 아닌 것으로 보고 건너뛰는"** 스크립트로 진짜 콘텐츠 최종수정일을 산출함(`/home/claude/lastmod.py` 로직). 결과 7/07~8/11까지 **13개 날짜로 자연스럽게 분산**됨(7/20이 22개로 최다).
   - **앞으로 이 규칙을 유지할 것**: 콘텐츠를 실제로 고친 파일만 그 날짜로 lastmod 갱신, 푸터/링크 일괄치환은 lastmod 건드리지 말 것. 이 신뢰를 한 번 깨면 lastmod 신호 자체가 무효화됨.
   - 우리 자체 `sitemap-validator` 규칙(XML well-formed / 절대경로 / priority 0.0~1.0 / changefreq 7개값 / 중복 URL / 날짜형식)으로 재검증 통과, URL 80개 유지.
2. **`blog/rss-for-automation.html` — n8n RSS 트리거 트러블슈팅 섹션 + FAQ 2개 신설.** 근거: (a) 이 페이지가 순위 36.48위로 15~40위 작업 구간에 있고, (b) **9-1에서 유일하게 유효하다고 결론난 수익화 수단이 n8n 제휴**인데 repo 전체에서 n8n 언급이 이 파일 H2 제목 1회뿐이었음(중복 없음 확인), (c) 웹 검색 결과 n8n RSS 트리거 문제는 **2023~2026년 n8n 커뮤니티 산발 스레드와 개인 블로그 1건뿐**이고 정리된 가이드가 없음.
   - **핵심 발견(경쟁 회피 앵글)**: Zapier는 **guid/URL 기준**으로 중복을 판정하는데 **n8n RSS Feed Trigger는 아이템 타임스탬프를 마지막 폴링 시각과 비교**한다. 아이템별 처리 기록을 남기지 않으므로 (1) 백데이트된/날짜만 있는 pubDate는 조용히 스킵되고, (2) 폴링을 한 번 놓치면 그 구간 아이템은 영구 유실됨. **"같은 피드가 Zapier에선 되는데 n8n에선 아무 일도 안 일어난다"**는 현상이 여기서 나옴 — 이 대비 자체가 검색결과에 정리된 곳이 없는 롱테일 공백.
   - **우리 툴로 직결되는 지점(정직성 확인함)**: 우리 RSS Generator는 `Title | URL | 날짜`의 3번째 필드를 `new Date(...).toUTCString()`으로 변환하는데, `2026-08-11` 같은 날짜만 주면 **UTC 자정으로 고정**됨. 즉 14시에 발행한 글이 14시간 과거 타임스탬프를 달게 되고, 이게 **정확히 n8n이 버리는 형태**임. node로 실제 검증 완료.
3. **`tools/rss-generator.html` 보강 + 버그 1건 수정** (노출 456으로 사이트 1위 툴 페이지):
   - 3번째 필드가 **풀 ISO 타임스탬프도 받는다**는 사실을 Format reference와 입력 라벨에 명시(`2026-08-11T14:30:00Z`, `+09:00` 오프셋 전부 node로 동작 확인). 원래 되던 기능인데 문서에 없어서 아무도 몰랐던 케이스.
   - 기존 FAQ "Why does my feed reader show the wrong publish time?"를 **"보기용 문제"에서 "자동화가 아이템을 버리는 원인"으로 재작성**하고 rss-for-automation 글로 내부링크 추가.
   - **버그 수정**: 파싱 불가능한 날짜(오타 등)를 넣으면 `<pubDate>Invalid Date</pubDate>`가 그대로 출력돼 **RFC-822 위반 피드가 생성됨**을 테스트 중 발견. `isNaN(getTime())` 검사 후 현재 시각으로 폴백하도록 수정. 타임스탬프 입력을 권장하기 시작했으니 오타 확률이 올라가서 같이 처리함.
4. **`tools/llms-txt-generator.html` — 8/4에 쓴 경쟁사 서술 정정.** 8/4 분석의 "경쟁 생성기들이 llms-full.txt를 유료로 잠가둠"이라는 전제로 B 작업에서 "context.dev와 llmstxtgenerator.org가 llms-full.txt에 과금한다"고 **단정적으로 써놨는데, 이번 재조사에서 사실과 달라짐을 확인**(llmstxtgen.com·llmstxtgenerate.com이 llms.txt/llms-full.txt 둘 다 무료 제공, WordPress 플러그인도 존재, Mintlify·GitBook은 빌드마다 자동 생성). 특정 업체 이름을 빼고 "일부는 유료/이메일 수집으로 막고 일부는 무료로 준다, 페이지 수 상한을 확인하라"는 정확한 서술로 교체. **11번 16항(가치없는/부정확한 콘텐츠 금지) 적용 사례 — 경쟁사 가격정책처럼 빨리 바뀌는 사실은 단정적으로 쓰지 말 것.**

**2026-08-11 세션 — 신규 툴 후보 검토 결과 (12차, 3개 전량 기각)**: 5번 12차 참고.

**2026-08-04 세션 — 데이터 재확인 및 분석 결과 (파일 수정 없음, Sonnet 작업 지시로 이관)**:

- **전체 지표**: 총 클릭 5→7(+2), 노출 1649→2092(+27%, "지난 3개월" 누적). 노출 잡힌 페이지 35→47개. 디바이스별 클릭은 **데스크톱 7 / 모바일 0 / 태블릿 0** — 전 스냅샷 통틀어 모바일 클릭 0건 패턴이 계속 유지됨(모바일 노출 자체가 115건뿐, 전체의 5.5%).
- **사이트 전체 CTR 0.33%, 평균 게재순위 57.98위.** 이 두 숫자가 이번 분석의 핵심: 노출은 늘고 있지만 **노출의 대부분이 6페이지 이후에 찍히는 "죽은 노출"**이라 클릭으로 전환될 구조가 아님.
- **페이지별 변화**:
  - `tools/rss-generator.html`: 361→399(+11%), **클릭 2→3으로 처음 증가.** "rss generator free"가 4노출/1클릭(CTR 25%), "rss feed generator"가 18노출/1클릭.
  - `blog/sitemap-static-sites.html`: 51→82 노출(**+61%**), 클릭 1 유지, 순위 12.49→12.38. **7/27 세션의 GitHub Pages/.nojekyll 보강이 실제로 노출을 끌어올린 것이 확인됨** — "신호 잡힌 기존 페이지 보강" 원칙이 처음으로 수치로 검증된 사례.
  - `tools/csv-to-json.html`: **이번 스냅샷에서 처음 클릭 발생** (11노출/1클릭, CTR 9.09%, 순위 19.91).
  - 홈페이지: 105노출/2클릭, 순위 8.22 유지.
  - `blog/free-alternative-screaming-frog.html`: 666→768(+15%), **클릭 여전히 0(5개 스냅샷 연속)**, 순위 63.71.
  - `blog/jwt-claims-explained.html`: 194→220(+13%), **클릭 여전히 0(4개 스냅샷 연속)**, 순위 59.46. 7/16 보강 이후 순위 개선 없음 — **보강으로는 안 풀리는 케이스로 결론.**
  - 7/25 신규 툴 3개는 드디어 노출이 잡히기 시작했으나 미미 (json-schema-validator 1 / og-card-checker 2 / og-image-generator 2). 7/31 추가한 pdf-merge-compress는 아직 노출 0(GSC 반영 전, 정상).
- **★ 이번 세션에서 확립된 판단 기준 — "죽은 노출" 구분**: screaming-frog(768) + jwt-claims(220) = **988노출 = 전체의 47%인데 3개월간 클릭 0건.** 반대로 실제 클릭이 난 페이지는 전부 순위 20위 이내(홈 8.22 / sitemap-static-sites 12.38 / csv-to-json 19.91)였음. **결론: 순위 60~90위대 노출은 아무리 늘어도 수익에 기여하지 않는다. 앞으로 작업 대상은 "이미 순위 15~40위 구간에 있는 페이지/클러스터"로 한정하고, 60위 이후 클러스터에는 추가 콘텐츠를 투자하지 않는다.** (screaming-frog / jwt-claims 두 클러스터는 이 기준으로 **투자 중단** 확정 — 백링크·도메인 권위가 붙기 전엔 무슨 콘텐츠를 얹어도 안 움직인다는 게 5회 스냅샷으로 재확인됨.)
- **순위 15~40위 구간(=작업 가치 있는 구간) 클러스터 목록**:
  - **Zapier RSS 클러스터 — 순위 28~31위, 사이트에서 홈 다음으로 좋은 상업적 위치.** "zapier rss"(15노출, 29.33위), "rss zapier"(5, 29.8), "rss by zapier"(3, 31.33), "zapier rss trigger documentation"(1, 28), "rss feed automation"(3, 53), "how does rss by zapier work"(4, 69), "rss integrations"(4, 61). 담당 페이지 `blog/rss-for-automation.html`은 120노출/36.84위.
  - **llms.txt 클러스터 — 단수형/오타 변형이 사이트 최고 순위.** "llms text generator"(3노출, **18위**), "llm.txt generator"(4, **19.25위**), "llm txt generator"(1, 19), "free llms.txt generator"(4, 36.25), "llms txt generator"(5, 44). 헤드 "llms generator"(12노출)는 74.83위. 담당 페이지 45노출/47.96위.
  - **humans.txt** — "humans txt generator" 19노출/35.05위 (7/20 스냅샷 1노출 → 19노출로 확대). 담당 페이지 28노출/39.43위.
  - **"bulk meta title and description checker" 2노출 / 순위 13.5** — 상업성 키워드 중 사이트 최고 순위. 같은 클러스터의 "bulk" 없는 변형들은 전부 60~70위대("meta description length checker" 40노출/64.08위 등). **"bulk" 수식어가 붙는 순간 2페이지로 올라온다 = 우리 배치 차별화가 검색엔진에도 실제로 먹히고 있다는 첫 직접 증거.**
- **웹검색으로 확인한 콘텐츠 공백 (중복체크 완료)**:
  - **Zapier RSS 트러블슈팅**: 검색 상위가 전부 Zapier 커뮤니티 포럼의 산발적 스레드(2021~2023년)와 얇은 공식 헬프문서뿐. "왜 내 RSS Zap이 안 걸리는지"를 피드 구조 관점에서 정리한 글이 없음. 확인된 실제 실패 원인: (1) `RSS by Zapier`의 기본 중복판정이 **Different Guid/URL** 이라 `<guid>`가 없거나 매 빌드마다 바뀌면 트리거가 아예 안 걸리거나 중복 발화, (2) 폴링 트리거라 플랜에 따라 **1~15분 지연**(즉시 아님 — 사용자들이 "고장났다"고 오해하는 1순위 원인), (3) 피드를 잘못된 Content-Type으로 서빙하면 `Not Acceptable` 에러(Zapier는 `text/xml, application/xml, application/rss+xml, application/atom+xml`로 Accept 헤더를 보냄), (4) 100개 이상 아이템이면 flood protection 발동. **이 실패 원인들이 전부 "피드를 어떻게 만들었나"에 달려 있어서 우리 RSS Generator로 직결됨.** repo 중복체크: `zapier` 언급은 `blog/rss-for-automation.html`(H2 1개, 4회)와 `tools/rss-generator.html`뿐 — 전용 콘텐츠 없음.
  - **llms.txt 신규 사실 2건(우리 글에 없음)**: (a) 2026년 5월 Google이 **Chrome Lighthouse의 Agentic Browsing 감사 항목에 llms.txt를 추가**함 — 다만 Google이 랭킹 신호로 쓴다고 공식 확인한 적은 여전히 없음, (b) 업계 측정치상 **AI 에이전트가 `llms-full.txt`를 `llms.txt`보다 2배 이상 자주 가져감.** 경쟁 생성기들(context.dev, Firecrawl, llmstxtgenerator.org 등)은 llms.txt는 무료로 주고 **llms-full.txt를 유료($1~$9~)로 잠가둠** — 우리는 이 파일을 만들지 않으므로 "왜 안 만드는가 + 직접 만드는 법"을 정직하게 설명하는 게 오히려 차별화 지점.
  - **기각한 후보**: "screaming frog free / free license / 500 urls" 계열(합산 약 65노출) — 검색 상위가 Screaming Frog 공식 가격 페이지 + 리뷰 사이트로 꽉 차 있고, 무엇보다 **우리 site-crawler는 40페이지 한도라 "무료로 500개 넘게 크롤하는 법"을 우리 툴로 답할 수 없음.** 억지로 쓰면 명백한 과장 광고가 되므로 만들지 않음(11번 16항). "url length checker"(13노출/62.62위) — 신규 툴로 뽑기엔 볼륨이 너무 작아 기각, 단 meta-length-checker에 기능 흡수하는 선택지는 열어둠(우선순위 낮음).
- **Coverage**: "발견됨-미색인" 17→**19페이지**(페이지를 78→80개로 늘렸으니 사실상 비례 증가, 12번에서 경고선으로 잡아둔 30개까지는 여유 있음), "크롤링됨-미색인" 1건(동일), "리디렉션 포함 페이지" 3건(동일), "적절한 표준 태그 대체 페이지" 1→**4건**(정상적인 canonical 동작 분류일 뿐 오류 아님, 조치 불필요).
- **⚠️ GA4 데이터 해석 주의 (신규 발견, 앞으로 계속 적용할 것)**: GA4는 7/7~8/3 활성 사용자 109명으로 보고하지만, **소스별로 보면 (direct)/(none)이 100명**이고 도시별 상위가 **Council Bluffs 19 / Ashburn 4 / Frankfurt 4 / The Dalles 2** — 전부 Google·AWS 데이터센터 소재지, 즉 봇/크롤러 트래픽. **google/organic은 사용자 4명·세션 6건, producthunt.com 리퍼럴 3명, twelve.tools 2명이 전부.** 실제 사람 트래픽은 월 30~50명 수준으로 봐야 하며, **앞으로 광고사/제휴사에 트래픽을 보고할 때 GA4의 109라는 숫자를 그대로 쓰지 말 것**(실사 시 즉시 드러나고 신뢰를 잃음). 홈페이지 이탈률 61%, 활성 사용자당 평균 참여시간 39초.
- **AdSense 신청 타이밍 능동 체크**: 클릭 5→7. 3개월 누적 7클릭 = **일평균 0.08클릭**으로 "일일 두 자릿수" 기준과는 두 자릿수 배율로 차이. **여전히 명확히 시기상조, 신청 제안 안 함.** 다만 이번 세션에 AdSense 비의존 방침이 확정됐으므로 판단 축이 바뀜 — 9번 참고.

**2026-07-27 세션 — 데이터 재확인 및 조치 사항**:

- **전체 지표**: 총 클릭 4→5(+1), 노출 1111→1649(+48%, "지난 3개월" 필터 기준 누적치). 노출 잡힌 페이지 수도 22→35로 늘어남 — 7/25 세션에 추가한 신규 툴 3개(json-schema-validator/og-card-checker/og-image-generator)는 **이번 스냅샷에도 여전히 노출 0건**(계속 관찰 대상, 아직 결론 내리기엔 이름). 클릭 디바이스는 데스크톱 5/모바일 0/태블릿 0 — 지금까지 전 스냅샷에서 모바일 클릭이 단 한 번도 없었던 패턴 계속 유지.
- **페이지별 핵심 변화**:
  - `rss-generator.html`: 노출 276→361(+31%), 클릭 2 유지 — 5번째 스냅샷째 "노출은 늘고 클릭은 고정" 패턴 재확인.
  - `free-alternative-screaming-frog.html`: 노출 477→666(+40%), 클릭 여전히 0.
  - `jwt-claims-explained.html`: 노출 149→194(+30%), 클릭 여전히 0.
  - **(신규 신호) `blog/sitemap-static-sites.html`: 이번 스냅샷에서 처음으로 클릭 1건 발생 (노출 51, 순위 12.49위).** 순위 자체는 이전부터 좋았을 가능성이 높지만(과거 스냅샷에 페이지 단위 순위 기록이 없어 정확한 이전 값 확인은 불가), 실제 클릭 전환이 잡힌 건 이번이 처음. 홈페이지(`/`)도 클릭 2건·노출 96건·순위 8.34위로 꾸준히 좋은 위치 유지.
  - `debug-jwt-base64-locally.html`(순위 6.88), `csv-to-json.html`(9.86), `robots-txt-generator.html`(6), `site-crawler.html`(4), `contact.html`(7) 등은 이미 1페이지급 순위인데 노출 자체가 한 자릿수~십수 수준 — 콘텐츠 문제가 아니라 순수 검색량(볼륨) 한계로 판단, 추가 조치 불필요.
- **조치**: 신규 클릭이 실제로 잡힌 유일한 페이지(`sitemap-static-sites.html`)를 "신호가 확실히 잡힌 기존 페이지 우선 보강" 원칙(3번 다음할일)에 따라 보강. 웹 검색으로 "github pages sitemap.xml 404", ".nojekyll" 관련 실제 사용자 사례(GitHub Discussions, dev.to, Vercel 커뮤니티 다수)를 확인한 결과, **GitHub Pages가 기본적으로 Jekyll 빌드를 거치면서 언더스코어 폴더/일부 dotfile을 누락시켜 sitemap.xml이 리포에는 있는데 배포본엔 없는 채로 404가 나는 매우 흔한 문제**이고, 이 원인을 짚어주는 정리된 가이드보다 산발적인 GitHub 이슈 스레드가 검색 결과 상위를 차지하고 있어 콘텐츠 공백이 있음을 확인 — 원본 문제해결형 섹션(원인 설명 + `.nojekyll` 해법 + 커스텀 도메인 오진단 방지 팁 + Netlify/Vercel의 대응 원인인 배포 디렉토리 불일치)과 FAQ 4개를 신설. 기존 파일 내 중복 여부는 `grep -ril "jekyll\|nojekyll"` 및 `"404"` 검색으로 사전 확인(0건, 중복 없음). 신규 툴/블로그 파일은 만들지 않음 — 기존 페이지 보강이 신규 페이지 분산보다 낫다는 기존 원칙 적용.
- **검토했으나 기각한 신규 후보**: (1) "url length checker"/"title length checker"/"meta description count" 계열(합산 노출 10 미만) — 볼륨 자체가 너무 작아 신규 콘텐츠 투자 대비 기대값 낮음, 보류. (2) "bulk domain ip checker"/"dns bulk lookup tool" 계열 — 7/18 세션에서 이미 "경쟁사 8곳 이상 배치 지원, 배치 차별화 불가"로 기각된 사안과 노출량(십수 건) 모두 그대로라 재검토 실익 없어 스킵. (3) "seo spider tool free"(8노출, 순위 84.88) — screaming-frog 클러스터와 동일한 순위/권위 문제로 판단, 별도 조치 없음.
- **Coverage**: "발견됨-미색인" 17페이지, "크롤링됨-미색인" 1건, "리디렉션 포함 페이지" 3건, "적절한 표준 태그 대체 페이지" 1건 — **전부 7/16 스냅샷 이후 완전히 동일값으로 4개 스냅샷 연속 고정.** 페이지를 계속 늘려왔음에도(69→78개) 이 숫자들이 늘지 않았다는 건 긍정적 신호 — 새로 색인 문제가 쌓이고 있진 않음.
- **AdSense 신청 타이밍 능동 체크**: 클릭 4→5로 미세 증가했으나 "일일 두 자릿수" 기준과는 여전히 거리가 큼, 순위 30위권 페이지도 홈/일부 롱테일 소수에 그침 — **여전히 명확히 시기상조, 신청 제안 안 함.**

**2026-07-20 세션 — 데이터 재확인 및 조치 사항**:

- **전체 지표**: 총 클릭 4건으로 7/18과 동일 — 신규 클릭 발생 없음. 노출은 1149→1111로 소폭 하락했지만 GSC 원본 일별 데이터가 7/17까지만 채워져 있어(2~3일 처리 지연은 정상) 실제 하락이라기보다 아직 집계 안 된 최근 며칠분 차이로 판단, 유의미한 추세 변화 아님.
- **페이지별**: `rss-generator.html` 271→276(+2%, 클릭 2 유지), `free-alternative-screaming-frog.html` 452→477(+5.5%, 클릭 여전히 0), `jwt-claims-explained.html` 142→149(+5%, 클릭 여전히 0). 셋 다 완만한 노출 증가 + 클릭 정체라는 기존 패턴 네 번째 스냅샷째 재확인 — **콘텐츠 문제가 아니라 백링크/도메인 권위 문제라는 결론 그대로 유지, 추가 콘텐츠 조치 안 함.**
- **Coverage**: "발견됨-미색인" 17페이지로 완전히 그대로(7/16부터 4개 스냅샷 연속 17로 고정 — 늘지도 줄지도 않음), "리디렉션 포함 페이지" 3건 그대로, "적절한 표준 태그 대체 페이지" 1건 그대로(정상 동작, 오류 아님). **신규 색인 문제 없음.**
- **새 키워드 신호 — "humans txt generator"(1노출)**: 이번 세션 신규 등장. 웹 검색으로 경쟁강도 확인 후 Humans.txt Generator 신규 채택(5번 9차 참고) — robots.txt/llms.txt Generator와 "사이트 루트 3종 파일" 클러스터를 완성하는 전략적 가치가 볼륨보다 큰 판단 근거.
- **고아 페이지 내부링크**: 1-3번 다음할일로 남아있던 잔여 23개(실측 25개) 전량 해소 — 7번 참고.
- **AdSense 신청 타이밍 능동 체크**: 클릭 여전히 4건 정체(3세션 연속 사실상 변화 없음), 순위도 대부분 50~90위권 그대로 — **여전히 명확히 시기상조, 신청 제안 안 함.** 다음 신호가 나올 때까지(일일 클릭 두 자릿수대 또는 페이지 다수가 30위권 진입) 계속 관찰.

**2026-07-18 세션 — 데이터 재확인 및 조치 사항**:

- 페이지별 노출 재확인: `rss-generator.html` 184→271(+47%, 클릭 2 유지), `free-alternative-screaming-frog.html` 348→452(+30%, 클릭 여전히 0), `jwt-claims-explained.html` ~116→142(+22%, 클릭 여전히 0, 7/16 보강 이후 첫 추적 — 다음 스냅샷도 계속 볼 것). 국가별로는 미국(329)·브라질(25)·필리핀(20)·핀란드(1, CTR100%=브랜드성 검색으로 추정) 순으로 클릭 발생, 디바이스는 데스크톱에서만 클릭 발생(모바일 0/47).
- Coverage: "발견됨-미색인" 17페이지로 안정(7/16과 동일, 더 안 늘어남 — 긍정적), "리디렉션 포함 페이지" 3건 그대로. 신규 항목 "적절한 표준 태그가 포함된 대체 페이지" 1건 발견 — 이건 정상적인 canonical 태그 동작을 Google이 분류해놓은 것뿐이라 오류 아님, 조치 불필요.
- **웹 검색으로 RSS 클러스터 경쟁구도 재확인**: "rss feed generator/creator/builder/maker" 계열 검색 결과 상위(RSS.app, FetchRSS, FeedSpot RSS Builder, mysitemapgenerator 등)가 전부 "URL 입력→서버가 그 페이지를 스크래핑해서 피드 생성" 방식이었음. 우리 툴은 반대로 "이미 아는 항목 리스트를 직접 입력→피드 생성"이라 이 헤드 키워드들의 실제 검색 의도(스크래핑)와 구조적으로 안 맞는 트래픽이 많이 섞여 있던 것으로 확인됨 — 헤드 키워드로 경쟁해봐야 의도 불일치로 클릭 전환이 안 나오는 구조. **조치**: 헤드 키워드를 더 파려 하지 않고, "generator/creator/builder/maker 용어별로 방식이 다르다"는 것 자체를 설명하는 비교 섹션을 `tools/rss-generator.html`에 신설(문제해결형 콘텐츠) — 자연스럽게 롱테일 동의어(creator/builder/maker)를 본문에 포함시키면서 동시에 우리 툴에 실제로 맞는 트래픽만 걸러 받도록 유도. "static html rss feed no cms" 계열 검색에서도 경쟁이 회원가입 필요한 위젯 서비스 위주라 무료/노가입 포지셔닝이 여전히 유효함을 재확인.
- **IP/DNS/SSL 클러스터에서 신규 롱테일 발견**: "bulk website ip checker"(5회), "dns bulk lookup tool"(4회), "bulk domain ip checker"(1회), "bulk nameserver lookup"(1회) 등 "bulk" 명시 검색어가 처음 등장. 다만 웹 검색으로 "bulk dns lookup" 경쟁강도 확인한 결과 — 이 니치는 SVG Optimizer/Heading Checker/Sitemap Validator 패턴과 다르게 **경쟁사가 이미 8곳 이상 대부분 벌크(50~100개 동시) 기능을 갖추고 있어 "우리만 배치 가능" 차별화가 안 먹히는 니치**임을 확인함 — 볼륨도 작아서(총 12노출) 신규 콘텐츠 투자 대비 기대 수익이 낮다고 판단, 신규 글은 만들지 않음. 대신 `tools/ip-dns-ssl.html`에 실제 콘텐츠 공백이던 NS 레코드 설명 섹션(A/AAAA/MX/TXT는 각각 있었는데 NS만 없었음)을 추가하고, "몇 개까지 한번에 되나요" FAQ를 신설 — 콘텐츠 품질 개선 차원, 순위 견인 목적이 아님을 명확히 구분해서 진행.
- **llms.txt 클러스터**: "llm.txt generator"(단수형, 오타성 검색) 노출 자체는 적지만(2회) 순위가 19위로 사이트 전체에서 가장 좋은 순위 축에 속함. 오타/용어 혼동을 짚어주는 FAQ("llm.txt인가 llms.txt인가")를 짧게 추가 — 볼륨이 작아 큰 기대는 안 하지만 비용이 거의 안 드는 보강이라 진행.
- **신규 발견 — 비영어권 수요**: "alternativer/alternativ(er) til/zu screaming frog" 계열(노르웨이어/덴마크어/독일어 표기 다수) 검색어를 합치면 80회 이상 노출로, 영어 "screaming frog alternative"(257회) 다음가는 규모. 국가별 데이터에서도 노르웨이(70)·독일(62)·네덜란드(56) 노출이 미국 다음으로 큼 — 전부 영어 전용인 `free-alternative-screaming-frog.html` 글이 이 언어권 검색에도 노출은 되지만 당연히 전환이 안 됨(0클릭). **이번 세션에서는 조치 안 함** — 다국어 페이지 신설은 단순 보강이 아니라 사이트 구조를 새로 여는 수준의 큰 작업이라, 11번 원칙(큰 작업은 리스트 정리 후 확인받고 진행)에 따라 이번엔 발견 사실만 기록하고 사용자 판단을 기다림. 진행하게 되면 hreflang 처리, 번역 품질, 유지보수 부담까지 같이 결정 필요.
- **screaming-frog / jwt-claims 재확인 결과**: 둘 다 콘텐츠 보강 여지보다 순위(각각 60~66위권, 60~87위권) 자체가 문제 — 이미 여러 세션에서 같은 결론 재확인됐으므로 이번엔 추가 조치 안 함(jwt-claims는 7/16에 이미 보강 완료, 다음 스냅샷까지 관찰).

**핵심 신호 (계속 유지/신규, 7/16 이전 기록)**:
1. `tools/rss-generator.html` — 노출 75→108→117→120→184로 꾸준히 증가, 클릭 2 유지. "rss feed generator" 단일 쿼리가 CTR 10%(!) 기록. RSS 관련 롱테일 쿼리가 40개 이상으로 매우 다양하게 확산 중(rss feed creator/maker/builder/tool 등) — 사이트에서 실제 클릭 전환이 가장 꾸준한 클러스터.
2. `blog/free-alternative-screaming-frog.html` — 노출 28→99→179→215→348 (2026-07-13→16 사흘 새 +62%). "screaming frog alternative" 단일 쿼리만 195노출. 순위는 여전히 60~66위권, 클릭 0 — 노출 계속 늘어도 전환 안 되는 패턴 세 번째 스냅샷째 재확인.
3. **(신규 발견, 2026-07-16)** `blog/jwt-claims-explained.html` — 노출이 갑자기 116으로 폭증(직전 스냅샷 대비 거의 0에서 급증). "jwt claims", "jwt jti", "jti claim", "jwt sub" 등 JWT 개별 claim명을 겨냥한 매우 구체적인 롱테일 쿼리 80개 이상 발견. 특히 "jwt private claims", "jwt public claims", "jwt registered claims", "jwt reserved claims" 같은 RFC 7519 공식 용어 쿼리가 있었는데, 기존 글엔 이 3분류 용어("registered/public/private claims")가 명시적으로 없었음 → **보강 완료** (아래 참고).

**2026-07-16 분석 및 조치**:
- JWT claims 클러스터에 대해 완전 신규 글도 검토했으나, 웹 검색 결과 Auth0·jwt.io 같은 공식 사이트뿐 아니라 우리와 똑같은 전략(툴+claims 레퍼런스 블로그)을 쓰는 경쟁 사이트(jsonic.io, wildandfreetools.com, jwtauditor.com, ikit.app, datatoolings.com 등)까지 이미 빽빽하게 있어 신규 글은 실익 없음 → **신규 대신 보강으로 결정.**
- `blog/jwt-claims-explained.html`을 보강: RFC 7519의 "Registered / Public / Private claims" 3분류를 명시적으로 설명하는 섹션 신설, 각 카테고리별 실제 예시 재배치, FAQ 3개 추가("reserved vs registered 차이", "registered claim이 필수인지", "sub를 커스텀 의미로 써도 되는지"). title/description/H1도 이 용어를 반영해서 갱신. 사이트 전체에서 이 글을 참조하는 다른 위치(index.html 카드, blog/index.html 카드, llms.txt)도 전부 새 제목으로 일괄 갱신. 글 분량 500→1157단어로 확대.
- Coverage(색인) 리포트에 **"발견됨 - 현재 색인이 생성되지 않음" 17페이지**가 새로 잡힘 — 최근 세션들에서 페이지를 빠르게 늘린 것(32→51)이 원인으로 보임. Google이 사이트를 발견은 했지만 아직 크롤링 우선순위를 안 준 상태로, 신생/저권위 도메인에서 흔한 패턴. 별도 조치 불필요, 시간이 지나면 자연히 해소될 것으로 판단하고 지켜보는 중. "크롤링됨-미색인" 1건은 유효성 검사가 "시작됨"→"실패함"으로 바뀜(주시 필요하지만 URL 미특정이라 조치 불가, 다음 스냅샷에서 계속 확인할 것). "리디렉션 포함 페이지"는 1→3건으로 증가(원인 미상, URL 특정 안 됨).
- QR/IP-DNS 클러스터는 여전히 미미한 수준(각 노출 한 자릿수~십수), 롱테일 다양성만 소폭 증가. 조치 안 함.
- "efdetools" 외 "ftudev", "toolfordev" 등 브랜드-유사 오탐 쿼리 계속 소량 발생 — 전부 무관한 노이즈로 판단, 무시.

**결론**: rss-generator·screaming-frog 두 클러스터는 계속 같은 패턴(콘텐츠 문제 아님, 백링크/권위 문제) 재확인. jwt-claims-explained는 이번에 새로 발견된 신호라 보강까지 실행함 — 다음 스냅샷에서 이 보강이 실제 순위/클릭에 영향 있었는지 추적할 것.

**작업 사이클**: 사용자가 그때그때(거의 매일) GA/Search Console 데이터를 zip으로 업로드하면, 이전 스냅샷과 비교해서 변화율 중심으로 분석 → 신규/보강 필요 여부를 (1)기존 파일 중복 체크 (2)웹 검색 키워드 경쟁강도 확인 두 단계를 거쳐 판단. **아무것도 필요 없으면 "없다"고 명확히 보고하고 억지로 작업 만들지 말 것.** 반대로 신호가 있으면(예: 특정 페이지 노출 급증) 웹 검색으로 경쟁강도까지 확인한 뒤 신규보다 기존 페이지 보강이 나은지 먼저 판단할 것 — 이미 순위가 어느 정도 잡힌 페이지를 보강하는 게 신규 글로 쿼리를 분산시키는 것보다 유리한 경우가 많음(2026-07-16 세션에서 확인).

---

## 9. 수익화 진행상황

### 9-0. ★ 수익화 기본 방침 (2026-08-04 사용자 지시로 확정 — 이후 세션 전부 이 방침을 따를 것)

1. **우리는 Google AdSense에 의존하지 않는다.** AdSense는 여러 선택지 중 하나일 뿐이며, 다른 제휴/광고사가 더 이득이면 그쪽을 택한다.
2. **수익화가 되는 것이면 종류를 가리지 않고 전부 검토·적용한다.** 제휴 링크, 스폰서, 개발자 특화 광고 네트워크, 후원(GitHub Sponsors 등) 무엇이든 포함.
3. **AdSense는 게재 탈락(거절) 시 재심사를 넣을지 말지를 Opus가 판단한다.** 사용자에게 매번 물어보지 말고, 거절 사유·재신청 대기기간·그 시점의 트래픽을 종합해서 "재심사 넣자 / 넣지 말자"를 Opus가 결론 내서 보고할 것. **다른 제휴사·광고사도 동일** — 거절당했을 때 재신청 타이밍은 Opus가 판단한다.
4. **AdSense보다 다른 제휴/광고가 이득이라고 판단되면, 그 방향을 사용자에게 먼저 추천할 것.** 사용자가 물어보길 기다리지 말 것.
5. 판단 근거는 항상 숫자로 제시할 것(예상 CPM/전환당 단가 × 실제 트래픽). "이게 더 좋아 보인다" 식의 감각적 추천 금지.

### 9-1. 현재 시점(2026-08-04) 수단별 실사 결과

| 수단 | 진입 요건 | 우리 현황 대비 | 판단 |
|---|---|---|---|
| **n8n 제휴** | 공개 신청, 트래픽 최소 요건 없음. n8n Cloud 유료 전환의 **30% / 첫 1년**, 월 €100 이상부터 PayPal 지급 | 전환 1건당 단가는 €70~180로 높지만, **전환의 분모가 되는 트래픽이 없음** — RSS/자동화 클러스터 실클릭 0건(순위 36위, 3개월 노출 122·클릭 0) | **보류. 트래픽 조건 충족 전까지 언급 금지 — 아래 9-1-1 참고** |
| **Make.com 제휴** | 신청 가능하나 **$100 누적 + 유료 전환 3명**을 채워야 지급 요청 가능 | 전환 3명은 현 트래픽에서 비현실적 | 보류 (n8n 먼저) |
| **Zapier 제휴** | **일반 콘텐츠 제작자용 공개 제휴 프로그램 없음.** Solution Partner(자동화 컨설팅 업체) 대상 리퍼럴만 존재 | 해당 없음 | **불가 — 다음 세션에서 다시 알아보지 말 것** |
| **EthicalAds** (개발자 특화, 비추적 광고) | 월 **5만 페이지뷰** 수준 + 기술 독자층, 수익배분 70%, CPM 약 $2.5, 최소 지급 $50 | 우리 월 페이지뷰 약 200 — **250배 부족** | 신청 무의미. 다만 **장기 목표로는 우리 사이트 성격에 가장 잘 맞는 네트워크**이므로 트래픽 목표치를 "월 5만 PV"로 잡아둘 것 |
| **Carbon Ads** | 초대 기반, 트래픽 요건 더 높음 | 해당 없음 | 장기 |
| **Google AdSense** | 명시적 트래픽 하한 없음(승인 자체는 가능성 있음) | 현 트래픽에서 예상 수익 **월 $0~1 수준** | **신청 보류 유지.** 승인 여부와 무관하게 수익이 사실상 0이라, 지금 신청해서 얻는 것보다 거절 시 재신청 대기기간 리스크가 큼 |

**핵심 판단 (2026-08-11 사용자 지시로 개정)**: 현 트래픽에서는 **어떤 광고 네트워크도, 어떤 제휴도 수익이 0에 수렴한다.** 제휴는 전환 1건당 단가가 높아도 **전환의 분모가 되는 실클릭이 없으면 기대값이 그냥 0**이다. 8/11 기준 RSS/자동화 클러스터는 3개월 노출 122건·**클릭 0건**, 사이트 전체 클릭도 12일 연속 0건이다. 이 상태에서 제휴 신청은 수익 액션이 아니라 리소스 낭비이고, 거절당하면 재신청 대기기간만 생긴다.

**따라서 이번 국면의 수익화 액션은 수익화 수단을 고르는 게 아니라, 순위 15~40위 구간 페이지를 1페이지로 밀어올려서 실클릭을 만드는 것 하나뿐이다.** 클릭이 곧 모든 수익 수단의 분모다.

### 9-1-1. ★★ 제휴/광고 언급 금지 조건 (2026-08-11 사용자 지시 — 반드시 지킬 것)

**아래 트래픽 조건을 실제 GSC 데이터로 충족하기 전까지, 제휴·광고·수익화 수단을 세션 보고나 "다음 할 일"에 올리지 말 것.** 사용자가 먼저 물어보면 그때만 답한다.

| 수단 | 언급 해금 조건 (GSC 실측 기준) |
|---|---|
| **n8n 제휴** | `blog/rss-for-automation.html` 또는 RSS 자동화 클러스터에서 **월 실클릭 20건 이상**이 2개 스냅샷 연속 유지될 때 |
| **AdSense / 일반 광고** | 사이트 전체 **일평균 클릭 두 자릿수** (기존 기준 유지) |
| **EthicalAds / Carbon** | 월 5만 PV (현재 약 200PV, 250배 부족) |

**이 규칙이 생긴 이유**: 8/4에 "n8n 지금 신청 권장"으로 표에 박아놓은 뒤로 세션마다 그 문장이 그대로 재생산돼서, **클릭 0건인 데이터를 직접 뽑아놓고도 결론에서 제휴를 최우선으로 올리는 모순**이 반복됐음(8/11 세션에서 사용자가 강하게 지적). 9-0의 4항("제휴가 이득이면 먼저 추천할 것")은 **트래픽 조건을 충족했을 때만 발동하는 것으로 해석할 것** — 조건 미달 상태에서의 선제 추천은 지시 위반이다.

**세션 보고에 쓸 표현**: 조건 미달이면 수익화 항목 자체를 빼고 보고한다. "아직 시기상조" 같은 문장조차 쓰지 말 것 — 그것도 결국 매 세션 제휴 얘기를 꺼내는 것이다.

**제휴 링크 배치 원칙**: 문맥상 진짜로 도움이 되는 자리에만 넣는다(예: "폴링 주기를 직접 제어하고 싶다면 셀프호스팅 n8n"). 툴 페이지 상단이나 관계없는 블로그에 배너처럼 붙이지 말 것 — 사이트의 "no-upload / 계정 불필요" 신뢰 포지셔닝이 수익 자체보다 자산 가치가 크다. `rel="sponsored"` 속성을 반드시 붙일 것.

### 9-2. 기존 기록

- **AdSense**: 아직 미신청. Privacy/About/Contact 페이지는 이미 준비됨(요건 충족). **(2026-07-11 세션 확정 방향)** 트래픽/클릭이 붙기 전까지는 "유니크한 툴 아이디어 찾기"보다 "페이지 총량 확보"가 우선순위라고 사용자가 방향을 명확히 함 — 신규 툴 검토 시 포화 여부만으로 기각하지 말고, 브랜드 적합성/제작 난이도/기존 사용자층과의 시너지를 함께 볼 것.
  - **(2026-07-13 세션, 신청 타이밍 원칙 확정)** 콘텐츠 품질은 문제없음 — 매 글 500~700단어대(실측 확인함), 문제해결 구조(왜 생기는지→어떻게 진단하는지→어떻게 고치는지)로 매번 원본으로 작성 중이라 "가치없는 콘텐츠"로 분류될 요소 없음. **신청을 미루는 이유는 콘텐츠가 아니라 순수 트래픽 문제.** 지금(2026-07-13 기준) GSC 총 클릭 3건 — 이 상태로 신청하면 심사관이 판단할 데이터 자체가 없어서 보류/거절 확률이 높고, 재신청 대기기간이 생기는 게 더 손해. 과거 제휴(Vercel 등) 신청도 트래픽 부족으로 거절된 전례 있음(10번 참고). **Claude는 매 세션 GSC/GA 데이터를 볼 때마다 "지금 신청해도 될 만한 타이밍인가"를 판단해서, 됐다고 판단되면 먼저 "지금 신청하세요"라고 사용자에게 제안할 것.** 사용자가 판단해서 물어보길 기다리지 말 것 — 이건 Claude가 데이터 보고 능동적으로 챙겨야 하는 항목. 참고할 만한 신호: 일일 클릭이 꾸준히 두 자릿수대로 붙기 시작, GSC 순위가 유의미하게(30위권 이내로) 오르기 시작, 또는 페이지 수/사이트 운영기간이 업계 통상 권장 수준(보통 20~30페이지 이상, 운영 몇 주~몇 달)에 도달 등.
  - **(2026-07-16 세션, 능동 체크 결과)** 총 클릭이 7/13→7/16 사흘간 3건에서 그대로 정체(노출은 498→869로 +75% 늘었는데 클릭 전환은 없음). "신청해도 될 만한 신호"(일일 클릭 두 자릿수대, 순위 30위권 진입) 둘 다 아직 미달 — **아직 시기상조로 판단, 신청 제안 안 함.** 다음 스냅샷에서 클릭 추이 계속 볼 것.
  - **(2026-07-18 세션, 능동 체크 결과)** 총 클릭 3→4(+1), 노출 869→1149(+32%). 클릭이 여전히 한 자릿수 초반대에서 거의 안 움직임 — "일일 클릭 두 자릿수대" 기준 크게 미달. 페이지 레벨 순위도 홈(7.75위)·`rss-for-automation.html`(33.88위) 정도만 30위권 근처고 나머지 대부분 50~90위권 — "순위 30위권 진입" 기준도 아직 폭넓게 달성 안 됨. **여전히 시기상조로 판단, 신청 제안 안 함.** 이번 세션 조치(RSS/DNS/llms.txt 보강)가 다음 스냅샷 클릭에 영향 있는지 추적할 것.
  - **(2026-07-20 세션, 능동 체크 결과)** 총 클릭 4건, 7/18과 완전히 동일 — 이번엔 신규 클릭 자체가 0. 순위 분포도 대부분 그대로 50~90위권. **명확히 시기상조, 신청 제안 안 함.** 3개 스냅샷 연속(7/16→7/18→7/20) 클릭이 3~4건에서 사실상 고정되어 있는 상태 — 콘텐츠/보강보다 백링크·도메인 권위 축적이 이 정체를 풀 핵심 변수라는 기존 판단이 계속 재확인되는 중.
- **제휴(Vercel/Netlify/DigitalOcean/JetBrains/Cloudflare)**: 1차 시도 → 트래픽 부족으로 거절됨. 트래픽 쌓인 뒤 재신청 예정

---

## 10. 디렉토리 백링크 등록 현황 (2026-07-07 기준, 이후 세션에서 추가 진행 없음)

### 10-1. 이전 세션(6월 말~7/6 이전)에 이미 등록 완료된 곳
정확한 전체 리스트는 그때그때 기록이 흩어져 있어 100% 완전하지 않지만, 다른 채팅("기획")에서 언급된 것 기준:
- Dev.to, Medium, Product Hunt(첫 등록), IndieHackers(계정만 존재, 제출 권한은 없음 — 10-3 참고), SaaSHub, F6S, Peerlist(계정만 있고 실제 제품 launch는 안 되어 있었음), submission.directory 등
- 그 외 TinyLaunch(무료 큐 대기중), Startup Fame(승인완료), Pitchwall(Under Review 대기중), TerminalTrove(카테고리 안 맞아 스킵)
- **⚠️ 이 리스트는 불완전할 수 있음.** 사용자 본인도 전체를 다 기억 못 하는 상태. 새 채팅에서 "예전에 이미 등록했었나?"를 사용자가 물으면, 넘겨짚지 말고 `conversation_search` 툴로 과거 대화 검색해서 확인할 것. 확인 안 되면 사용자에게 직접 물어볼 것 — 절대 숫자를 뭉뚱그리거나 지어내지 말 것 (이전에 이걸로 사용자가 크게 짜증냈음).

### 10-2. 2026-07-07 세션에서 신규로 등록 완료한 곳 (총 12곳)

| 디렉토리 | 상태 | 비고 |
|---|---|---|
| 10words.io | 완료 | 무료 큐, 예상 노출까지 2,061일 대기 (사실상 노출 안 됨, 등록 자체만 유지) |
| twelve.tools | 완료 | footer 배지 삽입 필수 → 사용자가 직접 삽입 완료 |
| Findly.tools | 완료 | Category: Developer tools. 배지는 자체 게시엔 불필요 |
| LaunchIgniter | 완료 | 유료 부스트는 스킵, 무료 등록만 |
| Fazier | 완료 | footer 배지 필수 → 사용자가 직접 삽입, **2026-07-22 런칭 예약** |
| Product Hunt | 예약 완료 | 신규 등록(직접 폼 입력). **런칭일 2026-07-14(화)** 예약, Maker=본인 |
| Smol Launch | 예약 완료 | 배지 필요 → 삽입 완료, badge verified. **2026-07-13(월)** 무료 큐 |
| MicroLaunch | 완료 | Category: Developer tools. 무료 큐 2-3개월+ 대기 |
| Dev.to | 완료 | 스토리텔링 포스트. Tags: webdev, javascript, showdev, productivity |
| Uneed | 완료 | 무료 waiting line. **런칭 당일 업보트 10+ 못 채우면 dofollow 백링크 유지 안 되고 큐로 돌아가는 조건부 방식** |
| SaaSHub | 완료 | Verify 완료, 스크린샷/경쟁사(Squoosh, iLoveIMG 등) 설정 완료 |
| AlternativeTo | 승인 대기 | Squoosh를 대표 alternative로 연결. 승인 전까지 링크 공유 금지 |

### 10-3. 시도했지만 보류/미완료로 남은 것
- **Peerlist**: 계정은 있으나 실제 launch 미등록. 화면 꼬임으로 중단됨. 재개 시 로그인 후 "Launchpad" → 신규 제품 등록.
- **IndieHackers**: 신규 계정은 등록 권한 없음. 커뮤니티 활동으로 모더레이터 권한 획득 또는 유료 구독 필요 — 스킵함.

### 10-4. 백링크 관련 확정된 원칙
1. **사용자가 명시적으로 "더 하자/진행해라"고 하기 전엔 먼저 새 디렉토리를 제안하거나 진행하지 말 것.** 2026-07-07 세션 끝에서 사용자가 "앞으로 웬만하면 안 할 것"이라고 밝힘 — **디렉토리 백링크 작업은 당분간(별도 지시 없는 한) 종료 상태.** 2026-07-11 세션까지도 재개 지시 없었음.
2. Fast-track/Premium Spot/Priority+/Guest Post 등 **부가 유료 업셀은 전부 스킵.**
3. **배지가 필요한 디렉토리는 배지 삽입을 사용자 본인이 직접 처리한다.** Claude는 파일 수정에서 배지를 추가/제거하지 않는다.
4. **백링크 효과 판단은 뭉뚱그려 말하지 말 것.** 정확한 숫자 근거를 `conversation_search`로 재확인 후 답할 것.

---

## 11. 작업 방식 / 사용자 선호 (반드시 지킬 것)

1. **"진행해라"고 명시적으로 말하기 전엔 먼저 작업 착수하지 말 것.** 계획/분석/리서치까지는 먼저 해도 되지만, 실제 파일 생성/수정은 지시 있을 때만. 단, 사용자가 "이번에 하면 되는거고 오늘 한다 치고" 식으로 명확히 실행 지시를 주면 그 자리에서 순차 진행.
2. **퀄리티 최우선.** 툴 페이지든 블로그든 대충 채우지 말 것.
3. **신규 콘텐츠/툴 결정 전 필수 2단계**: (1) repo 내 실제 grep/파일 확인으로 중복 체크 (2) 웹 검색으로 키워드 경쟁강도 확인. 이 순서를 건너뛰고 바로 만들지 말 것.
4. GitHub 토큰 직접 push 방식이라 zip 요구사항은 해소됨.
5. 사용자는 8년차 개발자지만 Cloudflare Workers 등 서버리스/엣지 컴퓨팅 개념은 생소해할 수 있음 — 설명 시 비유/배경 설명 필요.
6. 버그 발견 시 원인을 솔직하고 정확하게 설명할 것 (얼버무리지 말 것).
7. 큰 작업(콘텐츠 대량 생성 등) 전엔 리스트를 정리해서 사용자 확인/컨펌 받고 진행. **단, 확인 절차 자체를 사용자에게 떠넘기지 말 것** — "혹시 pain point 있으세요?" 식으로 기획을 사용자에게 되묻는 건 지양하고, Claude가 먼저 구체적 안을 제시할 것 (2026-07-11 세션에서 사용자가 직접 지적함: "니가 기획하고 만드는건데 내가 해주고 앉았네").
8. 사용자는 다른 프로젝트(diycalckit, gpavault, cookingcalcs, ecoenergycalc, autocalchub 등)도 동일한 구조로 운영 중.
9. **판단은 명확하게, 숫자는 정확하게.** "이 정도면 충분한가?" 같은 질문에는 얼버무리지 말고 검색 가능한 사실에 근거해 답할 것. 모르면 "확인이 필요하다"고 정직하게 말할 것.
10. **반복 요약/정리 지양.** 같은 결론을 여러 번 다른 말로 반복하지 말 것. 사용자가 "됐다/완료했다"고 하면 그걸로 끝내고 다음 지시를 기다릴 것.
11. **사용자가 명확한 지시를 반복해서 줄 때는 Claude가 임의로 판단/제안하지 말고 지시받은 대로만 할 것.** ("니가 정하지 마" 라는 표현이 나오면 그 즉시 판단 개입을 멈출 것)
12. **(신규) "포화 여부"만으로 신규 툴을 기각하는 기준은 절대적이지 않음.** 사이트 규모(페이지 수)가 수익화의 병목일 때는 경쟁이 있어도 브랜드에 맞고 빠르게 만들 수 있으면 채택 가능 — 2026-07-11 세션에서 사용자가 방향을 명확히 전환함.
13. **(신규) 신규 파일 커밋 전 항상 검증 스크립트 실행**: 내부 링크 전수 스캔(끊긴 링크 없는지 python으로), sitemap.xml URL 개수 = 실제 html 개수 일치, OG/Twitter 태그 신규 페이지 전부 포함, 신규 JS는 `node --check`로 문법 검증. CDN 라이브러리는 버전을 하드코딩하기 전에 web_search/web_fetch로 실제 존재 여부 확인.
14. **(신규) 대시보드/시각화 요청 시 만들지 말고 텍스트 분석으로만 보고.**
15. **(신규) 신규 툴에 파싱/변환/알고리즘 로직이 들어가면 JS 문법 체크만으로 끝내지 말고 node로 실제 입출력을 검증할 것** (예: CSV↔TSV 라운드트립 테스트, SVG 최적화 전후 바이트 비교, YAML 멀티문서 파싱 등). 문법은 통과해도 로직이 틀릴 수 있음.
16. **(신규) "가치없는 콘텐츠"로 안 잡히게 주의할 것.** 이건 "경쟁사가 많다"와는 다른 기준 — 실제 위험 요인은 (a) 겉핥기식 얇은 설명, (b) 자동생성 티 나는 반복 문구, (c) 실제로 안 돌아가는 툴. 경쟁이 있어도 진짜 동작하는 툴 + 원본으로 새로 쓴 실질적 분량의 블로그(500단어 이상, FAQ 포함)면 문제없음. 다만 경쟁사가 기능적으로 훨씬 풍부한 영역(예: 그라디언트 생성기, 타이포 스케일 생성기처럼 대형 플레이어가 8개 export 포맷·라이브 프리뷰까지 갖춘 경우)은 우리가 만들어도 명백히 열등한 카피가 될 위험이 있어 채택을 피할 것.
17. **(신규) footer 일괄 치환 스크립트는 "패턴이 일치하는 파일만" 갱신하고 나머지는 조용히 넘어가므로, 오래된 파일이 과거 세션에서 누락된 항목을 가진 채로 계속 방치될 수 있음** (2026-07-16 세션에서 실제 발견 — robots-txt-mistakes.html과 robots-txt-generator.html 2개 파일이 llms.txt Generator 링크 자체가 빠진 채로 5일간 방치돼 있었음). 일괄 치환 스크립트 실행 후 `updated + skipped` 합계가 전체 파일 수와 맞는지 확인하고, `skipped` 목록에 뜨는 파일은 반드시 직접 열어서 왜 패턴이 안 맞는지 확인할 것 — "이미 최신이라 skip"과 "구조가 달라서 skip"을 구분해야 함.
18. **(신규) 신규 툴 후보를 검토할 때 "경쟁사가 전부 단일 항목 처리인데 우리만 배치 처리를 제공할 수 있는가"를 최우선 필터로 쓸 것.** 2026-07-16 세션에서 확인된 패턴 — SVG Optimizer, Heading Structure Checker, Sitemap Validator 셋 다 "포화된 니치에서 채택 성공한" 사례인데, 공통점이 경쟁사가 전부 "1개만 처리"이고 우리만 "여러 개 동시 처리"를 내세울 수 있었다는 것. 이 차별화가 안 되는 후보(px-rem 변환기, CSS 변수 추출기, Color Palette Extractor, EXIF Remover, File Renamer 등, 경쟁사도 이미 배치모드 지원)는 계속 미채택으로 걸러지고 있음.
19. **(참고) 2026-07-16 세션에서 사용자가 "Bing에서 이기면 된다"는 대안 전략을 언급했다가 바로 "그냥 이대로 해"로 철회함.** 별도의 Bing 특화 전략은 채택 안 함 — 지금 하던 방식(Google 기준 SEO + 롱테일 키워드 + AI검색 대응 콘텐츠) 그대로 유지.
20. **(신규, 2026-07-18) 새 툴의 결과/출력 박스에 색을 입힐 때는 그 요소가 실제로 어느 section(`section-navy`=다크 배경 vs `section-paper`=밝은 크림 배경) 안에 들어가는지 먼저 확인하고 명암비를 계산해서 정할 것.** json-validator.html에서 다크 섹션 전제 스타일(반투명 검정 배경+앰버 글자)을 밝은 섹션에 그대로 썼다가 명암비 1.25:1(사실상 안 보임)이 나온 사고가 있었음(사용자가 스크린샷으로 발견). Claude는 코드만 보고 실제 렌더링을 확인 못 하므로, 이런 커스텀 인라인 스타일을 쓸 때는 배경/글자색 조합의 명암비를 직접 계산(WCAG AA 기준 4.5:1 이상)해서 검증하고 넘어갈 것 — 기존 CSS 클래스(`.file-row` 등)를 그대로 쓰면 이미 검증된 조합이라 문제없지만, 인라인 스타일로 새로 배경색을 지정하는 순간부터는 별도 확인이 필요함. **(2026-07-20 2차 세션 재확인 사례)** text-diff-checker.html의 결과박스에서 같은 유형의 실수가 또 나올 뻔했음(다크배경에 밝은섹션용 텍스트색 재사용 시도) — 커밋 전에 잡아서 수정함. 이 원칙은 계속 실수가 반복되는 지점이므로 신규 툴 결과박스를 만들 때마다 명시적으로 체크리스트에 넣을 것.
21. **(신규, 2026-07-20 2차) 사용자가 "공격적으로 확장해야된다, 카테고리 확장이든 뭐든 좋다, 경쟁이 세도 롱테일 키워드로 뚫고 가야 한다, 수비적으로 하면 답이 없다"고 명시적으로 방향을 재확인/강화함.** 기존 원칙(12번 18항 — 포화 여부만으로 신규 툴을 기각하지 않는다)의 연장선이지만, 이번엔 한 단계 더 명확해짐: **경쟁사가 헤드키워드를 장악하고 있어도(심지어 diffchecker.com 같은 초대형 브랜드라도) "배치" 같은 구조적 차별화 앵글이 비어있으면 그 자체로 채택 근거가 된다.** 대형 브랜드와 헤드키워드로 직접 경쟁하는 게 아니라, 그 브랜드가 다루지 않는 롱테일(예: "bulk diff checker", "compare multiple text pairs")로 진입하는 전략. Claude는 매 세션 신규 후보를 검토할 때 이 기준을 적극적으로 적용해서, 사용자가 매번 "진행해도 되나"를 확인받지 않아도 되도록 스스로 판단해서 진행할 것 — 단, 11번 1항(큰 작업은 확인 후 진행)과 상충하지 않도록 실제 파일 생성 전에는 여전히 무엇을 왜 만드는지 근거를 먼저 제시하는 절차는 유지.
22. **(신규, 2026-07-27 2차) 사용자가 launch 플랫폼 등 외부 피드백(댓글/리뷰)을 스크린샷/캡처로 공유하며 "우리 쪽에서 해결 가능한지 봐달라"고 하는 경우**: SEO/콘텐츠 작업과는 다른 카테고리로 취급 — 기존 툴의 실제 기능 요청이면 (1) 요청이 구체적이고 범위가 작은지, (2) 기존 UI/스타일 시스템(`.opt-row`/`.btn`/`.panel` 등 기존 클래스) 재사용으로 조용히 녹여낼 수 있는지, (3) 서버 없이 클라이언트에서만 구현 가능한지 확인 후 바로 구현. 브라우저 저장이 필요하면 `localStorage` 사용 가능(이 프로젝트는 Claude 아티팩트가 아니라 실제 배포되는 웹사이트이므로 아티팩트의 localStorage 금지 규칙과 무관) — 다만 항상 try/catch로 감싸서 프라이빗 브라우징 등으로 저장이 막힌 경우를 조용히 처리할 것.
23. **(신규, 2026-07-31) 외부 피드백이 완전히 새로운 카테고리(신규 라이브러리 필요, 손실/무손실 트레이드오프 등 제품 판단이 필요)를 요구할 땐 먼저 실현 가능성 조사 결과와 선택지를 제시하고 확인받을 것 — 단, 사용자가 "1차버전 말고 그냥 다 완성해줘"처럼 단계적 진행 자체를 거부하면, 조사한 범위 전부(안전 모드+공격적 모드 등)를 한 세션에 전부 구현하고 대신 검증을 그만큼 철저히 할 것.** 이번 세션 세부 노하우:
    - **cdnjs가 항상 최신은 아님** — `pdf-lib`은 cdnjs 최신판(1.17.1)이 실제 최신이라 문제없지만, `pdf.js`는 cdnjs에 2.6.347(2020년경 버전)에서 멈춰있음. 이럴 땐 사이트 전체가 cdnjs를 쓰는 관행이어도 예외적으로 jsDelivr(`cdn.jsdelivr.net/npm/pdfjs-dist@버전/legacy/build/...`) 등 더 안정적으로 최신 버전을 제공하는 CDN을 그 라이브러리에 한해 사용할 것 — 라이브러리별로 cdnjs 카탈로그가 실제로 최신인지 검색으로 확인 후 결정.
    - **pdf.js는 "legacy" 빌드(UMD, 구형 브라우저/번들러 없는 환경용)를 써야 `<script>` 태그로 바로 `window.pdfjsLib` 전역이 잡힘** — 최신 메인 빌드(4.x+)는 ES 모듈 전용이라 번들러 없는 정적 사이트에 안 맞음.
    - **jsdom에서 pdf.js 렌더링을 테스트하려면**: (1) `canvas` npm 패키지를 같이 설치해야 `getContext('2d')`가 실제로 동작, (2) `pdf.worker.js`(메인 pdf.js와 별개 파일)를 같은 window에 `<script>`로 함께 주입해야 `window.pdfjsWorker.WorkerMessageHandler`가 잡혀서 워커 스레드/네트워크 요청 없이 폴백 동작, (3) jsdom에는 `ReadableStream`/`WritableStream`/`TransformStream` 전역이 없어서 Node의 `global.ReadableStream` 등을 `window`에 직접 복사해줘야 함. 이 세 가지가 없으면 에러 없이 그냥 무한 대기(hang)하듯 보여서 원인 파악이 까다로움 — 실제 브라우저에서는 이 세 가지 전부 네이티브 지원이라 문제 없음.
    - **손실 압축(페이지를 이미지로 재렌더링) 기능은 반드시 기본값 OFF + 명시적 경고 문구**로 넣을 것 — 텍스트 선택/검색 불가라는 트레이드오프를 사용자가 모르고 켰다가 당황하지 않도록.
24. **(신규, 2026-08-04) 작업 대상 페이지를 고를 때 "노출 수"가 아니라 "게재 순위"를 기준으로 볼 것.** 8/4 스냅샷 분석에서 확립된 기준 — 순위 60~90위대의 노출은 아무리 많아도(전체의 47%를 차지해도) 3개월간 클릭 0건이었고, 실제 클릭은 전부 순위 20위 이내 페이지에서만 나왔음. **작업 대상은 순위 15~40위 구간에 이미 들어와 있는 페이지/클러스터로 한정한다.** "노출이 급증했다"는 신호만으로 보강을 결정하지 말 것 — 그 노출이 몇 위에서 찍히고 있는지 반드시 같이 볼 것.
25. **(신규, 2026-08-04) GA4의 활성 사용자 수를 실제 트래픽으로 착각하지 말 것.** (direct)/(none) 비중과 도시별 분포(Council Bluffs·Ashburn·The Dalles·Frankfurt 등 데이터센터 소재지)를 매번 확인해서 봇 트래픽을 걸러낸 뒤 판단할 것. 8/4 기준 GA4 표기 109명 중 실제 사람은 30~50명 수준으로 추정됨. 광고사/제휴사 신청 시 GA4 숫자를 그대로 제출하지 말 것.
26. **(신규, 2026-08-04) 우리 툴이 실제로 못 하는 일을 검색 수요가 있다는 이유로 콘텐츠화하지 말 것.** 이번 세션에서 "screaming frog 무료판 500 URL 한도 우회" 계열(약 65노출)을 검토했으나, 우리 site-crawler는 40페이지 한도라 그 질문에 우리 툴로 답할 수 없어서 기각함. 검색 수요 < 정직성.

27. **(신규, 2026-08-11) `sitemap.xml`의 `<lastmod>`는 "콘텐츠가 실제로 바뀐 날"만 반영할 것 — git 최종 커밋일을 그대로 쓰지 말 것.** 푸터 링크 일괄치환 같은 전역 편집이 80개 파일 중 76개의 커밋일을 하루로 만들어버리기 때문에, 그대로 쓰면 가짜 신선도 신호가 된다. 구글은 lastmod가 부정확하면 신호 자체를 불신하며(부정확한 lastmod는 없느니만 못함), 한 번 잃은 신뢰는 되돌리기 어렵다. **파일을 고칠 때마다 그 파일의 lastmod만 그날 날짜로 갱신하고, 푸터/네비 일괄치환은 lastmod를 건드리지 말 것.** priority/changefreq는 구글이 무시하므로 조정할 이유 없음(다른 크롤러용으로 유지만).
28. **(2026-08-11 신설 → 2026-08-18 개정) "발견됨-미색인"의 원인을 볼 때는 인바운드 링크의 *개수*가 아니라 *출처 페이지의 크롤 빈도*로 볼 것.**
    - 8/11에 "미색인 23개 평균 2.3 vs 색인 57개 평균 2.89 = 유의차 없음 → 내부링크 문제 아님"이라고 결론냈는데 **이건 틀린 분석이었음.** 우리 푸터가 26개 툴 전부를 링크하기 때문에 모든 페이지의 인바운드 개수가 상향 평준화되고, 그 결과 "미색인 페이지들의 본문 인바운드가 사실상 `blog/index.html`·`tools/index.html`뿐이고 그 허브 자체가 거의 안 읽힌다"는 진짜 문제가 가려졌음.
    - **올바른 방법**: 헤더/푸터/네비를 제외한 본문 링크만 집계하고, **각 출처 페이지의 GSC 노출량을 가중치로 붙일 것.** 이렇게 보니 최대 노출 페이지들(858/361/174노출)이 본문 링크 0~1개짜리 막다른 골목이었음이 드러났고, 이게 미크롤링의 실제 원인이었음.
    - **교훈(일반화)**: 평균이 비슷하다는 이유로 가설을 기각하기 전에 **그 지표가 보일러플레이트 때문에 평준화된 건 아닌지** 먼저 볼 것. 개수는 같아도 링크의 가치는 같지 않다.
29. **(신규, 2026-08-11) 경쟁사 가격정책·기능 유무처럼 빨리 바뀌는 사실을 사이트 본문에 업체명까지 넣어 단정적으로 쓰지 말 것.** 8/4 분석 기반으로 "context.dev와 llmstxtgenerator.org가 llms-full.txt에 과금한다"고 써놨는데 1주일 만에 사실과 어긋났음(무료 제공 툴 다수 확인). 이런 서술은 (a) 업체명을 빼고 패턴으로 일반화하거나, (b) 확인 시점을 명시하는 형태로만 쓸 것. 우리 사이트의 신뢰 포지셔닝이 개별 문장의 설득력보다 자산 가치가 크다(9-1 제휴 배치 원칙과 같은 판단축).

30. **(신규, 2026-08-18) 노출 높은 페이지를 만들면 반드시 본문 내보내기 링크를 함께 심을 것.** 크롤 자석 페이지가 막다른 골목이면 유입된 크롤 수요가 사이트 전체로 퍼지지 않는다. 특히 **툴 페이지는 구조상 본문 링크가 0개가 되기 쉬우므로**(설명 → FAQ → 끝) 새 툴을 만들 때마다 관련 블로그 글로 나가는 본문 링크를 최소 1개 넣을 것. 단 **문맥이 맞는 것만** — 관련 없는 링크를 억지로 넣는 건 링크 스팸이고, 8/18 세션에서 pdf-merge-compress는 맞는 고노출 출처가 없어 일부러 비워뒀다.
31. **(신규, 2026-08-18) Bing 데이터는 "우리 콘텐츠가 통하는가"의 대조군으로 쓸 것.** 같은 페이지가 Bing 2~8위 / Google 50~70위라는 건 콘텐츠 품질이 아니라 도메인 권위 문제라는 뜻이다. Google 순위만 보고 콘텐츠 방향을 의심하거나 롱테일 전략을 흔들지 말 것. **단 Bing 특화 전략(IndexNow 등) 채택은 사용자 판단 사항이며 임의로 실행하지 않는다(19항 유지).**

32. **(신규, 2026-08-19) 신규 후보 검토 시 3차 필터로 "경쟁이 전부 설치형인가"를 볼 것.** 배치 차별화(7차)·no-upload 차별화(8차)가 둘 다 막혔을 때, 경쟁이 CLI·npm·VS Code 확장·빌드타임 플러그인에 몰려 있고 웹에서 바로 쓰는 도구가 없으면 그 자체가 유효한 차별화다. front matter 체커가 이 필터로 채택된 첫 사례.
33. **(신규, 2026-08-19) 경쟁 조사 시 검색 상위 경쟁사만 보지 말고 해당 기술의 공식 문서·FAQ를 반드시 확인할 것.** i18n 후보를 기각한 결정적 근거가 **i18next 공식 FAQ가 무료 웹 health check 도구를 직접 안내하고 있다는 사실**이었는데, 이건 일반 키워드 검색 상위에 안 잡혔다. 공식 문서가 특정 무료 툴을 추천하면 그 니치는 사실상 닫힌 것으로 볼 것.
34. **(신규, 2026-08-19) 기존 페이지에서 복사해 새 페이지를 만들 때는 반드시 jsdom으로 실제 렌더/동작을 확인할 것.** 이번에 푸터 블록을 잘라 재사용하면서 **이전 툴의 `<script>`가 통째로 딸려와, 신규 front matter 체커가 "Missing H1"을 출력하는 상태**였다. HTML 태그 균형 검사·JS 문법 검사는 **둘 다 통과했다** — 문법적으로 멀쩡한 잘못된 스크립트였기 때문. **정적 검사만으로는 이 부류를 절대 못 잡으므로, 새 툴은 예외 없이 jsdom으로 버튼 클릭까지 시뮬레이션할 것.**
35. **(신규, 2026-08-19) 새 툴을 만들 때 푸터 링크 정합성을 전 페이지 기준으로 검사할 것.** 이번에 전수 검사하다가 **이번 세션과 무관한 기존 결함**을 발견했다 — `barcode-batch.html`이 4개 파일(robots-txt-mistakes, robots-txt-vs-llms-txt, llms-txt-generator, robots-txt-generator) 푸터에서 빠져 있었음. 일괄치환 스크립트가 `replace(..., 1)`로 첫 발생만 바꾸는데 **본문에 같은 링크가 먼저 나오는 페이지에서는 푸터가 아니라 본문이 교체되는** 함정 때문. 앞으로 푸터 일괄편집 후에는 `<footer>` 블록 안의 툴 링크 수가 전 파일 동일한지 반드시 확인할 것.

---

## 12. 다음에 할 일 (우선순위 순)

**★ 2026-08-19 세션 기준 다음 할 일**

- **A. 신규 2페이지 색인 추적.** `tools/frontmatter-checker.html` / `blog/markdown-front-matter-mistakes.html` 둘 다 2026-08-19 생성. 신규 페이지가 색인되는 데 2~4주 걸리므로 **다음 스냅샷에 없다고 실패로 보지 말 것.** 다만 8/18에 확인한 "미크롤링 17개" 문제가 있으므로, **신규 2개가 '발견됨-미색인'에 바로 들어가는지**는 볼 것 — 들어간다면 크롤예산 문제가 신규 페이지에도 적용된다는 뜻.
- **B. 8/18 본문링크 8개 효과 판정 — 이번이 판정 시점.** sitemap-generator(출처 858노출)·image-batch(174)·csv-tsv-converter(57)가 미크롤링에서 빠졌는지 확인. **pdf-merge-compress만 링크를 못 심었으므로 자연 대조군** — 앞 3개가 빠지고 pdf만 남으면 "고노출 출처 본문링크"가 실제 레버라는 게 증명됨.
- **C. sitemap lastmod 효과 판정.** 8/11 도입 후 5주차. 미크롤링 개수 추이 + 8/12부터 2배로 뛴 노출이 유지되는지.
- **D. n8n/RSS 클러스터 투자 판단.** `blog/rss-for-automation.html`이 3주 연속 36.5위 정체, "zapier rss"도 3주 연속 29.33위 고정. **다음 스냅샷에도 안 움직이면 투자 중단 후보로 확정할 것.**
- **E. humans.txt 클러스터 추적만.** 28.64위, 4스냅샷 연속 상승. 상업가치 0이라 콘텐츠 투자 금지, **1페이지 진입 시 도메인 권위 상승의 첫 증거**로만 활용.
- **F. `blog/upc-vs-ean-vs-code128.html`은 계속 방치.**
- **G. (사용자 판단 필요) Bing/IndexNow** — 8/18 기록 참고. 11번 19항과 충돌하므로 임의 실행 안 함.
- **(수익화 항목은 9-1-1의 트래픽 조건을 실측으로 충족하기 전까지 이 목록에 올리지 말 것.)**

**★ 2026-08-18 세션 기준 다음 할 일**

- **A. 미크롤링 17개가 줄어드는지 확인 — 이번 세션 최대 관전포인트.** 8/18에 고노출 페이지 8곳에서 본문 링크를 심었으므로, 특히 **sitemap-generator(출처 858노출), image-batch(174), csv-tsv-converter(57)** 3개가 먼저 빠져나가는지 볼 것. 이 3개가 빠지고 pdf-merge-compress가 남으면 **"고노출 출처 본문링크"가 실제 레버라는 게 증명됨**(pdf만 유일하게 링크를 못 심었으므로 자연 대조군). 2~4주 필요.
- **B. lastmod 효과 판정 — 이번엔 판정 가능.** 8/11 도입 후 2주가 지났고, 8/12부터 노출이 2배로 뛴 게 유지되는지 + 색인 17개가 추가로 줄었는지로 본다. **단 8/8 자연 감소분과 섞이지 않게, 8/18 이후 신규 해소분만 볼 것.**
- **C. 신규 글 + 밸리데이터 기능 추적.** `blog/sitemap-lastmod-git-commit-date.html`이 색인되는지(신규라 2~4주), sitemap-validator(8노출/71.6위)가 lastmod 검사 추가로 움직이는지.
- **D. 8/11 n8n 섹션 효과 판정.** `blog/rss-for-automation.html` 36.48→36.58위로 3주째 정체. **다음 스냅샷에도 안 움직이면 이 클러스터는 투자 중단 후보로 볼 것**(zapier rss도 3주 연속 29.33위 완전 고정).
- **E. humans.txt 클러스터 추적만.** 45노출/28.64위로 4스냅샷 연속 상승, 곧 20위권 진입 가능. **상업가치 0이라 콘텐츠 투자는 계속 안 함** — 다만 이게 1페이지에 오르면 **도메인 권위 상승의 첫 증거**가 되므로 그 관점으로만 볼 것.
- **F. `blog/upc-vs-ean-vs-code128.html`은 계속 방치.** 변화 없음(11번 24항).
- **G. (사용자 판단 필요) Bing/IndexNow.** 데이터상 Bing이 우리를 2~8위에 놓고 Google 미색인 페이지까지 색인 중. IndexNow는 무료이고 Bing/Yandex/Naver/Seznam에 즉시 제출 가능하지만 **11번 19항(Bing 특화 전략 미채택)과 충돌하므로 임의 실행하지 않음.** 사용자가 원하면 그때 진행. (컨테이너 네트워크 화이트리스트에 api.indexnow.org가 없어 세션 내 제출은 불가 — 키 파일 배치까지만 가능.)
- **(수익화 항목은 9-1-1의 트래픽 조건을 실측으로 충족하기 전까지 이 목록에 올리지 말 것.)**

**★ 2026-08-11 세션 기준 다음 할 일**

- **A'. sitemap lastmod 도입 효과 추적 — 이번 세션 최대 관전포인트.** "발견됨-미색인" 23개가 줄어드는지 확인. 2~4주는 봐야 하므로 **다음 스냅샷에서 안 줄었다고 바로 실패로 결론내지 말 것.** 줄기 시작하면 색인 페이지가 늘면서 노출 기반 자체가 커진다.
- **B'. 8/11 조치 2건 추적.** (1) `blog/rss-for-automation.html` n8n 섹션 → 36.48위에서 움직이는지. (2) `tools/rss-generator.html` 타임스탬프 문서화 → 노출 456에서 CTR 변화 있는지.
- **C'. 8/4 A~C 작업(Zapier/llms-full/bulk 문구) 효과 판정은 다음 스냅샷에서.** 8/11 시점엔 반영 1주일차라 셋 다 수치 변화 없었음 — **1주일 만에 효과 없다고 되돌리거나 재보강하지 말 것.**
- **D'. humans.txt 클러스터 추적만.** 30.53위까지 올라와 작업 구간(15~40위) 안에 있지만 **상업적 의도가 없는 키워드라 수익 기여가 사실상 0** — 순위가 더 올라도 콘텐츠 추가 투자는 하지 말고 관찰만 할 것. 사이트 권위 지표로만 활용.
- **E'. `blog/upc-vs-ean-vs-code128.html`("크롤링됨-미색인" 유일 1건)은 방치할 것.** 분량 미달도 아니고(중간 수준), 해당 클러스터 노출이 4건·순위 45위라 11번 24항 기준 작업 대상 아님.
- **(수익화 항목은 9-1-1의 트래픽 조건을 실측으로 충족하기 전까지 이 목록에 올리지 말 것.)**

**★ 2026-08-04 세션에서 Sonnet에게 넘긴 작업 (A~D 완료 확인됨 2026-08-11)**

- **A (최우선). `blog/rss-for-automation.html` 대폭 보강 — Zapier RSS 트러블슈팅 섹션 신설.** 근거: 이 클러스터가 순위 28~31위로 홈 다음가는 상업적 위치이고, 검색 상위에 정리된 가이드가 없는 진짜 공백이며, 실패 원인이 전부 "피드를 어떻게 만들었나"라서 우리 RSS Generator로 직결됨(8번 8/4 블록 참고). 다루어야 할 4가지: guid 중복판정, 폴링 지연 1~15분, Content-Type/Accept 미스매치(`Not Acceptable`), 100+ 아이템 flood protection. 신규 파일 만들지 말고 **기존 페이지 보강**으로 갈 것 — 이미 순위가 잡힌 페이지를 밀어올리는 게 신규 글로 분산시키는 것보다 낫다는 원칙이 8/4 스냅샷(sitemap-static-sites 노출 +61%)에서 처음 수치로 검증됨.
- **B. `tools/llms-txt-generator.html` 보강.** 근거: 단수형/오타 변형이 18~19위로 **사이트 전체 최고 순위 축**. 반영할 신규 사실: Chrome Lighthouse Agentic Browsing 감사에 llms.txt 추가(2026-05), llms-full.txt가 llms.txt보다 2배 이상 자주 페치됨, 경쟁사는 llms-full.txt를 유료화. 우리는 llms-full.txt를 만들지 않으므로 "왜 안 만드는가 + 직접 만드는 법"을 정직하게 설명하는 방향(기존 FAQ의 "llm.txt인가 llms.txt인가" 항목과 같은 톤 유지).
- **C. `tools/meta-length-checker.html` — "bulk" 키워드 강화.** 근거: "bulk meta title and description checker"만 13.5위, 같은 클러스터의 "bulk" 없는 변형은 전부 60~70위대. **배치 차별화가 검색엔진에 먹히고 있다는 첫 직접 증거**이므로 title/H1/본문 첫 문단에서 "bulk / many pages at once"를 더 명시적으로 밀 것. 새 기능 추가 아님, 문구 작업.
- **D (선택, 저비용). `llms.txt` 누락 2건 보완** — 현재 사이트 루트 `llms.txt`에 `index.html`(홈)과 `tools/index.html` 항목이 빠져 있음(78/80). 다른 78개는 전부 정상.
- **E (수익화 액션, 사용자 직접 실행 필요). n8n 제휴 신청** — 9-1 참고. 승인 후 A 작업 결과물에 `rel="sponsored"` 링크 1~2개만 문맥상 자연스럽게 삽입.

**★ 투자 중단 확정 (2026-08-04)**: `blog/free-alternative-screaming-frog.html`(768노출·0클릭·63.71위) / `blog/jwt-claims-explained.html`(220노출·0클릭·59.46위) 두 클러스터. 합쳐서 전체 노출의 47%지만 3개월간 클릭 0건, 보강(7/16 jwt-claims)으로도 순위가 안 움직였음. **앞으로 이 두 클러스터에 신규/보강 콘텐츠를 넣지 말 것.** 백링크·도메인 권위가 붙어 순위가 40위권 안으로 들어오면 그때 재검토.

0. **(2026-07-18 세션에서 사용자가 확정) 다국어 페이지는 진행 안 함.** 노르웨이/독일/네덜란드는 영어 구사력이 높은 국가라 번역 없이 지금처럼 영어로 계속 가는 것으로 사용자가 직접 결정함 — 이 항목은 종결, 재검토 불필요.
1. **(2026-07-25 세션 갱신) 대기 중인 신규 툴 후보 없음** — Color Contrast Checker(신규/배치/CSS변수 결합 각도 전부 재확인 결과 이미 6곳 이상이 커버 중)를 최종 기각하면서 "롱테일도 안 뚫리면 정직하게 기각한다"는 원칙이 확립됨(5번 11차 참고). 다음 세션에서도 "배치 차별화" → "no-upload 차별화"(5번 8차) → "경쟁사 전부 단일 항목 처리"(5번 10차) 순으로 확인하고, 전부 막히면 억지로 만들지 말 것.
1-1. **(신규, 2026-07-25) `tools/json-schema-validator.html`, `tools/og-card-checker.html`, `tools/og-image-generator.html` 클릭/노출 추적 시작할 것** — 셋 다 신규 툴이라 아직 GSC 데이터 없음, 다음 스냅샷부터 확인. `tools/meta-length-checker.html`·`tools/text-diff-checker.html`(7/20 2차 추가), `tools/humans-txt-generator.html`(7/20 1차 추가)도 아직 추적 초기 단계 — 계속 관찰. `tools/json-validator.html`도 7/18 추가 이후 여전히 노출이 잘 안 잡히는 상태 — 계속 관찰.
1-2. **(2026-07-20 세션에서 완전히 해결, 2026-07-25 세션에서 재확인)** 내부링크 고아 페이지 문제 — 종결된 항목이지만 신규 툴+블로그 세트를 만들 때마다 재발할 수 있음이 이번 세션에서 재확인됨(7번 참고). **신규 툴 제작 직후 반드시 고아 페이지 스크립트를 다시 돌려서 확인할 것 — 특히 툴을 먼저 만들고 블로그를 나중에 쓰는 순서로 작업할 때, 툴 페이지 본문에 블로그 링크 추가를 깜빡하기 쉬움.**
2. **(2026-07-20 2차 세션에서 해결 완료)** 메타태그(title/description) 길이 체커는 "URL 붙여넣기→서버 fetch" 방식으로 접근해서 Worker 확장이 필요해 보류돼 있었으나, "텍스트(title/description) 직접 붙여넣기, fetch 없음" 방식으로 접근을 바꿔서 `tools/meta-length-checker.html`로 구현 완료함. **이 항목은 종결.**
3. 매 세션 GA/Search Console 데이터 받으면 이전 스냅샷과 비교 → 변화율 기준으로 신규/보강 여부 재판단 (8번 참고). 신규 결정 전 중복 체크 + 웹 키워드 경쟁강도 확인 필수. 신호가 확실히 잡힌 기존 페이지가 있으면 신규 글보다 그 페이지 보강을 먼저 검토할 것(2026-07-16 jwt-claims-explained, 2026-07-18 rss-generator/ip-dns-ssl/llms-txt-generator 사례 참고).
3-1. **(2026-07-20 세션 확인 결과)** 7/18 세션에서 보강한 3개 페이지(rss-generator/ip-dns-ssl/llms-txt-generator)는 이번 스냅샷에서 노출이 완만히 늘긴 했으나(rss-generator +2%) 클릭 전환에는 아직 뚜렷한 변화 없음 — GSC 반영에 시간이 더 걸릴 수 있어 다음 스냅샷도 계속 볼 것.
4. **툴 카테고리 자체를 넓히는 것도 유효한 확장 축.** **(2026-07-20 2차 세션에서 6번째 카테고리 "Text" 신설 — Bulk Text Diff Checker로 개시)** 현재 Encode/Decode·SEO·Network·Media(이미지+SVG)·Data(포맷변환)·**Text**(신규) 6개 카테고리. 신규 후보 검토 시 "경쟁사가 단일 항목 처리인데 우리만 배치 처리 가능한가"를 최우선 필터로 쓸 것 (11번 18항 참고).
5. rss-generator / free-alternative-screaming-frog 두 클러스터는 계속 관찰 — 순위가 유의미하게 오르기 시작하면 콘텐츠 심화로 전환 검토, 그렇지 않으면 백링크/권위 축적이 우선.
6. **디렉토리 백링크는 당분간 중단 상태 유지** (10-4 원칙) — 사용자가 다시 명시적으로 요청할 때만 재개.
7. **(2026-07-18 세션에서 사용자가 종결) 디렉토리 런칭/승인 결과(Product Hunt, Smol Launch, Fazier, AlternativeTo)는 Claude가 더 이상 추적하지 않는다.** 사용자가 "알아서 되는 거니까 신경 쓰지 말고 콘텐츠에 집중하라"고 명확히 지시함 — 앞으로 세션에서 이 항목들을 다음 할 일로 올리거나 확인을 제안하지 말 것.
8. **AdSense 신청 타이밍은 Claude가 매 세션 GSC/GA 데이터 볼 때마다 능동적으로 판단할 것.** 2026-07-16 기준 클릭 여전히 3건 정체(노출만 늘어남) — 아직 미달. 신청해도 되겠다 싶은 신호(일일 클릭 두 자릿수대, 순위 30위권 진입) 보이면 먼저 제안할 것.
9. 트래픽 어느 정도 쌓이면 제휴 재신청.
10. Worker 코드(`worker.js`) repo 백업 여부는 아직 결정 안 됨 — 필요시 그때 판단.
11. **신규 툴 만들 때는 처음부터 블로그 2개 세트로 같이 계획할 것.** 2026-07-16 세션에서 3번 연속(Heading Checker, Sitemap Validator) 이 패턴으로 잘 진행됨 — 계속 유지.
12. **Coverage 리포트의 "발견됨-미색인" 페이지 수를 계속 추적할 것** — 2026-07-16 기준 17페이지, 이후로도 페이지를 계속 늘리고 있어서 이 숫자도 같이 늘어날 가능성 있음. 너무 급격히 늘면(예: 30개 이상) 신규 페이지 추가 속도를 늦추고 기존 페이지 색인/순위 회복을 기다리는 것도 고려할 것.
13. **footer 일괄 치환 후 skip된 파일은 반드시 원인 확인할 것** (11번 17항 참고) — 오래된 파일에 누락된 링크가 방치될 수 있음.
14. **(신규, 2026-07-25 세션, 후순위/선택사항)** 사이트 전역에서 쓰는 `assets/img/og-image.png`(로고+태그라인)를 신규 `og-card-checker.html`로 실제 확인해보니, 카드 오른쪽 끝에서 태그라인 텍스트("100% FREE — RUNS IN YOUR BRO...")가 살짝 잘림 — 로고 아이콘과 브랜드명("FreeToolDev")은 완전히 보이고 보조 텍스트만 잘리는 수준이라 사용자가 직접 확인 후 "문제 아닌 듯"으로 판단, **긴급 수정 불필요, 액션 보류.** 원인은 체커의 버그가 아니라 원본 이미지 자체가 태그라인에 우측 여백을 충분히 안 둔 디자인 문제. 나중에 손볼 경우 이 이미지엔 로고 아이콘이 들어가 있어서 텍스트 전용인 신규 OG Image Generator로는 완전히 재현 안 됨 — 원본 소스 파일을 직접 편집하거나 여백을 넉넉히 다시 디자인해야 함.
