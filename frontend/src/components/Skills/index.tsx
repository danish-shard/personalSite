import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  {
    label: 'Frontend',
    color: '#c8ff00',
    items: [
      'React', 'TypeScript', 'GSAP', 'Three.js',
      'Tailwind CSS', 'Next.js', 'Vite',
    ],
  },
  {
    label: 'Backend',
    color: '#00e5ff',
    items: [
      'Node.js', 'Express', 'MongoDB', 'PostgreSQL',
      'REST APIs', 'WebSockets',
    ],
  },
  {
    label: 'AI & LLMs',
    color: '#9b6dff',
    items: [
      'MCP Protocol', 'LLM Integration', 'Prompt Engineering',
      'OpenAI API', 'Chatbots',
    ],
  },
  {
    label: 'Tools & Infra',
    color: '#ff6b9d',
    items: [
      'Git', 'Docker', 'Chrome Extensions', 'Figma',
      'AWS', 'Linux',
    ],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const cards = sectionRef.current?.querySelectorAll('.skill-card') ?? [];
    gsap.from(cards, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }, { scope: sectionRef });

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-32 px-6 md:px-16 max-w-5xl mx-auto relative z-[2]"
    >
      <p className="section-label mb-4">Skills</p>
      <h2
        className="font-display font-bold leading-tight mb-6"
        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--fg)' }}
      >
        Technical <span className="text-gradient">Arsenal</span>
      </h2>
      <p
        className="text-base leading-relaxed mb-16"
        style={{ color: 'var(--muted)', maxWidth: 520 }}
      >
        The tools, frameworks, and technologies I use to bring ideas to life.
      </p>

      <div className="grid md:grid-cols-2 gap-5">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.label}
            className="skill-card glass p-6 space-y-4"
            style={{ borderTop: `2px solid ${cat.color}44` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: cat.color,
                  boxShadow: `0 0 8px ${cat.color}88`,
                }}
              />
              <span
                className="font-display text-sm font-semibold tracking-wide"
                style={{ color: cat.color }}
              >
                {cat.label}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {cat.items.map((skill) => (
                <span
                  key={skill}
                  className="text-sm px-3 py-1.5 rounded tracking-wide"
                  style={{
                    background: `${cat.color}0a`,
                    border: `1px solid ${cat.color}22`,
                    color: 'var(--fg-dim)',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
