# DevQA 작성 규칙

## 파일명
`{scope}-{developer}-{YYYYMMDD}[-{n}].html` (예: `cms-vin-20260722.html`, `cms-harry-20260803.html`)
- scope: `app` / `cms` / `backend` / `api` 등
- developer: 소문자, 라틴 표기 (`harry`, `vin`, `kelvin`, `john`) — 기존 허브 `.devtabs`에 등록된 이름 그대로 쓸 것. 새 이름을 지어내지 말고 반드시 기존 표기를 먼저 확인.
- 여러 개면 `-2`, `-3`… 뒤에 붙임

## 질문에 이미지가 딸려 오면 답변 페이지에도 반드시 넣는다
⚠️ 2026-08-17에 한 번 빠뜨려서 나중에 「어느 화면의 어느 문구」인지 알 수 없게 된 적이 있음(cms-vin-20260817.html). 원문에 `[image]`가 있으면 답변에도 반드시 넣을 것 — 질문 바로 아래(답변보다 위), 폭에 맞춰 작게 넣고 누르면 크게 보이게.

이미지 저장 위치·마크업 규칙(기존 파일 예: `cms-harry-20260721.html`):
- 파일: `devqa/assets/{YYYYMMDD}-{developer}/{developer}-{q|a}-{topic}.png`
- 질문 아래 삽입:
  ```html
  <div class="thumbs"><button class="q-thumb" type="button" onclick="lbOpen('/devqa/assets/.../파일.png','캡션')">
    <img src="/devqa/assets/.../파일.png" alt="..." onerror="this.closest('.q-thumb').style.display='none'">
    <span class="q-thumb-cap"><span class="i18n"><span class="ko">캡션</span><span class="vi">...</span></span></span>
  </button></div>
  ```
- 라이트박스(`.lb`/`#lightbox`) CSS·마크업·`lbOpen`/`lbClose` 스크립트를 파일 끝에 포함해야 클릭 시 확대가 동작함.
- 캡처를 뜰 수 없는 환경이면 이미지 링크를 걸지 말고, 그 자리에 안내 텍스트로 왜 없는지 남길 것.

## 표기
- 개발자 이름은 라틴 표기 그대로 사용 (Harry / Vin / Kelvin / John) — 한국어 문장 안에서도 번역하지 않음.
- ⚠️ 새 이름처럼 보여도 **먼저 기존 파일·허브에 그 사람이 이미 다른 표기로 등록돼 있는지 확인**할 것 — 2026-08-17에 "빈"을 신규 개발자로 오판해 "Bin"이라는 없는 이름을 만든 적이 있음(실제로는 기존 CMS 담당자 Vin을 가리킨 것이었음). 짐작하지 말고 확인.
- 허브(`devqa/index.html`)에 정말 새 개발자가 추가되면 `.devtabs` 필터 버튼과 JS `DEV_TABS` 배열에도 추가해야 필터가 동작함.
