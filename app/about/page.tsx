import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";

export default function AboutPage() {
  const chefs = [
    { name: "Sanjeev Kapoor", role: "Head Culinary Director", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=400" },
    { name: "Vikas Khanna", role: "Executive Master Chef", image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=400" },
    { name: "Ranveer Brar", role: "Spices & Tandoor Specialist", image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=400" },
  ];

  const values = [
    { title: "Quality", desc: "Finest ingredients sourced daily.", icon: "✨" },
    { title: "Authenticity", desc: "Original recipes from royal kitchens.", icon: "👑" },
    { title: "Service", desc: "Warm hospitality, impeccable care.", icon: "🤝" },
    { title: "Ambiance", desc: "A setting fit for royalty.", icon: "🕌" },
  ];

  return (
    <main className="min-h-screen bg-dark pt-32 pb-24">
      {/* Hero Banner */}
      <section className="relative h-[400px] mb-24 overflow-hidden border-b border-gold/20">
        <Image
          src="https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=2000"
          alt="Dawat Story Banner"
          fill
          priority
          className="object-cover opacity-50 contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <h1 className="font-playfair text-6xl md:text-8xl text-gold font-bold mb-4 drop-shadow-xl">Our Story</h1>
            <div className="w-24 h-[2px] bg-gold mx-auto"></div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <h2 className="font-playfair text-4xl text-text-primary mb-6">A Legacy of Authentic Flavors</h2>
            <div className="w-16 h-1 bg-gold mb-8"></div>
            <p className="font-cormorant text-xl text-text-secondary leading-relaxed mb-6">
              Dawat Restaurant was founded with a singular vision: to bring the rich, unparalleled heritage of authentic North Indian cuisine to the vibrant streets of Ahmedabad. We believe that true dining is an experience that goes beyond the plate.
            </p>
            <p className="font-cormorant text-xl text-text-secondary leading-relaxed">
              For over a decade, our passionate team of chefs has painstakingly recreated the majestic feasts once reserved for royalty. Every spice is handpicked, every curry slow-cooked to perfection, ensuring that you taste history and craftsmanship in every single bite.
            </p>
          </div>
          <div className="relative h-[500px] w-full mughal-border p-4">
            <div className="relative w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800"
                alt="Indian Food Spread"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-32">
          <SectionTitle subtitle="What We Stand For" title="Our Core Values" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-dark-card border border-gold/10 p-8 text-center hover:border-gold/50 transition-colors duration-300">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-playfair text-2xl text-gold mb-4">{v.title}</h3>
                <p className="font-jost text-text-muted text-sm uppercase tracking-wider leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-32">
          <SectionTitle subtitle="The Masterminds" title="Meet Our Chefs" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {chefs.map((chef, i) => (
              <div key={i} className="text-center group">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-gold/30 mb-6 group-hover:border-gold transition-colors duration-500">
                  <Image
                    src={chef.image}
                    alt={chef.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                  />
                </div>
                <h3 className="font-playfair text-2xl text-text-primary mb-2">{chef.name}</h3>
                <p className="font-jost text-gold text-sm tracking-widest uppercase">{chef.role}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
