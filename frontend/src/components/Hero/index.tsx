import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useMagnet } from '../../hooks/useMagnet';

function splitText(text: string) {
  return text.split('').map((char, i) => (
    <span key={i} className="char" style={{ display: 'inline-block', overflow: 'hidden' }}>
      <span className="char-inner" style={{ display: 'inline-block' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    </span>
  ));
}

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const ctaRef      = useMagnet<HTMLAnchorElement>();

  useEffect(() => {
    const chars = headlineRef.current?.querySelectorAll('.char-inner') ?? [];
    const tl = gsap.timeline({ delay: 0.2 });
    tl.from(chars,           { y: '110%', duration: 1, stagger: 0.04, ease: 'power4.out' })
      .from(subRef.current,  { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .from(scrollRef.current, { opacity: 0, y: 10, duration: 0.6 }, '-=0.2');
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* CSS nebula radial glows — adds depth behind the particle field */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 15% 55%, rgba(155,109,255,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 85% 30%, rgba(0,229,255,0.05) 0%, transparent 70%)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 max-w-6xl w-full mx-auto">
        <p className="text-xs tracking-[0.4em] uppercase mb-6 glow-cyan" style={{ color: 'var(--nebula-cyan)' }}>
          Creative Developer — Bangalore
        </p>

        <h1
          ref={headlineRef}
          className="font-display text-[13vw] md:text-[8vw] leading-[0.9] mb-8 select-none glow-text"
          style={{ color: 'var(--fg)' }}
        >
          <div>{splitText('BUILD')}</div>
          <div className="text-gradient">{splitText('THINGS')}</div>
          <div>{splitText('THAT')}</div>
          <div style={{ color: 'var(--accent)' }}>{splitText('MATTER.')}</div>
        </h1>

        <p
          ref={subRef}
          className="glass text-base md:text-lg max-w-md mb-12 leading-relaxed px-6 py-4"
          style={{ color: 'var(--muted)' }}
        >
          I design and engineer interactive digital experiences —
          from AI-powered products to creative web applications.
        </p>

        <a
          ref={ctaRef}
          href="#work"
          data-cursor="link"
          className="glass glass-glow inline-flex items-center gap-3 font-display text-sm tracking-[0.2em] uppercase px-8 py-4 transition-all duration-300 group"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Enter the Work
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div
          className="w-px h-16"
          style={{ background: 'linear-gradient(to bottom, var(--nebula-cyan), transparent)', animation: 'scrollLine 2s ease-in-out infinite' }}
        />
        <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: 'var(--muted)' }}>Scroll</p>
      </div>

      <style>{`
        @keyframes scrollLine {
          0%, 100% { transform: scaleY(1); opacity: 1; }
          50% { transform: scaleY(0.5); opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
