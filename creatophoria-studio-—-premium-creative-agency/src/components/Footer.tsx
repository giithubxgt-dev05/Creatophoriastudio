import React, { useRef } from 'react';

interface FooterProps {
  onSecretTrigger?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSecretTrigger }) => {
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSecretLogoClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      onSecretTrigger?.();
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 700);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="relative pt-24 pb-12 bg-[#0E1016] border-t border-white/10 overflow-hidden">
      {/* Giant ambient watermark */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-['Syne'] text-[12vw] font-black text-white/[0.015] pointer-events-none select-none tracking-tight whitespace-nowrap">
        CREATOPHORIA
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <div
              onClick={handleSecretLogoClick}
              className="flex items-center gap-3 cursor-pointer group w-max select-none"
            >
              <div className="w-10 h-10 relative flex-shrink-0 flex items-center justify-center">
                <img
                  src="/creatophoria_logo.png"
                  alt="Creatophoria Emblem"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(0,229,168,0.35)] group-hover:scale-110 group-hover:drop-shadow-[0_0_18px_rgba(0,229,168,0.65)] transition-all duration-300"
                />
              </div>
              <span className="font-['Syne'] text-xl font-extrabold text-white">
                Creatophoria Studio
              </span>
            </div>
            <p className="text-sm text-[#AEB4C2] leading-relaxed max-w-sm">
              We don't just design. <br />
              We create experiences.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6D7482] mb-2">
              Studio
            </span>
            <a href="#about" className="text-sm text-[#AEB4C2] hover:text-[#00E5A8] transition-colors">
              About
            </a>
            <a href="#services" className="text-sm text-[#AEB4C2] hover:text-[#00E5A8] transition-colors">
              Services
            </a>
            <a href="#work" className="text-sm text-[#AEB4C2] hover:text-[#00E5A8] transition-colors">
              Work
            </a>
            <a href="#process" className="text-sm text-[#AEB4C2] hover:text-[#00E5A8] transition-colors">
              Process
            </a>
          </div>

          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6D7482] mb-2">
              Connect
            </span>
            <a
              href="https://www.instagram.com/creatophoria_studio?rpxt=MW1qY3RtYmxrdmpuZg=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#AEB4C2] hover:text-[#00E5A8] transition-colors"
            >
              Instagram
            </a>
            <a
              href="mailto:creatophoriastudio@gmail.com"
              className="text-sm text-[#AEB4C2] hover:text-[#00E5A8] transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6D7482]">
          <p>© 2026 Creatophoria Studio. All rights reserved.</p>
          <p>Crafted with obsessive attention to detail.</p>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#AEB4C2] hover:bg-[#00E5A8] hover:text-[#07070A] hover:border-[#00E5A8] transition-all transform hover:-translate-y-1 cursor-pointer"
            aria-label="Back to top"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};
