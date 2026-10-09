import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui';
import { SALON_INFO } from '@/constants/salonInfo';
import { Shield, Lock, FileText, CheckCircle, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Salman Hair Studio Mumbai',
  description:
    'Privacy Policy and data protection disclosures for Salman Hair Studio, Kurla West, Mumbai. Compliant with the Digital Personal Data Protection Act, 2023 (DPDPA).',
};

export default function PrivacyPolicyPage() {
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
              <Shield className="w-3 h-3 text-champagne" />
              <span>Data Protection &amp; Privacy Notice</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl text-charcoal uppercase tracking-tight">
              Privacy Policy
            </h1>
            <p className="font-body text-xs sm:text-sm text-warm-gray">
              Effective Date: October 9, 2026 • Salman Hair Studio, Mumbai, Maharashtra, India
            </p>
          </header>

          {/* Legal Notice Callout */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-charcoal/80 mb-10 space-y-1">
            <p className="font-semibold text-charcoal uppercase tracking-wider text-[11px]">
              Regulatory Notice &amp; Owner Verification
            </p>
            <p className="font-light leading-relaxed">
              This policy outlines how Salman Hair Studio handles client information under India&apos;s Digital Personal Data Protection Act, 2023 (DPDPA 2023). [OWNER APPROVAL REQUIRED: Final legal verification by salon management recommended before statutory reliance].
            </p>
          </div>

          {/* Content sections */}
          <article className="prose prose-neutral max-w-none space-y-10 font-body text-charcoal/90 text-sm sm:text-base leading-relaxed">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                1. Data Fiduciary &amp; Studio Identity
              </h2>
              <p>
                <strong>Salman Hair Studio</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Studio&rdquo;) operates the hair and grooming atelier located at:
              </p>
              <div className="p-4 rounded-xl bg-white border border-charcoal/10 text-xs sm:text-sm space-y-1">
                <p className="font-medium text-charcoal">{SALON_INFO.name}</p>
                <p className="text-warm-gray">{SALON_INFO.address.full}</p>
                <p className="text-warm-gray">Phone: {SALON_INFO.phone} | Email: {SALON_INFO.email}</p>
              </div>
              <p>
                We act as the Data Fiduciary in respect of personal data submitted when you book an appointment, inquire about services, or visit our studio.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                2. Information We Collect
              </h2>
              <p>
                We collect only the minimum personal data strictly necessary to schedule, confirm, and provide salon services:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-warm-gray">
                <li><strong className="text-charcoal">Identity Data:</strong> Client full name.</li>
                <li><strong className="text-charcoal">Contact Data:</strong> Mobile phone number (used for booking reminders, schedule adjustments, and WhatsApp confirmation).</li>
                <li><strong className="text-charcoal">Appointment Preferences:</strong> Selected hair/beauty services, preferred date, preferred time slot, and chosen stylist.</li>
                <li><strong className="text-charcoal">Consultation Notes (Optional):</strong> Any specific chemical history, hair condition details, or special requests voluntarily provided.</li>
              </ul>
              <p className="text-xs text-warm-gray italic">
                * Note: We do not process or store credit/debit card numbers on this website. Service charges are settled directly in-studio upon completion of your visit.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                3. Purpose &amp; Lawful Basis for Processing
              </h2>
              <p>
                Under the Digital Personal Data Protection Act, 2023, personal data is processed exclusively on the basis of client consent and legitimate operational use:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-warm-gray">
                <li>To reserve and manage appointment slots in our atelier calendar.</li>
                <li>To send transactional confirmation notices via WhatsApp or SMS.</li>
                <li>To prevent duplicate slot bookings and manage staff scheduling.</li>
                <li>To respond to customer support inquiries and feedback.</li>
              </ul>
              <p>
                We do <strong className="text-charcoal">not</strong> sell, trade, or rent client personal data to third-party data brokers or marketing agencies.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                4. Data Storage, Security &amp; Retention
              </h2>
              <p>
                Your data is stored in secured databases with encryption in transit and restricted administrative access. We retain booking records only as long as necessary to fulfill salon services and maintain operational appointment logs, or as required by applicable Indian tax and commercial record-keeping laws.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                5. Client Rights Under Indian Law (DPDPA 2023)
              </h2>
              <p>
                As a Data Principal under Indian law, you have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-warm-gray">
                <li><strong className="text-charcoal">Right to Access:</strong> Request a summary of your personal data processed by the studio.</li>
                <li><strong className="text-charcoal">Right to Correction &amp; Erasure:</strong> Request correction of inaccurate information or deletion of your booking records.</li>
                <li><strong className="text-charcoal">Right to Withdraw Consent:</strong> Withdraw consent for booking communications at any time.</li>
                <li><strong className="text-charcoal">Right of Grievance Redressal:</strong> Submit grievances regarding data handling to our designated Grievance Officer.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                6. Grievance Redressal Officer
              </h2>
              <p>
                In accordance with Section 10 of the Digital Personal Data Protection Act, 2023, inquiries or complaints regarding personal data may be directed to our designated officer:
              </p>
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-charcoal/10 space-y-2 text-xs sm:text-sm">
                <p><strong>Designated Grievance Contact:</strong> Salman Malik / Farmaan Malik [OWNER APPROVAL REQUIRED]</p>
                <p><strong>Studio:</strong> Salman Hair Studio, Kurla West, Mumbai 400070</p>
                <p><strong>Direct Telephone / WhatsApp:</strong> {SALON_INFO.phone}</p>
                <p><strong>Email:</strong> {SALON_INFO.email}</p>
                <p className="text-warm-gray pt-1 text-[11px]">
                  Responses to privacy inquiries are provided within thirty (30) business days.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl text-charcoal uppercase tracking-wide border-b border-border-light/60 pb-2">
                7. Policy Updates
              </h2>
              <p>
                We may periodically update this policy to reflect operational improvements or regulatory updates. Any changes will be published here with an updated effective date.
              </p>
            </section>

          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
