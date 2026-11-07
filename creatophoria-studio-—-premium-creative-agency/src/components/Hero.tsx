import React, { useState, useEffect, useRef } from 'react';
import { AuroraCanvas } from './AuroraCanvas';

export const Hero: React.FC = () => {
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  const cyclingServices = [
    'Motion Graphics',
    'Video Editing',
    'Brand Identity',
    'UI/UX Design',
    'Social Media'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveServiceIdx(prev => (prev + 1) % cyclingServices.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [cyclingServices.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (e.clientX - rect.left - cx) * 0.015;
    const dy = (e.clientY - rect.top - cy) * 0.015;
    setMousePos({ x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-28 sm:pb-32 lg:pt-32 lg:pb-36 bg-[#07070A]"
    >
      <AuroraCanvas />

      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Mouse Follow Glow */}
      <div
        className="pointer-events-none absolute w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(0,229,168,0.12)_0%,transparent_70%)] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{
          left: `calc(50% + ${mousePos.x * 25}px)`,
          top: `calc(50% + ${mousePos.y * 25}px)`
        }}
      />

      {/* Symmetrical Left Floating Glass Dock */}
      <div
        className="hidden lg:flex absolute left-8 xl:left-14 top-1/2 -translate-y-1/2 flex-col gap-5 z-10 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePos.x}px, calc(-50% + ${mousePos.y}px))`
        }}
      >
        <div className="dock-float-1 glass-panel px-4 py-3 rounded-2xl flex items-center gap-3.5 w-48 shadow-xl shadow-black/40 hover:border-[#00E5A8]/40 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-[#00E5A8]/10 border border-[#00E5A8]/25 text-[#00E5A8] flex items-center justify-center font-bold text-sm">
            ✦
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#6D7482] font-semibold">
              Brand Identity
            </div>
            <div className="text-xs font-bold text-white tracking-tight">
              Premium Craft
            </div>
          </div>
        </div>

        <div className="dock-float-2 glass-panel px-4 py-3 rounded-2xl flex items-center gap-3.5 w-48 shadow-xl shadow-black/40 hover:border-[#00E5A8]/40 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-[#00E5A8]/10 border border-[#00E5A8]/25 text-[#00E5A8] flex items-center justify-center font-bold text-sm">
            ⬡
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#6D7482] font-semibold">
              Client Rating
            </div>
            <div className="text-xs font-bold text-[#00E5A8] tracking-tight">
              5.0 ★ Top Rated
            </div>
          </div>
        </div>
      </div>

      {/* Symmetrical Right Floating Glass Dock */}
      <div
        className="hidden lg:flex absolute right-8 xl:right-14 top-1/2 -translate-y-1/2 flex-col gap-5 z-10 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePos.x}px, calc(-50% + ${mousePos.y}px))`
        }}
      >
        <div className="dock-float-1 glass-panel px-4 py-3 rounded-2xl flex items-center gap-3.5 w-48 shadow-xl shadow-black/40 hover:border-[#00E5A8]/40 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-[#53F3FF]/10 border border-[#53F3FF]/25 text-[#53F3FF] flex items-center justify-center font-bold text-sm">
            ◈
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#6D7482] font-semibold">
              Motion Graphics
            </div>
            <div className="text-xs font-bold text-white tracking-tight">
              Cinematic 3D
            </div>
          </div>
        </div>

        <div className="dock-float-2 glass-panel px-4 py-3 rounded-2xl flex items-center gap-3.5 w-48 shadow-xl shadow-black/40 hover:border-[#00E5A8]/40 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-[#7B61FF]/10 border border-[#7B61FF]/25 text-[#7B61FF] flex items-center justify-center font-bold text-sm">
            ◇
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#6D7482] font-semibold">
              Video Editing
            </div>
            <div className="text-xs font-bold text-white tracking-tight">
              4K Commercial
            </div>
          </div>
        </div>
      </div>

      {/* Hero Centerpiece */}
      <div className="relative z-20 text-center max-w-4xl px-6 sm:px-10 flex flex-col items-center gap-7">
        {/* Availability Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00E5A8]/10 border border-[#00E5A8]/25 text-[#00E5A8] text-xs font-semibold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-[#00E5A8] animate-ping" />
          <span>Available for Projects · 2026</span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-['Syne'] font-extrabold text-5xl sm:text-7xl lg:text-8xl leading-none tracking-tight flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span className="text-white">We Don't</span>
            <span className="text-outline">Just Design.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span className="text-white">We Create</span>
            <span className="bg-gradient-to-r from-[#00E5A8] via-[#53F3FF] to-[#00E5A8] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,229,168,0.45)]">
              Experiences.
            </span>
          </div>
        </h1>

        {/* Dynamic cycling service tagline */}
        <div className="flex items-center gap-3 flex-wrap justify-center text-sm sm:text-base text-[#AEB4C2] font-medium">
          <span>Premium Graphic Design</span>
          <span className="text-[#6D7482]">·</span>
          <span className="text-[#00E5A8] font-bold min-w-[130px] transition-all duration-300">
            {cyclingServices[activeServiceIdx]}
          </span>
          <span className="text-[#6D7482]">·</span>
          <span>Brand Identity</span>
        </div>

        {/* Symmetrical Dual Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <a
            href="#work"
            className="inline-flex items-center justify-center gap-2.5 h-13 px-8 rounded-full bg-[#00E5A8] text-[#07070A] font-bold text-sm tracking-wide hover:bg-[#1affbf] transition-all transform hover:-translate-y-0.5 shadow-[0_4px_24px_rgba(0,229,168,0.35)] hover:shadow-[0_8px_32px_rgba(0,229,168,0.55)]"
          >
            <span>View Work</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2.5 h-13 px-8 rounded-full bg-white/5 border border-white/15 text-white font-bold text-sm tracking-wide backdrop-blur-md hover:border-[#00E5A8] hover:text-[#00E5A8] hover:bg-[#00E5A8]/5 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-black/20"
          >
            <span>Book a Project</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll Down Indicator - aligned with clear clearance from buttons */}
      <a
        href="#about"
        aria-label="Scroll to next section"
        className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 group cursor-pointer transition-opacity duration-300"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#6D7482] group-hover:text-[#00E5A8] transition-colors font-semibold select-none">
          Scroll
        </span>
        <div className="w-[1.5px] h-8 sm:h-9 bg-gradient-to-b from-[#00E5A8] via-[#00E5A8]/50 to-transparent rounded-full animate-pulse group-hover:scale-y-110 transition-transform origin-top" />
      </a>
    </section>
  );
};
