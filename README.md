# Nazar

Personal attention-tracking. Built in Almaty.

## Structure

```
/                        Landing page (glass aesthetic, EN/RU/KK)
/focus/                  Working focus session (real head tracking via face-api.js)
```

## Stack

- Static HTML + React (via CDN, no build step)
- face-api.js loaded from jsdelivr CDN — runs entirely in the browser
- All session data stored in `localStorage` (no backend needed)

## Deploy

Just push to GitHub. Vercel auto-detects static and serves it as-is.

If you want explicit Vercel config it's in `vercel.json`.

## Local preview

```
npx serve .
# or
python3 -m http.server 8000
```

Open `http://localhost:8000` → landing
Open `http://localhost:8000/focus/` → focus session

## Features

### Landing

- Glass / iOS18 aesthetic with animated gradient mesh
- 3 hero copy variants (toggleable via Tweaks panel)
- Light / dark mode toggle
- 4 mesh palettes (Aurora / Ocean / Sunset / Plasma)
- 3 languages (EN / RU / KK)
- Interactive attention demo with face-tracking mock
- Distraction-cost calculator
- Beta stats from real test users (n=47)
- Pricing, FAQ, testimonials, footer

### Focus Session (`/focus/`)

- Real-time head pose detection via face-api.js (loads from CDN — no model files in repo)
- Yaw + pitch heuristics for "looking away" / "looking at phone"
- Live focus score (0-100, smoothed)
- Drift counter + drift-time accumulator
- Best continuous focus run
- Today strip: sessions / focus time / streak / daily goal progress
- Session history (last 5) in localStorage
- End-of-session summary with personalized message
- Settings panel:
  - Display name + 5 accent colors
  - Daily focus goal (30m-8h)
  - Detection sensitivity (Loose / Normal / Strict)
  - Drift threshold (2-10s)
  - Custom session length (5-180m)
  - Break suggestion (0-30m)
  - Auto-pause when no face
  - Sound + toast + landmark display toggles
- Keyboard shortcuts: Space (pause), Esc (end), F (fullscreen), S (sound), , (settings)
- Soft chimes on session events (Web Audio API)

## Privacy

Camera frames never leave the browser. The face-detection model runs locally
in WebGL. No data is uploaded anywhere — sessions are saved only to
`localStorage` on your device.
