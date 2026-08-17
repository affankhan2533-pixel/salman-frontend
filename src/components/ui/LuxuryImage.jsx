'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

/**
 * LuxuryImage Primitive
 * - Animated shimmer loading skeleton while fetching over Vercel / CDN
 * - Smooth 700ms opacity & scale fade-in transition on load complete
 * - Automatic error fallback & responsive sizing
 */
export default function LuxuryImage({
  src,
  alt = 'Salman Hair Studio',
  fill = true,
  width,
  height,
  priority = false,
  loading,
  sizes = '(max-width: 1024px) 100vw, 50vw',
  className = '',
  imageClassName = 'object-cover object-center',
  onLoad,
  onError,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    setIsLoaded(true);
    if (onError) onError(e);
  };

  const sanitizedSrc = typeof src === 'string' ? encodeURI(src) : src;

  if (!src || hasError) {
    return (
      <div className={clsx('relative w-full h-full bg-cream flex items-center justify-center p-4', className)}>
        <span className="text-lbl text-[10px] tracking-widest text-warm-gray uppercase text-center font-medium">
          Atelier Frame
        </span>
      </div>
    );
  }

  return (
    <div className={clsx('relative w-full h-full overflow-hidden bg-cream/60', className)}>
      {/* 1. Luxury Shimmer Loading Skeleton (Visible while image is loading) */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 animate-shimmer flex items-center justify-center pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-champagne/40 animate-ping" />
        </div>
      )}

      {/* 2. Next.js Image with Smooth Fade-In Transition */}
      <Image
        src={sanitizedSrc}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        priority={priority}
        loading={priority ? 'eager' : (loading || 'lazy')}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={clsx(
          imageClassName,
          'transition-all duration-700 ease-out will-change-[opacity,transform,filter]',
          isLoaded
            ? 'opacity-100 scale-100 blur-0'
            : 'opacity-0 scale-[1.03] blur-[2px]'
        )}
        {...props}
      />
    </div>
  );
}
