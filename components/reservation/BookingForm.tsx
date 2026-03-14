"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reservationSchema, ReservationFormValues } from "@/lib/validations";
import { useState } from "react";
import toast from "react-hot-toast";

const TIME_SLOTS = [
  { label: "11:00 AM", value: "11:00" },
  { label: "11:30 AM", value: "11:30" },
  { label: "12:00 PM", value: "12:00" },
  { label: "12:30 PM", value: "12:30" },
  { label: "01:00 PM", value: "13:00" },
  { label: "01:30 PM", value: "13:30" },
  { label: "02:00 PM", value: "14:00" },
  { label: "02:30 PM", value: "14:30" },
  { label: "03:00 PM", value: "15:00" },
  { label: "03:30 PM", value: "15:30" },
  { label: "04:00 PM", value: "16:00" },
  { label: "04:30 PM", value: "16:30" },
  { label: "05:00 PM", value: "17:00" },
  { label: "05:30 PM", value: "17:30" },
  { label: "06:00 PM", value: "18:00" },
  { label: "06:30 PM", value: "18:30" },
  { label: "07:00 PM", value: "19:00" },
  { label: "07:30 PM", value: "19:30" },
  { label: "08:00 PM", value: "20:00" },
  { label: "08:30 PM", value: "20:30" },
  { label: "09:00 PM", value: "21:00" },
  { label: "09:30 PM", value: "21:30" },
  { label: "10:00 PM", value: "22:00" },
  { label: "10:30 PM", value: "22:30" },
  { label: "11:00 PM", value: "23:00" },
  { label: "11:30 PM", value: "23:30" },
  { label: "12:00 AM", value: "00:00" },
  { label: "12:30 AM", value: "00:30" },
];

const OCCASIONS = ["Birthday", "Anniversary", "Business Dinner", "Family Gathering", "Date Night", "Other"];

