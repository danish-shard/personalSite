import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useMagnet } from '../../hooks/useMagnet';

gsap.registerPlugin(ScrollTrigger);

// ─── Shared data ─────────────────────────────────────────────────────────────

const STATS = [
  { value: '3+',  label: 'Years Building' },
  { value: '12+', label: 'Projects Shipped' },
  { value: '∞',   label: 'Cups of Coffee' },
  { value: '1',   label: 'Obsession: Quality' },
];

const TAGS = [
  'React', 'TypeScript', 'Node.js', 'Three.js', 'GSAP', 'AI / LLMs', 'MCP Protocol', 'MongoDB', 'Tailwind', 'Vite',
  'React', 'TypeScript', 'Node.js', 'Three.js', 'GSAP', 'AI / LLMs', 'MCP Protocol', 'MongoDB', 'Tailwind', 'Vite',
];


const SKILLS_CATEGORIES = [
  {
    label: 'Frontend',
    color: '#c8ff00',
    items: ['React', 'TypeScript', 'GSAP', 'Three.js', 'Tailwind CSS', 'Next.js', 'Vite'],
  },
  {
    label: 'Backend',
    color: '#00e5ff',
    items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs', 'WebSockets'],
  },
  {
    label: 'AI / LLMs',
    color: '#9b6dff',
    items: ['MCP Protocol', 'LLM Integration', 'Prompt Engineering', 'OpenAI API', 'Chatbots'],
  },
  {
    label: 'Tools',
    color: '#ff6b9d',
    items: ['Git', 'Docker', 'Chrome Extensions', 'Figma', 'AWS', 'Linux'],
  },
];

const SOCIALS = [
  { label: 'GitHub',   href: 'https://github.com/danishshard',        color: '#e8e4ff' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/danishshard',    color: '#00e5ff' },
  { label: 'Twitter',  href: 'https://twitter.com/danishshard',        color: '#9b6dff' },
];

// ─── Inline styles ────────────────────────────────────────────────────────────

const panelBase: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 10,
  opacity: 0,
  pointerEvents: 'none',
  overflowY: 'auto',
};

// ─── EarthPanel ───────────────────────────────────────────────────────────────

