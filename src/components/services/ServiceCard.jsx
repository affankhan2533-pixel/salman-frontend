'use client';

import React from 'react';
import Image from 'next/image';
import ServiceIcon from './ServiceIcon';

/**
 * ServiceCard — Premium editorial split-layout service card.
 *
 * Desktop layout: Text left (45%) · Image right (55%)
 * Mobile layout:  Image top · Text bottom (stacked)
 *
 * The entire card is one <button> — fully clickable/tappable.
 * No description text. Price is the visual focal point.
 *
 * Hover: card lifts + image subtle zoom (1.03) + arrow translates
 * prefers-reduced-motion: no transforms, opacity-only transitions
 */
export default function ServiceCard({ service, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(service)}
      aria-label={`View details for ${service.name}`}
      className={`
        group w-full text-left
        bg-white border border-charcoal/8
        rounded-[20px] overflow-hidden
        flex flex-col sm:flex-row
        transition-all duration-300 ease-out
        hover:-translate-y-[3px]
        hover:border-champagne/35
        hover:shadow-[0_12px_36px_-12px_rgba(31,31,28,0.13)]
        active:scale-[0.985] active:translate-y-0
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/60 focus-visible:ring-offset-2
        cursor-pointer select-none
        motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:active:transform-none
      `}
    >
      {/* ── TEXT AREA (left on sm+, full width on mobile) ──────────────── */}
      <div className="flex flex-col justify-between gap-4 p-6 sm:p-7 sm:w-[46%] shrink-0">

        {/* Icon */}
        <span className="block transition-transform duration-300 ease-out group-hover:scale-[1.05] motion-reduce:transition-none">
          <ServiceIcon name={service.icon} />
        </span>

        {/* Service name */}
        <span className="font-heading text-xl sm:text-[22px] lg:text-2xl text-charcoal font-normal uppercase tracking-tight leading-tight group-hover:text-champagne transition-colors duration-300 motion-reduce:transition-none">
          {service.name}
        </span>

        {/* Price block */}
        <span className="flex flex-col gap-0.5 mt-auto">
          {service.hasFixedPrice ? (
            <>
              <span className="text-lbl text-[9px] tracking-[0.32em] text-warm-gray uppercase font-medium">
                Starting from
              </span>
              <span className="font-num text-[26px] sm:text-3xl font-bold text-champagne tracking-tight leading-none">
                {service.price}
              </span>
              {service.pricingNote && (
                <span className="text-[11px] font-body text-warm-gray font-light italic leading-snug mt-1">
                  {service.pricingNote}
                </span>
              )}
            </>
          ) : (
            <span className="text-[12px] font-body text-warm-gray font-light italic leading-snug">
              {service.pricingNote}
            </span>
          )}
        </span>

        {/* Arrow */}
        <span
          aria-hidden="true"
          className="self-start text-warm-gray text-base transition-all duration-300 ease-out group-hover:text-champagne group-hover:translate-x-1.5 motion-reduce:transition-none"
        >
          →
        </span>
      </div>

      {/* ── IMAGE AREA (right on sm+, top on mobile) ────────────────────── */}
      {/*
        Mobile: image appears BEFORE text (order-first) at 16:9 ratio
        Desktop: image fills right side of card at full height
      */}
      <div className="relative w-full sm:w-[54%] order-first sm:order-last h-44 sm:h-auto overflow-hidden bg-cream">
        {service.image && (
          <Image
            src={service.image}
            alt={service.name}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`
              object-cover
              scale-100 group-hover:scale-[1.035]
              transition-transform duration-500 ease-out
              motion-reduce:transition-none motion-reduce:group-hover:scale-100
            `}
          />
        )}
        {/* Subtle left-side gradient to blend image into the text area */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent sm:block hidden pointer-events-none"
        />
        {/* Bottom fade for mobile stacked layout */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/40 to-transparent sm:hidden pointer-events-none"
        />
      </div>
    </button>
  );
}
