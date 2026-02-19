# Danish Shard — Personal Portfolio Site

## Overview

A cinematic, scroll-driven portfolio website built with React, GSAP, Three.js, and the Web Audio API. The desktop experience is fully immersive: the user scrolls through a space journey — launching from Earth, passing through asteroid fields (work history), landing on the Moon (projects), flying to Mars (skills), and returning home to Earth (contact). The scroll bar IS the throttle. There are no traditional page sections on desktop.

Mobile gets a conventional stacked layout (Hero → About → Work → Skills → Contact → Footer).

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5.9 | Type safety |
| Vite | 7 | Build tool / dev server |
| GSAP | 3.14 | Scroll-driven animation engine |
| `@gsap/react` | 2.1 | `useGSAP` hook for GSAP in React |
| GSAP ScrollTrigger | (bundled) | Scrub animations tied to scroll position |
| Three.js | 0.183 | WebGL particle field |
| `@react-three/fiber` | 9 | React renderer for Three.js |
| `@react-three/drei` | 10 | Three.js helpers |
| Tailwind CSS | 3.4 | Utility classes |
| Framer Motion | 12 | Preloader animation |
| Web Audio API | native | Spatial ambient audio drone |

**Dev server**: `npm run dev` → `http://localhost:5174`
**Backend API**: `http://localhost:8000/api/contact` (contact form POST endpoint, separate service)

---

## Project Structure

```
frontend/src/
├── App.tsx                          # Root — layout switch desktop/mobile
├── index.css                        # Global CSS, CSS variables, utility classes
├── App.css                          # Minimal app-level styles
│
├── context/
│   ├── ThemeContext.tsx              # dark/light theme toggle
│   └── SoundContext.tsx             # Web Audio API — shared audio state
│
├── hooks/
│   ├── useMagnet.ts                 # Magnetic hover effect for interactive elements
│   └── useSoundscape.ts             # (legacy, not used in main flow)
│
└── components/
    ├── Preloader/        # Animated intro screen, dismisses on click → sets `entered: true`
    ├── ParticleField/    # Three.js WebGL star field, always mounted (z-index 0)
    ├── SpaceJourney/     # Main cinematic layer — rocket, planets, asteroids, satellites (z-index 1)
    ├── CockpitFrame/     # Cockpit HUD overlay — scanlines, phase labels, alerts (z-index 4)
    ├── ContentOverlays/  # Four data panels triggered at journey phases (z-index 10)
    ├── Navbar/           # Always-on-top navigation HUD (z-index 50)
    ├── MusicButton/      # Fixed bottom-right mute toggle (z-index 200)
    ├── Cursor/           # Custom magnetic cursor
    │
    │   ── Mobile-only (rendered when window ≤ 768px) ──
    ├── Hero/
    ├── About/
    ├── Work/
    ├── Skills/
    ├── Contact/
    └── Footer/
```

---

## Desktop Architecture

### Scroll Model

- **Scroll spacer**: `<div style={{ height: '900vh' }} />` — gives the user 900vh of scroll distance
- **All cinematic elements**: `position: fixed; inset: 0` — nothing actually moves in the DOM
- **All animation**: driven by a single GSAP ScrollTrigger timeline:
  ```js
  gsap.timeline({
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,         // smooth lag behind scroll
    }
  })
  ```
- **Progress**: `0` (top of page) → `100` (bottom) mapped to journey phases

### Z-Index Stack

```
z-200   MusicButton (fixed bottom-right speaker icon)
z-50    Navbar
z-10    ContentOverlays (data panels — fixed, opacity 0 by default)
z-4     CockpitFrame (cockpit chrome, scanlines, HUD alerts)
z-3     Satellites (CSS orbital animation during Moon phase)
z-2     Asteroids (company history, fly through during deep space)
z-1     SpaceJourney (rocket, Earth, Moon, Mars — all position: fixed)
z-0     ParticleField (Three.js WebGL stars)
```

---

## Journey Phases (Scroll % → Event)

