import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui';
import { SALON_INFO } from '@/constants/salonInfo';
import { RefreshCw, HeartHandshake, Sparkles, Clock, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Refund & Cancellation Policy | Salman Hair Studio Mumbai',
  description:
    'Cancellation, rescheduling, and service satisfaction guarantee policy for Salman Hair Studio, Kurla West, Mumbai.',
};

export default function RefundPolicyPage() {
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
              <RefreshCw className="w-3 h-3 text-champagne" />
              <span>Client Satisfaction &amp; Service Guarantee</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl text-charcoal uppercase tracking-tight">
              Refund &amp; Cancellation Policy
            </h1>
            <p className="font-body text-xs sm:text-sm text-warm-gray">
              Last Updated: October 9, 2026 • Salman Hair Studio, Kurla West, Mumbai, India
            </p>
          </header>


          {/* Content sections */}
          <article className="prose prose-neutral max-w-none space-y-10 font-body text-charcoal/90 text-sm sm:text-base leading-relaxed">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                1. Our Craft Commitment
              </h2>
              <p>
                At <strong>Salman Hair Studio</strong>, we are committed to exceptional artistry, personalized consultations, and client satisfaction. Because salon services involve dedicated stylist time, custom formulations, and one-on-one attention, completed salon services are non-refundable once performed.
              </p>
              <p>
                However, we stand wholeheartedly behind our craftsmanship and provide a dedicated satisfaction adjustment process detailed below.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                2. 48-Hour Complimentary Service Adjustment
              </h2>
              <p>
                If your haircut, fade, or style requires refinement or does not sit exactly as discussed during consultation:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-warm-gray">
                <li><strong className="text-charcoal">Notification Window:</strong> Contact us within 48 hours of your completed appointment.</li>
                <li><strong className="text-charcoal">Complimentary Touch-up:</strong> We will book you for a complimentary adjustment consultation with Salman or Farmaan Malik to refine the perimeter, texture, or styling.</li>
                <li><strong className="text-charcoal">Condition:</strong> The adjustment must align with the service originally consulted and performed, rather than a completely new transformation.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                3. Technical Chemical &amp; Color Services
              </h2>
              <p>
                Complex chemical transformations (such as Nanoplastia, Keratin restructuring, Balayage, or Color Corrections) depend on individual hair history, porosity, and post-service home maintenance.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-warm-gray">
                <li>Our senior colorists conduct a thorough assessment and explain expected lift stages before application.</li>
                <li>If color results differ significantly from the agreed consultation blueprint due to salon formulation, an adjustment toner or treatment will be provided at no extra charge within 7 days.</li>
                <li>Complimentary color adjustments do not apply if non-recommended shampoos or subsequent home chemical products were applied after leaving the studio.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                4. Appointment Cancellation &amp; Rescheduling
              </h2>
              <p>
                We understand that schedules change unexpectedly. Because we reserve dedicated time for every client:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-warm-gray">
                <li><strong className="text-charcoal">Advance Notice:</strong> Please give us at least 4 hours advance notice via phone or WhatsApp if you need to reschedule or cancel.</li>
                <li><strong className="text-charcoal">Standard Online Bookings:</strong> Standard service bookings made via the website do not require advance payment; no cancellation fee is charged if reasonable notice is given.</li>
                <li><strong className="text-charcoal">Bridal &amp; Bespoke Packages:</strong> For group bookings or bespoke bridal packages where an advance deposit is collected, deposits are fully refundable if cancelled at least 48 hours in advance, or may be credited toward a future rescheduled date.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                5. Professional Haircare Products
              </h2>
              <p>
                If you purchase retail haircare or styling products at our studio, unopened and unused items in their original sealed packaging may be exchanged within 7 days of purchase upon presentation of receipt. Opened or used cosmetic formulas cannot be returned for hygiene and safety reasons.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                6. Contact for Service Support
              </h2>
              <p>
                To request a consultation adjustment or speak with studio management:
              </p>
              <div className="p-4 rounded-xl bg-white border border-charcoal/10 text-xs sm:text-sm space-y-1">
                <p><strong>Salman Hair Studio</strong></p>
                <p className="text-warm-gray">{SALON_INFO.address.full}</p>
                <p className="text-warm-gray">Direct Line / WhatsApp: {SALON_INFO.phone}</p>
                <p className="text-warm-gray">Email: {SALON_INFO.email}</p>
              </div>
            </section>

          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
