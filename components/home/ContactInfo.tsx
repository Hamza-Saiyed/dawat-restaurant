import { Clock, Navigation, PhoneCall } from "lucide-react";

export default function ContactInfo() {
  return (
    <div className="bg-[#1A1A1A] border-b border-gold/20 relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gold/10">
          
          <div className="flex flex-col items-center justify-center p-8 text-center group">
            <div className="w-12 h-12 rounded-full bg-dark flex items-center justify-center border border-gold/30 mb-4 group-hover:border-gold group-hover:bg-gold/10 transition-colors duration-300">
              <PhoneCall className="text-gold" size={20} />
            </div>
            <h3 className="font-jost uppercase tracking-widest text-sm text-text-secondary mb-2">Bookings & Takeaway</h3>
            <a href="tel:+919904043204" className="font-playfair text-2xl text-text-primary hover:text-gold transition-colors duration-300">
              +91 99040 43204
            </a>
          </div>

          <div className="flex flex-col items-center justify-center p-8 text-center group">
            <div className="w-12 h-12 rounded-full bg-dark flex items-center justify-center border border-gold/30 mb-4 group-hover:border-gold group-hover:bg-gold/10 transition-colors duration-300">
              <Navigation className="text-gold" size={20} />
            </div>
            <h3 className="font-jost uppercase tracking-widest text-sm text-text-secondary mb-2">Location</h3>
            <p className="font-playfair text-xl text-text-primary">
              Vishala Circle, Ahmedabad
            </p>
            <span className="font-cormorant text-text-muted mt-1">Opposite Honda Showroom</span>
          </div>

          <div className="flex flex-col items-center justify-center p-8 text-center group">
            <div className="w-12 h-12 rounded-full bg-dark flex items-center justify-center border border-gold/30 mb-4 group-hover:border-gold group-hover:bg-gold/10 transition-colors duration-300">
              <Clock className="text-gold" size={20} />
            </div>
            <h3 className="font-jost uppercase tracking-widest text-sm text-text-secondary mb-2">Opening Hours</h3>
            <p className="font-playfair text-xl text-text-primary">
              11:00 AM - 1:00 AM
            </p>
            <span className="font-cormorant text-text-muted mt-1">Open All Days</span>
          </div>

        </div>
      </div>
    </div>
  );
}
