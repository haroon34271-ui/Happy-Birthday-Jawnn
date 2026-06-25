/* =====================================================
   SCRIPT.JS — Bubu Birthday Website
   ===================================================== */

"use strict";

/* ============================================================
   CURSOR EFFECT
   ============================================================ */
const cursorHeart = document.getElementById('cursor-heart');
document.addEventListener('mousemove', e => {
  cursorHeart.style.left = e.clientX + 'px';
  cursorHeart.style.top  = e.clientY + 'px';
});

document.addEventListener('click', e => {
  spawnClickHeart(e.clientX, e.clientY);
});

function spawnClickHeart(x, y) {
  const hearts = ['💗','💖','💓','💕','❤️','🩷'];
  const el = document.createElement('div');
  el.classList.add('click-heart');
  el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  el.style.left = x + 'px';
  el.style.top  = y + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

/* ============================================================
   PAGE NAVIGATION
   ============================================================ */
function goToPage(pageId) {
  // Hide all
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('page-active');
  });
  // Show target
  const target = document.getElementById(pageId);
  target.classList.add('page-active');

  // Init page-specific logic
  if (pageId === 'page-birthday') initBirthdayPage();
  if (pageId === 'page-diary')    initDiaryPage();
  if (pageId === 'page-reasons')  initReasonsPage();
  if (pageId === 'page-timers')   initTimersPage();
  if (pageId === 'page-dress')    initDressPage();
  if (pageId === 'page-passcode') resetDiary();
}

/* ============================================================
   FLOATING BEARS GENERATOR
   ============================================================ */
function generateFloatingBears(containerId, count = 10) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const bears = ['🐻','🐻‍❄️','🐻','🐻‍❄️','💕','✨','🌸','💗','⭐','🎀'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.classList.add('float-bear');
    el.textContent = bears[Math.floor(Math.random() * bears.length)];
    el.style.left       = Math.random() * 100 + 'vw';
    el.style.fontSize   = (1.2 + Math.random() * 2) + 'rem';
    el.style.opacity    = (0.15 + Math.random() * 0.25).toString();
    el.style.animationDuration  = (12 + Math.random() * 20) + 's';
    el.style.animationDelay     = (-Math.random() * 25) + 's';
    container.appendChild(el);
  }
}

function generateParticles(containerId, count = 20) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const particles = ['💗','✨','🌸','⭐','💖','🩷','💞','🌟','💫'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.classList.add('particle');
    el.textContent = particles[Math.floor(Math.random() * particles.length)];
    el.style.left             = Math.random() * 100 + 'vw';
    el.style.fontSize         = (0.7 + Math.random() * 0.8) + 'rem';
    el.style.animationDuration = (6 + Math.random() * 12) + 's';
    el.style.animationDelay   = (-Math.random() * 15) + 's';
    container.appendChild(el);
  }
}

/* ============================================================
   PAGE 1 — PASSCODE
   ============================================================ */
generateFloatingBears('bg-bears-1', 12);
generateParticles('particles-1', 25);

// ---- Digit input behavior ----
const digitIds = ['d1','d2','d3','d4'];
const digits   = digitIds.map(id => document.getElementById(id));

digits.forEach((el, i) => {

  // Main input handler — fires on any value change
  el.addEventListener('input', () => {
    // Keep only the last digit typed
    el.value = el.value.replace(/\D/g, '').slice(-1);

    // Auto-advance to next box
    if (el.value.length === 1 && i < digits.length - 1) {
      digits[i + 1].focus();
    }
    // Auto-check when last box filled
    if (i === digits.length - 1 && el.value.length === 1) {
      setTimeout(checkPasscode, 250);
    }
  });

  // Keydown: backspace moves to previous box
  el.addEventListener('keydown', e => {
    if (e.key === 'Backspace') {
      if (el.value) {
        el.value = '';
      } else if (i > 0) {
        digits[i - 1].focus();
        digits[i - 1].value = '';
      }
    }
    if (e.key === 'Enter') checkPasscode();
  });

  // Click: select all text for easy replace
  el.addEventListener('click', () => el.select());
});