export default function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema) as any,
  });




  const onSubmit = async (data: ReservationFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Reservation confirmed!");
        setConfirmationId(result.data.confirmationId);
        reset();
      } else {

        toast.error(result.message || "Failed to make reservation");
      }
    } catch (error) {
      console.error("Booking Form Submission Error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmationId) {
    return (
      <div className="bg-[#1A1A1A] border border-[#C9A84C]/30 p-10 text-center max-w-2xl mx-auto shadow-[0_0_30px_rgba(201,168,76,0.1)]">
        <div className="w-20 h-20 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C] flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✨</span>
        </div>
        <h3 className="font-playfair text-3xl text-[#C9A84C] mb-4">Table Reserved Successfully</h3>
        <p className="font-cormorant text-xl text-[#F5F0E8]/80 mb-6 leading-relaxed">
          Thank you for choosing Dawat Restaurant. We look forward to hosting you for a royal dining experience.
        </p>
        <div className="bg-[#0A0A0A] border border-[#C9A84C]/20 py-4 px-6 inline-block mb-8">
          <span className="font-jost text-sm text-[#8B949E] uppercase tracking-widest block mb-2">Confirmation Code</span>
          <span className="font-playfair text-2xl text-[#F5F0E8] tracking-widest">{confirmationId}</span>
        </div>
        <button
          onClick={() => setConfirmationId(null)}
          className="block w-full border border-[#C9A84C] text-[#C9A84C] font-jost uppercase tracking-widest py-3 hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors duration-300"
        >
          Make Another Reservation
        </button>
      </div>
    );
  }


  return (
    <div className="bg-[#111111] border p-8 md:p-12 border-gold/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">

        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block font-jost text-xs uppercase tracking-widest text-[#8B949E] mb-2">Full Name *</label>
            <input
              {...register("name")}
              id="name"
              type="text"
              className="w-full bg-[#0A0A0A] border border-[#C9A84C]/30 text-[#F5F0E8] px-4 py-3 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-colors duration-300 placeholder-[#484F58]"
              placeholder="e.g. Rahul Sharma"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block font-jost text-xs uppercase tracking-widest text-[#8B949E] mb-2">Phone Number *</label>
            <input
              {...register("phone")}
              id="phone"
              type="tel"
              className="w-full bg-[#0A0A0A] border border-[#C9A84C]/30 text-[#F5F0E8] px-4 py-3 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-colors duration-300 placeholder-[#484F58]"
              placeholder="e.g. 9904043204"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
        </div>


        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block font-jost text-xs uppercase tracking-widest text-[#8B949E] mb-2">Email Address (Optional)</label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className="w-full bg-[#0A0A0A] border border-[#C9A84C]/30 text-[#F5F0E8] px-4 py-3 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-colors duration-300 placeholder-[#484F58]"
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="guests" className="block font-jost text-xs uppercase tracking-widest text-[#8B949E] mb-2">Number of Guests *</label>
            <input
              {...register("guests", { valueAsNumber: true })}
              id="guests"
              type="number"
              min="1"
              max="20"
              className="w-full bg-[#0A0A0A] border border-[#C9A84C]/30 text-[#F5F0E8] px-4 py-3 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-colors duration-300"
            />
            {errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests.message}</p>}
          </div>
        </div>


        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block font-jost text-xs uppercase tracking-widest text-[#8B949E] mb-2">Date *</label>
            <input
              {...register("date")}
              id="date"
              type="date"
              className="w-full bg-[#0A0A0A] border border-[#C9A84C]/30 text-[#F5F0E8] px-4 py-3 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-colors duration-300 color-scheme-dark"
              style={{ colorScheme: "dark" }}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
          </div>
          <div>
            <label htmlFor="time" className="block font-jost text-xs uppercase tracking-widest text-[#8B949E] mb-2">Time *</label>
            <select
              {...register("time")}
              id="time"
              className="w-full bg-[#0A0A0A] border border-[#C9A84C]/30 text-[#F5F0E8] px-4 py-3 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-colors duration-300 appearance-none cursor-pointer"
            >
              <option value="">Select a time</option>
              {TIME_SLOTS.map(slot => (
                <option key={slot.value} value={slot.value} className="bg-[#111111]">{slot.label}</option>
              ))}
            </select>
            {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
          </div>
        </div>


        {/* Row 4 */}
        <div>
          <label htmlFor="occasion" className="block font-jost text-xs uppercase tracking-widest text-[#8B949E] mb-2">Occasion (Optional)</label>
          <select
            {...register("occasion")}
            id="occasion"
            className="w-full bg-[#0A0A0A] border border-[#C9A84C]/30 text-[#F5F0E8] px-4 py-3 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-colors duration-300 appearance-none cursor-pointer"
          >
            <option value="">Select an occasion</option>
            {OCCASIONS.map(occ => (
              <option key={occ} value={occ} className="bg-[#111111]">{occ}</option>
            ))}
          </select>
        </div>


        {/* Row 5 */}
        <div>
          <label htmlFor="specialRequests" className="block font-jost text-xs uppercase tracking-widest text-[#8B949E] mb-2">Special Requests</label>
          <textarea
            {...register("specialRequests")}
            id="specialRequests"
            rows={4}
            className="w-full bg-[#0A0A0A] border border-[#C9A84C]/30 text-[#F5F0E8] px-4 py-3 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-colors duration-300 custom-scrollbar resize-none placeholder-[#484F58]"
            placeholder="Any allergies or special requests?"
          ></textarea>
          {errors.specialRequests && <p className="text-red-500 text-xs mt-1">{errors.specialRequests.message}</p>}
        </div>


        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gold text-dark font-jost uppercase tracking-widest py-4 font-bold hover:bg-gold-light hover:shadow-[0_0_20px_rgba(201,168,76,0.6)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {isSubmitting ? "Processing..." : "Confirm Reservation"}
        </button>
      </form>
    </div>
  );
}
