import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════ DATA ═══════════════════════════════ */

const EXPERIENCE = [
  { year: '2025', company: 'Dabster Tech', role: 'Lead Engineer', accent: '#c8ff00' },
  { year: '2024', company: 'Netset Solutions', role: 'Web Developer', accent: '#00e5ff' },
  { year: '2023', company: 'Quikr', role: 'Full-Stack Developer', accent: '#9b6dff' },
  { year: '2022–23', company: "Byju's", role: 'Frontend Developer', accent: '#ff6b9d' },
  { year: '2022', company: 'Reliance', role: 'Software Engineer', accent: '#c8ff00' },
];

const PROJECTS = [
  {
    id: '01', title: 'Food Chatbot MCP', year: '2025', accent: '#c8ff00',
    tags: ['React', 'Node.js', 'MCP', 'AI'],
    desc: 'AI-powered food ordering chatbot with Model Context Protocol — unified LLM orchestration for Zomato & Swiggy.',
  },
  {
    id: '02', title: 'ResQ SaaS Platform', year: '2024', accent: '#00e5ff',
    tags: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    desc: 'Field service management SaaS for inventory, spare parts, and job scheduling across enterprise clients.',
  },
  {
    id: '03', title: 'Swiggy Extension', year: '2025', accent: '#ff6b9d',
    tags: ['Chrome Extension', 'TypeScript', 'AI'],
    desc: 'Browser extension bridging an AI chatbot to Swiggy — place food orders via natural language.',
  },
  {
    id: '04', title: 'Personal Portfolio', year: '2026', accent: '#9b6dff',
    tags: ['React', 'GSAP', 'Three.js'],
    desc: 'This site — horizontal scroll cinema, WebGL particles, scroll-driven storytelling.',
  },
];

const SKILLS = [
  { label: 'Frontend', color: '#c8ff00', items: ['React', 'TypeScript', 'GSAP', 'Three.js', 'Tailwind', 'Next.js', 'Vite'] },
  { label: 'Backend', color: '#00e5ff', items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs', 'WebSockets'] },
  { label: 'AI & LLMs', color: '#9b6dff', items: ['MCP Protocol', 'LLM Integration', 'Prompt Engineering', 'OpenAI API', 'Chatbots'] },
  { label: 'Tools', color: '#ff6b9d', items: ['Git', 'Docker', 'Chrome Extensions', 'Figma', 'AWS', 'Linux'] },
];

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/danishshard' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/danishshard' },
  { label: 'Twitter', href: 'https://twitter.com/danishshard' },
];

const STATS = [
  { value: '3+', label: 'Years' },
  { value: '12+', label: 'Projects' },
  { value: '5', label: 'Companies' },
  { value: '∞', label: 'Coffee' },
];

const NUM_SCENES = 6;

/* ═══════════════════════════ COMPONENT ══════════════════════════════ */

