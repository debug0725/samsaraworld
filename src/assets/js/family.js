/* ================================================================
   ✏️ 가계도 내용 — 이 FAMILY 안의 글만 고치면 세계관 페이지 가계도가 바뀌어요.
   · name: 이름 (성과 이름 사이에 띄어쓰기를 하면 성이 작게 표시돼요. 예: '서문 도현')
   · role: 이름 위 작은 글씨 (예: '큰아버지')
   · erased: true  → 호적에서 파인 사람 (이름에 먹칠 + 除籍 도장)
   · masked: true  → 이름이 가려진 사람 (예: '한 **')
   · wives: [...]  → 누르면 부인들이 펼쳐지는 사람
   · ghosts: 숫자 → 호적에 올리지 않은 빈 문패 개수 (흐릿하게 표시)
   · short: 궤도 아래·메뉴에 뜨는 짧은 이름 / desc: 오른쪽 판에 뜨는 소개글
   ================================================================ */
window.FAMILY = {
  title: '서문 가계도',
  crest: '門',          // 가운데 문장 글자 (가문 한자로 바꿔도 돼요)
  sub: '가문 관계 정리',
  // rank: 궤도 위 별 문양의 화려함 (5 = 가장 화려)
  houses: [
    {
      id: 'main', name: '본가', short: '본가', han: '本家', tone: 'crimson', rank: 5, wide: true,
      desc: '서문가의 뿌리가 되는 집. 큰아버지 서문 백과 윤옥란 아래 여덟 자녀가 있고, 그중 하나는 호적에서 이름이 파였다.',
      couple: [{ name: '서문 백', role: '큰아버지' }, { name: '윤옥란', role: '큰어머니' }],
      kids: [
        { name: '서문 도현', desc: '가문의 장남으로 차기 가주로 불리는 자', wives: [
          { name: '김화진', role: '정실 · 正室' },
          { name: '이성혜', role: '후실 · 後室' },
          { name: '진지연', role: '첩 · 妾' }
        ] },
        { name: '서문 도윤', desc: '가문의 차남으로 가문의 대소사를 맡고 있다' },
        { name: '서문 도경', desc: '가문의 셋째로 본가의 법무 법인 및 세금 문제를 담당하고 있다' },
        { name: '서문 도진', desc: '가문의 넷째로 외부와 왕래하는 일이 있을 경우 그를 통해 처리하고는 한다' },
        { name: '서문 도하', desc: '가문의 다섯째로 윤옥란이 가장 예뻐하는 자식이기도 하다 주술에 대한 책을 집필하고 있다' },
        { name: '서문 도원', desc: '가문의 여섯째로 본가에서 거주하고 있으나 별채에 지내기 때문에 그 식솔과 가족들을 잘 볼 수 없다' },
        { name: '서문 도겸', desc: '가문의 막내로 가장 거만하며 경파를 혐오하기로 유명하다' },
        { name: '서문 OO', erased: true, role: '호적에서 파임', desc: '함부로 거론할 수 없다' }
      ]
    },
    {
      id: 'hwayeon', name: '출가외인', short: '출가외인', han: '出嫁外人', tone: 'rose', rank: 1, from: 'main',
      desc: '본가의 장녀 서문 화연이 한기준과 따로 차린 집. 아이의 이름은 가려져 있다.',
      couple: [
        { name: '서문 화연', role: '장녀', desc: '서문 도윤의 쌍둥이 여식으로 장녀였으나 후계 자리를 내려놓고 한기준과 결혼하여 본가를 떠났다' },
        { name: '한기준', desc: '당시 본가에서 일하던 식솔의 아들로 굉장히 준수한 외모와 착한 마음씨를 지녔다고 한다 이후 서문 화연과 도주하여 그 식솔 전부가 본가에서 내쫓겼다' }
      ],
      kids: [{ name: '한 **', masked: true, role: '이름 미상' }]
    },
    {
      id: 'hwajin', name: '문외천인', short: '문외천인', han: '門外賤人', tone: 'jade', rank: 2, from: 'seoul',
      desc: '경파를 배신하고 나간 서문 화진의 씨로 유성근 사이 쌍둥이 남매를 두었다.',
      couple: [
        { name: '서문 화진', desc: '경파 가주의 유일한 딸이었으나 현가의 입양아인 유성근과 눈이 맞아 아버지를 스스로 칼로 찔러 나갔다고 알려져 있다' },
        { name: '유성근', desc: '고독으로 유명한 현가 가문의 입양아로 알려진 정보는 없으나 무명 배우로 활동하기도 했다' }
      ],
      kids: [
        { name: '유나경', desc: '이름은 자세히 알려진 바 없으나 딸로 추정된다' },
        { name: '유시열', desc: '이름은 자세히 알려진 바 없으나 아들로 추정된다' }
      ], twins: '쌍둥이 남매'
    },
    {
      id: 'seoul', name: '경파', short: '경파', han: '京派', tone: 'steel', rank: 4,
      desc: '서문의 다른 경로로 서울에 터를 잡고 있다.',
      couple: [
        { name: '서문 태준', desc: '서문 백의 형제로 서울에 터전을 옮겨 새로운 서문의 가르침을 잇고 있다' },
        { name: '오미령', desc: '서문의 두 번째 안주인으로 윤옥란과는 사이가 좋지 않다 소문으로는 파라다이스시티와 연관이 있다고 한다' }
      ],
      kids: [
        { name: '서문 재혁', desc: '경파의 장남이자 차기 가주로 현재는 서울대에서 역사학을 가르치고 있다' },
        { name: '서문 재원', desc: '경파의 차남으로 집안에 들어오는 의뢰를 도맡고 재정을 관리하고 있다' },
        { name: '서문 재희', desc: '현 대통령의 수행 비서로 활동하기에 본가에서 열리는 잔치 및 경사에도 종종 모습을 드러내지 않는다' },
        { name: '서문 재민', desc: '경파의 넷째로 연예계에서 배우로 활동하고 있으며 최근 천만 영화의 조연으로 이름을 알리고 있다' },
        { name: '서문 재영', desc: '경파의 다섯째로 막내이며 외동딸이라는 메리트로 인하여 서울의 금싸라기 건물을 독채로 굴리고 있다' }
      ]
    },
    {
      id: 'branch', name: '분가', short: '분가', han: '分家', tone: 'ochre', rank: 3,
      desc: '염씨 분가. 호적에는 염태율 일가만 올라 있고, 나머지 염씨 일가는 빈 문패로만 남아 있다.',
      couple: [
        { name: '염태율', desc: '염씨 분가의 가주로 소문으로는 서문 백과 거푸집을 씌운 듯 닮은 얼굴에 성격이 굉장히 엄하다고 한다' },
        { name: '백지희', desc: '염태율과 나이 차이가 열네 살이나 나는 여성으로 염태율을 오래 좋아했다고 알려진 것 외 정보는 없다' }
      ],
      kids: [
        { name: '염기현', desc: '염가의 첫째로 슬하에 여러 아이들을 두고 있으며 이는 염가의 번영을 위한 목적이라고 한다' },
        { name: '염지석', desc: '피아노 수재로 이름을 알린 음악가 중 하나로 현재는 선화예고에서 학생들을 대상으로 피아노를 가르친다' },
        { name: '염가혁', desc: '염가의 셋째로 염가의 실질적 가주 후보이며 후계 교육을 도맡으며 염업들을 가르치기도 한다' }
      ],
      ghosts: 14, ghostNote: '호적에 올리지 않은 염씨 일가'
    }
  ]
};

