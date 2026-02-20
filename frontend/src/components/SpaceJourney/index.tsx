import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Company asteroids ────────────────────────────────────────────────────────

const COMPANIES = [
  {
    name: 'Reliance',
    role: 'Software Engineer',
    period: '2022',
    size: 100,
    // starts off-screen left
    cssLeft: -130, cssTop: '18vh',
    shape: '62% 38% 46% 54% / 60% 44% 56% 40%',
    gradient: 'radial-gradient(circle at 32% 28%, #b4ac9c 0%, #7e7668 22%, #525048 50%, #323028 74%, #1e1c18 100%)',
    spinDur: 28,
  },
  {
    name: "Byju's",
    role: 'Frontend Developer',
    period: '2022–23',
    size: 76,
    // starts off-screen right
    cssLeft: 'calc(100vw + 90px)', cssTop: '53vh',
    shape: '48% 52% 38% 62% / 52% 60% 40% 48%',
    gradient: 'radial-gradient(circle at 36% 32%, #a8a294 0%, #74706a 22%, #4e4c44 50%, #2e2c28 74%, #1a1916 100%)',
    spinDur: 36,
  },
  {
    name: 'Quikr',
    role: 'Full-Stack Developer',
    period: '2023',
    size: 86,
    // starts off-screen left, lower
    cssLeft: -110, cssTop: '63vh',
    shape: '55% 45% 58% 42% / 46% 54% 46% 54%',
    gradient: 'radial-gradient(circle at 30% 26%, #bab0a0 0%, #8a8478 22%, #5a5850 50%, #363430 74%, #201e1c 100%)',
    spinDur: 22,
  },
  {
    name: 'Netset Solutions',
    role: 'Web Developer',
    period: '2024',
    size: 66,
    // starts off-screen top
    cssLeft: '60vw', cssTop: -100,
    shape: '40% 60% 50% 50% / 58% 42% 58% 42%',
    gradient: 'radial-gradient(circle at 38% 34%, #aaa49a 0%, #7a7670 22%, #525050 50%, #323030 74%, #1c1c1c 100%)',
    spinDur: 42,
  },
  {
    name: 'Dabster Tech',
    role: 'Lead Engineer',
    period: '2025',
    size: 80,
    // starts off-screen right, upper
    cssLeft: 'calc(100vw + 70px)', cssTop: '35vh',
    shape: '52% 48% 42% 58% / 48% 56% 44% 52%',
    gradient: 'radial-gradient(circle at 34% 30%, #b0a898 0%, #7c7870 22%, #505048 50%, #303028 74%, #1c1c18 100%)',
    spinDur: 32,
  },
];

// ─── Project satellites — orbit the Moon (phase 72–90%) ──────────────────────
// Each satellite has a unique orbit radius, speed, and starting angle so they
// feel like a real orbital network visible through the cockpit window.

