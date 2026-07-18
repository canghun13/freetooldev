# FreeToolDev — 프로젝트 인수인계 문서

마지막 업데이트: 2026-07-18 (같은 날 2차 세션 — 신규 툴 Bulk JSON Validator & Formatter + 블로그 2개 추가. 다국어 확장은 사용자가 보류 확정)

---

## 1. 프로젝트 개요

- **사이트명**: FreeToolDev
- **도메인**: https://freetooldev.com
- **컨셉**: 개발자/디자이너 대상 무료 "배치/벌크" 유틸리티 툴 모음. 대부분의 무료 툴이 파일 1개씩만 처리하는 데 반해, 이 사이트는 처음부터 "여러 개를 한 번에" 처리하는 걸 차별점으로 잡음.
- **핵심 포지셔닝**: No-upload / 브라우저에서만 처리 (프라이버시), 계정 불필요, 완전 무료
- **수익 모델**: AdSense(예정) + 제휴 링크(보류, 트래픽 부족으로 1차 시도 실패) + 디렉토리 백링크
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

## 3. 사이트 구조 (전체 파일, 2026-07-18 2차 세션 기준 60개)

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
├── tools/                      19개, index.html은 검색/필터 포함 목록
└── blog/                       35개, index.html은 목록
```

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

## 5. 툴 18개 현황

| 툴 | 파일 | 상태 | 비고 |
|---|---|---|---|
| Base64 Encode/Decode | `tools/base64.html` | 검증완료 | 완전 클라이언트, 배치 줄단위 처리 |
| Bulk URL Encoder/Decoder | `tools/url-encoder.html` | 검증완료 | encodeURIComponent(Component)/encodeURI(Full URL) 모드 분리, 줄단위 배치. 외부 라이브러리 없음 |
| CSV to JSON | `tools/csv-to-json.html` | 검증완료 | UTF-8/EUC-KR/UTF-16 자동 인코딩 감지, 8MB 제한, 청크 파싱(멈춤 방지) |
| **(신규) JSON ↔ YAML Converter** | `tools/json-yaml-converter.html` | 검증완료(node로 실제 변환 결과까지 확인) | js-yaml(cdnjs 4.1.1) 라이브러리. `---`로 구분된 멀티 YAML 문서 → JSON 배열 변환 지원 |
| **(신규) CSV ↔ TSV Converter** | `tools/csv-tsv-converter.html` | 검증완료(node로 라운드트립 테스트까지 확인) | 외부 라이브러리 없이 자체 구현한 quote-aware 파서/시리얼라이저 (따옴표 안 콤마/탭/개행, `""` 이스케이프 전부 처리) |
| Bulk Image Resize/Convert/Compress | `tools/image-batch.html` | 검증완료 | Canvas API, 20MB/장·60장 제한, 순차처리+진행률. Crop to exact size(center-crop) 모드 포함 |
| **(신규) Bulk SVG Optimizer** | `tools/svg-optimizer.html` | 검증완료(node로 실제 최적화 결과까지 확인, 644B→175B 72.8% 축소 케이스 테스트) | 외부 라이브러리 없이 자체 구현 — 주석/DOCTYPE/XML선언/에디터 네임스페이스(inkscape·sodipodi)/metadata 블록 제거, d·points 속성 좌표 소수점 반올림, 빈 g·defs 제거. title/desc/aria는 기본 보존(체크박스로 해제 가능) |
| RSS Generator | `tools/rss-generator.html` | 검증완료 | "계정불필요/스크래핑아님" 차별점 보강. **GSC 신호 있는 페이지 (아래 8번 참고)** |
| Sitemap Generator | `tools/sitemap-generator.html` | 검증완료 | |
| **(신규) Bulk Sitemap Validator** | `tools/sitemap-validator.html` | 검증완료(jsdom으로 7개 케이스 테스트: 정상/상대경로/우선순위범위초과/changefreq오류/loc누락/중복URL/XML파싱오류/sitemapindex) | 여러 sitemap.xml을 `-----` 구분선으로 붙여넣어 한번에 검증. DOMParser(브라우저 내장)로 XML 파싱, 외부 라이브러리 없음. Sitemap Protocol 스펙 기준 검사(well-formed XML/절대경로/priority 0.0-1.0/changefreq 7개값/lastmod 날짜형식/중복URL/50000개 한도/sitemapindex 구조). **경쟁사는 전부 "URL 1개 입력→서버fetch" 방식인데 우리는 여러 개 붙여넣기 배치 검증으로 차별화, CORS 문제 자체가 없음(URL fetch 안 하니까)** |
| robots.txt Generator | `tools/robots-txt-generator.html` | 검증완료 | Disallow/Allow/Sitemap 라인 + GPTBot/ClaudeBot/Google-Extended 등 AI 크롤러 개별 차단 체크박스 |
| llms.txt Generator | `tools/llms-txt-generator.html` | 검증완료 | `섹션 \| 제목 \| URL \| 설명` 포맷 파싱 → 카테고리별 마크다운 인덱스 생성 |
| **(신규) Bulk Heading Structure Checker** | `tools/heading-structure-checker.html` | 검증완료(jsdom으로 실제 파싱/계층분석 로직 6개 케이스 테스트) | 여러 페이지 HTML을 `-----` 구분선으로 붙여넣어 한번에 H1-H6 계층 체크. DOMParser(브라우저 내장) 사용, 외부 라이브러리 없음. Missing H1/Multiple H1/Skipped level/Empty heading 4종 검사. **경쟁사는 전부 "URL 1개 입력" 방식인데 우리는 여러 페이지 동시 배치 체크로 차별화** |
| IP/DNS/SSL Bulk Lookup | `tools/ip-dns-ssl.html` | 검증완료 | DNS는 Google DoH, SSL은 Worker→crt.sh 경유. SSL 큐잉 동시 2개 제한. 페이지 최상단 "내 현재 IP" 카드(`api.ipify.org`) 포함 |
| Site Crawler & Audit | `tools/site-crawler.html` | 검증완료 | Worker `/crawl` 호출, 최대 40페이지, sitemap/rss/llms.txt 동시생성+깨진링크+메타태그 체크 |
| JWT Decoder (Batch) | `tools/jwt-decoder.html` | 검증완료(모바일 포함) | 서명 검증 안 함 명시, 완전 클라이언트 |
| Bulk QR Code Generator | `tools/qr-batch.html` | 검증완료(실제 스캔까지) | qrcodejs(cdnjs) 라이브러리, 100개 제한 |
| Bulk Barcode Generator | `tools/barcode-batch.html` | 검증완료 | UPC-A/EAN-13/Code128, JsBarcode(cdnjs 3.12.1) 라이브러리. UPC/EAN은 체크섬 검증 후 불합격 코드는 결과 하단에 별도 표시. 100개 제한 |
| **(신규, 2026-07-18) Bulk JSON Validator & Formatter** | `tools/json-validator.html` | 검증완료(node로 12개 케이스 테스트: 정상/트레일링콤마/작은따옴표/따옴표없는키/콤마누락/빈입력/문자열미종료 등, line/column 에러 위치 추출 로직 포함). **(2026-07-18 사용자가 스크린샷으로 발견/수정) 결과 박스 색상 대비 버그 있었음** — 다크 섹션 전제 스타일(`rgba(0,0,0,0.2)` 배경 + 앰버 글자)을 밝은 섹션(`section-paper`)에 그대로 써서 명암비 1.25:1(WCAG 기준 미달, 사실상 안 보임)이었음. 고정 다크배경(`#081729`)+크림/밝은앰버 글자로 교체해 15.1:1/10.1:1로 수정. **교훈: 새 툴 결과박스 스타일은 어느 section(navy/paper)에 들어가는지 확인 후 명암비 검증할 것 — 코드 작성 시 시각적 확인이 안 되므로 특히 주의.** | 여러 JSON 스니펫을 `-----` 구분선으로 붙여넣어 한번에 검증+포맷팅. 브라우저 내장 `JSON.parse`만 사용, 외부 라이브러리 없음. **경쟁사는 전부 파일 업로드 기반 배치 처리인데 우리는 파일 업로드 없이 텍스트 붙여넣기만으로 배치 처리 — "배치 자체"가 아니라 "업로드 없는 배치"가 차별화 지점** (12번 참고, 기존 "경쟁사는 단일처리" 필터와는 다른 신규 패턴) |

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

