"use client";

import { useState, useEffect } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import { Star } from "lucide-react";
import clsx from "clsx";

const reviews = [
  { id: 1, name: "Rahul Sharma", rating: 5, text: "Best butter chicken in Ahmedabad! The ambiance is royal and service is top-notch." },
  { id: 2, name: "Priya Patel", rating: 5, text: "Visited for anniversary dinner. Absolutely loved the mutton biryani and staff was very attentive." },
  { id: 3, name: "Amit Shah", rating: 4, text: "Great food quality. Dal makhani reminded me of home. Will definitely come back!" },
  { id: 4, name: "Sneha Verma", rating: 5, text: "Seekh kebabs were outstanding! Authentic North Indian flavors. Highly recommended." },
  { id: 5, name: "Karan Mehta", rating: 4, text: "Good food, decent prices. The naan was perfectly soft and the paneer tikka was excellent." },
];

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 3000); // 3s interval

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <SectionTitle
          subtitle="Testimonials"
          title="What Our Guests Say"
        />

        <div className="mt-12 relative min-h-[250px] flex items-center justify-center">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={clsx(
                "absolute transition-all duration-700 ease-in-out w-full px-4",
                index === currentIndex ? "opacity-100 transform translate-x-0 z-20 scale-100" : 
                index === (currentIndex - 1 + reviews.length) % reviews.length ? "opacity-0 -translate-x-full z-10 scale-95" :
                index === (currentIndex + 1) % reviews.length ? "opacity-0 translate-x-full z-10 scale-95" :
                "opacity-0 scale-90 hidden"
              )}
            >
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className={i < review.rating ? "text-gold fill-gold mx-1" : "text-gray-600 mx-1"}
                  />
                ))}
              </div>
              <p className="font-cormorant text-lg text-text-secondary leading-relaxed mb-6 flex-grow">
                &quot;{review.text}&quot;
              </p>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-dark-card border border-gold flex items-center justify-center font-playfair text-xl text-gold mr-4 shadow-[0_0_10px_rgba(201,168,76,0.2)]">
                  {review.name.charAt(0)}
                </div>
                <div className="text-left">
                  <h4 className="font-jost text-text-secondary uppercase tracking-widest text-sm font-semibold">
                    {review.name}
                  </h4>
                  <span className="font-cormorant text-text-muted text-sm italic">
                    Verified Guest
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center space-x-3 mt-12">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={clsx(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                index === currentIndex ? "bg-gold w-8" : "bg-gold/30 hover:bg-gold/60"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