// Handle paste of full code (e.g. paste "0107" into first box)
digits[0].addEventListener('paste', e => {
  e.preventDefault();
  const pasted = (e.clipboardData || window.clipboardData)
    .getData('text').replace(/\D/g, '').slice(0, 4);
  pasted.split('').forEach((ch, i) => {
    if (digits[i]) digits[i].value = ch;
  });
  const lastFilled = Math.min(pasted.length, 4) - 1;
  if (lastFilled >= 0) digits[lastFilled].focus();
  if (pasted.length === 4) setTimeout(checkPasscode, 250);
});

// Focus first input on load
setTimeout(() => digits[0].focus(), 500);

// ---- Check passcode ----
function checkPasscode() {
  const code = digits.map(d => d.value.trim()).join('');
  if (code === '0107') {
    correctCode();
  } else {
    wrongCode();
  }
}

function wrongCode() {
  const boxes = document.getElementById('input-boxes');
  const err   = document.getElementById('passcode-error');

  boxes.classList.add('shake');
  err.classList.remove('hidden');

  // Spawn broken hearts
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const x = 20 + Math.random() * 60;
      const y = 20 + Math.random() * 60;
      spawnClickHeart(window.innerWidth * x / 100, window.innerHeight * y / 100);
    }, i * 80);
  }

  // Replace with broken hearts briefly
  const bh = document.createElement('div');
  bh.textContent = '💔💔💔';
  bh.style.cssText = `
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -60px);
    font-size: 2rem; z-index: 20; pointer-events: none;
    animation: clickHeartAnim 1.5s ease forwards;
  `;
  document.getElementById('page-passcode').appendChild(bh);
  setTimeout(() => bh.remove(), 1500);

  setTimeout(() => {
    boxes.classList.remove('shake');
    digits.forEach(d => d.value = '');
    digits[0].focus();
  }, 800);
}

