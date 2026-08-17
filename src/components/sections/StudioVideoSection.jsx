'use client';

import React, { useRef, useEffect } from 'react';

export default function StudioVideoSection() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.muted = true;
      video.playsInline = true;
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          console.warn('Autoplay error:', err);
        });
      }
    };

    // Play immediately on mount
    playVideo();

    // IntersectionObserver to auto-play when visible & pause when offscreen
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo();
          } else {
            if (!video.paused) {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative z-30 w-full bg-charcoal text-white py-12 sm:py-16 lg:py-24 overflow-hidden border-y border-white/10 select-none">
      {/* Background Subtle Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,160,89,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        {/* Pure Video Container Frame — Clean, No Text, No Click Needed, Automatic Looping */}
        <div
          ref={containerRef}
          className="relative w-full aspect-[16/9] sm:aspect-[16/8] max-h-[720px] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-[0_30px_90px_-20px_rgba(0,0,0,0.6)] border border-white/15 bg-black"
        >
          <video
            ref={videoRef}
            src="/videos/WhatsApp 2026-08-16 22-00-16.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center scale-100 pointer-events-none"
          />
        </div>
      </div>
    </section>
  );
}
