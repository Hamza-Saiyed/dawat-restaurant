"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919904043204";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent("Hi! I'd like to place an order at Dawat Restaurant")}`;

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-xl focus:outline-none ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Order on WhatsApp"
      title="Order on WhatsApp"
    >
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-75"></div>
      <MessageCircle size={28} className="relative z-10" />
    </a>
  );
}