function correctCode() {
  const explosion = document.getElementById('explosion');
  explosion.classList.remove('hidden');

  // Spawn massive hearts
  const emojis = ['💖','💗','💓','💕','💞','🌸','✨','🎉','🎀','🐻','🐻‍❄️'];
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.cssText = `
        position: fixed;
        left: ${10 + Math.random() * 80}vw;
        top: ${10 + Math.random() * 80}vh;
        font-size: ${1 + Math.random() * 3}rem;
        pointer-events: none;
        z-index: 200;
        animation: clickHeartAnim 1.2s ease forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    }, i * 40);
  }

  // Bear jump animation
  const bears = document.createElement('div');
  bears.innerHTML = `
    <div style="
      position:fixed; bottom:20%; left:50%; transform:translateX(-50%);
      display:flex; gap:20px; z-index:300; pointer-events:none;
      animation: bounceSlow 0.6s ease-in-out infinite;
    ">
      <span style="font-size:3rem">🐻‍❄️</span>
      <span style="font-size:4rem">🐻</span>
      <span style="font-size:3rem">🐻‍❄️</span>
    </div>`;
  document.body.appendChild(bears);

  // Transition
  setTimeout(() => {
    bears.remove();
    explosion.classList.add('hidden');
    goToPage('page-birthday');
  }, 2800);
}


/* ============================================================
   PAGE 2 — BIRTHDAY
   ============================================================ */
let birthdayInited = false;

function initBirthdayPage() {
  if (!birthdayInited) {
    generateFloatingBears('bg-bears-2', 12);
    generateParticles('particles-2', 25);
    generateConfetti('confetti-1', 40);
    birthdayInited = true;
  }
}

function generateConfetti(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const colors = [
    '#f472b6','#ec4899','#db2777','#fda4cf','#fbbf24',
    '#a78bfa','#60a5fa','#34d399','#fb923c','#f9a8d4'
  ];
  const shapes = ['circle','square','triangle'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.classList.add('confetti-piece');
    el.style.left             = Math.random() * 100 + 'vw';
    el.style.background       = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDuration = (3 + Math.random() * 5) + 's';
    el.style.animationDelay   = (-Math.random() * 8) + 's';
    el.style.opacity          = (0.6 + Math.random() * 0.4).toString();

    const size = 6 + Math.random() * 10;
    el.style.width  = size + 'px';
    el.style.height = size + 'px';

    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    if (shape === 'square') el.style.borderRadius = '2px';
    else if (shape === 'triangle') {
      el.style.background = 'transparent';
      el.style.width = '0';
      el.style.height = '0';
      el.style.borderLeft = `${size/2}px solid transparent`;
      el.style.borderRight = `${size/2}px solid transparent`;
      el.style.borderBottom = `${size}px solid ${colors[Math.floor(Math.random() * colors.length)]}`;
    }

    container.appendChild(el);
  }
}

/* ============================================================
   PAGE 3 — DIARY
   ============================================================ */
let diaryInited = false;

const diaryMessage = `Today is a really special day — it's YOUR birthday, Bubu! 🎂

I can't believe how lucky I am to have you in my life. Every single day with you feels like a dream I never want to wake up from. You make everything brighter, warmer, and a thousand times more beautiful. 🌸

You have this magical way of making me smile even when I'm tired. Your laugh is my favourite sound in the whole world. Your hugs feel like home. And your love? It's the greatest gift I've ever received. 💖

I want you to know that I see you — truly see you. Your kindness, your silly jokes that make you laugh the hardest, the way your eyes light up when you talk about things you love. Every part of you is precious to me.

On this birthday, I promise to keep being your person — your safe place, your biggest fan, and your forever Pookie. 🐻

You deserve every flower, every star, and every beautiful thing in this universe.

Happy Birthday, my Bubu. Today and every day — you are so deeply loved. 💕

No matter where life takes us, remember this: I choose you. Every single day. Without hesitation.

With all my heart and all my love — yours completely,`;

function initDiaryPage() {
  if (!diaryInited) {
    generateFloatingBears('bg-bears-3', 10);
    generateParticles('particles-3', 20);
    generateConfetti('confetti-2', 30);
    generatePetals();
    diaryInited = true;
  }

  // Open diary after small delay
  setTimeout(() => openDiary(), 600);
}

function openDiary() {
  const cover = document.getElementById('diary-cover');
  const pages = document.getElementById('diary-pages');

  cover.style.display = 'none';
  pages.classList.add('open');

  // Add left page bear
  const leftPage = document.querySelector('.diary-left-page');
  const bearEl = document.createElement('div');
  bearEl.className = 'left-page-bear';
  bearEl.textContent = '🐻';
  leftPage.appendChild(bearEl);

  // Start typewriter
  startTypewriter();
}

function startTypewriter() {
  const el    = document.getElementById('typewriter-text');
  const sigEl = document.getElementById('diary-sig');
  const cursor = document.createElement('span');
  cursor.classList.add('typewriter-cursor');
  el.appendChild(cursor);

  let i = 0;
  const speed = 28; // ms per char

  function type() {
    if (i < diaryMessage.length) {
      cursor.before(diaryMessage[i]);
      i++;
      // Auto-scroll right page
      const rightPage = document.querySelector('.diary-right-page');
      rightPage.scrollTop = rightPage.scrollHeight;

      // Vary speed slightly for natural feel
      const delay = diaryMessage[i - 1] === '.' || diaryMessage[i - 1] === '!' || diaryMessage[i - 1] === '?'
        ? speed * 6
        : diaryMessage[i - 1] === ','
        ? speed * 3
        : diaryMessage[i - 1] === '\n'
        ? speed * 4
        : speed + (Math.random() * 10 - 5);

      setTimeout(type, delay);
    } else {
      // Remove cursor, show signature
      cursor.remove();
      setTimeout(() => sigEl.classList.add('show'), 600);
    }
  }

  setTimeout(type, 600);
}

function generatePetals() {
  const container = document.getElementById('petals');
  if (!container) return;
  const petalEmojis = ['🌸','🌺','🌷','🌼','💐','🌹'];
  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.classList.add('petal');
    el.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
    el.style.left              = Math.random() * 100 + 'vw';
    el.style.fontSize          = (0.9 + Math.random() * 0.8) + 'rem';
    el.style.animationDuration = (8 + Math.random() * 12) + 's';
    el.style.animationDelay    = (-Math.random() * 15) + 's';
    container.appendChild(el);
  }
}

/* ============================================================
   MUSIC TOGGLE
   ============================================================ */
const musicBtn = document.getElementById('music-toggle');
const bgMusic  = document.getElementById('bg-music');
let musicPlaying = false;

// Generate a simple looping melody using Web Audio API (no external dependency)
let audioCtx = null;
let musicInterval = null;

musicBtn.addEventListener('click', () => {
  if (!musicPlaying) {
    startSoftMusic();
    musicBtn.textContent = '🔇';
    musicBtn.classList.add('playing');
    musicPlaying = true;
  } else {
    stopSoftMusic();
    musicBtn.textContent = '🎵';
    musicBtn.classList.remove('playing');
    musicPlaying = false;
  }
});

function startSoftMusic() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Simple melody sequence — romantic pentatonic
  const notes = [
    261.63, 293.66, 329.63, 392.00, 440.00,
    392.00, 349.23, 293.66, 261.63, 293.66,
    329.63, 392.00, 440.00, 493.88, 440.00,
    392.00, 349.23, 329.63, 293.66, 261.63
  ];
  let noteIdx = 0;

  function playNote() {
    if (!audioCtx) return;
    const osc    = audioCtx.createOscillator();
    const gain   = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    filter.type      = 'lowpass';
    filter.frequency.value = 800;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(notes[noteIdx % notes.length], audioCtx.currentTime);

    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.1);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.6);

    noteIdx++;
  }

  playNote();
  musicInterval = setInterval(playNote, 500);
}

function stopSoftMusic() {
  if (musicInterval) clearInterval(musicInterval);
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
}

/* ============================================================
   CLICK SOUND EFFECT
   ============================================================ */
function playClickSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch(e) {}
}

// Attach click sound to all buttons
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', playClickSound);
});

/* ============================================================
   HEART RAIN on Page 2
   ============================================================ */
function randomHeartRain() {
  const heartPage = document.getElementById('page-birthday');
  if (!heartPage.classList.contains('page-active')) return;

  const el = document.createElement('div');
  el.textContent = ['💗','💖','❤️','🩷','🐻','🐻‍❄️'][Math.floor(Math.random() * 6)];
  el.style.cssText = `
    position: absolute;
    left: ${Math.random() * 100}vw;
    top: -50px;
    font-size: ${1 + Math.random() * 2}rem;
    pointer-events: none;
    z-index: 4;
    opacity: 0.7;
    animation: confettiFall ${5 + Math.random() * 8}s linear forwards;
  `;
  heartPage.appendChild(el);
  setTimeout(() => el.remove(), 13000);
}

setInterval(randomHeartRain, 700);

/* ============================================================
   OCCASIONAL FLYING BUBU BEAR
   ============================================================ */
function flyingBear() {
  const el = document.createElement('div');
  el.textContent = Math.random() > 0.5 ? '🐻‍❄️' : '🐻';
  const fromLeft = Math.random() > 0.5;
  el.style.cssText = `
    position: fixed;
    ${fromLeft ? 'left:-80px' : 'right:-80px'};
    top: ${10 + Math.random() * 60}vh;
    font-size: ${2.5 + Math.random() * 2}rem;
    pointer-events: none;
    z-index: 5;
    opacity: 0.6;
    transition: all 5s ease;
  `;
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.transition = 'all 5s ease';
    el.style.transform = fromLeft
      ? 'translateX(120vw) rotate(20deg)'
      : 'translateX(-120vw) rotate(-20deg)';
  });
  setTimeout(() => el.remove(), 5500);
}

setInterval(flyingBear, 8000);
flyingBear(); // one immediately

/* ============================================================
   INITIAL SETUP
   ============================================================ */
// Start on page 1 (already active via HTML class)
// Generate bg for page 1 already called above

/* ============================================================
   DIARY RESET (when looping back to start)
   ============================================================ */
function resetDiary() {
  diaryInited = false;
  const cover = document.getElementById('diary-cover');
  const pages = document.getElementById('diary-pages');
  const tw    = document.getElementById('typewriter-text');
  const sig   = document.getElementById('diary-sig');
  if (cover) cover.style.display = '';
  if (pages) pages.classList.remove('open');
  if (tw)    tw.innerHTML = '';
  if (sig)   sig.classList.remove('show');
  // Remove extra left-page bear if present
  document.querySelectorAll('.left-page-bear').forEach(b => b.remove());
  // Reset passcode digits
  digits.forEach(d => d.value = '');
  setTimeout(() => digits[0].focus(), 400);
}

/* ============================================================
   PAGE 4 — LOVE REASONS
   ============================================================ */
const loveReasons = [
  { icon: '💗', text: `The way your eyes shine when you smile at me — it makes my whole world light up.` },
  { icon: '🌸', text: `How you make every ordinary, boring moment feel magical just by being there.` },
  { icon: '🎵', text: `Your laugh — it is literally my favourite sound in the entire world. I could listen forever.` },
  { icon: '💞', text: `The way you care so deeply about the people you love. Your heart is so big and so beautiful.` },
  { icon: '🍀', text: `How you make me feel like the luckiest person alive every single day without even trying.` },
  { icon: '💬', text: `Your random texts that pop up and instantly make my whole day a million times better.` },
  { icon: '🐻', text: `The way you are equal parts adorable and strong. You are my Bubu and no one compares.` },
  { icon: '💌', text: `How you always know exactly what to say when I need it most. You always make it okay.` },
  { icon: '✨', text: `Your presence — the way just knowing you are there makes everything feel calmer and safer.` },
  { icon: '💖', text: `How you hold my heart so gently and carefully, like it truly matters to you.` },
  { icon: '🌙', text: `Our late-night conversations that go on forever. I never want them to end.` },
  { icon: '🎀', text: `The little things you do that you don't even notice — they mean everything to me.` },
  { icon: '🏡', text: `How you make any place feel like home just by being in it. You are my home.` },
  { icon: '🌷', text: `Your kindness. It is rare and real and I notice it every single time.` },
  { icon: '⭐', text: `How you make me want to be a better person every single day. You inspire me.` },
  { icon: '🌟', text: `The way you light up when you talk about things you love. I could watch you forever.` },
  { icon: '🐻‍❄️', text: `Your warmth — it wraps around me like the softest, cosiest hug. I never want to let go.` },
  { icon: '💕', text: `How you are my best friend AND my love at the same time. I got everything in one.` },
  { icon: '🌺', text: `The way you make me feel seen, heard, and loved exactly as I am. No conditions.` },
  { icon: '💝', text: `Simply because you are you — Zainab, my Bubu — and that is more than enough. Always.` }
];


