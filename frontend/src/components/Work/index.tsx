import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const EXPERIENCE = [
  {
    year: '2025',
    company: 'Dabster Tech',
    role: 'Lead Engineer',
    description:
      'Leading frontend architecture and AI integrations across multiple products. Building the engineering culture from the ground up.',
    accent: '#c8ff00',
  },
  {
    year: '2024',
    company: 'Netset Solutions',
    role: 'Web Developer',
    description:
      'Developed enterprise web applications focused on performance, scalability, and clean code architecture.',
    accent: '#00e5ff',
  },
  {
    year: '2023',
    company: 'Quikr',
    role: 'Full-Stack Developer',
    description:
      "Built and maintained marketplace features serving millions of users across India's leading classifieds platform.",
    accent: '#9b6dff',
  },
  {
    year: '2022–23',
    company: "Byju's",
    role: 'Frontend Developer',
    description:
      "Crafted interactive learning experiences for India's largest edtech platform, reaching students nationwide.",
    accent: '#ff6b9d',
  },
  {
    year: '2022',
    company: 'Reliance',
    role: 'Software Engineer',
    description:
      "Started my career building internal tools and dashboards for one of India's largest conglomerates.",
    accent: '#c8ff00',
  },
];

const PROJECTS = [
  {
    id: '01',
    title: 'Food Chatbot MCP',
    tags: ['React', 'Node.js', 'MCP', 'AI', 'MongoDB'],
    description:
      'AI-powered food ordering chatbot with Model Context Protocol integration — supports Zomato & Swiggy through a unified LLM orchestration layer.',
    year: '2025',
    accent: '#c8ff00',
  },
  {
    id: '02',
    title: 'ResQ SaaS Platform',
    tags: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    description:
      'Field service management SaaS for inventory, spare parts, and job scheduling across enterprise clients.',
    year: '2024',
    accent: '#00e5ff',
  },
  {
    id: '03',
    title: 'Swiggy Browser Extension',
    tags: ['Chrome Extension', 'TypeScript', 'AI'],
    description:
      'Browser extension that bridges an AI chatbot to Swiggy — lets users place food orders via natural language conversation.',
    year: '2025',
    accent: '#ff6b9d',
  },
  {
    id: '04',
    title: 'Personal Portfolio',
    tags: ['React', 'GSAP', 'Three.js', 'TypeScript'],
    description:
      'This site — built with a WebGL particle field, scroll-driven animations, and a focus on storytelling and clean design.',
    year: '2026',
    accent: '#9b6dff',
  },
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const timelineEntries =
      sectionRef.current?.querySelectorAll('.timeline-entry') ?? [];
    gsap.from(timelineEntries, {
      scrollTrigger: {
        trigger: '.timeline-section',
        start: 'top 75%',
      },
      x: -30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power3.out',
    });

    const projectCards =
      sectionRef.current?.querySelectorAll('.project-card') ?? [];
    gsap.from(projectCards, {
      scrollTrigger: {
        trigger: '.projects-section',
        start: 'top 75%',
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
    });
  }, { scope: sectionRef });

  return (
    <section
      id="work"
      ref={sectionRef}
      className="py-32 px-6 md:px-16 max-w-5xl mx-auto relative z-[2]"
    >
      {/* ── Experience Timeline ── */}
      <div className="timeline-section mb-32">
        <p className="section-label mb-4">Experience</p>
        <h2
          className="font-display font-bold leading-tight mb-16"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--fg)' }}
        >
          Where I've <span className="text-gradient">Built</span>
        </h2>

        <div className="relative">
          <div
            className="absolute left-0 md:left-[88px] top-0 bottom-0 w-px hidden md:block"
            style={{
              background:
                'linear-gradient(to bottom, var(--accent), var(--border), transparent)',
            }}
          />

          <div className="space-y-8">
            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="timeline-entry flex gap-6 md:gap-10">
                <div
                  className="hidden md:flex flex-col items-end shrink-0"
                  style={{ minWidth: 80 }}
                >
                  <span
                    className="font-display text-sm font-semibold tracking-wide"
                    style={{ color: exp.accent }}
                  >
                    {exp.year}
                  </span>
                </div>

                <div className="hidden md:flex items-start pt-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full -ml-[5px] shrink-0"
                    style={{
                      background: exp.accent,
                      boxShadow: `0 0 10px ${exp.accent}66`,
                    }}
                  />
                </div>

                <div className="glass p-6 md:p-8 flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3
                        className="font-display text-xl font-semibold"
                        style={{ color: 'var(--fg)' }}
                      >
                        {exp.company}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: exp.accent }}>
                        {exp.role}
                      </p>
                    </div>
                    <span
                      className="md:hidden text-xs font-display font-semibold shrink-0"
                      style={{ color: exp.accent }}
                    >
                      {exp.year}
                    </span>
                  </div>
                  <p
                    className="text-sm leading-relaxed mt-3"
                    style={{ color: 'var(--muted)' }}
                  >
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Projects ── */}
      <div className="projects-section">
        <p className="section-label mb-4">Projects</p>
        <h2
          className="font-display font-bold leading-tight mb-16"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--fg)' }}
        >
          What I've <span className="text-gradient">Shipped</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="project-card glass glass-glow relative p-8 flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex justify-between items-start">
                <span
                  className="font-display text-xs font-semibold"
                  style={{ color: 'var(--muted)' }}
                >
                  {project.id}
                </span>
                <span
                  className="text-xs tracking-widest"
                  style={{ color: 'var(--muted)' }}
                >
                  {project.year}
                </span>
              </div>

              <h3
                className="font-display text-xl md:text-2xl font-semibold"
                style={{ color: 'var(--fg)' }}
              >
                {project.title}
              </h3>

              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: 'var(--muted)' }}
              >
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 tracking-wide rounded"
                    style={{
                      background: `${project.accent}0d`,
                      border: `1px solid ${project.accent}33`,
                      color: project.accent,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div
                className="absolute bottom-0 left-4 right-4 h-px"
                style={{
                  background: `linear-gradient(to right, transparent, ${project.accent}55, transparent)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
