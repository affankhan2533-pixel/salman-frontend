'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, CheckCircle2, MessageCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { SERVICES as ALL_SERVICES } from '@/data/servicesData';
import bookingService from '@/services/bookingService';

export default function BookingModal({ isOpen, onClose, defaultService = 'Hair Cut' }) {
  // Today ISO in IST
  const todayIso = useMemo(() => {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  }, []);

  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: defaultService,
    date: todayIso,
    time: '',
    notes: '',
  });

  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdBooking, setCreatedBooking] = useState(null);

  // Sync default service when modal opens
  useEffect(() => {
    if (isOpen) {
      const matched = ALL_SERVICES.find(
        (s) =>
          s.id === defaultService ||
          s.name.toLowerCase() === defaultService.toLowerCase() ||
          defaultService.toLowerCase().includes(s.name.toLowerCase())
      );
      setFormData((prev) => ({
        ...prev,
        service: matched ? matched.name : defaultService,
        date: todayIso,
        time: '',
      }));
      setStep(1);
      setErrorMsg('');
    }
  }, [isOpen, defaultService, todayIso]);

  // Fetch live slot availability whenever date or service changes
  const fetchLiveSlots = async (dateStr, serviceStr) => {
    if (!dateStr) return;
    setLoadingSlots(true);
    try {
      const res = await bookingService.getAvailability(dateStr, serviceStr);
      let list = [];
      if (res && res.data) {
        list = Array.isArray(res.data) ? res.data : res.data.slots || [];
      }
      setAvailabilitySlots(list);

      // Auto-select first available slot if none selected or current is unavailable
      const firstAvail = list.find((s) => s.available);
      setFormData((prev) => {
        const stillAvail = list.find((s) => (s.time === prev.time || s.startTime === prev.time) && s.available);
        return {
          ...prev,
          time: stillAvail ? prev.time : firstAvail ? firstAvail.time : '',
        };
      });
    } catch (err) {
      console.error('[BookingModal Availability Error]', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (isOpen && formData.date) {
      fetchLiveSlots(formData.date, formData.service);
    }
  }, [isOpen, formData.date, formData.service]);

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    setErrorMsg('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Please enter your full name.';
    if (!formData.phone.trim() || formData.phone.trim().replace(/\D/g, '').length < 8) {
      return 'Please enter a valid phone number (minimum 8 digits).';
    }
    if (!formData.date) return 'Please select an appointment date.';
    if (!formData.time) return 'Please select an available appointment time slot.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await bookingService.createBooking({
        customerName: formData.name.trim(),
        clientName: formData.name.trim(),
        phone: formData.phone.trim(),
        clientPhone: formData.phone.trim(),
        clientEmail: formData.email ? formData.email.trim() : '',
        service: formData.service,
        serviceName: formData.service,
        date: formData.date,
        time: formData.time,
        startTime: formData.time,
        notes: formData.notes.trim(),
      });

      const bookingRef = response?.data?.bookingRef || 'SHS-' + Date.now().toString(36).slice(-5).toUpperCase();
      const bookingData = {
        bookingRef,
        customerName: formData.name.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email ? formData.email.trim() : '',
        service: formData.service,
        serviceName: formData.service,
        date: formData.date,
        time: formData.time,
        notes: formData.notes ? formData.notes.trim() : '',
      };

      setCreatedBooking(bookingData);
      setStep(2);

      // Connect directly on WhatsApp with all client details
      const waUrl = getWhatsAppLink(bookingData);
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
      console.error('[BookingModal Error]', err);
      const is409 = err?.response?.status === 409 || err?.response?.data?.code === 'SLOT_ALREADY_BOOKED';
      const apiMsg = err?.response?.data?.message || err?.message;

      if (is409) {
        setErrorMsg('Sorry, this time slot has just been booked. Please choose another time.');
        await fetchLiveSlots(formData.date, formData.service);
      } else {
        setErrorMsg(apiMsg || 'Booking submission failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate WhatsApp link with full client and appointment details
  const getWhatsAppLink = (overrideData) => {
    const data = overrideData || createdBooking || formData;
    const ref = data.bookingRef || 'SHS-CONFIRMED';
    const lines = [
      `Hello Salman Hair Studio, I have just booked an appointment!`,
      ``,
      `📌 *Booking Ref:* ${ref}`,
      `👤 *Client Name:* ${data.customerName || data.name || 'Client'}`,
      `📞 *Phone Number:* ${data.phone || ''}`,
      data.email ? `✉️ *Email Address:* ${data.email}` : null,
      `✂️ *Service:* ${data.serviceName || data.service || ''}`,
      `📅 *Date:* ${data.date || ''}`,
      `⏰ *Time:* ${data.time || ''}`,
      data.notes ? `📝 *Client Notes:* ${data.notes}` : null,
      ``,
      `Please confirm my reservation. Thank you!`,
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/919870810734?text=${text}`;
  };

  const handleModalClose = () => {
    setStep(1);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-charcoal/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#F7F4EE] border border-border-light rounded-[32px] p-6 sm:p-8 shadow-2xl overflow-hidden my-auto max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          className="absolute top-5 right-5 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white border border-border-light hover:border-champagne hover:text-champagne active:scale-95 transition-all flex items-center justify-center cursor-pointer z-10"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5 text-charcoal" />
        </button>

        {/* STEP 1: BOOKING FORM */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="text-lbl text-[11px] text-champagne tracking-[0.3em] uppercase block font-semibold">
                SALMAN HAIR STUDIO
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl text-charcoal font-normal uppercase">
                Reserve Appointment Slot
              </h2>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-900 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Selection */}
              <div className="space-y-1.5">
                <label className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase font-semibold block">
                  Service
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => handleChange('service', e.target.value)}
                  className="w-full h-11 px-4 bg-white border border-charcoal/15 rounded-xl text-xs text-charcoal font-medium focus:outline-none focus:border-champagne"
                >
                  {ALL_SERVICES.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.gender === 'male' ? '[Men]' : '[Women]'} {s.name} — {s.hasFixedPrice ? s.price : s.pricingNote}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase font-semibold block">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    min={todayIso}
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full h-11 px-4 bg-white border border-charcoal/15 rounded-xl text-xs font-num text-charcoal font-medium focus:outline-none focus:border-champagne"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase font-semibold block">
                      Available Slot
                    </label>
                    {loadingSlots && (
                      <span className="text-[10px] font-lbl text-champagne animate-pulse">
                        Checking...
                      </span>
                    )}
                  </div>

                  <select
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    className="w-full h-11 px-4 bg-white border border-charcoal/15 rounded-xl text-xs font-num text-charcoal font-medium focus:outline-none focus:border-champagne"
                    required
                  >
                    <option value="" disabled>
                      {loadingSlots ? 'Checking available times...' : 'Select a time slot'}
                    </option>
                    {availabilitySlots.map((slot) => (
                      <option
                        key={slot.time}
                        value={slot.time}
                        disabled={!slot.available}
                      >
                        {slot.time} {slot.available ? '(AVAILABLE)' : slot.isBooked ? '(BOOKED)' : '(PAST)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase font-semibold block">
                    Full Name <span className="text-champagne">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aanya Shroff"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full h-11 px-4 bg-white border border-charcoal/15 rounded-xl text-xs text-charcoal font-medium focus:outline-none focus:border-champagne"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase font-semibold block">
                    Phone (+91) <span className="text-champagne">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98708 10734"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full h-11 px-4 bg-white border border-charcoal/15 rounded-xl text-xs text-charcoal font-medium focus:outline-none focus:border-champagne"
                    required
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div className="space-y-1.5">
                <label className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase font-semibold block">
                  Email Address <span className="text-warm-gray/60 font-light text-[10px]">(Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="client@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full h-11 px-4 bg-white border border-charcoal/15 rounded-xl text-xs text-charcoal font-medium focus:outline-none focus:border-champagne"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.time}
                  className="w-full h-[52px] bg-charcoal text-white hover:bg-champagne hover:text-charcoal active:scale-[0.98] transition-all text-xs tracking-[0.2em] uppercase font-medium rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-champagne" />
                      <span>BOOKING...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 text-champagne" />
                      <span>BOOK NOW →</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: SUCCESS CONFIRMATION */}
        {step === 2 && createdBooking && (
          <div className="text-center space-y-6 py-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-champagne/15 text-champagne flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-lbl text-xs text-champagne tracking-[0.3em] uppercase block font-semibold">
                APPOINTMENT RECEIVED
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl text-charcoal font-normal uppercase">
                {createdBooking.service || formData.service}
              </h2>
              <p className="font-num text-sm text-charcoal/80 font-medium">
                {createdBooking.date || formData.date} at {createdBooking.time || formData.time}
              </p>
            </div>

            <div className="p-4 bg-white border border-charcoal/10 rounded-2xl text-left space-y-2 max-w-md mx-auto text-xs">
              <div className="flex justify-between">
                <span className="text-warm-gray">Booking Reference:</span>
                <span className="font-mono font-bold text-charcoal tracking-wider">
                  {createdBooking.bookingRef || 'SHS-CONFIRMED'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray">Status:</span>
                <span className="font-semibold text-amber-800">Pending Confirmation</span>
              </div>
            </div>

            <p className="font-body text-warm-gray text-xs max-w-sm mx-auto leading-relaxed">
              We have received your appointment request. Salman Hair Studio will contact you if confirmation is required.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <button className="w-full sm:w-auto h-[48px] px-6 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all text-xs tracking-widest uppercase font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md">
                  <MessageCircle className="w-4 h-4 text-champagne" />
                  <span>Send via WhatsApp</span>
                </button>
              </a>

              <button
                onClick={handleModalClose}
                className="w-full sm:w-auto h-[48px] px-6 bg-transparent text-charcoal border border-charcoal/30 hover:border-charcoal transition-all text-xs tracking-widest uppercase font-medium rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