let currentReason = 0;
let reasonsInited = false;

function initReasonsPage() {
  if (!reasonsInited) {
    generateFloatingBears('bg-bears-4', 10);
    generateParticles('particles-4', 18);
    generateConfetti('confetti-3', 25);
    buildReasonDots();
    reasonsInited = true;
  }
  showReason(0);
}

function buildReasonDots() {
  const dotsEl = document.getElementById('reasons-dots');
  if (!dotsEl) return;
  dotsEl.innerHTML = '';
  loveReasons.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('reason-dot');
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => showReason(i);
    dotsEl.appendChild(dot);
  });
}

function showReason(idx) {
  currentReason = idx;
  const r = loveReasons[idx];

  // Rebuild inner with animation
  const inner = document.getElementById('reasons-card-inner');
  inner.style.animation = 'none';
  inner.offsetHeight; // reflow
  inner.style.animation = '';

  document.getElementById('reason-number').textContent = '#' + (idx + 1);
  document.getElementById('reason-icon').textContent   = r.icon;
  document.getElementById('reason-text').textContent   = r.text;
  document.getElementById('reasons-counter').textContent = (idx + 1) + ' of ' + loveReasons.length;

  // Update dots
  document.querySelectorAll('.reason-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });

  // Arrow states
  document.getElementById('reasons-prev').disabled = idx === 0;
  document.getElementById('reasons-next').disabled = idx === loveReasons.length - 1;

  spawnClickHeart(
    window.innerWidth  * (0.3 + Math.random() * 0.4),
    window.innerHeight * (0.3 + Math.random() * 0.4)
  );
}

function changeReason(dir) {
  const next = currentReason + dir;
  if (next >= 0 && next < loveReasons.length) showReason(next);
}

/* ============================================================
   PAGE 5 — COUNTDOWN TIMERS
   ============================================================ */
// Dates in PKT (UTC+5)
const firstTextDate   = new Date('2025-10-05T11:54:00+05:00');
const datingStartDate = new Date('2026-01-16T10:36:00+05:00');

let timersInited   = false;
let timerInterval  = null;

function initTimersPage() {
  if (!timersInited) {
    generateFloatingBears('bg-bears-5', 10);
    generateParticles('particles-5', 15);
    timersInited = true;
  }
  updateTimers();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(updateTimers, 1000);
}

function updateTimers() {
  const now = new Date();
  setTimerDisplay(firstTextDate,   't1');
  setTimerDisplay(datingStartDate, 't2');
}

function setTimerDisplay(startDate, prefix) {
  const now     = new Date();
  const diff    = Math.max(0, now - startDate);
  const totalSecs = Math.floor(diff / 1000);
  const secs    = totalSecs % 60;
  const mins    = Math.floor(totalSecs / 60) % 60;
  const hours   = Math.floor(totalSecs / 3600) % 24;
  const days    = Math.floor(totalSecs / 86400);

  function pad(n, len = 2) { return String(n).padStart(len, '0'); }

  animateTick(prefix + '-days',  pad(days, 3));
  animateTick(prefix + '-hours', pad(hours));
  animateTick(prefix + '-mins',  pad(mins));
  animateTick(prefix + '-secs',  pad(secs));
}

function animateTick(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.textContent !== val) {
    el.textContent = val;
    el.classList.remove('tick');
    void el.offsetWidth;
    el.classList.add('tick');
    setTimeout(() => el.classList.remove('tick'), 200);
  }
}

