import React, { useState, useEffect, useRef } from 'react';

export const About: React.FC = () => {
  const [inView, setInView] = useState(false);
  const [counts, setCounts] = useState({ projects: 0, clients: 0, years: 0, brands: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    const targets = { projects: 50, clients: 30, years: 2, brands: 15 };
    const duration = 1800;
    const start = performance.now();

    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setCounts({
        projects: Math.round(ease * targets.projects),
        clients: Math.round(ease * targets.clients),
        years: Math.round(ease * targets.years),
        brands: Math.round(ease * targets.brands)
      });

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }, [inView]);

  return (
    <section id="about" ref={sectionRef} className="py-24 sm:py-32 relative bg-[#07070A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Visual Column */}
          <div className="relative group max-w-lg mx-auto lg:max-w-none">
            {/* Top-left accent corner */}
            <div className="absolute -top-4 -left-4 w-16 h-16 border-t-2 border-l-2 border-[#00E5A8] rounded-tl-lg opacity-60 pointer-events-none" />

            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl shadow-black/80 border border-white/10">
              <img
                src="/about_portrait.png"
                alt="Creatophoria Studio creative director"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-transparent to-transparent opacity-70" />

              {/* Tag badge on image */}
              <div className="absolute bottom-6 left-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#00E5A8] font-semibold text-xs tracking-wider">
                Creative Studio
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#00E5A8]">
              <span className="w-3 h-[1px] bg-[#00E5A8]" />
              <span>About Us</span>
            </div>

            <h2 className="font-['Syne'] text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
              We are a <em className="italic font-serif text-[#AEB4C2]">premium</em>
              <br />
              creative studio built for{' '}
              <span className="text-[#00E5A8]">impact.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#AEB4C2] leading-relaxed">
              Creatophoria Studio is where creativity meets strategy. We craft premium visual identities, stunning motion experiences, and unforgettable digital presence for brands that want to stand out in a crowded world.
            </p>

            <p className="text-sm sm:text-base text-[#6D7482] leading-relaxed">
              Every project is a collaboration. Every pixel has purpose. Every frame tells a story.
            </p>

            {/* Stats Counter Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 my-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="font-['Syne'] text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#00E5A8] to-[#53F3FF] bg-clip-text text-transparent">
                  {counts.projects}
                  <span className="text-[#00E5A8] text-xl font-bold">+</span>
                </div>
                <div className="text-[11px] uppercase tracking-wider text-[#6D7482] font-semibold mt-1">
                  Projects
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="font-['Syne'] text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#00E5A8] to-[#53F3FF] bg-clip-text text-transparent">
                  {counts.clients}
                  <span className="text-[#00E5A8] text-xl font-bold">+</span>
                </div>
                <div className="text-[11px] uppercase tracking-wider text-[#6D7482] font-semibold mt-1">
                  Happy Clients
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="font-['Syne'] text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#00E5A8] to-[#53F3FF] bg-clip-text text-transparent">
                  {counts.years}
                  <span className="text-[#00E5A8] text-xl font-bold">+</span>
                </div>
                <div className="text-[11px] uppercase tracking-wider text-[#6D7482] font-semibold mt-1">
                  Years Experience
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="font-['Syne'] text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#00E5A8] to-[#53F3FF] bg-clip-text text-transparent">
                  {counts.brands}
                  <span className="text-[#00E5A8] text-xl font-bold">+</span>
                </div>
                <div className="text-[11px] uppercase tracking-wider text-[#6D7482] font-semibold mt-1">
                  Brands Built
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#00E5A8] text-[#07070A] font-bold text-sm hover:bg-[#1affbf] transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#00E5A8]/20"
              >
                <span>Start a Project</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