**대기 중인 신규 툴 후보**: 없음 (8차 세션 결과 JSON Validator 채택 후 소진). 다음 신규 후보는 "배치 차별화 필터" 우선, 막히면 "no-upload 차별화 필터"(위 8차 참고)로 새로 찾을 것.

---

## 6. Cloudflare Worker (`freetooldev-crawler`)

- **주소**: `https://freetooldev-crawler.canghun13.workers.dev`
- **엔드포인트**:
  - `GET /crawl?url=https://example.com` — 사이트 크롤링(최대 40페이지, 서브리퀘스트 45개 제한), sitemap.xml/rss.xml/llms.txt/브로큰링크/메타태그 리포트 반환 (JSON)
  - `GET /ssl?domain=example.com` — crt.sh(Certificate Transparency 로그, API키 불필요) 조회로 SSL 만료일 확인. exact-match 쿼리 문법은 정상 도메인까지 결과없음 처리하는 버그가 있어서 롤백함 — **절대 다시 넣지 말 것.** 30초 타임아웃 + 502/503 시 1회 재시도 구현됨.
- **배포 방식**: Cloudflare 대시보드에서 수동으로 코드 편집/Deploy (Claude가 API로 직접 배포 못 함). 코드는 대화 중 파일로 전달, repo에는 백업 안 해둠 (필요시 사용자 판단으로 나중에 추가 가능)
- **HTMLRewriter** API로 title/meta description/링크 추출 (Cloudflare Workers 전용 스트리밍 HTML 파서)

