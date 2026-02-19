import { useTheme } from '../../context/ThemeContext';

const socials = [
  { label: 'GitHub',   href: 'https://github.com/danishshard',        color: '#e8e4ff' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/danishshard',    color: '#00e5ff' },
  { label: 'Twitter',  href: 'https://twitter.com/danishshard',        color: '#9b6dff' },
];

export default function Footer() {
  const { theme, toggle } = useTheme();

  return (
    <footer className="relative py-12 px-8 md:px-16 max-w-6xl mx-auto">
      {/* Nebula glow behind footer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(155,109,255,0.04) 0%, transparent 70%)' }}
      />

      <div
        className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ borderTop: '1px solid var(--glass-border)' }}
      >
        {/* Socials */}
        <div className="flex gap-8">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="text-sm tracking-widest uppercase transition-colors duration-200"
              style={{ color: 'var(--muted)', textDecoration: 'none' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = s.color)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)')}
            >
              {s.label} ↗
            </a>
          ))}
        </div>

        {/* Credit */}
        <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--muted)' }}>
          Made by <span style={{ color: 'var(--accent)' }}>Danish Shard</span> — {new Date().getFullYear()}
        </p>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          data-cursor="link"
          className="glass glass-glow text-xs tracking-[0.3em] uppercase px-4 py-2 transition-all duration-200"
          style={{ color: 'var(--muted)' }}
        >
          {theme === 'dark' ? '☀ Light' : '◑ Dark'}
        </button>
      </div>
    </footer>
  );
}
