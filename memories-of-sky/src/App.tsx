import { AppProvider } from '@/context/AppContext';
import { useLenis } from '@/hooks/useLenis';
import VideoBackground from '@/sections/VideoBackground';
import ParticleCanvas from '@/sections/ParticleCanvas';
import Navbar from '@/sections/Navbar';
import TimeSlider from '@/sections/TimeSlider';
import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Gallery from '@/sections/Gallery';
import Seasons from '@/sections/Seasons';
import Footer from '@/sections/Footer';

function AppContent() {
  useLenis();

  return (
    <>
      {/* Background layers */}
      <VideoBackground />
      <div className="vignette-overlay" />
      <ParticleCanvas />

      {/* Fixed UI */}
      <Navbar />
      <TimeSlider />

      {/* Page content */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Gallery />
        <Seasons />
        <Footer />
      </main>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
