import { useEffect, useMemo, useRef, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import Cursor from './components/Cursor';
import ParticleField from './components/ParticleField';
import SpaceJourney from './components/SpaceJourney';
import SpaceEffects from './components/SpaceEffects';
import ContentOverlays from './components/ContentOverlays';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import CockpitFrame from './components/CockpitFrame';
import MusicButton from './components/MusicButton';
import LinearSite from './components/LinearSite';

export type EntryMode = 'journey' | 'linear';
type EntryJump =
  | { kind: 'journeyProgress'; progress: number }
  | { kind: 'anchor'; id: string }
  | null;

export default function App() {
  const [entered, setEntered] = useState(false);
  const [entryMode, setEntryMode] = useState<EntryMode>('journey');
  const [entryJump, setEntryJump] = useState<EntryJump>(null);
  const isMobileRef = useRef(
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => { isMobileRef.current = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isMobile = isMobileRef.current;
  const effectiveMode: EntryMode = useMemo(() => (isMobile ? 'linear' : entryMode), [isMobile, entryMode]);

  // After entering, optionally jump to a specific part of the experience.
  useEffect(() => {
    if (!entered || !entryJump) return;

    let raf = 0;
    let tries = 0;
    const maxTries = 18;

    const attempt = () => {
      tries += 1;

      if (entryJump.kind === 'anchor') {
        if (entryJump.id === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setEntryJump(null);
          return;
        }
        const el = document.getElementById(entryJump.id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setEntryJump(null);
        return;
      }

      // Journey scroll is driven by page height; wait until layout is ready.
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        window.scrollTo({ top: maxScroll * entryJump.progress, behavior: 'smooth' });
        setEntryJump(null);
        return;
      }

      if (tries < maxTries) raf = window.requestAnimationFrame(attempt);
      else setEntryJump(null);
    };

    raf = window.requestAnimationFrame(attempt);
    return () => window.cancelAnimationFrame(raf);
  }, [entered, entryJump]);

  return (
    <ThemeProvider>
      <SoundProvider>
      <Cursor />

      <ParticleField />

      {!entered && (
        <Preloader
          isMobile={isMobile}
          onComplete={(mode, jump) => {
            setEntryMode(mode);
            setEntryJump(jump ?? null);
            setEntered(true);
          }}
        />
      )}

      {entered && !isMobile && effectiveMode === 'journey' && (
        <>
          <SpaceJourney />
          <SpaceEffects />
          <CockpitFrame />
          <ContentOverlays />
          <div style={{ height: '900vh' }} />
        </>
      )}

      {entered && (isMobile || effectiveMode === 'linear') && <LinearSite />}

      <Navbar mode={effectiveMode} />
      <MusicButton />
      </SoundProvider>
    </ThemeProvider>
  );
}
