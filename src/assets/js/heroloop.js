/* 세계관 인트로 영상 — 영상이 끝날 때마다 검은 격자로 이어 붙여요
   재생 → 끝나기 직전 검은 세모 조각들이 번져 화면을 덮음 (붉은 결이 스침) → 잠깐 암전 →
   조각이 거꾸로 걷히며 처음부터 다시. 암전마다 제목에 붉은 기운이 한 번 차올라요. */
(() => {
  const RATE = .85;        // 재생 속도 (1 = 원래 속도)
  const TAIL = .25;        // 영상 끝나기 몇 초 전에 격자 연출을 시작할지
  const CLOSE = 950, HOLD = 380, OPEN = 1100;   // 덮기 · 암전 · 걷기 (ms)
  const TAU = Math.PI * 2;

  function start(hero) {
    const v = hero.querySelector('video'); if (!v) return;
    v.loop = false; v.removeAttribute('loop');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const setRate = () => { v.playbackRate = reduce ? .3 : RATE; };
    setRate(); v.addEventListener('loadedmetadata', setRate);
    const cv = document.createElement('canvas'); cv.className = 'wh-grid'; v.after(cv);
    const x = cv.getContext('2d');
    let W = 0, H = 0, tris = [], dpr = 1;

    // 정사각 칸마다 네 개의 세모 (영상 끝 격자와 같은 결)
    function layout() {
      dpr = Math.min(2, devicePixelRatio || 1);
      W = hero.clientWidth; H = hero.clientHeight;
      cv.width = Math.ceil(W * dpr); cv.height = Math.ceil(H * dpr);
      const cols = W < 700 ? 5 : 8, s = W / cols, rows = Math.ceil(H / s);
      tris = [];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const x0 = c * s, y0 = r * s, cx = x0 + s / 2, cy = y0 + s / 2;
        const corners = [[x0, y0], [x0 + s, y0], [x0 + s, y0 + s], [x0, y0 + s]];
        for (let k = 0; k < 4; k++) {
          const a = corners[k], b = corners[(k + 1) % 4];
          // 대각선 방향으로 물결치듯 순서를 매기고, 조금씩 흐트러뜨려요
          const order = (c / cols) * .55 + (r / rows) * .45;
          tris.push({ a, b, c: [cx, cy], d: Math.min(.82, order * .7 + Math.random() * .22), hinge: (k + (r + c) % 2) % 2 });
        }
      }
    }
    // p: 0 = 안 보임, 1 = 다 덮음 — 세모가 한 변을 축으로 펼쳐져요
    function draw(p, glow) {
      x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, cv.width, cv.height);
      if (p <= 0) return;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const t of tris) {
        const q = Math.max(0, Math.min(1, (p - t.d) / .18)); if (q <= 0) continue;
        const e = 1 - Math.pow(1 - q, 3);
        const [A, B] = t.hinge ? [t.a, t.b] : [t.b, t.a], m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
        const tip = [m[0] + (t.c[0] - m[0]) * e, m[1] + (t.c[1] - m[1]) * e];
        x.beginPath(); x.moveTo(A[0], A[1]); x.lineTo(B[0], B[1]); x.lineTo(tip[0], tip[1]); x.closePath();
        x.fillStyle = '#030204'; x.fill();
        if (q < 1 && glow) { x.strokeStyle = `rgba(214,40,56,${(1 - q) * .85})`; x.lineWidth = 1.2; x.stroke(); }   // 막 펼쳐지는 조각 가장자리에 붉은 결
      }
    }
    let phase = 'play', t0 = 0, raf = 0;
    const ease = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    function tick(now) {
      if (!hero.isConnected) return;
      if (phase === 'play') {
        draw(0);
        if ((v.duration && v.currentTime >= v.duration - TAIL) || v.ended) { phase = 'close'; t0 = now; v.pause(); }
      } else if (phase === 'close') {
        const k = Math.min(1, (now - t0) / CLOSE); draw(ease(k) * 1.02, true);
        if (k >= 1) { phase = 'hold'; t0 = now; hero.classList.add('wh-dark'); try { v.currentTime = 0; } catch (e) {} }
      } else if (phase === 'hold') {
        draw(1.02, false);
        if (now - t0 >= HOLD) { phase = 'open'; t0 = now; hero.classList.remove('wh-dark'); setRate(); v.play().catch(() => {}); }
      } else if (phase === 'open') {
        const k = Math.min(1, (now - t0) / OPEN); draw((1 - ease(k)) * 1.02, true);
        if (k >= 1) { phase = 'play'; draw(0); }
      }
      raf = requestAnimationFrame(tick);
    }
    layout(); addEventListener('resize', layout);
    setRate(); v.play().catch(() => {});
    raf = requestAnimationFrame(tick);
  }
  window.HeroLoop = { start };
})();
