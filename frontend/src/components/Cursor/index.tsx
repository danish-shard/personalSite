import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    let activeCursorEl: HTMLElement | null = null;

    // Satellite orbit pause state (JS-controlled for reliability)
    let currentSatOrbit: HTMLElement | null = null;
    let currentSatHitbox: HTMLElement | null = null;
    let unpauseTimer = 0;

    const pauseOrbit = (hitbox: HTMLElement | null) => {
      const orbit = hitbox?.closest('.sat-orbit') as HTMLElement | null;

      if (orbit === currentSatOrbit) return;

      clearTimeout(unpauseTimer);

      if (orbit) {
        if (currentSatOrbit) {
          currentSatOrbit.classList.remove('paused');
          currentSatHitbox?.classList.remove('active');
        }
        currentSatOrbit = orbit;
        currentSatHitbox = hitbox?.closest('.sat-hitbox') as HTMLElement | null;
        orbit.classList.add('paused');
        currentSatHitbox?.classList.add('active');
      } else {
        unpauseTimer = window.setTimeout(() => {
          currentSatOrbit?.classList.remove('paused');
          currentSatHitbox?.classList.remove('active');
          currentSatOrbit = null;
          currentSatHitbox = null;
        }, 100);
      }
    };

    const applyType = (type: string | null) => {
      if (type === 'view') {
        gsap.to(ring, { scaleX: 3, scaleY: 3, mixBlendMode: 'normal', duration: 0.4, ease: 'power2.out' });
        gsap.to(dot,  { scale: 0, duration: 0.2 });
        gsap.to(label, { opacity: 1, duration: 0.3 });
      } else if (type === 'link') {
        gsap.to(ring, { scaleX: 0.5, scaleY: 0.5, mixBlendMode: 'difference', duration: 0.3 });
        gsap.to(dot,  { scale: 1, duration: 0.2 });
        gsap.to(label, { opacity: 0, duration: 0.2 });
      } else if (type === 'text') {
        gsap.to(ring, { scaleX: 3, scaleY: 0.3, mixBlendMode: 'normal', duration: 0.3, ease: 'power2.out' });
        gsap.to(dot,  { scale: 1, duration: 0.2 });
        gsap.to(label, { opacity: 0, duration: 0.2 });
      } else {
        gsap.to(ring, { scaleX: 1, scaleY: 1, mixBlendMode: 'normal', duration: 0.4, ease: 'elastic.out(1, 0.5)' });
        gsap.to(dot,  { scale: 1, duration: 0.3 });
        gsap.to(label, { opacity: 0, duration: 0.2 });
      }
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(dot, { x: mouseX, y: mouseY });

      const hitEl = document.elementFromPoint(mouseX, mouseY);
      const cursorEl = (hitEl as HTMLElement | null)?.closest?.('[data-cursor]') as HTMLElement | null ?? null;

      const satHitbox = (hitEl as HTMLElement | null)?.closest?.('.sat-hitbox') as HTMLElement | null ?? null;
      pauseOrbit(satHitbox);

      if (cursorEl !== activeCursorEl) {
        activeCursorEl = cursorEl;
        applyType(cursorEl?.dataset.cursor ?? null);
      }
    };

    const onLeaveWindow = () => {
      activeCursorEl = null;
      applyType(null);
      pauseOrbit(null);
    };

    const raf = gsap.ticker.add(() => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(ring, { x: ringX, y: ringY });
    });

    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow);
      gsap.ticker.remove(raf);
      clearTimeout(unpauseTimer);
      currentSatOrbit?.classList.remove('paused');
      currentSatHitbox?.classList.remove('active');
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[var(--accent)] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-[var(--fg)] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{ willChange: 'transform', opacity: 0.6 }}
      >
        <span
          ref={labelRef}
          className="text-[9px] font-display uppercase tracking-widest opacity-0 select-none"
          style={{ color: 'var(--bg)' }}
        >
          View
        </span>
      </div>
    </>
  );
}
