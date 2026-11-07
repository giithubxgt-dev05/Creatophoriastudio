import React, { useState, useEffect, useRef } from 'react';

interface Skill {
  name: string;
  pct: number;
  color: string;
}

export const Skills: React.FC = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const skills: Skill[] = [
    { name: 'Adobe Illustrator', pct: 95, color: '#00E5A8' },
    { name: 'After Effects', pct: 90, color: '#53F3FF' },
    { name: 'Premiere Pro', pct: 88, color: '#7B61FF' },
    { name: 'Photoshop', pct: 92, color: '#00E5A8' },
    { name: 'Figma', pct: 85, color: '#53F3FF' },
    { name: 'Cinema 4D', pct: 80, color: '#7B61FF' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const r = 32;
  const circumference = 2 * Math.PI * r;

  return (
    <section id="skills" ref={sectionRef} className="py-24 sm:py-32 relative bg-[#0E1016]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#00E5A8] mb-4">
            <span className="w-3 h-[1px] bg-[#00E5A8]" />
            <span>Expertise</span>
          </div>
          <h2 className="font-['Syne'] text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Tools &amp; <span className="text-[#00E5A8]">technologies</span> we master.
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {skills.map((skill, idx) => {
            const strokeDashoffset = inView
              ? circumference - (skill.pct / 100) * circumference
              : circumference;

            return (
              <div key={idx} className="flex flex-col items-center gap-4 text-center group">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r={r}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="5"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r={r}
                      fill="none"
                      stroke={skill.color}
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      style={{
                        transition: 'stroke-dashoffset 1.6s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />
                  </svg>
                  <span className="absolute font-['Syne'] text-sm font-bold text-white">
                    {skill.pct}%
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#AEB4C2] group-hover:text-white transition-colors">
                  {skill.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
