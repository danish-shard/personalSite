import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSound } from '../../context/SoundContext';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Instrument gauge ─────────────────────────────────────────────────────────

function Indicator({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        border: `1.5px solid ${color}55`,
        boxShadow: `0 0 18px ${color}44, inset 0 0 10px ${color}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: -4, borderRadius: '50%',
          border: `1px solid ${color}22`,
          animation: 'hudPulse 2s ease-in-out infinite',
        }} />
        <span style={{
          fontSize: 18, color, fontFamily: 'monospace', fontWeight: 800,
          textShadow: `0 0 12px ${color}99`,
          letterSpacing: '0.02em',
        }}>
          {value}
        </span>
      </div>
      <span style={{
        fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgba(140,160,200,0.70)', fontFamily: 'inherit', fontWeight: 600,
      }}>
        {label}
      </span>
    </div>
  );
}

// ─── CockpitFrame ─────────────────────────────────────────────────────────────

export default function CockpitFrame() {
  const wrapRef        = useRef<HTMLDivElement>(null);
  const clockRef       = useRef<HTMLSpanElement>(null);
  const phaseRef       = useRef<HTMLSpanElement>(null);
  const workAlertRef   = useRef<HTMLDivElement>(null); // work-experience alert (deep space)
  const projectAlertRef = useRef<HTMLDivElement>(null); // project manifest alert (moon phase)

  const { muted, toggleMute, startAmbient, playTransmission, playWhoosh } = useSound();

  // Track which scroll-driven sounds have already fired (to avoid re-triggers while scrubbing)
  const soundState = useRef({
    ambientStarted: false,
    transmitted: false,
    whooshFired: [false, false, false, false, false],
  });

  // Mission clock — ticks while component is mounted
  useEffect(() => {
    let seconds = 0;
    const id = setInterval(() => {
      seconds++;
      if (!clockRef.current) return;
      const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
      const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      clockRef.current.textContent = `T+ ${h}:${m}:${s}`;
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Phase label — DOM mutation on scroll, no re-render
  useEffect(() => {
    const onScroll = () => {
      if (!phaseRef.current) return;
      const max = document.body.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const p = window.scrollY / max;
      if      (p < 0.22) phaseRef.current.textContent = 'LAUNCH SEQUENCE';
      else if (p < 0.42) phaseRef.current.textContent = 'STAGE SEPARATION';
      else if (p < 0.72) phaseRef.current.textContent = 'DEEP SPACE TRANSIT';
      else if (p < 0.78) phaseRef.current.textContent = 'LUNAR APPROACH';
      else if (p < 0.90) phaseRef.current.textContent = 'MOON SURFACE';
      else if (p < 0.97) phaseRef.current.textContent = 'MARS APPROACH';
      else if (p < 0.99) phaseRef.current.textContent = 'MARS SURFACE';
      else               phaseRef.current.textContent = 'EARTH APPROACH';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sound triggers — tied to scroll progress thresholds
  useEffect(() => {
    const WHOOSH_AT = [0.44, 0.47, 0.50, 0.53, 0.56];

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const p = window.scrollY / max;

      // Ambient drone — start once user scrolls past launch
      if (p > 0.19 && !soundState.current.ambientStarted) {
        soundState.current.ambientStarted = true;
        startAmbient();
      }

      // Transmission chime — fires when work-experience asteroid field begins
      if (p > 0.44 && !soundState.current.transmitted) {
        soundState.current.transmitted = true;
        playTransmission();
      }
      if (p < 0.42) soundState.current.transmitted = false;

      // Per-asteroid whoosh
      WHOOSH_AT.forEach((thr, i) => {
        if (p > thr && !soundState.current.whooshFired[i]) {
          soundState.current.whooshFired[i] = true;
          setTimeout(() => playWhoosh(), i * 55);
        }
        if (p < thr - 0.02) soundState.current.whooshFired[i] = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [startAmbient, playTransmission, playWhoosh]);

  // Scroll-driven: fade whole frame + both alerts
  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.set(wrapRef.current,         { opacity: 0 });
    gsap.set(workAlertRef.current,    { opacity: 0 });
    gsap.set(projectAlertRef.current, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });

    // Cockpit frame: fade in 18→23%, fade out 96→100%
    tl.to(wrapRef.current,  { opacity: 1, duration: 5, ease: 'power2.out' }, 18)
      .to(wrapRef.current,  { opacity: 0, duration: 4, ease: 'power2.in'  }, 96)

    // Work-experience alert: visible during deep space asteroid phase (44–71%)
      .to(workAlertRef.current,    { opacity: 1, duration: 3, ease: 'power2.out' }, 44)
      .to(workAlertRef.current,    { opacity: 0, duration: 3, ease: 'power2.in'  }, 71)

    // Project manifest alert: visible during Moon approach + surface (72–82%)
      .to(projectAlertRef.current, { opacity: 1, duration: 3, ease: 'power2.out' }, 72)
      .to(projectAlertRef.current, { opacity: 0, duration: 3, ease: 'power2.in'  }, 82);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="cockpit-frame-layer"
      style={{
        position: 'fixed', inset: 0,
        zIndex: 4,
        pointerEvents: 'none',
        opacity: 0,
      }}
    >
      <style>{`
        @media (max-width: 768px) { .cockpit-frame-layer { display: none !important; } }

        @keyframes hudPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.9; transform: scale(1.15); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); opacity: 0; }
          10%  { opacity: 0.06; }
          90%  { opacity: 0.06; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes blinkDot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
        @keyframes alertBlink {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes alertScan {
          0%   { top: 0;    opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes phaseGlow {
          0%, 100% { text-shadow: 0 0 18px rgba(140,180,255,0.60), 0 0 40px rgba(80,130,255,0.25); }
          50%       { text-shadow: 0 0 28px rgba(140,180,255,0.90), 0 0 60px rgba(80,130,255,0.45); }
        }
        @keyframes projectPulse {
          0%, 100% { text-shadow: 0 0 10px rgba(200,255,0,0.50); }
          50%       { text-shadow: 0 0 18px rgba(200,255,0,0.85); }
        }
      `}</style>

      {/* ── Dark cockpit vignette ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: [
          'radial-gradient(ellipse 66% 60% at 50% 48%,',
          '  transparent 0%, transparent 52%,',
          '  rgba(6,8,18,0.45) 66%, rgba(4,6,14,0.82) 78%,',
          '  rgba(3,4,12,0.96) 90%, rgba(2,3,10,1.00) 100%)',
        ].join(' '),
      }} />

      {/* ── Window frame border ── */}
      <div style={{
        position: 'absolute',
        width: '66vw', height: '60vh',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -48%)',
        border: '1.5px solid rgba(140,170,220,0.28)',
        borderRadius: 18,
        boxShadow: [
          'inset 0 0 60px rgba(0,120,255,0.03)',
          '0 0 0 1px rgba(80,110,180,0.12)',
          '0 0 30px rgba(0,80,200,0.07)',
        ].join(', '),
      }} />

      {/* ── Corner bolts ── */}
      {[
        { top: 'calc(50% - 30vh + 14px)', left: 'calc(50% - 33vw + 14px)' },
        { top: 'calc(50% - 30vh + 14px)', left: 'calc(50% + 33vw - 22px)' },
        { top: 'calc(50% + 30vh - 22px)', left: 'calc(50% - 33vw + 14px)' },
        { top: 'calc(50% + 30vh - 22px)', left: 'calc(50% + 33vw - 22px)' },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', width: 8, height: 8, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180,200,240,0.55) 0%, rgba(100,130,180,0.30) 100%)',
          border: '1px solid rgba(160,185,230,0.25)',
          ...pos,
        }} />
      ))}

      {/* ── Glass glare ── */}
      <div style={{
        position: 'absolute',
        width: '42vw', height: '7vh',
        top: 'calc(50% - 30vh + 10px)', left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(to bottom, rgba(180,210,255,0.06), transparent)',
        borderRadius: '50% 50% 0 0',
        filter: 'blur(10px)',
      }} />

      {/* ── Scanline ── */}
      <div style={{
        position: 'absolute',
        width: '66vw', height: '2px',
        left: '50%', transform: 'translateX(-50%)',
        background: 'linear-gradient(to right, transparent, rgba(0,200,255,0.04), transparent)',
        animation: 'scanline 8s linear infinite',
      }} />

      {/* ── WORK EXPERIENCE ALERT (deep space, 44–71%) ── */}
      <div
        ref={workAlertRef}
        style={{
          position: 'absolute',
          top:   'calc(50% - 24vh)',
          right: 'calc(50% - 33vw + 24px)',
          width: 248,
          padding: '14px 18px 12px',
          background: 'rgba(2, 5, 18, 0.88)',
          border: '1px solid rgba(0, 200, 255, 0.35)',
          borderRadius: 8,
          backdropFilter: 'blur(10px)',
          overflow: 'hidden',
          opacity: 0,
        }}
      >
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: 'linear-gradient(to right, transparent, rgba(0,200,255,0.50), transparent)',
          animation: 'alertScan 2.4s ease-in-out infinite',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'rgba(0,220,255,0.90)',
            boxShadow: '0 0 8px rgba(0,200,255,0.80)',
            animation: 'alertBlink 1.1s ease-in-out infinite',
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(0,210,255,0.90)', fontFamily: 'inherit', fontWeight: 700,
          }}>
            INCOMING TRANSMISSION
          </span>
        </div>
        <div style={{ height: 1, background: 'rgba(0,180,255,0.18)', marginBottom: 9 }} />
        <div style={{
          fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'rgba(155,200,240,0.90)', fontFamily: 'inherit', fontWeight: 600,
          lineHeight: 1.8,
        }}>
          WORK EXPERIENCE LOG<br />
          <span style={{ fontSize: 11, color: 'rgba(110,165,210,0.70)', letterSpacing: '0.12em', fontWeight: 400 }}>
            5 OBJECTS ON APPROACH
          </span>
        </div>
      </div>

      {/* ── PROJECT MANIFEST ALERT (Moon phase, 72–82%) ── */}
      <div
        ref={projectAlertRef}
        style={{
          position: 'absolute',
          top:   'calc(50% - 24vh)',
          right: 'calc(50% - 33vw + 24px)',
          width: 248,
          padding: '14px 18px 12px',
          background: 'rgba(4, 8, 3, 0.90)',
          border: '1px solid rgba(200,255,0, 0.35)',
          borderRadius: 8,
          backdropFilter: 'blur(10px)',
          overflow: 'hidden',
          opacity: 0,
        }}
      >
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: 'linear-gradient(to right, transparent, rgba(200,255,0,0.50), transparent)',
          animation: 'alertScan 2.0s ease-in-out infinite',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'rgba(200,255,0,0.90)',
            boxShadow: '0 0 8px rgba(200,255,0,0.80)',
            animation: 'alertBlink 0.9s ease-in-out infinite',
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(200,255,0,0.90)', fontFamily: 'inherit', fontWeight: 700,
            animation: 'projectPulse 2s ease-in-out infinite',
          }}>
            MANIFEST DOWNLOADED
          </span>
        </div>
        <div style={{ height: 1, background: 'rgba(200,255,0,0.18)', marginBottom: 9 }} />
        <div style={{
          fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'rgba(200,240,155,0.90)', fontFamily: 'inherit', fontWeight: 600,
          lineHeight: 1.8,
        }}>
          PROJECT DATABASE<br />
          <span style={{ fontSize: 11, color: 'rgba(160,210,110,0.70)', letterSpacing: '0.12em', fontWeight: 400 }}>
            4 ACTIVE MISSIONS
          </span>
        </div>
      </div>

      {/* ── TOP HUD bar ── */}
      <div style={{
        position: 'absolute',
        top: 'calc(50% - 30vh - 44px)', left: '50%',
        transform: 'translateX(-50%)',
        width: '66vw',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 12px',
      }}>
        {/* Left: DS + phase label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{
            fontSize: 18, fontFamily: 'inherit', fontWeight: 900,
            letterSpacing: '0.35em', textTransform: 'uppercase',
            color: 'rgba(200,255,0,0.85)',
            textShadow: '0 0 16px rgba(200,255,0,0.55)',
          }}>
            DS
          </span>
          <span style={{
            width: 1, height: 18,
            background: 'rgba(140,160,200,0.28)',
            display: 'inline-block',
          }} />
          <span
            ref={phaseRef}
            style={{
              fontSize: 17, letterSpacing: '0.30em', textTransform: 'uppercase',
              color: 'rgba(140,180,240,0.90)', fontFamily: 'inherit', fontWeight: 700,
              animation: 'phaseGlow 3s ease-in-out infinite',
            }}
          >
            LAUNCH SEQUENCE
          </span>
        </div>

        {/* Center: LIVE dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'rgba(200,255,0,0.85)',
              boxShadow: '0 0 8px rgba(200,255,0,0.65)',
              animation: 'blinkDot 1.4s ease-in-out infinite',
            }} />
            <span style={{
              fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(200,255,0,0.65)', fontFamily: 'inherit', fontWeight: 600,
            }}>
              LIVE
            </span>
          </div>

          {/* Mute toggle — inline in HUD (secondary control; MusicButton is the primary) */}
          <button
            onClick={toggleMute}
            style={{
              pointerEvents: 'auto',
              background: 'none',
              border: '1px solid rgba(140,160,200,0.25)',
              borderRadius: 4,
              padding: '3px 10px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <span style={{
              fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: muted ? 'rgba(255,80,80,0.80)' : 'rgba(140,180,240,0.80)',
              fontFamily: 'inherit', fontWeight: 600,
            }}>
              {muted ? '∅ MUTE' : '♪ SND'}
            </span>
          </button>
        </div>

        {/* Right: mission clock */}
        <span
          ref={clockRef}
          style={{
            fontFamily: 'monospace', fontSize: 20, fontWeight: 700,
            letterSpacing: '0.12em', color: 'rgba(160,200,255,0.88)',
            textShadow: '0 0 14px rgba(100,160,255,0.45)',
          }}
        >
          T+ 00:00:00
        </span>
      </div>

      {/* ── BOTTOM instrument panel ── */}
      <div style={{
        position: 'absolute',
        bottom: 'calc(50% - 30vh - 72px)', left: '50%',
        transform: 'translateX(-50%)',
        width: '66vw',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 20px',
        background: 'rgba(4,6,16,0.65)',
        borderRadius: 10,
        border: '1px solid rgba(80,100,160,0.22)',
      }}>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <Indicator label="THR" value="9K"  color="#c8ff00" />
          <Indicator label="ALT" value="↑"   color="#00e5ff" />
          <Indicator label="VEL" value="M9"  color="#9b6dff" />
          <Indicator label="SYS" value="OK"  color="#c8ff00" />
        </div>

        <div style={{ flex: 1, height: 1, background: 'rgba(80,100,160,0.20)', margin: '0 20px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
          <span style={{
            fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(100,140,200,0.65)', fontFamily: 'inherit', fontWeight: 600,
          }}>
            ATTITUDE
          </span>
          <span style={{
            fontFamily: 'monospace', fontSize: 18, fontWeight: 700,
            color: 'rgba(140,180,240,0.88)', letterSpacing: '0.10em',
            textShadow: '0 0 10px rgba(80,130,220,0.35)',
          }}>
            000° · 90° · 000°
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, marginLeft: 20 }}>
          <div style={{
            width: 10, height: 52,
            background: 'rgba(30,35,60,1)',
            borderRadius: 5, border: '1px solid rgba(80,100,160,0.30)',
            overflow: 'hidden', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: '78%',
              background: 'linear-gradient(to top, rgba(200,255,0,0.90), rgba(255,160,0,0.70))',
              borderRadius: 'inherit',
              boxShadow: '0 0 10px rgba(200,255,0,0.5)',
            }} />
          </div>
          <span style={{
            fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(100,140,200,0.55)', fontFamily: 'inherit', fontWeight: 600,
          }}>
            THR
          </span>
        </div>
      </div>

      {/* ── Left crosshair arm ── */}
      <div style={{
        position: 'absolute',
        top: '50%', left: 'calc(50% - 33vw)',
        transform: 'translate(-100%, -50%)',
        display: 'flex', alignItems: 'center', gap: 8,
        opacity: 0.40,
      }}>
        <div style={{ width: 24, height: 1.5, background: 'rgba(0,200,255,0.55)' }} />
        <div style={{ width: 7, height: 7, borderRadius: '50%', border: '1.5px solid rgba(0,200,255,0.55)' }} />
      </div>

      {/* ── Right crosshair arm ── */}
      <div style={{
        position: 'absolute',
        top: '50%', left: 'calc(50% + 33vw)',
        transform: 'translate(0%, -50%)',
        display: 'flex', alignItems: 'center', gap: 8,
        opacity: 0.40,
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', border: '1.5px solid rgba(0,200,255,0.55)' }} />
        <div style={{ width: 24, height: 1.5, background: 'rgba(0,200,255,0.55)' }} />
      </div>
    </div>
  );
}
