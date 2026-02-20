import { useEffect, useRef, useState } from 'react';
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

      <ParticleField />

      {!entered && <Preloader onComplete={() => setEntered(true)} />}

      {entered && !isMobile && (
        <>
          <SpaceJourney />
          <SpaceEffects />
          <CockpitFrame />
          <ContentOverlays />
          <div style={{ height: '900vh' }} />
        </>
      )}

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

      <Navbar />
      <MusicButton />
      </SoundProvider>
    </ThemeProvider>
  );
}