const SATELLITES = [
  {
    id: '01',
    title: 'Food Chatbot MCP',
    tags: ['React', 'MCP', 'AI'],
    year: '2025',
    accent: '#c8ff00',
    orbitRadius: 390,
    orbitSpeed:  22,
    startAngle:  30,
    type: 'comms',
    desc: `Food Chatbot MCP started from a simple frustration — switching between Zomato and Swiggy to compare prices, check restaurant availability, and read reviews before placing a single food order. I wanted a single conversational interface that could handle everything.

The core architecture is built around the Model Context Protocol, an open standard for connecting LLMs to external data sources and tools. Instead of hardcoding API calls, I built MCP servers for both Zomato and Swiggy that expose restaurant search, menu browsing, cart management, and order placement as structured tool calls. The LLM acts as an orchestration layer — it understands user intent, decides which platform to query, compares results, and executes the order.

On the frontend, I built a React-based chat interface with real-time streaming responses. The conversation feels natural — you can say "find me a good biryani place under 300 bucks that delivers in 30 minutes" and the bot searches both platforms simultaneously, ranks results by rating and delivery time, and presents a comparison. You can follow up with "order the first one, extra raita" and it handles cart construction and checkout.

The backend runs on Node.js with Express, managing session state, conversation history, and MCP server connections. I implemented a connection pooling system for the MCP servers since each platform connection carries authentication state and rate limits. The prompt engineering layer handles edge cases like ambiguous restaurant names, out-of-stock items, and address validation.

One of the trickier challenges was handling the real-time nature of food delivery — restaurant availability changes by the minute, prices fluctuate during surge, and menus update constantly. I built a caching layer with short TTLs that balances freshness against API rate limits.

The project taught me a lot about LLM tool-use patterns, structured output parsing, and the importance of graceful degradation when external APIs fail mid-conversation.`,
  },
  {
    id: '02',
    title: 'ResQ SaaS Platform',
    tags: ['React', 'PostgreSQL'],
    year: '2024',
    accent: '#00e5ff',
    orbitRadius: 460,
    orbitSpeed:  32,
    startAngle:  150,
    type: 'science',
    desc: `ResQ is a field service management platform I built for enterprise clients who manage large fleets of equipment — think industrial machinery, HVAC systems, and medical devices spread across hundreds of locations. The problem is coordinating technicians, spare parts inventory, and job schedules across all of it without things falling through the cracks.

The platform has three main modules. The first is a job scheduling engine that handles technician assignment based on skills, proximity, availability, and part requirements. When a service request comes in, the system evaluates which technicians are qualified, checks their current schedules, calculates travel time from their last job, and verifies that required spare parts are available at the nearest warehouse. The assignment algorithm accounts for SLA deadlines and priority tiers — a hospital MRI machine gets different treatment than an office printer.

The second module is the inventory management system. Every spare part across every warehouse is tracked in real time. When a technician picks up parts for a job, the inventory updates instantly. When stock hits reorder thresholds, purchase orders generate automatically. I built a predictive consumption model that analyzes historical usage patterns to forecast which parts will be needed where, reducing emergency procurement by about 40% for our pilot clients.

The third module is the reporting dashboard. Operations managers see real-time maps of technician locations, job statuses, SLA compliance rates, and inventory levels. I built custom chart components with drill-down capability — click on a region showing low SLA compliance and it breaks down by technician, by equipment type, by failure category.

The tech stack is React with TypeScript on the frontend, Node.js with Express on the backend, and PostgreSQL for the database. I chose PostgreSQL for its strong support for geospatial queries (PostGIS extension) and complex joins across the inventory, scheduling, and location tables. The real-time updates use WebSockets for live technician tracking and job status changes.

Authentication uses role-based access control with four tiers — admin, operations manager, dispatcher, and technician — each with different views and permissions. The mobile experience for technicians is optimized for field use with offline-first capability for areas with poor connectivity.`,
  },
  {
    id: '03',
    title: 'Swiggy Extension',
    tags: ['Chrome', 'AI'],
    year: '2025',
    accent: '#ff6b9d',
    orbitRadius: 330,
    orbitSpeed:  16,
    startAngle:  265,
    type: 'cubesat',
    desc: `The Swiggy Browser Extension was born as a companion project to the Food Chatbot MCP — but instead of being a standalone chat app, this one lives directly in your browser as a Chrome extension. The idea was to let users interact with Swiggy through natural language without ever leaving the tab they are on.

The extension injects a floating chat widget into any webpage. Click it, and a sleek conversation panel slides out from the right edge of the screen. You can type things like "order my usual from Meghana Foods" or "what's good for dinner tonight under 500 rupees" and the extension handles the rest — it communicates with Swiggy's interface through content scripts that interact with the DOM and API layer.

Building a Chrome extension that interfaces with a third-party web app presented unique challenges. Swiggy's frontend is a single-page React application with dynamic content loading, so I had to build robust DOM observers that detect when restaurant pages, menus, and cart states change. The content script uses MutationObserver to track these changes and relay structured data back to the extension's background service worker.

The AI layer runs in the background service worker, which maintains conversation context and translates natural language into a sequence of actions — search for restaurants, filter by cuisine and price, select items, customize options (extra cheese, no onions), and add to cart. I implemented a state machine that tracks the order flow and handles interruptions gracefully. If you say "actually, make that two" mid-conversation, the system understands you mean the last item discussed.

The TypeScript codebase is split into four layers: the popup UI (React), the content script (DOM interaction), the background service worker (AI processing and state management), and a shared types layer that keeps everything in sync. Communication between layers uses Chrome's messaging API with typed message contracts.

One challenge was handling Swiggy's frequent UI updates — their frontend changes regularly, which can break DOM selectors. I built an abstraction layer with multiple fallback selectors and visual landmark detection that makes the extension resilient to minor UI changes without requiring updates.

The extension also caches your order history locally, so over time it learns your preferences and can suggest reorders. Privacy is handled carefully — all data stays in local storage, nothing leaves the browser except the actual Swiggy API calls.`,
  },
  {
    id: '04',
    title: 'Personal Site',
    tags: ['GSAP', 'Three.js'],
    year: '2026',
    accent: '#9b6dff',
    orbitRadius: 530,
    orbitSpeed:  44,
    startAngle:  70,
    type: 'telescope',
    desc: `This portfolio site was an experiment in pushing the boundaries of what a personal website can feel like. Most developer portfolios are stacked sections with fade-in animations — I wanted something that felt like an experience, something people would actually want to scroll through out of curiosity rather than obligation.

The concept is a space journey. You start on Earth, launch a rocket, travel through deep space past asteroid-like company experiences, orbit the Moon where project satellites circle (you are looking at one right now), visit Mars for the technical stack, and return to Earth for the contact terminal. The entire journey is a single continuous scroll mapped to a GSAP ScrollTrigger master timeline spanning 900 viewport heights.

The rocket itself is a hand-drawn SVG with separate components for the main stage, boosters, exhaust flames, vapor trail, landing legs, and a retro-burn thruster. Stage separation at 38% scroll includes a flash effect and the booster flipping 180 degrees for its independent return trajectory — inspired by SpaceX Falcon 9 landings. The booster deploys its own landing legs and touches down with a retro-burn while the main stage continues to the Moon.

The particle field is the visual backbone — 80,000 points rendered via React Three Fiber with custom GLSL shaders. Each particle has ambient drift, scroll-responsive warp elongation (particles stretch during fast scrolling to simulate speed), and individual flicker timing. The color palette mixes warm white, cyan, chartreuse, violet, and rose to create depth without being distracting.

Earth, Moon, and Mars are pure CSS spheres with layered radial gradients simulating continental shapes, polar ice caps, atmospheric glow, and terminator shadows. They respond to mouse movement via GSAP quickTo parallax — moving your cursor shifts the planets subtly in the opposite direction, creating a cockpit-window depth effect.

The cockpit HUD frame includes instrument gauges, a live mission clock, phase labels that update with scroll position, a scanline effect, crosshair arms, and contextual alert panels that signal incoming work experience data and project manifest downloads.

The space effects layer adds warp speed streaks during ascent, softly drifting nebula clouds during deep space transit, ambient comets, and lens flare near the rocket exhaust during burn phases. The contact section at the end is a CRT-style green phosphor terminal with scanline effects and a functional form.

Sound design uses the Web Audio API with spatial ambient drones, transmission chimes when the asteroid field begins, and per-asteroid whoosh effects timed to scroll position. The entire experience is built with React 19, TypeScript, Vite 7, GSAP, React Three Fiber, and Tailwind CSS.`,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function EarthSphere({ earthRef }: { earthRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={earthRef}
      style={{
        position: 'fixed',
        width: 900,
        height: 900,
        borderRadius: '50%',
        bottom: -440,
        left: '50%',
        marginLeft: -450,
        background: [
          'radial-gradient(circle at 30% 30%, #6dd5fa 0%, #2980b9 8%, #1565c0 18%,',
          '#0d47a1 28%, #0a3880 42%, #072060 60%, #040f30 80%, #010810 100%)',
        ].join(' '),
        boxShadow: [
          '0 0 0 14px rgba(100,200,255,0.06)',
          '0 0 0 28px rgba(60,150,255,0.04)',
          '0 0 0 50px rgba(30,80,200,0.03)',
          '0 0 120px 40px rgba(0,160,255,0.22)',
          '0 0 240px 80px rgba(0,80,220,0.14)',
          '0 0 400px 120px rgba(0,40,160,0.07)',
          'inset -80px -80px 160px rgba(0,0,30,0.70)',
          'inset 30px 30px 80px rgba(0,60,120,0.15)',
        ].join(', '),
        willChange: 'transform, opacity',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: [
          'radial-gradient(ellipse 80% 40% at 28% 32%, rgba(100,200,255,0.12) 0%, transparent 60%)',
          'radial-gradient(ellipse 50% 25% at 72% 20%, rgba(80,180,255,0.09) 0%, transparent 55%)',
        ].join(', '),
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: [
          'radial-gradient(ellipse 22% 34% at 28% 44%, rgba(34,139,34,0.72) 0%, rgba(20,100,20,0.40) 50%, transparent 80%)',
          'radial-gradient(ellipse 28% 18% at 60% 36%, rgba(34,120,34,0.60) 0%, rgba(22,90,22,0.30) 55%, transparent 80%)',
          'radial-gradient(ellipse 14% 22% at 52% 55%, rgba(180,140,60,0.55) 0%, rgba(140,100,30,0.28) 60%, transparent 80%)',
          'radial-gradient(ellipse 40% 14% at 50% 96%, rgba(230,240,255,0.50) 0%, rgba(200,220,255,0.20) 60%, transparent 80%)',
          'radial-gradient(ellipse 30% 10% at 50% 4%, rgba(220,235,255,0.40) 0%, transparent 70%)',
        ].join(', '),
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: [
          'radial-gradient(ellipse 70% 12% at 50% 30%, rgba(255,255,255,0.16) 0%, transparent 70%)',
          'radial-gradient(ellipse 55% 8%  at 40% 48%, rgba(255,255,255,0.10) 0%, transparent 70%)',
          'radial-gradient(ellipse 45% 10% at 62% 65%, rgba(255,255,255,0.12) 0%, transparent 70%)',
          'radial-gradient(ellipse 80% 6%  at 50% 78%, rgba(255,255,255,0.08) 0%, transparent 70%)',
        ].join(', '),
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle at 50% 50%, transparent 78%, rgba(80,180,255,0.30) 86%, rgba(40,120,255,0.15) 92%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle at 72% 56%, transparent 36%, rgba(0,5,25,0.65) 62%, rgba(0,2,15,0.88) 100%)',
      }} />
    </div>
  );
}

function MarsSphere({ marsRef }: { marsRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={marsRef}
      style={{
        position: 'fixed',
        width: 680, height: 680,
        borderRadius: '50%',
        top: '50%', left: '50%',
        marginLeft: -340, marginTop: -340,
        background: [
          'radial-gradient(circle at 36% 40%,',
          '  #d4704a 0%, #b55830 12%, #8b3d1e 26%,',
          '  #6b2c10 42%, #4a1c08 62%, #2e1005 80%,',
          '  #180800 100%)',
        ].join(' '),
        boxShadow: [
          '0 0 60px 20px rgba(180,80,30,0.14)',
          '0 0 120px 50px rgba(140,60,20,0.07)',
          'inset -60px -60px 120px rgba(0,0,0,0.65)',
          'inset 20px 20px 60px rgba(220,120,60,0.07)',
        ].join(', '),
        opacity: 0,
        transform: 'scale(0.05)',
        willChange: 'transform, opacity',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* Surface dark regions (Syrtis Major, etc.) */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: [
          'radial-gradient(ellipse 30% 24% at 42% 38%, rgba(70,20,6,0.65) 0%, rgba(50,14,4,0.30) 60%, transparent 85%)',
          'radial-gradient(ellipse 22% 18% at 63% 52%, rgba(80,25,8,0.55) 0%, rgba(60,18,5,0.25) 60%, transparent 85%)',
          'radial-gradient(ellipse 18% 14% at 28% 56%, rgba(75,22,7,0.48) 0%, transparent 78%)',
          'radial-gradient(ellipse 10% 5%  at 52% 32%, rgba(90,28,8,0.55) 0%, transparent 70%)',
        ].join(', '),
      }} />
      {/* Valles Marineris canyon strip */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(ellipse 56% 5% at 48% 47%, rgba(40,12,3,0.60) 0%, rgba(30,8,2,0.28) 55%, transparent 82%)',
      }} />
      {/* North polar ice */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(ellipse 30% 9% at 50% 5%, rgba(230,205,185,0.32) 0%, rgba(210,180,150,0.12) 60%, transparent 80%)',
      }} />
      {/* Dusty haze rim */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle at 50% 50%, transparent 78%, rgba(180,80,30,0.28) 86%, rgba(140,60,20,0.14) 93%, transparent 100%)',
      }} />
      {/* Terminator shadow */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle at 70% 58%, transparent 30%, rgba(0,0,0,0.40) 55%, rgba(0,0,0,0.75) 72%, rgba(0,0,0,0.94) 100%)',
      }} />
    </div>
  );
}

