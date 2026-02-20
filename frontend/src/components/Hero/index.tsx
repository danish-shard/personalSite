import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useMagnet } from '../../hooks/useMagnet';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useMagnet<HTMLAnchorElement>();
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.from(line1Ref.current, { y: '100%', duration: 1, ease: 'power4.out' })
      .from(line2Ref.current, { y: '100%', duration: 1, ease: 'power4.out' }, '-=0.7')
      .from(roleRef.current, { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .from(descRef.current, { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .from(ctaRef.current, { opacity: 0, y: 15, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .from(scrollRef.current, { opacity: 0, duration: 0.6 }, '-=0.2');
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center px-6 md:px-16 pt-20"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 20% 50%, rgba(155, 109, 255, 0.04) 0%, transparent 70%),
            radial-gradient(ellipse 40% 50% at 80% 30%, rgba(0, 229, 255, 0.03) 0%, transparent 70%)
          `,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <div className="overflow-hidden">
            <div
              ref={line1Ref}
              className="font-display font-bold leading-[0.95] tracking-tight"
              style={{ fontSize: 'clamp(3.5rem, 11vw, 9rem)', color: 'var(--fg)' }}
            >
              Danish
            </div>
          </div>
          <div className="overflow-hidden">
            <div
              ref={line2Ref}
              className="font-display font-bold leading-[0.95] tracking-tight text-gradient"
              style={{ fontSize: 'clamp(3.5rem, 11vw, 9rem)' }}
            >
              Shard
            </div>
          </div>
        </div>

        <p
          ref={roleRef}
          className="font-display text-lg md:text-xl tracking-wide mb-6"
          style={{ color: 'var(--muted)' }}
        >
          Full-Stack Developer &amp; AI Engineer
        </p>

        <p
          ref={descRef}
          className="text-base md:text-lg leading-relaxed max-w-lg mb-10"
          style={{ color: 'var(--fg-dim)' }}
        >
          I build digital products at the intersection of design, engineering,
          and AI — crafting experiences that are both technically sound and
          genuinely useful.
        </p>

        <a
          ref={ctaRef}
          href="#work"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="glass glass-glow inline-flex items-center gap-3 font-display text-sm font-semibold tracking-[0.15em] uppercase px-8 py-4 group transition-all duration-300"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
        >
          View My Work
          <span className="transition-transform duration-300 group-hover:translate-y-0.5">
            ↓
          </span>
        </a>
      </div>

      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div
          className="w-px h-12"
          style={{
            background: 'linear-gradient(to bottom, var(--accent), transparent)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.4; transform: scaleY(0.6); }
        }
      `}</style>
    </section>
  );
}
