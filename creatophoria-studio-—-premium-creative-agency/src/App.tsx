import React, { useState, useEffect } from 'react';
import { Cursor } from './components/Cursor';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { About } from './components/About';
import { Services } from './components/Services';
import { Work } from './components/Work';
import { Clients } from './components/Clients';
import { Process } from './components/Process';
import { Testimonials } from './components/Testimonials';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FounderAdminModal } from './components/FounderAdminModal';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [adminOpen, setAdminOpen] = useState(false);

  // Scroll Progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(Math.min((scrolled / total) * 100, 100));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Invisible Founder Portal triggers:
  // 1. Secret hotkey: Ctrl + Shift + A (or Cmd + Shift + A)
  // 2. Secret query parameter: ?admin=1
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setAdminOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1') {
      setAdminOpen(true);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#07070A] text-white selection:bg-[#00E5A8] selection:text-[#07070A] relative">
      {/* Custom Luxury Physical Cursor */}
      <Cursor />

      {/* Preloader */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* Top Scroll Progress Line */}
      <div
        className="fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-[#00E5A8] via-[#53F3FF] to-[#00E5A8] z-[10000] shadow-[0_0_12px_rgba(0,229,168,0.7)] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Public Navbar without admin clutter */}
      <Navbar />

      {/* Main Public Showcase */}
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Work />
        <Clients />
        <Process />
        <Testimonials />
        <Skills />
        <Contact />
      </main>

      {/* Clean Public Footer (secret triple-click on logo triggers admin) */}
      <Footer onSecretTrigger={() => setAdminOpen(true)} />

      {/* Private Founder Leads Modal (unlocked only with secret passcode) */}
      <FounderAdminModal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}
