import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui';
import { SALON_INFO } from '@/constants/salonInfo';
import { FileCheck, Clock, Scissors, AlertCircle, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Salman Hair Studio Mumbai',
  description:
    'Terms of service, booking policies, and studio guidelines for Salman Hair Studio, Kurla West, Mumbai.',
};

export default function TermsAndConditionsPage() {
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
              <FileCheck className="w-3 h-3 text-champagne" />
              <span>Client Agreement &amp; Studio Guidelines</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl text-charcoal uppercase tracking-tight">
              Terms &amp; Conditions
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
                1. Acceptance of Terms
              </h2>
              <p>
                By booking an appointment online, by telephone, via WhatsApp, or as a walk-in at <strong>Salman Hair Studio</strong> (located at Shop No. 5, Manav Drishti Apartments, LBS Marg, Kurla West, Mumbai 400070), you agree to be bound by these Terms and Conditions.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                2. Appointment Scheduling &amp; Punctuality
              </h2>
              <p>
                To maintain our unhurried 1-on-1 atelier standard, each appointment is allocated dedicated time with our stylists:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-warm-gray">
                <li><strong className="text-charcoal">Arrival Time:</strong> Please arrive 5 to 10 minutes prior to your scheduled time to allow for diagnostic consultation and preparation.</li>
                <li><strong className="text-charcoal">Late Arrivals:</strong> If you arrive more than 15 minutes late, we may need to adjust your service scope or reschedule to avoid delaying subsequent clients.</li>
                <li><strong className="text-charcoal">Cancellations &amp; Rescheduling:</strong> We kindly request at least 4 hours advance notice if you need to cancel or adjust your booking so we may release the slot to other clients.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                3. Consultations, Chemical Treatments &amp; Allergy Precautions
              </h2>
              <p>
                Client safety is our paramount priority during technical chemical procedures:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-warm-gray">
                <li><strong className="text-charcoal">Medical Disclosure:</strong> Clients must inform our stylists before treatment of any allergies, scalp sensitivities, skin conditions, pregnancy, or previous adverse reactions to hair dye or chemical formulas.</li>
                <li><strong className="text-charcoal">Prior Chemical History:</strong> You must disclose past applications of metallic salts, box dyes, black henna, or relaxers, as these interact with professional lighteners and pigments.</li>
                <li><strong className="text-charcoal">Patch Test:</strong> A 48-hour patch test may be recommended or required for new color clients or sensitive skin.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                4. Pricing, Estimates &amp; In-Studio Payment
              </h2>
              <p>
                Service prices published on the website or menu reflect base starting rates. Total investment may vary based on hair length, density, root lift requirement, toner formulations, or additional treatment steps. A comprehensive price quote is provided during your in-chair consultation prior to beginning services.
              </p>
              <p>
                All prices are stated in Indian Rupees (INR). Payments are accepted in-studio via UPI, credit/debit card, or cash.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                5. Personal Belongings &amp; Salon Environment
              </h2>
              <p>
                While our staff exercises the utmost care and provides salon capes, clients are advised not to wear valuable silk or delicate clothing during bleaching or color treatments. Salman Hair Studio cannot assume responsibility for personal belongings left unattended in the salon.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                6. Limitation of Liability
              </h2>
              <p>
                Services are provided by trained professionals in good faith following industry standards. To the extent permitted by applicable Indian law (including the Consumer Protection Act, 2019), Salman Hair Studio&apos;s liability for any claim arising out of salon services shall be limited to re-performing the service or refunding the fee paid for that specific service.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                7. Governing Law &amp; Jurisdiction
              </h2>
              <p>
                These terms are governed by the laws of India. Any disputes arising in connection with services or this agreement shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                8. Contact &amp; Inquiries
              </h2>
              <p>
                For questions regarding these terms, appointment policies, or services, please contact:
              </p>
              <div className="p-4 rounded-xl bg-white border border-charcoal/10 text-xs sm:text-sm space-y-1">
                <p><strong>Salman Hair Studio</strong></p>
                <p className="text-warm-gray">{SALON_INFO.address.full}</p>
                <p className="text-warm-gray">Phone: {SALON_INFO.phone} | WhatsApp: {SALON_INFO.whatsapp}</p>
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