| Scroll % | Phase | Visual | Content |
|---|---|---|---|
| 0 – 5 | Pre-launch warmup | Exhaust glow | EarthPanel visible |
| 5 – 18 | On the pad | Rocket stationary, Earth fills bottom | EarthPanel (hero + bio + stats + skills marquee) |
| 14 – 18 | EarthPanel fade | Panel fades out | — |
| 18 – 22 | **Launch** | Exhaust flare, rocket lifts | CockpitFrame appears |
| 22 – 42 | Ascent | Rocket climbs, Earth shrinks | Vapor trail extends |
| 38 – 42 | Stage separation | Booster separates + flips + falls | Flash effect |
| 42 – 73 | **Deep space** | Rocket in center, stars, asteroids fly through | CockpitFrame work alert (44–71%) |
| 44 – 73 | Company asteroids | 5 asteroid rocks (Reliance, Byju's, Quikr, Netset, Dabster) fly through with label cards | — |
| 55 – 72 | Moon grows | Moon scales from dot to full | — |
| 72 – 78 | **Moon approach** | Rocket decelerates, legs deploy | Satellites fade in |
| 72 – 90 | **Moon surface** | Rocket landed beside Moon, 4 satellites in CSS orbit | WorkPanel (project cards) at 82–90% |
| 88 – 92 | Return launch | Legs retract, rocket flips 180°, Moon shrinks | — |
| 92 – 97 | **Mars approach** | Mars grows from dot, rocket decelerates | — |
| 95 – 97 | Mars landing | Rocket legs deploy on Mars | CockpitFrame project alert |
| 97 – 99 | **Mars surface** | Rocket landed on Mars | MarsPanel (skills grid) |
| 98 – 99 | Return from Mars | Legs retract, rocket re-launches | — |
| 99 – 100 | **Earth return** | Earth grows to scale 1.2 from below | ContactPanel (comms terminal) |

---

## Key Components

### `SpaceJourney/index.tsx`

The main visual engine. Everything is CSS `position: fixed` driven by a single GSAP scrub timeline.

**Key refs:**
- `rocketWrapRef` — rocket body
- `exhaustRef` / `vaporTrailRef` — engine effects
- `earthRef` / `moonRef` / `marsRef` — planet spheres (pure CSS radial-gradient, no images)
- `asteroidRefs` — array of 5 company asteroid divs
- `satelliteRefs` — array of 4 project satellite divs
- `heatShieldRef` / `separationFlashRef` / `boosterWrapRef` — visual FX elements
- `rocketLegRefs` — landing legs (2 legs, animate on Moon and Mars landing)

**Planets**: Pure CSS `border-radius: 50%` spheres with layered `radial-gradient` backgrounds — no image assets.

**Company asteroids (`COMPANIES` array)**: 5 organic blobs (`border-radius` with CSS `clip-path`-style shapes) that fly in from off-screen, each with a floating label card showing company name, role, and period. They appear during 44–73%.

**Project satellites (`SATELLITES` array)**: 4 satellites in CSS orbital animation around the Moon center. Each satellite:
- Zero-size anchor div positioned at Moon center (50%, 50%)
- Orbit ring div: `animation: satOrbit ${speed}s linear infinite`
- Translate div: `left: orbitRadius` moves the satellite to the orbit radius
- Counter-rotate div: `animation: satCounterOrbit ${speed}s linear infinite` — keeps the satellite body and label always upright
- `animation-delay: -${(startAngle/360) * speed}s` encodes the starting orbital position

```
const SATELLITES = [
  { id: '01', title: 'Food Chatbot MCP',    orbitRadius: 390, orbitSpeed: 22, startAngle: 30,  type: 'comms'    },
  { id: '02', title: 'ResQ SaaS Platform',  orbitRadius: 460, orbitSpeed: 32, startAngle: 150, type: 'science'  },
  { id: '03', title: 'Swiggy Extension',    orbitRadius: 330, orbitSpeed: 16, startAngle: 265, type: 'cubesat'  },
  { id: '04', title: 'Personal Site',       orbitRadius: 530, orbitSpeed: 44, startAngle: 70,  type: 'telescope'},
]
```

### `ContentOverlays/index.tsx`

Four `position: fixed; inset: 0; opacity: 0` panels. GSAP sets `opacity` and `pointerEvents` at journey phases.

| Panel | Scroll trigger | Content |
|---|---|---|
| `EarthPanel` | 0 → 18% | Name, tagline, bio, stats (3+ yrs / 12+ projects), skills marquee, "Scroll to Launch" CTA |
| `WorkPanel` | 82 → 90% | 4 project cards in 2-col grid with hover lift |
| `MarsPanel` | 97 → 99% | Skills grid: Frontend / Backend / AI-LLMs / Tools |
| `ContactPanel` | 99 → 100% | **Deep Space Comms Terminal** (see below) |

**ContactPanel design**: Phosphor-green CRT terminal aesthetic on a gradient-background panel (opaque at top for readability → transparent at bottom so Earth is visible through it). Fields: CALLSIGN (name), FREQUENCY (email), TRANSMISSION BODY (message). Submit button: `[ TRANSMIT ]`. POSTs to `http://localhost:8000/api/contact`.

### `CockpitFrame/index.tsx`

A fixed overlay that simulates looking through a spacecraft cockpit window. Contains:
- Corner chrome pieces (CSS borders)
- CRT scanline overlay (repeating-linear-gradient)
- Phase label HUD (updates at 18%, 38%, 44%, 72%, 78%, 92%, 95%, 98%)
- Work history alert (`workAlertRef`) — cyan, appears 44–71%: company + role data
- Project alert (`projectAlertRef`) — lime green, appears 72–82%

### `SoundContext.tsx`

Web Audio API ambient drone. A-minor chord with binaural beating:
- 110 Hz sine (A2 deep bass)
- 113 Hz sine (A2 detuned — creates 3 Hz binaural beat, sounds like "breathing")
- 165 Hz sine (E3 fifth)
- 220 Hz triangle (A3 octave)
- 329 Hz sine (E4 shimmer)
- Ping-pong delay reverb chain
- Very slow LFO tremolo (0.042 Hz)

**Mute**: Uses `AudioContext.suspend()` / `.resume()` — the ONLY reliable way to silence Web Audio including LFO modulation and delay feedback loops. Gain manipulation alone does NOT silence the LFO.

`SoundProvider` wraps the whole app. `useSound()` hook provides `{ muted, toggleMute, startAmbient, playTransmission, playWhoosh }`.

### `ParticleField/index.tsx`

Three.js / React Three Fiber WebGL canvas. Stars rendered as `<Points>` geometry with random positions. Always mounted, always visible behind everything.

### `MusicButton/index.tsx`

Fixed `bottom: 28, right: 28, z-index: 200`. Glassmorphic circle button. Cyan when playing, red when muted. Uses SVG speaker-on / speaker-mute icons.

---

## CSS Conventions

Key CSS custom properties (defined in `index.css`):
```css
--fg             /* foreground text */
--muted          /* secondary text */
--accent         /* #c8ff00 lime green */
--nebula-cyan    /* #00e5ff */
--glass-border   /* glassmorphism border color */
```

Utility classes:
- `.glass` — glassmorphism card background
- `.glass-highlight` — glass with inner highlight
- `.glass-glow` — glass with outer glow
- `.glow-text` — text with CSS text-shadow glow
- `.text-gradient` — lime-to-cyan gradient text
- `.animate-marquee` — CSS `@keyframes marquee` for skills ticker
- `.font-display` — display/heading font

---

## Mobile Fallback

On `window.matchMedia('(max-width: 768px)')`:
- No SpaceJourney, CockpitFrame, ContentOverlays, or scroll spacer
- Traditional stacked layout: `Hero → About → Work → Skills → Contact → Footer`
- ParticleField, Navbar, MusicButton still render
- SpaceJourney has a CSS media query `@media (max-width: 768px) { display: none }` as a backup

---

## Data / Content (All Hardcoded in Components)

**Work history** (in `SpaceJourney` as asteroids + `CockpitFrame` alert):
- Reliance — Software Engineer (2022)
- Byju's — Frontend Developer (2022–23)
- Quikr — Full-Stack Developer (2023)
- Netset Solutions — Web Developer (2024)
- Dabster Tech — Lead Engineer (2025)

**Projects** (in `ContentOverlays` WorkPanel + satellites):
- Food Chatbot MCP (React, Node.js, MCP, AI, MongoDB) — 2025
- ResQ SaaS Platform (React, Node.js, PostgreSQL, TypeScript) — 2024
- Swiggy Browser Extension (Chrome Extension, TypeScript, AI) — 2025
- Personal Site (React, GSAP, Three.js, TypeScript) — 2026

**Skills** (in `ContentOverlays` MarsPanel):
- Frontend: React, TypeScript, GSAP, Three.js, Tailwind CSS, Next.js, Vite
- Backend: Node.js, Express, MongoDB, PostgreSQL, REST APIs, WebSockets
- AI / LLMs: MCP Protocol, LLM Integration, Prompt Engineering, OpenAI API, Chatbots
- Tools: Git, Docker, Chrome Extensions, Figma, AWS, Linux

**Contact**: `hello@danishshard.dev`
**Socials**: GitHub (`github.com/danishshard`), LinkedIn (`linkedin.com/in/danishshard`), Twitter (`twitter.com/danishshard`)

---

## Known Architecture Notes

- `isMobile` is read from a `ref` at mount time (not state) to avoid re-renders — resize does NOT switch layouts mid-session
- GSAP timelines use `useGSAP` from `@gsap/react` which automatically handles cleanup on unmount
- All GSAP function-based values (`() => window.innerHeight * 0.5`) recalculate on ScrollTrigger refresh — resize-safe
- The `heatShieldRef` element exists in the JSX but its animation was removed (the Earth return is now a comms terminal, not a landing)
- `useSoundscape.ts` hook in `/hooks/` is legacy and unused — `SoundContext.tsx` is the active audio system
