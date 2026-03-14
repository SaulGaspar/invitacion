/* ══════════════════════════════════════
   WEDDING INVITATION · app.js
══════════════════════════════════════ */

// ── Countdown target date ──────────────
const WEDDING_DATE = new Date('2026-06-06T16:30:00');
// ── Petals on envelope screen ──────────
function createPetals() {
  const container = document.getElementById('petals');
  const symbols = ['🌸','🌺','✿','❀','🌼','✦','♥'];
  for (let i = 0; i < 18; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.animationDuration = (4 + Math.random() * 6) + 's';
    petal.style.animationDelay = (Math.random() * 6) + 's';
    petal.style.fontSize = (12 + Math.random() * 10) + 'px';
    container.appendChild(petal);
  }
}

// ── Open Envelope ──────────────────────
function openEnvelope() {
  const flap = document.getElementById('flap');
  const screen = document.getElementById('envelope-screen');
  const invitation = document.getElementById('invitation');

  // animate flap open
  flap.classList.add('open');

  // after flap animation, fade out envelope screen
  setTimeout(() => {
    screen.classList.add('closing');
    setTimeout(() => {
      screen.style.display = 'none';
      invitation.classList.remove('hidden');
      document.body.style.overflow = 'auto';
      // trigger scroll observer on visible elements
      observeElements();
      startCountdown();
    }, 800);
  }, 600);
}

// ── Scroll-triggered fade-up ───────────
function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ── Countdown Timer ────────────────────
function startCountdown() {
  function update() {
    const now  = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent  = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent  = '00';
      document.getElementById('cd-secs').textContent  = '00';
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent  = String(days).padStart(2,'0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
    document.getElementById('cd-mins').textContent  = String(mins).padStart(2,'0');
    document.getElementById('cd-secs').textContent  = String(secs).padStart(2,'0');
  }

  update();
  setInterval(update, 1000);
}

// ── Music Player ───────────────────────
let isPlaying   = false;
let progressVal = 0;
let progressTimer;

function togglePlay() {
  const btn  = document.getElementById('playBtn');
  const disc = document.getElementById('disc');
  const prog = document.getElementById('progress');

  isPlaying = !isPlaying;

  if (isPlaying) {
    btn.textContent = '⏸';
    disc.classList.add('spinning');
    progressTimer = setInterval(() => {
      progressVal = Math.min(progressVal + 0.3, 100);
      prog.style.width = progressVal + '%';
      if (progressVal >= 100) {
        clearInterval(progressTimer);
        isPlaying = false;
        btn.textContent = '▶';
        disc.classList.remove('spinning');
        progressVal = 0;
        prog.style.width = '0%';
      }
    }, 300);
  } else {
    btn.textContent = '▶';
    disc.classList.remove('spinning');
    clearInterval(progressTimer);
  }
}

function prevSong() {
  progressVal = 0;
  document.getElementById('progress').style.width = '0%';
  if (isPlaying) { clearInterval(progressTimer); isPlaying = false; togglePlay(); }
}

function nextSong() {
  prevSong();
}

// ── RSVP Form ──────────────────────────
function submitRSVP(e) {
  e.preventDefault();
  document.querySelector('.rsvp-form').classList.add('hidden');
  document.getElementById('rsvp-thanks').classList.remove('hidden');
}

// ── Init ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  createPetals();
  // Lock scroll until envelope is opened
  document.body.style.overflow = 'hidden';
});
