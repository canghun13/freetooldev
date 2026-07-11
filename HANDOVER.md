# FreeToolDev — HANDOVER.md

_Last updated: 2026-07-11_

## 사이트 현황

- 도메인: freetooldev.com — 개발자/디자이너용 무료 배치/벌크(bulk) 유틸리티 사이트
- 포지셔닝: "batch/bulk 특화" (경쟁사 대비 툴 개수가 아니라 이 포지셔닝 자체가 차별점)
- 전체 페이지: 39개 (툴 12 + 블로그 21 + 정적 페이지 6)
- 모든 툴은 브라우저에서만 동작, 서버 업로드 없음 — 이 특성이 콘텐츠/마케팅 전반의 핵심 메시지

## 툴 목록 (12개)

| 툴 | 파일 | 블로그 커버리지 |
|---|---|---|
| Base64 Encode/Decode | tools/base64.html | 2 |
| CSV to JSON (Batch) | tools/csv-to-json.html | 2 |
| Bulk Image Tool (리사이즈/변환/압축/크롭) | tools/image-batch.html | 3 |
| RSS Generator | tools/rss-generator.html | 3 |
| Sitemap Generator | tools/sitemap-generator.html | 2 |
| robots.txt Generator (AI 크롤러 차단 포함) | tools/robots-txt-generator.html | 1 (교차 커버 포함 2) |
| llms.txt Generator | tools/llms-txt-generator.html | 1 (교차 커버 포함 2) |
| IP / DNS / SSL Bulk Lookup (내 IP 즉시 표시 포함) | tools/ip-dns-ssl.html | 2 |
| Site Crawler & Audit | tools/site-crawler.html | 3 |
| JWT Decoder (Batch) | tools/jwt-decoder.html | 2 |
| Bulk QR Code Generator | tools/qr-batch.html | 2 |
| Bulk Barcode Generator (UPC/EAN/Code128) | tools/barcode-batch.html | 2 |

모든 툴 최소 2개 이상 블로그로 커버된 상태 (robots.txt/llms.txt는 전용 글 1개씩 + 둘을 함께 다루는 비교글 1개로 사실상 2개씩).

## 검색 신호 (Search Console, 지난 3개월 롤링)

- **2026-07-10 스냅샷**: 총 클릭 2 / 노출 305, 페이지 5~6개에서만 유의미한 노출
- **2026-07-11 스냅샷**: 총 클릭 3 / 노출 421 (+38%), 노출 잡힌 페이지 16개로 확대

여전히 초기 단계지만 방향은 우상향. 핵심 신호 2개:

1. **rss-generator.html**: 117 노출, 순위 61위, 클릭 2 (사이트에서 유일하게 꾸준히 클릭 나오는 페이지)
2. **free-alternative-screaming-frog.html**: 179 노출 (하루 새 +81%), 순위 60~67위, 클릭 0. 독일어/북유럽어권("alternativ screaming frog", "alternativer til screaming frog" 등) 다국어 쿼리가 계속 붙는 게 특징. **볼륨은 사이트 전체에서 제일 크지만 순위가 페이지 6~7권이라 클릭 전환이 전혀 안 됨.**

### 2026-07-11 분석 결론 (신규 콘텐츠 보류)

screaming-frog 클러스터에서 "500 URL 무료 한도" 관련 롱테일 쿼리("screaming frog seo spider free up to 500 urls" 등)가 새로 잡혀서 전용 콘텐츠를 검토했으나:
- 기존 free-alternative-screaming-frog.html에 이미 500 URL 한도 언급이 있어 콘텐츠 중복
- 웹 검색 결과 이 롱테일 자체가 Screaming Frog 공식 문서(screamingfrog.co.uk) + 대형 에이전시 블로그(Thrive Agency 등)가 이미 장악해서, 일반 "alternative" 키워드보다 오히려 더 뚫기 어려운 것으로 확인

→ **결론: 이 클러스터는 콘텐츠 부족이 아니라 도메인 권위/백링크 문제.** 신규 글을 쓰는 것보다 진행 중인 백링크 등록(twelve.tools, Findly.tools, Fazier, Smol Launch 등)이 실제 병목 해소에 더 유효함. 이번 데이터 확인 결과 신규/보강 작업 없음 — 텍스트로만 분석하고 실행은 보류.

## 원칙 (반드시 지킬 것)

- **사용자 명시 지시 전 임의로 신규 작업 착수 금지.** 계획/분석/리서치는 먼저 해도 되지만 실제 파일 생성·커밋은 "진행해" 류의 명확한 지시 후에만.
- **신규 콘텐츠(툴/블로그) 결정 전 필수 2단계 체크**: (1) 기존 파일과 내용 중복 확인 (2) 웹 검색으로 키워드 경쟁강도 확인. 이 두 체크를 통과 못 하면 신규 작성 보류하고 이유를 텍스트로 보고.
- **footer 배지(twelve.tools, Findly.tools, Fazier, Smol Launch)는 절대 건드리지 말 것.** index.html에만 있고 사용자가 직접 삽입한 것.
- **숫자(트래픽/노출/클릭 등)는 뭉뚱그리지 말고 실제 데이터 파일 기준으로 재확인** 후 보고.
- **커밋 전 항상 검증**: 내부 링크 전수 스캔(끊긴 링크 없는지), sitemap.xml URL 개수 = 실제 html 개수 일치, OG/Twitter 태그 신규 페이지 전부 포함, 신규 JS 문법 체크(`node --check`).
- **footer는 전체 페이지에 동일하게 반복**되므로 신규 툴 추가 시 전체 페이지 일괄 치환 필요 (누락 없도록 `grep -L`로 재확인).
- **CDN 라이브러리 버전은 실제 존재 여부를 web_fetch/web_search로 확인 후 사용** (버전 하드코딩 시 404 위험).
- **대시보드/시각화 자료 요청 시 만들지 말고 텍스트 분석으로만 보고.**
- git identity 미설정 환경이므로 최초 커밋 시 `git config user.name/user.email` 필요. 원격에 새 커밋이 있으면 `git fetch` + `rebase`로 병합 후 push (강제 push 금지).

## 다음에 이어갈 것

- 계획했던 6개 신규 툴 후보 중 3개(robots.txt, llms.txt, barcode) 완료, 나머지 3개 대기: **Bulk Color Palette Extractor, Bulk EXIF Remover, Bulk File Renamer**
- Search Console 데이터는 매번 새로 받아서 재확인할 것 (스냅샷 날짜별로 트렌드 비교가 핵심 — 절대량보다 변화율이 더 유용한 신호)
- screaming-frog/rss-generator 두 클러스터는 콘텐츠보다 백링크/도메인 권위 축적이 우선순위라는 결론을 계속 재검증할 것 (노출은 계속 느는데 클릭이 안 붙으면 이 가설이 맞다는 뜻, 반대로 순위가 유의미하게 오르기 시작하면 콘텐츠 심화로 전환 검토)
