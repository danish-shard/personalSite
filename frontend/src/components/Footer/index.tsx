const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/danishshard' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/danishshard' },
  { label: 'Twitter', href: 'https://twitter.com/danishshard' },
];

export default function Footer() {
  return (
    <footer
      className="relative z-[2] py-12 px-6 md:px-16 max-w-5xl mx-auto"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          © {new Date().getFullYear()} Danish Shard. Built with React, GSAP &
          Three.js.
        </p>

        <div className="flex gap-6">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors duration-200"
              style={{ color: 'var(--muted)', textDecoration: 'none' }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = 'var(--fg)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = 'var(--muted)';
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
