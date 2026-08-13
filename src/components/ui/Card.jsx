'use client';

import React from 'react';
import clsx from 'clsx';

// Global Luxury Card Primitive (Radius: 24px | Thin Border | Micro Shadow | Luxury Spacing)
export function Card({ children, className = '', variant = 'surface', hover = true, ...props }) {
  const variants = {
    surface: 'bg-[#FFFFFF] border border-[#E4DDD2] text-[#1F1F1F]',
    cream: 'bg-[#F2EEE7] border border-[#E4DDD2] text-[#1F1F1F]',
    ivory: 'bg-[#F7F4EF] border border-[#E4DDD2] text-[#1F1F1F]',
  };

  return (
    <div
      className={clsx(
        'rounded-[24px] p-8 md:p-10 lg:p-12 shadow-luxury-subtle transition-all duration-400 ease-luxury',
        variants[variant],
        hover && 'hover:border-[#C8A76E] hover:-translate-y-0.5 hover:shadow-luxury-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ServiceCard({ title, category, price, duration, description, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-[24px] p-8 md:p-10 bg-[#FFFFFF] border border-[#E4DDD2] hover:border-[#C8A76E] shadow-luxury-subtle hover:shadow-luxury-hover hover:-translate-y-0.5 transition-all duration-400 ease-luxury cursor-pointer group flex flex-col justify-between min-h-[260px]',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between text-caption-editorial text-[#66665F] mb-3">
          <span className="text-lbl text-[#C8A76E] font-medium">{category}</span>
          <span className="font-num text-xs">{duration}</span>
        </div>
        <h3 className="font-heading text-2xl text-[#1F1F1F] group-hover:text-[#C8A76E] transition-colors duration-400 mb-3 font-normal">
          {title}
        </h3>
        <p className="text-body-editorial text-sm leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      <div className="mt-8 pt-4 border-t border-[#E4DDD2] flex items-center justify-between">
        <span className="font-num text-lg font-bold text-[#1F1F1F]">{price}</span>
        <span className="text-btn text-xs text-[#1F1F1F] group-hover:text-[#C8A76E] group-hover:translate-x-1 transition-all duration-400">
          Book Atelier →
        </span>
      </div>
    </div>
  );
}

export function ReviewCard({ quote, author, title, rating = 5, className = '' }) {
  return (
    <div className={clsx('rounded-[24px] p-8 md:p-10 bg-[#F7F4EF] border border-[#E4DDD2] shadow-luxury-subtle flex flex-col justify-between transition-colors duration-400 hover:border-[#C8A76E]', className)}>
      <div className="space-y-4">
        <div className="flex gap-1 text-[#C8A76E]">
          {Array.from({ length: rating }).map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>
        <p className="font-heading text-xl text-[#1F1F1F] italic leading-relaxed font-normal">
          &ldquo;{quote}&rdquo;
        </p>
      </div>
      <div className="mt-8 pt-4 border-t border-[#E4DDD2]">
        <div className="font-body text-sm font-medium text-[#1F1F1F]">{author}</div>
        <div className="text-xs text-[#66665F]">{title}</div>
      </div>
    </div>
  );
}

export function GalleryCard({ title, subtitle, imageUrl, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-[24px] relative group overflow-hidden bg-[#F2EEE7] cursor-pointer border border-[#E4DDD2]',
        className
      )}
    >
      <div className="aspect-[4/5] w-full relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-[#F2EEE7] flex items-center justify-center text-[#66665F] text-xs tracking-widest uppercase">
            Editorial Photo Frame
          </div>
        )}
        <div className="absolute inset-0 bg-[#1F1F1F]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 text-white">
          <span className="text-lbl text-[#C8A76E] mb-1">{subtitle}</span>
          <h4 className="font-heading text-xl font-normal">{title}</h4>
        </div>
      </div>
    </div>
  );
}
