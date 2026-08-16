'use client';

import React, { useEffect, useRef, memo } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { SALON_INFO } from '@/constants/salonInfo';

const STATS_DATA = [
  { target: 10, suffix: '+', label: 'Years of Craft' },
  { target: 15, suffix: 'K+', label: 'Happy Clients' },
  { target: 4.7, suffix: '★', isDecimal: true, label: 'Google Rating (360+)' },
  { target: 100, suffix: '%', label: 'Personal Consultation' },
];

const TIMELINE_DATA = [
  { year: '2016', title: 'Studio Established', desc: 'Founded in Kurla West as a dedicated sanctuary for haircuts and grooming.' },
  { year: '2018', title: 'Color & Treatment Lab', desc: 'Introduced hair coloring, keratin smoothing, and collagen treatments.' },
  { year: '2021', title: 'Facial Care Expansion', desc: 'Added specialized facial treatments and skin rejuvenation procedures.' },
  { year: '2023', title: '360+ 5-Star Reviews', desc: 'Recognized as one of Kurla’s top-rated salons on Google.' },
  { year: 'Today', title: 'Master Craftsmanship', desc: 'Salman and Farmaan Malik continue to deliver precision cuts and bespoke styles.' },
];

function AboutSection() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const headingRef = useRef(null);
  const storyTextRef = useRef(null);
  const imageFrameRef = useRef(null);
  const imageInnerRef = useRef(null);
  const statsContainerRef = useRef(null);
  const timelineRef = useRef(null);

  const desktopStatRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance Sequence
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: labelRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );

      // Story Text & Image Entrance
      gsap.fromTo(
        storyTextRef.current?.children || [],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: storyTextRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        imageFrameRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: imageFrameRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Imperceptible Image Breathing
      if (imageInnerRef.current) {
        gsap.to(imageInnerRef.current, {
          scale: 1.04,
          duration: 12,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      // 2. Statistics Count-Up
      if (statsContainerRef.current) {
        ScrollTrigger.create({
          trigger: statsContainerRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            STATS_DATA.forEach((stat, idx) => {
              const obj = { val: 0 };
              gsap.to(obj, {
                val: stat.target,
                duration: 2.2,
                ease: 'power2.out',
                onUpdate: () => {
                  const formatted = stat.isDecimal
                    ? obj.val.toFixed(1)
                    : Math.floor(obj.val).toString();

                  const el = desktopStatRefs.current[idx];
                  if (el) {
                    el.innerHTML = `${formatted}<span class="text-champagne font-medium">${stat.suffix}</span>`;
                  }
                },
              });
            });
          },
        });
      }

      // 3. Timeline Fade-ins
      if (timelineRef.current) {
        const items = timelineRef.current.querySelectorAll('.timeline-item');
        items.forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                once: true,
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-40 w-full bg-[#F7F4EE] text-charcoal py-24 sm:py-32 flex flex-col justify-center border-t border-border-light overflow-hidden select-none"
    >
      {/* Atmosphere */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#1F1F1C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

      {/* Main Container */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10 space-y-16 sm:space-y-24">
        
        {/* 1. SECTION HEADER */}
        <div className="space-y-4 max-w-4xl">
          <div ref={labelRef} className="flex items-center gap-3 text-lbl text-[11px] tracking-[0.28em] text-warm-gray uppercase font-medium">
            <span>KURLA WEST</span>
            <span className="w-1 h-1 bg-champagne rounded-full" />
            <span>MUMBAI</span>
            <span className="w-1 h-1 bg-champagne rounded-full" />
            <span className="text-charcoal font-semibold">PREMIER HAIR STUDIO</span>
          </div>

          <div ref={headingRef} className="font-heading text-4xl sm:text-6xl lg:text-[76px] xl:text-[84px] leading-[0.92] tracking-[-1.5px] uppercase font-normal">
            <span className="block text-charcoal">
              Crafting Exceptional Styles.
            </span>
            <span className="block text-champagne italic font-normal mt-1 sm:mt-2">
              Building Confidence Daily.
            </span>
          </div>
        </div>

        {/* 2. FOUNDER STORY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div ref={storyTextRef} className="lg:col-span-6 space-y-6">
            <h3 className="font-heading text-2xl sm:text-3xl text-charcoal font-light leading-snug">
              Professionalism &amp; expertise in every haircut. <br />
              <span className="italic text-champagne font-normal">Led by Salman and Farmaan Malik.</span>
            </h3>
            
            <p className="font-body text-warm-gray font-light text-base sm:text-lg leading-relaxed">
              At {SALON_INFO.name}, we believe a haircut should enhance your personality and fit your lifestyle. Situated opposite Kurla Court on LBS Marg, our studio provides a welcoming space for precision cuts, beard shaping, color transformations, and facial care.
            </p>

            <p className="font-body text-warm-gray font-light text-base sm:text-lg leading-relaxed">
              Our experienced team, including senior specialists like Aasha, takes the time to consult with every client, ensuring you walk out feeling refreshed, confident, and completely satisfied.
            </p>

            <div className="pt-4 border-t border-border-light flex items-center justify-between">
              <div>
                <span className="font-heading text-lg text-charcoal block">Salman Malik &amp; Farmaan Malik</span>
                <span className="text-lbl text-[11px] tracking-[0.22em] text-warm-gray uppercase block font-medium">
                  CO-OWNERS &amp; MASTER STYLISTS
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div
              ref={imageFrameRef}
              className="relative w-full aspect-[4/5] max-h-[680px] rounded-[28px] overflow-hidden shadow-[0_30px_70px_-15px_rgba(31,31,28,0.12)] bg-[#141412] border border-charcoal/10 group p-3"
            >
              <div ref={imageInnerRef} className="w-full h-full relative">
                <Image
                  src="/images/image.png"
                  alt="Salman Hair Studio Salon Experience & Heritage"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute bottom-5 left-5 right-5 p-4 bg-ivory/90 backdrop-blur-md rounded-xl border border-white/60">
                <span className="text-lbl text-[10px] text-champagne tracking-[0.25em] block uppercase mb-0.5 font-semibold">
                  STUDIO HERITAGE
                </span>
                <span className="font-heading text-sm text-charcoal font-normal">
                  Luxury Atelier &amp; Grooming Sanctuary
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2B. BRANDING ATELIER SHOWCASE */}
        <div className="space-y-8 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-light pb-4">
            <div>
              <span className="text-lbl text-[11px] tracking-[0.28em] text-champagne uppercase font-semibold block mb-1">
                OUR CRAFT IN DETAIL
              </span>
              <h4 className="font-heading text-2xl sm:text-3xl text-charcoal font-normal uppercase">
                The Atelier Branding Experience
              </h4>
            </div>
            <p className="font-body text-warm-gray text-sm font-light max-w-sm">
              Explore the master artistry, bespoke consultations, and signature grooming techniques of Salman Hair Studio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                src: '/images/branding/image.png',
                title: 'Master Sculpting Laboratory',
                subtitle: 'Precision haircuts & architectural layering tailored to your structure.',
              },
              {
                src: '/images/branding/image copy.png',
                title: 'Bespoke Color & Gloss Lab',
                subtitle: 'Organic balayage, tone repair & custom pigmentation formulations.',
              },
              {
                src: '/images/branding/image copy 2.png',
                title: 'Luxury Grooming Sanctuary',
                subtitle: 'Relaxing scalpcared rituals & premium beard shaping and care.',
              },
              {
                src: '/images/image.png',
                title: 'Atelier Heritage & Sanctuary',
                subtitle: 'State-of-the-art styling stations & serene luxury ambience.',
              },
              {
                src: '/images/gallery/image copy 3.png',
                title: 'Couture Styling & Texture Artistry',
                subtitle: 'High-fashion editorial waves and red carpet signature texture.',
              },
              {
                src: '/images/gallery/image copy 5.png',
                title: 'Bespoke Bridal & Event Styling',
                subtitle: 'Elegant bridal coiffure and exclusive event styling experience.',
              },
            ].map((brand, i) => (
              <div
                key={brand.src}
                className="group relative rounded-2xl overflow-hidden bg-cream border border-charcoal/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative w-full aspect-[4/3] bg-[#F7F4EF] overflow-hidden flex items-center justify-center">
                  <Image
                    src={brand.src}
                    alt={brand.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-3 right-3 text-lbl text-[10px] tracking-[0.2em] font-num text-white bg-charcoal/80 backdrop-blur-md px-2.5 py-1 rounded-full z-10 border border-white/20">
                    {i + 1 < 10 ? `0${i + 1}` : i + 1}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between bg-ivory">
                  <div>
                    <h5 className="font-heading text-lg text-charcoal font-medium group-hover:text-champagne transition-colors">
                      {brand.title}
                    </h5>
                    <p className="font-body text-xs text-warm-gray mt-1 leading-relaxed font-light">
                      {brand.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. STATISTICS */}
        <div
          ref={statsContainerRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-y border-border-light"
        >
          {STATS_DATA.map((stat, idx) => (
            <div key={stat.label} className="space-y-1 text-center sm:text-left">
              <span
                ref={(el) => (desktopStatRefs.current[idx] = el)}
                className="font-num text-4xl sm:text-5xl font-bold text-charcoal block tracking-tight"
              >
                0<span className="text-champagne font-medium">{stat.suffix}</span>
              </span>
              <span className="text-lbl text-[11px] sm:text-xs tracking-[0.2em] text-warm-gray uppercase block font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* 4. CRAFT TIMELINE */}
        <div className="space-y-10">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-lbl text-[11px] tracking-[0.3em] text-warm-gray uppercase font-medium block">
              JOURNEY &amp; MILESTONES
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl text-charcoal uppercase font-normal">
              SALON HERITAGE
            </h3>
          </div>

          <div ref={timelineRef} className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {TIMELINE_DATA.map((item) => (
              <div
                key={item.year}
                className="timeline-item bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-charcoal/10 flex flex-col justify-between space-y-4 hover:border-champagne/50 transition-colors duration-300"
              >
                <span className="font-heading text-3xl text-champagne italic font-normal block">
                  {item.year}
                </span>
                <div className="space-y-1.5">
                  <h4 className="font-heading text-base text-charcoal font-semibold uppercase tracking-wider">
                    {item.title}
                  </h4>
                  <p className="text-body text-xs text-warm-gray leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default memo(AboutSection);
