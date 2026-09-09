'use client';

import { useEffect } from 'react';
import api from '@/services/api';

/**
 * Silent background component that fires a lightweight GET /health request
 * on client load to pre-warm the Render production backend.
 */
export default function BackendWarmup() {
  useEffect(() => {
    let isMounted = true;
    const warmupBackend = async () => {
      try {
        await api.get('/health', { timeout: 15000 });
      } catch (err) {
        /* Silent ping failure handled gracefully in background */
      }
    };
    if (isMounted) {
      warmupBackend();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}
