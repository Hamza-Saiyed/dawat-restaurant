import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";

export default function GalleryPreview() {
  const images = [
    { src: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600", alt: "Desserts", className: "col-span-1 row-span-1" },
    { src: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=600", alt: "Biryani", className: "col-span-1 row-span-2 md:col-span-2" },
    { src: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=600", alt: "Butter Chicken", className: "col-span-1 row-span-1" },
    { src: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600", alt: "Tandoori", className: "col-span-1 md:col-span-2 row-span-1" },
    { src: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600", alt: "Kebabs", className: "col-span-1 row-span-1" },
  ];

  return (
    <section className="py-24 bg-[#111111] border-y border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Ambiance & Food"
          title="A Glimpse of Dawat"
          centered={true}
        />

        {/* Bento Grid layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 md:gap-4 h-[600px] mb-12 mt-10">
          {images.map((img, index) => (
            <div
              key={index}
              className={`relative overflow-hidden group cursor-pointer border border-gold/10 hover:border-gold/50 transition-colors duration-300 rounded-sm ${img.className}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="font-playfair text-xl text-gold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {img.alt}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/gallery"
            className="inline-flex items-center text-gold font-jost uppercase tracking-widest text-sm hover:text-text-primary transition-colors duration-300 group"
          >
            <span>View Full Gallery</span>
            <span className="w-8 h-px bg-gold ml-4 group-hover:w-12 transition-all duration-300 group-hover:bg-text-primary"></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