---

## 7. 블로그 현황 (35개)

**툴별 커버리지 (2026-07-18 2차 세션 기준, 19개 툴 전부 최소 2개 이상)**:

| 툴 | 개수 |
|---|---|
| image-batch, rss-generator, site-crawler | 3 |
| base64, jwt-decoder, csv-to-json, ip-dns-ssl, qr-batch, sitemap-generator, barcode-batch, url-encoder, json-yaml-converter, csv-tsv-converter, svg-optimizer, heading-structure-checker, sitemap-validator, json-validator | 2 |
| robots-txt-generator, llms-txt-generator | 1개씩 전용 + "robots.txt vs llms.txt" 비교글 1개 공유 = 사실상 2개씩 |

**2026-07-07 세션 이전 (13개)**: jwt-claims-explained, find-broken-links-free-tool, rss-generator-no-account, free-alternative-screaming-frog, rss-for-automation, bulk-qr-code-use-cases, ssl-expiry-monitoring-free, csv-encoding-gibberish, sitemap-static-sites, debug-jwt-base64-locally, webp-vs-avif-2026, no-upload-image-compression, batch-vs-ai-image-convert

**2026-07-07 세션 추가 (4개, 언더커버 툴 보강)**: sitemap-vs-robots-txt, csv-to-json-data-types, dns-records-explained, static-vs-dynamic-qr-codes

**2026-07-11 세션 추가 (4개, 신규 툴 3개 세트)**: robots-txt-mistakes, robots-txt-vs-llms-txt, upc-vs-ean-vs-code128, bulk-barcode-use-cases

**2026-07-13 세션 1차 추가 (1개)**: encodeuricomponent-vs-encodeuri

**2026-07-13 세션 2차 추가 (3개, 카테고리 확장 세트)**: svg-export-bloat, json-vs-yaml, csv-vs-tsv

**2026-07-13 세션 3차 추가 (4개, 1개뿐이던 신규 툴 4개 전부 2개로 보강)**: double-url-encoding, yaml-anchors-aliases, excel-csv-number-mangling, inline-svg-vs-img-vs-css-background