function EarthPanel({ ref: panelRef }: { ref: React.RefObject<HTMLDivElement | null> }) {
  const ctaRef = useMagnet<HTMLAnchorElement>();

  return (
    <div ref={panelRef} style={panelBase}>
      {/* Nebula glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 15% 55%, rgba(155,109,255,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 85% 30%, rgba(0,229,255,0.04) 0%, transparent 70%)
          `,
        }}
      />

      <div className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 max-w-6xl mx-auto py-24">
        {/* Eyebrow */}
        <p className="text-xs tracking-[0.5em] uppercase mb-6" style={{ color: 'var(--nebula-cyan)' }}>
          Mission Control — Earth
        </p>

        {/* Name */}
        <h1
          className="font-display leading-[0.88] mb-6 select-none glow-text"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', color: 'var(--fg)' }}
        >
          Danish<br />
          <span className="text-gradient">Shard</span>
        </h1>

        {/* Tagline */}
        <p className="text-base md:text-lg tracking-wide mb-10" style={{ color: 'var(--muted)' }}>
          Creative Developer&nbsp;&nbsp;·&nbsp;&nbsp;Full-Stack&nbsp;&nbsp;·&nbsp;&nbsp;AI
        </p>

        {/* Bio + Stats */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="glass glass-highlight px-8 py-7 space-y-4">
            <p className="text-2xl md:text-3xl leading-tight font-light" style={{ color: 'var(--fg)' }}>
              I build digital products at the intersection of{' '}
              <em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>design, engineering,</em>{' '}
              and <em style={{ color: 'var(--nebula-cyan)', fontStyle: 'normal' }}>AI</em>.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Based in Bangalore — full-stack applications with React, Node.js, TypeScript, and AI-powered backends.
              Consumer products, SaaS platforms, and experimental creative projects.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {STATS.map(({ value, label }) => (
              <div key={label} className="glass glass-highlight p-6 flex flex-col gap-1">
                <span className="font-display text-3xl glow-text" style={{ color: 'var(--accent)' }}>
                  {value}
                </span>
                <span className="text-xs tracking-wider uppercase" style={{ color: 'var(--muted)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-6">
          <a
            ref={ctaRef}
            href="#scroll-to-launch"
            data-cursor="link"
            className="glass glass-glow inline-flex items-center gap-3 font-display text-sm tracking-[0.2em] uppercase px-8 py-4 transition-all duration-300"
            style={{ color: 'var(--accent)', textDecoration: 'none' }}
            onClick={(e) => { e.preventDefault(); window.scrollBy({ top: window.innerHeight * 1.5, behavior: 'smooth' }); }}
          >
            Scroll to Launch
            <span style={{ animation: 'ctaBounce 2s ease-in-out infinite' }}>↓</span>
          </a>
        </div>
      </div>

      {/* Skills marquee */}
      <div className="glass overflow-hidden py-4 sticky bottom-0" style={{ borderRadius: 0 }}>
        <div className="animate-marquee whitespace-nowrap" style={{ display: 'inline-block' }}>
          {TAGS.map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-6 mx-6">
              <span className="text-sm tracking-widest uppercase" style={{ color: 'var(--muted)' }}>{tag}</span>
              <span style={{ color: 'var(--nebula-cyan)', fontSize: 8 }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ctaBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
      `}</style>
    </div>
  );
}

// ─── MarsPanel ────────────────────────────────────────────────────────────────

function MarsPanel({ ref: panelRef }: { ref: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={panelRef} style={panelBase}>
      {/* Mars dust glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 60% 40% at 50% 60%, rgba(180,80,30,0.08) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 60% at 20% 30%, rgba(155,109,255,0.04) 0%, transparent 70%)',
          ].join(', '),
        }}
      />

      <div className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 max-w-6xl mx-auto py-24">
        {/* Section label */}
        <p className="text-xs tracking-[0.5em] uppercase mb-4" style={{ color: '#d4704a' }}>
          Mars Base Alpha — Mission Payload
        </p>

        <h2
          className="font-display leading-tight mb-4"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', color: 'var(--fg)' }}
        >
          The{' '}
          <span style={{
            background: 'linear-gradient(90deg, #d4704a, #ff9060)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Stack
          </span>
        </h2>

        <p className="text-base leading-relaxed mb-12" style={{ color: 'var(--muted)', maxWidth: 520 }}>
          Tools, frameworks, and technologies I use to build products that work at scale.
        </p>

        <div className="grid md:grid-cols-2 gap-5">
          {SKILLS_CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              className="glass glass-highlight p-6 space-y-4"
              style={{ borderTop: `2px solid ${cat.color}55` }}
            >
              {/* Category header */}
              <div className="flex items-center gap-3">
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: cat.color,
                  boxShadow: `0 0 8px ${cat.color}99`,
                }} />
                <span
                  className="font-display text-xs tracking-[0.3em] uppercase"
                  style={{ color: cat.color }}
                >
                  {cat.label}
                </span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {cat.items.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm px-3 py-1 tracking-wide"
                    style={{
                      background: `${cat.color}0d`,
                      border: `1px solid ${cat.color}33`,
                      color: 'var(--fg)',
                      borderRadius: 5,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ContactPanel — Deep Space Comms Terminal ─────────────────────────────────

function ContactPanel({ ref: panelRef }: { ref: React.RefObject<HTMLDivElement | null> }) {
  const btnRef = useMagnet<HTMLButtonElement>();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({ callsign: '', freq: '', transmission: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('http://localhost:8000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.callsign, email: form.freq, message: form.transmission }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setForm({ callsign: '', freq: '', transmission: '' });
    } catch {
      setStatus('error');
    }
  };

  const TERM = '"Courier New", Courier, monospace';
  const G = (a: number) => `rgba(0,255,100,${a})`;  // phosphor green helper

  const termInput: React.CSSProperties = {
    background: 'rgba(0, 16, 6, 0.90)',
    border: `1px solid ${G(0.35)}`,
    borderRadius: 3,
    color: '#b0ffd4',
    width: '100%',
    padding: '12px 16px 12px 30px',
    fontSize: '1.05rem',
    outline: 'none',
    fontFamily: TERM,
    letterSpacing: '0.05em',
    transition: 'border-color 0.25s, box-shadow 0.25s',
  };

  return (
    <div
      ref={panelRef}
      style={{
        ...panelBase,
        // Gradient: opaque at top (form readable) → nearly transparent at bottom (Earth shows through)
        background: 'linear-gradient(to bottom, rgba(0,8,3,0.88) 0%, rgba(0,6,2,0.75) 45%, rgba(0,4,1,0.30) 72%, transparent 100%)',
      }}
    >
      {/* CRT scanlines — only in the upper readable zone */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            `repeating-linear-gradient(0deg, transparent, transparent 3px, ${G(0.016)} 3px, ${G(0.016)} 4px)`,
          maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 85%)',
          zIndex: 1,
        }}
      />
      {/* Earth atmosphere bleed — blue glow rising from below */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 40% at 50% 105%, rgba(30,100,255,0.22) 0%, rgba(0,60,180,0.10) 50%, transparent 75%)',
          zIndex: 1,
        }}
      />
      {/* Green signal glow in upper half */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          background: `radial-gradient(ellipse 60% 35% at 50% 20%, ${G(0.06)} 0%, transparent 70%)`,
          zIndex: 1,
        }}
      />

      <div
        className="relative px-8 md:px-16 max-w-5xl mx-auto pt-20 pb-10"
        style={{ zIndex: 2 }}
      >
        {/* Terminal header */}
        <div className="mb-10">
          <p
            style={{
              fontFamily: TERM,
              fontSize: '0.88rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#00ff88',
              marginBottom: 10,
              textShadow: '0 0 14px rgba(0,255,100,0.55)',
            }}
          >
            ■ COMMS TERMINAL · OUTBOUND TRANSMISSION
          </p>
          <div
            style={{
              height: 1,
              background: 'linear-gradient(to right, rgba(0,255,100,0.60), transparent)',
              marginBottom: 10,
            }}
          />
          <p
            style={{
              fontFamily: TERM,
              fontSize: '0.80rem',
              letterSpacing: '0.18em',
              color: G(0.55),
            }}
          >
            SIGNAL STRENGTH: ████░░░░ 47% &nbsp;·&nbsp; CARRIER: 2.4 GHz &nbsp;·&nbsp; STATUS: STANDBY
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Left — mission status panel */}
          <div
            className="md:col-span-2 p-6 space-y-6"
            style={{
              background: 'rgba(0, 14, 6, 0.85)',
              border: `1px solid ${G(0.30)}`,
              borderRadius: 4,
              fontFamily: TERM,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '0.78rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: G(0.70),
                  marginBottom: 10,
                }}
              >
                MISSION STATUS
              </p>
              <p style={{ color: '#80ffb8', fontSize: '1.0rem', lineHeight: 2.0 }}>
                › CRAFT: DS-01 PERSONAL<br />
                › POSITION: DEEP SPACE<br />
                › VELOCITY: 28,000 km/h<br />
                › DIST FROM EARTH: 78M km
              </p>
            </div>

            <div style={{ height: 1, background: G(0.20) }} />

            <div>
              <p
                style={{
                  fontSize: '0.78rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: G(0.70),
                  marginBottom: 10,
                }}
              >
                DIRECT CHANNEL
              </p>
              <a
                href="mailto:hello@danishshard.dev"
                data-cursor="link"
                style={{ color: '#c8ff00', fontSize: '0.95rem', textDecoration: 'none', letterSpacing: '0.04em' }}
              >
                hello@danishshard.dev ↗
              </a>
            </div>

            <div style={{ height: 1, background: G(0.20) }} />

            <div>
              <p
                style={{
                  fontSize: '0.78rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: G(0.70),
                  marginBottom: 10,
                }}
              >
                FREQUENCIES
              </p>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  style={{
                    display: 'block',
                    color: G(0.65),
                    fontSize: '0.92rem',
                    textDecoration: 'none',
                    lineHeight: 2.2,
                    letterSpacing: '0.1em',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = s.color)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = G(0.65))}
                >
                  › {s.label} ↗
                </a>
              ))}
            </div>

            {/* Footer credit at bottom of status panel */}
            <div style={{ height: 1, background: G(0.20) }} />
            <p
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                color: G(0.45),
                fontFamily: TERM,
              }}
            >
              DANISH SHARD · {new Date().getFullYear()}<br />
              ALL SYSTEMS NOMINAL
            </p>
          </div>

          {/* Right — transmission form */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* CALLSIGN */}
              <div>
                <p
                  style={{
                    fontFamily: TERM,
                    fontSize: '0.80rem',
                    letterSpacing: '0.28em',
                    color: G(0.72),
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  CALLSIGN
                </p>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: G(0.70),
                      fontFamily: TERM,
                      fontSize: '0.85rem',
                      pointerEvents: 'none',
                    }}
                  >›</span>
                  <input
                    type="text"
                    required
                    value={form.callsign}
                    onChange={(e) => setForm((f) => ({ ...f, callsign: e.target.value }))}
                    placeholder="your-name"
                    style={termInput}
                    onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = G(0.65); (e.target as HTMLInputElement).style.boxShadow = `0 0 10px ${G(0.12)}`; }}
                    onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = G(0.35); (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* FREQUENCY */}
              <div>
                <p
                  style={{
                    fontFamily: TERM,
                    fontSize: '0.80rem',
                    letterSpacing: '0.28em',
                    color: G(0.72),
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  FREQUENCY (EMAIL)
                </p>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: G(0.70),
                      fontFamily: TERM,
                      fontSize: '0.85rem',
                      pointerEvents: 'none',
                    }}
                  >›</span>
                  <input
                    type="email"
                    required
                    value={form.freq}
                    onChange={(e) => setForm((f) => ({ ...f, freq: e.target.value }))}
                    placeholder="you@domain.com"
                    style={termInput}
                    onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = G(0.65); (e.target as HTMLInputElement).style.boxShadow = `0 0 10px ${G(0.12)}`; }}
                    onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = G(0.35); (e.target as HTMLInputElement).style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* TRANSMISSION */}
              <div>
                <p
                  style={{
                    fontFamily: TERM,
                    fontSize: '0.80rem',
                    letterSpacing: '0.28em',
                    color: G(0.72),
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  TRANSMISSION BODY
                </p>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: 10,
                      top: 11,
                      color: G(0.70),
                      fontFamily: TERM,
                      fontSize: '0.85rem',
                      pointerEvents: 'none',
                    }}
                  >›</span>
                  <textarea
                    required
                    rows={5}
                    value={form.transmission}
                    onChange={(e) => setForm((f) => ({ ...f, transmission: e.target.value }))}
                    placeholder="Enter message..."
                    style={{ ...termInput, resize: 'none', paddingTop: 10 }}
                    onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = G(0.65); (e.target as HTMLTextAreaElement).style.boxShadow = `0 0 10px ${G(0.12)}`; }}
                    onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = G(0.35); (e.target as HTMLTextAreaElement).style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              <button
                ref={btnRef}
                type="submit"
                disabled={status === 'sending'}
                data-cursor="link"
                style={{
                  width: '100%',
                  padding: '13px',
                  fontFamily: TERM,
                  fontSize: '0.95rem',
                  letterSpacing: '0.30em',
                  textTransform: 'uppercase',
                  background: status === 'success' ? G(0.10) : G(0.06),
                  border: `1px solid ${status === 'success' ? G(0.60) : G(0.38)}`,
                  color: status === 'success' ? '#00ff88' : '#80ffb8',
                  borderRadius: 3,
                  cursor: status === 'sending' ? 'wait' : 'pointer',
                  opacity: status === 'sending' ? 0.6 : 1,
                  boxShadow: status === 'success' ? `0 0 22px ${G(0.20)}` : `0 0 12px ${G(0.08)}`,
                  textShadow: `0 0 10px ${G(0.40)}`,
                  transition: 'border-color 0.3s, color 0.3s, box-shadow 0.3s',
                }}
              >
                {status === 'idle'    && '[ TRANSMIT ]'}
                {status === 'sending' && '[ TRANSMITTING... ]'}
                {status === 'success' && '[ ✓ SIGNAL RECEIVED · ACK 200 ]'}
                {status === 'error'   && '[ SIGNAL LOST — RETRY ]'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Master ContentOverlays ───────────────────────────────────────────────────

export default function ContentOverlays() {
  const earthPanelRef   = useRef<HTMLDivElement>(null);
  const marsPanelRef    = useRef<HTMLDivElement>(null);
  const contactPanelRef = useRef<HTMLDivElement>(null);

  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  useGSAP(() => {
    // If reduced motion: show EarthPanel statically, no animations
    if (prefersReduced) {
      gsap.set(earthPanelRef.current, { opacity: 1, pointerEvents: 'auto' });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });

    // ── EarthPanel: visible immediately on load, fades out 14→18%
    gsap.set(earthPanelRef.current, { opacity: 1, scale: 1, pointerEvents: 'auto' });

    tl.to(
      earthPanelRef.current,
      { opacity: 0, scale: 0.97, pointerEvents: 'none', duration: 4, ease: 'power2.in' },
      14
    )

    // ── MarsPanel: Mars surface — fades in 97→98%, visible until 99%
    .fromTo(
      marsPanelRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, pointerEvents: 'auto', duration: 1, ease: 'power2.out' },
      97
    )
    .to(
      marsPanelRef.current,
      { opacity: 0, y: -20, pointerEvents: 'none', duration: 1, ease: 'power2.in' },
      99
    )

    // ── ContactPanel: Earth re-entry — fades in 99→100%, stays visible
    .fromTo(
      contactPanelRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, pointerEvents: 'auto', duration: 1, ease: 'power2.out' },
      99
    );
  }, []);

  return (
    <>
      <EarthPanel ref={earthPanelRef} />
      <MarsPanel ref={marsPanelRef} />
      <ContactPanel ref={contactPanelRef} />
    </>
  );
}
