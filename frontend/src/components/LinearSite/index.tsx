import Hero from '../Hero';
import About from '../About';
import Work from '../Work';
import Skills from '../Skills';
import Contact from '../Contact';
import Footer from '../Footer';

export default function LinearSite() {
  return (
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
  );
}

