import React, { useState } from 'react';

interface WorkItem {
  id: string;
  title: string;
  sub: string;
  category: 'branding' | 'motion' | 'social' | 'video';
  tags: string[];
  img?: string;
  isPlaceholder?: boolean;
  placeholderType?: 'video' | 'motion';
  large?: boolean;
  tall?: boolean;
}

export const Work: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'branding' | 'motion' | 'social' | 'video'>('all');

  const workItems: WorkItem[] = [
    {
      id: 'wi1',
      title: 'Nova Brand Identity',
      sub: 'Complete visual identity system',
      category: 'branding',
      tags: ['Branding', 'Identity'],
      img: '/work_branding.png',
      large: true
    },
    {
      id: 'wi2',
      title: 'Cinematic Reel 2025',
      sub: 'Motion graphics showreel',
      category: 'motion',
      tags: ['Motion', 'Animation'],
      img: '/work_motion.png'
    },
    {
      id: 'wi3',
      title: 'Social Campaign',
      sub: 'Multi-platform content strategy',
      category: 'social',
      tags: ['Social', 'Instagram'],
      img: '/work_social.png'
    },
    {
      id: 'wi4',
      title: 'Brand Experience',
      sub: '360° brand design system',
      category: 'branding',
      tags: ['Branding', 'Strategy'],
      img: '/portfolio_preview.png',
      tall: true
    },
    {
      id: 'wi5',
      title: 'Corporate Film',
      sub: 'Brand story in 60 seconds',
      category: 'video',
      tags: ['Video', '4K'],
      isPlaceholder: true,
      placeholderType: 'video'
    },
    {
      id: 'wi6',
      title: 'Logo Reveal Animation',
      sub: 'Premium animated logo sting',
      category: 'motion',
      tags: ['Motion', 'Logo'],
      isPlaceholder: true,
      placeholderType: 'motion'
    }
  ];

  const filteredItems = activeFilter === 'all'
    ? workItems
    : workItems.filter(item => item.category === activeFilter);

  return (
    <section id="work" className="py-24 sm:py-32 relative bg-[#07070A]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#00E5A8] mb-4">
              <span className="w-3 h-[1px] bg-[#00E5A8]" />
              <span>Portfolio</span>
            </div>
            <h2 className="font-['Syne'] text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Selected <span className="text-[#00E5A8]">work</span> that speaks volumes.
            </h2>
          </div>

          {/* Segmented Filter Dock */}
          <div className="inline-flex items-center p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md self-start md:self-auto">
            {(['all', 'branding', 'motion', 'social', 'video'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${
                  activeFilter === tab
                    ? 'bg-[#00E5A8] text-[#07070A] shadow-[0_0_15px_rgba(0,229,168,0.4)]'
                    : 'text-[#6D7482] hover:text-white'
                }`}
              >
                {tab === 'all' ? 'All Work' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`group relative rounded-3xl overflow-hidden border border-white/10 bg-[#0E1016] shadow-xl shadow-black/50 ${
                item.large ? 'md:col-span-2' : ''
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {item.isPlaceholder ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0E1016] to-[#181C26] group-hover:scale-105 transition-transform duration-500">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#00E5A8] text-2xl font-bold mb-3 shadow-inner">
                      {item.placeholderType === 'video' ? '▶' : '◈'}
                    </div>
                    <span className="text-xs uppercase tracking-widest text-[#6D7482] font-semibold">
                      {item.title}
                    </span>
                  </div>
                ) : (
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                )}

                {/* Hover overlay with case study preview */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-[#07070A]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <div className="flex gap-2 mb-3">
                    {item.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-[#00E5A8]/15 border border-[#00E5A8]/30 text-[#00E5A8] text-[10px] font-bold uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-['Syne'] text-xl sm:text-2xl font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#AEB4C2] mb-4">{item.sub}</p>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#00E5A8] tracking-widest uppercase hover:underline"
                  >
                    <span>View Case Study</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/5 border border-white/15 text-white font-bold text-sm hover:border-[#00E5A8] hover:text-[#00E5A8] transition-all transform hover:-translate-y-0.5"
          >
            <span>Let's work together</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
