(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const ARROW = '<svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>';

  /* ------------------------------------------------------------------
     Дані кейсів
  ------------------------------------------------------------------ */
  const IMG = 'assets/img/';
  const PROJECTS = [
    {
      slug: 'solarize', title: 'Solarize', subtitle: 'Renewable energy', tag: 'Redesign', year: 2025,
      client: 'Solarize', deliverables: 'Desktop + Mobile', role: 'UX/UI designer',
      cover: 'solarize.png',
      desc: 'Після ретельної аналітики сайту та референсів нову версію зробили легшою за рахунок світліших кольорів, більшої кількості повітря між блоками й елементами та заокруглення кутів і кнопок. Зменшили текстові блоки для швидшого сприйняття інформації, а кнопки зробили більш акцентними для кращої конверсії.',
      gallery: [['solarize-1.png', 1400, 1000, 1], ['solarize-2.png', 1000, 1000], ['solarize-3.png', 1200, 1200]]
    },
    {
      slug: 'hunter', title: 'Hunter', subtitle: 'Додаток для замовлення їжі', tag: 'Application', year: 2026,
      client: 'Hunter', deliverables: 'Application for iOS / Android', role: 'UX/UI designer',
      cover: 'hunter.png',
      desc: 'Задача — створити зручний та інтуїтивно зрозумілий додаток для замовлення їжі. Проаналізовано схожі додатки в регіоні, обговорено з бізнесом варіанти, що виділять серед конкурентів, створено гіпотези та протестовано їх на користувачах. Мінімізовано кількість кроків до замовлення, чіткі акценти та видимість стану системи.',
      gallery: [['hunter-1.png', 1600, 1120, 1], ['hunter-2.png', 1000, 1000], ['hunter-3.png', 1000, 1000], ['hunter-4.png', 1400, 800, 1]]
    },
    {
      slug: 'ai-for-business', title: 'AI for business', subtitle: 'Лендинг практичного вебінару', tag: 'Landing page', year: 2025,
      client: 'Private business', deliverables: 'Landing page', role: 'UX/UI designer',
      cover: 'ai-business.png',
      desc: 'На основі аналітики розробив візуальну концепцію та структуру блоків для ознайомлення й запису потенційних клієнтів на практичний вебінар. Узгодили основні та акцентні кольори, скоригували текст і підібрали графічні елементи для підвищення конверсії.',
      gallery: [['ai-1.png', 1400, 800, 1], ['ai-2.png', 1000, 1000], ['ai-3.png', 1000, 1000], ['ai-4.png', 1400, 800, 1]]
    },
    {
      slug: 'photographer', title: 'Photographer', subtitle: 'Сайт-портфоліо фотографа', tag: 'Portfolio website', year: 2025,
      client: 'Smirnov', deliverables: 'Portfolio website', role: 'UX/UI designer',
      cover: 'photographer.png',
      desc: 'Сайт-портфоліо для фотографа. Запит — креативний, не шаблонний дизайн, який знайомить користувача з послугами та підводить до заповнення заявки на фотосесію.',
      gallery: [['photo-1.png', 1400, 800, 1], ['photo-2.png', 1000, 1000], ['photo-3.png', 1000, 1000], ['photo-4.png', 1400, 800, 1]]
    },
    {
      slug: 'e-commerce', title: 'Graphic design', subtitle: 'Інфографіка для маркетплейсів', tag: 'E-commerce', year: 2024,
      client: 'Rozetka, Prom', deliverables: 'E-commerce', role: 'Graphic designer',
      cover: 'ecommerce.png',
      desc: 'Інфографіка для карток товарів на маркетплейсах Rozetka та Prom: чітка подача переваг продукту, яка допомагає покупцю швидше ухвалити рішення.',
      gallery: [['ecom-1.png', 1400, 800, 1], ['ecom-2.png', 1000, 1000], ['ecom-3.png', 1000, 1000], ['ecom-4.png', 1400, 800, 1]]
    },
    {
      slug: 'game', title: 'Mobile game', subtitle: 'Game for Android', tag: 'Game design', year: 2026,
      client: 'Traffbraza', deliverables: 'Game for Android', role: 'Game designer',
      cover: 'game.png',
      desc: 'Дизайн простих мобільних ігор для Android. Розроблено з дотриманням гайдлайнів Material Design. Створено чіткий UI Kit для передачі в розробку.',
      gallery: [['game-1.png', 1400, 800, 1], ['game-2.png', 1000, 1000], ['game-3.png', 1000, 1000], ['game-4.png', 1400, 800, 1]]
    }
  ];
  const findProject = slug => PROJECTS.find(p => p.slug === slug);

  /* ------------------------------------------------------------------
     Viewport height: iOS toolbars change svh/vh mid-scroll, which resizes
     everything above and makes the page jump. On touch devices keep --vh
     in px and update it only when the width changes (rotation).
  ------------------------------------------------------------------ */
  const coarse = matchMedia('(hover: none), (pointer: coarse)').matches;
  let vhWidth = 0;
  const lockVh = () => {
    if (coarse && innerWidth === vhWidth) return;
    vhWidth = innerWidth;
    document.documentElement.style.setProperty('--vh', `${innerHeight / 100}px`);
  };
  lockVh();
  addEventListener('resize', lockVh);

  /* ------------------------------------------------------------------
     Smooth scroll
  ------------------------------------------------------------------ */
  gsap.registerPlugin(ScrollTrigger);
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  // The page always starts at the hero: no scroll restored on reload, no jump to a section hash
  ScrollTrigger.clearScrollMemory('manual');
  const toTop = () => { scrollTo(0, 0); lenis?.scrollTo(0, { immediate: true }); };
  const scrollToEl = el => {
    if (lenis) lenis.scrollTo(el, { duration: 1.6, easing: t => 1 - Math.pow(1 - t, 4) });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  /* ------------------------------------------------------------------
     Split text
  ------------------------------------------------------------------ */
  function splitChars(el) {
    const chars = [];
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          [...n.textContent].forEach(c => {
            if (/\s/.test(c)) { frag.append(' '); return; }
            const s = document.createElement('span');
            s.className = 'ch';
            s.textContent = c;
            frag.append(s);
            chars.push(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    return chars;
  }

  function splitWords(el) {
    const words = [];
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(' '); return; }
            const w = document.createElement('span');
            const wi = document.createElement('span');
            w.className = 'w';
            wi.className = 'wi';
            wi.textContent = part;
            w.append(wi);
            frag.append(w);
            words.push(wi);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
    return words;
  }

  /* ------------------------------------------------------------------
     Hero: interactive dot field
  ------------------------------------------------------------------ */
  function dotField() {
    const hero = $('.hero');
    const cv = $('.hero__canvas');
    const ctx = cv.getContext('2d');
    const state = { reveal: reduce ? 1 : 0 };
    const m = { x: null, y: null, tx: 0, ty: 0, last: 0 };
    let w, h, maxD, dots = [], running = false;

    function build() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = w < 600 ? 24 : 30;
      dots = [];
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) dots.push({ x, y, d: Math.hypot(x - w / 2, y - h / 2) });
      }
      maxD = Math.hypot(w / 2, h / 2);
      if (!running) draw();
    }

    hero.addEventListener('pointermove', e => {
      const r = cv.getBoundingClientRect();
      m.tx = e.clientX - r.left; m.ty = e.clientY - r.top; m.last = performance.now();
    });

    function draw() {
      const now = performance.now();
      if (now - m.last > 2500) {
        const s = now / 1000;
        m.tx = w * (0.5 + 0.32 * Math.sin(s * 0.45));
        m.ty = h * (0.5 + 0.3 * Math.sin(s * 0.7 + 1));
      }
      if (m.x === null) { m.x = m.tx; m.y = m.ty; }
      m.x += (m.tx - m.x) * 0.08;
      m.y += (m.ty - m.y) * 0.08;

      ctx.clearRect(0, 0, w, h);
      const R = Math.min(280, Math.max(160, w * 0.22));
      const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, R * 1.8);
      glow.addColorStop(0, `rgba(200,255,60,${0.11 * state.reveal})`);
      glow.addColorStop(1, 'rgba(200,255,60,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      const limit = state.reveal * maxD;
      const hot = [];
      ctx.fillStyle = 'rgba(238,235,227,.14)';
      for (const d of dots) {
        if (d.d > limit) continue;
        const dx = d.x - m.x, dy = d.y - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < R) hot.push(d, dx, dy, dist);
        else ctx.fillRect(d.x - 1, d.y - 1, 2, 2);
      }
      for (let i = 0; i < hot.length; i += 4) {
        const d = hot[i], dx = hot[i + 1], dy = hot[i + 2], dist = hot[i + 3] || 1;
        const f = 1 - dist / R, e = f * f;
        const push = (e * 26) / dist;
        ctx.fillStyle = `rgba(200,255,60,${0.18 + e * 0.82})`;
        ctx.beginPath();
        ctx.arc(d.x + dx * push, d.y + dy * push, 1 + e * 2.8, 0, Math.PI * 2);
        ctx.fill();
      }
      if (running) requestAnimationFrame(draw);
    }

    if (!reduce) {
      new IntersectionObserver(([en]) => {
        const was = running;
        running = en.isIntersecting;
        if (running && !was) requestAnimationFrame(draw);
      }).observe(hero);
    }
    new ResizeObserver(build).observe(cv);

    return { reveal: () => gsap.to(state, { reveal: 1, duration: 2.4, ease: 'power2.out' }) };
  }
  const dots = dotField();

  /* ------------------------------------------------------------------
     Intro + preloader
  ------------------------------------------------------------------ */
  const heroChars = $$('.hero [data-split]').map(splitChars);
  const heroWords = $$('.hero [data-words]').map(splitWords).flat();

  function intro() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo('.nav', { yPercent: -100 }, { yPercent: 0, duration: 1.2, clearProps: 'transform' }, 0)
      .fromTo(heroChars[0], { yPercent: 115, rotate: 8 }, { yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.05 }, 0)
      .fromTo(heroChars[1], { yPercent: 115, rotate: 8 }, { yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.045 }, 0.12)
      .fromTo('.hero__badge', { scale: 0 }, { scale: 1, duration: 1.8 }, 0.35)
      .fromTo('.hero__badge-ring', { rotate: -140 }, { rotate: 0, duration: 1.8 }, 0.35)
      .fromTo(heroWords, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.025 }, 0.5)
      .fromTo('.hero__meta > *', { y: -16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.08 }, 0.5)
      .fromTo('.hero__stack', { x: -24, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.2 }, 0.7)
      .fromTo('.hero__scroll', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 0.9)
      .add(dots.reveal, 0.2);
    return tl;
  }

  function preloader() {
    const pre = $('.preloader');
    toTop();
    const done = () => {
      toTop();
      document.body.classList.remove('is-loading');
      lenis?.start();
      handleInitialHash();
    };
    if (reduce) { pre.remove(); done(); dots.reveal(); return; }

    lenis?.stop();
    const count = $('.preloader__count');
    const o = { v: 0 };
    gsap.timeline()
      .fromTo('.preloader__mask > span', { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12 }, 0)
      .to(o, { v: 100, duration: 2.1, ease: 'power3.inOut', onUpdate: () => { count.textContent = String(Math.round(o.v)).padStart(3, '0'); } }, 0)
      .to('.preloader__bar span', { scaleX: 1, duration: 2.1, ease: 'power3.inOut' }, 0)
      .to('.preloader__mask > span', { yPercent: -110, duration: 0.8, ease: 'expo.in', stagger: 0.06 }, '+=.1')
      .to(['.preloader__count', '.preloader__top', '.preloader__bar'], { autoAlpha: 0, duration: 0.4 }, '<.25')
      .to(pre, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.2, ease: 'expo.inOut' }, '-=.2')
      .add(intro(), '-=.7')
      .add(done, '<.3')
      .add(() => pre.remove());
  }

  /* ------------------------------------------------------------------
     Cursor + magnetic
  ------------------------------------------------------------------ */
  if (fine) {
    document.documentElement.classList.add('has-cursor');
    const cur = $('.cursor');
    const dot = $('.cursor__dot');
    const ring = $('.cursor__ring');
    const label = $('.cursor__label');
    const badgeText = $('.cursor__badge textPath');
    const dx = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
    gsap.set([dot, ring], { x: -100, y: -100 });

    addEventListener('pointermove', e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor], [data-cursor-hide], a, button, .step, .tools li');
      cur.classList.remove('is-label', 'is-badge', 'is-hover', 'is-hidden');
      if (!t) return;
      if (t.hasAttribute('data-cursor-hide')) cur.classList.add('is-hidden');
      else if (t.dataset.cursor && t.hasAttribute('data-cursor-badge')) { badgeText.textContent = `${t.dataset.cursor} • `.repeat(2); cur.classList.add('is-label', 'is-badge'); }
      else if (t.dataset.cursor) { label.textContent = t.dataset.cursor; cur.classList.add('is-label'); }
      else cur.classList.add('is-hover');
    });
    document.addEventListener('pointerleave', () => cur.classList.add('is-hidden'));
    document.addEventListener('pointerenter', () => cur.classList.remove('is-hidden'));

    $$('[data-magnetic]').forEach(el => {
      const s = parseFloat(el.dataset.magnetic) || 0.3;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * s, y: (e.clientY - r.top - r.height / 2) * s, duration: 0.6, ease: 'power3.out', overwrite: true });
      });
      el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, .35)', overwrite: true }));
    });
  }

  /* ------------------------------------------------------------------
     Nav, menu, clock, progress
  ------------------------------------------------------------------ */
  const nav = $('.nav');
  const burger = $('.nav__burger');
  const menu = $('.menu');
  let menuOpen = false;

  function toggleMenu(open = !menuOpen) {
    menuOpen = open;
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    const r = burger.getBoundingClientRect();
    const at = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
    if (open) {
      lenis?.stop();
      gsap.set(menu, { visibility: 'visible' });
      gsap.fromTo(menu, { clipPath: `circle(0% at ${at})` }, { clipPath: `circle(150% at ${at})`, duration: 0.9, ease: 'expo.inOut' });
      gsap.fromTo('.menu__links a, .menu__foot a', { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.3 });
    } else {
      lenis?.start();
      gsap.to(menu, { clipPath: `circle(0% at ${at})`, duration: 0.7, ease: 'expo.inOut', onComplete: () => gsap.set(menu, { visibility: 'hidden' }) });
    }
  }
  burger.addEventListener('click', () => toggleMenu());

  const msg = $('.msg');
  const msgBtn = $('.msg__btn');
  function toggleMsg(open = !msg.classList.contains('is-open')) {
    msg.classList.toggle('is-open', open);
    msgBtn.setAttribute('aria-expanded', open);
  }
  msgBtn.addEventListener('click', () => toggleMsg());
  $$('.msg__item').forEach(a => a.addEventListener('click', () => toggleMsg(false)));
  document.addEventListener('click', e => { if (!msg.contains(e.target)) toggleMsg(false); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !msg.classList.contains('is-open')) return;
    toggleMsg(false);
    msgBtn.focus();
  });

  const clockFmt = new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv', hour: '2-digit', minute: '2-digit' });
  const tick = () => $$('[data-clock]').forEach(el => { el.textContent = clockFmt.format(new Date()); });
  tick();
  setInterval(tick, 10000);

  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: self => {
      const y = self.scroll();
      nav.classList.toggle('is-scrolled', y > 40);
      nav.classList.toggle('is-hidden', y > innerHeight * 0.7 && self.direction === 1 && !menuOpen);
      if (nav.classList.contains('is-hidden')) toggleMsg(false);
    }
  });
  gsap.to('.progress span', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

  /* ------------------------------------------------------------------
     Marquees (react to scroll velocity)
  ------------------------------------------------------------------ */
  const marquees = $$('[data-marquee]').map(m => {
    const track = $('.marquee__track', m);
    const chunk = track.innerHTML;
    let unit = chunk;
    for (let i = 0; i < 12 && track.scrollWidth < innerWidth * 1.1; i++) {
      unit += chunk;
      track.innerHTML = unit;
    }
    track.innerHTML = unit + unit;
    const dur = +m.dataset.speed || 30;
    const right = m.dataset.dir === 'right';
    const tw = gsap.fromTo(track, { xPercent: right ? -50 : 0 }, { xPercent: right ? 0 : -50, duration: dur, ease: 'none', repeat: -1 });
    tw.totalTime(dur * 200);
    if (reduce) tw.pause();
    return { tw, track };
  });

  if (!reduce) {
    let settle;
    const skews = marquees.map(({ track }) => gsap.quickTo(track, 'skewX', { duration: 0.4, ease: 'power3' }));
    ScrollTrigger.create({
      onUpdate: self => {
        const v = self.getVelocity();
        const dir = self.direction;
        const boost = 1 + Math.min(Math.abs(v) / 260, 5);
        marquees.forEach(({ tw }) => gsap.to(tw, { timeScale: boost * dir, duration: 0.2, overwrite: true }));
        skews.forEach(s => s(gsap.utils.clamp(-8, 8, v / -250)));
        clearTimeout(settle);
        settle = setTimeout(() => {
          marquees.forEach(({ tw }) => gsap.to(tw, { timeScale: dir, duration: 1.2, overwrite: true }));
          skews.forEach(s => s(0));
        }, 120);
      }
    });
  }

  /* ------------------------------------------------------------------
     Scroll animations
  ------------------------------------------------------------------ */
  if (!reduce) {
    // Hero parallax
    const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero__head', { xPercent: -16, ease: 'none', scrollTrigger: heroST });
    gsap.to('.hero__row--2 .hero__line', { xPercent: 12, ease: 'none', scrollTrigger: heroST });
    gsap.to('.hero__badge-ring', { rotate: 220, ease: 'none', scrollTrigger: heroST });
    gsap.to('.hero__bottom', { opacity: 0, y: -60, ease: 'none', scrollTrigger: { ...heroST, end: '60% top' } });
    gsap.to('.hero__canvas', { opacity: 0.2, ease: 'none', scrollTrigger: heroST });

    // Headings: word mask reveal
    $$('[data-reveal]').forEach(el => {
      const words = splitWords(el);
      gsap.from(words, {
        yPercent: 115, rotate: 5, duration: 1.3, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
    $$('[data-words]').forEach(el => {
      if (el.closest('.hero')) return;
      const words = splitWords(el);
      gsap.from(words, {
        yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.03,
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
    $$('.eyebrow').forEach(el => gsap.from(el, {
      x: -30, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' }
    }));

    // Marquee entrance
    gsap.from('.marquee--acc', {
      rotate: 6, yPercent: 60, ease: 'none',
      scrollTrigger: { trigger: '.marquee--acc', start: 'top bottom', end: 'top 50%', scrub: true }
    });

    // Stacked project cards
    const cards = $$('.card');
    const mobile = () => innerWidth <= 600;
    // Keep in sync with --stack-top / --stack-step in style.css
    const offset = i => (mobile() ? 72 : 84) + i * (mobile() ? 8 : 14);
    const last = cards[cards.length - 1];
    $('.work__stack').style.setProperty('--n', cards.length);
    // Measure cards at their natural position, not wherever sticky holds them
    ScrollTrigger.addEventListener('refreshInit', () => cards.forEach(c => (c.style.position = 'static')));
    ScrollTrigger.addEventListener('refresh', () => cards.forEach(c => (c.style.position = '')));
    cards.forEach((card, i) => {
      const inner = $('.card__inner', card);
      const img = $('.card__media img', card);

      gsap.fromTo(img, { scale: 1.3, yPercent: -6 }, {
        scale: 1, yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: () => `top top+=${offset(i)}`, scrub: true }
      });
      gsap.from($('.card__head', card).children, {
        y: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.06,
        scrollTrigger: { trigger: card, start: 'top 75%' }
      });

      if (card === last) return;
      // Pinning is CSS position: sticky (see .card)
      const next = cards[i + 1];
      const st = { trigger: next, start: 'top bottom', end: () => `top top+=${offset(i + 1)}`, scrub: true, invalidateOnRefresh: true };
      gsap.to(inner, { scale: 0.9 + i * 0.012, rotateX: -6, ease: 'none', scrollTrigger: st });
      gsap.to($('.card__shade', card), { opacity: 0.6, ease: 'none', scrollTrigger: st });
    });

    // About
    gsap.fromTo('.about__photo', { clipPath: 'inset(100% 0% 0% 0% round 24px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.6, ease: 'expo.inOut',
      scrollTrigger: { trigger: '.about__photo', start: 'top 80%' }
    });
    gsap.fromTo('.about__photo img', { yPercent: -12 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.about__grid', start: 'top bottom', end: 'bottom top', scrub: true }
    });
    gsap.from('.about__photo-tag', {
      scale: 0, rotate: -20, duration: 1, ease: 'back.out(2)',
      scrollTrigger: { trigger: '.about__photo', start: 'top 50%' }
    });
    $$('[data-scrub]').forEach(el => {
      const words = splitWords(el);
      gsap.to(words, {
        opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true }
      });
    });
    gsap.from('.about__cols > div, .tools li, .tools__note', {
      y: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.05,
      scrollTrigger: { trigger: '.about__cols', start: 'top 85%' }
    });

    // Process: horizontal scroll on desktop
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', () => {
      const track = $('.process__track');
      const dist = () => track.scrollWidth - innerWidth;
      const st = { trigger: '.process', start: 'top top', end: () => `+=${dist()}`, scrub: 0.8, pin: true, invalidateOnRefresh: true };
      const tween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: st });
      gsap.to('.process__bar span', { scaleX: 1, ease: 'none', scrollTrigger: { ...st, pin: false } });
      $$('.step').forEach(step => {
        gsap.from(step, {
          rotate: 4, y: 80, autoAlpha: 0.2, ease: 'none',
          scrollTrigger: { trigger: step, containerAnimation: tween, start: 'left 105%', end: 'left 75%', scrub: true }
        });
      });
    });
    mm.add('(max-width: 900px)', () => {
      $$('.step').forEach(step => gsap.from(step, {
        y: 60, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: step, start: 'top 88%' }
      }));
    });

    // Services
    gsap.from('.service', {
      y: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: '.services__list', start: 'top 85%' }
    });

    // Contact
    const contactChars = $$('.contact [data-split]').map(splitChars);
    const ctl = gsap.timeline({ scrollTrigger: { trigger: '.contact__title', start: 'top 80%' }, defaults: { ease: 'expo.out' } });
    ctl.from(contactChars[0], { yPercent: 115, rotate: 8, duration: 1.4, stagger: 0.04 })
      .from(contactChars[1], { yPercent: 115, rotate: 8, duration: 1.4, stagger: 0.05 }, '<.15')
      .from('.contact__cta', { scale: 0, rotate: -90, duration: 1.4, ease: 'elastic.out(1, .5)' }, '<.2');
    gsap.from('.contact__grid > div', {
      y: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: '.contact__grid', start: 'top 92%' }
    });
  }

  /* ------------------------------------------------------------------
     Case study overlay
  ------------------------------------------------------------------ */
  const caseEl = $('.case');
  const caseScroll = $('.case__scroll');
  const caseContent = $('.case__content');
  const caseClose = $('.case__close');
  let caseOpen = false;
  let returnFocus = null;
  let revealIO = null;

  function renderCase(p) {
    const i = PROJECTS.indexOf(p);
    const next = PROJECTS[(i + 1) % PROJECTS.length];
    const meta = [['Клієнт', p.client], ['Формат', p.deliverables], ['Рік', p.year], ['Роль', p.role]];
    caseContent.innerHTML = `
      <header class="case__head">
        <div>
          <p class="case__tag"><b>${String(i + 1).padStart(2, '0')}</b>${p.tag}</p>
          <h2 class="case__title" id="case-title">${p.title}</h2>
          <p class="case__sub">${p.subtitle}</p>
        </div>
        <span class="case__year">${p.year}</span>
      </header>
      <div class="case__hero"><img src="${IMG + p.cover}" alt="${p.title}"></div>
      <div class="case__info">
        <p class="case__desc">${p.desc}</p>
        <dl class="case__meta">${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
      </div>
      <div class="case__gallery">
        ${p.gallery.map(([src, w, h, wide]) => `<figure class="${wide ? 'is-wide' : ''}"><img src="${IMG + src}" alt="${p.title} — макет" width="${w}" height="${h}" loading="lazy" decoding="async"></figure>`).join('')}
      </div>
      <a class="case__next" href="#${next.slug}" data-cursor="Далі">
        <small>Наступний проєкт</small>
        <strong>${next.title}</strong>
        <span class="case__next-arrow">${ARROW}</span>
      </a>`;

    revealIO?.disconnect();
    revealIO = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); }
    }), { root: caseScroll, threshold: 0.12 });
    $$('.case__hero, .case__info > *, .case__gallery figure', caseContent).forEach(el => revealIO.observe(el));

    const words = splitWords($('.case__title', caseContent));
    return words;
  }

  function animateCaseIn(words, delay = 0) {
    if (reduce) return;
    gsap.timeline({ delay, defaults: { ease: 'expo.out' } })
      .from(words, { yPercent: 115, rotate: 6, duration: 1.3, stagger: 0.07 })
      .from('.case__tag, .case__sub', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.08 }, '<.15')
      .from('.case__year', { x: 60, autoAlpha: 0, duration: 1.2 }, '<');
  }

  function openCase(slug, x = innerWidth / 2, y = innerHeight / 2, push = true) {
    const p = findProject(slug);
    if (!p) return;

    if (caseOpen) {
      if (push) history.replaceState({ case: slug }, '', `#${slug}`);
      gsap.to(caseContent, {
        autoAlpha: 0, y: -40, duration: reduce ? 0 : 0.5, ease: 'power3.in',
        onComplete: () => {
          const words = renderCase(p);
          caseScroll.scrollTop = 0;
          gsap.set(caseContent, { autoAlpha: 1, y: 0 });
          animateCaseIn(words);
        }
      });
      return;
    }

    if (push) history.pushState({ case: slug }, '', `#${slug}`);
    caseOpen = true;
    returnFocus = document.activeElement;
    if (menuOpen) toggleMenu(false);
    const words = renderCase(p);
    caseScroll.scrollTop = 0;
    lenis?.stop();
    document.body.classList.add('case-open');
    caseEl.setAttribute('aria-hidden', 'false');
    gsap.set(caseEl, { visibility: 'visible' });
    gsap.set(caseContent, { autoAlpha: 1, y: 0 });

    if (reduce) {
      gsap.set(caseEl, { clipPath: 'none' });
    } else {
      gsap.fromTo(caseEl, { clipPath: `circle(0% at ${x}px ${y}px)` }, { clipPath: `circle(150% at ${x}px ${y}px)`, duration: 1.15, ease: 'expo.inOut' });
      gsap.fromTo(caseClose, { scale: 0 }, { scale: 1, duration: 0.8, ease: 'back.out(2)', delay: 0.7 });
      animateCaseIn(words, 0.6);
    }
    setTimeout(() => caseClose.focus({ preventScroll: true }), reduce ? 0 : 700);
  }

  function closeCase(fromHistory = false) {
    if (!caseOpen) return;
    caseOpen = false;
    if (!fromHistory) {
      if (history.state && history.state.case) history.back();
      else history.replaceState(null, '', location.pathname + location.search);
    }
    const r = caseClose.getBoundingClientRect();
    const at = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
    const finish = () => {
      gsap.set(caseEl, { visibility: 'hidden' });
      caseEl.setAttribute('aria-hidden', 'true');
      caseContent.innerHTML = '';
      document.body.classList.remove('case-open');
      lenis?.start();
      returnFocus?.focus?.({ preventScroll: true });
    };
    if (reduce) finish();
    else gsap.to(caseEl, { clipPath: `circle(0% at ${at})`, duration: 0.9, ease: 'expo.inOut', onComplete: finish });
  }

  caseClose.addEventListener('click', () => closeCase());

  addEventListener('popstate', () => {
    const slug = location.hash.slice(1);
    if (findProject(slug)) openCase(slug, undefined, undefined, false);
    else closeCase(true);
  });

  addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (caseOpen) closeCase();
    else if (menuOpen) toggleMenu(false);
  });

  function handleInitialHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    history.replaceState(null, '', location.pathname + location.search);
    if (findProject(id)) openCase(id);
  }

  /* ------------------------------------------------------------------
     In-page links
  ------------------------------------------------------------------ */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (findProject(id)) {
      e.preventDefault();
      openCase(id, e.clientX || innerWidth / 2, e.clientY || innerHeight / 2);
      return;
    }
    const target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    if (menuOpen) toggleMenu(false);
    if (caseOpen) closeCase();
    scrollToEl(target);
  });

  /* ------------------------------------------------------------------
     Boot
  ------------------------------------------------------------------ */
  addEventListener('load', () => {
    if (document.body.classList.contains('is-loading')) toTop();
    ScrollTrigger.refresh();
  });
  (document.fonts ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]) : Promise.resolve())
    .then(() => { ScrollTrigger.refresh(); preloader(); });
})();
