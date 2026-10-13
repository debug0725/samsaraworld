/* ================================================================
   卷一 「서녘의 문」 여는 영상 (assets/video/west.mp4)
   ① 영상이 화면 가득 재생되고, 빛나는 나비(넋) 몇 마리가 소녀 곁을 맴돌아요
   ② 영상 속 검은 띠가 덮쳐 올 때, 가장자리에서 먹 안개가 밀려들고 소녀에게서 빛나는 나비 떼가 날아올라요
   ③ 화면이 완전히 검게 덮이면 그 아래로 이야기 창이 열리고
   ④ 안개가 갈라지며 걷히고, 나비들은 페이지 위로 흩어져 날아가요
   SKIP 버튼 / Esc 로 건너뛸 수 있어요.

   ✏️ 고칠 수 있는 것: COVER(먹 안개가 밀려들기 시작하는 영상 시각, 초) / FLOCK(터져 나오는 나비 수) / AMBIENT(맴도는 나비 수)
   ================================================================ */
window.Intro = (function () {
  const BURN_LEAD = 1.0, COVER = 3.8, COVER_DUR = 1.15, REVEAL_DUR = 1.6, FLOCK = 0, AMBIENT = 0;   // 나비는 뺐어요 (다시 넣으려면 숫자만 올리면 돼요)
  const R = Math.random, TAU = Math.PI * 2;
  const ease = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cache = {};
  // 미리 불러 둬서 카드를 누르면 바로 나오게
  function preload(src) { if (cache[src]) return cache[src]; const v = document.createElement('video'); v.src = src; v.muted = true; v.playsInline = true; v.preload = 'auto'; v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.load(); return cache[src] = v; }

  /* ---------- 붉은 빛나비 (넋) ----------
     몽환적인 반투명 나비. 날개 가장자리에서 붉은 빛이 붓질처럼 안쪽으로 번져 들고,
     속은 고운 입자로 비치며, 테두리엔 가는 빛 심이 흘러요. 몸통도 투명하게 빛나요.
     날개 한 장 한 장은 처음에 한 번만 빛 그림으로 구워 두고, 날갯짓할 때 3D 로 접었다 펴요. */
  const GLOW = { core: '255,226,230', edge: '255,92,110', hue: '220,24,48' };   // 붉은 빛. 푸른 넋빛: { core:'255,255,255', edge:'196,226,255', hue:'120,170,255' }
  const TILT = .55;                              // 내려다보는 각도
  const SP = Math.sin(TILT), CP = Math.cos(TILT);
  function forePath(c) {
    c.beginPath(); c.moveTo(.02, -.08);
    c.bezierCurveTo(.2, -.7, .75, -1.02, 1.06, -.88);
    c.bezierCurveTo(1.2, -.72, 1.08, -.4, .92, -.24);
    c.bezierCurveTo(.72, -.07, .4, -.01, .04, 0); c.closePath();
  }
  function hindPath(c) {
    c.beginPath(); c.moveTo(.04, .02);
    c.bezierCurveTo(.46, -.04, .86, .12, .84, .42);
    c.bezierCurveTo(.82, .68, .56, .88, .32, .84);
    c.bezierCurveTo(.17, .8, .07, .56, .02, .3); c.closePath();
  }
  const VEINS = {
    fore: [[1.02, -.86, .45, -.6], [1.06, -.62, .55, -.4], [.95, -.32, .5, -.2], [.66, -.1, .34, -.05]],
    hind: [[.8, .3, .4, .1], [.7, .64, .36, .3], [.4, .8, .2, .4]]
  };
  // 날개 한 장을 빛 그림으로 구워요 — 날개 끝(바깥)일수록 밝고, 몸 쪽으로 갈수록 투명하게 사라져요
  const sprites = {};
  function bake(kind) {
    if (sprites[kind]) return sprites[kind];
    const fore = kind === 'fore', P = new Path2D(), pp = { moveTo: (...a) => P.moveTo(...a), bezierCurveTo: (...a) => P.bezierCurveTo(...a), closePath: () => P.closePath(), beginPath() {} };
    (fore ? forePath : hindPath)(pp);
    const x0 = -.2, y0 = fore ? -1.2 : -.2, w = fore ? 1.55 : 1.25, h = fore ? 1.45 : 1.25, PX = 240, W = Math.ceil(w * PX), H = Math.ceil(h * PX);
    const mk = () => { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d'); g.setTransform(PX, 0, 0, PX, -x0 * PX, -y0 * PX); g.lineJoin = 'round'; g.lineCap = 'round'; return [cv, g]; };
    const px = n => n / PX, inside = (g, x, y) => g.isPointInPath(P, (x - x0) * PX, (y - y0) * PX);
    const [cv, g] = mk(), [ev, e] = mk();
    // ── 빛 층 (가장자리 빛 · 붓질 · 입자 · 테두리) — 나중에 몸 쪽으로 갈수록 지워요
    e.filter = 'blur(12px)'; e.strokeStyle = `rgba(${GLOW.hue},.6)`; e.lineWidth = .12; e.stroke(P); e.filter = 'none';   // 바깥 번짐
    e.save(); e.clip(P);
    e.filter = 'blur(13px)'; e.strokeStyle = `rgba(${GLOW.edge},.95)`; e.lineWidth = .36; e.stroke(P);                    // 안으로 번져 드는 빛 띠
    e.filter = 'blur(4px)'; e.strokeStyle = `rgba(${GLOW.core},.6)`; e.lineWidth = .09; e.stroke(P); e.filter = 'none';
    const a0 = fore ? -1.62 : -.05, a1 = fore ? .02 : 1.62;
    e.filter = 'blur(1.2px)';
    for (let i = 0; i < 160; i++) {                                                                                    // 붓질 같은 빛줄
      const a = a0 + R() * (a1 - a0); let r = .05;
      while (r < 1.5 && inside(e, Math.cos(a) * r, Math.sin(a) * r)) r += .008;
      if (r < .25) continue;
      const ex = Math.cos(a) * r, ey = Math.sin(a) * r, len = .1 + R() * .42, sx = Math.cos(a + (R() - .5) * .06) * (r - len), sy = Math.sin(a + (R() - .5) * .06) * (r - len);
      const lg = e.createLinearGradient(ex, ey, sx, sy); lg.addColorStop(0, `rgba(${GLOW.core},${.3 + R() * .55})`); lg.addColorStop(.5, `rgba(${GLOW.edge},${.15 + R() * .2})`); lg.addColorStop(1, `rgba(${GLOW.edge},0)`);
      e.strokeStyle = lg; e.lineWidth = px(1 + R() * 4); e.beginPath(); e.moveTo(ex, ey); e.lineTo(sx, sy); e.stroke();
    }
    e.filter = 'none';
    for (let i = 0; i < 5200; i++) {                                                                                   // 반짝이는 고운 입자
      const x = x0 + R() * w, y = y0 + R() * h;
      e.fillStyle = `rgba(${R() < .65 ? GLOW.edge : GLOW.core},${.06 + R() * .32})`; e.fillRect(x, y, px(1.3), px(1.3));
    }
    e.restore();
    e.strokeStyle = `rgba(${GLOW.edge},.45)`; e.lineWidth = px(4); e.stroke(P);                                           // 가는 빛 심 테두리
    e.strokeStyle = `rgba(${GLOW.core},.85)`; e.lineWidth = px(1.4); e.stroke(P);
    // 몸 쪽으로 갈수록 빛이 사그라져요 (날개 끝만 환하게)
    e.globalCompositeOperation = 'destination-in';
    const fade = e.createRadialGradient(0, 0, 0, 0, 0, fore ? 1.25 : 1.02);
    fade.addColorStop(0, 'rgba(0,0,0,.1)'); fade.addColorStop(.4, 'rgba(0,0,0,.35)'); fade.addColorStop(.78, 'rgba(0,0,0,1)'); fade.addColorStop(1, 'rgba(0,0,0,1)');
    e.fillStyle = fade; e.fillRect(x0, y0, w, h); e.globalCompositeOperation = 'source-over';
    // ── 날개 본체: 아주 옅은 반투명 막 + 날개맥, 그 위에 빛 층
    g.save(); g.clip(P);
    const rg = g.createRadialGradient(0, 0, 0, 0, 0, fore ? 1.2 : 1);
    rg.addColorStop(0, `rgba(${GLOW.hue},.03)`); rg.addColorStop(.7, `rgba(${GLOW.hue},.09)`); rg.addColorStop(1, `rgba(${GLOW.edge},.16)`);
    g.fillStyle = rg; g.fillRect(x0, y0, w, h);
    g.beginPath(); (fore ? VEINS.fore : VEINS.hind).forEach(([x, y, qx, qy]) => { g.moveTo(.04, 0); g.quadraticCurveTo(qx, qy, x, y); });
    g.strokeStyle = `rgba(${GLOW.core},.18)`; g.lineWidth = px(1.4); g.stroke();
    g.restore();
    g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(ev, 0, 0);
    return sprites[kind] = { cv, x0, y0, w, h };
  }
  function wing(c, side, theta, hind, a) {
    const ct = Math.cos(theta), st = Math.sin(theta), sp = bake(hind ? 'hind' : 'fore');
    c.save(); c.transform(side * ct, -st * SP, 0, CP, 0, 0);
    if (hind) c.scale(.9, .92);
    c.globalAlpha = a * (.5 + .5 * Math.abs(ct));                 // 비스듬히 누울수록 살짝 흐려져요
    c.drawImage(sp.cv, sp.x0, sp.y0, sp.w, sp.h);
    c.restore();
  }
  let haloImg = null;
  function halo() {
    if (haloImg) return haloImg;
    haloImg = document.createElement('canvas'); haloImg.width = haloImg.height = 128;
    const g = haloImg.getContext('2d'), rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    rg.addColorStop(0, `rgba(${GLOW.edge},.42)`); rg.addColorStop(.35, `rgba(${GLOW.hue},.14)`); rg.addColorStop(1, `rgba(${GLOW.hue},0)`);
    g.fillStyle = rg; g.fillRect(0, 0, 128, 128);
    return haloImg;
  }
  function butterfly(c, b, a) {
    const fore = b.glide > 0 ? .32 : .55 + .7 * Math.sin(b.ph);
    const hind = b.glide > 0 ? .26 : .55 + .7 * Math.sin(b.ph - .45);
    c.save(); c.globalCompositeOperation = 'lighter';
    c.globalAlpha = a * .9; const hs = b.s * 4.6; c.drawImage(halo(), b.x - hs / 2, b.y - hs / 2, hs, hs);   // 빛무리
    c.translate(b.x, b.y); c.rotate(b.dir + Math.PI / 2); c.scale(b.s, b.s);
    wing(c, 1, hind + b.roll * .25, true, a); wing(c, -1, hind - b.roll * .25, true, a);
    wing(c, 1, fore + b.roll * .25, false, a); wing(c, -1, fore - b.roll * .25, false, a);
    // 투명하게 빛나는 몸통 + 더듬이
    c.save(); c.scale(1, CP + .1); c.lineCap = 'round';
    c.globalAlpha = a * .5; c.strokeStyle = `rgba(${GLOW.edge},.6)`; c.lineWidth = .12; c.beginPath(); c.moveTo(0, -.28); c.lineTo(0, .42); c.stroke();
    c.globalAlpha = a; c.strokeStyle = `rgba(${GLOW.core},.55)`; c.lineWidth = .02; c.beginPath(); c.moveTo(0, -.3); c.lineTo(0, .4); c.stroke();
    c.strokeStyle = `rgba(${GLOW.edge},.55)`; c.lineWidth = .01; c.beginPath();
    c.moveTo(.01, -.32); c.quadraticCurveTo(.08, -.6, .17, -.76); c.moveTo(-.01, -.32); c.quadraticCurveTo(-.08, -.6, -.17, -.76); c.stroke();
    c.restore();
    c.restore();
  }
  // 날갯짓마다 흩날리는 빛가루
  function dust(list, b) {
    if (list.length > 600) return;
    for (let i = 0; i < 2; i++) {
      const ang = b.dir + Math.PI / 2 + (R() - .5) * 2.4, r = b.s * (.3 + R() * .8);
      list.push({ x: b.x + Math.cos(ang) * r, y: b.y + Math.sin(ang) * r * .6, vx: (R() - .5) * 14 - Math.cos(b.dir) * 10, vy: 6 + R() * 16,
        s: .5 + R() * 1.3, t: 0, life: .7 + R() * 1.1, tw: R() * TAU });
    }
  }
  function drawDust(c, list, dt) {
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let i = list.length - 1; i >= 0; i--) {
      const d = list[i]; d.t += dt; if (d.t >= d.life) { list.splice(i, 1); continue; }
      d.x += d.vx * dt; d.y += d.vy * dt;
      const a = (1 - d.t / d.life) * (.55 + .45 * Math.sin(d.tw + d.t * 18));
      c.globalAlpha = a * .25; c.fillStyle = `rgb(${GLOW.hue})`; c.beginPath(); c.arc(d.x, d.y, d.s * 3, 0, TAU); c.fill();
      c.globalAlpha = a; c.fillStyle = `rgb(${GLOW.core})`; c.beginPath(); c.arc(d.x, d.y, d.s * .7, 0, TAU); c.fill();
    }
    c.restore();
  }
  // 나는 법: 느리고 크게 날갯짓 → 날개를 편 채 미끄러지듯 활공 → 다시 몇 번 날갯짓. 방향은 부드럽게 휘어져요
  function fly(b, dt) {
    b.t += dt;
    if (b.glide > 0) b.glide -= dt;
    else { b.ph += dt * TAU / b.period; if (b.ph > b.nextGlide) { b.glide = .5 + R() * .8; b.nextGlide = b.ph + TAU * (2 + R() * 3); } }
    let turn = Math.sin(b.t * .6 + b.o) * .7 + Math.sin(b.t * 1.5 + b.o * 3) * .25;
    if (b.mode === 'home') {
      const dx = b.cx - b.x, dy = b.cy - b.y;
      if (Math.hypot(dx, dy) > b.rad) { const diff = ((Math.atan2(dy, dx) - b.dir + Math.PI) % TAU + TAU) % TAU - Math.PI; turn += diff * 1.4; }
    }
    b.dir += turn * dt;
    b.speed = Math.max(b.vmin, Math.min(b.vmax, b.speed + (b.glide > 0 ? -22 : 18) * dt));
    const bob = b.glide > 0 ? 8 : -Math.cos(b.ph) * 26;                      // 내려칠 때 살짝 떠오르고, 활공할 땐 천천히 내려앉아요
    b.x += Math.cos(b.dir) * b.speed * dt; b.y += Math.sin(b.dir) * b.speed * dt + bob * dt * (b.s / 24);
    b.roll = Math.sin(b.t * 1.1 + b.o) * .45 + turn * .18;
    if (b.mode === 'out') b.s *= 1 + dt * b.grow;
  }

  /* ---------- 먹 안개 ---------- */
  let smokeImg = null;
  function smokeSprite() {
    if (smokeImg) return smokeImg;
    smokeImg = document.createElement('canvas'); smokeImg.width = smokeImg.height = 160;
    const g = smokeImg.getContext('2d');
    for (let i = 0; i < 7; i++) {   // 몇 덩이를 겹쳐 울퉁불퉁한 연기 덩이로
      const x = 80 + (R() - .5) * 50, y = 80 + (R() - .5) * 50, r = 30 + R() * 45, rg = g.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, 'rgba(0,0,0,.55)'); rg.addColorStop(.6, 'rgba(4,2,3,.25)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = rg; g.fillRect(0, 0, 160, 160);
    }
    return smokeImg;
  }

  function play(src, onCovered) {
    if (reduced()) { onCovered(); return; }
    const v = preload(src);
    const ov = document.createElement('div'); ov.className = 'intro-ov'; ov.setAttribute('aria-hidden', 'true');
    const cv = document.createElement('canvas'); cv.className = 'intro-fx';
    const skip = document.createElement('button'); skip.className = 'intro-skip'; skip.type = 'button'; skip.textContent = 'SKIP ▸';
    // 영상은 따로 띄워 검은 바탕이 비치게(screen) 하고, 먹 안개·건너뛰기는 그 위 평범한 층에
    const vl = document.createElement('div'); vl.className = 'intro-vl'; vl.setAttribute('aria-hidden', 'true');
    v.className = 'intro-vid'; try { v.currentTime = 0; } catch (e) {}
    vl.appendChild(v); ov.append(cv, skip); document.body.append(vl, ov); document.body.classList.add('no-scroll');
    const W = innerWidth, H = innerHeight, dpr = Math.min(1.5, devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr; const c = cv.getContext('2d'); c.scale(dpr, dpr);
    const smoke = smokeSprite(), cx = W / 2, cy = H * .5;
    let flies = [], motes = [], puffs = [], ribbons = [], phase = 'film', pT = 0, last = performance.now(), raf = 0, done = false, opened = false;

    const fly0 = o => Object.assign({ t: 0, o: R() * TAU, ph: R() * TAU, glide: 0, nextGlide: TAU * (1 + R() * 2), roll: 0, a: 0, delay: 0 }, o);
    for (let i = 0; i < AMBIENT; i++) {   // 소녀 곁을 천천히 맴도는 나비
      const ang = R() * TAU;
      flies.push(fly0({ mode: 'home', x: cx + Math.cos(ang) * W * .2, y: H * .45 + Math.sin(ang) * H * .22, dir: ang + Math.PI / 2, speed: 60 + R() * 30, vmin: 40, vmax: 105,
        s: 32 + R() * 12, period: .42 + R() * .14, cx: cx + (R() - .5) * W * .1, cy: H * (.38 + R() * .14), rad: Math.min(W, H) * (.16 + R() * .08) }));
    }

    function burst() {
      for (let i = 0; i < FLOCK; i++) {   // 소녀에게서 날아올라 화면 밖으로 흩어지는 나비
        const dir = -Math.PI / 2 + (R() - .5) * 2.8;
        flies.push(fly0({ mode: 'out', x: cx + (R() - .5) * W * .1, y: H * (.42 + R() * .16), dir, speed: 140 + R() * 120, vmin: 120, vmax: 300,
          s: 16 + R() * 20, grow: .22 + R() * .3, period: .32 + R() * .1, delay: R() * .5 }));
      }
      flies.filter(f => f.mode === 'home').forEach(f => { f.mode = 'out'; f.grow = .25; f.vmin = 120; f.vmax = 280; f.dir = Math.atan2(f.y - cy, f.x - cx); });
      // 먹 띠: 가장자리에서 휘감아 들어와요
      for (let i = 0; i < 7; i++) {
        const fromL = i % 2 === 0, y0 = H * (R() * 1.1 - .05);
        ribbons.push({ x0: fromL ? -W * .2 : W * 1.2, y0, c1x: W * (.2 + R() * .6), c1y: H * (R() * 1.2 - .1), c2x: W * (.2 + R() * .6), c2y: H * (R() * 1.2 - .1),
          x1: fromL ? W * 1.15 : -W * .15, y1: H * (R() * 1.1 - .05), w: 50 + R() * 120, d: R() * .25 });
      }
    }
    function cover() { if (phase === 'film') { phase = 'cover'; pT = 0; burst(); } }
    // 영상 마지막 1초 전, 재생 중인 영상이 그대로 타들어 가며 卷一 페이지가 드러나요 (assets/js/dawn.js) — 끊김 없이 빠르게
    function burnOut() {
      if (phase !== 'film') return;
      if (!(window.Dawn && Dawn.burnSheet)) return cover();
      phase = 'burn'; opened = true; document.body.classList.remove('no-scroll'); onCovered();
      Dawn.burnSheet(document.body, { shown: true, video: v, videoAlpha: .8, tone: 'lilac', burn: 0, burnDur: 1500, onDone: () => { v.pause(); vl.remove(); } });
      vl.style.opacity = '0';   // 영상은 계속 재생돼야 하니 화면에서만 감춰요
      done = true; cancelAnimationFrame(raf); ov.remove(); removeEventListener('keydown', key);
    }
    function finishCover() {
      phase = 'reveal'; pT = 0; v.pause(); vl.remove(); ov.classList.add('clear');
      if (!opened) { opened = true; document.body.classList.remove('no-scroll'); onCovered(); }
      // 먹빛으로 덮인 화면이 그대로 타들어 가며 卷一 페이지가 드러나요 (assets/js/dawn.js)
      if (window.Dawn && Dawn.burnSheet) { Dawn.burnSheet(document.body, { black: true, tone: 'lilac', shown: true, burn: 200, burnDur: 3000 }); return end(); }
      setTimeout(end, (REVEAL_DUR + 3.2) * 1000);   // 혹시 그리기가 멈춰도 덮개는 꼭 치워요
    }
    function end() { if (done) return; done = true; cancelAnimationFrame(raf); vl.remove(); ov.remove(); removeEventListener('keydown', key); }
    const key = e => { if (e.key === 'Escape') doSkip(); };
    function doSkip() { if (phase === 'film') { burnOut(); } else if (phase === 'cover') pT = Math.max(pT, COVER_DUR * .7); }
    skip.onclick = doSkip; addEventListener('keydown', key);
    v.onended = () => burnOut();

    const pos = (rb, k) => { const u = 1 - k; return [u * u * u * rb.x0 + 3 * u * u * k * rb.c1x + 3 * u * k * k * rb.c2x + k * k * k * rb.x1, u * u * u * rb.y0 + 3 * u * u * k * rb.c1y + 3 * u * k * k * rb.c2y + k * k * k * rb.y1]; };

    function frame(now) {
      const raw = (now - last) / 1000, dt = Math.min(.05, raw); last = now; pT += Math.min(.5, raw);   // 장면 시간은 실제 시간대로 (프레임이 밀려도 제때 끝나요)
      if (phase === 'film' && v.duration && v.currentTime >= v.duration - BURN_LEAD) burnOut();
      c.clearRect(0, 0, W, H);

      if (phase === 'cover' || phase === 'reveal') {
        const k = phase === 'cover' ? Math.min(1, pT / COVER_DUR) : 1;
        // 가장자리에서 먹 안개가 밀려들어요
        if (phase === 'cover') for (let i = 0; i < 7; i++) {
          const side = (R() * 4) | 0, x = side === 0 ? -60 : side === 1 ? W + 60 : R() * W, y = side === 2 ? -60 : side === 3 ? H + 60 : R() * H;
          const ang = Math.atan2(cy - y, cx - x) + (R() - .5) * .8, sp = 260 + R() * 420;
          puffs.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, r: 90 + R() * 160, gr: 160 + R() * 220, a: .55 + R() * .35, t: 0, life: 1.6 + R() * .8, rot: R() * TAU });
        }
        // 먹 띠
        c.save(); c.lineCap = 'round'; c.strokeStyle = 'rgba(2,1,1,.85)'; c.shadowColor = 'rgba(0,0,0,.9)'; c.shadowBlur = 40;
        const rk = phase === 'cover' ? k : 1, fadeR = phase === 'reveal' ? Math.max(0, 1 - pT / (REVEAL_DUR * .6)) : 1;
        ribbons.forEach(rb => {
          const e = Math.max(0, Math.min(1, (rk - rb.d) / (1 - rb.d))); if (e <= 0) return;
          c.globalAlpha = fadeR; c.lineWidth = rb.w * (.4 + .6 * e); c.beginPath();
          for (let s = 0; s <= 24; s++) { const q = e * s / 24, [x, y] = pos(rb, q); s ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.stroke();
        });
        c.restore();
        // 완전히 덮기 / 걷히기
        if (phase === 'cover') {
          c.globalAlpha = Math.pow(ease(k), 1.6); c.fillStyle = '#020101'; c.fillRect(0, 0, W, H); c.globalAlpha = 1;
          if (k >= 1) finishCover();
        } else {
          const q = Math.min(1, pT / REVEAL_DUR), e = ease(q), D = Math.hypot(W, H);
          c.fillStyle = '#020101'; c.fillRect(0, 0, W, H);
          c.globalCompositeOperation = 'destination-out';
          [[.22, .4, 1.05], [.55, .5, 1.2], [.8, .3, .9], [.45, .85, .95], [.1, .9, .8]].forEach(([px, py, m], i) => {   // 안개가 여러 군데서 갈라지며 걷혀요
            const rr = Math.max(1, D * e * m * (.55 + i * .05)), g = c.createRadialGradient(px * W, py * H, rr * .35, px * W, py * H, rr);
            g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
            c.fillStyle = g; c.fillRect(0, 0, W, H);
          });
          c.globalAlpha = Math.max(0, (q - .7) / .3); c.fillStyle = '#000'; c.fillRect(0, 0, W, H);   // 마지막 남은 엷은 막까지 지워요
          c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
        }
        // 연기 덩이
        puffs = puffs.filter(p => {
          p.t += dt; if (p.t >= p.life) return false;
          if (phase === 'reveal') { p.vx *= .96; p.vy = p.vy * .96 - 20 * dt; }
          p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.gr * dt; p.vx *= .985; p.vy *= .985;
          const fade = phase === 'reveal' ? Math.max(0, 1 - pT / (REVEAL_DUR * .9)) : 1;
          c.save(); c.globalAlpha = p.a * Math.sin(Math.min(1, p.t / p.life) * Math.PI) * fade; c.translate(p.x, p.y); c.rotate(p.rot);
          c.drawImage(smoke, -p.r, -p.r, p.r * 2, p.r * 2); c.restore();
          return true;
        });
      }
      // 빛가루 + 나비
      drawDust(c, motes, dt);
      flies = flies.filter(f => {
        if (f.delay > 0) { f.delay -= dt; return true; }
        fly(f, dt); f.a = Math.min(1, f.a + dt * 1.6);
        if (f.glide <= 0 && R() < .6) dust(motes, f);
        const out = f.x < -200 || f.x > W + 200 || f.y < -200 || f.y > H + 200 || f.s > 80;
        if (out && f.mode === 'out') return false;
        butterfly(c, f, f.a * (f.mode === 'out' && f.s > 55 ? Math.max(0, 1 - (f.s - 55) / 25) : 1));
        return true;
      });

      if (phase === 'reveal' && pT >= REVEAL_DUR && !flies.length && !puffs.length && !motes.length) return end();
      if (phase === 'reveal' && pT >= REVEAL_DUR + 2.5) return end();
      raf = requestAnimationFrame(frame);
    }
    const go = () => { const p = v.play(); if (p && p.catch) p.catch(() => cover()); raf = requestAnimationFrame(frame); };
    if (v.readyState >= 3) go(); else { v.addEventListener('canplay', go, { once: true }); setTimeout(() => { if (!raf) go(); }, 2500); }
  }
  /* ---------- 장 사이 전환 영상 (卷二 → 卷三: assets/video/mangryang.mp4) ----------
     화면을 찢듯 영상이 덮쳐 오고, 끝나면 다음 장이 열려요. from = 몇 초부터 틀지 (앞부분 건너뛰기). 누르면 건너뛰어요 */
  function tear(src, from, onEnd) {
    if (reduced()) { onEnd(); return; }
    const v = preload(src), ov = document.createElement('div'); ov.className = 'tear-ov'; ov.setAttribute('aria-hidden', 'true');
    v.className = 'tear-vid'; try { v.currentTime = from; } catch (e) {}
    ov.appendChild(v); document.body.appendChild(ov);
    let done = false;
    const fin = () => { if (done) return; done = true; onEnd(); ov.classList.add('out'); setTimeout(() => ov.remove(), 600); };
    v.onended = fin; ov.onclick = fin;
    const p = v.play(); if (p && p.catch) p.catch(e => { if (!e || e.name !== 'AbortError') fin(); else setTimeout(() => v.play().catch(fin), 60); });
    setTimeout(fin, ((v.duration || 5.4) - from + 1.2) * 1000);   // 혹시 끝 신호가 안 와도
  }
  return { play, preload, tear };
})();
