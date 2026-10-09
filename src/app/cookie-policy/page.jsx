import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui';
import { SALON_INFO } from '@/constants/salonInfo';
import { Cookie, Info, CheckCircle2, ShieldAlert, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Cookie Policy | Salman Hair Studio Mumbai',
  description:
    'Cookie Policy and local storage disclosures for the Salman Hair Studio website.',
};

export default function CookiePolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F7F4EE] pt-28 sm:pt-36 pb-20 select-text">
        <Container size="editorial">
          {/* Back link */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-lbl uppercase tracking-widest text-warm-gray hover:text-charcoal transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Atelier</span>
            </Link>
          </div>

          {/* Header */}
          <header className="border-b border-border-light pb-8 mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne/15 border border-champagne/30 text-[11px] font-lbl uppercase tracking-widest text-charcoal">
              <Cookie className="w-3 h-3 text-champagne" />
              <span>Browser Storage &amp; Cookie Disclosure</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl text-charcoal uppercase tracking-tight">
              Cookie Policy
            </h1>
            <p className="font-body text-xs sm:text-sm text-warm-gray">
              Last Updated: October 9, 2026 • Salman Hair Studio, Kurla West, Mumbai, India
            </p>
          </header>

          {/* Privacy Respect Badge */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-charcoal/80 mb-10 space-y-1">
            <p className="font-semibold text-emerald-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Privacy-First Architecture: Zero Third-Party Advertising Trackers
            </p>
            <p className="font-light leading-relaxed text-charcoal/80">
              Salman Hair Studio does not sell your browsing history, run intrusive third-party advertising cookies, or deploy cross-site tracking pixels on this website.
            </p>
          </div>

          {/* Content sections */}
          <article className="prose prose-neutral max-w-none space-y-10 font-body text-charcoal/90 text-sm sm:text-base leading-relaxed">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                1. What Are Cookies and Web Storage?
              </h2>
              <p>
                Cookies and local storage mechanisms are small data files saved directly in your web browser when you visit a website. They allow the website to remember essential preferences (such as whether you have already seen a welcome screen) so you have a seamless browsing experience.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                2. Storage Mechanisms Used on This Website
              </h2>
              <p>
                Our website relies solely on strictly necessary, functional client-side storage keys:
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full text-xs sm:text-sm text-left border border-charcoal/10 rounded-xl overflow-hidden">
                  <thead className="bg-charcoal text-white text-[11px] font-lbl tracking-wider uppercase">
                    <tr>
                      <th className="py-3 px-4">Storage Key</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light bg-white">
                    <tr>
                      <td className="py-3 px-4 font-mono font-medium text-charcoal">salman_loaded</td>
                      <td className="py-3 px-4 text-warm-gray">SessionStorage</td>
                      <td className="py-3 px-4 text-warm-gray">Current browser session</td>
                      <td className="py-3 px-4 text-charcoal">Remembers that the introductory animation has already played, avoiding repeated intros on page navigation.</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-medium text-charcoal">shs_confirmed_booking</td>
                      <td className="py-3 px-4 text-warm-gray">SessionStorage</td>
                      <td className="py-3 px-4 text-warm-gray">Current browser session</td>
                      <td className="py-3 px-4 text-charcoal">Stores temporary appointment details on the confirmation page so the client can review their booking receipt.</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-medium text-charcoal">atelier_access_token</td>
                      <td className="py-3 px-4 text-warm-gray">LocalStorage</td>
                      <td className="py-3 px-4 text-warm-gray">Until admin logout</td>
                      <td className="py-3 px-4 text-charcoal">Used exclusively for salon staff authentication on the private studio portal (/admin). Never set for regular public visitors.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                3. Third-Party Services &amp; External Links
              </h2>
              <p>
                Our site provides direct links to trusted external services to enhance your experience:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-warm-gray">
                <li><strong className="text-charcoal">Google Maps:</strong> Direct links to our verified salon listing on Google Maps (governed by Google&apos;s privacy policy).</li>
                <li><strong className="text-charcoal">Instagram:</strong> Direct links to our official Instagram portfolio page (governed by Meta&apos;s privacy policy).</li>
                <li><strong className="text-charcoal">WhatsApp:</strong> Direct contact links to initiate appointment concierge conversations in WhatsApp.</li>
              </ul>
              <p className="text-xs text-warm-gray">
                When you click an external link to visit Google, Instagram, or WhatsApp, their respective privacy and cookie practices apply.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                4. How to Manage or Clear Browser Storage
              </h2>
              <p>
                You have full control over your web browser storage. You can delete stored cookies or clear session storage at any time through your browser settings:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-warm-gray">
                <li><strong>Google Chrome:</strong> Settings &rarr; Privacy and security &rarr; Clear browsing data &rarr; Cookies and other site data.</li>
                <li><strong>Apple Safari:</strong> Preferences &rarr; Privacy &rarr; Manage Website Data.</li>
                <li><strong>Mozilla Firefox:</strong> Settings &rarr; Privacy &amp; Security &rarr; Cookies and Site Data &rarr; Clear Data.</li>
                <li><strong>Microsoft Edge:</strong> Settings &rarr; Cookies and site permissions &rarr; Manage and delete cookies and site data.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                5. Contact Us
              </h2>
              <p>
                If you have questions about our cookie policy or data practices, please reach out:
              </p>
              <div className="p-4 rounded-xl bg-white border border-charcoal/10 text-xs sm:text-sm space-y-1">
                <p><strong>Salman Hair Studio</strong></p>
                <p className="text-warm-gray">{SALON_INFO.address.full}</p>
                <p className="text-warm-gray">Email: {SALON_INFO.email} | Phone: {SALON_INFO.phone}</p>
              </div>
            </section>

          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
