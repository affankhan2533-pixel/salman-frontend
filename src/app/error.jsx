'use client';

import React, { useEffect } from 'react';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('Atelier App Error:', error);
  }, [error]);

  return (
    <main className="min-h-screen w-full bg-[#F7F4EF] text-[#1F1F1C] flex flex-col items-center justify-center p-6 text-center select-none font-inter">
      <span className="text-[11px] text-[#C8A76E] tracking-[0.3em] uppercase mb-4 font-semibold">
        ATELIER TEMPORARY EXCEPTION
      </span>
      <h1 className="font-heading text-4xl sm:text-6xl uppercase tracking-tight mb-4">
        Something Went Wrong
      </h1>
      <p className="text-sm text-[#66665F] max-w-md mb-8">
        We encountered an unexpected issue while rendering this atelier suite. Please retry or return to the main showcase.
      </p>
      <button
        onClick={() => reset()}
        className="h-[52px] px-8 bg-[#1F1F1C] text-white hover:bg-[#C8A76E] hover:text-[#1F1F1C] transition-all duration-300 text-xs tracking-[0.22em] uppercase font-medium rounded-[14px] cursor-pointer"
      >
        Retry Suite
      </button>
    </main>
  );
}
