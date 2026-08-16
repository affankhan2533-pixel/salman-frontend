'use client';

import React, { useState, useRef, memo } from 'react';
import Image from 'next/image';

function BeforeAfterSlider({ beforeImage, afterImage, title = 'Transformation' }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  };

  const handleTouchMove = (e) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX);
  };

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between font-lbl text-xs tracking-widest text-warm-gray uppercase">
        <span>BEFORE TRANSFORMATION</span>
        <span>AFTER HAUTE COIFFURE</span>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-[16/10] max-h-[600px] rounded-[28px] overflow-hidden border border-charcoal/10 shadow-[0_25px_60px_-15px_rgba(31,31,28,0.14)] cursor-ew-resize bg-cream"
      >
        {/* AFTER IMAGE (BACKGROUND) */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={afterImage}
            alt={`${title} After`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            className="object-cover"
          />
        </div>

        {/* BEFORE IMAGE (FOREGROUND CLIP) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
        >
          <Image
            src={beforeImage}
            alt={`${title} Before`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            className="object-cover grayscale contrast-[1.1]"
          />
        </div>

        {/* SLIDER DIVIDER LINE */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-charcoal text-champagne border-2 border-white flex items-center justify-center text-xs font-bold shadow-2xl">
            ↔
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(BeforeAfterSlider);
