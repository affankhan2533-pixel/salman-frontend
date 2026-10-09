import './globals.css';
import { cormorantGaramond, inter, manrope } from '@/config/fonts';
import { defaultMetadata } from '@/seo/metadata';
import { hairStudioSchema } from '@/seo/schema';

import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';
import LoadingScreen from '@/components/loader/LoadingScreen';
import CustomCursor from '@/components/common/CustomCursor';
import ScrollProgress from '@/components/common/ScrollProgress';
import Navbar from '@/components/layout/Navbar';
import BackendWarmup from '@/components/layout/BackendWarmup';

export const metadata = defaultMetadata;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-IN"
      className={`${cormorantGaramond.variable} ${inter.variable} ${manrope.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hairStudioSchema) }}
        />
      </head>
      <body className="bg-ivory text-charcoal font-body antialiased selection:bg-champagne selection:text-white">
        {/* Skip Navigation for keyboard & screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-charcoal focus:text-white focus:text-sm focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne"
        >
          Skip to main content
        </a>
        <BackendWarmup />
        <SmoothScrollProvider>
          <LoadingScreen />
          <CustomCursor />
          <ScrollProgress />
          <Navbar />
          <div id="main-content">
            {children}
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

