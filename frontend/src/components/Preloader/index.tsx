import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

const LETTERS = 'DANISH'.split('');
// Nebula color palette per letter
const LETTER_COLORS = ['#e8e4ff', '#c8ff00', '#00e5ff', '#e8e4ff', '#9b6dff', '#e8e4ff'];

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef   = useRef<(HTMLSpanElement | null)[]>([]);
  const btnRef       = useRef<HTMLButtonElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);
  const [count, setCount]         = useState(0);
  const [showEnter, setShowEnter] = useState(false);

  useEffect(() => {
    const obj = { value: 0 };
    const tl  = gsap.timeline();

    tl.to(obj, {
      value: 100,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        const rounded = Math.round(obj.value);
        setCount(rounded);
        // Drive particle field ramp in ParticleField (listens for this event)
        window.dispatchEvent(
          new CustomEvent('particle-ramp', { detail: { progress: obj.value / 100 } })
        );
      },
      onComplete: () => {
        setShowEnter(true);
        gsap.from(btnRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: 'power3.out',
          delay: 0.1,
        });
      },
    });

    // Stagger in letters
    tl.from(lettersRef.current, { y: 80, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'power4.out' }, 0.2);

    // Grow progress line
    tl.from(lineRef.current, { scaleX: 0, duration: 2.5, ease: 'power2.inOut', transformOrigin: 'left' }, 0);
  }, []);

  const handleEnter = () => {
    const tl = gsap.timeline({ onComplete });
    tl.to(containerRef.current, {
      opacity: 0,
      scale: 1.04,
      duration: 0.8,
      ease: 'power2.inOut',
    });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9000] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'rgba(2, 4, 8, 0.92)' }}  /* semi-transparent — particles shine through */
    >
      {/* Name */}
      <div className="flex items-end gap-1 md:gap-2 mb-12 overflow-hidden">
        {LETTERS.map((l, i) => (
          <span
            key={i}
            ref={(el) => { lettersRef.current[i] = el; }}
            className="font-display text-[14vw] md:text-[10vw] leading-none select-none"
            style={{ color: LETTER_COLORS[i] }}
          >
            {l}
          </span>
        ))}
      </div>

      {/* Progress bar + counter */}
      <div className="w-full max-w-sm px-8">
        <div className="flex justify-between text-xs tracking-widest uppercase mb-2" style={{ color: '#7a7a9a' }}>
          <span>Initialising</span>
          <span style={{ color: '#c8ff00' }}>{String(count).padStart(3, '0')}</span>
        </div>
        <div className="w-full h-px" style={{ background: 'rgba(200,200,255,0.08)' }}>
          <div
            ref={lineRef}
            className="h-full"
            style={{
              background: '#c8ff00',
              width: `${count}%`,
              transition: 'width 0.05s linear',
              boxShadow: '0 0 8px #c8ff00, 0 0 16px rgba(200,255,0,0.3)',
            }}
          />
        </div>
      </div>

      {/* Enter button */}
      {showEnter && (
        <button
          ref={btnRef}
          onClick={handleEnter}
          data-cursor="link"
          className="glass glass-glow mt-16 font-display text-sm tracking-[0.4em] uppercase px-8 py-4 transition-all duration-300"
          style={{ color: 'var(--accent)', border: '1px solid rgba(200,255,0,0.35)' }}
        >
          Enter Universe
        </button>
      )}

      {/* Bottom tagline */}
      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] uppercase whitespace-nowrap" style={{ color: '#3a3a5a' }}>
        Creative Developer · Bangalore
      </p>
    </div>
  );
}
