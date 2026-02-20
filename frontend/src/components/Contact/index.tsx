import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useMagnet } from '../../hooks/useMagnet';

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/danishshard' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/danishshard' },
  { label: 'Twitter', href: 'https://twitter.com/danishshard' },
];

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const btnRef = useMagnet<HTMLButtonElement>();
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

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
      stagger: 0.1,
      ease: 'power3.out',
    });
  }, { scope: sectionRef });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('http://localhost:8000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-32 px-6 md:px-16 max-w-5xl mx-auto relative z-[2]"
    >
      <p className="section-label mb-4 reveal">Contact</p>

      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <h2
            className="font-display font-bold leading-tight mb-6 reveal"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--fg)' }}
          >
            Let's Build
            <br />
            <span className="text-gradient">Something Great</span>
          </h2>
          <p
            className="text-base leading-relaxed mb-8 reveal"
            style={{ color: 'var(--muted)' }}
          >
            Have a project in mind, want to collaborate, or just want to say
            hello? I'd love to hear from you. Drop me a message and I'll get
            back within a day.
          </p>

          <div className="space-y-4 reveal">
            <a
              href="mailto:hello@danishshard.dev"
              className="text-sm tracking-wide transition-colors duration-200 block"
              style={{ color: 'var(--accent)', textDecoration: 'none' }}
            >
              hello@danishshard.dev →
            </a>

            <div className="flex gap-6 pt-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors duration-200"
                  style={{ color: 'var(--muted)', textDecoration: 'none' }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLAnchorElement).style.color = 'var(--accent)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLAnchorElement).style.color = 'var(--muted)';
                  }}
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass p-8 space-y-5 reveal"
        >
          <div>
            <label
              className="text-xs tracking-[0.2em] uppercase block mb-2"
              style={{ color: 'var(--muted)' }}
            >
              Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your name"
              className="w-full rounded-lg px-4 py-3 text-base outline-none transition-colors duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--glass-border)',
                color: 'var(--fg)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
              }}
            />
          </div>

          <div>
            <label
              className="text-xs tracking-[0.2em] uppercase block mb-2"
              style={{ color: 'var(--muted)' }}
            >
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="your@email.com"
              className="w-full rounded-lg px-4 py-3 text-base outline-none transition-colors duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--glass-border)',
                color: 'var(--fg)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
              }}
            />
          </div>

          <div>
            <label
              className="text-xs tracking-[0.2em] uppercase block mb-2"
              style={{ color: 'var(--muted)' }}
            >
              Message
            </label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              placeholder="Tell me about your project..."
              className="w-full rounded-lg px-4 py-3 text-base outline-none transition-colors duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--glass-border)',
                color: 'var(--fg)',
                resize: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
              }}
            />
          </div>

          <button
            ref={btnRef}
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-4 font-display text-sm font-semibold tracking-[0.15em] uppercase rounded-lg transition-all duration-300"
            style={{
              background:
                status === 'success'
                  ? 'rgba(0, 229, 255, 0.08)'
                  : 'rgba(200, 255, 0, 0.06)',
              border: `1px solid ${
                status === 'success'
                  ? 'rgba(0, 229, 255, 0.3)'
                  : 'rgba(200, 255, 0, 0.3)'
              }`,
              color:
                status === 'success' ? 'var(--cyan)' : 'var(--accent)',
              opacity: status === 'sending' ? 0.6 : 1,
            }}
          >
            {status === 'idle' && 'Send Message'}
            {status === 'sending' && 'Sending...'}
            {status === 'success' && '✓ Message Sent!'}
            {status === 'error' && 'Failed — Try Again'}
          </button>
        </form>
      </div>
    </section>
  );
}
