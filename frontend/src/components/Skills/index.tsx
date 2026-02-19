import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ACCENT = '#c8ff00';

const SKILL_GROUPS = [
  {
    category: 'Frontend',
    items: ['React', 'TypeScript', 'Next.js', 'Three.js', 'GSAP', 'Framer Motion', 'Tailwind CSS', 'Vite'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs', 'WebSocket', 'Redis'],
  },
  {
    category: 'AI & Infra',
    items: ['LLM Integration', 'MCP Protocol', 'Claude / GPT', 'Prompt Engineering', 'Vercel', 'Railway', 'Docker'],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const tilesRef   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(tilesRef.current.filter(Boolean), {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        opacity: 0, y: 30,
        stagger: { amount: 0.8, from: 'random' },
        duration: 0.6, ease: 'power3.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  let tileIndex = 0;

  return (
    <section id="skills" ref={sectionRef} className="py-32 px-8 md:px-16 max-w-6xl mx-auto">
      <p className="text-xs tracking-[0.4em] uppercase mb-16" style={{ color: 'var(--accent)' }}>
        003 — Skills
      </p>

      <div className="space-y-6">
        {SKILL_GROUPS.map((group) => (
          <div key={group.category} className="glass glass-highlight p-8">
            <h3 className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: 'var(--nebula-cyan)' }}>
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => {
                const idx = tileIndex++;
                return (
                  <div
                    key={skill}
                    ref={(el) => { tilesRef.current[idx] = el; }}
                    data-cursor="link"
                    className="px-4 py-2 text-sm tracking-wide transition-all duration-300"
                    style={{ border: '1px solid var(--glass-border)', color: 'var(--fg)', borderRadius: 6 }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.boxShadow = `0 0 12px ${ACCENT}66, inset 0 0 8px ${ACCENT}11`;
                      el.style.borderColor = ACCENT;
                      el.style.color = ACCENT;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.boxShadow = '';
                      el.style.borderColor = 'var(--glass-border)';
                      el.style.color = 'var(--fg)';
                    }}
                  >
                    {skill}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
