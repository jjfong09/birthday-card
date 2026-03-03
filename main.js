let heroAnimDone    = false;
let heroConfettiId;

// ── SCROLL BUTTON → goes to letter section now ──
document.getElementById('scroll-btn').addEventListener('click', () => {
  clearTimeout(heroConfettiId);
  document.getElementById('section-letter').scrollIntoView({ behavior: 'smooth' });
});

// ── HERO LOAD ANIMATION ──
function initHeroAnimation() {
  const eyebrow1 = document.querySelector('.eyebrow-1');
  const eyebrow2 = document.querySelector('.eyebrow-2');
  const headline = document.querySelector('.headline');
  const photo    = document.querySelector('.photo');
  const btn      = document.querySelector('.scroll-btn');
  const btnSvg   = btn.querySelector('svg');
  const bananaL  = document.querySelector('.section-hero .banana-side:first-child');
  const bananaR  = document.querySelector('.section-hero .banana-side:last-child');

  btnSvg.style.animationPlayState = 'paused';

  const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  const ease   = 'cubic-bezier(0.22, 1, 0.36, 1)';

  function reveal(el, transform, delay, duration = 0.65) {
    setTimeout(() => {
      el.style.transition = `opacity ${duration}s ${ease}, transform ${duration}s ${spring}`;
      el.style.opacity    = '1';
      el.style.transform  = transform;
    }, delay);
  }

  const STEP  = 1480;
  const BURST = 200 + STEP * 2;

  reveal(eyebrow1, 'translateY(0)',  200);
  reveal(eyebrow2, 'translateY(0)',  200 + STEP);
  reveal(bananaL,  'translateX(0)',  BURST);
  reveal(bananaR,  'translateX(0)',  BURST + 120);
  reveal(headline, 'scale(1)',       BURST + 180);
  reveal(photo,    'scale(1)',       BURST + 320);
  reveal(btn,      'scale(1)',       BURST + 460);

  setTimeout(() => {
    btnSvg.style.animationPlayState = 'running';
    heroAnimDone = true;
  }, BURST + 460 + 650);

  heroConfettiId = setTimeout(launchConfetti, BURST + 1000);
}

// ── CONFETTI ──
function launchConfetti() {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '999',
  });
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx    = canvas.getContext('2d');
  const COLORS = ['#F9D347','#FF8C42','#E8B800','#ffffff','#FF6B6B','#9A7200','#A8E6CF','#C084FC'];
  const SHAPES = ['rect','circle','ribbon'];
  const ox = canvas.width / 2;
  const oy = canvas.height * 0.42;

  const particles = Array.from({ length: 150 }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.7;
    const speed = 6 + Math.random() * 14;
    return {
      x: ox + (Math.random() - 0.5) * 60, y: oy,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      rot: Math.random() * 360, rotSpeed: (Math.random() - 0.5) * 11,
      w: 7 + Math.random() * 7, h: 4 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      alpha: 1,
    };
  });

  let frame = 0;
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;
    let alive = false;
    particles.forEach(p => {
      if (p.alpha <= 0) return;
      alive = true;
      p.vy += 0.38; p.vx *= 0.98;
      p.x += p.vx; p.y += p.vy; p.rot += p.rotSpeed;
      if (frame > 50) p.alpha -= 0.016;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle   = p.color;
      if (p.shape === 'rect')        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      else if (p.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, p.h / 2, 0, Math.PI * 2); ctx.fill(); }
      else                           { ctx.beginPath(); ctx.ellipse(0, 0, p.w / 1.4, p.h / 3.5, 0, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    });
    if (alive) requestAnimationFrame(tick);
    else canvas.remove();
  }
  requestAnimationFrame(tick);
}

initHeroAnimation();

// ── HOVER EFFECTS ──
document.querySelector('.section-hero .banana-side:first-child img')
  .addEventListener('mouseenter', () => { if (heroAnimDone) launchConfetti(); });

