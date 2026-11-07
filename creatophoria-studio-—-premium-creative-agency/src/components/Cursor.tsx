import React, { useEffect, useRef } from 'react';

export const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cursorX = 0;
    let cursorY = 0;
    let targetX = 0;
    let targetY = 0;
    let isHovering = false;
    let isClicking = false;
    let animationId: number;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };

    const animate = () => {
      cursorX += (targetX - cursorX) * 0.28;
      cursorY += (targetY - cursorY) * 0.28;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      }
      animationId = requestAnimationFrame(animate);
    };

    const hoverables = 'a, button, input, select, textarea, .svc-card, .work-item, .testi-card, .btn-primary, .btn-ghost';

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(hoverables)) {
        isHovering = true;
        cursorRef.current?.classList.add('hovering');
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(hoverables)) {
        isHovering = false;
        cursorRef.current?.classList.remove('hovering');
      }
    };

    const onMouseDown = () => {
      isClicking = true;
      if (cursorRef.current) {
        cursorRef.current.style.width = '24px';
        cursorRef.current.style.height = '24px';
        cursorRef.current.style.background = '#00E5A8';
      }
    };

    const onMouseUp = () => {
      isClicking = false;
      if (cursorRef.current) {
        cursorRef.current.style.width = isHovering ? '60px' : '36px';
        cursorRef.current.style.height = isHovering ? '60px' : '36px';
        cursorRef.current.style.background = isHovering ? 'rgba(0, 229, 168, 0.15)' : 'transparent';
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor hidden md:block" />
      <div ref={dotRef} className="custom-cursor-dot hidden md:block" />
    </>
  );
};
