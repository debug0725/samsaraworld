/* 경파 소유지 — 빛나는 서울 지도 (SVG)
   서울 경계 · 한강 · 25개 구, 그리고 경파가 쥔 땅이 구마다 빛 점으로 흩뿌려져요.
   ✏️ 구별 필지 수는 아래 HOLD 숫자만 고치면 돼요. 별표(★)는 대표 건물로 크게 빛나요. */
(function () {
  // 구 이름 · 대략의 중심 (경도, 위도) · 경파 소유 필지 수 · 대표 건물
  const HOLD = [
    ['도봉구', 127.040, 37.665, 6], ['노원구', 127.075, 37.650, 9], ['강북구', 127.020, 37.638, 6], ['은평구', 126.928, 37.614, 9],
    ['성북구', 127.014, 37.596, 11], ['중랑구', 127.092, 37.598, 7], ['종로구', 126.982, 37.590, 22, '★'], ['동대문구', 127.046, 37.577, 10],
    ['서대문구', 126.938, 37.578, 10], ['중구', 126.997, 37.562, 24, '★'], ['성동구', 127.040, 37.551, 18], ['광진구', 127.085, 37.543, 13],
    ['마포구', 126.906, 37.558, 19], ['용산구', 126.977, 37.533, 28, '★'], ['강서구', 126.822, 37.560, 11], ['양천구', 126.858, 37.522, 10],
    ['영등포구', 126.910, 37.522, 21, '★'], ['동작구', 126.951, 37.501, 12], ['구로구', 126.858, 37.494, 9], ['금천구', 126.900, 37.460, 6],
    ['관악구', 126.945, 37.468, 8], ['서초구', 127.030, 37.476, 34, '★'], ['강남구', 127.060, 37.498, 41, '★'], ['송파구', 127.112, 37.505, 27, '★'],
    ['강동구', 127.146, 37.550, 14]
  ];
  const BOUND = [[126.905, 37.645], [126.945, 37.660], [126.985, 37.688], [127.030, 37.700], [127.075, 37.693], [127.105, 37.668], [127.112, 37.630],
    [127.120, 37.600], [127.168, 37.585], [127.183, 37.555], [127.165, 37.530], [127.140, 37.495], [127.110, 37.465], [127.072, 37.457], [127.040, 37.432],
    [126.995, 37.440], [126.958, 37.430], [126.915, 37.433], [126.885, 37.455], [126.860, 37.475], [126.825, 37.483], [126.800, 37.510], [126.770, 37.548],
    [126.782, 37.583], [126.825, 37.598], [126.862, 37.605], [126.885, 37.622]];
  const HAN = [[126.775, 37.588], [126.815, 37.574], [126.850, 37.563], [126.885, 37.551], [126.918, 37.537], [126.948, 37.522], [126.980, 37.514],
    [127.008, 37.519], [127.035, 37.527], [127.062, 37.530], [127.090, 37.528], [127.112, 37.537], [127.140, 37.551], [127.170, 37.562], [127.195, 37.566]];
  const W = 600, H = 470, X = lon => (lon - 126.755) / (127.200 - 126.755) * W, Y = lat => (37.712 - lat) / (37.712 - 37.418) * H;
  const P = ([lo, la]) => `${X(lo).toFixed(1)},${Y(la).toFixed(1)}`;
  const smooth = pts => { // 부드러운 곡선
    const p = pts.map(([lo, la]) => [X(lo), Y(la)]); let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
    for (let i = 1; i < p.length - 1; i++) { const mx = (p[i][0] + p[i + 1][0]) / 2, my = (p[i][1] + p[i + 1][1]) / 2; d += ` Q${p[i][0].toFixed(1)},${p[i][1].toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`; }
    return d + ` L${p[p.length - 1][0].toFixed(1)},${p[p.length - 1][1].toFixed(1)}`;
  };
  // 같은 결과가 나오도록 고정 난수
  let s = 20261013; const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };

  window.seoulMap = function () {
    s = 20261013;
    const total = HOLD.reduce((a, h) => a + h[3], 0);
    let dots = '', labels = '', stars = '', k = 0;
    HOLD.forEach(([name, lo, la, n, star], gi) => {
      const cx = X(lo), cy = Y(la), spread = 9 + Math.sqrt(n) * 3.4;
      for (let i = 0; i < n; i++) {
        const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * spread, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * .85;
        const big = rnd() < .14, sz = big ? 2.1 : .9 + rnd() * .9;
        dots += `<circle class="sm-d${big ? ' b' : ''}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz.toFixed(2)}" style="--t:${(rnd() * 4).toFixed(2)}s;--a:${(.4 + rnd() * .6).toFixed(2)}"/>`;
        k++;
      }
      if (star) stars += `<g class="sm-st" transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)})" style="--t:${(gi * .37 % 3).toFixed(2)}s"><circle r="14" class="sm-halo"/><path d="M0 -9 Q.7 -.7 9 0 Q.7 .7 0 9 Q-.7 .7 -9 0 Q-.7 -.7 0 -9Z"/></g>`;
      labels += `<g class="sm-gu" data-gu="${name}" data-n="${n}"><circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(spread + 4).toFixed(1)}" class="sm-hit"/>
        <text x="${cx.toFixed(1)}" y="${(cy + spread + 10).toFixed(1)}">${name}<tspan> ${n}</tspan></text></g>`;
    });
    // 격자
    let grid = '';
    for (let x = 0; x <= W; x += 30) grid += `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
    for (let y = 0; y <= H; y += 30) grid += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;
    const bound = `M${BOUND.map(P).join(' L')}Z`;
    return `<div class="smap">
      <svg viewBox="0 0 ${W} ${H}" aria-label="경파 소유지 서울 지도">
        <defs>
          <radialGradient id="smGlow" cx="62%" cy="62%" r="60%"><stop offset="0" stop-color="#5d7fe0" stop-opacity=".35"/><stop offset=".6" stop-color="#2a3c80" stop-opacity=".12"/><stop offset="1" stop-color="#0b1020" stop-opacity="0"/></radialGradient>
          <linearGradient id="smRiver" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3f5fbf" stop-opacity=".2"/><stop offset=".5" stop-color="#9fb7ff" stop-opacity=".75"/><stop offset="1" stop-color="#3f5fbf" stop-opacity=".2"/></linearGradient>
          <clipPath id="smClip"><path d="${bound}"/></clipPath>
          <filter id="smBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
        </defs>
        <g class="sm-grid">${grid}</g>
        <path class="sm-land" d="${bound}"/>
        <g clip-path="url(#smClip)"><rect width="${W}" height="${H}" fill="url(#smGlow)"/>
          <path class="sm-river glow" d="${smooth(HAN)}" filter="url(#smBlur)"/><path class="sm-river" d="${smooth(HAN)}"/><path class="sm-river core" d="${smooth(HAN)}"/></g>
        <path class="sm-edge" d="${bound}" pathLength="1"/>
        <g class="sm-dots">${dots}</g>
        <g class="sm-stars">${stars}</g>
        <g class="sm-labels">${labels}</g>
        <text class="sm-han" x="${X(126.80).toFixed(0)}" y="${(Y(37.52) + 52).toFixed(0)}">漢江</text>
        <g class="sm-rose" transform="translate(${W - 34} 36)"><circle r="16"/><path d="M0 -14 L2.4 0 L0 14 L-2.4 0Z"/><text y="-19">N</text></g>
      </svg>
      <div class="sm-info"><b>誓門 所有地</b><span>서울 25개 구 · <em>${total}</em> 筆</span><i class="sm-tip">구를 눌러 보세요</i></div>
    </div>`;
  };
  // 구를 누르거나 올리면 그 구의 필지 수를 보여 줘요
  window.seoulMapBind = function (root) {
    const tip = root.querySelector('.sm-tip'); if (!tip) return;
    const show = g => { root.querySelectorAll('.sm-gu.on').forEach(x => x.classList.remove('on')); if (!g) { tip.textContent = '구를 눌러 보세요'; return; }
      g.classList.add('on'); tip.innerHTML = `${g.dataset.gu} · <b>${g.dataset.n}</b>筆 소유`; };
    root.addEventListener('pointerover', e => show(e.target.closest('.sm-gu')));
    root.addEventListener('click', e => show(e.target.closest('.sm-gu')));
  };
})();
