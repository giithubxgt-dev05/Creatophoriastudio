import React, { useState, useEffect } from 'react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07070A]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-10 h-10 relative flex-shrink-0 flex items-center justify-center">
            <img
              src="/creatophoria_logo.png"
              alt="Creatophoria Emblem"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(0,229,168,0.45)] group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(0,229,168,0.75)] transition-all duration-300"
            />
          </div>
          <span className="font-['Syne'] text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-[#00E5A8] bg-clip-text text-transparent">
            Creatophoria
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-9">
          <a href="#about" className="text-sm font-medium text-[#AEB4C2] hover:text-white transition-colors relative py-1">
            About
          </a>
          <a href="#services" className="text-sm font-medium text-[#AEB4C2] hover:text-white transition-colors relative py-1">
            Services
          </a>
          <a href="#work" className="text-sm font-medium text-[#AEB4C2] hover:text-white transition-colors relative py-1">
            Work
          </a>
          <a href="#process" className="text-sm font-medium text-[#AEB4C2] hover:text-white transition-colors relative py-1">
            Process
          </a>
          <a href="#contact" className="text-sm font-medium text-[#AEB4C2] hover:text-white transition-colors relative py-1">
            Contact
          </a>
        </div>

        {/* Primary CTA */}
        <div className="hidden md:flex items-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00E5A8] text-[#07070A] text-sm font-bold rounded-full hover:bg-[#1affbf] transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(0,229,168,0.3)] hover:shadow-[0_0_28px_rgba(0,229,168,0.5)]"
          >
            <span>Book a Project</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 text-white focus:outline-none cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <span className={`block w-6 h-[2px] bg-white transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-[2px] bg-white transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-white transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#07070A]/95 backdrop-blur-2xl border-b border-white/10 px-8 py-6 flex flex-col gap-4 animate-in fade-in duration-200">
          <a
            href="#about"
            onClick={() => setMobileOpen(false)}
            className="text-base text-[#AEB4C2] hover:text-[#00E5A8] py-2 border-b border-white/5"
          >
            About
          </a>
          <a
            href="#services"
            onClick={() => setMobileOpen(false)}
            className="text-base text-[#AEB4C2] hover:text-[#00E5A8] py-2 border-b border-white/5"
          >
            Services
          </a>
          <a
            href="#work"
            onClick={() => setMobileOpen(false)}
            className="text-base text-[#AEB4C2] hover:text-[#00E5A8] py-2 border-b border-white/5"
          >
            Work
          </a>
          <a
            href="#process"
            onClick={() => setMobileOpen(false)}
            className="text-base text-[#AEB4C2] hover:text-[#00E5A8] py-2 border-b border-white/5"
          >
            Process
          </a>
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="text-base text-[#AEB4C2] hover:text-[#00E5A8] py-2 border-b border-white/5"
          >
            Contact
          </a>
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="mt-2 text-center py-3 bg-[#00E5A8] text-[#07070A] font-bold rounded-xl text-sm"
          >
            Book a Project
          </a>
        </div>
      )}
    </nav>
  );
};
