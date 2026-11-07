import React from 'react';

export const Process: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Discover',
      desc: "Deep dive into your brand, goals, target audience, and competitive landscape to understand exactly what's needed."
    },
    {
      num: '02',
      title: 'Research',
      desc: 'Analyze trends, gather references, and define the creative direction through mood boards and style exploration.'
    },
    {
      num: '03',
      title: 'Design',
      desc: 'Craft stunning visual concepts with meticulous attention to detail, typography, color, and composition.'
    },
    {
      num: '04',
      title: 'Prototype',
      desc: 'Build interactive prototypes and mockups to validate concepts before final production begins.'
    },
    {
      num: '05',
      title: 'Deliver',
      desc: 'Final delivery of all assets with complete documentation, source files, and ongoing support.'
    }
  ];

  return (
    <section id="process" className="py-24 sm:py-32 relative bg-[#07070A]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#00E5A8] mb-4">
            <span className="w-3 h-[1px] bg-[#00E5A8]" />
            <span>Our Process</span>
          </div>
          <h2 className="font-['Syne'] text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            How we turn <br />
            <span className="text-[#00E5A8]">ideas into impact.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
          {steps.map((step, idx) => (
            <div key={step.num} className="flex flex-col items-center text-center group relative">
              <span className="text-xs font-mono font-bold text-[#6D7482] mb-3">{step.num}</span>

              {/* Glowing Icon Container */}
              <div className="w-18 h-18 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#00E5A8] mb-6 group-hover:border-[#00E5A8]/50 group-hover:bg-[#00E5A8]/5 transition-all shadow-lg group-hover:shadow-[0_0_30px_rgba(0,229,168,0.2)]">
                <ProcessIcon step={idx + 1} />
              </div>

              <h3 className="font-['Syne'] text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-xs sm:text-sm text-[#AEB4C2] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcessIcon: React.FC<{ step: number }> = ({ step }) => {
  switch (step) {
    case 1:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-7 h-7">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-7 h-7">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-7 h-7">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case 4:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-7 h-7">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case 5:
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-7 h-7">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
  }
};
