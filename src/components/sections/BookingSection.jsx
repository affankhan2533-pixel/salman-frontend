'use client';

import React, { useEffect, useRef, useState, memo } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap';
import { Container } from '@/components/ui';
import { CheckCircle2, Calendar as CalendarIcon, Clock, User, Scissors, Sparkles, Crown, Palette, ArrowRight, ArrowLeft, MessageCircle } from 'lucide-react';

const SERVICES = [
  { id: 'cut', slug: 'haircut', name: 'Bespoke Precision Haircut & Sculpting', duration: '60 MIN', price: '₹3,500', desc: 'Architectural precision sculpting tailored to facial bone structure.' },
  { id: 'color', slug: 'color', name: 'Couture Balayage & Tone Formulation', duration: '150 MIN', price: '₹8,500', desc: 'Hand-painted dimensional balayage with high-shine organic gloss.' },
  { id: 'spa', slug: 'spa', name: 'European Botanical Scalp Therapy', duration: '75 MIN', price: '₹4,000', desc: 'Deep restorative scalp therapy with botanical oil micro-steam.' },
  { id: 'keratin', slug: 'keratin', name: 'Silk Keratin Glass-Smoothing Infusion', duration: '180 MIN', price: '₹9,000', desc: 'Formaldehyde-free silk keratin for weightless shine & frizz defense.' },
  { id: 'bridal', slug: 'bridal', name: 'Private Atelier Bridal Coiffure', duration: '120 MIN', price: '₹15,000', desc: 'Private suite trial session, veil placement & extension architecture.' },
  { id: 'botox', slug: 'botox', name: 'Collagen & Amino Acid Hair Restructuring', duration: '120 MIN', price: '₹10,500', desc: 'Intensive molecular hair botox treatment restoring mass & mirror shine.' },
];

