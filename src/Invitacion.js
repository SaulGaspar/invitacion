import React, { useEffect, useState, useRef } from "react";
import "./styles.css";
import mya from "./mya.webp";

export default function Invitacion() {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [countdown, setCountdown] = useState({
    days: "--",
    hours: "--",
    minutes: "--",
    seconds: "--",
  });
  const [name, setName] = useState("");
  const audioRef = useRef(null);
  const audioPlayingRef = useRef(false);
  const scheduledRef = useRef(null);

  const targetDate = new Date("2026-06-06T14:30:00");

  useEffect(() => {
    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(interval);
  }, []);

  function updateCountdown() {
    const now = new Date();
    let diff = Math.max(0, targetDate - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * 1000 * 60 * 60 * 24;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * 1000 * 60;
    const seconds = Math.floor(diff / 1000);

    setCountdown({
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    });
  }

  function abrirSobre() {
    if (envelopeOpen) return;
    setEnvelopeOpen(true);
    setTimeout(() => {
      setShowContent(true);
      setTimeout(() => {
        const el = document.getElementById("contenido-principal");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }, 1200);
  }

  function toggleAudio() {
    if (!audioRef.current) {
      initAudio();
      audioPlayingRef.current = false;
    }

    if (!audioPlayingRef.current) {
      startMelody();
      audioPlayingRef.current = true;
    } else {
      stopMelody();
      audioPlayingRef.current = false;
    }
    setCountdown((c) => ({ ...c }));
  }

  function initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioRef.current = { ctx, oscillators: [], gain: null };
      audioRef.current.gain = ctx.createGain();
      audioRef.current.gain.gain.value = 0.0;
      audioRef.current.gain.connect(ctx.destination);
    } catch (e) {
      console.warn("WebAudio no está disponible en este navegador.");
      audioRef.current = null;
    }
  }

  function playNote(freq, start, duration) {
    if (duration === undefined) duration = 0.35;
    const a = audioRef.current;
    if (!a) return;
    const ctx = a.ctx;
    const gain = a.gain;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime + start);
    g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + start + 0.02);
    g.gain.linearRampToValueAtTime(0.0, ctx.currentTime + start + duration);
    o.connect(g);
    g.connect(gain);
    o.start(ctx.currentTime + start);
    o.stop(ctx.currentTime + start + duration + 0.02);
    a.oscillators.push(o);
  }

  function startMelody() {
    const a = audioRef.current;
    if (!a) return;
    if (a.ctx.state === "suspended") a.ctx.resume();

    const pattern = [440, 523.25, 659.25, 523.25];
    const now = 0;
    for (let i = 0; i < pattern.length; i++) {
      playNote(pattern[i], now + i * 0.38, 0.34);
    }
    scheduledRef.current = setInterval(() => {
      for (let i = 0; i < pattern.length; i++) {
        playNote(pattern[i], i * 0.38, 0.34);
      }
    }, 1600);
  }

  function stopMelody() {
    if (scheduledRef.current) {
      clearInterval(scheduledRef.current);
      scheduledRef.current = null;
    }
    if (audioRef.current && audioRef.current.ctx && audioRef.current.ctx.close) {
      audioRef.current.oscillators = [];
    }
  }

  function enviarConfirmacion() {
    if (!name.trim()) {
      alert("Por favor ingresa tu nombre para confirmar asistencia.");
      return;
    }
    alert("¡Gracias " + name + "! Tu confirmación ha sido registrada. Nos vemos el 6 de junio de 2026.");
  }

  function renderCalendar() {
    const days = 30;
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const calDays = [];
    
    for (let i = 0; i < days; i++) {
      const day = i + 1;
      const isSpecial = day === 6;
      calDays.push(
        React.createElement("div", {
          key: day,
          className: isSpecial ? "cal-day special-day pulse" : "cal-day"
        }, day)
      );
    }

    return React.createElement("div", { className: "calendar-container" },
      React.createElement("div", { className: "cal-header" }, "Junio 2026"),
      React.createElement("div", { className: "cal-grid" },
        dayNames.map((d) => React.createElement("div", { key: d, className: "cal-dayname" }, d)),
        React.createElement("div", { className: "cal-empty", style: { gridColumn: "1 / span 1" } }),
        calDays
      )
    );
  }

  return (
    <div className="main-container">
      {!showContent && (
        <div className="overlay-screen">
          <div
            className={envelopeOpen ? "envelope open-flap" : "envelope"}
            role="button"
            tabIndex={0}
            onClick={abrirSobre}
            onKeyDown={(e) => { if (e.key === "Enter") abrirSobre(); }}
            aria-label="Abrir invitación"
          >
            <div className="flap"></div>
            <div className="inner-card smooth">
              <h1 className="names elegant-title">Marlene & Arturo</h1>
              <p className="date elegant-date">6 Junio 2026</p>
              <p className="click-text">Haz clic para abrir</p>
            </div>
          </div>
        </div>
      )}

      {showContent && (
        <div id="contenido-principal" className="scroll-content fade-in">
          
          <section className="section">
            <div className="card card-taller shadow-soft">
              <img src={mya} className="photo-placeholder round-photo" alt="Marlene y Arturo" />
              <p className="quote fancy-quote">
                "Cuando encuentras a la persona correcta, deseas que el resto de tu vida comience lo antes posible."
              </p>

              <div className="music-row">
                <button className="icon-btn" onClick={toggleAudio} aria-pressed={audioPlayingRef.current}>
                  {audioPlayingRef.current ? (
                    <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M6 4h1.5v8H6V4zm4.5 0H12v8h-1.5V4z"></path>
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                    </svg>
                  )}
                  <span className="music-label">
                    {audioPlayingRef.current ? "Pausar melodía" : "Reproducir melodía"}
                  </span>
                </button>

                <p className="music-note">Una pieza breve para acompañar nuestro recuerdo.</p>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="card card-taller shadow-soft">
              <h2 className="title">Nuestro gran día</h2>

              <p className="subtitle">Nos estamos preparando para este gran día</p>

              <div className="countdown-beauty improved-countdown">
                <div className="circle glow"><span id="days">{countdown.days}</span><small>Días</small></div>
                <div className="circle glow"><span id="hours">{countdown.hours}</span><small>Horas</small></div>
                <div className="circle glow"><span id="minutes">{countdown.minutes}</span><small>Minutos</small></div>
                <div className="circle glow"><span id="seconds">{countdown.seconds}</span><small>Segundos</small></div>
              </div>

              <p className="date-note"><strong>Fecha: 6 de junio de 2026</strong></p>

              {renderCalendar()}
            </div>
          </section>

          <section className="section">
            <div className="card card-taller shadow-soft">
              <h2 className="title">Ceremonia — Quinta Los Alazanes</h2>

              <svg className="garden-icon" viewBox="0 0 64 64" width="80" height="80">
                <circle cx="32" cy="32" r="30" fill="#DFF6F1"></circle>
                <path d="M16 44c6-6 16-6 22 0" fill="none" stroke="#7AA986" strokeWidth="3" strokeLinecap="round"></path>
                <rect x="28" y="22" width="8" height="10" fill="#7AA986"></rect>
              </svg>

              <p className="time">Hora: 2:30 PM</p>
              <p className="place">Lugar: Quinta Los Alazanes</p>

              <div className="dress-row">
                <svg width="28" height="28" viewBox="0 0 24 24">
                  <path d="M4 4h6l2 3 2-3h6v2l-3 2v6h-2v-5l-2 1-2-1v5H7V8L4 6V4z" fill="#C49A6C"></path>
                </svg>
                <div>
                  <p className="dress-title">Código de vestimenta</p>
                  <p className="dress-desc"><strong>Elegante</strong> — tonos neutros, beige, pastel. Por favor evitar: blanco total y mezclilla.</p>
                </div>
              </div>

              <div className="actions-row">
                <a className="btn btn-link" href="https://www.google.com/maps/place/Quinta+los+Alazanes/@25.8154146,-100.5954717" target="_blank" rel="noreferrer">Ver en Google Maps</a>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="card card-taller shadow-soft">
              <h2 className="title">Confirmar asistencia</h2>
              <p className="confirm-instruction">Escribe tu nombre y confirma tu asistencia.</p>

              <input
                className="input-text"
                placeholder="Tu nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="actions-row">
                <button className="btn" onClick={enviarConfirmacion}>Enviar confirmación</button>
              </div>

              <p className="small-note">Si prefieres confirmar por WhatsApp, también puedes contactarnos directamente.</p>
            </div>
          </section>

          <section className="section">
            <div className="card card-taller shadow-soft">
              <h2 className="title">RECOMENDACIONES</h2>

              <ul className="reco-list">
                <li>Seguir las indicaciones del personal de la boda.</li>
                <li>Ser puntual.</li>
              </ul>

              <div className="no-kids">
                <h3>SIN NIÑOS</h3>
                <p>Un evento para adultos — ¡prepárense para una noche memorable!</p>
              </div>

              <h3 className="closing">ESPERAMOS CONTAR CON SU PRESENCIA</h3>
              <p className="thanks">Muchas gracias por acompañarnos.</p>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}