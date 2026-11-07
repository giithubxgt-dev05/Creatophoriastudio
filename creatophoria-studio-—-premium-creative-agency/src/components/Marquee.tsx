import React from 'react';

export const Marquee: React.FC = () => {
  const items = [
    'Graphic Design',
    'Motion Graphics',
    'Brand Identity',
    'Video Editing',
    'UI/UX Design',
    'Social Media',
    'Thumbnail Design',
    'Creative Strategy'
  ];

  return (
    <div className="relative overflow-hidden py-6 border-y border-white/10 bg-[#0E1016]">
      {/* Edge gradient masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0E1016] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0E1016] to-transparent z-10" />

      <div className="animate-marquee flex items-center gap-8">
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <React.Fragment key={idx}>
            <span className="text-xs sm:text-sm font-bold tracking-[0.15em] uppercase text-[#6D7482] hover:text-[#00E5A8] transition-colors whitespace-nowrap cursor-default">
              {item}
            </span>
            <span className="text-[#00E5A8] text-xs">✦</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
