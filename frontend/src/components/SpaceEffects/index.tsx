import { useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════ CONFIG ═════════════════════════════════ */

const STREAK_COUNT = 55;

const NEBULA_CLOUDS = [
  { x: '8%',  y: '18%', w: 520, h: 360, r: 155, g: 109, b: 255, a: 0.05 },
  { x: '62%', y: '42%', w: 620, h: 420, r: 0,   g: 229, b: 255, a: 0.04 },
  { x: '22%', y: '68%', w: 460, h: 320, r: 255, g: 107, b: 157, a: 0.035 },
  { x: '78%', y: '12%', w: 380, h: 290, r: 200, g: 255, b: 0,   a: 0.025 },
];

const COMETS = [
  { angle: -28, delay: 5,  dur: 7,  x0: -5,  y0: 12 },
  { angle: -38, delay: 18, dur: 9,  x0: 25,  y0: -8 },
  { angle: -22, delay: 32, dur: 6,  x0: 55,  y0: -6 },
  { angle: -30, delay: 45, dur: 8,  x0: 80,  y0: -4 },
];

/* ═══════════════════════════ COMPONENT ══════════════════════════════ */

export default function SpaceEffects() {
  const warpRef   = useRef<HTMLDivElement>(null);
  const nebulaRef = useRef<HTMLDivElement>(null);
  const flareRef  = useRef<HTMLDivElement>(null);

  const streaks = useMemo(() =>
    Array.from({ length: STREAK_COUNT }, (_, i) => ({
      angle: (i / STREAK_COUNT) * 360,
      len: 100 + Math.random() * 300,
      delay: Math.random() * 2.2,
      dur: 0.5 + Math.random() * 1.6,
      w: 0.4 + Math.random() * 1.2,
      alpha: 0.06 + Math.random() * 0.14,
    })),
  []);

  useGSAP(() => {
    gsap.set(warpRef.current, { opacity: 0 });
    gsap.set(nebulaRef.current, { opacity: 0 });
    gsap.set(flareRef.current, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });

    // Warp streaks: visible during ascent → early deep space (20–40%)
    tl.to(warpRef.current, { opacity: 1, duration: 3, ease: 'power2.out' }, 20)
      .to(warpRef.current, { opacity: 0, duration: 5, ease: 'power2.in' }, 35);

    // Nebula clouds: visible during deep space (42–70%)
    tl.to(nebulaRef.current, { opacity: 1, duration: 6, ease: 'power2.out' }, 42)
      .to(nebulaRef.current, { opacity: 0, duration: 5, ease: 'power2.in' }, 65);

    // Lens flare: bright during launch burn (18–24%) and landing burns
    tl.to(flareRef.current, { opacity: 0.7, duration: 2, ease: 'power4.out' }, 18)
      .to(flareRef.current, { opacity: 0, duration: 4, ease: 'power2.in' }, 24)
      .to(flareRef.current, { opacity: 0.5, duration: 2, ease: 'power2.out' }, 72)
      .to(flareRef.current, { opacity: 0, duration: 3, ease: 'power2.in' }, 78)
      .to(flareRef.current, { opacity: 0.4, duration: 1, ease: 'power2.out' }, 95)
      .to(flareRef.current, { opacity: 0, duration: 1.5, ease: 'power2.in' }, 97);
  });

  return (
    <div
      className="space-effects-layer"
      style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}
    >
      <style>{`
        @media (max-width: 768px) { .space-effects-layer { display: none !important; } }

        @keyframes warpGrow {
          0%   { transform: scaleY(0); opacity: 0; }
          12%  { opacity: 0.9; }
          100% { transform: scaleY(1); opacity: 0; }
        }
        @keyframes nebulaDrift {
          0%   { transform: translate(0, 0) scale(1); }
          25%  { transform: translate(25px, 15px) scale(1.06); }
          50%  { transform: translate(-15px, 30px) scale(1.12); }
          75%  { transform: translate(-25px, -20px) scale(0.96); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes cometFly {
          0%   { transform: translateX(0) translateY(0); opacity: 0; }
          2%   { opacity: 0.65; }
          100% { transform: translateX(130vw) translateY(55vh); opacity: 0; }
        }
        @keyframes flarePulse {
          0%, 100% { transform: translate(-50%, 0) scale(1);   opacity: 0.7; }
          50%      { transform: translate(-50%, 0) scale(1.15); opacity: 1; }
        }
      `}</style>

      {/* ── Warp streaks (radial speed lines during ascent) ── */}
      <div ref={warpRef} style={{ position: 'absolute', inset: 0, opacity: 0 }}>
        {streaks.map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transformOrigin: 'center top',
              transform: `rotate(${s.angle}deg)`,
            }}
          >
            <div
              style={{
                width: s.w,
                height: s.len,
                background: `linear-gradient(to bottom, transparent 0%, rgba(180,220,255,${s.alpha}) 25%, rgba(220,240,255,${s.alpha * 0.7}) 65%, transparent 100%)`,
                transformOrigin: 'top center',
                animation: `warpGrow ${s.dur}s ${s.delay}s ease-out infinite`,
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Nebula clouds (colored gas clouds in deep space) ── */}
      <div ref={nebulaRef} style={{ position: 'absolute', inset: 0, opacity: 0 }}>
        {NEBULA_CLOUDS.map((n, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: n.x, top: n.y,
              width: n.w, height: n.h,
              background: `radial-gradient(ellipse at center, rgba(${n.r},${n.g},${n.b},${n.a}), transparent 70%)`,
              filter: 'blur(55px)',
              animation: `nebulaDrift ${30 + i * 8}s ${i * 3}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Comets (occasional bright streaks) ── */}
      {COMETS.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${c.y0}%`, left: `${c.x0}%`,
            transform: `rotate(${c.angle}deg)`,
          }}
        >
          {/* Comet head (bright dot) + tail */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: 2.5,
                height: 80 + i * 15,
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(180,220,255,0.30), rgba(100,180,255,0.10), transparent)',
                borderRadius: 2,
                animation: `cometFly ${c.dur}s ${c.delay}s linear infinite`,
              }}
            />
            <div
              style={{
                position: 'absolute', top: -3, left: -2.5,
                width: 7, height: 7,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.8), rgba(180,220,255,0.3), transparent)',
                filter: 'blur(1px)',
                animation: `cometFly ${c.dur}s ${c.delay}s linear infinite`,
              }}
            />
          </div>
        </div>
      ))}

      {/* ── Lens flare (near rocket exhaust position) ── */}
      <div
        ref={flareRef}
        style={{
          position: 'absolute',
          bottom: 80, left: '50%',
          width: 500, height: 300,
          transform: 'translate(-50%, 0)',
          background: `
            radial-gradient(ellipse 60% 40% at 50% 30%, rgba(200,255,0,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 50% 50%, rgba(255,180,0,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 80% 20% at 50% 40%, rgba(255,100,0,0.06) 0%, transparent 50%)
          `,
          filter: 'blur(20px)',
          opacity: 0,
          animation: 'flarePulse 0.15s ease-in-out infinite alternate',
        }}
      />
    </div>
  );
}
