import { useRef } from 'react';
import { gsap } from 'gsap';

const PROJECTS = [
  {
    id: '01',
    title: 'Food Chatbot MCP',
    tags: ['React', 'Node.js', 'MCP', 'AI', 'MongoDB'],
    description: 'AI-powered food ordering chatbot with Model Context Protocol integration — supports Zomato & Swiggy through a unified LLM orchestration layer.',
    year: '2025',
    accent: '#c8ff00',
  },
  {
    id: '02',
    title: 'ResQ SaaS Platform',
    tags: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    description: 'Field service management SaaS for inventory, spare parts, and job scheduling across enterprise clients.',
    year: '2024',
    accent: '#00e5ff',
  },
  {
    id: '03',
    title: 'Swiggy Browser Extension',
    tags: ['Chrome Extension', 'TypeScript', 'AI'],
    description: 'Browser extension that bridges an AI chatbot to Swiggy — lets users place orders via natural language conversation.',
    year: '2025',
    accent: '#ff6b9d',
  },
  {
    id: '04',
    title: 'Personal Site',
    tags: ['React', 'GSAP', 'Three.js', 'TypeScript'],
    description: 'This site. Built with a WebGL particle universe, GSAP ScrollTrigger, and a custom magnetic cursor for an immersive web experience.',
    year: '2026',
    accent: '#c8ff00',
  },
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef   = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <section id="work" ref={sectionRef} className="py-32 px-8 md:px-16 max-w-6xl mx-auto">
      <p className="text-xs tracking-[0.4em] uppercase mb-16" style={{ color: 'var(--accent)' }}>
        002 — Work
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {PROJECTS.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => { itemsRef.current[i] = el; }}
            data-cursor="view"
            className="glass glass-highlight glass-glow relative flex flex-col gap-4 p-8 md:p-10 cursor-none overflow-hidden"
            style={{ minHeight: 280 }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, { y: -6, duration: 0.4, ease: 'power2.out' });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
            }}
          >
            {/* Number + year */}
            <div className="flex justify-between items-start">
              <span className="font-display text-xs" style={{ color: 'var(--muted)' }}>{project.id}</span>
              <span className="text-xs tracking-widest" style={{ color: 'var(--muted)' }}>{project.year}</span>
            </div>

            {/* Title */}
            <h3 className="font-display text-2xl md:text-3xl leading-tight" style={{ color: 'var(--fg)' }}>
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--muted)' }}>
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-1 tracking-widest uppercase"
                  style={{ border: `1px solid ${project.accent}44`, color: project.accent, borderRadius: 4 }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Bottom accent gradient bar */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(to right, transparent, ${project.accent}88, transparent)` }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