**2026-07-16 세션 2차 추가 (2개, 신규 툴 1개 세트)**: skipped-heading-levels, multiple-h1-tags

**2026-07-16 세션 3차 추가 (2개, 신규 툴 1개 세트)**: sitemap-priority-changefreq, sitemap-index-files

**2026-07-18 세션 2차 추가 (2개, 신규 툴 1개 세트)**: json-syntax-errors-explained(문제해결형 — JSON이 JS 문법을 거부하는 이유 6가지), json-validator-no-upload(비교분석형 — 파일업로드 vs 브라우저전용 JSON 툴, 민감데이터 다룰 때 실질적 차이)

**참고**: jwt-claims-explained는 신규 작성이 아니라 2026-07-16 1차 세션에서 대폭 보강됨(RFC 7519 registered/public/private 용어 섹션 추가, 500→1157단어) — 8번 참고.

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

- **AdSense**: 아직 미신청. Privacy/About/Contact 페이지는 이미 준비됨(요건 충족). **(2026-07-11 세션 확정 방향)** 트래픽/클릭이 붙기 전까지는 "유니크한 툴 아이디어 찾기"보다 "페이지 총량 확보"가 우선순위라고 사용자가 방향을 명확히 함 — 신규 툴 검토 시 포화 여부만으로 기각하지 말고, 브랜드 적합성/제작 난이도/기존 사용자층과의 시너지를 함께 볼 것.
  - **(2026-07-13 세션, 신청 타이밍 원칙 확정)** 콘텐츠 품질은 문제없음 — 매 글 500~700단어대(실측 확인함), 문제해결 구조(왜 생기는지→어떻게 진단하는지→어떻게 고치는지)로 매번 원본으로 작성 중이라 "가치없는 콘텐츠"로 분류될 요소 없음. **신청을 미루는 이유는 콘텐츠가 아니라 순수 트래픽 문제.** 지금(2026-07-13 기준) GSC 총 클릭 3건 — 이 상태로 신청하면 심사관이 판단할 데이터 자체가 없어서 보류/거절 확률이 높고, 재신청 대기기간이 생기는 게 더 손해. 과거 제휴(Vercel 등) 신청도 트래픽 부족으로 거절된 전례 있음(10번 참고). **Claude는 매 세션 GSC/GA 데이터를 볼 때마다 "지금 신청해도 될 만한 타이밍인가"를 판단해서, 됐다고 판단되면 먼저 "지금 신청하세요"라고 사용자에게 제안할 것.** 사용자가 판단해서 물어보길 기다리지 말 것 — 이건 Claude가 데이터 보고 능동적으로 챙겨야 하는 항목. 참고할 만한 신호: 일일 클릭이 꾸준히 두 자릿수대로 붙기 시작, GSC 순위가 유의미하게(30위권 이내로) 오르기 시작, 또는 페이지 수/사이트 운영기간이 업계 통상 권장 수준(보통 20~30페이지 이상, 운영 몇 주~몇 달)에 도달 등.
  - **(2026-07-16 세션, 능동 체크 결과)** 총 클릭이 7/13→7/16 사흘간 3건에서 그대로 정체(노출은 498→869로 +75% 늘었는데 클릭 전환은 없음). "신청해도 될 만한 신호"(일일 클릭 두 자릿수대, 순위 30위권 진입) 둘 다 아직 미달 — **아직 시기상조로 판단, 신청 제안 안 함.** 다음 스냅샷에서 클릭 추이 계속 볼 것.
  - **(2026-07-18 세션, 능동 체크 결과)** 총 클릭 3→4(+1), 노출 869→1149(+32%). 클릭이 여전히 한 자릿수 초반대에서 거의 안 움직임 — "일일 클릭 두 자릿수대" 기준 크게 미달. 페이지 레벨 순위도 홈(7.75위)·`rss-for-automation.html`(33.88위) 정도만 30위권 근처고 나머지 대부분 50~90위권 — "순위 30위권 진입" 기준도 아직 폭넓게 달성 안 됨. **여전히 시기상조로 판단, 신청 제안 안 함.** 이번 세션 조치(RSS/DNS/llms.txt 보강)가 다음 스냅샷 클릭에 영향 있는지 추적할 것.
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
20. **(신규, 2026-07-18) 새 툴의 결과/출력 박스에 색을 입힐 때는 그 요소가 실제로 어느 section(`section-navy`=다크 배경 vs `section-paper`=밝은 크림 배경) 안에 들어가는지 먼저 확인하고 명암비를 계산해서 정할 것.** json-validator.html에서 다크 섹션 전제 스타일(반투명 검정 배경+앰버 글자)을 밝은 섹션에 그대로 썼다가 명암비 1.25:1(사실상 안 보임)이 나온 사고가 있었음(사용자가 스크린샷으로 발견). Claude는 코드만 보고 실제 렌더링을 확인 못 하므로, 이런 커스텀 인라인 스타일을 쓸 때는 배경/글자색 조합의 명암비를 직접 계산(WCAG AA 기준 4.5:1 이상)해서 검증하고 넘어갈 것 — 기존 CSS 클래스(`.file-row` 등)를 그대로 쓰면 이미 검증된 조합이라 문제없지만, 인라인 스타일로 새로 배경색을 지정하는 순간부터는 별도 확인이 필요함.

