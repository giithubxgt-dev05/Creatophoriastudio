import React from 'react';

export const Clients: React.FC = () => {
  const clients = [
    'Creative Co.',
    'Nova Agency',
    'Pixel Studio',
    'Brand House',
    'Motion Lab',
    'Visual Works',
    'Luxe Media'
  ];

  return (
    <div className="py-20 border-y border-white/10 bg-[#07070A]/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#6D7482]">
          Trusted By
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#07070A] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#07070A] to-transparent z-10" />

        <div className="animate-marquee flex items-center">
          {[...clients, ...clients, ...clients].map((client, idx) => (
            <div
              key={idx}
              className="px-14 py-2 font-['Syne'] text-base font-bold uppercase tracking-[0.15em] text-[#6D7482] hover:text-white transition-colors border-r border-white/10 whitespace-nowrap cursor-default"
            >
              {client}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
