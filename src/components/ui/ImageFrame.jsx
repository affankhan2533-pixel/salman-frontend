'use client';

import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';

// Global Luxury Image Primitive (Radius: 28px | Object-fit Cover | Lazy Loading)
export default function ImageFrame({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-[4/5]',
  priority = false,
  unoptimized = false,
  sizes = '(max-width: 1024px) 100vw, 50vw',
  caption = null,
  ...props
}) {
  return (
    <div
      className={clsx(
        'relative w-full overflow-hidden bg-[#F2EEE7] border border-[#E4DDD2] rounded-[28px] group shadow-luxury-subtle',
        aspectRatio,
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || 'Salman Hair Studio Editorial Image'}
          fill
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          unoptimized={unoptimized}
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.03]"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[#66665F] text-xs tracking-widest uppercase">
          Atelier Frame
        </div>
      )}

      {caption && (
        <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#F7F4EF]/90 backdrop-blur-xs border border-[#E4DDD2] rounded-[14px] flex items-center justify-between">
          <div>
            <span className="text-lbl text-[10px] text-[#C8A76E] tracking-[0.25em] block uppercase mb-0.5">
              {caption.tag || 'EDITORIAL'}
            </span>
            <span className="font-heading text-sm text-[#1F1F1F]">
              {caption.title}
            </span>
          </div>
          {caption.num && (
            <span className="font-num text-xs text-[#66665F]">
              {caption.num}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