---

## 12. 다음에 할 일 (우선순위 순)

0. **(2026-07-18 세션에서 사용자가 확정) 다국어 페이지는 진행 안 함.** 노르웨이/독일/네덜란드는 영어 구사력이 높은 국가라 번역 없이 지금처럼 영어로 계속 가는 것으로 사용자가 직접 결정함 — 이 항목은 종결, 재검토 불필요.
1. **대기 중인 신규 툴 후보 없음** — 다음 후보는 "배치 차별화 필터", 막히면 "no-upload 차별화 필터"(5번 8차 세션 참고)로 새로 찾을 것.
1-1. **(신규, 2026-07-18) `tools/json-validator.html` 클릭/노출 추적 시작할 것** — 신규 툴이라 아직 GSC 데이터 없음, 다음 스냅샷부터 확인.
1-2. **(2026-07-18 세션 3차에서 해결 완료)** `llms.txt`와 홈페이지 featured 그리드가 오래전부터 갱신 누락되고 있던 문제를 같은 세션에서 마저 처리함. llms.txt는 각 페이지의 실제 title/description을 스크립트로 추출해서 19개 툴+35개 블로그 전체 재생성(순서는 tools/index.html·blog/index.html 노출 순서 따름). 홈페이지 "Every tool, built for batches" 섹션도 9개→19개 전체로 확장(카피가 "모든 툴"이라고 써놓고 실제론 절반만 보여주고 있던 상태였음). 둘 다 내부링크 스캔/HTML 밸런스 검증 통과 후 push 완료. **앞으로 새 툴 추가 시 체크리스트에 "llms.txt·홈페이지 featured 그리드"도 포함할 것** — footer 링크는 스크립트로 일괄 처리하는 습관이 있었지만 이 두 곳은 누락되기 쉬움.
1-3. **(신규, 2026-07-18 세션 4차 — 내부링크 그래프 분석 결과)** footer(전 페이지 공통이라 신호 아님) 제외하고 본문 내 링크만 집계해보니 **블로그 27개가 blog/index.html 목록 카드 1개 말고는 사이트 어디서도 링크를 못 받는 사실상 고아 페이지 상태**였음. 이번 세션엔 우선순위 가장 높은 4곳(free-alternative-screaming-frog — 노출 452인데 완전 고아였음, dns-records-explained, rss-generator-no-account, rss-for-automation)에만 자연스러운 위치를 찾아 링크 추가함. **나머지 23개 블로그도 같은 문제 있음 — 다음 세션에서 시간 될 때 관련 툴 페이지나 다른 블로그 글에서 자연스러운 자리를 찾아 순차적으로 링크 추가할 것.** 이 작업 자체가 Coverage의 "발견됨-미색인" 문제 완화에 도움될 수 있음(내부링크 깊이/권위 신호가 크롤 우선순위에 영향).
2. 메타태그(title/description) 길이 체커는 서버사이드 fetch가 필요해서 보류 중 — Worker에 새 엔드포인트(`GET /meta?url=`) 추가할 의향이 있으면 재검토 가능.
3. 매 세션 GA/Search Console 데이터 받으면 이전 스냅샷과 비교 → 변화율 기준으로 신규/보강 여부 재판단 (8번 참고). 신규 결정 전 중복 체크 + 웹 키워드 경쟁강도 확인 필수. 신호가 확실히 잡힌 기존 페이지가 있으면 신규 글보다 그 페이지 보강을 먼저 검토할 것(2026-07-16 jwt-claims-explained, 2026-07-18 rss-generator/ip-dns-ssl/llms-txt-generator 사례 참고).
3-1. **(신규, 2026-07-18) 다음 스냅샷에서 이번 세션 보강 효과 추적할 것**: `tools/rss-generator.html`(generator/creator/builder/maker 비교 섹션), `tools/ip-dns-ssl.html`(NS 레코드 섹션 + bulk FAQ), `tools/llms-txt-generator.html`(llm.txt vs llms.txt FAQ) 3개 페이지 클릭/순위 변화 확인.
4. **툴 카테고리 자체를 넓히는 것도 유효한 확장 축.** 지금은 Encode/Decode·SEO·Network·Media(이미지+SVG)·Data(포맷변환) 5개 카테고리. 신규 후보 검토 시 "경쟁사가 단일 항목 처리인데 우리만 배치 처리 가능한가"를 최우선 필터로 쓸 것 (11번 18항 참고).
5. rss-generator / free-alternative-screaming-frog 두 클러스터는 계속 관찰 — 순위가 유의미하게 오르기 시작하면 콘텐츠 심화로 전환 검토, 그렇지 않으면 백링크/권위 축적이 우선.
6. **디렉토리 백링크는 당분간 중단 상태 유지** (10-4 원칙) — 사용자가 다시 명시적으로 요청할 때만 재개.
7. **(2026-07-18 세션에서 사용자가 종결) 디렉토리 런칭/승인 결과(Product Hunt, Smol Launch, Fazier, AlternativeTo)는 Claude가 더 이상 추적하지 않는다.** 사용자가 "알아서 되는 거니까 신경 쓰지 말고 콘텐츠에 집중하라"고 명확히 지시함 — 앞으로 세션에서 이 항목들을 다음 할 일로 올리거나 확인을 제안하지 말 것.
8. **AdSense 신청 타이밍은 Claude가 매 세션 GSC/GA 데이터 볼 때마다 능동적으로 판단할 것.** 2026-07-16 기준 클릭 여전히 3건 정체(노출만 늘어남) — 아직 미달. 신청해도 되겠다 싶은 신호(일일 클릭 두 자릿수대, 순위 30위권 진입) 보이면 먼저 제안할 것.
9. 트래픽 어느 정도 쌓이면 제휴 재신청.
10. Worker 코드(`worker.js`) repo 백업 여부는 아직 결정 안 됨 — 필요시 그때 판단.
11. **신규 툴 만들 때는 처음부터 블로그 2개 세트로 같이 계획할 것.** 2026-07-16 세션에서 3번 연속(Heading Checker, Sitemap Validator) 이 패턴으로 잘 진행됨 — 계속 유지.
12. **Coverage 리포트의 "발견됨-미색인" 페이지 수를 계속 추적할 것** — 2026-07-16 기준 17페이지, 이후로도 페이지를 계속 늘리고 있어서 이 숫자도 같이 늘어날 가능성 있음. 너무 급격히 늘면(예: 30개 이상) 신규 페이지 추가 속도를 늦추고 기존 페이지 색인/순위 회복을 기다리는 것도 고려할 것.
13. **footer 일괄 치환 후 skip된 파일은 반드시 원인 확인할 것** (11번 17항 참고) — 오래된 파일에 누락된 링크가 방치될 수 있음.
