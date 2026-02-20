import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: '3+', label: 'Years Experience' },
  { value: '12+', label: 'Projects Shipped' },
  { value: '5', label: 'Companies' },
  { value: '∞', label: 'Cups of Coffee' },
];

const TAGS = [
  'React', 'TypeScript', 'Node.js', 'Three.js', 'GSAP',
  'AI / LLMs', 'MCP Protocol', 'MongoDB', 'PostgreSQL', 'Tailwind',
  'Next.js', 'Vite', 'Docker', 'AWS',
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const elements = sectionRef.current?.querySelectorAll('.reveal') ?? [];
    gsap.from(elements, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
    });
  }, { scope: sectionRef });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-32 px-6 md:px-16 max-w-5xl mx-auto relative z-[2]"
    >
      <p className="section-label mb-4 reveal">About</p>

      <h2
        className="font-display font-bold leading-tight mb-10 reveal"
        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--fg)' }}
      >
        The Story So Far
      </h2>

      <div className="grid md:grid-cols-5 gap-12 mb-16">
        <div className="md:col-span-3 space-y-6">
          <p
            className="text-lg leading-relaxed reveal"
            style={{ color: 'var(--fg-dim)' }}
          >
            I'm Danish — a full-stack developer based in Bangalore who started
            out fascinated by how the web works and turned that curiosity into a
            career building products people actually use.
          </p>
          <p
            className="text-base leading-relaxed reveal"
            style={{ color: 'var(--muted)' }}
          >
            Over 3+ years, I've shipped projects across e-commerce, edtech, SaaS,
            and AI — from consumer apps serving millions to developer tools that
            push what's possible. Each step taught me something new about building
            at scale.
          </p>
          <p
            className="text-base leading-relaxed reveal"
            style={{ color: 'var(--muted)' }}
          >
            Today, I work at the intersection of design, engineering, and
            artificial intelligence. I believe the best products come from
            understanding both the technical challenges and the human needs
            behind them.
          </p>
        </div>

        <div className="md:col-span-2 grid grid-cols-2 gap-3 self-start">
          {STATS.map(({ value, label }) => (
            <div key={label} className="glass p-5 flex flex-col gap-1 reveal">
              <span
                className="font-display text-2xl font-bold"
                style={{ color: 'var(--accent)' }}
              >
                {value}
              </span>
              <span
                className="text-xs tracking-wider uppercase"
                style={{ color: 'var(--muted)' }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="reveal overflow-hidden py-4"
        style={{
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          className="animate-marquee whitespace-nowrap"
          style={{ display: 'inline-block' }}
        >
          {[...TAGS, ...TAGS].map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-6 mx-4">
              <span
                className="text-sm tracking-widest uppercase"
                style={{ color: 'var(--muted)' }}
              >
                {tag}
              </span>
              <span style={{ color: 'var(--accent)', fontSize: 6 }}>●</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
