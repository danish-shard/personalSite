import { useRef, useState } from 'react';
import { useMagnet } from '../../hooks/useMagnet';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLHeadingElement>(null);
  const formRef    = useRef<HTMLFormElement>(null);
  const btnRef     = useMagnet<HTMLButtonElement>();
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

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

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    borderRadius: 8,
    color: 'var(--fg)',
    width: '100%',
    padding: '12px 14px',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.65rem',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    display: 'block',
    marginBottom: 6,
  };

  return (
    <section id="contact" ref={sectionRef} className="py-32 px-8 md:px-16 max-w-6xl mx-auto">
      <p className="text-xs tracking-[0.4em] uppercase mb-16" style={{ color: 'var(--accent)' }}>
        004 — Contact
      </p>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Left: CTA */}
        <div>
          <h2
            ref={headRef}
            className="font-display text-5xl md:text-6xl leading-tight mb-8"
            style={{ color: 'var(--fg)' }}
          >
            Let's build<br />
            <span className="glow-text" style={{ color: 'var(--accent)' }}>something.</span>
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--muted)' }}>
            Have a project in mind? Looking to collaborate? Or just want to say hello?
            Drop me a message and I'll get back to you within a day.
          </p>
          <a
            href="mailto:hello@danishshard.dev"
            data-cursor="link"
            className="text-sm tracking-widest uppercase transition-colors duration-200"
            style={{ color: 'var(--accent)', textDecoration: 'none' }}
          >
            hello@danishshard.dev ↗
          </a>
        </div>

        {/* Right: Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="glass glass-highlight p-8 space-y-6">
          <div>
            <label style={labelStyle}>Name</label>
            <input
              type="text" required value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your name" style={inputStyle}
              onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = 'var(--accent)')}
              onBlur={(e)  => ((e.target as HTMLInputElement).style.borderColor = 'var(--glass-border)')}
            />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email" required value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com" style={inputStyle}
              onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = 'var(--accent)')}
              onBlur={(e)  => ((e.target as HTMLInputElement).style.borderColor = 'var(--glass-border)')}
            />
          </div>
          <div>
            <label style={labelStyle}>Message</label>
            <textarea
              required rows={4} value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Tell me about your project..."
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = 'var(--accent)')}
              onBlur={(e)  => ((e.target as HTMLTextAreaElement).style.borderColor = 'var(--glass-border)')}
            />
          </div>

          <button
            ref={btnRef}
            type="submit"
            disabled={status === 'sending'}
            data-cursor="link"
            className="w-full py-4 font-display text-sm tracking-[0.2em] uppercase transition-all duration-300"
            style={{
              background: status === 'success' ? 'rgba(0,229,255,0.12)' : 'rgba(200,255,0,0.08)',
              border: `1px solid ${status === 'success' ? 'rgba(0,229,255,0.4)' : 'rgba(200,255,0,0.4)'}`,
              color: status === 'success' ? 'var(--nebula-cyan)' : 'var(--accent)',
              borderRadius: 8,
              boxShadow: `0 0 20px ${status === 'success' ? 'rgba(0,229,255,0.1)' : 'rgba(200,255,0,0.1)'}`,
              opacity: status === 'sending' ? 0.7 : 1,
            }}
          >
            {status === 'idle'    && 'Send Message'}
            {status === 'sending' && 'Sending...'}
            {status === 'success' && '✓ Message Sent!'}
            {status === 'error'   && 'Failed — Try Again'}
          </button>
        </form>
      </div>
    </section>
  );
}
