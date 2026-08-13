'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useGSAP(callback, deps = []) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(callback, containerRef);
    return () => ctx.revert();
  }, deps);

  return containerRef;
}
