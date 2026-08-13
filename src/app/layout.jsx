import './globals.css';
import { cormorantGaramond, inter, manrope } from '@/config/fonts';
import { defaultMetadata } from '@/seo/metadata';
import { hairStudioSchema } from '@/seo/schema';

import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';
import LoadingScreen from '@/components/loader/LoadingScreen';
import CustomCursor from '@/components/common/CustomCursor';
import ScrollProgress from '@/components/common/ScrollProgress';
import Navbar from '@/components/layout/Navbar';

export const metadata = defaultMetadata;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${inter.variable} ${manrope.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hairStudioSchema) }}
        />
      </head>
      <body className="bg-ivory text-charcoal font-body antialiased selection:bg-champagne selection:text-white">
        <SmoothScrollProvider>
          <LoadingScreen />
          <CustomCursor />
          <ScrollProgress />
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
