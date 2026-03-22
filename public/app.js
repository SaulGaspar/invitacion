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

// ══════════════════════════════════════════════════════
//  REPRODUCTOR · Cama y Mesa – Roberto Carlos
//
//  Estrategia: iframe de YouTube posicionado FUERA
//  de pantalla (no 1x1px, que muchos navegadores
//  bloquean) controlado con postMessage + IFrame API.
// ══════════════════════════════════════════════════════

// IDs en orden de preferencia (español › VEVO › otros)
const YT_IDS = [
  'cPWcImHm554',   // versión oficial en español – 19 M vistas
  'jOdhtimtnvo',   // Roberto Carlos Topic – 32 M
  '5fFjjiD1IoM',   // VEVO oficial – 3.1 M
  'wjkZtSaw5WY'    // versión extra
];

let isPlaying    = false;
let ytPlayer     = null;
let ytReady      = false;
let ytIdIndex    = 0;
let progressTimer;

// 1. Crear el contenedor del iframe fuera de pantalla
function buildYTContainer() {
  const wrap = document.createElement('div');
  wrap.id = 'yt-wrap';
  wrap.style.cssText = [
    'position:fixed',
    'top:-500px',
    'left:-500px',
    'width:320px',      // tamaño real → YouTube no lo bloquea
    'height:180px',
    'pointer-events:none',
    'opacity:0',
    'z-index:-1'
  ].join(';');
  document.body.appendChild(wrap);

  const div = document.createElement('div');
  div.id = 'yt-player-div';
  wrap.appendChild(div);
}

// 2. Cargar la YouTube IFrame API
function loadYTAPI() {
  if (document.getElementById('yt-api-script')) return;
  buildYTContainer();
  const s  = document.createElement('script');
  s.id     = 'yt-api-script';
  s.src    = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(s);
}

// 3. Callback global requerido por YouTube
window.onYouTubeIframeAPIReady = function () {
  tryLoadVideo(ytIdIndex);
};

function tryLoadVideo(idx) {
  if (idx >= YT_IDS.length) return; // todos fallaron

  if (ytPlayer) {
    ytPlayer.destroy();
    ytPlayer = null;
  }

  ytPlayer = new YT.Player('yt-player-div', {
    height: '180',
    width:  '320',
    videoId: YT_IDS[idx],
    playerVars: {
      autoplay:       0,
      controls:       0,
      disablekb:      1,
      fs:             0,
      modestbranding: 1,
      rel:            0,
      playsinline:    1,
      origin:         location.origin || '*'
    },
    events: {
      onReady: function () {
        ytReady = true;
      },
      onError: function () {
        // Este ID falló → probar el siguiente
        ytIdIndex++;
        ytReady = false;
        // Recrear el div (destroy lo elimina)
        const wrap = document.getElementById('yt-wrap');
        if (wrap) {
          const newDiv = document.createElement('div');
          newDiv.id = 'yt-player-div';
          wrap.appendChild(newDiv);
        }
        tryLoadVideo(ytIdIndex);
      },
      onStateChange: function (e) {
        if (e.data === YT.PlayerState.ENDED) { _resetUI(); }
      }
    }
  });
}

// 4. Barra de progreso
function _startBar() {
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    if (!ytPlayer || !ytPlayer.getDuration) return;
    const dur  = ytPlayer.getDuration() || 1;
    const curr = ytPlayer.getCurrentTime() || 0;
    const bar  = document.getElementById('progress');
    if (bar) bar.style.width = ((curr / dur) * 100) + '%';
  }, 400);
}

// 5. Resetear UI
function _resetUI() {
  isPlaying = false;
  clearInterval(progressTimer);
  const btn  = document.getElementById('playBtn');
  const disc = document.getElementById('disc');
  if (btn)  btn.textContent = '▶';
  if (disc) disc.classList.remove('spinning');
}

// 6. Controles públicos (llamados por los botones del HTML)
function togglePlay() {
  if (!ytReady) return;

  if (isPlaying) {
    ytPlayer.pauseVideo();
    _resetUI();
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
  const bar = document.getElementById('progress');
  if (bar) bar.style.width = '0%';
}

function nextSong() { prevSong(); }

// ── RSVP Form ──────────────────────────
function submitRSVP(e) {
  e.preventDefault();
  document.querySelector('.rsvp-form').classList.add('hidden');
  document.getElementById('rsvp-thanks').classList.remove('hidden');
}

// ── Init ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  createPetals();
  document.body.style.overflow = 'hidden';
  loadYTAPI();   // cargar la API de YouTube desde el inicio
});