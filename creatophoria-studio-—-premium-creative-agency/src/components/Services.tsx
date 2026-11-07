import React, { useRef } from 'react';

interface ServiceItem {
  num: string;
  title: string;
  desc: string;
  tags: string[];
  featured?: boolean;
}

export const Services: React.FC = () => {
  const services: ServiceItem[] = [
    {
      num: '01',
      title: 'Graphic Design',
      desc: 'Posters, flyers, banners, and editorial layouts that communicate with clarity and beauty.',
      tags: ['Print', 'Digital', 'Editorial']
    },
    {
      num: '02',
      title: 'Video Editing',
      desc: 'Cinematic video production and post-production with professional color grading and sound design.',
      tags: ['4K', 'Color Grade', 'Sound']
    },
    {
      num: '03',
      title: 'Motion Graphics',
      desc: 'Animated logos, title sequences, transitions, and visual effects that bring your brand to life.',
      tags: ['Animation', 'After Effects', '3D']
    },
    {
      num: '04',
      title: 'Brand Identity',
      desc: 'Complete brand systems including logo, typography, color palette, and brand guidelines that are timeless.',
      tags: ['Logo', 'Guidelines', 'Strategy'],
      featured: true
    },
    {
      num: '05',
      title: 'UI/UX Design',
      desc: 'Beautiful, intuitive interfaces and user experiences that convert visitors into loyal customers.',
      tags: ['Figma', 'Web', 'Mobile']
    },
    {
      num: '06',
      title: 'Social Media Design',
      desc: 'Platform-optimized content that stops the scroll, builds community, and drives engagement.',
      tags: ['Instagram', 'Reels', 'Stories']
    },
    {
      num: '07',
      title: 'Thumbnail Design',
      desc: 'High-converting YouTube thumbnails and video covers that boost click-through rates dramatically.',
      tags: ['YouTube', 'CTR', 'Viral']
    },
    {
      num: '08',
      title: 'Creative Strategy',
      desc: 'Data-driven creative direction and brand storytelling that aligns with your business objectives.',
      tags: ['Strategy', 'Direction', 'Story']
    }
  ];

  return (
    <section id="services" className="py-24 sm:py-32 relative bg-[#07070A]/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#00E5A8] mb-4">
            <span className="w-3 h-[1px] bg-[#00E5A8]" />
            <span>What We Do</span>
          </div>
          <h2 className="font-['Syne'] text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Services that <span className="text-[#00E5A8]">elevate</span> your brand.
          </h2>
          <p className="text-base text-[#AEB4C2] mt-4 max-w-xl">
            From brand identity to motion graphics — we handle every visual touchpoint with obsessive precision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((svc) => (
            <ServiceCard key={svc.num} svc={svc} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ServiceCard: React.FC<{ svc: ServiceItem }> = ({ svc }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotX = -dy * 8;
    const rotY = dx * 8;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 ease-out border overflow-hidden ${
        svc.featured
          ? 'bg-[#00E5A8]/[0.04] border-[#00E5A8]/40 hover:border-[#00E5A8] shadow-[0_0_35px_rgba(0,229,168,0.15)]'
          : 'bg-white/[0.035] border-white/10 hover:border-[#00E5A8]/30 hover:bg-white/[0.06] shadow-xl shadow-black/40'
      }`}
    >
      {/* Top glowing line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E5A8] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {svc.featured && (
        <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#00E5A8] text-[#07070A] text-[9px] font-extrabold uppercase tracking-widest">
          Most Popular
        </span>
      )}

      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00E5A8] group-hover:scale-110 transition-transform">
            <ServiceIcon num={svc.num} />
          </div>
          <span className="text-xs font-mono font-bold text-[#6D7482]">{svc.num}</span>
        </div>

        <h3 className="font-['Syne'] text-lg font-bold text-white mb-2 group-hover:text-[#00E5A8] transition-colors">
          {svc.title}
        </h3>

        <p className="text-xs sm:text-sm text-[#AEB4C2] leading-relaxed mb-6">
          {svc.desc}
        </p>
      </div>

      <div>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {svc.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-[#6D7482] group-hover:text-[#00E5A8] group-hover:border-[#00E5A8]/20 transition-colors uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center text-[#6D7482] group-hover:text-[#00E5A8] font-bold text-lg group-hover:translate-x-1.5 transition-all">
          →
        </div>
      </div>
    </div>
  );
};

const ServiceIcon: React.FC<{ num: string }> = ({ num }) => {
  switch (num) {
    case '01':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-6 h-6">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      );
    case '02':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-6 h-6">
          <path d="M23 7l-7 5 7 5V7z" />
          <rect x="1" y="5" width="15" height="14" rx="2" />
        </svg>
      );
    case '03':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-6 h-6">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case '04':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-6 h-6">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      );
    case '05':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-6 h-6">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case '06':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-6 h-6">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case '07':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-6 h-6">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      );
    case '08':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-6 h-6">
          <circle cx="12" cy="12" r="10" />
          <polygon points="12 6 12 12 16 14" />
        </svg>
      );
  }
};