function MoonSphere({ moonRef }: { moonRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={moonRef}
      style={{
        position: 'fixed',
        width: 720,
        height: 720,
        borderRadius: '50%',
        top: '50%',
        left: '50%',
        marginLeft: -360,
        marginTop: -360,
        background: [
          'radial-gradient(circle at 38% 42%,',
          '  #ddddd5 0%, #c8c8bf 12%, #b0b0a8 26%,',
          '  #909088 44%, #707068 62%, #505048 80%,',
          '  #2a2a24 92%, #141410 100%)',
        ].join(' '),
        boxShadow: [
          '0 0 60px 20px rgba(210,210,190,0.12)',
          '0 0 120px 50px rgba(190,190,170,0.06)',
          'inset -60px -60px 120px rgba(0,0,0,0.62)',
          'inset 20px 20px 60px rgba(255,255,255,0.04)',
        ].join(', '),
        opacity: 0,
        transform: 'scale(0.05)',
        willChange: 'transform, opacity',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: [
          'radial-gradient(ellipse 28% 24% at 38% 40%, rgba(50,50,44,0.65) 0%, rgba(40,40,35,0.30) 60%, transparent 85%)',
          'radial-gradient(ellipse 20% 16% at 60% 50%, rgba(55,55,48,0.55) 0%, rgba(42,42,38,0.25) 60%, transparent 85%)',
          'radial-gradient(ellipse 16% 12% at 56% 32%, rgba(48,48,42,0.50) 0%, transparent 75%)',
          'radial-gradient(ellipse 8%  7%  at 76% 36%, rgba(44,44,38,0.60) 0%, transparent 70%)',
          'radial-gradient(ellipse 20% 30% at 28% 55%, rgba(52,52,46,0.45) 0%, transparent 80%)',
        ].join(', '),
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: [
          'radial-gradient(circle 5%   at 44% 80%, rgba(255,255,245,0.55) 0%, rgba(200,200,180,0.20) 40%, transparent 70%)',
          'radial-gradient(circle 4.5% at 36% 50%, rgba(220,218,205,0.50) 0%, rgba(160,158,145,0.20) 45%, transparent 70%)',
          'radial-gradient(circle 3%   at 28% 48%, rgba(210,208,195,0.45) 0%, rgba(150,148,135,0.18) 45%, transparent 65%)',
          'radial-gradient(circle 2.5% at 22% 38%, rgba(240,238,228,0.60) 0%, rgba(190,188,175,0.22) 40%, transparent 65%)',
          'radial-gradient(ellipse 4% 3% at 40% 20%, rgba(35,35,30,0.65) 0%, rgba(55,55,48,0.30) 50%, transparent 75%)',
          'radial-gradient(ellipse 6% 5% at 46% 88%, rgba(140,140,130,0.40) 0%, rgba(100,100,92,0.18) 55%, transparent 75%)',
          'radial-gradient(circle 1.5% at 66% 62%, rgba(190,190,178,0.40) 0%, transparent 60%)',
          'radial-gradient(circle 1.2% at 72% 44%, rgba(195,193,180,0.38) 0%, transparent 60%)',
          'radial-gradient(circle 1.8% at 58% 72%, rgba(185,183,170,0.35) 0%, transparent 60%)',
          'radial-gradient(circle 2.2% at 30% 68%, rgba(192,190,178,0.38) 0%, transparent 60%)',
        ].join(', '),
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: [
          'radial-gradient(circle 5.5% at 44% 80%, rgba(0,0,0,0) 72%, rgba(210,208,195,0.25) 75%, transparent 80%)',
          'radial-gradient(circle 5.2% at 36% 50%, rgba(0,0,0,0) 70%, rgba(200,198,185,0.22) 74%, transparent 79%)',
          'radial-gradient(circle 3.5% at 28% 48%, rgba(0,0,0,0) 70%, rgba(195,193,180,0.20) 74%, transparent 79%)',
        ].join(', '),
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle at 68% 60%, transparent 32%, rgba(0,0,0,0.40) 55%, rgba(0,0,0,0.72) 72%, rgba(0,0,0,0.92) 100%)',
      }} />
    </div>
  );
}

function RocketSVG() {
  return (
    <svg viewBox="0 0 40 118" width={40} height={118} fill="none">
      <path d="M20,2 Q8,20 7,33 L33,33 Q32,20 20,2 Z" fill="#dce0ec" />
      <path d="M20,2 Q13,18 11,31 L17,31 Q16,18 20,2 Z" fill="rgba(255,255,255,0.22)" />
      <rect x="7" y="33" width="26" height="56" fill="#dce0ec" />
      <rect x="7" y="33" width="6" height="56" fill="rgba(0,0,0,0.10)" />
      <rect x="7" y="60" width="26" height="2.5" fill="#00e5ff" opacity="0.38" />
      <rect x="12" y="42" width="16" height="5" rx="2.5" fill="white" opacity="0.10" />
      <rect x="7" y="89" width="26" height="5" fill="#a8acb8" />
      <path d="M7,94 L9,108 L31,108 L33,94 Z" fill="#bec2ce" />
      <ellipse cx="14" cy="112" rx="4.5" ry="3.5" fill="#5a6070" />
      <ellipse cx="20" cy="112" rx="4.5" ry="3.5" fill="#5a6070" />
      <ellipse cx="26" cy="112" rx="4.5" ry="3.5" fill="#5a6070" />
      <ellipse cx="14" cy="112" rx="3"   ry="2.5" fill="#1e2028" />
      <ellipse cx="20" cy="112" rx="3"   ry="2.5" fill="#1e2028" />
      <ellipse cx="26" cy="112" rx="3"   ry="2.5" fill="#1e2028" />
      <path d="M7,96 L2,116 L9,116 L9,100 Z"     fill="#a8acb8" />
      <path d="M33,96 L38,116 L31,116 L31,100 Z" fill="#a8acb8" />
    </svg>
  );
}

