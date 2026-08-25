/* ══════════════════════════════════════════════════════════════════════════
   nd-kit.js — New Design 시안 공통 덧옷 (2026-08-25 신설)

   클로드 디자인이 주는 시안 파일은 자기 안에 자원을 싸안고 풀어서 그리는 번들이다.
   그 안에는 한·베 토글도, 다른 시안과 맞춘 헤더 규격도 없다. 시안이 새 판으로 올 때마다
   그걸 손으로 다시 붙이느라 손이 많이 갔다 — 그 일을 없애려고 만든 파일이다.

   쓰는 법 : 시안 HTML 맨 끝 </body> 앞에 두 줄만 붙인다.
       <script src="/new-design/nd-dict-<이름>.js"></script>
       <script src="/new-design/nd-kit.js"></script>
   시안이 새 판으로 오면 파일만 갈아끼우고 이 두 줄을 다시 붙이면 끝이다.
   사전(nd-dict-*.js)은 시안 파일 밖에 있으므로 교체해도 그대로 살아남는다.

   사전에 없는 한국어가 있으면 콘솔에 목록으로 찍어 준다 — 새 판에서 늘어난 문구를
   그걸 보고 사전에 채우면 된다.

   기대하는 전역 (nd-dict-*.js 가 정한다)
     window.ND_DICT    { 한국어: 베트남어 }
     window.ND_SKIP    [ 번역하지 않을 문자열 ]          (선택)
     window.ND_HEADER  { eyebrow, title, lead }          (선택 — 시안에 헤더가 없을 때 만들어 넣는다)
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var DICT = window.ND_DICT || {};
  var SKIP = {};
  (window.ND_SKIP || []).forEach(function (k) { SKIP[k] = 1; });

  /* 다른 New Design 시안에서 실측한 헤더 3단 규격 (내 티켓 & 포인트 시안 기준).
     시안마다 색·자간·굵기가 조금씩 달라서 여기로 통일한다. */
  var HDR_STYLE = [
    'color: rgb(155, 147, 176); font-size: 13px; font-weight: 700; letter-spacing: 0.08em;',
    'color: rgb(26, 17, 48); font-size: 34px; font-weight: 800; letter-spacing: -0.035em;',
    'color: rgb(138, 138, 163); font-size: 15px; font-weight: 500;'
  ];

  function findEyebrow(root) {
    var all = root.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) {
      if (all[i].children.length === 0 && /^PRICEPICK\s*·/.test(all[i].textContent.trim())) return all[i];
    }
    return null;
  }

  /* 헤더가 있으면 규격만 맞추고, 없으면 만들어 넣는다. 문구는 건드리지 않는다. */
  function ensureHeader(root) {
    if (root.dataset.ndHdrDone) return;
    var eb = findEyebrow(root);
    if (eb) {
      var box = eb.parentElement;
      if (!box || box.children.length < 3) return;
      for (var j = 0; j < 3; j++) box.children[j].setAttribute('style', HDR_STYLE[j]);
      box.id = 'pp-nd-header';
      root.dataset.ndHdrDone = '1';
      return;
    }
    var H = window.ND_HEADER;
    if (!H) return;
    var host = root.querySelector('.sc-host') || root;
    var wrap = host.firstElementChild;
    if (!wrap || !wrap.children.length) return;
    var made = document.createElement('div');
    made.id = 'pp-nd-header';
    var wc = getComputedStyle(wrap);
    var sideways = wc.display.indexOf('flex') >= 0 && wc.flexDirection === 'row';
    made.setAttribute('style', sideways
      ? 'display:flex;flex-direction:column;gap:10px;padding:' + wc.paddingTop + ' ' + wc.paddingRight + ' 0 ' + wc.paddingLeft + ';'
      : 'display:flex;flex-direction:column;gap:10px;');
    [H.eyebrow, H.title, H.lead].forEach(function (txt, i) {
      var d = document.createElement('div');
      d.setAttribute('style', HDR_STYLE[i]);
      d.textContent = txt || '';
      made.appendChild(d);
    });
    if (sideways) { wrap.parentNode.insertBefore(made, wrap); wrap.style.paddingTop = '32px'; }
    else { wrap.insertBefore(made, wrap.firstElementChild); }
    root.dataset.ndHdrDone = '1';
  }

  var missing = {};

  function applyI18n(root) {
    if (!root) return;
    ensureHeader(root);

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [], n;
    while (n = walker.nextNode()) {
      if (n.parentNode && n.parentNode.closest && n.parentNode.closest('.i18n')) continue;
      nodes.push(n);
    }
    nodes.forEach(function (node) {
      var raw = node.nodeValue, t = raw.trim();
      if (!t || SKIP[t]) return;
      if (!DICT.hasOwnProperty(t)) {
        if (/[가-힣]/.test(t)) missing[t] = 1;   /* 사전에 없는 한국어를 모아 둔다 */
        return;
      }
      var span = document.createElement('span');
      span.className = 'i18n';
      var ko = document.createElement('span'); ko.className = 'ko'; ko.textContent = t;
      var vi = document.createElement('span'); vi.className = 'vi'; vi.textContent = DICT[t];
      span.appendChild(ko); span.appendChild(vi);
      var frag = document.createDocumentFragment();
      var lead = raw.match(/^\s*/)[0], tail = raw.match(/\s*$/)[0];
      if (lead) frag.appendChild(document.createTextNode(lead));
      frag.appendChild(span);
      if (tail) frag.appendChild(document.createTextNode(tail));
      node.parentNode.replaceChild(frag, node);
    });

    if (!document.getElementById('langsw')) buildSwitch(root);

    var left = Object.keys(missing);
    if (left.length) {
      console.warn('[nd-kit] 사전에 없는 한국어 ' + left.length + '개 — nd-dict 파일에 채우면 된다:\n' +
        left.map(function (k) { return '"' + k + '": "",'; }).join('\n'));
    }
  }

  /* 다른 시안과 같은 모양의 KO/VI 알약 토글 */
  function buildSwitch(root) {
    var style = document.createElement('style');
    style.textContent = [
      '.i18n .vi{display:none}',
      '#langsw{position:fixed;opacity:0;pointer-events:none;top:0;left:0}',
      '#langsw:checked ~ #dc-root .i18n .ko{display:none}',
      '#langsw:checked ~ #dc-root .i18n .vi{display:inline}',
      '#ps-lang-switch{position:fixed;top:18px;right:22px;z-index:9002;}',
      '#ip-lang-toggle{display:inline-flex;align-items:center;gap:0;background:#ffffff;border:1px solid #E3E0EC;border-radius:999px;padding:3px;cursor:pointer;font-family:inherit;box-shadow:0 2px 10px rgba(90,60,150,0.12);}',
      '#ip-lang-toggle span{font-size:12px;font-weight:700;letter-spacing:.4px;color:#9890ad;padding:3px 12px;border-radius:999px;line-height:1.4;transition:background .15s,color .15s;}',
      '#ip-lang-toggle span.on{background:#845EEE;color:#fff;}',
      '#ip-lang-toggle:hover{border-color:#845EEE;}',
      '@media (max-width:560px){#ps-lang-switch{top:12px;right:12px;}}'
    ].join('\n');
    document.head.appendChild(style);

    var cb = document.createElement('input');
    cb.type = 'checkbox'; cb.id = 'langsw';
    document.body.insertBefore(cb, root);

    var wrap = document.createElement('div');
    wrap.id = 'ps-lang-switch';
    var btn = document.createElement('button');
    btn.id = 'ip-lang-toggle'; btn.type = 'button';
    btn.setAttribute('data-lang', 'ko'); btn.title = 'KO / VI'; btn.setAttribute('aria-label', 'KO/VI');
    var ko = document.createElement('span'); ko.setAttribute('data-l', 'ko'); ko.className = 'on'; ko.textContent = 'KO';
    var vi = document.createElement('span'); vi.setAttribute('data-l', 'vi'); vi.textContent = 'VI';
    btn.appendChild(ko); btn.appendChild(vi);
    wrap.appendChild(btn);
    document.body.appendChild(wrap);

    cb.addEventListener('change', function () {
      var lang = cb.checked ? 'vi' : 'ko';
      btn.setAttribute('data-lang', lang);
      ko.className = (lang === 'ko') ? 'on' : '';
      vi.className = (lang === 'vi') ? 'on' : '';
    });
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      window.ipSetLang(window.ipGetLang() === 'vi' ? 'ko' : 'vi');
    });
  }

  window.ipSetLang = function (lang) {
    var cb = document.getElementById('langsw');
    if (!cb) return;
    var wantVi = (lang === 'vi');
    if (cb.checked === wantVi) return;
    cb.checked = wantVi;
    var evt;
    try { evt = new Event('change', { bubbles: true }); }
    catch (e) { evt = document.createEvent('HTMLEvents'); evt.initEvent('change', true, true); }
    cb.dispatchEvent(evt);
  };
  window.ipGetLang = function () {
    var cb = document.getElementById('langsw');
    return (cb && cb.checked) ? 'vi' : 'ko';
  };
  /* 통합 보기(NewDesign.html)가 iframe 안 시안의 언어를 맞출 때 쓰는 이름 */
  window.ppSetLang = function (vi) { window.ipSetLang(vi ? 'vi' : 'ko'); };

  var observer = null;
  function observe(root) {
    if (observer) return;
    observer = new MutationObserver(function () {
      observer.disconnect();
      applyI18n(root);
      observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
    });
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
  }

  /* 번들이 다 그려질 때까지 기다린다 — 노드 수가 멈추면 그린 것으로 본다 */
  function waitForContent() {
    var tries = 0, last = -1, stable = 0;
    var iv = setInterval(function () {
      var root = document.getElementById('dc-root');
      tries++;
      if (root) {
        var count = root.querySelectorAll('*').length;
        if (count > 50 && count === last) stable++; else stable = 0;
        last = count;
        if (stable >= 5) { clearInterval(iv); applyI18n(root); observe(root); return; }
      }
      if (tries > 600) {
        clearInterval(iv);
        if (root) { applyI18n(root); observe(root); }
      }
    }, 100);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') waitForContent();
  else document.addEventListener('DOMContentLoaded', waitForContent);
})();
