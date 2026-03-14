"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactFormValues } from "@/lib/validations";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        reset();
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      console.error("Contact Form Submission Error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1A1A1A] p-8 md:p-10 border border-gold/20">
      <h3 className="font-playfair text-3xl text-gold mb-6">Send us a Message</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-jost text-xs uppercase tracking-widest text-text-muted mb-2">Full Name *</label>
          <input
            {...register("name")}
            type="text"
            className="w-full bg-dark border border-gold/30 text-text-primary px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors duration-300"
            placeholder="Your name"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-jost text-xs uppercase tracking-widest text-text-muted mb-2">Email Address *</label>
            <input
              {...register("email")}
              type="email"
              className="w-full bg-dark border border-gold/30 text-text-primary px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors duration-300"
              placeholder="Your email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block font-jost text-xs uppercase tracking-widest text-text-muted mb-2">Phone Number (Optional)</label>
            <input
              {...register("phone")}
              type="tel"
              className="w-full bg-dark border border-gold/30 text-text-primary px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors duration-300"
              placeholder="Your phone"
            />
          </div>
        </div>

        <div>
          <label className="block font-jost text-xs uppercase tracking-widest text-text-muted mb-2">Subject *</label>
          <input
            {...register("subject")}
            type="text"
            className="w-full bg-dark border border-gold/30 text-text-primary px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors duration-300"
            placeholder="How can we help?"
          />
          {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
        </div>

        <div>
          <label className="block font-jost text-xs uppercase tracking-widest text-text-muted mb-2">Message *</label>
          <textarea
            {...register("message")}
            rows={5}
            className="w-full bg-dark border border-gold/30 text-text-primary px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors duration-300 custom-scrollbar resize-none"
            placeholder="Write your message here..."
          ></textarea>
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-transparent border border-gold text-gold font-jost uppercase tracking-widest py-4 font-bold hover:bg-gold hover:text-dark transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
