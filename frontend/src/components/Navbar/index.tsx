import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../../context/ThemeContext';
import { useMagnet } from '../../hooks/useMagnet';

function getPhaseLabel(progress: number): string {
  if (progress < 0.18) return 'Earth';
  if (progress < 0.72) return 'Deep Space';
  if (progress < 0.92) return 'Moon';
  if (progress < 0.98) return 'Mars';
  return 'Home';
}

export default function Navbar() {
  const { toggle, theme } = useTheme();
  const navRef   = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const lastY    = useRef(0);
  const themeRef = useMagnet<HTMLButtonElement>();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (!navRef.current) return;
      if (y > lastY.current && y > 100) {
        gsap.to(navRef.current, { yPercent: -100, duration: 0.4, ease: 'power2.inOut' });
      } else {
        gsap.to(navRef.current, { yPercent: 0, duration: 0.4, ease: 'power2.out' });
      }
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!labelRef.current) return;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const progress = window.scrollY / maxScroll;
      labelRef.current.textContent = getPhaseLabel(progress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className="glass-nav fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
    >
      <span
        className="font-display text-sm tracking-widest uppercase glow-text"
        style={{ color: 'var(--accent)' }}
        data-cursor="link"
      >
        DS
      </span>

      <span
        ref={labelRef}
        className="hidden md:block text-xs tracking-[0.4em] uppercase"
        style={{ color: 'var(--muted)' }}
      >
        Earth
      </span>

      <button
        ref={themeRef}
        onClick={toggle}
        data-cursor="link"
        className="glass flex items-center justify-center text-xs transition-all duration-300"
        style={{ color: 'var(--fg)', borderRadius: '50%', width: 40, height: 40 }}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '☀' : '◐'}
      </button>
    </nav>
  );
}