const STYLISTS = [
  { id: 'salman', name: 'Salman Khan', title: 'Master Artistic Director', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300' },
  { id: 'elena', name: 'Elena Rostova', title: 'Senior Color Specialist', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300' },
  { id: 'aarav', name: 'Aarav Mehta', title: 'Haute Coiffure Stylist', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300' },
];

const TIME_SLOTS = {
  morning: ['10:00 AM', '11:30 AM'],
  afternoon: ['01:30 PM', '03:00 PM', '04:30 PM'],
  evening: ['06:00 PM', '07:30 PM'],
};

import bookingService from '@/services/bookingService';
import api from '@/services/api';

const generateUpcomingDates = () => {
  const dates = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const monthStr = (d.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = d.getDate().toString().padStart(2, '0');
    const iso = `${year}-${monthStr}-${dayStr}`;

    const dayName = daysOfWeek[d.getDay()];
    const monthName = months[d.getMonth()];
    const dayNum = d.getDate();

    let label = `${dayName}, ${monthName} ${dayNum}`;
    if (i === 0) label = `Today, ${monthName} ${dayNum}`;
    else if (i === 1) label = `Tomorrow, ${monthName} ${dayNum}`;

    dates.push({ iso, label, dateObj: d });
  }
  return dates;
};

const UPCOMING_DATES = generateUpcomingDates();

function BookingSection() {
  const [step, setStep] = useState(1);
  const [availableServices, setAvailableServices] = useState(SERVICES);
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [selectedStylist, setSelectedStylist] = useState(STYLISTS[0]);
  const [selectedDateObj, setSelectedDateObj] = useState(UPCOMING_DATES[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const sectionRef = useRef(null);
  const stepContainerRef = useRef(null);

  // Fetch active services dynamically from MongoDB API
  useEffect(() => {
    async function fetchPublicServices() {
      try {
        const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const API_URL = rawUrl.replace(/\/api\/?$/, '');
        const res = await fetch(`${API_URL}/api/services?active=true`);
        const json = await res.json();
        if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map((s) => ({
            id: s._id,
            slug: s.slug || s.title.toLowerCase().replace(/\s+/g, '-'),
            name: s.title,
            duration: `${s.duration} MIN`,
            price: `₹${s.price.toLocaleString('en-IN')}`,
            desc: s.description || 'Precision luxury salon service.',
            rawPrice: s.price,
            rawDuration: s.duration,
          }));
          setAvailableServices(mapped);
          setSelectedService(mapped[0]);

          // Handle URL query parameter ?service=[slug]
          if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const sParam = params.get('service');
            if (sParam) {
              const found = mapped.find(
                (s) => s.id === sParam || s.slug === sParam || (sParam === 'haircut' && s.slug.includes('haircut'))
              );
              if (found) setSelectedService(found);
            }
          }
        }
      } catch (err) {
        console.error('[BookingSection] Failed to fetch public services from API:', err);
      }
    }
    fetchPublicServices();
  }, []);

  // On mount: restore confirmed booking from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('shs_confirmed_booking');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setConfirmedBooking(parsed);
          setIsSubmitted(true);
        } catch { /* ignore */ }
      }
    }
  }, []);

  // Live availability fetch from backend API
  const fetchLiveAvailability = async (dateIso, serviceItem, stylistItem) => {
    setLoadingSlots(true);
    try {
      const sInput = serviceItem?.name || serviceItem?.slug || serviceItem?.id || '';
      const stInput = stylistItem?.name || stylistItem?.id || '';
      const res = await api.get(`/appointments/availability?date=${dateIso}&service=${encodeURIComponent(sInput)}&stylist=${encodeURIComponent(stInput)}`);
      if (res.data && res.data.data) {
        setAvailabilitySlots(res.data.data);
        // Select first available slot if none selected yet
        const firstAvail = res.data.data.find(s => s.isAvailable);
        if (firstAvail && !selectedTimeSlot) {
          setSelectedTimeSlot(firstAvail);
        }
      }
    } catch (err) {
      console.error('[Availability Error]', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchLiveAvailability(selectedDateObj.iso, selectedService, selectedStylist);
  }, [selectedDateObj, selectedService, selectedStylist]);

  useEffect(() => {
    if (stepContainerRef.current) {
      gsap.fromTo(
        stepContainerRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [step, isSubmitted]);

  const handleNext = async () => {
    setErrorMessage('');
    if (step < 5) {
      if (step === 3 || step === 4) {
        // Refresh availability on step progression
        await fetchLiveAvailability(selectedDateObj.iso, selectedService, selectedStylist);
      }
      setStep(step + 1);
      return;
    }

    // Step 5 Validation
    if (!formData.name || formData.name.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!formData.phone || formData.phone.trim().length < 8) {
      setErrorMessage('Please enter a valid phone number (minimum 8 digits).');
      return;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Real API Submission with Atomic Overlap Protection
    setIsSubmitting(true);
    try {
      const result = await bookingService.createBooking({
        clientName: formData.name.trim(),
        clientPhone: formData.phone.trim(),
        clientEmail: formData.email.trim(),
        service: selectedService?.name || 'Haircut & Styling',
        stylist: selectedStylist?.name || 'Salman Malik',
        date: selectedDateObj.iso,
        startTime: selectedTimeSlot?.time || selectedTimeSlot?.startTime || '11:00 AM',
        notes: formData.notes,
      });

      // Build confirmed booking details for display + sessionStorage persistence
      const booking = {
        bookingRef: result?.data?.bookingRef || null,
        service: selectedService?.name,
        stylist: selectedStylist?.name,
        date: selectedDateObj.label,
        dateIso: selectedDateObj.iso,
        time: selectedTimeSlot?.time || selectedTimeSlot?.startTime || '',
        duration: selectedService?.duration,
        price: selectedService?.price,
        clientName: formData.name.trim(),
        pendingExpiresAt: result?.data?.pendingExpiresAt || null,
      };

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('shs_confirmed_booking', JSON.stringify(booking));
      }
      setConfirmedBooking(booking);
      setIsSubmitted(true);
    } catch (err) {
      console.error('[Booking Submission Error]', err);
      const is409 = err?.response?.status === 409 || err?.response?.data?.code === 'SLOT_UNAVAILABLE';
      const apiMsg = err?.response?.data?.message || err?.message;

      if (is409) {
        setErrorMessage(`${selectedTimeSlot?.time || 'Selected slot'} is no longer available. Please select another time slot.`);
        await fetchLiveAvailability(selectedDateObj.iso, selectedService, selectedStylist);
        setStep(4);
      } else {
        setErrorMessage(apiMsg || 'We could not confirm your reservation. Please check your details and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setErrorMessage('');
    if (step > 1) setStep(step - 1);
  };

  return (
    <section
      ref={sectionRef}
      id="booking"
      className="relative z-30 py-24 sm:py-32 bg-[#F7F4EE] border-t border-border-light select-none overflow-hidden"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#1F1F1C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

      <Container size="editorial">
        {/* SECTION INTRO */}
        <div className="max-w-3xl mb-12 sm:mb-16 space-y-4">
          <div className="flex items-center gap-3 text-lbl text-[11px] tracking-[0.32em] text-warm-gray uppercase font-medium">
            <span className="w-1.5 h-1.5 bg-champagne rounded-full" />
            <span>PRIVATE CONSULTATION JOURNEY</span>
          </div>

          <h2 className="font-heading text-4xl sm:text-6xl lg:text-[76px] leading-[0.92] text-charcoal font-normal uppercase tracking-tight">
            Your Signature Look Starts Here.
          </h2>

          <p className="font-body text-warm-gray font-light text-base sm:text-lg leading-relaxed max-w-xl">
            Select your bespoke service, preferred artistic director, and private appointment slot for our Kurla West studio.
          </p>
        </div>

        {/* PROGRESS INDICATOR */}
        {!isSubmitted && (
          <div className="mb-12 border-b border-border-light pb-6">
            <div className="flex items-center justify-between max-w-3xl overflow-x-auto gap-4 scrollbar-none">
              {['Service', 'Stylist', 'Date', 'Time', 'Details'].map((label, idx) => {
                const stepNum = idx + 1;
                const isActive = step === stepNum;
                const isPassed = step > stepNum;
                return (
                  <div key={label} className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold font-num transition-all duration-300 ${
                          isActive
                            ? 'bg-champagne text-charcoal shadow-md scale-110'
                            : isPassed
                            ? 'bg-charcoal text-white'
                            : 'bg-cream text-warm-gray border border-charcoal/10'
                        }`}
                      >
                        {isPassed ? '✓' : stepNum}
                      </span>
                      <span
                        className={`text-lbl text-xs tracking-wider uppercase font-medium ${
                          isActive ? 'text-charcoal font-semibold' : 'text-warm-gray'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {idx < 4 && <span className="w-8 sm:w-12 h-[1px] bg-charcoal/15 hidden sm:block" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MAIN BOOKING CONTENT & STICKY SUMMARY GRID */}
        {!isSubmitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* LEFT 7 COLUMNS: MULTI-STEP FORM */}
            <div ref={stepContainerRef} className="lg:col-span-7 space-y-8">
              
              {/* STEP 1: CHOOSE SERVICE */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-heading text-2xl text-charcoal font-normal uppercase">
                    1. Select Atelier Service
                  </h3>
                  <div className="space-y-3.5">
                    {availableServices.map((srv) => {
                      const isSelected = selectedService.id === srv.id;
                      return (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedService(srv)}
                          className={`p-6 rounded-[20px] border transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            isSelected
                              ? 'bg-white border-champagne shadow-[0_12px_30px_-5px_rgba(197,160,89,0.2)] translate-x-1'
                              : 'bg-white/60 border-charcoal/10 hover:border-champagne/40 hover:bg-white'
                          }`}
                        >
                          <div className="space-y-1">
                            <h4 className="font-heading text-xl text-charcoal font-medium">
                              {srv.name}
                            </h4>
                            <p className="text-body text-xs text-warm-gray leading-relaxed max-w-md">
                              {srv.desc}
                            </p>
                          </div>

                          <div className="text-left sm:text-right shrink-0">
                            <span className="font-num text-xs font-semibold text-champagne block uppercase tracking-widest mb-0.5">
                              {srv.duration}
                            </span>
                            <span className="font-num text-base font-bold text-charcoal block">
                              {srv.price}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: CHOOSE STYLIST */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-heading text-2xl text-charcoal font-normal uppercase">
                    2. Select Artistic Director
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {STYLISTS.map((st) => {
                      const isSelected = selectedStylist.id === st.id;
                      return (
                        <div
                          key={st.id}
                          onClick={() => setSelectedStylist(st)}
                          className={`p-6 rounded-[20px] border text-center transition-all duration-300 cursor-pointer space-y-4 ${
                            isSelected
                              ? 'bg-white border-champagne shadow-[0_12px_30px_-5px_rgba(197,160,89,0.2)] scale-[1.02]'
                              : 'bg-white/60 border-charcoal/10 hover:border-champagne/40 hover:bg-white'
                          }`}
                        >
                          <div className="relative w-20 h-20 rounded-full overflow-hidden border border-champagne/40 mx-auto">
                            <Image src={st.avatarUrl} alt={st.name} fill unoptimized sizes="80px" className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-heading text-lg text-charcoal font-medium">{st.name}</h4>
                            <span className="text-lbl text-[10px] text-warm-gray tracking-wider uppercase block mt-1">{st.title}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: CHOOSE DATE */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-heading text-2xl text-charcoal font-normal uppercase">
                    3. Select Preferred Date
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {UPCOMING_DATES.map((dObj) => {
                      const isSelected = selectedDateObj.iso === dObj.iso;
                      return (
                        <button
                          key={dObj.iso}
                          onClick={() => setSelectedDateObj(dObj)}
                          className={`p-4 rounded-2xl border text-center transition-all duration-300 font-num text-xs uppercase font-medium cursor-pointer ${
                            isSelected
                              ? 'bg-champagne text-charcoal border-champagne shadow-md font-bold'
                              : 'bg-white/60 border-charcoal/10 text-charcoal hover:border-champagne/40'
                          }`}
                        >
                          {dObj.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: CHOOSE TIME SLOT */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-2xl text-charcoal font-normal uppercase">
                      4. Select Appointment Slot
                    </h3>
                    {loadingSlots && (
                      <span className="text-lbl text-[11px] text-champagne animate-pulse font-medium">
                        Checking live database availability...
                      </span>
                    )}
                  </div>

                  {availabilitySlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {availabilitySlots.map((slotItem) => {
                        const isSelected = selectedTimeSlot?.time === slotItem.time || selectedTimeSlot?.startTime === slotItem.startTime;
                        const isAvailable = slotItem.isAvailable;
                        const isBooked = slotItem.isBooked;
                        const isPast = slotItem.isPast;

                        return (
                          <button
                            key={slotItem.time || slotItem.startTime}
                            disabled={!isAvailable}
                            onClick={() => setSelectedTimeSlot(slotItem)}
                            className={`p-3.5 rounded-xl border text-xs font-num tracking-wider font-semibold transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                              isSelected
                                ? 'bg-charcoal text-white border-charcoal shadow-md scale-105 cursor-pointer'
                                : isAvailable
                                ? 'bg-white/70 border-charcoal/15 text-charcoal hover:border-champagne/60 hover:bg-white cursor-pointer'
                                : isBooked
                                ? 'bg-red-500/10 border-red-500/20 text-red-700/60 cursor-not-allowed line-through opacity-75'
                                : 'bg-zinc-200/40 border-zinc-200 text-zinc-400 cursor-not-allowed opacity-50'
                            }`}
                          >
                            <span className="font-bold">{slotItem.time}</span>
                            <span className={`text-[9px] font-lbl tracking-widest uppercase ${isSelected ? 'text-champagne' : isBooked ? 'text-red-600 font-bold' : 'text-warm-gray'}`}>
                              {isBooked ? 'BOOKED' : isPast ? 'PAST' : 'AVAILABLE'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-white/60 rounded-2xl border border-charcoal/10 text-warm-gray text-xs">
                      Loading salon availability for {selectedDateObj.label}...
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: YOUR DETAILS */}
              {step === 5 && (
                <div className="space-y-4">
                  <h3 className="font-heading text-2xl text-charcoal font-normal uppercase">
                    5. Personal Details &amp; Atelier Requests
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-lbl text-[11px] text-warm-gray uppercase tracking-widest block mb-1.5 font-medium">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Ananya Roy"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-13 px-4 rounded-xl bg-white border border-charcoal/15 text-charcoal text-sm focus:outline-none focus:border-champagne transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-lbl text-[11px] text-warm-gray uppercase tracking-widest block mb-1.5 font-medium">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="+91 98708 10734"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full h-13 px-4 rounded-xl bg-white border border-charcoal/15 text-charcoal text-sm focus:outline-none focus:border-champagne transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-lbl text-[11px] text-warm-gray uppercase tracking-widest block mb-1.5 font-medium">Email Address</label>
                        <input
                          type="email"
                          placeholder="ananya@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full h-13 px-4 rounded-xl bg-white border border-charcoal/15 text-charcoal text-sm focus:outline-none focus:border-champagne transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-lbl text-[11px] text-warm-gray uppercase tracking-widest block mb-1.5 font-medium">Special Atelier Requests</label>
                      <textarea
                        rows={3}
                        placeholder="Any hair history, preferred beverages, or specific styling requests..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full p-4 rounded-xl bg-white border border-charcoal/15 text-charcoal text-sm focus:outline-none focus:border-champagne transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ERROR MESSAGE ALERT STATE */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-medium font-body flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* NAVIGATION BUTTONS */}
              <div className="flex items-center justify-between pt-6 border-t border-border-light">
                {step > 1 ? (
                  <button
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="h-12 px-6 bg-transparent text-charcoal border border-charcoal/30 hover:border-charcoal transition-all duration-300 font-inter text-xs tracking-widest uppercase font-medium rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : <div />}

                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="h-13 px-8 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2.5 cursor-pointer ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? 'Reserving...' : step === 5 ? 'Confirm Consultation' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* RIGHT 5 COLUMNS: STICKY LIVE SUMMARY PANEL */}
            <div className="lg:col-span-5 sticky top-28">
              <div className="bg-white/80 backdrop-blur-md p-8 rounded-[28px] border border-champagne/40 shadow-[0_20px_50px_-15px_rgba(197,160,89,0.15)] space-y-6">
                <div className="pb-4 border-b border-border-light flex items-center justify-between">
                  <span className="text-lbl text-[10px] text-champagne tracking-[0.28em] font-semibold uppercase block">
                    APPOINTMENT SUMMARY
                  </span>
                  <span className="w-2 h-2 rounded-full bg-champagne animate-pulse" />
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block mb-0.5">SELECTED SERVICE</span>
                    <h4 className="font-heading text-lg text-charcoal font-medium">{selectedService.name}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block mb-0.5">ARTISTIC DIRECTOR</span>
                      <span className="font-body text-charcoal font-medium block">{selectedStylist.name}</span>
                    </div>
                    <div>
                      <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block mb-0.5">ESTIMATED DURATION</span>
                      <span className="font-num text-charcoal font-semibold block">{selectedService.duration}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block mb-0.5">DATE</span>
                      <span className="font-num text-charcoal font-medium block">{selectedDateObj.label}</span>
                    </div>
                    <div>
                      <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block mb-0.5">TIME</span>
                      <span className="font-num text-charcoal font-medium block">{selectedTimeSlot?.time || 'Select Slot'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-light flex items-center justify-between">
                  <span className="text-lbl text-xs text-warm-gray uppercase tracking-widest font-medium">ESTIMATED INVESTMENT</span>
                  <span className="font-num text-xl font-bold text-champagne">{selectedService.price}</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* STEP 6: SUCCESS CONFIRMATION CARD */
          <div ref={stepContainerRef} className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-[32px] border border-champagne/40 shadow-[0_30px_70px_-15px_rgba(197,160,89,0.2)] text-center space-y-8">
            <div className="w-20 h-20 rounded-full bg-champagne/15 text-champagne flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-lbl text-xs text-champagne tracking-[0.3em] uppercase block font-semibold">
                RESERVATION RECEIVED
              </span>
              <h3 className="font-heading text-3xl sm:text-4xl text-charcoal font-normal uppercase">
                We Look Forward To Welcoming You.
              </h3>
              <p className="text-body text-warm-gray font-light text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                Your reservation is pending confirmation. Our team will confirm it shortly via WhatsApp.
              </p>
            </div>

            {/* Booking Reference — prominent display */}
            {(confirmedBooking?.bookingRef) && (
              <div className="bg-champagne/10 border border-champagne/30 rounded-2xl p-5 text-center">
                <span className="text-lbl text-[10px] text-champagne tracking-[0.3em] uppercase block mb-1 font-semibold">BOOKING REFERENCE</span>
                <span className="font-num text-2xl font-bold text-charcoal tracking-widest">{confirmedBooking.bookingRef}</span>
                <p className="text-warm-gray text-xs mt-1.5 font-light">Save this reference to look up your appointment.</p>
              </div>
            )}

            <div className="bg-[#F7F4EE] p-6 rounded-2xl border border-charcoal/10 text-left space-y-3 font-body text-xs sm:text-sm">
              <div className="flex justify-between"><span className="text-warm-gray">Service:</span><strong className="text-charcoal font-medium">{confirmedBooking?.service || selectedService?.name}</strong></div>
              <div className="flex justify-between"><span className="text-warm-gray">Stylist:</span><strong className="text-charcoal font-medium">{confirmedBooking?.stylist || selectedStylist?.name}</strong></div>
              <div className="flex justify-between"><span className="text-warm-gray">Date &amp; Time:</span><strong className="text-charcoal font-medium">{confirmedBooking?.date || selectedDateObj.label} at {confirmedBooking?.time || selectedTimeSlot?.time || ''}</strong></div>
              <div className="flex justify-between"><span className="text-warm-gray">Duration:</span><strong className="text-charcoal font-medium">{confirmedBooking?.duration || selectedService?.duration}</strong></div>
              <div className="flex justify-between"><span className="text-warm-gray">Location:</span><strong className="text-charcoal font-medium">Shop No. 5, Manav Drishti Apts, LBS Marg, Kurla West, Mumbai</strong></div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href={`https://wa.me/919870810734?text=${encodeURIComponent(
                  `Hello Salman Hair Studio, I have a pending reservation.\nBooking Ref: ${confirmedBooking?.bookingRef || ''}\nService: ${confirmedBooking?.service || selectedService?.name || ''}\nDate & Time: ${confirmedBooking?.date || selectedDateObj.label} at ${confirmedBooking?.time || selectedTimeSlot?.time || ''}\nDuration: ${confirmedBooking?.duration || selectedService?.duration || ''}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <button className="w-full h-12 px-6 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all text-xs tracking-widest uppercase font-medium rounded-xl flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4 text-champagne" />
                  <span>Send via WhatsApp</span>
                </button>
              </a>

              <button
                onClick={() => {
                  if (typeof window !== 'undefined') sessionStorage.removeItem('shs_confirmed_booking');
                  setConfirmedBooking(null);
                  setIsSubmitted(false);
                  setStep(1);
                  setFormData({ name: '', phone: '', email: '', notes: '' });
                }}
                className="w-full sm:w-auto h-12 px-6 bg-transparent text-charcoal border border-charcoal/30 hover:border-charcoal transition-all text-xs tracking-widest uppercase font-medium rounded-xl"
              >
                Book Another
              </button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

export default memo(BookingSection);
