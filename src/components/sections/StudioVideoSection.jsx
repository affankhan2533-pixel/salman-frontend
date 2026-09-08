'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Scissors, ShieldCheck, Calendar, ArrowRight } from 'lucide-react';

export default function StudioVideoSection() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    video.playsInline = true;

    const playVideo = () => {
      const promise = video.play();
      if (promise !== undefined) {
        promise.then(() => setIsPlaying(true)).catch((err) => {
          console.warn('Autoplay error:', err);
        });
      }
    };

    playVideo();

    // IntersectionObserver to pause when off-screen & play when in-screen
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo();
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
  }, [isMuted]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <section className="relative z-30 w-full bg-[#121210] text-white py-16 sm:py-24 lg:py-32 overflow-hidden border-y border-white/10 select-none">
      {/* Ambient Radial Illumination */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(200,167,110,0.12)_0%,transparent_70%)] pointer-events-none blur-3xl" />
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* ── LEFT COLUMN: EDITORIAL ATELIER STORYTELLING (Desktop) ── */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-champagne/30 text-champagne backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-champagne animate-pulse" />
              <span className="text-lbl text-[10px] sm:text-[11px] tracking-[0.28em] uppercase font-semibold">
                ATELIER CINEMA • BEHIND THE SCENES
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] leading-[0.96] text-white font-normal uppercase tracking-tight">
                Haute Coiffure <br />
                <span className="text-champagne italic font-serif">In Motion</span>
              </h2>
              <p className="font-body text-white/70 font-light text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                Step inside Salman Hair Studio. From high-fashion bridal transformations to architectural precision cuts, experience the artistry, technique, and personal care that define Mumbai’s premier styling atelier.
              </p>
            </div>

            {/* 3 Luxury Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-left space-y-1.5 backdrop-blur-sm">
                <span className="text-lbl text-[10px] text-champagne tracking-widest uppercase font-bold block">
                  01 • BRIDAL
                </span>
                <span className="font-heading text-sm sm:text-base text-white font-medium block">
                  Couture Makeover
                </span>
                <span className="text-xs text-white/60 font-light block leading-snug">
                  Tailored styling for high-profile weddings.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-left space-y-1.5 backdrop-blur-sm">
                <span className="text-lbl text-[10px] text-champagne tracking-widest uppercase font-bold block">
                  02 • PRECISION
                </span>
                <span className="font-heading text-sm sm:text-base text-white font-medium block">
                  Japanese Shears
                </span>
                <span className="text-xs text-white/60 font-light block leading-snug">
                  Exact geometry & Olaplex bond repair.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-left space-y-1.5 backdrop-blur-sm">
                <span className="text-lbl text-[10px] text-champagne tracking-widest uppercase font-bold block">
                  03 • SANCTUARY
                </span>
                <span className="font-heading text-sm sm:text-base text-white font-medium block">
                  1-on-1 VIP Session
                </span>
                <span className="text-xs text-white/60 font-light block leading-snug">
                  Opposite Kurla Court, LBS Marg.
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href="/booking" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto h-[52px] px-8 bg-champagne text-charcoal hover:bg-white transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-semibold rounded-2xl shadow-[0_12px_32px_-8px_rgba(200,167,110,0.35)] hover:shadow-white/20 active:scale-95 cursor-pointer flex items-center justify-center gap-3">
                  <Calendar className="w-4 h-4" />
                  <span>Reserve VIP Session</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              {/* Audio Toggle Button */}
              <button
                onClick={toggleMute}
                className="w-full sm:w-auto h-[52px] px-6 bg-white/10 hover:bg-white/15 border border-white/15 text-white active:scale-95 transition-all duration-200 font-inter text-xs tracking-[0.18em] uppercase font-medium rounded-2xl flex items-center justify-center gap-2.5 cursor-pointer"
                aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-champagne" />
                    <span>Muted (Tap to Listen)</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-champagne animate-pulse" />
                    <span className="text-champagne font-semibold">Sound Active</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* ── RIGHT COLUMN: HAUTE COUTURE PORTRAIT VIDEO DISPLAY ── */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] xl:max-w-[460px]">
              
              {/* Backlight Glow Halo */}
              <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-tr from-champagne/25 via-champagne/10 to-transparent blur-2xl opacity-60 pointer-events-none" />

              {/* Video Device Bezel Frame */}
              <div
                ref={containerRef}
                className="relative w-full aspect-[9/16] max-h-[720px] rounded-[30px] sm:rounded-[36px] overflow-hidden border border-champagne/40 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9),0_0_50px_rgba(200,167,110,0.18)] bg-black group"
              >
                <video
                  ref={videoRef}
                  src="/videos/WhatsApp 2026-08-16 22-00-16.mp4"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover object-center"
                />

                {/* Subtle Luxury Gradient Overlay (top and bottom) */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

                {/* Top Overlay Badge */}
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none z-20">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] tracking-widest uppercase font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>ATELIER LIVE</span>
                  </div>
                  <span className="text-[10px] font-num tracking-widest text-champagne bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-champagne/30">
                    4K PRO
                  </span>
                </div>

                {/* Bottom Overlay: Session Info + Mute Control */}
                <div className="absolute bottom-5 inset-x-5 flex items-center justify-between z-20">
                  <div className="space-y-0.5 pointer-events-none">
                    <span className="text-lbl text-[9px] tracking-[0.24em] text-champagne uppercase font-semibold block">
                      SALMAN HAIR STUDIO
                    </span>
                    <span className="font-heading text-sm text-white font-normal block leading-tight">
                      Bridal Campaign • Mumbai
                    </span>
                  </div>

                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/25 text-white hover:border-champagne hover:text-champagne active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-lg"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-champagne animate-pulse" />}
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
