import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSound } from '../../context/SoundContext';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
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
        gsap.from(btnRef.current, {
          opacity: 0,
          y: 15,
          duration: 0.6,
          ease: 'power3.out',
          delay: 0.1,
        });
      },
    }, 0);

    tl.from(barRef.current, {
      scaleX: 0,
      duration: 2,
      ease: 'power2.inOut',
      transformOrigin: 'left',
    }, 0);
  }, []);

  const handleEnter = () => {
    startAmbient();
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete,
    });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9000] flex flex-col items-center justify-center"
      style={{ background: 'rgba(2, 4, 8, 0.92)' }}
    >
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
        <button
          ref={btnRef}
          onClick={handleEnter}
          className="glass glass-glow mt-12 font-display text-sm font-semibold tracking-[0.3em] uppercase px-10 py-4 transition-all duration-300"
          style={{ color: 'var(--accent)', border: '1px solid rgba(200, 255, 0, 0.25)' }}
        >
          Enter
        </button>
      )}
    </div>
  );
}
