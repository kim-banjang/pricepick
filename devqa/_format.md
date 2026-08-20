# DEVQA 답변 문서 틀 (기준: 2026-08-17 이전 문서)

새 형식 만들지 말 것. 최근 파일이 아니라 **이 문서**를 기준으로 삼는다.
기존 예시: `app-kelvin-20260803.html` · `app-john-20260806.html` · `cms-harry-20260730.html` · `backend-harry-20260716.html`

## 파일명
`{scope}-{developer}-{YYYYMMDD}[-{n}].html`
scope는 `app` / `cms` / `backend` / `api`. developer는 소문자 라틴 표기(`harry` `vin` `kelvin` `john`).

## 문서 제목 (`<title>` = `.htitle`)
- app — `PricePick 앱 답변 · Kelvin · 2026-08-20`
- cms — `PricePick CMS 답변 · Vin · 2026-08-17` (2차는 뒤에 ` (2차)`)
- backend — `PricePick 백엔드 질문 답변 #13` (연번, 이름·날짜 없음)

## 부제 (`.hsub`)
`{이름} · {App|CMS|Backend} · {주제} — 답변 KO/VI`
분야는 라틴 표기. 「앱」 「백엔드」로 쓰지 않는다.

## 원문 링크 (`.srclink`)
헤더 안, 부제 아래. `원문 질문 보기 (Notion) ↗`
URL이 없으면 버튼을 만들지 않는다. 대신 chip에 사실을 적는다 — `원문 질문: Notion 아님 — 김반장이 채팅으로 전달` / `… 링크 미확보`. **URL을 지어내지 않는다.**

## meta chip (`.meta > .chip`)
1. `질문 N건`
2. `확정 답변 N` (또는 `확정 N · 확정 대기 M`)
3. `근거: …` — 김반장 확정 / 화면 실측 / 마스터 정책서 등
4. `질문 문구는 요약 · 원문은 노션 링크`

## 절 · 질문 · 카드 = 1 : 1 : 1
질문 1건 = `h2.grp` 1개 = `.qa` 1개. 부연 때문에 카드를 쪼개지 않는다.
질문이 아닌 절(「0. 먼저 —」 같은 것)은 `.qa` 안에 `.arow` 하나만 둔다.

## 카드 안 순서
```
.qa
  .qrow  → .qno(질문 번호) / .qtxt(질문) / .bd(확정·확정 대기)
  .thumbs → 질문 캡처 (있을 때만)
  .arow  → .alabel 「답변」 + .atxt
  .ref-box → .ref-label 「[참조]」 + 근거·출처·기술 상세
```

## 질문 싣는 방식 (`.qtxt`)
**한국어 요약 + 베트남어 번역만.** 원어 원문 블록은 두지 않는다.
원문은 헤더 `.srclink`로 간다.

## 답변 (`.arow` / `.alabel` / `.atxt`)
- 라벨은 **「답변」 하나.** 화면별·범위·정리 같은 라벨을 새로 만들지 않는다.
- 결론 먼저, 이유는 뒤에. 문단 사이 빈 줄.
- 기획자 관점. 코드·함수·테이블 지시는 하지 않는다.
- 볼드는 결론 문장에만.

## [참조] (`.ref-box`)
카드 맨 끝. 근거 문서·화면 경로·필드명 같은 **기술 상세를 여기로 뺀다.** 답변 본문에 섞지 않는다.

## 표
카드 **밖**에 둔다.
```
<h3 style="font-size:13px;color:var(--pp-d);margin:18px 0 2px">소제목</h3>
<div class="tblwrap"><table class="tbl"> … </table></div>
```
보조 설명이 필요하면 표 아래 `.note-box`. 대비가 필요한 칸은 `td.old`(붉은 고정폭) / `td.new`(청록 굵게).

## 이미지
`.thumbs > button.q-thumb` + `.q-thumb-cap`, 클릭 시 `lbOpen`으로 확대.
파일 위치는 `devqa/assets/{YYYYMMDD}-{developer}/{developer}-{q|a}-{topic}.png`.
「적용 화면」처럼 답변 뒤 캡처는 카드 밖에 `<h3>` 소제목 + `.thumbs`.
이미지가 있으면 `.lb` 마크업과 `lbOpen`/`lbClose` 스크립트를 파일 끝에 넣는다.

## 꼬리말 (`.foot`)
`PricePick · App 답변 · Kelvin · 2026-08-20 · 확정 2 / 확인 필요 0`
backend는 `PricePick · 백엔드 질문 답변 #13 · Harry · 2026-08-19 · 확정 2 / 확인 필요 0`

## 한국어·베트남어 토글
`<input type="checkbox" id="langsw">` + `label.langtog`(KO/VI), 모든 문구는 `<span class="i18n"><span class="ko">…</span><span class="vi">…</span></span>`.
기존 파일의 CSS를 그대로 복사해 쓴다.

## 스타일
`app-kelvin-20260803.html`의 `<style>` 블록을 그대로 쓴다.
`--pp:#845EEE` 계열, 헤더 `linear-gradient(120deg,#845EEE,#6a45d4)`, 본문 `-apple-system,'Apple SD Gothic Neo',Pretendard`.
클래스를 새로 만들지 않는다 — 필요한 것은 이미 다 있다.

## 허브 등록 (`devqa/index.html`)
```
<div class="rowwrap" data-dev="kelvin"><a class="row" href="/devqa/…">
  <div class="rmain">
    <div class="rt">앱 질문 답변 · Kelvin</div>        ← 제목
    <div class="rwho">Kelvin · App · {요약}</div>      ← 이름 · 분야 · 내용
  </div>
  <div class="rdate">2026-08-20</div><div class="rarrow">›</div></a>
  <a class="srcnotion" href="…">📎 원문 질문 (Notion) ↗</a>   ← 링크 있을 때
  <div class="srcnotion">원문 질문: Notion 아님 — …</div>      ← 없을 때
</div>
```
- 제목: `앱 질문 답변 · {이름}` / `CMS 질문 답변 · {이름}` / `백엔드 질문 답변 #N`
- 베트남어 제목: `Giải đáp câu hỏi App · {이름}`
- 최신 날짜가 위. 새 개발자면 `.devtabs` 버튼과 JS `DEV_TABS` 배열에도 추가.

## 하지 않는 것
- 원어 원문 블록(`.qorig`)
- 라벨을 여럿 만들어 카드를 쪼개는 것
- 맨 `<table>`에 새 CSS를 붙이는 것
- `.pv` 같은 새 클래스
- 「1-1」 「2-1」 같은 하위 번호
- 없는 노션 URL을 지어내는 것
