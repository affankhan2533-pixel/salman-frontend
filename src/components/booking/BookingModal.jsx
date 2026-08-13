'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, CheckCircle2, MessageCircle, AlertCircle, Loader2 } from 'lucide-react';
import { bookingService } from '@/services/bookingService';

const SERVICES = [
  'Haircut & Styling',
  'Couture Hair Color',
  'Silk Keratin Smoothing',
  'Hair Botox Collagen',
  'Botanical Hair Spa',
  'Bridal Coiffure',
];

const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:30 PM',
  '07:00 PM',
];

const INITIAL_FORM_STATE = {
  name: '',
  phone: '',
  email: '',
  service: 'Haircut & Styling',
  date: new Date().toISOString().split('T')[0],
  time: '11:30 AM',
  stylist: 'Senior Master Stylist',
  notes: '',
};

export default function BookingModal({ isOpen, onClose, defaultService = 'Haircut & Styling' }) {
  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const [formData, setFormData] = useState({
    ...INITIAL_FORM_STATE,
    service: defaultService,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdBooking, setCreatedBooking] = useState(null);

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    setErrorMsg('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Please enter your full name.';
    if (!formData.phone.trim() || formData.phone.trim().length < 8) return 'Please enter a valid phone number.';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid email address.';
    if (!formData.date) return 'Please select a booking date.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    // Prevent double submission
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg('');

    // Optimistic UI state placeholder
    const tempBooking = {
      _id: 'TEMP-' + Date.now().toString(36),
      ...formData,
    };

    try {
      const response = await bookingService.createBooking(formData);
      setCreatedBooking(response.data || tempBooking);
      setStep(2); // Move to Success State

      // Reset form state for next booking
      setFormData(INITIAL_FORM_STATE);
    } catch (err) {
      const apiMsg = err.response?.data?.message || err.message || 'Booking submission failed. Please try again.';
      setErrorMsg(apiMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate WhatsApp confirmation link
  const getWhatsAppLink = () => {
    if (!createdBooking) return '#';
    const text = encodeURIComponent(
      `Hello Salman Hair Studio, I have reserved a private session!\n\n` +
      `📌 Booking ID: ${createdBooking._id.slice(-6).toUpperCase()}\n` +
      `👤 Name: ${createdBooking.name}\n` +
      `✂️ Service: ${createdBooking.service}\n` +
      `📅 Date & Time: ${createdBooking.date} at ${createdBooking.time}\n\n` +
      `Please confirm my reservation.`
    );
    return `https://wa.me/919870810734?text=${text}`;
  };

  const handleModalClose = () => {
    setStep(1);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-charcoal/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-ivory border border-border-light rounded-[32px] p-6 sm:p-10 shadow-2xl overflow-hidden my-auto">
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          className="absolute top-6 right-6 p-2.5 rounded-full bg-cream border border-border-light hover:border-champagne hover:text-champagne transition-colors cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: FORM FLOW */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-lbl text-[11px] text-champagne tracking-[0.3em] uppercase block font-semibold">
                ATELIER RESERVATION
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl text-charcoal font-normal uppercase">
                Reserve Signature Experience
              </h2>
            </div>

            {errorMsg && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Selection */}
              <div className="space-y-1.5">
                <label className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase font-semibold block">
                  Select Service
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => handleChange('service', e.target.value)}
                  className="w-full h-11 px-4 bg-cream border border-border-light rounded-xl text-xs text-charcoal font-medium focus:outline-none focus:border-champagne"
                >
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase font-semibold block">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full h-11 px-4 bg-cream border border-border-light rounded-xl text-xs text-charcoal font-medium focus:outline-none focus:border-champagne"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase font-semibold block">
                    Preferred Time
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    className="w-full h-11 px-4 bg-cream border border-border-light rounded-xl text-xs text-charcoal font-medium focus:outline-none focus:border-champagne"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase font-semibold block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aanya Shroff"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full h-11 px-4 bg-cream border border-border-light rounded-xl text-xs text-charcoal font-medium focus:outline-none focus:border-champagne"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase font-semibold block">
                    Phone (+91)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98708 10734"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full h-11 px-4 bg-cream border border-border-light rounded-xl text-xs text-charcoal font-medium focus:outline-none focus:border-champagne"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase font-semibold block">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. aanya@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full h-11 px-4 bg-cream border border-border-light rounded-xl text-xs text-charcoal font-medium focus:outline-none focus:border-champagne"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[52px] bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-xl shadow-md hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-champagne" />
                      <span>Submitting Reservation...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 text-champagne" />
                      <span>Confirm Reservation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: SUCCESS STATE & WHATSAPP CONFIRMATION */}
        {step === 2 && createdBooking && (
          <div className="text-center space-y-6 py-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-champagne/10 border border-champagne/40 flex items-center justify-center text-champagne mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-lbl text-xs text-champagne tracking-[0.3em] uppercase block font-semibold">
                RESERVATION CONFIRMED
              </span>
              <h3 className="font-heading text-3xl text-charcoal font-normal uppercase">
                We Look Forward to Welcoming You
              </h3>
              <p className="font-body text-warm-gray font-light text-sm max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-charcoal font-normal">{createdBooking.name}</strong>. Your atelier reservation for <strong className="text-charcoal font-normal">{createdBooking.service}</strong> on <strong className="text-charcoal font-normal">{createdBooking.date} at {createdBooking.time}</strong> has been logged into our master schedule.
              </p>
            </div>

            <div className="p-4 bg-cream border border-border-light rounded-2xl text-left space-y-2 max-w-md mx-auto text-xs">
              <div className="flex justify-between">
                <span className="text-warm-gray">Booking ID:</span>
                <span className="font-mono font-bold text-charcoal">{createdBooking._id.slice(-6).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray">Status:</span>
                <span className="font-semibold text-champagne">Pending Atelier Confirmation</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <button className="w-full sm:w-auto h-[50px] px-8 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all duration-300 text-xs tracking-[0.2em] uppercase font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md">
                  <MessageCircle className="w-4 h-4 text-champagne" />
                  <span>Send WhatsApp Confirmation</span>
                </button>
              </a>

              <button
                onClick={handleModalClose}
                className="w-full sm:w-auto h-[50px] px-8 bg-transparent text-charcoal border border-charcoal/30 hover:border-charcoal transition-all duration-300 text-xs tracking-[0.2em] uppercase font-medium rounded-xl cursor-pointer"
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