// ── BANANA BACKGROUND ──
class BgBanana {
  constructor(container, src, cx, cy, sizePx) {
    this.rotation = Math.random() * 360;
    this.visible = false;
    this.el = document.createElement('img');
    this.el.src = src;
    this.el.alt = '';
    this.el.className = 'bg-banana';
    Object.assign(this.el.style, {
      left: `${cx}%`, top: `${cy}%`, width: `${sizePx}px`,
      opacity: '0',
      transform: `translate(-50%, -50%) scale(0) rotate(${this.rotation}deg)`,
    });
    container.appendChild(this.el);
  }

  popIn(delay) {
    setTimeout(() => {
      this.el.style.transition = 'opacity 0.5s ease, transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)';
      this.el.style.opacity = '1';
      this.el.style.transform = `translate(-50%, -50%) scale(1) rotate(${this.rotation}deg)`;
      this.visible = true;
    }, delay);
  }

  spin() {
    if (!this.visible) return;
    this.rotation += 360;
    this.el.style.transition = 'transform 1s ease-in-out';
    this.el.style.transform = `translate(-50%, -50%) scale(1) rotate(${this.rotation}deg)`;
  }

  scheduleRandomSpins() {
    const loop = () => {
      setTimeout(() => { this.spin(); loop(); }, 2000 + Math.random() * 6000);
    };
    setTimeout(loop, Math.random() * 4000);
  }
}

function createBananaBg() {
  const container = document.getElementById('banana-bg');
  const srcs = ['images/single.png', 'images/pair.png'];
  const COLS = 5, ROWS = 5;
  const cellW = 100 / COLS, cellH = 100 / ROWS;
  const jitter = 8;
  const bananas = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cx = Math.min(Math.max((col + 0.5) * cellW + (Math.random() * 2 - 1) * jitter, 4), 96);
      const cy = Math.min(Math.max((row + 0.5) * cellH + (Math.random() * 2 - 1) * jitter, 4), 96);
      bananas.push(new BgBanana(container, srcs[Math.floor(Math.random() * srcs.length)], cx, cy, 60 + Math.random() * 30));
    }
  }
  return bananas;
}

const bananas = createBananaBg();

// Called directly when user opens the letter
function animateBananas() {
  bananas.forEach((b, i) => b.popIn(i * 90));
  const cardDelay = Math.floor(bananas.length / 2) * 90 + 100;
  setTimeout(() => document.getElementById('bday-card').classList.add('visible'), cardDelay);
  const allInDelay = bananas.length * 90 + 700;
  setTimeout(() => bananas.forEach(b => b.scheduleRandomSpins()), allInDelay);
}

// ── UNLOCK CARD SECTION ──
function unlockCard() {
  const sectionCard = document.getElementById('section-card');
  sectionCard.style.display = 'flex';
  // Brief delay so display:flex paints before scroll
  setTimeout(() => {
    sectionCard.scrollIntoView({ behavior: 'smooth' });
    // Trigger banana + card animations after scroll completes
    setTimeout(animateBananas, 900);
  }, 50);
}

// ── LETTER STATE MACHINE ──
const MESSAGES = {
  1: 'Looks like you got a letter...<br>Do you want to open it?',
  2: 'are you sure about that?',
  3: 'ok come on now...',
};

function setLetterState(state) {
  // Swap button groups
  [1, 2, 3].forEach(n => {
    document.getElementById(`letter-btns-${n}`)
      .classList.toggle('letter-actions--hidden', n !== state);
  });

  // Fade out message, swap text, fade back in
  const msgEl = document.getElementById('letter-msg');
  msgEl.style.opacity = '0';
  setTimeout(() => {
    msgEl.innerHTML = MESSAGES[state];
    msgEl.style.opacity = '1';
  }, 250);

  // Photo overlays
  const o1 = document.getElementById('overlay-1');
  const o2 = document.getElementById('overlay-2');

  if (state === 2) {
    o1.classList.add('visible');
  } else if (state === 3) {
    // Keep o1 visible (no re-animation), just add o2 on top
    o2.classList.add('visible');
  }
}

document.getElementById('btn-yes').addEventListener('click', unlockCard);
document.getElementById('btn-no').addEventListener('click', () => setLetterState(2));
document.getElementById('btn-click-me').addEventListener('click', unlockCard);
document.getElementById('btn-still-no').addEventListener('click', () => setLetterState(3));
document.getElementById('btn-only-option').addEventListener('click', unlockCard);
