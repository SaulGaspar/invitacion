# 💌 Invitación de Boda Virtual
## Marllene & Arturo · 13 de Junio 2026

---

## 🚀 Cómo correrlo

### Requisitos
- Node.js instalado (descarga en https://nodejs.org)

### Pasos
```bash
# 1. Entra a la carpeta del proyecto
cd wedding-invite

# 2. Corre el servidor
node server.js

# 3. Abre en tu navegador
http://localhost:3000
```

---

## 📁 Estructura del proyecto

```
wedding-invite/
├── server.js           ← Servidor Node.js
├── package.json
└── public/
    ├── index.html      ← Toda la invitación
    ├── style.css       ← Estilos
    └── app.js          ← Lógica (sobre, countdown, player, RSVP)
```

---

## ✏️ Personalizar

### Cambiar fecha de boda (countdown)
En `public/app.js`, línea 6:
```js
const WEDDING_DATE = new Date('2026-06-13T16:30:00');
```

### Cambiar dirección de iglesia / salón
En `public/index.html`, busca la sección `<!-- 4. CEREMONIA & RECEPCIÓN -->` y edita los textos y el `href` del botón de Google Maps.

### Agregar foto real
Pon tus fotos en la carpeta `public/images/` y reemplaza los placeholders en el HTML con:
```html
<img src="/images/tu-foto.jpg" alt="Marllene y Arturo">
```

### Agregar música real
Pon un archivo `.mp3` en `public/images/` y en `app.js` agrega:
```js
const audio = new Audio('/images/cancion.mp3');
```
Luego llama `audio.play()` / `audio.pause()` dentro de `togglePlay()`.

### Agregar número de cuenta (QR)
Reemplaza el bloque `.qr-placeholder` en el HTML con una imagen de tu QR:
```html
<img src="/images/qr.png" style="width:160px; border-radius:12px;">
```

---

## 🌐 Compartir en internet (gratis)

Sube el proyecto a **Vercel** o **Netlify**:
1. Crea cuenta en https://vercel.com
2. Arrastra la carpeta del proyecto
3. ¡Listo! Te dan un link para compartir por WhatsApp

---

*Hecho con ♥ para Marllene & Arturo*
