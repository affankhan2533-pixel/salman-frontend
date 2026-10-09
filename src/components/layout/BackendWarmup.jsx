'use client';

import { useEffect } from 'react';
import api from '@/services/api';

/**
 * Silent background component that fires a lightweight GET /health request
 * after a 5-second delay to pre-warm the Render production backend.
 * Delayed so it does not compete with critical first-load resources.
 */
export default function BackendWarmup() {
  useEffect(() => {
    let isMounted = true;
    // Delay warmup ping so it doesn't compete with critical first-load resources
    const timer = setTimeout(async () => {
      if (!isMounted) return;
      try {
        await api.get('/health', { timeout: 10000 });
      } catch {
        /* Silent ping failure — backend may still be cold-starting */
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  return null;
}