export default function HorizontalScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useGSAP(() => {
    const container = containerRef.current!;

    const scrollTween = gsap.to(container, {
      x: () => -(container.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: wrapperRef.current,
        pin: true,
        scrub: 1.2,
        end: () => `+=${container.scrollWidth - window.innerWidth}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          window.dispatchEvent(
            new CustomEvent('hscroll-progress', { detail: { progress: self.progress } })
          );
        },
      },
    });

    /* ── Hero entrance (on mount, not scroll) ── */
    const heroTl = gsap.timeline({ delay: 0.25 });
    heroTl
      .from('.hero-line-1', { y: '110%', duration: 1.1, ease: 'power4.out' })
      .from('.hero-line-2', { y: '110%', duration: 1.1, ease: 'power4.out' }, '-=0.75')
      .from('.hero-sub', { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .from('.hero-desc', { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .from('.hero-cue', { opacity: 0, x: -20, duration: 0.6, ease: 'power3.out' }, '-=0.3');

    /* ── Per-scene reveals ── */
    container.querySelectorAll('.hscene').forEach((scene, i) => {
      if (i === 0) return;
      const els = scene.querySelectorAll('.reveal');
      if (!els.length) return;
      gsap.from(els, {
        opacity: 0, y: 50, stagger: 0.06,
        scrollTrigger: {
          trigger: scene,
          containerAnimation: scrollTween,
          start: 'left 80%',
          end: 'left 30%',
          scrub: true,
        },
      });
    });

    /* ── Experience timeline draw ── */
    gsap.from('.tl-line-fill', {
      scaleX: 0, transformOrigin: 'left center',
      scrollTrigger: {
        trigger: '.scene-exp',
        containerAnimation: scrollTween,
        start: 'left 70%',
        end: 'center center',
        scrub: true,
      },
    });

    gsap.from('.tl-node', {
      scale: 0, opacity: 0, stagger: 0.08,
      scrollTrigger: {
        trigger: '.scene-exp',
        containerAnimation: scrollTween,
        start: 'left 60%',
        end: 'center center',
        scrub: true,
      },
    });

    /* ── Project card stagger ── */
    gsap.from('.pcard', {
      y: 80, opacity: 0, rotateX: -15, stagger: 0.08,
      scrollTrigger: {
        trigger: '.scene-proj',
        containerAnimation: scrollTween,
        start: 'left 75%',
        end: 'left 25%',
        scrub: true,
      },
    });

    /* ── Skill category stagger ── */
    gsap.from('.scat', {
      scale: 0.85, opacity: 0, stagger: 0.06,
      scrollTrigger: {
        trigger: '.scene-skills',
        containerAnimation: scrollTween,
        start: 'left 75%',
        end: 'left 30%',
        scrub: true,
      },
    });
  }, { scope: wrapperRef });

  /* ── 3D tilt for cards ── */
  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(e.currentTarget, { rotateY: x * 14, rotateX: -y * 10, duration: 0.35, ease: 'power2.out' });
  };
  const resetTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('http://localhost:8000/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch { setStatus('error'); }
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    borderRadius: 10, color: 'var(--fg)',
    width: '100%', padding: '12px 16px', fontSize: '1rem',
    outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 0.3s',
  };

  return (
    <div ref={wrapperRef} style={{ overflow: 'hidden' }}>
      <div
        ref={containerRef}
        className="flex"
        style={{ width: `${NUM_SCENES * 100}vw`, height: '100vh' }}
      >
        {/* ═══════ SCENE 1 — HERO ═══════ */}
        <section className="hscene scene-hero relative w-screen h-screen shrink-0 flex items-center px-8 md:px-20">
          <SceneDivider />
          <div className="max-w-5xl mx-auto w-full relative z-10">
            <p className="hero-sub section-label mb-8">01 — Hello</p>
            <div className="mb-6">
              <div className="overflow-hidden">
                <div className="hero-line-1 font-display font-bold leading-[0.92] tracking-tight" style={{ fontSize: 'clamp(3.5rem, 11vw, 9rem)', color: 'var(--fg)' }}>
                  Danish
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="hero-line-2 font-display font-bold leading-[0.92] tracking-tight text-gradient" style={{ fontSize: 'clamp(3.5rem, 11vw, 9rem)' }}>
                  Shard
                </div>
              </div>
            </div>
            <p className="hero-sub font-display text-lg md:text-xl tracking-wide mb-5" style={{ color: 'var(--muted)' }}>
              Full-Stack Developer &amp; AI Engineer
            </p>
            <p className="hero-desc text-base md:text-lg leading-relaxed max-w-lg mb-14" style={{ color: 'var(--fg)', opacity: 0.75 }}>
              Building digital products at the intersection of design, engineering, and AI — based in Bangalore.
            </p>
            <div className="hero-cue flex items-center gap-4" style={{ color: 'var(--accent)' }}>
              <span className="font-display text-sm tracking-[0.3em] uppercase">Scroll to explore</span>
              <span className="text-2xl" style={{ animation: 'arrowPulse 2s ease-in-out infinite' }}>→</span>
            </div>
          </div>
        </section>

        {/* ═══════ SCENE 2 — ABOUT ═══════ */}
        <section className="hscene scene-about relative w-screen h-screen shrink-0 flex items-center px-8 md:px-20">
          <SceneDivider />
          <div className="max-w-5xl mx-auto w-full grid md:grid-cols-5 gap-12 relative z-10">
            <div className="md:col-span-3">
              <p className="reveal section-label mb-8">02 — About</p>
              <h2 className="reveal font-display font-bold leading-tight mb-8" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--fg)' }}>
                The Story <span className="text-gradient">So Far</span>
              </h2>
              <p className="reveal text-lg leading-relaxed mb-6" style={{ color: 'var(--fg)', opacity: 0.8 }}>
                I'm Danish — a full-stack developer who turned curiosity about how the web works into a career building products people actually use.
              </p>
              <p className="reveal text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
                Over 3+ years, I've shipped across e-commerce, edtech, SaaS, and AI — from apps serving millions to developer tools pushing what's possible. I believe the best products come from understanding both the technical challenge and the human need.
              </p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-3 self-center">
              {STATS.map(s => (
                <div key={s.label} className="reveal glass p-5 flex flex-col gap-1">
                  <span className="font-display text-2xl font-bold glow-text" style={{ color: 'var(--accent)' }}>{s.value}</span>
                  <span className="text-xs tracking-wider uppercase" style={{ color: 'var(--muted)' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ SCENE 3 — EXPERIENCE ═══════ */}
        <section className="hscene scene-exp relative w-screen h-screen shrink-0 flex flex-col justify-center px-8 md:px-20">
          <SceneDivider />
          <div className="max-w-6xl mx-auto w-full relative z-10">
            <p className="reveal section-label mb-8">03 — Experience</p>
            <h2 className="reveal font-display font-bold leading-tight mb-20" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--fg)' }}>
              Where I've <span className="text-gradient">Built</span>
            </h2>

            <div className="relative">
              <div className="absolute left-0 right-0 top-1/2 h-px" style={{ background: 'rgba(200,220,255,0.08)' }}>
                <div className="tl-line-fill absolute inset-0" style={{ background: 'linear-gradient(to right, var(--accent), var(--nebula-cyan), var(--nebula-violet))' }} />
              </div>

              <div className="flex justify-between items-center relative" style={{ minHeight: 220 }}>
                {EXPERIENCE.map((exp, i) => {
                  const above = i % 2 === 0;
                  return (
                    <div key={i} className="tl-node flex flex-col items-center gap-3 relative" style={{ width: `${100 / EXPERIENCE.length}%` }}>
                      {above && (
                        <div className="glass p-4 text-center" style={{ marginBottom: 16, borderTop: `2px solid ${exp.accent}55` }}>
                          <span className="font-display text-xs font-bold block tracking-wide" style={{ color: exp.accent }}>{exp.year}</span>
                          <span className="text-sm font-semibold block mt-1" style={{ color: 'var(--fg)' }}>{exp.company}</span>
                          <span className="text-xs block mt-0.5" style={{ color: 'var(--muted)' }}>{exp.role}</span>
                        </div>
                      )}
                      <div className="w-3.5 h-3.5 rounded-full shrink-0 relative z-10" style={{ background: exp.accent, boxShadow: `0 0 14px ${exp.accent}88` }} />
                      {!above && (
                        <div className="glass p-4 text-center" style={{ marginTop: 16, borderBottom: `2px solid ${exp.accent}55` }}>
                          <span className="font-display text-xs font-bold block tracking-wide" style={{ color: exp.accent }}>{exp.year}</span>
                          <span className="text-sm font-semibold block mt-1" style={{ color: 'var(--fg)' }}>{exp.company}</span>
                          <span className="text-xs block mt-0.5" style={{ color: 'var(--muted)' }}>{exp.role}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ SCENE 4 — PROJECTS ═══════ */}
        <section className="hscene scene-proj relative w-screen h-screen shrink-0 flex items-center px-8 md:px-20">
          <SceneDivider />
          <div className="max-w-5xl mx-auto w-full relative z-10">
            <p className="reveal section-label mb-8">04 — Projects</p>
            <h2 className="reveal font-display font-bold leading-tight mb-12" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--fg)' }}>
              What I've <span className="text-gradient">Shipped</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-5" style={{ perspective: 800 }}>
              {PROJECTS.map(p => (
                <div
                  key={p.id}
                  className="pcard glass glass-glow relative p-7 flex flex-col gap-3"
                  style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                  data-cursor="view"
                  onMouseMove={handleTilt}
                  onMouseLeave={resetTilt}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-display text-xs font-bold" style={{ color: 'var(--muted)' }}>{p.id}</span>
                    <span className="text-xs tracking-widest" style={{ color: 'var(--muted)' }}>{p.year}</span>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-semibold" style={{ color: 'var(--fg)' }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--muted)' }}>{p.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {p.tags.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded tracking-wide" style={{ background: `${p.accent}0d`, border: `1px solid ${p.accent}33`, color: p.accent }}>{t}</span>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-4 right-4 h-px" style={{ background: `linear-gradient(to right, transparent, ${p.accent}66, transparent)` }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ SCENE 5 — SKILLS ═══════ */}
        <section className="hscene scene-skills relative w-screen h-screen shrink-0 flex items-center px-8 md:px-20">
          <SceneDivider />
          <div className="max-w-5xl mx-auto w-full relative z-10">
            <p className="reveal section-label mb-8">05 — Skills</p>
            <h2 className="reveal font-display font-bold leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--fg)' }}>
              Technical <span className="text-gradient">Arsenal</span>
            </h2>
            <p className="reveal text-base leading-relaxed mb-12" style={{ color: 'var(--muted)', maxWidth: 480 }}>
              Tools & technologies I reach for when building at scale.
            </p>
            <div className="grid md:grid-cols-2 gap-5">
              {SKILLS.map(cat => (
                <div key={cat.label} className="scat glass p-6 space-y-4" style={{ borderTop: `2px solid ${cat.color}44` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: cat.color, boxShadow: `0 0 10px ${cat.color}88` }} />
                    <span className="font-display text-sm font-semibold tracking-wide" style={{ color: cat.color }}>{cat.label}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map(s => (
                      <span key={s} className="text-sm px-3 py-1 rounded tracking-wide" style={{ background: `${cat.color}0a`, border: `1px solid ${cat.color}22`, color: 'var(--fg)', opacity: 0.85 }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ SCENE 6 — CONTACT ═══════ */}
        <section className="hscene scene-contact relative w-screen h-screen shrink-0 flex items-center px-8 md:px-20">
          <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-16 relative z-10">
            <div>
              <p className="reveal section-label mb-8">06 — Contact</p>
              <h2 className="reveal font-display font-bold leading-tight mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--fg)' }}>
                Let's Build<br /><span className="text-gradient">Something Great</span>
              </h2>
              <p className="reveal text-base leading-relaxed mb-8" style={{ color: 'var(--muted)' }}>
                Have a project in mind or want to collaborate? Drop a message — I'll get back within a day.
              </p>
              <div className="reveal space-y-3">
                <a href="mailto:hello@danishshard.dev" data-cursor="link" className="text-sm tracking-wide block" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                  hello@danishshard.dev →
                </a>
                <div className="flex gap-6 pt-2">
                  {SOCIALS.map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" data-cursor="link" className="text-sm transition-colors duration-200" style={{ color: 'var(--muted)', textDecoration: 'none' }}>{s.label} ↗</a>
                  ))}
                </div>
              </div>
              <p className="reveal text-xs mt-12" style={{ color: 'rgba(120,120,150,0.5)' }}>
                © {new Date().getFullYear()} Danish Shard — React, GSAP, Three.js
              </p>
            </div>
            <form onSubmit={handleSubmit} className="reveal glass p-8 space-y-5 self-center">
              <div>
                <label className="text-xs tracking-[0.2em] uppercase block mb-2" style={{ color: 'var(--muted)' }}>Name</label>
                <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; }} />
              </div>
              <div>
                <label className="text-xs tracking-[0.2em] uppercase block mb-2" style={{ color: 'var(--muted)' }}>Email</label>
                <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; }} />
              </div>
              <div>
                <label className="text-xs tracking-[0.2em] uppercase block mb-2" style={{ color: 'var(--muted)' }}>Message</label>
                <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell me about your project..." style={{ ...inputStyle, resize: 'none' as const }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; }} />
              </div>
              <button type="submit" disabled={status === 'sending'} data-cursor="link"
                className="w-full py-4 font-display text-sm font-semibold tracking-[0.15em] uppercase rounded-lg transition-all duration-300"
                style={{
                  background: status === 'success' ? 'rgba(0,229,255,0.08)' : 'rgba(200,255,0,0.06)',
                  border: `1px solid ${status === 'success' ? 'rgba(0,229,255,0.3)' : 'rgba(200,255,0,0.3)'}`,
                  color: status === 'success' ? 'var(--nebula-cyan)' : 'var(--accent)',
                  opacity: status === 'sending' ? 0.6 : 1,
                }}>
                {status === 'idle' && 'Send Message'}
                {status === 'sending' && 'Sending...'}
                {status === 'success' && '✓ Sent!'}
                {status === 'error' && 'Failed — Retry'}
              </button>
            </form>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes arrowPulse {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(8px); opacity: 0.5; }
        }
        @keyframes portalGlow {
          0%, 100% { opacity: 0.35; box-shadow: 0 0 20px var(--accent), 0 0 60px rgba(200,255,0,0.1); }
          50% { opacity: 0.65; box-shadow: 0 0 30px var(--accent), 0 0 80px rgba(200,255,0,0.2); }
        }
      `}</style>
    </div>
  );
}

/* ═══════ Scene divider — glowing energy portal between scenes ═══════ */

function SceneDivider() {
  return (
    <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center" style={{ width: 3 }}>
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 5%, var(--accent) 30%, var(--nebula-cyan) 50%, var(--nebula-violet) 70%, transparent 95%)',
          opacity: 0.4,
          animation: 'portalGlow 3s ease-in-out infinite',
          filter: 'blur(1px)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 10%, rgba(200,255,0,0.7) 35%, rgba(0,229,255,0.7) 50%, rgba(155,109,255,0.7) 65%, transparent 90%)',
          opacity: 0.15,
          filter: 'blur(12px)',
          width: 30,
          left: -14,
        }}
      />
    </div>
  );
}
