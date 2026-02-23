import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSound } from '../../context/SoundContext';

type EntryMode = 'journey' | 'linear';
type EntryJump =
  | { kind: 'journeyProgress'; progress: number }
  | { kind: 'anchor'; id: string };

interface PreloaderProps {
  isMobile: boolean;
  onComplete: (mode: EntryMode, jump?: EntryJump) => void;
}

export default function Preloader({ onComplete, isMobile }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<EntryMode>(() => {
    if (typeof window === 'undefined') return 'journey';
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return 'linear';
    return isMobile ? 'linear' : 'journey';
  });
  const { startAmbient } = useSound();

  useEffect(() => {
    const obj = { value: 0 };
    const tl = gsap.timeline();

    tl.from(nameRef.current, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    }, 0);

    tl.to(obj, {
      value: 100,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.round(obj.value);
        setProgress(v);
        window.dispatchEvent(
          new CustomEvent('particle-ramp', { detail: { progress: obj.value / 100 } })
        );
      },
      onComplete: () => {
        setReady(true);
        gsap.from(cardRef.current, {
          opacity: 0,
          y: 14,
          duration: 0.6,
          ease: 'power3.out',
          delay: 0.08,
        });
      },
    }, 0);

    tl.from(barRef.current, {
      scaleX: 0,
      duration: 2,
      ease: 'power2.inOut',
      transformOrigin: 'left',
    }, 0);

    return () => {
      tl.kill();
    };
  }, []);

  const handleEnter = (nextMode: EntryMode, jump?: EntryJump) => {
    startAmbient();
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => onComplete(nextMode, jump),
    });
  };

  // Small parallax tilt on the card to make the entry screen feel "alive".
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const rx = gsap.quickTo(el, 'rotateX', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotateY', { duration: 0.5, ease: 'power3.out' });
    const tx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const ty = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      ry(gsap.utils.clamp(-1, 1, px) * 6);
      rx(gsap.utils.clamp(-1, 1, -py) * 6);
      tx(gsap.utils.clamp(-1, 1, px) * 6);
      ty(gsap.utils.clamp(-1, 1, py) * 6);
    };
    const onLeave = () => {
      rx(0); ry(0); tx(0); ty(0);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      onLeave();
    };
  }, [ready]);

  // Keyboard shortcuts once ready (Enter = start selected mode).
  useEffect(() => {
    if (!ready) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleEnter(mode);
        return;
      }
      if (e.key === 'j' || e.key === 'J') setMode(isMobile ? 'linear' : 'journey');
      if (e.key === 'q' || e.key === 'Q') setMode('linear');

      if (e.key === 'w' || e.key === 'W') {
        handleEnter(mode, mode === 'journey'
          ? { kind: 'journeyProgress', progress: 0.50 }
          : { kind: 'anchor', id: 'work' }
        );
      }
      if (e.key === 'p' || e.key === 'P') {
        handleEnter(mode, mode === 'journey'
          ? { kind: 'journeyProgress', progress: 0.76 }
          : { kind: 'anchor', id: 'work' }
        );
      }
      if (e.key === 's' || e.key === 'S') {
        handleEnter(mode, mode === 'journey'
          ? { kind: 'journeyProgress', progress: 0.975 }
          : { kind: 'anchor', id: 'skills' }
        );
      }
      if (e.key === 'c' || e.key === 'C') {
        handleEnter(mode, mode === 'journey'
          ? { kind: 'journeyProgress', progress: 0.995 }
          : { kind: 'anchor', id: 'contact' }
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [ready, mode, isMobile]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9000] flex flex-col items-center justify-center"
      style={{ background: 'rgba(2, 4, 8, 0.92)' }}
    >
      {/* Scanline / glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 55% 40% at 50% 45%, rgba(0,229,255,0.06) 0%, transparent 70%)',
            'radial-gradient(ellipse 45% 35% at 25% 55%, rgba(155,109,255,0.05) 0%, transparent 70%)',
            'radial-gradient(ellipse 55% 40% at 75% 35%, rgba(200,255,0,0.04) 0%, transparent 70%)',
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(140,180,255,0.012) 3px, rgba(140,180,255,0.012) 4px)',
          ].join(', '),
          opacity: 0.9,
        }}
      />

      <div ref={nameRef} className="mb-16 text-center">
        <h1
          className="font-display font-bold tracking-tight leading-none"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', color: 'var(--fg)' }}
        >
          Danish <span className="text-gradient">Shard</span>
        </h1>
        <p
          className="mt-4 text-sm tracking-[0.2em] uppercase"
          style={{ color: 'var(--muted)' }}
        >
          Developer · Engineer · Builder
        </p>
      </div>

      <div className="w-full max-w-xs px-6">
        <div
          className="flex justify-between text-xs tracking-widest uppercase mb-3"
          style={{ color: 'var(--muted)' }}
        >
          <span>Loading</span>
          <span style={{ color: 'var(--accent)' }}>
            {String(progress).padStart(3, '0')}
          </span>
        </div>
        <div className="w-full h-px" style={{ background: 'var(--border)' }}>
          <div
            ref={barRef}
            className="h-full"
            style={{
              background: 'var(--accent)',
              width: `${progress}%`,
              transition: 'width 0.05s linear',
              boxShadow: '0 0 12px rgba(200, 255, 0, 0.4)',
            }}
          />
        </div>
      </div>

      {ready && (
        <div
          ref={cardRef}
          className="glass glass-highlight mt-10 px-6 py-6 w-[min(560px,calc(100vw-48px))]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: 'var(--muted)' }}>
                Mission Briefing
              </p>
              <p className="mt-2 font-display text-lg tracking-wide" style={{ color: 'var(--fg)' }}>
                Choose your route
              </p>
              <p className="mt-2 text-sm" style={{ color: 'var(--muted)', maxWidth: 420 }}>
                {mode === 'journey'
                  ? 'Scroll-driven space journey (best on desktop).'
                  : 'Classic portfolio sections (fast + direct).'}
                {' '}Press <span style={{ color: 'var(--accent)' }}>Enter</span> to start.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase" style={{ color: 'var(--muted)' }}>
              <span style={{ color: 'var(--accent)' }}>J</span>ourney
              <span className="mx-2" style={{ opacity: 0.5 }}>·</span>
              <span style={{ color: 'var(--accent)' }}>Q</span>uick
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            <button
              disabled={isMobile}
              onClick={() => handleEnter('journey')}
              onMouseEnter={() => (!isMobile ? setMode('journey') : null)}
              className="glass glass-glow text-left px-5 py-4 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                border: mode === 'journey' ? '1px solid rgba(200,255,0,0.35)' : '1px solid rgba(200,220,255,0.12)',
              }}
            >
              <div className="font-display text-sm font-semibold tracking-[0.22em] uppercase" style={{ color: 'var(--accent)' }}>
                Start Journey
              </div>
              <div className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                {isMobile ? 'Unavailable on mobile.' : 'Scroll to launch · Hover satellites · Full story mode.'}
              </div>
            </button>

            <button
              onClick={() => handleEnter('linear')}
              onMouseEnter={() => setMode('linear')}
              className="glass glass-glow text-left px-5 py-4 transition-all duration-300"
              style={{
                border: mode === 'linear' ? '1px solid rgba(0,229,255,0.30)' : '1px solid rgba(200,220,255,0.12)',
              }}
            >
              <div className="font-display text-sm font-semibold tracking-[0.22em] uppercase" style={{ color: 'var(--nebula-cyan)' }}>
                Quick Portfolio
              </div>
              <div className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                Jump straight to sections · Smooth scroll · Lightweight.
              </div>
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-[10px] tracking-[0.35em] uppercase mr-2" style={{ color: 'var(--muted)' }}>
              Jump
            </span>
            <button
              onClick={() => handleEnter(mode, mode === 'journey'
                ? { kind: 'journeyProgress', progress: 0 }
                : { kind: 'anchor', id: 'top' }
              )}
              className="glass px-3 py-2 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
              style={{ color: 'var(--fg)', borderRadius: 10, pointerEvents: 'auto' }}
            >
              Home
            </button>
            <button
              onClick={() => handleEnter(mode, mode === 'journey'
                ? { kind: 'journeyProgress', progress: 0.50 }
                : { kind: 'anchor', id: 'work' }
              )}
              className="glass px-3 py-2 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
              style={{ color: 'var(--fg)', borderRadius: 10, pointerEvents: 'auto' }}
            >
              <span style={{ color: 'var(--accent)' }}>W</span>ork
            </button>
            <button
              onClick={() => handleEnter(mode, mode === 'journey'
                ? { kind: 'journeyProgress', progress: 0.76 }
                : { kind: 'anchor', id: 'work' }
              )}
              className="glass px-3 py-2 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
              style={{ color: 'var(--fg)', borderRadius: 10, pointerEvents: 'auto' }}
            >
              <span style={{ color: 'var(--accent)' }}>P</span>rojects
            </button>
            <button
              onClick={() => handleEnter(mode, mode === 'journey'
                ? { kind: 'journeyProgress', progress: 0.975 }
                : { kind: 'anchor', id: 'skills' }
              )}
              className="glass px-3 py-2 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
              style={{ color: 'var(--fg)', borderRadius: 10, pointerEvents: 'auto' }}
            >
              <span style={{ color: 'var(--accent)' }}>S</span>tack
            </button>
            <button
              onClick={() => handleEnter(mode, mode === 'journey'
                ? { kind: 'journeyProgress', progress: 0.995 }
                : { kind: 'anchor', id: 'contact' }
              )}
              className="glass px-3 py-2 text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
              style={{ color: 'var(--fg)', borderRadius: 10, pointerEvents: 'auto' }}
            >
              <span style={{ color: 'var(--accent)' }}>C</span>ontact
            </button>
          </div>

          <div className="mt-4 text-[11px] tracking-[0.18em]" style={{ color: 'var(--muted)' }}>
            Tip: use keys <span style={{ color: 'var(--accent)' }}>W</span>/<span style={{ color: 'var(--accent)' }}>P</span>/<span style={{ color: 'var(--accent)' }}>S</span>/<span style={{ color: 'var(--accent)' }}>C</span> to jump instantly.
          </div>
        </div>
      )}
    </div>
  );
}
