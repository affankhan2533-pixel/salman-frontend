'use client';

import React, { useEffect, useRef, useState, useMemo, memo } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap';
import { Container } from '@/components/ui';
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  User,
  Scissors,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  AlertCircle,
  RefreshCw,
  Phone,
  FileText,
} from 'lucide-react';
import { SERVICES as ALL_SERVICES } from '@/data/servicesData';
import bookingService from '@/services/bookingService';

// Format services list with uniform display fields
const FORMATTED_SERVICES = ALL_SERVICES.map((s) => ({
  id: s.id,
  slug: s.id,
  name: s.name,
  gender: s.gender,
  category: s.category,
  priceDisplay: s.hasFixedPrice ? `Starting from ${s.price}` : s.pricingNote,
  rawPrice: s.price,
  pricingNote: s.pricingNote,
  hasFixedPrice: s.hasFixedPrice,
  image: s.image,
  duration: s.category === 'face' ? '60 MIN' : s.name.includes('Balayage') ? '180 MIN' : '60 MIN',
  desc: `${s.gender === 'male' ? 'Men\'s' : 'Women\'s'} ${s.name} crafted with atelier precision at Kurla West.`,
}));

// Generate next 14 days for quick selection chips
const generateUpcomingDates = () => {
  const dates = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
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

const buildWhatsAppUrl = (booking) => {
  const lines = [
    `Hello Salman Hair Studio, I have just booked an appointment!`,
    ``,
    `📌 *Booking Ref:* ${booking.bookingRef || 'SHS-CONFIRMED'}`,
    `👤 *Client Name:* ${booking.customerName || booking.name || 'Client'}`,
    `📞 *Phone Number:* ${booking.phone || ''}`,
    booking.email ? `✉️ *Email Address:* ${booking.email}` : null,
    `✂️ *Service:* ${booking.serviceName || booking.service || ''} ${booking.priceDisplay ? `(${booking.priceDisplay})` : ''}`,
    `📅 *Date:* ${booking.date || booking.dateIso || ''}`,
    `⏰ *Time:* ${booking.time || ''}`,
    booking.notes ? `📝 *Client Notes:* ${booking.notes}` : null,
    ``,
    `Please confirm my reservation. Thank you!`,
  ].filter((l) => l !== null);

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/919870810734?text=${text}`;
};

function BookingSection() {
  // Navigation steps: 1: Service (optional if pre-selected), 2: Date & Slot, 3: Customer Form, 4: Confirmed
  const [step, setStep] = useState(2);
  const [selectedService, setSelectedService] = useState(FORMATTED_SERVICES[0]);
  const [servicePreSelected, setServicePreSelected] = useState(false);
  const [activeGenderTab, setActiveGenderTab] = useState('all'); // 'all' | 'male' | 'female'

  // Date selection
  const [selectedDateIso, setSelectedDateIso] = useState(UPCOMING_DATES[0].iso);
  const [selectedDateLabel, setSelectedDateLabel] = useState(UPCOMING_DATES[0].label);

  // Time slot selection
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Customer form details
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isConflictError, setIsConflictError] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const sectionRef = useRef(null);
  const stepContainerRef = useRef(null);

  // Today ISO in IST
  const todayIso = useMemo(() => {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  }, []);

  // 1. URL Query Parameter Pre-selection (?service=male-haircut or ?service=haircut)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const serviceParam = params.get('service');
      if (serviceParam) {
        const cleanParam = serviceParam.toLowerCase().trim();
        const matched = FORMATTED_SERVICES.find((s) => {
          const sId = s.id.toLowerCase();
          const sName = s.name.toLowerCase();
          return (
            sId === cleanParam ||
            sName === cleanParam ||
            sId.includes(cleanParam) ||
            cleanParam.includes(sId) ||
            sName.includes(cleanParam) ||
            (cleanParam === 'haircut' && sId.includes('haircut')) ||
            (cleanParam === 'beard' && sId.includes('beard')) ||
            (cleanParam === 'facial' && sId.includes('facial'))
          );
        });

        if (matched) {
          setSelectedService(matched);
          setServicePreSelected(true);
          setStep(2); // Jump directly to Date & Slot selection
        }
      }
    }
  }, []);

  // 2. Restore confirmed booking from sessionStorage if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('shs_confirmed_booking');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setConfirmedBooking(parsed);
          setStep(4);
        } catch {
          /* ignore */
        }
      }
    }
  }, []);

  // 3. Live availability fetch from backend API
  const fetchAvailability = async (dateIso, serviceItem) => {
    if (!dateIso) return;
    setLoadingSlots(true);
    setErrorMessage('');
    setIsConflictError(false);

    try {
      const sInput = serviceItem?.name || serviceItem?.id || '';
      const response = await bookingService.getAvailability(dateIso, sInput);

      let slotList = [];
      if (response && response.data) {
        slotList = Array.isArray(response.data) ? response.data : response.data.slots || [];
      }

      setAvailabilitySlots(slotList);

      // If previously selected time is still available, keep it; otherwise reset
      setSelectedTimeSlot((prev) => {
        if (!prev) return null;
        const matching = slotList.find(
          (s) => s.time === prev.time || s.startTime === prev.startTime
        );
        return matching && matching.available ? matching : null;
      });
    } catch (err) {
      console.error('[Availability Fetch Error]', err);
      setErrorMessage('Unable to load real-time availability. Please check your connection.');
    } finally {
      setLoadingSlots(false);
    }
  };

  // Fetch availability when date or service changes
  useEffect(() => {
    fetchAvailability(selectedDateIso, selectedService);
  }, [selectedDateIso, selectedService]);

  // Handle custom date picker input change
  const handleDateChange = (newIso) => {
    if (newIso < todayIso) return;
    setSelectedDateIso(newIso);

    // Format human-friendly label
    const parts = newIso.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      setSelectedDateLabel(`${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`);
    } else {
      setSelectedDateLabel(newIso);
    }
    setSelectedTimeSlot(null);
  };

  // Step transition animation
  useEffect(() => {
    if (stepContainerRef.current) {
      gsap.fromTo(
        stepContainerRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [step]);

  // Handle Slot Click
  const handleSlotSelect = (slot) => {
    if (!slot.available) return;
    setSelectedTimeSlot(slot);
    setErrorMessage('');
    setIsConflictError(false);
  };

  // Proceed from Slot Selection to Customer Details
  const handleProceedToDetails = () => {
    if (!selectedTimeSlot) {
      setErrorMessage('Please select an available appointment time slot.');
      return;
    }
    setErrorMessage('');
    setStep(3);
  };

  // Final Submission with Race Condition / Double Booking Protection
  const handleConfirmBooking = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setIsConflictError(false);

    // Form validation
    if (!formData.name || formData.name.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!formData.phone || formData.phone.trim().replace(/\D/g, '').length < 8) {
      setErrorMessage('Please enter a valid phone number (minimum 8 digits).');
      return;
    }
    if (!selectedTimeSlot) {
      setErrorMessage('Please select an available time slot.');
      setStep(2);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: formData.name.trim(),
        clientName: formData.name.trim(),
        phone: formData.phone.trim(),
        clientPhone: formData.phone.trim(),
        clientEmail: formData.email ? formData.email.trim() : '',
        service: selectedService.name,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        date: selectedDateIso,
        time: selectedTimeSlot.time || selectedTimeSlot.startTime,
        startTime: selectedTimeSlot.startTime || selectedTimeSlot.time,
        notes: formData.notes.trim(),
      };

      const result = await bookingService.createBooking(payload);

      const bookingRef = result?.data?.bookingRef || 'SHS-' + Date.now().toString(36).slice(-5).toUpperCase();

      const confirmedData = {
        bookingRef,
        serviceName: selectedService.name,
        date: selectedDateLabel,
        dateIso: selectedDateIso,
        time: selectedTimeSlot.time,
        priceDisplay: selectedService.priceDisplay,
        customerName: formData.name.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email ? formData.email.trim() : '',
        notes: formData.notes ? formData.notes.trim() : '',
      };

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('shs_confirmed_booking', JSON.stringify(confirmedData));
      }

      setConfirmedBooking(confirmedData);
      setStep(4);

      // Connect directly on WhatsApp with all client details
      const waUrl = buildWhatsAppUrl(confirmedData);
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          try {
            const win = window.open(waUrl, '_blank');
            if (!win || win.closed || typeof win.closed === 'undefined') {
              window.location.href = waUrl;
            }
          } catch (e) {
            window.location.href = waUrl;
          }
        }, 600);
      }
    } catch (err) {
      console.error('[Booking Error]', err);
      const is409 = err?.response?.status === 409 || err?.response?.data?.code === 'SLOT_ALREADY_BOOKED';
      const apiMsg = err?.response?.data?.message || err?.message;

      if (is409) {
        setIsConflictError(true);
        setErrorMessage('Sorry, this time slot has just been booked. Please choose another time.');
        // Automatically refresh availability so newly booked slot appears as BOOKED
        await fetchAvailability(selectedDateIso, selectedService);
        // Direct customer back to step 2 to pick another slot immediately
        setSelectedTimeSlot(null);
        setStep(2);
      } else {
        setErrorMessage(apiMsg || 'We could not reserve your appointment. Please check your details and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter services by gender tab
  const filteredServices = useMemo(() => {
    if (activeGenderTab === 'all') return FORMATTED_SERVICES;
    return FORMATTED_SERVICES.filter((s) => s.gender === activeGenderTab);
  }, [activeGenderTab]);

  return (
    <section
      ref={sectionRef}
      id="booking"
      className="relative z-30 py-16 sm:py-24 bg-[#F7F4EE] border-t border-border-light select-none overflow-hidden min-h-[85vh]"
    >
      {/* Subtle luxury dot atmosphere */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#1F1F1C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

      <Container size="editorial">
        {/* HEADER */}
        <div className="max-w-3xl mb-10 space-y-3">
          <div className="flex items-center gap-3 text-lbl text-[11px] tracking-[0.32em] text-warm-gray uppercase font-medium">
            <span className="w-1.5 h-1.5 bg-champagne rounded-full" />
            <span>REAL-TIME APPOINTMENT RESERVATIONS</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl leading-[0.95] text-charcoal font-normal uppercase tracking-tight">
            Reserve Your Private Session.
          </h1>

          <p className="font-body text-warm-gray font-light text-sm sm:text-base leading-relaxed max-w-xl">
            Live slot booking for Salman Hair Studio, Kurla West. Confirmed appointments lock the time slot immediately for all clients.
          </p>
        </div>

        {/* PROGRESS STEPPER (Steps 1 to 3) */}
        {step < 4 && (
          <div className="mb-8 border-b border-border-light pb-4">
            {/* Mobile Compact Progress Bar (Eliminates horizontal scrolling/clipping on phones) */}
            <div className="flex sm:hidden items-center justify-between text-xs pb-1">
              <span className="text-lbl text-[11px] font-semibold text-champagne uppercase tracking-widest">
                Step {step} of 3
              </span>
              <span className="text-lbl text-[11px] font-medium text-charcoal uppercase tracking-wider">
                {step === 1 ? '1. Select Service' : step === 2 ? '2. Date & Time' : '3. Client Details'}
              </span>
            </div>
            <div className="w-full bg-charcoal/10 h-1.5 rounded-full overflow-hidden sm:hidden mt-2">
              <div
                className="bg-champagne h-full transition-all duration-300 rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            {/* Tablet & Desktop Horizontal Stepper */}
            <div className="hidden sm:flex items-center gap-6 overflow-x-auto scrollbar-none text-xs">
              {[
                { num: 1, label: '1. Service', active: step === 1, done: step > 1 },
                { num: 2, label: '2. Date & Time', active: step === 2, done: step > 2 },
                { num: 3, label: '3. Details', active: step === 3, done: step > 3 },
              ].map((sItem) => (
                <div key={sItem.num} className="flex items-center gap-2 shrink-0">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-num font-semibold transition-all ${
                      sItem.active
                        ? 'bg-champagne text-charcoal shadow-sm scale-105'
                        : sItem.done
                        ? 'bg-charcoal text-white'
                        : 'bg-white border border-charcoal/15 text-warm-gray'
                    }`}
                  >
                    {sItem.done ? '✓' : sItem.num}
                  </span>
                  <span
                    onClick={() => {
                      if (sItem.done) setStep(sItem.num);
                    }}
                    className={`uppercase tracking-wider font-medium text-lbl ${
                      sItem.active
                        ? 'text-charcoal font-semibold'
                        : sItem.done
                        ? 'text-charcoal/70 cursor-pointer hover:text-champagne'
                        : 'text-warm-gray'
                    }`}
                  >
                    {sItem.label}
                  </span>
                  {sItem.num < 3 && <span className="w-10 h-[1px] bg-charcoal/15 mx-1" />}
                </div>
              ))}
            </div>
          </div>
        )}


        {/* ERROR / CONFLICT BANNER */}
        {errorMessage && (
          <div
            className={`mb-8 p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-center gap-3 animate-fadeIn ${
              isConflictError
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-900'
                : 'bg-red-500/10 border-red-500/30 text-red-700'
            }`}
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="flex-1">
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* MAIN BODY GRID */}
        {step < 4 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LEFT 7 COLUMNS: ACTIVE STEP VIEW */}
            <div ref={stepContainerRef} className="lg:col-span-7">
              {/* STEP 1: SERVICE SELECTION */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="font-heading text-2xl text-charcoal font-normal uppercase">
                      Select Atelier Service
                    </h2>

                    {/* Gender Tabs */}
                    <div className="inline-flex p-1 rounded-xl bg-white border border-charcoal/10 text-xs">
                      {[
                        { id: 'all', label: 'All 20' },
                        { id: 'male', label: 'Men' },
                        { id: 'female', label: 'Women' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveGenderTab(tab.id)}
                          className={`px-3 py-1.5 rounded-lg font-lbl tracking-wider uppercase transition-all ${
                            activeGenderTab === tab.id
                              ? 'bg-charcoal text-white font-medium shadow-sm'
                              : 'text-warm-gray hover:text-charcoal'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {filteredServices.map((srv) => {
                      const isSelected = selectedService.id === srv.id;
                      return (
                        <div
                          key={srv.id}
                          onClick={() => {
                            setSelectedService(srv);
                            setServicePreSelected(false);
                            setStep(2);
                          }}
                          className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                            isSelected
                              ? 'bg-white border-champagne shadow-[0_8px_25px_-5px_rgba(197,160,89,0.25)] ring-1 ring-champagne'
                              : 'bg-white/70 border-charcoal/10 hover:border-champagne/50 hover:bg-white'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-lbl tracking-widest uppercase px-2 py-0.5 rounded-md bg-cream text-warm-gray">
                                {srv.gender === 'male' ? 'Men' : 'Women'} · {srv.category}
                              </span>
                            </div>
                            <h3 className="font-heading text-lg text-charcoal font-medium">
                              {srv.name}
                            </h3>
                            <p className="text-body text-xs text-warm-gray line-clamp-1">{srv.desc}</p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-num text-sm font-bold text-charcoal block">
                              {srv.priceDisplay}
                            </span>
                            <span className="text-[10px] font-lbl tracking-widest uppercase text-champagne block mt-0.5">
                              {srv.duration}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: DATE & TIME SLOT SELECTION */}
              {step === 2 && (
                <div className="space-y-8">
                  {/* PRE-SELECTED SERVICE SUMMARY BANNER */}
                  <div className="p-4 rounded-2xl bg-white border border-champagne/40 flex items-center justify-between gap-4 shadow-sm">
                    <div>
                      <span className="text-lbl text-[10px] text-champagne tracking-widest uppercase block font-semibold">
                        SELECTED SERVICE
                      </span>
                      <h2 className="font-heading text-lg text-charcoal font-medium mt-0.5">
                        {selectedService.name}
                      </h2>
                      <span className="font-num text-xs font-semibold text-charcoal/80 block mt-0.5">
                        {selectedService.priceDisplay}
                      </span>
                    </div>

                    <button
                      onClick={() => setStep(1)}
                      className="text-lbl text-xs tracking-wider uppercase text-champagne hover:text-charcoal underline underline-offset-4 cursor-pointer font-medium"
                    >
                      Change Service
                    </button>
                  </div>

                  {/* DATE SELECTOR */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-lbl text-xs text-charcoal uppercase tracking-widest font-semibold flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-champagne" />
                        <span>Select Date</span>
                      </label>

                      {/* Native HTML5 date picker fallback for picking any future date */}
                      <input
                        type="date"
                        min={todayIso}
                        value={selectedDateIso}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-charcoal/15 bg-white text-xs font-num text-charcoal focus:outline-none focus:border-champagne cursor-pointer"
                      />
                    </div>

                    {/* Quick Date Chips (Next 14 days with horizontal scroll fade hint) */}
                    <div className="relative">
                      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none pr-6">
                        {UPCOMING_DATES.map((dObj) => {
                          const isSelected = selectedDateIso === dObj.iso;
                          return (
                            <button
                              key={dObj.iso}
                              onClick={() => handleDateChange(dObj.iso)}
                              className={`px-4 py-3 rounded-2xl border text-center transition-all shrink-0 font-num text-xs uppercase font-medium cursor-pointer active:scale-95 ${
                                isSelected
                                  ? 'bg-charcoal text-white border-charcoal shadow-md font-bold'
                                  : 'bg-white/70 border-charcoal/10 text-charcoal hover:border-champagne/50 hover:bg-white'
                              }`}
                            >
                              <span className="block">{dObj.label}</span>
                            </button>
                          );
                        })}
                      </div>
                      {/* Subtle right gradient fade to hint scrollability on mobile */}
                      <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-[#F7F4EE] to-transparent pointer-events-none sm:hidden" />
                    </div>
                  </div>

                  {/* REAL-TIME SLOTS GRID */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-lbl text-xs text-charcoal uppercase tracking-widest font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-champagne" />
                        <span>Select Available Time</span>
                      </label>

                      {loadingSlots && (
                        <span className="text-lbl text-[11px] text-champagne font-medium flex items-center gap-1.5 animate-pulse">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Checking available times...</span>
                        </span>
                      )}
                    </div>

                    {loadingSlots && availabilitySlots.length === 0 ? (
                      <div className="p-8 text-center bg-white/70 rounded-2xl border border-charcoal/10 text-warm-gray text-xs animate-pulse">
                        Checking available times for {selectedDateLabel}...
                      </div>
                    ) : availabilitySlots.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {availabilitySlots.map((slot) => {
                          const isSelected = selectedTimeSlot?.time === slot.time;
                          const isAvailable = slot.available;
                          const isBooked = slot.isBooked || slot.status === 'booked';
                          const isPast = slot.isPast || slot.status === 'past';

                          return (
                            <button
                              key={slot.time}
                              disabled={!isAvailable}
                              onClick={() => handleSlotSelect(slot)}
                              className={`p-4 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 min-h-[64px] active:scale-95 ${
                                isSelected
                                  ? 'bg-charcoal text-white border-charcoal shadow-lg scale-[1.02] cursor-pointer'
                                  : isAvailable
                                  ? 'bg-white border-charcoal/15 text-charcoal hover:border-champagne hover:bg-white/90 cursor-pointer shadow-sm'
                                  : isBooked
                                  ? 'bg-zinc-200/50 border-zinc-200 text-zinc-400 cursor-not-allowed opacity-60'
                                  : 'bg-zinc-100 border-zinc-200/60 text-zinc-400 cursor-not-allowed opacity-40'
                              }`}
                            >
                              <span className="font-num text-xs font-bold tracking-wide">
                                {slot.time}
                              </span>
                              <span
                                className={`text-[9px] font-lbl tracking-widest uppercase font-semibold ${
                                  isSelected
                                    ? 'text-champagne'
                                    : isBooked
                                    ? 'text-zinc-500'
                                    : isPast
                                    ? 'text-zinc-400'
                                    : 'text-champagne'
                                }`}
                              >
                                {isSelected ? 'SELECTED' : isBooked ? 'BOOKED' : isPast ? 'PAST' : 'AVAILABLE'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-white/70 rounded-2xl border border-charcoal/10 text-warm-gray text-xs">
                        No appointment slots available for {selectedDateLabel}.
                      </div>
                    )}
                  </div>

                  {/* NAVIGATION TO STEP 3 */}
                  <div className="pt-4 flex items-center justify-between border-t border-border-light">
                    <button
                      onClick={() => setStep(1)}
                      className="h-12 px-5 rounded-xl border border-charcoal/20 text-charcoal hover:border-charcoal text-xs uppercase tracking-widest font-medium flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      onClick={handleProceedToDetails}
                      disabled={!selectedTimeSlot}
                      className="h-12 px-8 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all text-xs uppercase tracking-widest font-medium rounded-xl shadow-md flex items-center gap-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* MOBILE STICKY PROCEED BAR (instant thumb access as soon as a slot is selected) */}
                  {selectedTimeSlot && (
                    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/95 backdrop-blur-xl border-t border-champagne/40 shadow-[0_-10px_35px_rgba(31,31,28,0.12)] flex items-center justify-between gap-3 animate-fadeIn">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-lbl tracking-wider uppercase text-champagne font-bold block">
                          {selectedTimeSlot.time} SELECTED
                        </span>
                        <span className="text-xs font-heading text-charcoal font-medium line-clamp-1">
                          {selectedDateLabel}
                        </span>
                      </div>
                      <button
                        onClick={handleProceedToDetails}
                        className="h-12 px-6 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all text-xs uppercase tracking-widest font-medium rounded-xl shadow-md flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}


              {/* STEP 3: CUSTOMER DETAILS FORM */}
              {step === 3 && (
                <form onSubmit={handleConfirmBooking} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-2xl text-charcoal font-normal uppercase">
                      Confirm Appointment Details
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="text-lbl text-[11px] text-warm-gray uppercase tracking-widest block mb-1.5 font-medium">
                        Full Name <span className="text-champagne">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Farhan Khan"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full h-12 px-4 rounded-xl bg-white border border-charcoal/15 text-charcoal text-sm focus:outline-none focus:border-champagne transition-colors"
                        />
                      </div>
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-lbl text-[11px] text-warm-gray uppercase tracking-widest block mb-1.5 font-medium">
                          Phone Number <span className="text-champagne">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98708 10734"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full h-12 px-4 rounded-xl bg-white border border-charcoal/15 text-charcoal text-sm focus:outline-none focus:border-champagne transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-lbl text-[11px] text-warm-gray uppercase tracking-widest block mb-1.5 font-medium">
                          Email Address <span className="text-warm-gray/60 font-light text-[10px]">(Optional)</span>
                        </label>
                        <input
                          type="email"
                          placeholder="client@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full h-12 px-4 rounded-xl bg-white border border-charcoal/15 text-charcoal text-sm focus:outline-none focus:border-champagne transition-colors"
                        />
                      </div>
                    </div>

                    {/* Pre-filled Service, Date, Time (Read-only summary inputs) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 bg-white rounded-xl border border-charcoal/10">
                        <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block">SERVICE</span>
                        <span className="text-xs font-semibold text-charcoal block truncate mt-0.5">{selectedService.name}</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-charcoal/10">
                        <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block">DATE</span>
                        <span className="text-xs font-semibold text-charcoal block truncate mt-0.5">{selectedDateLabel}</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-charcoal/10">
                        <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block">TIME</span>
                        <span className="text-xs font-semibold text-charcoal block truncate mt-0.5">{selectedTimeSlot?.time}</span>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="text-lbl text-[11px] text-warm-gray uppercase tracking-widest block mb-1.5 font-medium">
                        Additional Note <span className="text-warm-gray/60 font-light text-[10px]">(Optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Any hair condition details, styling preferences or requests..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full p-3.5 rounded-xl bg-white border border-charcoal/15 text-charcoal text-sm focus:outline-none focus:border-champagne transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* FORM ACTIONS */}
                  <div className="pt-4 flex items-center justify-between border-t border-border-light">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setStep(2)}
                      className="h-12 px-5 rounded-xl border border-charcoal/20 text-charcoal hover:border-charcoal text-xs uppercase tracking-widest font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Change Time</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-12 px-8 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all text-xs uppercase tracking-[0.2em] font-medium rounded-xl shadow-md flex items-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{isSubmitting ? 'BOOKING...' : 'BOOK NOW →'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* RIGHT 5 COLUMNS: STICKY LIVE SUMMARY PANEL */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-[28px] border border-champagne/40 shadow-[0_20px_50px_-15px_rgba(197,160,89,0.15)] space-y-5">
                <div className="pb-3 border-b border-border-light flex items-center justify-between">
                  <span className="text-lbl text-[10px] text-champagne tracking-[0.28em] font-semibold uppercase block">
                    RESERVATION SUMMARY
                  </span>
                  <span className="w-2 h-2 rounded-full bg-champagne animate-pulse" />
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block mb-0.5">
                      SERVICE
                    </span>
                    <h3 className="font-heading text-lg text-charcoal font-medium">
                      {selectedService.name}
                    </h3>
                    <span className="text-lbl text-[11px] text-champagne font-semibold block mt-0.5">
                      {selectedService.priceDisplay}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border-light/60">
                    <div>
                      <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block mb-0.5">
                        DATE
                      </span>
                      <span className="font-num text-xs font-semibold text-charcoal block">
                        {selectedDateLabel}
                      </span>
                    </div>

                    <div>
                      <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block mb-0.5">
                        TIME SLOT
                      </span>
                      <span className="font-num text-xs font-semibold text-charcoal block">
                        {selectedTimeSlot?.time || 'Not selected yet'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border-light/60">
                    <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block mb-0.5">
                      LOCATION
                    </span>
                    <span className="font-body text-xs text-charcoal/80 block leading-relaxed">
                      Shop No. 5, Manav Drishti Apartments, LBS Marg, Kurla West, Mumbai
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-light flex items-center justify-between">
                  <span className="text-lbl text-xs text-warm-gray uppercase tracking-widest font-medium">
                    STATUS
                  </span>
                  <span className="text-xs font-lbl tracking-wider uppercase text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    AWAITING RESERVATION
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 4: CONFIRMATION SCREEN */
          <div
            ref={stepContainerRef}
            className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-[32px] border border-champagne/40 shadow-[0_30px_70px_-15px_rgba(197,160,89,0.2)] text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-champagne/15 text-champagne flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-lbl text-xs text-champagne tracking-[0.3em] uppercase block font-semibold">
                APPOINTMENT RECEIVED
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl text-charcoal font-normal uppercase">
                {confirmedBooking?.serviceName || selectedService.name}
              </h2>
              <p className="font-num text-sm text-charcoal/80 font-medium">
                {confirmedBooking?.date || selectedDateLabel} at {confirmedBooking?.time || selectedTimeSlot?.time}
              </p>
            </div>

            <div className="bg-[#F7F4EE] p-5 rounded-2xl border border-charcoal/10 text-xs sm:text-sm text-charcoal/90 leading-relaxed max-w-md mx-auto">
              <p>
                We have received your appointment request. Your selected time has been reserved and is awaiting confirmation. Salman Hair Studio will contact you if confirmation is required.
              </p>
            </div>

            {/* Booking Reference Display */}
            {confirmedBooking?.bookingRef && (
              <div className="bg-champagne/10 border border-champagne/30 rounded-2xl p-4 max-w-xs mx-auto">
                <span className="text-lbl text-[10px] text-champagne tracking-[0.25em] uppercase block mb-0.5 font-semibold">
                  BOOKING REFERENCE
                </span>
                <span className="font-num text-xl font-bold text-charcoal tracking-widest">
                  {confirmedBooking.bookingRef}
                </span>
              </div>
            )}

            <div className="flex flex-col items-center justify-center gap-1">
              <span className="text-[11px] font-lbl tracking-wider uppercase text-champagne font-medium animate-pulse">
                Redirecting directly to WhatsApp with your appointment details...
              </span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <a
                href={buildWhatsAppUrl(confirmedBooking || {})}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <button className="w-full sm:w-auto h-12 px-6 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all text-xs tracking-widest uppercase font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md">
                  <MessageCircle className="w-4 h-4 text-champagne" />
                  <span>Connect on WhatsApp</span>
                </button>
              </a>

              <button
                onClick={() => {
                  if (typeof window !== 'undefined') sessionStorage.removeItem('shs_confirmed_booking');
                  setConfirmedBooking(null);
                  setSelectedTimeSlot(null);
                  setStep(2);
                  setFormData({ name: '', phone: '', email: '', notes: '' });
                }}
                className="w-full sm:w-auto h-12 px-6 bg-transparent text-charcoal border border-charcoal/30 hover:border-charcoal transition-all text-xs tracking-widest uppercase font-medium rounded-xl cursor-pointer"
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
