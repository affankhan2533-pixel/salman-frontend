'use client';

import React, { useEffect } from 'react';

/**
 * Root Global Error Boundary
 * Replaces RootLayout if an unhandled exception occurs in layout or root providers.
 * Styled with robust inline styles so it never fails even if CSS bundles fail.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Salman Hair Studio - Global Application Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Atelier Session Exception | Salman Hair Studio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          padding: '24px',
          backgroundColor: '#F7F4EE',
          color: '#1F1F1C',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '440px', width: '100%' }}>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#C8A76E',
              fontWeight: 600,
              marginBottom: '16px',
            }}
          >
            SALMAN HAIR STUDIO • ATELIER
          </div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              margin: '0 0 12px 0',
            }}
          >
            Session Refresh Required
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#66665F',
              lineHeight: 1.6,
              margin: '0 0 28px 0',
              fontWeight: 300,
            }}
          >
            An unexpected client exception occurred while initializing the experience on this device. Please tap below to restore the atelier session.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.reload();
                } else if (reset) {
                  reset();
                }
              }}
              style={{
                height: '52px',
                padding: '0 28px',
                backgroundColor: '#1F1F1C',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 8px 20px -4px rgba(31,31,28,0.2)',
              }}
            >
              Restore Experience
            </button>
            <a
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '46px',
                color: '#1F1F1C',
                textDecoration: 'none',
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              Return to Main Atelier
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
