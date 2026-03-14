"use client";

import { useState } from "react";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import clsx from "clsx";

const galleryData = [
  { id: 1, src: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800", category: "Food", title: "Authentic Dum Biryani" },
  { id: 2, src: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=800", category: "Food", title: "Classic Butter Chicken" },
  { id: 3, src: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800", category: "Food", title: "Royal Indian Spread" },
  { id: 4, src: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800", category: "Food", title: "Tandoori Specialties" },
  { id: 5, src: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800", category: "Food", title: "Traditional Indian Desserts" },
  { id: 6, src: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800", category: "Food", title: "Assorted Kebabs" },
  { id: 7, src: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=800", category: "Food", title: "Rich Curries" },
  { id: 8, src: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800", category: "Food", title: "Fresh Baked Naan" },
  { id: 9, src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800", category: "Interior", title: "Grand Dining Hall" },
  { id: 10, src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800", category: "Interior", title: "Private Dining Area" },
  { id: 11, src: "https://images.unsplash.com/photo-1505275350441-83dcda8eeef5?q=80&w=800", category: "Events", title: "Wedding Receptions" },
  { id: 12, src: "https://images.unsplash.com/photo-1533143719001-38cbcecd53d9?q=80&w=800", category: "Events", title: "Corporate Banquets" },
];

const categories = ["All", "Food", "Interior", "Events"];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredImages = activeTab === "All"
    ? galleryData
    : galleryData.filter(img => img.category === activeTab);

  return (
    <main className="min-h-screen bg-dark pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Visual Journey"
          title="Dawat Gallery"
          description="Explore our exquisite dishes, stunning interiors, and memorable events captured through the lens."
        />

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={clsx(
                "font-jost text-sm uppercase tracking-widest px-8 py-2 border transition-all duration-300",
                activeTab === category
                  ? "bg-gold text-dark border-gold"
                  : "bg-transparent text-text-secondary border-gold/30 hover:border-gold hover:text-gold"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((image) => (
            <div key={image.id} className="relative group overflow-hidden border border-gold/10 hover:border-gold/40 transition-colors duration-500 break-inside-avoid mughal-border p-2 bg-dark-card">
              <div className="relative w-full overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.title}
                  width={600}
                  height={800} // Masonry relies on intrinsic image ratio but Next Image needs height/width.
                  className="w-full h-auto object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-playfair text-2xl text-gold mb-2">{image.title}</h3>
                  <span className="font-jost text-sm text-text-primary uppercase tracking-widest">
                    {image.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
