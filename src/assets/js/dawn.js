/* ================================================================
   타들어 가는 화면 (두 곳에서 써요)
   · 卷四 「문이 열리는 한 달」 마지막 — "이제 곧 새벽이 온다." 까지 읽으면
       새벽빛처럼 화면이 하얗게 덮이고 → 거의 안 보이게 "나를 막아 줘" → 하얀 화면이 좀먹듯 타들어 가며 페이지가 돌아와요
       (마지막 문장을 누르면 다시 볼 수 있어요)
   · 卷一 여는 영상 끝 — 먹빛으로 덮인 검은 화면이 타들어 가며 卷一 페이지가 드러나요 (intro.js 가 불러요)
   타는 모양: 군데군데 먼저 그을다가 구멍이 뚫리고, 진홍빛 불테두리 · 검은 그을음 · 은은한 연기 그림자 · 떠오르는 불씨

   ✏️ 고칠 수 있는 것
   · EGG / EGG_INK : 卷四 빛 속에 숨은 문구 / 진하기 (0~1, 낮을수록 안 보여요)
   · T             : 卷四 각 장면 시각 (ms)
   · EMBERS        : 불씨 양 (프레임당 최대 개수)
   ================================================================ */
window.Dawn = (function () {
  const EGG = '나를 막아 줘', EGG_INK = .06, EMBERS = 5;
  const T = { white: 350, egg: 1500, burn: 3700, burnDur: 3800 };
  const R = Math.random, TAU = Math.PI * 2;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  if (document.fonts && document.fonts.load) document.fonts.load(`400 20px "Noto Serif KR"`, EGG).catch(() => {});

  // 새벽빛 종이 (한지 결이 아주 옅게)
  function whitePaper(c, W, H) {
    c.fillStyle = 'rgba(246,242,234,.99)'; c.fillRect(0, 0, W, H);
    for (let i = 0; i < 260; i++) {
      const x = R() * W, y = R() * H, l = 8 + R() * 46, a = R() * Math.PI;
      c.strokeStyle = R() < .5 ? `rgba(150,124,96,${.025 + R() * .04})` : `rgba(255,255,255,${.3 + R() * .3})`;
      c.lineWidth = .4 + R() * .8; c.beginPath(); c.moveTo(x, y);
      c.quadraticCurveTo(x + Math.cos(a) * l * .5 + (R() - .5) * 8, y + Math.sin(a) * l * .5 + (R() - .5) * 8, x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke();
    }
    const g = c.createRadialGradient(W / 2, H * .46, Math.min(W, H) * .1, W / 2, H / 2, Math.max(W, H) * .75);
    g.addColorStop(0, 'rgba(255,255,255,.5)'); g.addColorStop(1, 'rgba(150,118,90,.2)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  }
  // 먹빛 종이 (거의 검정, 결만 아주 옅게)
  function blackPaper(c, W, H) {
    c.fillStyle = '#030202'; c.fillRect(0, 0, W, H);
    for (let i = 0; i < 220; i++) {
      const x = R() * W, y = R() * H, l = 10 + R() * 50, a = R() * Math.PI;
      c.strokeStyle = `rgba(${R() < .5 ? '60,40,40' : '30,20,22'},${.15 + R() * .2})`; c.lineWidth = .5 + R();
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke();
    }
    const g = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .2, W / 2, H / 2, Math.max(W, H) * .75);
    g.addColorStop(0, 'rgba(40,10,14,.25)'); g.addColorStop(1, 'rgba(0,0,0,.4)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  }
  function noiseField(w, h) {
    const f = new Float32Array(w * h), layers = [[70, .45], [22, .35], [7, .2]];
    for (const [cell, amp] of layers) {
      const gw = Math.ceil(w / cell) + 2, g = new Float32Array(gw * (Math.ceil(h / cell) + 2)).map(() => R());
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const gx = x / cell, gy = y / cell, x0 = gx | 0, y0 = gy | 0, tx = gx - x0, ty = gy - y0, sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
        const a = g[y0 * gw + x0], b = g[y0 * gw + x0 + 1], c = g[(y0 + 1) * gw + x0], d = g[(y0 + 1) * gw + x0 + 1];
        f[y * w + x] += ((a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy) * amp;
      }
    }
    return f;
  }
  // 불씨 색: 식어 갈수록 흰빛 → 금빛 → 주홍 → 진홍
  function heat(t) {
    if (t > .7) { const q = (t - .7) / .3; return [255, 214 + q * 34, 150 + q * 90]; }
    if (t > .35) { const q = (t - .35) / .35; return [255, 110 + q * 104, 50 + q * 100]; }
    const q = t / .35; return [150 + q * 105, 18 + q * 92, 24 + q * 26];
  }
  // 연보라 불씨 — 하얗게 타오르다 라벤더를 거쳐 잿빛 보라로 식어요
  function heatLilac(t) {
    if (t > .65) { const q = (t - .65) / .35; return [236 + q * 19, 230 + q * 25, 255]; }
    if (t > .3) { const q = (t - .3) / .35; return [186 + q * 50, 170 + q * 60, 238 + q * 17]; }
    const q = t / .3; return [116 + q * 70, 108 + q * 62, 150 + q * 88];
  }
  const smokeImg = {};
  function smokeSprite(rgb = '46,34,32') {
    if (smokeImg[rgb]) return smokeImg[rgb];
    const s = smokeImg[rgb] = document.createElement('canvas'); s.width = s.height = 96;
    const g = s.getContext('2d'), rg = g.createRadialGradient(48, 48, 0, 48, 48, 48);
    rg.addColorStop(0, `rgba(${rgb},.55)`); rg.addColorStop(.5, `rgba(${rgb},.22)`); rg.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = rg; g.fillRect(0, 0, 96, 96);
    return s;
  }

  /* 화면 한 장을 덮었다가 태워 없애요
     host: 덮을 곳 (이야기 창 / document.body) · o.black: 먹빛 종이 · o.shown: 처음부터 덮인 채로 시작
     o.egg: 숨은 문구 시각(ms) · o.burn / o.burnDur: 타기 시작 · 타는 시간(ms) · o.fadeIn: 하얗게 덮이는 시각(ms)
     o.onBurn: 타기 시작할 때 · o.onDone: 다 탔을 때 */
  function burnSheet(host, o) {
    const fixed = host === document.body;
    const W = fixed ? innerWidth : host.clientWidth, H = fixed ? innerHeight : host.clientHeight;
    const dpr = Math.min(1.5, devicePixelRatio || 1), Wd = Math.round(W * dpr), Hd = Math.round(H * dpr);
    const nodes = [], timers = [];
    const mk = (cls, w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; if (cls) { c.className = cls + (fixed ? ' fixed' : ''); host.append(c); nodes.push(c); } return c; };
    const sheet = mk('dawn-sheet' + (o.shown ? ' in' : ''), Wd, Hd), fx = mk('dawn-fx', Wd, Hd);
    const sx = sheet.getContext('2d'), fxx = fx.getContext('2d');
    const base = mk('', Wd, Hd), bx = base.getContext('2d'); bx.scale(dpr, dpr); (o.black || o.video ? blackPaper : whitePaper)(bx, W, H);
    const sc = Math.min(1, 520 / W), mw = Math.max(120, Math.round(W * sc)), mh = Math.max(70, Math.round(H * sc));
    const maskC = mk('', mw, mh), charC = mk('', mw, mh), glowC = mk('', mw, mh);
    const mX = maskC.getContext('2d'), cX = charC.getContext('2d'), gX = glowC.getContext('2d');
    const mI = mX.createImageData(mw, mh), cI = cX.createImageData(mw, mh), gI = gX.createImageData(mw, mh);
    const seeds = [];
    for (let i = 0; i < 11; i++) seeds.push([.04 + R() * .92, .04 + R() * .92, R() * .32]);
    const field = noiseField(mw, mh), burnAt = new Float32Array(mw * mh), asp = mh / mw;
    let maxB = 0;
    for (let y = 0; y < mh; y++) for (let x = 0; x < mw; x++) {
      let m = 9; for (const [px, py, dl] of seeds) { const q = Math.hypot(x / mw - px, (y / mh - py) * asp) * 1.55 + dl; if (q < m) m = q; }
      const b = m + field[y * mw + x] * .24; burnAt[y * mw + x] = b; if (b > maxB) maxB = b;
    }
    for (let i = 0; i < burnAt.length; i++) burnAt[i] /= maxB;
    const lilac = o.tone === 'lilac', smoke = smokeSprite(lilac ? '150,144,176' : undefined);
    let embers = [], smokes = [], t0 = performance.now(), last = t0, burning = false, burnDone = false, sFrame = 0, raf = 0, dead = false;
    const ember = (x, y) => embers.push({ x, y, vx: (R() - .5) * 14, vy: -(8 + R() * 26), lift: 18 + R() * 34,
      sway: 6 + R() * 18, fq: 1.2 + R() * 2.2, ph: R() * TAU, life: 1.6 + R() * 2.4, t: 0, s: .45 + R() * 1.1, cool: .7 + R() * .6, die: R() < .25 ? .35 + R() * .4 : 1 });
    const puff = (x, y) => smokes.push({ x, y, vx: (R() - .5) * 10, vy: -(10 + R() * 18), r: 18 + R() * 26, gr: 16 + R() * 24, life: 2 + R() * 1.6, t: 0, a: ((o.black || o.video) ? .05 : .1) + R() * .1 });
    function kill() { if (dead) return; dead = true; cancelAnimationFrame(raf); timers.forEach(clearTimeout); nodes.forEach(n => n.remove()); }

    function frame(now) {
      if (!host.isConnected) return kill();
      const el = now - t0, dt = Math.min(.05, (now - last) / 1000); last = now;
      sx.setTransform(1, 0, 0, 1, 0, 0); sx.globalCompositeOperation = 'source-over'; sx.globalAlpha = 1;
      sx.clearRect(0, 0, Wd, Hd);
      if (o.video) {   // 종이 대신 재생 중인 영상이 그대로 타들어 가요 (영상이 잠깐 준비 중이면 마지막 장면을 붙잡아 둬요)
        if (o.video.readyState >= 2) {
          const vw = o.video.videoWidth, vh = o.video.videoHeight, s = Math.max(Wd / vw, Hd / vh);
          bx.setTransform(1, 0, 0, 1, 0, 0); bx.fillStyle = '#000'; bx.fillRect(0, 0, Wd, Hd);
          bx.globalAlpha = o.videoAlpha || 1; bx.drawImage(o.video, (Wd - vw * s) / 2, (Hd - vh * s) / 2, vw * s, vh * s); bx.globalAlpha = 1;
        }
        sx.drawImage(base, 0, 0);
      } else sx.drawImage(base, 0, 0);
      if (o.egg != null) {   // 빛 속에 숨은 글씨 — 번져서 윤곽이 거의 안 잡혀요
        const eggA = Math.max(0, Math.min(1, (el - o.egg) / 1500));
        if (eggA > 0) {
          sx.save(); sx.scale(dpr, dpr); sx.globalAlpha = eggA * EGG_INK; sx.fillStyle = '#3a2c28'; sx.filter = 'blur(.9px)';
          sx.font = `400 ${Math.round(Math.min(W * .034, H * .05))}px "Noto Serif KR", serif`; sx.textAlign = 'center'; sx.textBaseline = 'middle';
          sx.fillText([...EGG].join(' '), W / 2, H * .46); sx.restore();
        }
      }
      if (el >= o.burn && !burnDone) {
        if (!burning) { burning = true; sheet.classList.add('burning'); o.onBurn && o.onBurn(); }
        const k = Math.min(1, (el - o.burn) / o.burnDur), th = ease(k) * 1.12 - .08;   // 먼저 군데군데 그을고, 그다음 뚫려요
        const m = mI.data, cc = cI.data, gg = gI.data, edge = [];
        for (let i = 0, j = 0; i < burnAt.length; i++, j += 4) {
          const d = burnAt[i] - th;
          m[j + 3] = d < 0 ? 0 : d < .004 ? (d / .004) * 255 : 255;
          if (d >= 0 && d < .085 && lilac) {   // 붉은 그을음 대신 잿빛 보라 → 연회색 안개
            if (d < .018) { const q = d / .018; cc[j] = 52 + q * 40; cc[j + 1] = 48 + q * 36; cc[j + 2] = 70 + q * 46; cc[j + 3] = 225; }
            else { const q = (d - .018) / .067, f = Math.pow(1 - q, 1.8); cc[j] = 168; cc[j + 1] = 162; cc[j + 2] = 192; cc[j + 3] = 95 * f; }
          } else if (d >= 0 && d < .085) {
            if (d < .018) { const q = d / .018; cc[j] = 64 - q * 40; cc[j + 1] = 10 + q * 4; cc[j + 2] = 12 - q * 2; cc[j + 3] = 240; }
            else { const q = (d - .018) / .067, f = Math.pow(1 - q, 1.8); cc[j] = (o.black || o.video) ? 70 : 96; cc[j + 1] = (o.black || o.video) ? 14 : 52; cc[j + 2] = (o.black || o.video) ? 16 : 34; cc[j + 3] = ((o.black || o.video) ? 120 : 200) * f; }
          } else cc[j + 3] = 0;
          const e = (d - .0015) / .006, I = d > -.006 && d < .015 ? Math.exp(-e * e) : 0;
          if (I > .01 && lilac) { const I3 = I * I * I; gg[j] = 190 + 65 * I3; gg[j + 1] = 176 + 79 * I3; gg[j + 2] = 255; gg[j + 3] = 215 * I; if (I > .75 && R() < .04) edge.push(i); }
          else if (I > .01) { gg[j] = 255; gg[j + 1] = 46 + 190 * I * I * I; gg[j + 2] = 58 + 160 * I * I * I * I; gg[j + 3] = 235 * I; if (I > .75 && R() < .04) edge.push(i); }
          else gg[j + 3] = 0;
        }
        mX.putImageData(mI, 0, 0); cX.putImageData(cI, 0, 0); gX.putImageData(gI, 0, 0);
        sx.imageSmoothingEnabled = true;
        sx.globalCompositeOperation = 'destination-in'; sx.drawImage(maskC, 0, 0, Wd, Hd);
        sx.globalCompositeOperation = 'source-atop'; sx.drawImage(charC, 0, 0, Wd, Hd);
        sx.globalCompositeOperation = 'lighter'; sx.drawImage(glowC, 0, 0, Wd, Hd);
        const pos = i => [(i % mw) / mw * W, ((i / mw) | 0) / mh * H];
        for (let q = 0; q < Math.min(edge.length, EMBERS) && embers.length < 420; q++) { const [x, y] = pos(edge[(R() * edge.length) | 0]); ember(x, y); }
        if (edge.length && ++sFrame % 3 === 0 && smokes.length < 60) { const [x, y] = pos(edge[(R() * edge.length) | 0]); puff(x, y); }
        if (k >= 1) { burnDone = true; sheet.classList.add('gone'); o.onDone && o.onDone(); }
      }
      // 연기 그림자 + 불씨
      fxx.setTransform(1, 0, 0, 1, 0, 0); fxx.clearRect(0, 0, Wd, Hd); fxx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fxx.globalCompositeOperation = 'source-over';
      smokes = smokes.filter(s => {
        s.t += dt; if (s.t >= s.life) return false;
        s.x += s.vx * dt; s.y += s.vy * dt; s.r += s.gr * dt;
        fxx.globalAlpha = s.a * Math.sin((s.t / s.life) * Math.PI); fxx.drawImage(smoke, s.x - s.r, s.y - s.r, s.r * 2, s.r * 2);
        return true;
      });
      fxx.globalCompositeOperation = 'lighter';
      embers = embers.filter(e => {
        e.t += dt; const L = e.life * e.die; if (e.t >= L) return false;
        e.vy -= e.lift * dt * .5; e.vy *= .995;
        e.x += (e.vx + Math.sin(e.t * e.fq + e.ph) * e.sway) * dt; e.y += e.vy * dt;
        const life = e.t / L, [cr, cg, cb] = (lilac ? heatLilac : heat)(Math.max(0, 1 - life * e.cool));
        const flick = .7 + .3 * Math.sin(e.t * 17 + e.ph) * Math.sin(e.t * 5.3 + e.ph * 2), a = Math.min(1, e.t / .15) * (1 - Math.pow(life, 2.2)) * flick;
        fxx.globalAlpha = a * .16; fxx.fillStyle = `rgb(${cr},${cg | 0},${cb | 0})`; fxx.beginPath(); fxx.arc(e.x, e.y, e.s * 5.5, 0, TAU); fxx.fill();
        fxx.globalAlpha = a * .9; fxx.beginPath(); fxx.arc(e.x, e.y, e.s, 0, TAU); fxx.fill();
        return true;
      });
      fxx.globalAlpha = 1; fxx.globalCompositeOperation = 'source-over';
      if (burnDone && !embers.length && !smokes.length) return kill();
      raf = requestAnimationFrame(frame);
    }
    if (!o.shown) timers.push(setTimeout(() => sheet.classList.add('in'), o.fadeIn || 0));
    timers.push(setTimeout(() => { if (!burnDone) { burnDone = true; o.onDone && o.onDone(); } kill(); }, o.burn + o.burnDur + 6000));   // 혹시 그리기가 멈춰도 덮개는 꼭 치워요
    raf = requestAnimationFrame(frame);
    return { kill };
  }

  // 卷四 마지막 문장
  function attach(r) {
    const fin = r.querySelector('.rd-text p.fin'), main = r.querySelector('.rd-main');
    if (!fin || !main) return;
    let busy = false, cur = null;
    function play() {
      if (busy) return; busy = true; io.disconnect();
      fin.classList.remove('lit'); r.classList.add('dawning');
      if (reduced()) { setTimeout(() => { busy = false; r.classList.remove('dawning'); fin.classList.add('lit'); }, 1200); return; }
      cur = burnSheet(r, { fadeIn: T.white, egg: T.egg, burn: T.burn, burnDur: T.burnDur,
        onBurn: () => r.classList.remove('dawning'), onDone: () => { fin.classList.add('lit'); setTimeout(() => { busy = false; }, 2500); } });
    }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && e.intersectionRatio > .6) { io.disconnect(); setTimeout(play, 500); }
    }), { root: main, threshold: [0, .6, 1] });
    io.observe(fin);
    fin.title = '다시 보기'; fin.style.cursor = 'pointer';
    fin.addEventListener('click', play);
  }
  return { attach, burnSheet, T };
})();
