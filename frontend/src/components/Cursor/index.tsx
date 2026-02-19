import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Custom cursor: a small dot that follows instantly + a larger ring that lags behind.
 * On hover over [data-cursor="view"]: ring expands and shows "VIEW" label.
 * On hover over [data-cursor="link"]: ring shrinks and inverts.
 * Hidden on mobile/touch devices.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    // Move dot instantly
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(dot, { x: mouseX, y: mouseY });
    };

    // Lag ring with RAF
    const raf = gsap.ticker.add(() => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(ring, { x: ringX, y: ringY });
    });

    // Hover states
    const onEnter = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null;
      if (!target) return;
      const type = target.dataset.cursor;

      if (type === 'view') {
        gsap.to(ring, { scale: 3, duration: 0.4, ease: 'power2.out' });
        gsap.to(dot, { scale: 0, duration: 0.2 });
        if (labelRef.current) gsap.to(labelRef.current, { opacity: 1, duration: 0.3 });
      } else if (type === 'link') {
        gsap.to(ring, { scale: 0.5, mixBlendMode: 'difference', duration: 0.3 });
      } else if (type === 'text') {
        gsap.to(ring, { scaleX: 3, scaleY: 0.3, duration: 0.3, ease: 'power2.out' });
      }
    };

    const onLeave = () => {
      gsap.to(ring, { scale: 1, scaleX: 1, scaleY: 1, mixBlendMode: 'normal', duration: 0.4, ease: 'elastic.out(1, 0.5)' });
      gsap.to(dot, { scale: 1, duration: 0.3 });
      if (labelRef.current) gsap.to(labelRef.current, { opacity: 0, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseenter', onEnter, true);
    document.addEventListener('mouseleave', onLeave, true);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter, true);
      document.removeEventListener('mouseleave', onLeave, true);
      gsap.ticker.remove(raf);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[var(--accent)] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform' }}
      />
      {/* Ring */}
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