function BoosterSVG() {
  return (
    <svg viewBox="0 0 34 90" width={34} height={90} fill="none">
      <path d="M6,8 Q6,2 17,2 Q28,2 28,8 Z" fill="#c0c4d0" />
      <rect x="6" y="8" width="22" height="44" fill="#d8dce8" />
      <rect x="6" y="8" width="5" height="44" fill="rgba(0,0,0,0.12)" />
      <rect x="6" y="28" width="22" height="2" fill="#00e5ff" opacity="0.25" />
      <rect x="1" y="38" width="32" height="2" fill="#8890a0" />
      <rect x="1" y="43" width="32" height="2" fill="#8890a0" />
      <rect x="1" y="48" width="32" height="2" fill="#8890a0" />
      <rect x="1" y="53" width="32" height="2" fill="#8890a0" />
      <path d="M6,52 L8,66 L26,66 L28,52 Z" fill="#c0c4d0" />
      <ellipse cx="11" cy="70" rx="4"   ry="3"   fill="#6a7080" />
      <ellipse cx="17" cy="70" rx="4"   ry="3"   fill="#6a7080" />
      <ellipse cx="23" cy="70" rx="4"   ry="3"   fill="#6a7080" />
      <ellipse cx="11" cy="70" rx="2.5" ry="2"   fill="#252830" />
      <ellipse cx="17" cy="70" rx="2.5" ry="2"   fill="#252830" />
      <ellipse cx="23" cy="70" rx="2.5" ry="2"   fill="#252830" />
    </svg>
  );
}

// ─── Main SpaceJourney ────────────────────────────────────────────────────────

