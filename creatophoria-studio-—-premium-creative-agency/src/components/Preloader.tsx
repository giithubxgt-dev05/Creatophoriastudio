import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const messages = [
    'Crafting experience...',
    'Loading aesthetics...',
    'Almost ready...',
    'Welcome.'
  ];

  useEffect(() => {
    // If autostart query param is present, finish immediately
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 22 + 8;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFading(true);
            setTimeout(onComplete, 500);
          }, 200);
          return 100;
        }
        return next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const idx = Math.min(Math.floor((progress / 100) * messages.length), messages.length - 1);
    setMsgIdx(idx);
  }, [progress, messages.length]);

  return (
    <div
      className={`fixed inset-0 bg-[#07070A] z-[99998] flex items-center justify-center transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center animate-pulse">
          <img
            src="/creatophoria_logo.png"
            alt="Creatophoria Emblem"
            className="w-full h-full object-contain filter drop-shadow-[0_0_24px_rgba(0,229,168,0.7)]"
          />
        </div>
        <div className="font-['Syne'] text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-[#00E5A8] bg-clip-text text-transparent">
          Creatophoria
        </div>
        <div className="w-52 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00E5A8] to-[#53F3FF] transition-all duration-100 ease-out shadow-[0_0_12px_rgba(0,229,168,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs uppercase tracking-[0.2em] text-[#6D7482] transition-opacity duration-200">
          {messages[msgIdx]}
        </div>
      </div>
    </div>
  );
};
