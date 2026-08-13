'use client';

import React from 'react';

export default function NotFound() {
  return (
    <main className="min-h-screen w-full bg-[#F7F4EF] text-[#1F1F1C] flex flex-col items-center justify-center p-6 text-center select-none font-inter">
      <span className="text-[11px] text-[#C8A76E] tracking-[0.3em] uppercase mb-4 font-semibold">
        404 — PAGE NOT FOUND
      </span>
      <h1 className="font-heading text-4xl sm:text-6xl uppercase tracking-tight mb-4">
        Haute Sanctuary Out Of Reach
      </h1>
      <p className="text-sm text-[#66665F] max-w-md mb-8">
        The page or suite you are requesting does not exist or has been relocated within our atelier catalog.
      </p>
      <a
        href="/"
        className="h-[52px] px-8 bg-[#1F1F1C] text-white hover:bg-[#C8A76E] hover:text-[#1F1F1C] transition-all duration-300 text-xs tracking-[0.22em] uppercase font-medium rounded-[14px] flex items-center justify-center"
      >
        Return To Atelier Home
      </a>
    </main>
  );
}