/* ================================================================
   화면 그리기 (여기 아래는 고치지 않아도 돼요)
   ================================================================ */
(function () {
  const E = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const split = n => { const i = n.indexOf(' '); return i > 0 ? [n.slice(0, i), n.slice(i + 1)] : ['', n]; };
  const two = n => String(n).padStart(2, '0');
  const NUM = '〇一二三四五六七八九';
  const hanNum = n => n < 10 ? NUM[n] : n < 20 ? '十' + (n % 10 ? NUM[n % 10] : '') : String(n);
  const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 호적에서 파인 이름 위로 아무렇게나 그어진 붉은 줄
  const SCRIB = () => {
    const R = Math.random, lines = Array.from({ length: 5 }, (_, i) => {
      const y0 = 8 + i * 6.5 + (R() - .5) * 6, y1 = 8 + (4 - i) * 5 + (R() - .5) * 10;
      return `<path pathLength="1" style="--o:${(i * .09).toFixed(2)}s" d="M${(-4 + R() * 8).toFixed(1)} ${y0.toFixed(1)} C ${(30 + R() * 20).toFixed(1)} ${(y0 + (R() - .5) * 16).toFixed(1)}, ${(70 + R() * 20).toFixed(1)} ${(y1 + (R() - .5) * 16).toFixed(1)}, ${(116 + R() * 8).toFixed(1)} ${y1.toFixed(1)}"/>`;
    }).join('');
    return `<svg class="scrib" viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>`;
  };

  /* ---------- 집안마다 다른 별 문양 (오목한 마름모) — rank 가 높을수록 화려해요 ---------- */
  // 오목한 마름모 별 — R: 세로 끝, W: 가로 끝(생략하면 R), c: 허리 굵기 (작을수록 날렵해요)
  const cv = (R, c, W) => { W = W || R; return `M0 ${-R} Q${c} ${-c} ${W} 0 Q${c} ${c} 0 ${R} Q${-c} ${c} ${-W} 0 Q${-c} ${-c} 0 ${-R}Z`; };
  const rot = (d, a, cls) => `<path class="${cls}" d="${d}" transform="rotate(${a})"/>`;
  const ring = (r, cls) => `<circle class="${cls}" r="${r}"/>`;
  const ticks = (n, r1, r2, cls) => Array.from({ length: n }, (_, i) => `<line class="${cls || 'tk'}" x1="0" y1="${-r1}" x2="0" y2="${-r2}" transform="rotate(${(i * 360 / n).toFixed(2)})"/>`).join('');
  const dots = (n, r, s, off) => Array.from({ length: n }, (_, i) => { const a = (i * 360 / n + (off || 0)) * Math.PI / 180; return `<circle class="dt" cx="${(Math.sin(a) * r).toFixed(2)}" cy="${(-Math.cos(a) * r).toFixed(2)}" r="${s}"/>`; }).join('');
  const minis = (n, r, R, off) => Array.from({ length: n }, (_, i) => { const a = i * 360 / n + (off || 0); return `<path class="mn" d="${cv(R, R * .16)}" transform="rotate(${a}) translate(0 ${-r}) rotate(${-a})"/>`; }).join('');
  // 빛 문양 — 바늘처럼 가는 십자 빛, 번지는 광륜, 금빛 실선 궤도와 초승달, 작은 반짝임
  // 바늘 빛: 세로로 길고(R) 가로로 짧은(W) 가는 빛줄기 두 개 — t: 빛줄기 굵기
  const ray = (L, t) => `M0 ${-L} Q${(t * .25).toFixed(2)} ${(-L * .35).toFixed(1)} ${t} 0 Q${(t * .25).toFixed(2)} ${(L * .35).toFixed(1)} 0 ${L} Q${(-t * .25).toFixed(2)} ${(L * .35).toFixed(1)} ${-t} 0 Q${(-t * .25).toFixed(2)} ${(-L * .35).toFixed(1)} 0 ${-L}Z`;
  const needle = (R, W, c, cls) => cls && cls.includes('core') ? `<path class="${cls}" d="${cv(R, c, W)}"/>`
    : `<path class="${cls || 'ndl'}" d="${ray(R, R > 30 ? 1.9 : 1.6)}"/><path class="${cls || 'ndl'}" d="${ray(W, 1.4)}" transform="rotate(90)"/>`;
  const spark = (x, y, s) => `<path class="sp4" d="${cv(s, s * .1, s * .72)}" transform="translate(${x} ${y})"/>`;
  const glow = (r, cls) => `<circle class="glw ${cls || ''}" r="${r}"/>`;
  const crescent = (r, a, x, y) => `<path class="cres" d="M0 ${-r} A${r} ${r} 0 1 0 0 ${r} A${(r * .78).toFixed(2)} ${r} 0 1 1 0 ${-r}Z" transform="translate(${x} ${y}) rotate(${a})"/>`;
  const orbit = (rx, ry, a, cls) => `<ellipse class="hair ${cls || ''}" rx="${rx}" ry="${ry}" transform="rotate(${a})"/>`;
  // 연꽃 꽃잎 — 밑동(0,0)에서 위로, 바깥쪽으로 살짝 휘어요
  const petal = (len, w) => `M0 0 C${w} ${(-len * .22).toFixed(1)} ${(w * 1.15).toFixed(1)} ${(-len * .68).toFixed(1)} 0 ${-len} C${(-w * .45).toFixed(1)} ${(-len * .62).toFixed(1)} ${(-w * .65).toFixed(1)} ${(-len * .24).toFixed(1)} 0 0Z`;
  // by: 밑동 높이 / front, back: [기울기, 길이, 너비] — 0도는 가운데 한 장, 나머지는 좌우 대칭
  function lotus(by, front, back) {
    const side = (a, l, w, cls) => a === 0 ? `<path class="${cls}" d="${petal(l, w * .8)}"/><path class="${cls}" d="${petal(l, w * .8)}" transform="scale(-1 1)"/>`
      : `<path class="${cls}" d="${petal(l, w)}" transform="rotate(${a})"/><path class="${cls}" d="${petal(l, w)}" transform="scale(-1 1) rotate(${a})"/>`;
    return `<g transform="translate(0 ${by})">${back.map(([a, l, w]) => side(a, l, w, 'ptl bk')).join('')}${front.map(([a, l, w]) => side(a, l, w, 'ptl')).join('')}</g>`;
  }
  function sigil(rank) {
    let g = '';
    if (rank >= 5) {   // 本家 — 광륜 · 금빛 고리 속 초승달 · 기울어진 궤도 · 길게 뻗은 바늘 빛 · 반짝임 셋
      g = `${glow(20)}${ring(29, 'hair gold')}${crescent(21, 18, -4, 1)}
        <g class="orb-g">${orbit(47, 10, -13, 'gold')}<circle class="odot" cx="40" cy="-4.6" r="1.3" transform="rotate(-13)"/></g>
        <path class="ndl dg" d="${ray(17, .8)}" transform="rotate(45)"/><path class="ndl dg" d="${ray(17, .8)}" transform="rotate(-45)"/>
        ${needle(50, 24, .55)}${needle(6, 6, .55, 'ndl core')}
        <g class="twk">${spark(31, -33, 4.2)}${spark(39, -41, 2.6)}${spark(24, -42, 1.9)}</g>`;
    } else if (rank === 4) {   // 京派 — 광륜 · 금빛 고리 · 반대로 기운 궤도 · 바늘 빛 · 반짝임 둘
      g = `${glow(15)}${ring(23, 'hair gold')}${orbit(40, 8, 16, 'gold')}
        <path class="ndl dg" d="${ray(12, .7)}" transform="rotate(45)"/><path class="ndl dg" d="${ray(12, .7)}" transform="rotate(-45)"/>
        ${needle(45, 19, .55)}${needle(5, 5, .5, 'ndl core')}
        <g class="twk">${spark(-27, -27, 3.3)}${spark(-34, -34, 2)}</g>`;
    } else if (rank === 3) {   // 分家 — 그믐(朔)의 어두운 달 · 가장자리만 빛나는 가는 초승달 · 그 앞에서 빛나는 별
      g = `<circle class="moon" cy="2" r="23"/>${crescent(23, 200, 0, 2)}
        ${glow(12)}<path class="ndl dg" d="${ray(9, .55)}" transform="rotate(45)"/><path class="ndl dg" d="${ray(9, .55)}" transform="rotate(-45)"/>
        ${needle(34, 14, .55)}${needle(4.5, 4.5, .45, 'ndl core')}
        <g class="twk">${spark(27, -27, 3)}${spark(33, -33, 1.8)}</g><circle class="dt" cy="41" r=".9"/><circle class="dt" cy="45.5" r=".6"/>`;
    } else if (rank === 2) {   // 門外賤人 — 작은 연꽃 위에 뜬 빛
      g = `<g transform="translate(0 -17)">${glow(9)}<path class="ndl" d="${ray(14, 1.3)}"/><path class="ndl" d="${ray(8, 1.1)}" transform="rotate(90)"/>${needle(3.2, 3.2, .3, 'ndl core')}</g>
        <circle class="dt" cy="1.5" r=".8"/>
        ${lotus(33, [[0, 25, 6.4], [30, 22, 5.6], [62, 16, 4.4]], [])}<circle class="dt" cy="40" r=".9"/>`;
    } else {   // 出嫁外人 — 활짝 핀 연꽃 · 꽃 위의 초승달 · 위에 뜬 빛
      g = `<g transform="translate(0 -24)">${glow(11)}<path class="ndl" d="${ray(16, 1.5)}"/><path class="ndl" d="${ray(10, 1.2)}" transform="rotate(90)"/>
          <path class="ndl dg" d="${ray(7, .5)}" transform="rotate(45)"/><path class="ndl dg" d="${ray(7, .5)}" transform="rotate(-45)"/>${needle(4, 4, .4, 'ndl core')}</g>
        ${lotus(36, [[0, 28, 6.6], [26, 27, 6.9], [52, 23, 5.8]], [[16, 33, 7.4], [40, 32, 7.2], [70, 27, 5.6], [96, 29, 4]])}
        ${crescent(7.5, -90, 0, 0)}
        <g class="twk"><path class="sp4" d="${cv(3.4, .3, 2.2)}" transform="translate(0 43)"/></g>`;
    }
    return `<svg class="sig-svg" viewBox="-50 -50 100 100" aria-hidden="true">${g}</svg>`;
  }

  /* ---------- 오른쪽: 한 집안을 별자리로 ---------- */
  // 별 하나 (사람 하나)
  function star(p, k, x, y, H, d, cls) {
    const [sur, given] = split(p.name);
    const c = ['cs', cls, p.erased ? 'erased' : '', p.masked ? 'masked' : '', p.wives ? 'has-wives' : ''].join(' ');
    return `<button type="button" class="${c}" data-k="${k}" style="left:${(x / 6).toFixed(2)}%;top:${(y / H * 100).toFixed(2)}%;--d:${d.toFixed(2)}s;--g:${(k * 1.3 % 3.6).toFixed(1)}s"${p.erased ? ' title="호적에서 파인 이름"' : ''}>
      <span class="sp"><i></i></span>${p.wives ? `<span class="sat" aria-hidden="true"><i></i><i></i><i></i></span>` : ''}
      <span class="nm">${p.role ? `<small>${E(p.role)}</small>` : ''}${sur ? `<i>${E(sur)}</i>` : ''}<b>${E(given)}${p.erased ? SCRIB() : ''}</b>${p.erased ? '<em class="seal">除籍</em>' : ''}${p.wives ? `<em class="cnt">妻妾 ${hanNum(p.wives.length)}</em>` : ''}</span>
    </button>`;
  }
  // 부부 → 이음점 → 자녀들, (호적에 없는 일가는 흐릿한 별무리)
  function constellation(h) {
    const kids = h.kids || [], n = kids.length, cy = 58, hub = 138, ky = 224;
    const span = n > 1 ? Math.min(520, (n - 1) * 130) : 0;
    const K = kids.map((p, i) => {
      const x = n > 1 ? 300 - span / 2 + i * span / (n - 1) : 300;
      return { p, x, y: n > 4 ? ky + (i % 2) * 58 : ky - 16 * Math.cos((x - 300) / 270 * Math.PI / 2) };
    });
    let H = (n ? Math.max(...K.map(k => k.y)) : cy) + 84 + (h.twins ? 34 : 0);
    const gTop = H;
    if (h.ghosts) H += 150;
    const L = (d, cls, delay) => `<path class="ln ${cls || ''}" pathLength="1" d="${d}" style="--d:${delay.toFixed(2)}s"/>`;
    // 부부: 흰 줄 한 줄, 가운데 ✦
    let lines = L(`M244 ${cy} H288`, 'tie', .3) + L(`M356 ${cy} H312`, 'tie', .3);
    let extra = `<span class="fo-knot" style="top:${(cy / H * 100).toFixed(2)}%">✦</span>`;
    if (n) {
      lines += L(`M300 ${cy + 9} V${hub}`, '', .6) + `<circle class="hub" cx="300" cy="${hub}" r="2.6"/>`;
      K.forEach((k, i) => { lines += L(`M300 ${hub} L${k.x.toFixed(1)} ${k.y}`, '', .85 + i * .06); });
    }
    if (h.twins && n >= 2) {
      const a = K[0], b = K[1], ty = Math.max(a.y, b.y) + 66;
      lines += L(`M${a.x} ${ty - 10} Q${(a.x + b.x) / 2} ${ty + 12} ${b.x} ${ty - 10}`, 'tw', 1.5);
      extra += `<span class="fo-twin" style="left:${((a.x + b.x) / 12).toFixed(2)}%;top:${((ty + 16) / H * 100).toFixed(2)}%">${E(h.twins)}</span>`;
    }
    let ghosts = '';
    if (h.ghosts) {
      extra += `<span class="fo-gcap" style="top:${((gTop + 14) / H * 100).toFixed(2)}%"><i></i>${E(h.ghostNote || '')}<i></i></span>`;
      for (let i = 0; i < h.ghosts; i++) {
        const rx = (Math.sin(i * 12.9898) * 43758.5453) % 1, ry = (Math.sin(i * 78.233) * 12345.678) % 1;
        const x = 50 + (i + .5) / h.ghosts * 500 + Math.abs(rx) * 24 - 12, y = gTop + 50 + Math.abs(ry) * 80;
        ghosts += `<span class="cs ghost" title="未登載" style="left:${(x / 6).toFixed(2)}%;top:${(y / H * 100).toFixed(2)}%;--g:${(Math.abs(rx) * 5).toFixed(1)}s"><span class="sp"><i></i></span></span>`;
      }
    }
    const stars = star(h.couple[0], 0, 214, cy, H, .1, 'couple') + star(h.couple[1], 1, 386, cy, H, .2, 'couple')
      + K.map((k, i) => star(k.p, i + 2, k.x, k.y, H, 1.05 + i * .07, '')).join('');
    return `<div class="fo-cons tone-${E(h.tone)}" style="aspect-ratio:600/${H}">
      <svg viewBox="0 0 600 ${H}" aria-hidden="true">${lines}</svg>${stars}${ghosts}${extra}</div>`;
  }

  /* ---------- 왼쪽: 기울어진 궤도 + 가운데 걸린 문패 문장 ---------- */
  const O = { cx: 300, cy: 236, rx: 262, ry: 88, rot: -13 };
  const XIU = '角亢氐房心尾箕斗牛女虛危室壁奎婁胃昴畢觜參井鬼柳星張翼軫'; // 이십팔수
  function pt(deg, o) {
    o = o || O;
    const t = deg * Math.PI / 180, r = o.rot * Math.PI / 180, x = o.rx * Math.cos(t), y = o.ry * Math.sin(t);
    return { x: o.cx + x * Math.cos(r) - y * Math.sin(r), y: o.cy + x * Math.sin(r) + y * Math.cos(r), z: Math.sin(t) };
  }
  function mapSVG() {
    const ticks = Array.from({ length: 72 }, (_, i) => `<line x1="300" y1="${236 - 214}" x2="300" y2="${236 - (i % 6 ? 209 : 204)}" transform="rotate(${i * 5} 300 236)"/>`).join('');
    const xiu = [...XIU].map((c, i) => `<text x="300" y="${236 - 196}" transform="rotate(${i * 360 / 28} 300 236)">${c}</text>`).join('');
    const beads = Array.from({ length: 56 }, (_, i) => { const p = pt(i * 360 / 56), op = (.3 + .5 * (p.z + 1) / 2).toFixed(2);
      return i % 7 ? `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="1.3" opacity="${op}"/>` : `<path d="M${p.x.toFixed(1)} ${(p.y - 4).toFixed(1)} l3 4 -3 4 -3 -4z" opacity="${op}"/>`; }).join('');
    const stars = [[540, 30], [574, 300], [30, 330], [470, 452], [120, 470], [300, 486]].map(([x, y], i) => `<path d="M${x} ${y - 4} L${x + 1} ${y - 1} ${x + 4} ${y} ${x + 1} ${y + 1} ${x} ${y + 4} ${x - 1} ${y + 1} ${x - 4} ${y} ${x - 1} ${y - 1}Z" style="--s:${i * .9}s"/>`).join('');
    const back = { cx: 300, cy: 236, rx: 228, ry: 60, rot: 9 };
    return `<svg class="fo-svg" viewBox="0 0 600 500" aria-hidden="true">
      <defs>
        <linearGradient id="foSigG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#f3e7cf"/><stop offset="1" stop-color="#b9a27a"/></linearGradient>
        <linearGradient id="foSigR" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6ec"/><stop offset=".5" stop-color="#e9cfa2"/><stop offset="1" stop-color="#8f7650"/></linearGradient>
        <radialGradient id="foSigGlow"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".22" stop-color="#fff3dc" stop-opacity=".55"/><stop offset=".55" stop-color="#e8c58a" stop-opacity=".16"/><stop offset="1" stop-color="#e8c58a" stop-opacity="0"/></radialGradient>
        <linearGradient id="foSigGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1d2"/><stop offset=".5" stop-color="#e2bd7a"/><stop offset="1" stop-color="#a8823f"/></linearGradient>
        <linearGradient id="foSigLotus" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#d9b77a"/><stop offset=".55" stop-color="#f4e8d2"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
      </defs>
      <g class="guide"><circle cx="300" cy="236" r="120"/><circle cx="300" cy="236" r="168"/><circle cx="300" cy="236" r="214" class="solid"/><circle cx="300" cy="236" r="184" class="solid"/></g>
      <g class="ticks">${ticks}<g class="xiu">${xiu}</g></g>
      <g class="stars">${stars}</g>
      <ellipse class="orbit2" cx="${back.cx}" cy="${back.cy}" rx="${back.rx}" ry="${back.ry}" transform="rotate(${back.rot} 300 236)"/>
      <ellipse class="orbit" cx="${O.cx}" cy="${O.cy}" rx="${O.rx}" ry="${O.ry}" transform="rotate(${O.rot} ${O.cx} ${O.cy})"/>
      <ellipse class="orbit in" cx="${O.cx}" cy="${O.cy}" rx="${O.rx - 7}" ry="${O.ry - 5}" transform="rotate(${O.rot} ${O.cx} ${O.cy})"/>
      <g class="beads">${beads}</g>
    </svg>`;
  }
  function emblem(crest) {
    return `<svg class="fo-emb" viewBox="0 0 140 290" aria-hidden="true">
      <g class="cord"><line x1="70" y1="0" x2="70" y2="30"/><path d="M70 28 l7 7 -7 7 -7 -7z"/><path d="M63 35 q-15 4 -17 17 M77 35 q15 4 17 17"/></g>
      <path class="tab" d="M36 62 L70 45 L104 62 L104 210 L70 227 L36 210 Z"/>
      <path class="tab in" d="M44 67 L70 54 L96 67 L96 205 L70 218 L44 205 Z"/>
      <path class="dia" d="M70 78 l4 4 -4 4 -4 -4z M70 190 l4 4 -4 4 -4 -4z"/>
      <text x="70" y="153">${E(crest || '家')}</text>
      <g class="tassel"><line x1="70" y1="227" x2="70" y2="240"/><circle cx="70" cy="243" r="3.4"/><path d="M63 248 h14 l3 6 h-20z"/>${[63, 66.5, 70, 73.5, 77].map(x => `<line x1="${x}" y1="254" x2="${x + (x - 70) * .25}" y2="286"/>`).join('')}</g>
    </svg>`;
  }

  // 별을 눌렀을 때 아래에 뜨는 명패 카드 (부인이 있으면 처첩 별까지)
  function personCard(p, h, isKid) {
    const rel = isKid ? `${h.couple[0].name} ═ ${h.couple[1].name}의 자녀` : `${h.name}의 ${h.couple[0] === p ? '가주' : '안주인'}`;
    const wives = p.wives ? `<div class="fo-wlab"><i></i>妻妾 · 부인 ${p.wives.length}명<i></i></div><div class="fo-wrow">${p.wives.map((w, i) =>
      `<span class="ws ${/첩|妾/.test(w.role) ? 'concubine' : ''}" style="--d:${(.15 + i * .12).toFixed(2)}s"><span class="sp"><i></i></span><small>${E(w.role || '')}</small><b>${E(w.name)}</b></span>`).join('')}</div>` : '';
    return `<div class="fo-pop tone-${E(h.tone)}"><button class="fo-px" aria-label="닫기">✕</button>
      <small>${E(p.role || h.han)}</small><b class="${p.erased ? 'er' : ''}">${E(p.name)}${p.erased ? SCRIB() : ''}</b><p>${E(rel)}</p>${p.desc ? `<p class="fo-desc">${E(p.desc)}</p>` : ''}${wives}</div>`;
  }

  window.renderFamily = function (root) {
    const F = window.FAMILY, H = F.houses, N = H.length, STEP = 360 / N;
    root.classList.add('fo');
    root.innerHTML = `<div class="fo-map">
        <div class="fo-sky">${mapSVG()}<div class="fo-crest">${emblem(F.crest)}</div>
          ${H.map((h, i) => `<button type="button" class="fo-node tone-${E(h.tone)}" data-i="${i}" aria-label="${E(h.short || h.name)}"><span class="sig r${h.rank || 1}">${sigil(h.rank || 1)}</span><span class="lab">${E(h.han)}</span></button>`).join('')}
        </div>
        <div class="fo-cap"><small></small><b></b></div>
      </div>
      <div class="fo-side">
        <div class="fo-tabs" role="tablist">${H.map((h, i) => `<button type="button" role="tab" class="fo-tab tone-${E(h.tone)}" data-i="${i}"><small>${E(h.han)} · ${two(i + 1)}</small><b>${E(h.short || h.name)}</b></button>`).join('')}</div>
        <div class="fo-panel" aria-live="polite"><span class="fo-k tl"></span><span class="fo-k tr"></span><span class="fo-k bl"></span><span class="fo-k br"></span><div class="fo-inner"></div></div>
      </div>`;
    const nodes = [...root.querySelectorAll('.fo-node')], tabs = [...root.querySelectorAll('.fo-tab')];
    const panel = root.querySelector('.fo-panel'), cap = root.querySelector('.fo-cap');
    let cur = -1, ang = 0, target = 0, raf = 0;

    // 고른 집안이 궤도 맨 앞(아래)으로 천천히 돌아와요
    function place() {
      nodes.forEach((n, i) => {
        const p = pt(90 + i * STEP - ang), k = (p.z + 1) / 2;
        n.style.left = (p.x / 6) + '%'; n.style.top = (p.y / 5) + '%';
        n.style.setProperty('--k', k.toFixed(3));
        n.style.zIndex = p.z > -.15 ? 5 : 1;
      });
    }
    function tick() {
      const d = target - ang;
      ang = Math.abs(d) < .05 || still() ? target : ang + d * .085;
      place();
      raf = ang === target ? 0 : requestAnimationFrame(tick);
    }

    function show(i) {
      if (i === cur) return;
      const d = ((i * STEP - target) % 360 + 540) % 360 - 180; // 가까운 쪽으로 돌기
      target += d; cur = i;
      if (!raf) raf = requestAnimationFrame(tick);
      nodes.forEach((n, k) => n.classList.toggle('on', k === i));
      tabs.forEach((t, k) => { t.classList.toggle('on', k === i); t.setAttribute('aria-selected', k === i); });
      const h = H[i], from = H.find(x => x.id === h.from), cnt = h.couple.length + (h.kids || []).length;
      cap.classList.remove('swap'); void cap.offsetWidth; cap.classList.add('swap');
      cap.querySelector('small').textContent = `${h.han} · ${two(i + 1)}`;
      cap.querySelector('b').textContent = h.short || h.name;
      panel.querySelector('.fo-inner').innerHTML = `<div class="fo-head"><small>${E(h.han)}宿 · ${hanNum(cnt)}星</small><h3>${E(h.name)}</h3>
          ${from ? `<em class="fo-from">${E(from.han)}에서 갈라져 나온 별자리</em>` : ''}${h.desc ? `<p>${E(h.desc)}</p>` : ''}<span class="fo-wm">${E(h.han)}</span></div>
        ${constellation(h)}
        <div class="fo-ph"><button class="fo-prev" aria-label="이전 집안">‹</button><span>${two(i + 1)} / ${two(N)}</span><button class="fo-next" aria-label="다음 집안">›</button></div>`;
      panel.querySelectorAll('.fo-pop').forEach(x => x.remove());
      panel.style.minHeight = '';
      panel.className = `fo-panel tone-${h.tone}`; void panel.offsetWidth; panel.classList.add('swap');
    }

    root.addEventListener('click', e => {
      const n = e.target.closest('.fo-node, .fo-tab'); if (n) return show(+n.dataset.i);
      if (e.target.closest('.fo-prev')) return show((cur - 1 + N) % N);
      if (e.target.closest('.fo-next')) return show((cur + 1) % N);
      if (e.target.closest('.fo-px')) { panel.querySelectorAll('.fo-pop').forEach(x => x.remove()); panel.querySelectorAll('.cs.picked').forEach(x => x.classList.remove('picked')); panel.style.minHeight = ''; return; }
      // 별을 누르면 그 아래에 명패 카드가 떠요
      const q = e.target.closest('.fo-cons .cs:not(.ghost)');
      if (!q) { if (!e.target.closest('.fo-pop')) { panel.querySelectorAll('.fo-pop').forEach(x => x.remove()); panel.querySelectorAll('.cs.picked').forEach(x => x.classList.remove('picked')); panel.style.minHeight = ''; } return; }
      const h = H[cur], all = [...h.couple, ...(h.kids || [])], k = +q.dataset.k, p = all[k]; if (!p) return;
      panel.querySelectorAll('.fo-pop').forEach(x => x.remove());
      panel.querySelectorAll('.cs.picked').forEach(x => x.classList.remove('picked')); panel.style.minHeight = '';
      const wrap = document.createElement('div'); wrap.innerHTML = personCard(p, h, k >= h.couple.length);
      const pop = wrap.firstElementChild; panel.appendChild(pop);
      const pr = panel.getBoundingClientRect(), qr = q.querySelector('.nm').getBoundingClientRect();
      const x = Math.min(Math.max(8, qr.left - pr.left + qr.width / 2 - pop.offsetWidth / 2), pr.width - pop.offsetWidth - 8);
      pop.style.left = x + 'px'; pop.style.top = (qr.bottom - pr.top + 12) + 'px';
      // 카드가 판 밖으로 삐져나가지 않게 판을 늘려요
      panel.style.minHeight = Math.max(0, qr.bottom - pr.top + 12 + pop.offsetHeight + 20) + 'px';
      q.classList.add('picked');
    });
    addEventListener('keydown', e => { if (!root.matches(':hover')) return; if (e.key === 'ArrowRight') show((cur + 1) % N); if (e.key === 'ArrowLeft') show((cur - 1 + N) % N); });
    place(); show(0);
  };
})();
