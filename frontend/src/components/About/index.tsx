import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current?.querySelectorAll('p') ?? [], {
        scrollTrigger: { trigger: textRef.current, start: 'top 75%', toggleActions: 'play none none none' },
        y: 40, opacity: 0, stagger: 0.15, duration: 0.9, ease: 'power3.out',
      });

      statsRef.current?.querySelectorAll('.stat-value').forEach((el) => {
        ScrollTrigger.create({
          trigger: el, start: 'top 85%',
          onEnter: () => gsap.from(el, { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }),
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-32 px-8 md:px-16 max-w-6xl mx-auto">
      <p className="text-xs tracking-[0.4em] uppercase mb-16" style={{ color: 'var(--accent)' }}>
        001 — About
      </p>

      <div className="grid md:grid-cols-2 gap-16 items-start">
        {/* Text */}
        <div ref={textRef} className="glass glass-highlight px-8 py-8 space-y-6">
          <p className="text-3xl md:text-4xl leading-tight font-light" style={{ color: 'var(--fg)' }}>
            I build digital products at the intersection of{' '}
            <em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>design, engineering,</em>{' '}
            and <em style={{ color: 'var(--nebula-cyan)', fontStyle: 'normal' }}>AI</em>.
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
            Based in Bangalore, I specialise in building full-stack applications
            with modern tooling — React, Node.js, TypeScript, and AI-powered backends.
            My work spans consumer products, SaaS platforms, and experimental creative projects.
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
            When I'm not coding, I'm exploring new frameworks, contributing to open-source,
            or thinking about how AI will reshape the way we interact with software.
          </p>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 gap-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="glass glass-highlight p-8 flex flex-col gap-2">
              <span className="stat-value font-display text-4xl glow-text" style={{ color: 'var(--accent)' }}>
                {value}
              </span>
              <span className="text-xs tracking-wider uppercase" style={{ color: 'var(--muted)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scrolling tags marquee */}
      <div className="glass mt-24 overflow-hidden py-4" style={{ borderRadius: 0 }}>
        <div className="animate-marquee whitespace-nowrap" style={{ display: 'inline-block' }}>
          {TAGS.map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-6 mx-6">
              <span className="text-sm tracking-widest uppercase" style={{ color: 'var(--muted)' }}>{tag}</span>
              <span style={{ color: 'var(--nebula-cyan)', fontSize: 8 }}>◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
