/* ══════════════════════════════════════
   WEDDING INVITATION · app.js
══════════════════════════════════════ */

// ── Countdown target date ──────────────
const WEDDING_DATE = new Date('2026-06-13T18:00:00');

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
  const flap       = document.getElementById('flap');
  const screen     = document.getElementById('envelope-screen');
  const invitation = document.getElementById('invitation');

  flap.classList.add('open');

  setTimeout(() => {
    screen.classList.add('closing');
    setTimeout(() => {
      screen.style.display = 'none';
      invitation.classList.remove('hidden');
      document.body.style.overflow = 'auto';
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
      ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => {
        document.getElementById(id).textContent = '00';
      });
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

// ══════════════════════════════════════
//  REPRODUCTOR REAL · Cama y Mesa
//  Roberto Carlos (YouTube IFrame API)
// ══════════════════════════════════════
const RC_VIDEO_ID = 'jOdhtimtnvo';

let isPlaying    = false;   // estado público (lo leen los botones del HTML)
let ytPlayer     = null;
let ytReady      = false;
let progressTimer;

// 1. Cargar la YouTube IFrame API
(function loadYTAPI() {
  if (document.getElementById('yt-api-script')) return;
  const s  = document.createElement('script');
  s.id     = 'yt-api-script';
  s.src    = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(s);
})();

// 2. Callback global requerido por YouTube
window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player('yt-player-div', {
    height: '1',
    width:  '1',
    videoId: RC_VIDEO_ID,
    playerVars: {
      autoplay: 0, controls: 0, disablekb: 1,
      fs: 0, modestbranding: 1, rel: 0, playsinline: 1
    },
    events: {
      onReady:       () => { ytReady = true; },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.ENDED) { _resetPlayer(); }
      }
    }
  });
};

// 3. Helpers internos
function _startBar() {
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    if (!ytPlayer || !ytPlayer.getDuration) return;
    const dur  = ytPlayer.getDuration() || 1;
    const curr = ytPlayer.getCurrentTime() || 0;
    const el   = document.getElementById('progress');
    if (el) el.style.width = ((curr / dur) * 100) + '%';
  }, 400);
}

function _resetPlayer() {
  isPlaying = false;
  clearInterval(progressTimer);
  const btn  = document.getElementById('playBtn');
  const disc = document.getElementById('disc');
  if (btn)  btn.textContent = '▶';
  if (disc) disc.classList.remove('spinning');
}

// 4. Funciones públicas llamadas por los botones del HTML
function togglePlay() {
  if (!ytReady) return;          // API todavía no lista — esperar
  if (isPlaying) {
    ytPlayer.pauseVideo();
    _resetPlayer();
  } else {
    ytPlayer.playVideo();
    isPlaying = true;
    const btn  = document.getElementById('playBtn');
    const disc = document.getElementById('disc');
    if (btn)  btn.textContent = '⏸';
    if (disc) disc.classList.add('spinning');
    _startBar();
  }
}

function prevSong() {
  if (!ytReady) return;
  ytPlayer.seekTo(0, true);
  const el = document.getElementById('progress');
  if (el) el.style.width = '0%';
}

function nextSong() { prevSong(); }

// ── Init ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  createPetals();
  document.body.style.overflow = 'hidden';
});