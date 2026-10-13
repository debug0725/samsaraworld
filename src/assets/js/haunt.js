/* ================================================================
   卷三 「굴지의 서문」 — 망량이 끼어드는 이야기
   읽는 동안 VHS 잡음이 깔리고, 오른쪽 아래로 재난문자와 메시지가 쏟아지기 시작해요(5개씩 끊어서).
   문자가 거세질수록 글자가 깨지고, 끝에 이르면 아무것도 읽을 수 없게 돼요.
   그리고 한순간 — 아무 일도 없었던 것처럼 돌아와요.

   ✏️ 고칠 수 있는 것
   · ALERTS : 정해진 순서로 오는 문자 (t = 열고 나서 몇 초 뒤 / kind = 재난문자 종류 / from = 보낸 사람 → 메시지로 와요)
   · FLOOD  : 마지막에 미친 듯이 쏟아지는 문자들 (FLOOD_T 초부터 END 직전까지)
   · VHS    : true 면 페이지 위에 VHS 잡음 · 주사선 · 테이프 표시 · 화면 울렁임까지 / false 면 글자만 깨져요
              (재난문자 카드가 지직거리는 건 어느 쪽이든 그대로예요)
   ================================================================ */
window.Haunt = (function () {
  const VHS = true;
  const PACE = .94;   // 전체 진행 속도 (1 = 원래대로, 낮을수록 빨리 끝나요) — 지금은 약 3초 짧게
  const VHS_LV = [0, .1, .26, .5, .74, 1];   // 단계별 VHS 세기 (글자가 깨질수록 짙어져요)
  const ALERTS = [
    { t: 6, lv: 1, kind: '안전안내문자', body: '금일 04시~05시 서울 전역 이상 기상 관측. 창문을 닫고 새벽 시간 외출을 자제하여 주시기 바랍니다.' },
    { t: 10, kind: '안전안내문자', body: '서울 일부 지역 정전 발생. 촛불을 켜지 마십시오. 불빛 앞에 서지 마십시오.' },
    { t: 14, lv: 2, kind: '긴급재난문자', body: '한강 교량 일대 정체불명의 짙은 안개 발생. 다리 위 정차를 금합니다. 안개 속에서 이름을 부르는 소리에 대답하지 마십시오.' },
    { t: 17, from: '조부', body: '얘야' },
    { t: 19, kind: '긴급재난문자', body: '서울 전역 까마귀 떼 출현. 창밖을 내다보지 마십시오.' },
    { t: 21.5, from: '조부', body: '살려 줘' },
    { t: 23, lv: 3, from: '알 수 없음', body: '문 열어 주세요' },
    { t: 24.5, kind: '긴급재난문자', body: '사대문 일대 결계 일부 소실 확인. 가족이 아닌 사람에게 문을 열어 주지 마십시오. 가족이라도 목소리를 먼저 확인하십시오.' },
    { t: 26, from: '조부', body: '살려 줘 여기 너무 어두워' },
    { t: 27.5, from: '알 수 없음', body: '죽어 죽어 죽어 죽어' },
    { t: 29, from: '알 수 없음', body: '문 열어 주세요 문 열어 주세요 안에 있는 거 알아요' },
    { t: 30.5, lv: 4, kind: '위급재난문자', body: '집 안의 거울을 모두 덮으십시오. 거울 속 당신이 먼저 움직였다면 즉시 눈을 감고 그대로' },
    { t: 31.8, from: '조부', body: '살려 줘 살려 줘 살려 줘' },
    { t: 33, from: '알 수 없음', body: '죽어 죽어 죽어 죽어 죽어 죽어 죽어 죽어 죽어 죽어' },
    { t: 34.2, kind: '위급재난문자', body: '사망자의 번호로 오는 연락에 답하지 마십시오.' },
    { t: 35.4, from: '조부', body: '왜 문을 안 열어 주니' },
    { t: 36.5, lv: 5, kind: '위급재난문자', body: '문이 열렸습니다 문이 열렸습니다 문이 열렸습니다 서문 서문 서문 어디 있어 어디 있어 어디' }
  ];
  const FLOOD_T = 37.5, END = 56;
  const FLOOD = [
    { from: '조부', body: '살려 줘' }, { from: '조부', body: '살려 줘 살려 줘 살려 줘 살려 줘' }, { from: '조부', body: '얘야 문 열어라' }, { from: '조부', body: '춥다' },
    { from: '알 수 없음', body: '죽어 죽어 죽어 죽어' }, { from: '알 수 없음', body: '죽어 죽어 죽어 죽어 죽어 죽어 죽어 죽어 죽어 죽어 죽어 죽어' },
    { from: '알 수 없음', body: '문 열어 주세요' }, { from: '알 수 없음', body: '문 열어 주세요 문 열어 주세요 문 열어 주세요' }, { from: '알 수 없음', body: '뒤에 있어요' },
    { kind: '위급재난문자', body: '문이 열렸습니다' }, { kind: '위급재난문자', body: '대피하지 마십시오 이미 늦었습니다' }, { kind: '긴급재난문자', body: '결계 소실 결계 소실 결계 소실' }
  ];
  const AFTER = { from: '알 수 없는 이용자', body: '아직 때가 아니야' };   // 다 끝나고 마지막으로 오는 메시지

  const GL = '░▒▓', HJ = '魍魎鬼門血丹巫冥咒祟煞';
  const ZA = [...'̣̤̥̦̀́̃̈̊͆͒͗͝͡'];   // 위아래 점·삐침만 (밑줄·취소선처럼 보이는 표시는 뺐어요)
  const PERSIST = [0, 0, .006, .04, .16, .58];  // 레벨별: 늘 깨져 있는 글자 비율
  const ZAL = [0, 0, 0, .015, .07, .32];         // 레벨별: 글자에 엉겨 붙는 잔상 비율
  const R = Math.random, pick = a => a[Math.floor(R() * a.length)];
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let S = null, HAN = [...'魍魎'], POOL = [...'서문망량귀신피문'];  // 깨질 때 섞여 들어갈 글자 (본문에 이미 있는 글자만 써서 글꼴이 깨지지 않아요)

  function bad(str, p, z) {
    let o = '';
    for (const c of str) {
      if (/\s/.test(c)) { o += c; continue; }
      let ch = c;
      if (R() < p) { const k = R(); ch = k < .82 ? pick(POOL) : k < .95 ? pick(HAN) : pick(GL); }
      if (R() < z) ch = R() < .5 ? ch + ch : '';   // 글자가 겹쳐 번지거나 통째로 빠져요
      o += ch;
    }
    return o;
  }
  function texts(root) {
    const out = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => n.data.trim() ? 1 : 2 });
    while (w.nextNode()) out.push({ n: w.currentNode, o: w.currentNode.data });
    return out;
  }
  const restore = list => list.forEach(t => { if (t.n.data !== t.o) t.n.data = t.o; });

  function grain(cv) {
    const x = cv.getContext('2d'), W = cv.width = 360, H = cv.height = 200, img = x.createImageData(W, H), d = img.data;
    return () => { for (let i = 0; i < d.length; i += 4) { const v = R() * 255 | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } x.putImageData(img, 0, 0); };
  }
  const clock = s => { const t = 4 * 3600 + 44 * 60 + s; return `AM ${String(Math.floor(t / 3600)).padStart(2, '0')}:${String(Math.floor(t / 60) % 60).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; };

  function alert(a, broken) {
    const el = document.createElement('div');
    if (a.from) {   // 개인 메시지 (조부 · 알 수 없음)
      el.className = `hx-al sms ${a.from.startsWith('알 수 없') ? 'unknown' : ''} ${broken ? 'broken' : ''}`;
      el.innerHTML = `<div class="hd"><span class="av"></span><span class="who"><b></b><small>메시지</small></span><time>지금</time></div><p></p>`;
      if (a.from === '조부') {   // 조부의 이름은 검은 네모 두 칸 — 그 안에서 글자가 쉼 없이 바뀌어요
        el.classList.add('redacted');
        el.querySelector('.av').textContent = '';
        el.querySelector('b').innerHTML = '<i class="rd-x2"></i><i class="rd-x2"></i>';
      } else {
        el.querySelector('.av').textContent = a.from.startsWith('알 수 없') ? '?' : a.from[0];
        el.querySelector('b').textContent = a.from;
      }
    } else {
      el.className = `hx-al ${a.kind === '위급재난문자' ? 'grave' : a.kind === '긴급재난문자' ? 'urgent' : ''} ${broken ? 'broken' : ''}`;
      el.innerHTML = `<div class="hd"><span class="ic">!</span><b></b><time>지금</time></div><p></p>`;
      el.querySelector('b').textContent = a.kind;
    }
    el.querySelector('p').textContent = a.body;
    // 5개가 차면 한꺼번에 지직 하고 사라지고, 다음 5개가 쌓여요
    const live = [...S.box.querySelectorAll('.hx-al:not(.gone)')];
    if (live.length >= 5) {
      const pos = live.map(o => [o.offsetTop, o.offsetWidth]);
      live.forEach((o, i) => { o.style.cssText += `;position:absolute;left:0;top:${pos[i][0]}px;width:${pos[i][1]}px;animation-delay:${i * .03}s`; o.classList.add('gone'); setTimeout(() => o.remove(), 700); });
    }
    S.box.appendChild(el);
    if (navigator.vibrate && S.lv >= 2) try { navigator.vibrate(S.lv >= 4 ? [80, 60, 80, 60, 160] : [60, 50, 60]); } catch (e) {}
    S.alertTexts = S.alertTexts.filter(t => t.n.isConnected).concat(texts(el).map(t => Object.assign(t, { sms: !!a.from })));
    return el;
  }
  function setLv(lv) {
    S.lv = lv; S.r.dataset.hx = lv;
    S.layer.style.setProperty('--gr', [.035, .045, .06, .08, .11, .15][lv]);
  }
  function burst(p, ms) {
    const t = pick(S.body); if (!t) return;
    t.n.data = bad(t.o, p, p / 3);
    setTimeout(() => { if (S && S.lv < 3) t.n.data = t.o; }, ms);
  }

  // 글리치 — 세기(S.v)에 따라: 평소엔 색이 살짝 어긋나 있다가, 순간순간 화면이 가로로 찢어지고 글자가 오른쪽으로 죽 끌려가요
  function vhsFilter() {
    const v = S.v, f = S.f; if (!f) return;
    if (S.hold > 0) { S.hold--; return; }                              // 찢어진 순간을 한두 박자 붙잡아요
    const quiet = reduced() || v < .05;
    const big = !quiet && v > .65 && R() < .07;                       // 크게 한 번 찢어짐
    const tear = !quiet && (big || R() < v * .32);
    const d = v * 2.4 + (tear ? R() * v * 9 : 0);                      // 색 갈라짐
    f.ro.setAttribute('dx', d.toFixed(2)); f.bo.setAttribute('dx', (-d * .8).toFixed(2));
    if (tear) {
      f.tb.setAttribute('seed', (R() * 999) | 0);                     // 찢어지는 줄을 매번 새로
      f.tb.setAttribute('baseFrequency', `0.0001 ${(.012 + R() * .05).toFixed(3)}`);
      f.tear.setAttribute('scale', ((big ? 260 : 40 + R() * 150) * v).toFixed(0));
      f.smb.setAttribute('stdDeviation', `${(6 + R() * 26 * v).toFixed(1)} 0`);   // 오른쪽으로 끌린 잔상
      f.smo.setAttribute('dx', (10 + R() * 40 * v).toFixed(0));
      f.smm.setAttribute('values', `1 0 0 0 0  0 .25 0 0 0  0 0 .3 0 0  0 0 0 ${(.35 + v * .4).toFixed(2)} 0`);
      S.r.classList.add('hx-jolt'); S.hold = big ? 2 : (R() < .4 ? 1 : 0);
    } else {
      f.tear.setAttribute('scale', '0'); f.smb.setAttribute('stdDeviation', '0 0'); f.smo.setAttribute('dx', '0');
      f.smm.setAttribute('values', `1 0 0 0 0  0 .25 0 0 0  0 0 .3 0 0  0 0 0 ${(v * .06).toFixed(3)} 0`);
      S.r.classList.remove('hx-jolt');
    }
  }
  // 조부 이름 칸: 검은 네모 속 글자가 쉼 없이 바뀌어요
  function redactTick() { S.box.querySelectorAll('.rd-x2').forEach(i => { i.textContent = R() < .5 ? pick(HAN.length ? HAN : HJ) : pick(POOL); }); }
  function frame(now) {
    if (!S || !S.r.isConnected) return stop();
    const sec = (now - S.t0) / 1000 / PACE, dt = Math.min(.1, (now - (S.lastT || now)) / 1000); S.lastT = now;
    // VHS 세기: 단계가 오를 때마다 천천히 따라 올라가요
    if (VHS) {
      S.v += ((S.tear ? 1 : S.done ? 0 : VHS_LV[S.lv]) - S.v) * Math.min(1, dt * .7);
      if (Math.abs(S.v - S.vShown) > .003) { S.vShown = S.v; S.r.style.setProperty('--v', S.v.toFixed(3)); S.r.classList.toggle('vhs-on', S.v > .02); }
      if (S.v > .05 && now - S.lastG > 70) { S.drawGrain(); S.lastG = now; }
      if (now - S.lastF > 90) { S.lastF = now; vhsFilter(); }
    }
    if (now - (S.lastR || 0) > 70) { S.lastR = now; redactTick(); }
    // 재난문자가 하나씩 와요
    while (S.ai < ALERTS.length && sec >= ALERTS[S.ai].t) { const a = ALERTS[S.ai++]; if (a.lv) setLv(a.lv); alert(a, a.lv >= 5); }
    // 마지막엔 미친 듯이 쏟아져요
    if (!S.done && sec >= FLOOD_T && sec < END - 1 && now >= S.nextF) { alert(pick(FLOOD), R() < .6); S.nextF = now + 380 + R() * 520; }
    // 글자가 깨져요
    if (!S.done && now - S.lastC > (S.lv >= 3 ? 120 : 700)) {
      S.lastC = now;
      if (S.lv >= 3) {
        const p = PERSIST[S.lv], z = ZAL[S.lv];
        S.body.forEach(t => { t.n.data = bad(t.o, p, z); });
        // 메시지(살려 줘 · 죽어 · 문 열어 주세요)는 반쯤만 깨져서 겨우 읽혀요
        if (S.lv >= 4) S.alertTexts.forEach(t => { t.n.data = bad(t.o, p * (S.lv >= 5 ? 1 : .4) * (t.sms ? .45 : 1), z * (t.sms ? .5 : 1)); });
        if (S.lv >= 4) document.title = bad(S.title, p, 0);
      } else if (S.lv >= 1 && R() < (S.lv === 1 ? .35 : .7)) burst(S.lv === 1 ? .22 : .35, 160 + R() * 160);
      if (S.big && S.lv >= 3) S.big.textContent = R() < .25 + S.lv * .08 ? pick(HJ) : S.bigO;
    }
    // OSD
    const s = Math.floor(sec);
    if (s !== S.lastS) { S.lastS = s; S.tc.textContent = S.lv >= 5 && !S.done ? bad(clock(s), .5, .3) : clock(s); }
    // 끝 — 한순간 끊겼다가 아무 일 없었던 것처럼
    // 절정 — 망량이 화면을 찢고 터져 나와요 (assets/video/mangryang.mp4), 영상이 끝나면 아무 일 없었던 것처럼
    if (!S.done && sec >= END) {
      S.done = true; S.tear = true; S.r.classList.add('hx-cut');
      const tv = S.tv; let fired = false;
      const back = () => {
        if (fired || !S) return; fired = true; S.tear = false;
        if (tv) { tv.classList.remove('on'); tv.pause(); }
        restore(S.body); restore(S.alertTexts); document.title = S.title;
        if (S.big) S.big.textContent = S.bigO;
        S.v = 0; S.vShown = 0; S.r.style.setProperty('--v', '0'); S.r.classList.remove('vhs-on'); S.f.tear.setAttribute('scale', '0'); S.r.classList.remove('hx-jolt');   // 한순간에 깨끗하게
        S.box.querySelectorAll('.hx-al').forEach(a => a.remove());
        setLv(0); S.r.classList.remove('hx-cut'); S.r.classList.add('hx-after');
        S.osd.querySelector('.st').textContent = '■ STOP';
        setTimeout(() => S && alert(AFTER, false), 1600);
      };
      if (tv && tv.readyState >= 2 && !reduced()) {
        try { tv.currentTime = TEAR_FROM; } catch (e) {}
        tv.classList.add('on'); tv.onended = back;
        const p = tv.play(); if (p && p.catch) p.catch(() => setTimeout(back, 260));
        setTimeout(back, ((tv.duration || 5.4) - TEAR_FROM + .8) * 1000);   // 혹시 끝 신호가 안 와도
      } else setTimeout(back, 260);
    }
    S.raf = requestAnimationFrame(frame);
  }

  function start(r) {
    stop();
    const main = r.querySelector('.rd-main');
    const layer = document.createElement('div'); layer.className = 'hx-layer'; layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = `<span class="hx-tint"></span><canvas class="hx-grain"></canvas><span class="hx-scan"></span><span class="hx-band"></span><span class="hx-vig"></span>
      <div class="hx-osd"><span class="tl"><span class="st">▶ PLAY</span></span><span class="tr">SP</span><span class="bl"></span></div>
      <svg width="0" height="0" style="position:absolute"><filter id="hxRGB" x="-15%" y="-3%" width="130%" height="106%" color-interpolation-filters="sRGB">
        <feTurbulence class="f-tb" type="fractalNoise" baseFrequency="0.0001 0.03" numOctaves="1" seed="3" result="tb"/>
        <feComponentTransfer in="tb" result="bands"><feFuncR type="discrete" tableValues=".5 .5 1 .5 0 .5 .5 .95 .5 .2 .5"/><feFuncG type="discrete" tableValues=".5"/></feComponentTransfer>
        <feDisplacementMap class="f-tear" in="SourceGraphic" in2="bands" scale="0" xChannelSelector="R" yChannelSelector="G" result="w"/>
        <feColorMatrix in="w" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r"/><feOffset class="f-ro" in="r" dx="0" dy="0" result="ro"/>
        <feColorMatrix in="w" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g"/>
        <feColorMatrix in="w" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b"/><feOffset class="f-bo" in="b" dx="0" dy="0" result="bo"/>
        <feBlend in="ro" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="bo" mode="screen" result="rgb"/>
        <feGaussianBlur class="f-smb" in="w" stdDeviation="0 0" result="sm"/><feOffset class="f-smo" in="sm" dx="0" dy="0" result="smo"/>
        <feColorMatrix class="f-smm" in="smo" type="matrix" values="1 0 0 0 0  0 .25 0 0 0  0 0 .3 0 0  0 0 0 0 0" result="sm2"/>
        <feBlend in="rgb" in2="sm2" mode="screen"/>
      </filter></svg>`;
    r.appendChild(layer);
    const box = document.createElement('div'); box.className = 'hx-alerts'; box.setAttribute('role', 'status'); r.appendChild(box);
    const big = r.querySelector('.rd-side .big');
    const q = s => layer.querySelector(s);
    S = { r, layer, box, osd: q('.hx-osd'), tc: q('.hx-osd .bl'), v: 0, vShown: -1, lastF: 0, tv: q('.hx-tear'), tear: false,
      f: { tb: q('.f-tb'), tear: q('.f-tear'), ro: q('.f-ro'), bo: q('.f-bo'), smb: q('.f-smb'), smo: q('.f-smo'), smm: q('.f-smm') }, hold: 0,
      body: texts(main).filter(t => !t.n.parentElement.closest('.rd-nav')), alertTexts: [], title: document.title, big, bigO: big ? big.textContent : '',
      drawGrain: grain(layer.querySelector('.hx-grain')), t0: performance.now(), lastG: 0, lastC: 0, lastS: -1, nextF: 0, ai: 0, lv: 0, done: false };
    POOL = [...new Set([...main.textContent].filter(c => /[가-힣]/.test(c)))];
    HAN = [...new Set([...document.body.textContent].filter(c => /[一-鿿]/.test(c)))];
    r.classList.add('hx'); r.classList.toggle('no-vhs', !VHS); setLv(0);
    S.raf = requestAnimationFrame(frame);
  }
  function stop() {
    if (!S) return;
    cancelAnimationFrame(S.raf);
    restore(S.body); document.title = S.title;
    if (S.big) S.big.textContent = S.bigO;
    S.layer.remove(); S.box.remove();
    S.r.classList.remove('hx', 'hx-cut', 'hx-after', 'no-vhs', 'vhs-on'); S.r.style.removeProperty('--v'); delete S.r.dataset.hx;
    S = null;
  }
  // 확인용: Haunt.seek(40) → 열고 40초 지난 시점으로 건너뛰기
  const seek = s => { if (S) S.t0 = performance.now() - s * 1000 * PACE; };
  return { start, stop, seek };
})();