/* ============================================================
   PAGE 6 — BEAR DRESS-UP
   ============================================================ */
let dressInited = false;

// Track selected buttons per bear per slot
const bearSelections = { dudu: {}, bubu: {} };

function initDressPage() {
  if (!dressInited) {
    generateFloatingBears('bg-bears-6', 10);
    generateParticles('particles-6', 15);
    dressInited = true;
  }
}

function toggleCostume(btn) {
  const bear = btn.dataset.bear;  // 'dudu' or 'bubu'
  const slot = btn.dataset.slot;  // 'hat', 'face', 'neck', 'hand'
  const emoji = btn.dataset.emoji;

  const slotEl = document.getElementById(bear + '-' + slot);

  // Deselect other buttons in same slot for this bear
  const allBtns = document.querySelectorAll(
    `[data-bear="${bear}"][data-slot="${slot}"]`
  );
  allBtns.forEach(b => b.classList.remove('selected'));

  if (bearSelections[bear][slot] === emoji) {
    // Toggle off
    bearSelections[bear][slot] = null;
    slotEl.textContent = '';
  } else {
    // Toggle on
    bearSelections[bear][slot] = emoji;
    slotEl.textContent = emoji;
    btn.classList.add('selected');
    // Pop animation
    slotEl.style.transform = 'scale(0)';
    setTimeout(() => { slotEl.style.transform = ''; }, 50);
    spawnClickHeart(
      btn.getBoundingClientRect().left + 20,
      btn.getBoundingClientRect().top
    );
  }
}

function resetBear(bear) {
  ['hat','face','neck','hand'].forEach(slot => {
    const slotEl = document.getElementById(bear + '-' + slot);
    if (slotEl) slotEl.textContent = '';
    bearSelections[bear][slot] = null;
  });
  document.querySelectorAll(`[data-bear="${bear}"]`)
    .forEach(b => b.classList.remove('selected'));
}
