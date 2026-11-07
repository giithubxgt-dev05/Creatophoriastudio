import React from 'react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      stars: '★★★★★',
      text: '"Creatophoria completely transformed our brand. The attention to detail and creative thinking is on another level. Our brand now looks world-class."',
      name: 'Aryan Mehta',
      role: 'Founder, Nova Ventures',
      initial: 'A',
      gradient: 'from-[#00E5A8] to-[#53F3FF]',
      textColor: 'text-[#07070A]'
    },
    {
      stars: '★★★★★',
      text: '"The motion graphics they created for our product launch video were absolutely cinematic. Our audience was blown away. Highly recommend working with them."',
      name: 'Shreya Kapoor',
      role: 'Marketing Director, Pixel Labs',
      initial: 'S',
      gradient: 'from-[#7B61FF] to-[#53F3FF]',
      textColor: 'text-white'
    },
    {
      stars: '★★★★★',
      text: '"Fast turnaround, premium quality, and communication that makes every project smooth. They are now our go-to creative partner for everything visual."',
      name: 'Rajan Desai',
      role: 'CEO, Brand House Studio',
      initial: 'R',
      gradient: 'from-[#53F3FF] to-[#00E5A8]',
      textColor: 'text-[#07070A]'
    }
  ];

  return (
    <section id="testimonials" className="py-24 sm:py-32 relative bg-[#07070A]/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#00E5A8] mb-4">
            <span className="w-3 h-[1px] bg-[#00E5A8]" />
            <span>Client Love</span>
          </div>
          <h2 className="font-['Syne'] text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            What clients <br />
            <span className="text-[#00E5A8]">say about us.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 sm:p-10 rounded-3xl bg-white/[0.035] border border-white/10 flex flex-col justify-between hover:border-[#00E5A8]/30 hover:bg-white/[0.06] transition-all duration-300 shadow-xl shadow-black/30 group"
            >
              <div>
                <div className="text-[#00E5A8] text-base tracking-widest mb-6">
                  {t.stars}
                </div>
                <p className="text-base text-[#AEB4C2] leading-relaxed italic mb-8">
                  {t.text}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <div
                  className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.gradient} ${t.textColor} font-['Syne'] font-extrabold flex items-center justify-center text-base shadow-md`}
                >
                  {t.initial}
                </div>
                <div>
                  <div className="font-['Syne'] font-bold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-[#6D7482]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
