import { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import Cursor from './components/Cursor';
import ParticleField from './components/ParticleField';
import SpaceJourney from './components/SpaceJourney';
import ContentOverlays from './components/ContentOverlays';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import CockpitFrame from './components/CockpitFrame';
import MusicButton from './components/MusicButton';
// Mobile-only imports (traditional stacked layout)
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [entered, setEntered] = useState(false);
  const isMobileRef = useRef(
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  );

  // Keep isMobileRef in sync on resize
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => { isMobileRef.current = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isMobile = isMobileRef.current;

  return (
    <ThemeProvider>
      <SoundProvider>
      <Cursor />

      {/* ParticleField — always mounted */}
      <ParticleField />

      {!entered && <Preloader onComplete={() => setEntered(true)} />}

      {/* ── Desktop cinematic layout ── */}
      {entered && !isMobile && (
        <>
          {/* Fixed visual layer: rocket journey + cockpit + content overlays */}
          <SpaceJourney />
          <CockpitFrame />
          <ContentOverlays />

          {/* 900vh scroll spacer — extended for Earth → Moon → Mars → Earth journey */}
          <div style={{ height: '900vh' }} />
        </>
      )}

      {/* ── Mobile traditional layout ── */}
      {entered && isMobile && (
        <div style={{ opacity: 1, position: 'relative', zIndex: 2 }}>
          <main>
            <Hero />
            <About />
            <Work />
            <Skills />
            <Contact />
          </main>
          <Footer />
        </div>
      )}

      {/* Navbar — always on top */}
      <Navbar />

      {/* Music toggle — always visible, bottom-right corner */}
      <MusicButton />
      </SoundProvider>
    </ThemeProvider>
  );
}
