'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles } from 'lucide-react';

export default function StudioVideoSection() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Attempt automatic play on load and when section enters viewport
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Direct play helper
    const attemptPlay = () => {
      video.muted = true; // Required for browser autoplay policies
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Autoplay prevented by browser:', err);
            setIsPlaying(false);
          });
      }
    };

    // 1. Initial attempt on mount / source ready
    attemptPlay();

    // 2. IntersectionObserver to play when visible and pause when offscreen
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            attemptPlay();
          } else {
            if (!video.paused) {
              video.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch((err) => console.error(err));
    } else {
      document.exitFullscreen?.().catch((err) => console.error(err));
    }
  };

  return (
    <section className="relative z-30 w-full bg-charcoal text-white py-16 sm:py-20 lg:py-32 overflow-hidden border-y border-white/10 select-none">
      {/* Background Subtle Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,160,89,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 relative z-10 space-y-8 sm:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2.5 text-lbl text-xs tracking-[0.28em] text-champagne uppercase font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ATELIER IN MOTION</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white font-normal">
              Master Craftsmanship &amp; <br />
              <span className="italic text-champagne">Artistry in Motion</span>
            </h2>
          </div>
          <p className="font-body text-warm-gray text-sm sm:text-base font-light max-w-md leading-relaxed">
            Take an inside look at Salman Hair Studio Kurla West — where traditional barbershop precision meets luxury modern hair aesthetics.
          </p>
        </div>

        {/* Video Container Frame */}
        <div
          ref={containerRef}
          className="relative w-full aspect-[16/9] sm:aspect-[16/8] max-h-[680px] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-[0_30px_90px_-20px_rgba(0,0,0,0.6)] border border-white/15 bg-black group"
        >
          <video
            ref={videoRef}
            src="/videos/WhatsApp 2026-08-16 22-00-16.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play();
              }
            }}
            onClick={togglePlay}
            className="w-full h-full object-cover object-center scale-[1.1] sm:scale-[1.1] transition-transform duration-700 ease-out group-hover:scale-[1.05] cursor-pointer"
          />

          {/* Dark Overlay Vignette for Readability & Cinematic Look */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-charcoal/30 pointer-events-none" />

          {/* Top Floating Badge */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between pointer-events-none z-20">
            <div className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-charcoal/70 backdrop-blur-md border border-white/20 flex items-center gap-2.5 sm:gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-lbl text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.22em] text-white uppercase font-semibold">
                SALMAN HAIR STUDIO REEL
              </span>
            </div>
            <div className="hidden sm:block text-lbl text-[11px] tracking-[0.2em] text-warm-gray uppercase bg-charcoal/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              KURLA WEST, MUMBAI
            </div>
          </div>

          {/* Center Play Button Overlay (Only visible when manually paused) */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              aria-label="Play video"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-champagne text-charcoal flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 z-30 cursor-pointer"
            >
              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-charcoal ml-1" />
            </button>
          )}

          {/* Bottom Custom Glass Control Bar */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 p-3.5 sm:p-5 bg-charcoal/80 backdrop-blur-md border border-white/15 rounded-2xl flex items-center justify-between gap-3 sm:gap-4 z-20">
            <div className="flex-1 min-w-0 pr-2">
              <span className="text-lbl text-[9px] sm:text-[10px] text-champagne tracking-[0.22em] sm:tracking-[0.25em] block uppercase mb-0.5 font-semibold">
                BESPOKE GROOMING &amp; SCULPTING
              </span>
              <p className="font-heading text-xs sm:text-base text-white font-normal line-clamp-1">
                Precision Haircuts, Hair Color &amp; Restorative Treatments
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause video' : 'Pause video'}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              {/* Mute/Unmute Button */}
              <button
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-warm-gray" /> : <Volume2 className="w-4 h-4 text-champagne" />}
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                aria-label="Toggle Fullscreen"
                className="hidden sm:flex w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 items-center justify-center text-white transition-all duration-300 cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