export default function SpaceJourney() {
  const earthRef           = useRef<HTMLDivElement>(null);
  const moonRef            = useRef<HTMLDivElement>(null);
  const marsRef            = useRef<HTMLDivElement>(null);
  const rocketWrapRef      = useRef<HTMLDivElement>(null);
  const boosterWrapRef     = useRef<HTMLDivElement>(null);
  const exhaustRef         = useRef<HTMLDivElement>(null);
  const retroBurnRef       = useRef<HTMLDivElement>(null);
  const heatShieldRef      = useRef<HTMLDivElement>(null);
  const vaporTrailRef      = useRef<HTMLDivElement>(null);
  const boosterTrailRef    = useRef<HTMLDivElement>(null);
  const separationFlashRef = useRef<HTMLDivElement>(null);
  const rocketLegRefs      = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const boosterLegRefs     = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);

  // One ref per asteroid (the outer wrapper that GSAP drives)
  const asteroidRefs    = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null]);
  // One ref per satellite orbital wrapper (GSAP controls opacity; CSS drives rotation)
  const satelliteRefs   = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);

  // Mouse parallax — quickTo functions for planet x/y (separate from scroll-driven scale/opacity)
  const pxFns = useRef<Record<string, ReturnType<typeof gsap.quickTo> | null>>({
    earthX: null, earthY: null,
    moonX: null, moonY: null,
    marsX: null, marsY: null,
  });

  useEffect(() => {
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // ── Initial states ────────────────────────────────────────────────────────
    gsap.set(earthRef.current, { opacity: 1, scale: 1 });
    gsap.set(moonRef.current,  { opacity: 0, scale: 0.05 });
    gsap.set(marsRef.current,  { opacity: 0, scale: 0.05 });

    gsap.set(rocketWrapRef.current,   { opacity: 1, y: 0, x: 0, rotate: 0 });
    gsap.set(exhaustRef.current,      { opacity: 0, scaleY: 0.2 });
    gsap.set(heatShieldRef.current,   { opacity: 0 });

    gsap.set(boosterWrapRef.current, {
      opacity: 0, rotate: 0,
      y: () => -(window.innerHeight * 0.55),
      x: 0,
    });
    gsap.set(retroBurnRef.current,    { opacity: 0, scaleY: 0.3 });
    gsap.set(vaporTrailRef.current,   { scaleY: 0, opacity: 0 });
    gsap.set(boosterTrailRef.current, { opacity: 0 });
    gsap.set(separationFlashRef.current, { opacity: 0, scale: 0 });

    [...rocketLegRefs.current, ...boosterLegRefs.current].forEach((leg) => {
      if (leg) gsap.set(leg, { scaleY: 0, rotate: 0, x: 0 });
    });

    // Asteroids: all start hidden (CSS positions them off-screen)
    asteroidRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0 });
    });

    // Satellites: all start hidden (CSS handles the rotation, GSAP handles opacity)
    satelliteRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0 });
    });

    // Mouse parallax — quickTo for x/y on celestial bodies
    // Safe because scroll timeline only touches scale/opacity on these refs
    if (earthRef.current) {
      pxFns.current.earthX = gsap.quickTo(earthRef.current, 'x', { duration: 1.3, ease: 'power3.out' });
      pxFns.current.earthY = gsap.quickTo(earthRef.current, 'y', { duration: 1.3, ease: 'power3.out' });
    }
    if (moonRef.current) {
      pxFns.current.moonX = gsap.quickTo(moonRef.current, 'x', { duration: 1.1, ease: 'power3.out' });
      pxFns.current.moonY = gsap.quickTo(moonRef.current, 'y', { duration: 1.1, ease: 'power3.out' });
    }
    if (marsRef.current) {
      pxFns.current.marsX = gsap.quickTo(marsRef.current, 'x', { duration: 1.1, ease: 'power3.out' });
      pxFns.current.marsY = gsap.quickTo(marsRef.current, 'y', { duration: 1.1, ease: 'power3.out' });
    }

    // ── Master timeline ───────────────────────────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });

    // ── [0–5] PRE-LAUNCH WARMUP ───────────────────────────────────────────────
    tl.to(exhaustRef.current, { opacity: 0.22, scaleY: 0.45, duration: 5, ease: 'none' }, 0);

    // ── [5–18] EARTH PHASE ────────────────────────────────────────────────────
    tl.to(earthRef.current, { scale: 1.012, duration: 13, ease: 'sine.inOut' }, 5);

    // ── [18–22] LAUNCH ────────────────────────────────────────────────────────
    tl.to(exhaustRef.current, { opacity: 1, scaleY: 3.2, scaleX: 0.8, duration: 4, ease: 'power4.out' }, 18)
      .to(vaporTrailRef.current, { opacity: 0.88, duration: 2, ease: 'power2.out' }, 18)
      .to(rocketWrapRef.current, { y: -80, duration: 4, ease: 'power3.in' }, 18);

    // ── [22–42] ASCENT ────────────────────────────────────────────────────────
    tl.to(rocketWrapRef.current, {
      y: () => -(window.innerHeight * 0.85),
      x: 25, duration: 20, ease: 'power1.inOut',
    }, 22)
      .to(vaporTrailRef.current, { scaleY: 1, duration: 20, ease: 'none' }, 22)
      .to(earthRef.current, { scale: 0.28, opacity: 0.35, duration: 20, ease: 'power2.in' }, 22)
      .to(exhaustRef.current, { scaleY: 3.8, scaleX: 0.65, duration: 20, ease: 'none' }, 22);

    // ── [38–42] STAGE SEPARATION ──────────────────────────────────────────────
    tl.to(separationFlashRef.current, { opacity: 1, scale: 3.0, duration: 0.5, ease: 'power4.out' }, 38)
      .to(separationFlashRef.current, { opacity: 0, scale: 6.0, duration: 2.5, ease: 'power3.in' }, 38.5)
      .to(boosterWrapRef.current, { opacity: 1, duration: 0.5, ease: 'none' }, 38)
      .to(boosterWrapRef.current, { rotate: 180, duration: 5, ease: 'power2.inOut' }, 38)
      .to(boosterTrailRef.current, { opacity: 0.4, duration: 3, ease: 'none' }, 42);

    // ── [42–55] DEEP SPACE ────────────────────────────────────────────────────
    tl.to(rocketWrapRef.current, {
      y: () => -(window.innerHeight * 1.0),
      x: -8, duration: 13, ease: 'power1.out',
    }, 42);
    tl.to(earthRef.current, { opacity: 0, scale: 0.06, duration: 10, ease: 'power2.out' }, 42);
    tl.to(boosterWrapRef.current, {
      y: () => -(window.innerHeight * 0.55) + window.innerHeight * 0.38,
      x: -50, duration: 13, ease: 'power1.in',
    }, 42);

    // ── [44–73] COMPANY ASTEROIDS (float through deep space) ─────────────────

    // — Asteroid 0: Reliance — enters from left, drifts rightward
    tl.to(asteroidRefs.current[0], {
      opacity: 1,
      x: () => window.innerWidth * 0.35,
      duration: 7, ease: 'power1.out',
    }, 44)
      .to(asteroidRefs.current[0], {
        x: () => window.innerWidth * 0.72,
        y: 45,
        duration: 13, ease: 'none',
      }, 51)
      .to(asteroidRefs.current[0], {
        opacity: 0,
        x: () => window.innerWidth * 0.88,
        duration: 5, ease: 'power1.in',
      }, 62);

    // — Asteroid 1: Byju's — enters from right, drifts leftward
    tl.to(asteroidRefs.current[1], {
      opacity: 1,
      x: () => -window.innerWidth * 0.32,
      duration: 7, ease: 'power1.out',
    }, 47)
      .to(asteroidRefs.current[1], {
        x: () => -window.innerWidth * 0.70,
        y: -28,
        duration: 14, ease: 'none',
      }, 54)
      .to(asteroidRefs.current[1], {
        opacity: 0,
        x: () => -window.innerWidth * 0.85,
        duration: 5, ease: 'power1.in',
      }, 64);

    // — Asteroid 2: Quikr — enters from left-lower, drifts right-upward
    tl.to(asteroidRefs.current[2], {
      opacity: 1,
      x: () => window.innerWidth * 0.28,
      duration: 7, ease: 'power1.out',
    }, 50)
      .to(asteroidRefs.current[2], {
        x: () => window.innerWidth * 0.62,
        y: -50,
        duration: 13, ease: 'none',
      }, 57)
      .to(asteroidRefs.current[2], {
        opacity: 0,
        x: () => window.innerWidth * 0.78,
        duration: 5, ease: 'power1.in',
      }, 66);

    // — Asteroid 3: Netset Solutions — enters from top, falls downward
    tl.to(asteroidRefs.current[3], {
      opacity: 1,
      y: () => window.innerHeight * 0.26,
      duration: 7, ease: 'power1.out',
    }, 53)
      .to(asteroidRefs.current[3], {
        y: () => window.innerHeight * 0.80,
        x: () => -window.innerWidth * 0.10,
        duration: 14, ease: 'none',
      }, 60)
      .to(asteroidRefs.current[3], {
        opacity: 0,
        y: () => window.innerHeight * 0.96,
        duration: 5, ease: 'power1.in',
      }, 68);

    // — Asteroid 4: Dabster Tech — enters from right-upper, drifts leftward
    tl.to(asteroidRefs.current[4], {
      opacity: 1,
      x: () => -window.innerWidth * 0.30,
      duration: 7, ease: 'power1.out',
    }, 56)
      .to(asteroidRefs.current[4], {
        x: () => -window.innerWidth * 0.68,
        y: 40,
        duration: 13, ease: 'none',
      }, 63)
      .to(asteroidRefs.current[4], {
        opacity: 0,
        x: () => -window.innerWidth * 0.82,
        duration: 5, ease: 'power1.in',
      }, 71);

    // ── [55–72] MOON GROWS ────────────────────────────────────────────────────
    tl.to(moonRef.current, { opacity: 1, scale: 0.50, duration: 17, ease: 'power2.out' }, 55);
    tl.to(rocketWrapRef.current, {
      y: () => -(window.innerHeight * 1.05),
      x: 0, duration: 17, ease: 'none',
    }, 55);

    // ── [62–68] BOOSTER RETRO-BURN ────────────────────────────────────────────
    tl.to(retroBurnRef.current, { opacity: 1, scaleY: 2.2, duration: 6, ease: 'power2.out' }, 62)
      .to(boosterWrapRef.current, {
        y: () => -(window.innerHeight * 0.55) + window.innerHeight * 0.68,
        x: -14, duration: 6, ease: 'power4.out',
      }, 62);

    // ── [67–70] BOOSTER TOUCHDOWN ─────────────────────────────────────────────
    boosterLegRefs.current.forEach((leg, i) => {
      if (!leg) return;
      tl.to(leg, {
        scaleY: 1, rotate: i % 2 === 0 ? -36 : 36,
        x: i % 2 === 0 ? -14 : 14, duration: 3, ease: 'power3.out',
      }, 67);
    });
    tl.to(boosterWrapRef.current, {
      y: () => -(window.innerHeight * 0.55) + window.innerHeight * 0.76,
      duration: 3, ease: 'power4.out',
    }, 67)
      .to(retroBurnRef.current, { opacity: 0, scaleY: 0.2, duration: 2, ease: 'power2.in' }, 68.5)
      .to(boosterTrailRef.current, { opacity: 0, duration: 2, ease: 'none' }, 68.5);

    // ── [72–90] PROJECT SATELLITES — fade orbital network in/out with Moon ───
    // CSS handles continuous rotation; GSAP only controls visibility.
    // Satellites are staggered slightly so they don't all appear at once.
    satelliteRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.to(el, { opacity: 1, duration: 5, ease: 'power2.out' }, 72 + i * 1.5);
      tl.to(el, { opacity: 0, duration: 4, ease: 'power2.in'  }, 88);
    });

    // ── [72–78] MOON APPROACH + LANDING ──────────────────────────────────────
    tl.to(moonRef.current, { scale: 1.0, opacity: 1, duration: 6, ease: 'power2.out' }, 72);
    tl.to(rocketWrapRef.current, {
      y: () => -(window.innerHeight * 0.5 - 170),
      x: 400, rotate: 3, duration: 6, ease: 'power4.out',
    }, 72);
    tl.to(exhaustRef.current, { opacity: 1, scaleY: 2.8, scaleX: 0.95, duration: 3, ease: 'none' }, 72)
      .to(exhaustRef.current, { opacity: 0, scaleY: 0.3, duration: 3, ease: 'power2.in' }, 75);
    tl.to(vaporTrailRef.current, { opacity: 0, duration: 3, ease: 'power2.in' }, 75);
    rocketLegRefs.current.forEach((leg, i) => {
      if (!leg) return;
      tl.to(leg, {
        scaleY: 1, rotate: i % 2 === 0 ? -38 : 38,
        x: i % 2 === 0 ? -14 : 14, duration: 3, ease: 'power3.out',
      }, 75);
    });

    // ── [78–88] MOON SURFACE — STATIC HOLD ───────────────────────────────────

    // ── [88–92] RETURN LAUNCH FROM MOON ──────────────────────────────────────
    rocketLegRefs.current.forEach((leg) => {
      if (!leg) return;
      tl.to(leg, { scaleY: 0, rotate: 0, x: 0, duration: 2, ease: 'power2.in' }, 88);
    });
    tl.to(rocketWrapRef.current, { rotate: 180, duration: 3, ease: 'power2.inOut' }, 88);
    tl.to(moonRef.current, { scale: 0.10, opacity: 0, duration: 9, ease: 'power2.in' }, 88);
    tl.to(exhaustRef.current, { opacity: 1, scaleY: 3.0, scaleX: 0.8, duration: 2, ease: 'power4.out' }, 89.5)
      .to(vaporTrailRef.current, { opacity: 0.75, duration: 2, ease: 'power2.out' }, 89.5);
    tl.to(rocketWrapRef.current, {
      y: () => -(window.innerHeight * 0.5 - 170) - window.innerHeight * 0.35,
      x: 80, duration: 4, ease: 'power3.in',
    }, 90);

    // ── [92–95] MARS GROWS ────────────────────────────────────────────────────
    tl.to(marsRef.current, { opacity: 1, scale: 0.48, duration: 3, ease: 'power2.out' }, 92);
    tl.to(rocketWrapRef.current, {
      y: () => -(window.innerHeight * 1.05),
      x: 0, duration: 3, ease: 'none',
    }, 92);

    // ── [95–97] MARS APPROACH + LANDING ──────────────────────────────────────
    tl.to(marsRef.current, { scale: 1.0, opacity: 1, duration: 2, ease: 'power2.out' }, 95);
    // Rotate from 180° back to upright for landing, decelerate
    tl.to(rocketWrapRef.current, {
      rotate: -3,
      y: () => -(window.innerHeight * 0.5 - 170),
      x: -380, duration: 2, ease: 'power4.out',
    }, 95);
    tl.to(exhaustRef.current, { opacity: 1, scaleY: 2.4, scaleX: 0.95, duration: 1, ease: 'none' }, 95)
      .to(exhaustRef.current, { opacity: 0, scaleY: 0.3, duration: 1, ease: 'power2.in' }, 96);
    tl.to(vaporTrailRef.current, { opacity: 0, duration: 1.5, ease: 'power2.in' }, 95.5);
    // Mars landing legs deploy
    rocketLegRefs.current.forEach((leg, i) => {
      if (!leg) return;
      tl.to(leg, {
        scaleY: 1, rotate: i % 2 === 0 ? -38 : 38,
        x: i % 2 === 0 ? -14 : 14, duration: 1.5, ease: 'power3.out',
      }, 96);
    });

    // ── [97–98] MARS SURFACE — STATIC HOLD ───────────────────────────────────
    // (MarsPanel content overlay shows here)

    // ── [98–99] RETURN LAUNCH FROM MARS ──────────────────────────────────────
    rocketLegRefs.current.forEach((leg) => {
      if (!leg) return;
      tl.to(leg, { scaleY: 0, rotate: 0, x: 0, duration: 1, ease: 'power2.in' }, 98);
    });
    tl.to(rocketWrapRef.current, { rotate: 180, duration: 1.5, ease: 'power2.inOut' }, 98);
    tl.to(marsRef.current, { scale: 0.06, opacity: 0, duration: 3, ease: 'power2.in' }, 98);
    tl.to(exhaustRef.current, { opacity: 1, scaleY: 3.0, scaleX: 0.8, duration: 1, ease: 'power4.out' }, 98.6)
      .to(vaporTrailRef.current, { opacity: 0.70, duration: 1, ease: 'power2.out' }, 98.6);
    tl.to(rocketWrapRef.current, {
      y: () => -(window.innerHeight * 0.5 - 170) - window.innerHeight * 0.3,
      x: -60, duration: 1.4, ease: 'power3.in',
    }, 99);

    // ── [99–100] EARTH APPROACH — planet dominates the lower screen ──────────
    // Earth scales large so it visually fills the bottom half of the viewport.
    // ContactPanel gradient fades to transparent at bottom so Earth is clearly seen.
    tl.to(earthRef.current, { scale: 1.20, opacity: 1, duration: 1.5, ease: 'power2.out' }, 99);
    // Rocket descends nose-down toward Earth — visible in the upper portion of screen
    tl.to(rocketWrapRef.current, {
      y: () => -(window.innerHeight * 0.10),
      x: -30, rotate: 180, duration: 2.0, ease: 'power3.out',
    }, 99);
    tl.to(exhaustRef.current,    { opacity: 0, duration: 0.8, ease: 'power2.in' }, 99)
      .to(vaporTrailRef.current, { opacity: 0, duration: 0.8, ease: 'power2.in' }, 99);
  });

  // Mouse parallax — planets shift with cursor for cockpit-window depth
  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      const pf = pxFns.current;
      pf.earthX?.(nx * -22);
      pf.earthY?.(ny * -16);
      pf.moonX?.(nx * -28);
      pf.moonY?.(ny * -20);
      pf.marsX?.(nx * -24);
      pf.marsY?.(ny * -18);
    };
    window.addEventListener('mousemove', onMouse);
    return () => window.removeEventListener('mousemove', onMouse);
  }, []);

  return (
    <div
      className="space-journey-layer"
      style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}
    >
      <style>{`
        @media (max-width: 768px) { .space-journey-layer { display: none !important; } }

        @keyframes exhaustFlicker {
          from { transform: translateX(-50%) scaleX(1)    scaleY(1);    opacity: 0.92; }
          to   { transform: translateX(-50%) scaleX(1.20) scaleY(0.86); opacity: 1;   }
        }
        @keyframes retroFlicker {
          from { transform: translateX(-50%) scaleX(1)    scaleY(1);    opacity: 0.88; }
          to   { transform: translateX(-50%) scaleX(1.14) scaleY(1.10); opacity: 1;    }
        }
        @keyframes heatPulse {
          from { opacity: 0.72; filter: blur(7px); }
          to   { opacity: 1.00; filter: blur(10px); }
        }

        /* Asteroid slow tumble — each has unique speed & direction */
        @keyframes rockSpin0 { from { transform: rotate(0deg); }    to { transform: rotate(360deg); }   }
        @keyframes rockSpin1 { from { transform: rotate(0deg); }    to { transform: rotate(-360deg); }  }
        @keyframes rockSpin2 { from { transform: rotate(20deg); }   to { transform: rotate(380deg); }   }
        @keyframes rockSpin3 { from { transform: rotate(-15deg); }  to { transform: rotate(-375deg); }  }
        @keyframes rockSpin4 { from { transform: rotate(10deg); }   to { transform: rotate(370deg); }   }

        /* Label shimmer */
        @keyframes labelShimmer {
          0%, 100% { text-shadow: 0 0 10px rgba(0,200,255,0.55), 0 0 22px rgba(0,100,255,0.30); }
          50%       { text-shadow: 0 0 14px rgba(0,220,255,0.80), 0 0 30px rgba(0,120,255,0.45); }
        }

        /* Satellite orbital motion */
        @keyframes satOrbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        /* Counter-rotate so satellite body + label stay upright */
        @keyframes satCounterOrbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        /* Orbit trail dot pulse */
        @keyframes satCorePulse {
          0%, 100% { opacity: 0.70; }
          50%       { opacity: 1.00; }
        }

        /* ── Satellite hover: pause orbit + reveal project details ── */
        /* Orbit pausing is controlled via JS (.paused class) for reliability */
        .sat-orbit.paused {
          animation-play-state: paused !important;
        }
        .sat-orbit.paused .sat-counter {
          animation-play-state: paused !important;
        }
        .sat-hitbox.active .sat-body,
        .sat-hitbox:hover .sat-body {
          filter: drop-shadow(0 0 14px currentColor) !important;
          transform: scale(1.15);
        }
        .sat-hitbox.active .sat-card,
        .sat-hitbox:hover .sat-card {
          min-width: 320px !important;
          border-color: rgba(200,220,255,0.35) !important;
          box-shadow: 0 0 24px rgba(200,255,0,0.12), 0 0 48px rgba(0,229,255,0.06);
        }
        .sat-hitbox.active .sat-desc,
        .sat-hitbox:hover .sat-desc {
          max-height: 280px !important;
          opacity: 1 !important;
          margin-top: 6px !important;
        }
      `}</style>

      <EarthSphere earthRef={earthRef} />
      <MoonSphere  moonRef={moonRef} />
      <MarsSphere  marsRef={marsRef} />

      {/* ── Company asteroids (float through deep space 44–73%) ── */}
      {COMPANIES.map((c, i) => (
        <div
          key={c.name}
          ref={(el) => { asteroidRefs.current[i] = el; }}
          style={{
            position: 'fixed',
            left: c.cssLeft as string | number,
            top:  c.cssTop  as string | number,
            width:  c.size,
            height: c.size,
            opacity: 0,
            willChange: 'transform, opacity',
            zIndex: 2,
          }}
        >
          {/* Label card — floats above the rock */}
          <div style={{
            position: 'absolute',
            bottom: 'calc(100% + 12px)',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            padding: '9px 16px 8px',
            background: 'rgba(4, 8, 20, 0.72)',
            border: '1px solid rgba(0, 200, 255, 0.22)',
            borderRadius: 6,
            backdropFilter: 'blur(6px)',
          }}>
            {/* Cyan signal dot */}
            <div style={{
              position: 'absolute',
              top: -4, left: '50%',
              transform: 'translateX(-50%)',
              width: 6, height: 6,
              borderRadius: '50%',
              background: 'rgba(0, 220, 255, 0.8)',
              boxShadow: '0 0 8px rgba(0,200,255,0.9)',
            }} />
            {/* Company name */}
            <span style={{
              fontSize: 13,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(190, 215, 245, 0.95)',
              animation: 'labelShimmer 3s ease-in-out infinite',
              fontFamily: 'inherit',
              fontWeight: 700,
            }}>
              {c.name}
            </span>
            {/* Divider */}
            <div style={{ width: '80%', height: 1, background: 'rgba(0,200,255,0.18)' }} />
            {/* Role */}
            <span style={{
              fontSize: 11,
              letterSpacing: '0.12em',
              color: 'rgba(150, 195, 240, 0.80)',
              fontFamily: 'inherit',
            }}>
              {c.role}
            </span>
            {/* Period */}
            <span style={{
              fontSize: 10,
              letterSpacing: '0.18em',
              color: 'rgba(110, 165, 210, 0.60)',
              fontFamily: 'monospace',
            }}>
              {c.period}
            </span>
          </div>

          {/* Rock body — slow CSS tumble */}
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: c.shape,
            background: c.gradient,
            boxShadow: `inset -${c.size * 0.14}px -${c.size * 0.14}px ${c.size * 0.28}px rgba(0,0,0,0.75), 0 0 20px rgba(0,0,0,0.5)`,
            animation: `rockSpin${i} ${c.spinDur}s linear infinite`,
          }}>
            {/* Rock surface detail — lighter highlight on lit face */}
            <div style={{
              width: '100%', height: '100%',
              borderRadius: 'inherit',
              background: 'radial-gradient(circle at 30% 28%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 30%, transparent 60%)',
            }} />
          </div>
        </div>
      ))}

      {/* ── Project satellites — orbit Moon (72–90%) ── */}
      {/*
        Layout: each satellite is anchored at Moon center (50%, 50%).
        The "orbit ring" div rotates continuously via CSS animation.
        The "translate" child moves to orbital radius.
        The "counter" child counter-rotates to keep body + label upright.
      */}
      {SATELLITES.map((s, i) => {
        const delay = `-${(s.startAngle / 360) * s.orbitSpeed}s`;
        return (
          <div
            key={s.id}
            ref={(el) => { satelliteRefs.current[i] = el; }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              width: 0, height: 0,
              opacity: 0,
              zIndex: 3,
              willChange: 'opacity',
            }}
          >
            <div
              className="sat-orbit"
              style={{
                position: 'absolute', top: 0, left: 0,
                width: 0, height: 0,
                animation: `satOrbit ${s.orbitSpeed}s linear infinite`,
                animationDelay: delay,
              }}
            >
              <div style={{
                position: 'absolute',
                left: s.orbitRadius,
                top: 0,
                transform: 'translate(-50%, -50%)',
              }}>
                <div
                  className="sat-counter"
                  style={{
                    animation: `satCounterOrbit ${s.orbitSpeed}s linear infinite`,
                    animationDelay: delay,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {/* Interactive hover zone — pointer events enabled here */}
                  <div
                    className="sat-hitbox"
                    data-cursor="view"
                    style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
                  >
                    {/* ── Satellite body ── */}
                    <svg
                      width="48" height="32"
                      viewBox="0 0 48 32"
                      fill="none"
                      className="sat-body"
                      style={{ filter: `drop-shadow(0 0 6px ${s.accent}88)`, transition: 'filter 0.3s, transform 0.3s' }}
                    >
                      <rect x="0" y="10" width="14" height="12" rx="1"
                        fill={`${s.accent}55`} stroke={s.accent} strokeWidth="0.8" />
                      <line x1="7"  y1="10" x2="7"  y2="22" stroke={`${s.accent}88`} strokeWidth="0.5" />
                      <line x1="3"  y1="10" x2="3"  y2="22" stroke={`${s.accent}44`} strokeWidth="0.5" />
                      <line x1="11" y1="10" x2="11" y2="22" stroke={`${s.accent}44`} strokeWidth="0.5" />

                      <rect x="15" y="9" width="18" height="14" rx="2"
                        fill="rgba(20,24,40,0.95)" stroke={`${s.accent}88`} strokeWidth="1" />
                      <rect x="19" y="13" width="10" height="6" rx="1"
                        fill={s.accent} opacity="0.90"
                        style={{ animation: `satCorePulse ${2 + i * 0.3}s ease-in-out infinite` }}
                      />
                      {s.type === 'comms' && (
                        <>
                          <line x1="24" y1="9" x2="24" y2="3" stroke={s.accent} strokeWidth="1" />
                          <circle cx="24" cy="2.5" r="1.5" fill={s.accent} />
                        </>
                      )}
                      {s.type === 'telescope' && (
                        <>
                          <rect x="22" y="5" width="4" height="4" rx="0.5"
                            fill="none" stroke={s.accent} strokeWidth="0.8" />
                          <line x1="24" y1="9" x2="24" y2="5" stroke={s.accent} strokeWidth="0.8" />
                        </>
                      )}

                      <rect x="34" y="10" width="14" height="12" rx="1"
                        fill={`${s.accent}55`} stroke={s.accent} strokeWidth="0.8" />
                      <line x1="41" y1="10" x2="41" y2="22" stroke={`${s.accent}88`} strokeWidth="0.5" />
                      <line x1="37" y1="10" x2="37" y2="22" stroke={`${s.accent}44`} strokeWidth="0.5" />
                      <line x1="45" y1="10" x2="45" y2="22" stroke={`${s.accent}44`} strokeWidth="0.5" />
                    </svg>

                    {/* ── Label + expandable details card ── */}
                    <div
                      className="sat-card"
                      style={{
                        padding: '7px 11px 6px',
                        background: 'rgba(3, 5, 16, 0.88)',
                        border: `1px solid ${s.accent}44`,
                        borderTop: `1.5px solid ${s.accent}`,
                        borderRadius: 6,
                        backdropFilter: 'blur(8px)',
                        textAlign: 'center',
                        minWidth: 140,
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'min-width 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
                      }}
                    >
                      <div style={{
                        fontSize: 9, letterSpacing: '0.30em', fontFamily: 'monospace',
                        color: s.accent, fontWeight: 700, marginBottom: 3,
                        textShadow: `0 0 6px ${s.accent}88`,
                      }}>
                        SAT-{s.id} · {s.year}
                      </div>
                      <div style={{
                        fontSize: 12, fontWeight: 700, letterSpacing: '0.03em',
                        color: 'rgba(215,225,255,0.95)', fontFamily: 'inherit',
                        marginBottom: 5,
                      }}>
                        {s.title}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
                        {s.tags.map((tag) => (
                          <span key={tag} style={{
                            fontSize: 9, padding: '1px 6px', letterSpacing: '0.10em',
                            border: `1px solid ${s.accent}33`,
                            color: s.accent, borderRadius: 3,
                            background: `${s.accent}0d`,
                            fontFamily: 'inherit',
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* ── Project description (hidden, revealed on hover) ── */}
                      <div className="sat-desc" style={{
                        maxHeight: 0, opacity: 0, overflowY: 'auto', overflowX: 'hidden', marginTop: 0,
                        transition: 'max-height 0.4s ease, opacity 0.35s ease, margin-top 0.3s ease',
                        scrollbarWidth: 'thin',
                        scrollbarColor: `${s.accent}44 transparent`,
                        pointerEvents: 'auto',
                      }}>
                        <div style={{ height: 1, background: `${s.accent}22`, marginBottom: 6 }} />
                        {s.desc.split('\n\n').map((para, pi) => (
                          <p key={pi} style={{
                            fontSize: 11, lineHeight: 1.65, letterSpacing: '0.02em',
                            color: 'rgba(190,205,240,0.85)', fontFamily: 'inherit',
                            textAlign: 'left', margin: 0,
                            marginBottom: pi < s.desc.split('\n\n').length - 1 ? 8 : 0,
                          }}>
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Vapor trail */}
      <div
        ref={vaporTrailRef}
        style={{
          position: 'fixed',
          width: 7,
          bottom: 148,
          left: '50%',
          marginLeft: -3.5,
          height: '145vh',
          transformOrigin: 'bottom center',
          background: [
            'linear-gradient(to bottom,',
            '  rgba(200,255,0,0.01) 0%,',
            '  rgba(0,229,255,0.38) 38%,',
            '  rgba(0,229,255,0.62) 62%,',
            '  rgba(255,160,60,0.78) 84%,',
            '  rgba(255,100,20,0.95) 100%',
            ')',
          ].join(' '),
          filter: 'blur(3px)',
          borderRadius: 4,
          opacity: 0,
        }}
      />

      {/* Booster descent trail */}
      <div
        ref={boosterTrailRef}
        style={{
          position: 'fixed', width: 3, bottom: 148,
          left: 'calc(50% - 65px)',
          height: '50vh',
          borderLeft: '2px dashed rgba(0,229,255,0.16)',
          opacity: 0,
        }}
      />

      {/* Stage separation flash */}
      <div
        ref={separationFlashRef}
        style={{
          position: 'fixed', width: 90, height: 90, borderRadius: '50%',
          left: '50%', top: '10%', marginLeft: -45, marginTop: -45,
          background: 'radial-gradient(circle, rgba(200,255,0,0.95) 0%, rgba(0,229,255,0.60) 40%, transparent 70%)',
          filter: 'blur(8px)', opacity: 0, willChange: 'transform, opacity',
        }}
      />

      {/* Rocket */}
      <div
        ref={rocketWrapRef}
        style={{
          position: 'fixed', bottom: 148, left: '50%', marginLeft: -20,
          width: 40, height: 118, willChange: 'transform, opacity',
        }}
      >
        <RocketSVG />

        <div
          ref={exhaustRef}
          style={{
            position: 'absolute', bottom: -44, left: '50%',
            transform: 'translateX(-50%)',
            width: 28, height: 52, borderRadius: '0 0 50% 50%',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(200,255,0,0.97) 0%, rgba(255,160,0,0.72) 26%, rgba(255,60,0,0.44) 58%, transparent 100%)',
            filter: 'blur(4px)', opacity: 0,
            animation: 'exhaustFlicker 0.10s ease-in-out infinite alternate',
          }}
        />

        <div
          ref={heatShieldRef}
          style={{
            position: 'absolute', top: -28, left: '50%', marginLeft: -34,
            width: 68, height: 32,
            background: 'radial-gradient(ellipse at 50% 100%, rgba(255,130,30,0.95) 0%, rgba(255,60,0,0.62) 38%, rgba(255,30,0,0.28) 68%, transparent 100%)',
            filter: 'blur(8px)', opacity: 0,
            animation: 'heatPulse 0.09s ease-in-out infinite alternate',
          }}
        />

        {[0, 1, 2, 3].map((i) => {
          const isLeft = i % 2 === 0;
          return (
            <div
              key={`rl-${i}`}
              ref={(el) => { rocketLegRefs.current[i] = el; }}
              style={{
                position: 'absolute', bottom: 0,
                left: isLeft ? 8 : undefined, right: isLeft ? undefined : 8,
                width: 2.5, height: 18, background: '#c8d0e0',
                transformOrigin: 'top center', transform: 'scaleY(0)',
                borderRadius: 1, opacity: i < 2 ? 1 : 0.55,
              }}
            />
          );
        })}
      </div>

      {/* Booster */}
      <div
        ref={boosterWrapRef}
        style={{
          position: 'fixed', bottom: 148,
          left: 'calc(50% - 65px)', marginLeft: -17,
          width: 34, height: 90, opacity: 0, willChange: 'transform, opacity',
        }}
      >
        <BoosterSVG />

        {[0, 1, 2, 3].map((i) => {
          const isLeft = i % 2 === 0;
          return (
            <div
              key={`bl-${i}`}
              ref={(el) => { boosterLegRefs.current[i] = el; }}
              style={{
                position: 'absolute', bottom: 0,
                left: isLeft ? 7 : undefined, right: isLeft ? undefined : 7,
                width: 2, height: 18, background: '#c8d0e0',
                transformOrigin: 'top center', transform: 'scaleY(0)',
                borderRadius: 1, opacity: i < 2 ? 1 : 0.55,
              }}
            />
          );
        })}

        <div
          ref={retroBurnRef}
          style={{
            position: 'absolute', top: -38, left: '50%',
            transform: 'translateX(-50%)',
            width: 22, height: 36, borderRadius: '0 0 50% 50%',
            background: 'radial-gradient(ellipse at 50% 100%, rgba(200,255,0,0.94) 0%, rgba(255,140,0,0.62) 34%, rgba(255,40,0,0.32) 64%, transparent 100%)',
            filter: 'blur(4px)', opacity: 0,
            animation: 'retroFlicker 0.12s ease-in-out infinite alternate',
          }}
        />
      </div>
    </div>
  );
}
