
window.SITE_CONFIG = {
  siteName: '三娑罗',
  siteNameKo: '삼사라',
  siteMotto: 'Archive of Crimson Talismans'
};

(function () {
  const C = window.SITE_CONFIG;
  // ✏️ 메뉴 — [페이지 키, 주소, 이름, 한자, 새 탭으로 열지]
  const NAV = [
    ['home', 'index.html', '소개', '序'],
    ['world', 'world.html', '세계관', '界'],
    ['tutorial', 'https://samsara-ecru.vercel.app/', '튜토리얼', '導', true],
    ['apply', 'https://forms.gle/QaKNqpV2xFK4YtNf6', '신청서 제출', '書', true]
  ];

  window.$ = (s, r) => (r || document).querySelector(s);
  window.$$ = (s, r) => [...(r || document).querySelectorAll(s)];
  window.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  window.pad2 = n => String(n).padStart(2, '0');
  window.qs = k => new URLSearchParams(location.search).get(k);
  window.REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 토스트 ---------- */
  window.toast = (msg, kind) => {
    let box = $('.toasts');
    if (!box) { box = document.createElement('div'); box.className = 'toasts'; document.body.appendChild(box); }
    const t = document.createElement('div');
    t.className = 'toast' + (kind ? ' ' + kind : '');
    t.textContent = msg; box.appendChild(t);
    setTimeout(() => t.classList.add('out'), 2600);
    setTimeout(() => t.remove(), 3000);
  };

  /* ---------- 스크롤하는 동안에만 스크롤 막대 ---------- */
  addEventListener('scroll', e => {
    const el = e.target === document ? document.documentElement : e.target;
    if (!el || !el.classList) return;
    el.classList.add('is-scrolling'); clearTimeout(el._sbT);
    el._sbT = setTimeout(() => el.classList.remove('is-scrolling'), 900);
  }, true);

  /* ---------- 모달 ---------- */
  window.openModal = (html, cls) => {
    closeModal();
    const m = document.createElement('div');
    m.className = 'modal-back';
    m.innerHTML = `<div class="modal ${cls || ''}" role="dialog" aria-modal="true">
      <span class="mc tl"></span><span class="mc tr"></span><span class="mc bl"></span><span class="mc br"></span>
      <button class="modal-x" aria-label="닫기">×</button><div class="modal-in">${html}</div></div>`;
    m.addEventListener('pointerdown', e => { if (e.target === m) closeModal(); });
    m.querySelector('.modal-x').onclick = closeModal;
    document.body.appendChild(m);
    document.body.classList.add('no-scroll');
    return m.querySelector('.modal');
  };
  window.closeModal = () => {
    $$('.modal-back').forEach(m => m.remove());
    if (!$('.drawer')) document.body.classList.remove('no-scroll');
  };
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('.modal-back')) closeModal(); });

  /* ---------- 스크롤 등장 효과 [data-reveal] ---------- */
  window.reveal = root => {
    const els = $$('[data-reveal]:not(.in)', root);
    if (!('IntersectionObserver' in window) || REDUCED) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(e => io.observe(e));
  };
  window.typeText = (el, text, speed = 28) => {
    if (REDUCED) { el.textContent = text; return; }
    el.textContent = ''; let i = 0;
    const tick = () => { el.textContent = text.slice(0, ++i); if (i < text.length) setTimeout(tick, speed); };
    tick();
  };

  /* ---------- 헤더 / 푸터 ---------- */
  window.SITE_MARK = `<span class="mark" aria-hidden="true">${esc([...C.siteName][0])}</span>`;
  function renderChrome() {
    const page = document.body.dataset.page;
    const h = document.createElement('header');
    h.className = 'site-header';
    h.innerHTML = `
      <a class="brand" href="index.html">${SITE_MARK}<span class="bn">${esc(C.siteName)}<small>${esc(C.siteNameKo)}</small></span></a>
      <nav class="nav">${NAV.map(([k, href, label, han, ext]) =>
        `<a href="${href}" class="${k === page ? 'on' : ''}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}><i>${han}</i>${label}</a>`).join('')}</nav>
      <button class="menu-btn" aria-label="메뉴">${'<i></i>'.repeat(3)}</button>`;
    document.body.prepend(h);
    h.querySelector('.menu-btn').onclick = () => h.classList.toggle('open');
    addEventListener('scroll', () => h.classList.toggle('scrolled', scrollY > 10), { passive: true });
    if (document.body.dataset.nofooter === undefined) {
      const f = document.createElement('footer');
      f.className = 'site-footer';
      f.innerHTML = `<div class="meander"></div><div class="f-name">${esc(C.siteName)}</div>
        <p>${esc(C.siteMotto)}</p><small>© ${new Date().getFullYear()} ${esc(C.siteNameKo)}</small>`;
      document.body.appendChild(f);
    }
  }

  function embers() {
    const c = document.createElement('canvas');
    c.className = 'embers'; document.body.prepend(c);
    const x = c.getContext('2d');
    let W, H, list = [], lastT = 0;
    const spawn = y => ({ x: Math.random() * W, y: y == null ? H + 10 : y, vy: -(.15 + Math.random() * .6), vx: (Math.random() - .5) * .2,
      r: .5 + Math.random() * 1.8, p: Math.random() * 6.28, ash: Math.random() < .25 });
    function size() {
      W = innerWidth; H = innerHeight; c.width = W; c.height = H;
      list = Array.from({ length: Math.min(60, Math.round(W * H / 24000)) }, () => spawn(Math.random() * H));
    }
    function draw(t) {
      if (document.hidden || t - lastT < 32) { if (!REDUCED) requestAnimationFrame(draw); return; }
      lastT = t; x.clearRect(0, 0, W, H); x.globalCompositeOperation = 'lighter';
      for (const s of list) {
        if (!REDUCED) { s.y += s.vy * 2; s.x += s.vx * 2 + Math.sin(t / 1400 + s.p) * .5; }
        if (s.y < -10) Object.assign(s, spawn());
        const fl = .55 + .45 * Math.sin(t / 260 + s.p * 3), a = Math.min(1, (H - s.y) / 200) * Math.min(1, s.y / 160) * fl;
        if (s.ash) { x.fillStyle = `rgba(170,180,205,${a * .3})`; x.beginPath(); x.arc(s.x, s.y, s.r * .7, 0, 6.28); x.fill(); continue; }
        x.fillStyle = `rgba(150,175,230,${a * .1})`; x.beginPath(); x.arc(s.x, s.y, s.r * 4, 0, 6.28); x.fill();
        x.fillStyle = `rgba(${225 + (s.p * 5 | 0)},235,255,${a * .8})`; x.beginPath(); x.arc(s.x, s.y, s.r, 0, 6.28); x.fill();
      }
      x.globalCompositeOperation = 'source-over';
      if (!REDUCED) requestAnimationFrame(draw);
    }
    size(); addEventListener('resize', size); requestAnimationFrame(draw);
  }

  addEventListener('contextmenu', e => { if (!e.target.closest('input, textarea')) e.preventDefault(); });
  addEventListener('keydown', e => {
    const k = (e.key || '').toLowerCase(), mod = e.ctrlKey || e.metaKey;
    if (k === 'f12' || (mod && e.shiftKey && ['i', 'j', 'c', 'k'].includes(k)) || (mod && e.altKey && ['i', 'j', 'c', 'u'].includes(k)) || (mod && ['u', 's'].includes(k))) {
      e.preventDefault(); e.stopPropagation();
    }
  }, true);
  addEventListener('dragstart', e => { if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') e.preventDefault(); });

  window.App = {
    ready: (async () => {
      if (document.readyState === 'loading') await new Promise(r => document.addEventListener('DOMContentLoaded', r));
      if (document.body.dataset.embers !== undefined) embers();
      // 배경 영상 자동재생 보장
      const kick = () => $$('video[autoplay]').forEach(v => { if (v.paused && !REDUCED) v.play().catch(() => {}); });
      kick();
      document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
      addEventListener('pointerdown', kick, { once: true });
      renderChrome();
      reveal();
      return null;
    })()
  };
})();
