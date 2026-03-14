import Image from "next/image";
import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";

export default function AboutPreview() {
  const stats = [
    { label: "Years of Excellence", value: "10+" },
    { label: "Signature Dishes", value: "50+" },
    { label: "Happy Customers", value: "100k+" },
  ];

  return (
    <section id="about" className="py-24 bg-[#111111] relative border-y border-gold/10">
      <div className="absolute inset-0 bg-noise opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 md:order-1">
            <SectionTitle
              subtitle="Our Story"
              title="A Culinary Journey of Royal Heritage"
              centered={false}
            />
            
            <p className="font-cormorant text-xl text-text-secondary leading-relaxed mb-6">
              Welcome to Dawat, where every dish tells a story of authentic North Indian traditions. Nestled in the heart of Ahmedabad, we invite you to experience a royal feast that indulges your senses.
            </p>
            <p className="font-cormorant text-lg text-text-muted leading-relaxed mb-10">
              Our master chefs use age-old recipes, aromatic spices sourced directly from the finest farms, and traditional slow-cooking techniques like dum and tandoori to bring out flavors that resonate with the grand banquets of the Mughal era.
            </p>
            
            <div className="grid grid-cols-3 gap-6 mb-10 border-t border-b border-gold/10 py-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-playfair text-3xl md:text-4xl text-gold mb-2">{stat.value}</div>
                  <div className="font-jost text-xs uppercase tracking-widest text-text-muted">{stat.label}</div>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-block border-b-2 border-gold text-gold font-jost uppercase tracking-widest text-sm pb-1 hover:text-text-primary hover:border-text-primary transition-colors duration-300"
            >
              Learn More About Us
            </Link>
          </div>

          {/* Image Collage */}
          <div className="order-1 md:order-2 relative h-[500px] w-full flex items-center justify-center">
            {/* Primary Image */}
            <div className="absolute z-20 w-3/4 h-3/4 right-0 top-1/2 transform -translate-y-1/2 mughal-border bg-dark p-2">
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800"
                  alt="Tandoori Cooking"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-dark/20 mix-blend-overlay"></div>
              </div>
            </div>
            
            {/* Secondary Image */}
            <div className="absolute z-10 w-1/2 h-2/3 left-0 top-12 border border-gold/20 p-2 bg-[#1A1A1A]">
              <div className="relative w-full h-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <Image
                  src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=600"
                  alt="North Indian Spices"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Decorative BG element */}
            <div className="absolute top-0 right-10 w-32 h-32 border border-gold opacity-20 rounded-full"></div>
            <div className="absolute -bottom-10 left-10 w-24 h-24 border border-gold opacity-20 rotate-45"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
