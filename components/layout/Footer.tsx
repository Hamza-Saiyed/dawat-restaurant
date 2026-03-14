import Link from "next/link";
import { Instagram, Facebook, Twitter, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-gold pb-8 pt-16 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="flex flex-col">
            <Link href="/" className="mb-6 flex flex-col">
              <span className="font-playfair text-3xl font-bold text-gold tracking-widest text-shadow-gold">
                DAWAT
              </span>
              <span className="font-jost text-[10px] uppercase tracking-[0.3em] text-text-secondary mt-1">
                Restaurant
              </span>
            </Link>
            <p className="font-cormorant text-text-secondary mb-6 leading-relaxed">
              Experience the finest authentic North Indian cuisine in the heart of Ahmedabad. A royal dining experience awaits you.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-dark transition-colors duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-dark transition-colors duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-dark transition-colors duration-300">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links Col */}
          <div>
            <h3 className="font-playfair text-xl text-gold mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-gold/50"></span>
            </h3>
            <ul className="space-y-4">
              {['Home', 'Menu', 'About', 'Gallery', 'Reservation', 'Contact'].map((link) => (
                <li key={link}>
                  <Link href={`/${link === 'Home' ? '' : link.toLowerCase()}`} className="font-jost text-text-secondary hover:text-gold transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 rounded-full border border-gold mr-3"></span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours Col */}
          <div>
            <h3 className="font-playfair text-xl text-gold mb-6 relative inline-block">
              Opening Hours
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-gold/50"></span>
            </h3>
            <ul className="space-y-4 font-cormorant text-text-secondary">
              <li className="flex justify-between border-b border-gold/10 pb-2">
                <span>Monday - Friday</span>
                <span className="text-gold">11:00 AM - 1:00 AM</span>
              </li>
              <li className="flex justify-between border-b border-gold/10 pb-2">
                <span>Saturday - Sunday</span>
                <span className="text-gold">11:00 AM - 1:00 AM</span>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="font-playfair text-xl text-gold mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-gold/50"></span>
            </h3>
            <ul className="space-y-4 font-cormorant text-text-secondary">
              <li className="flex items-start">
                <span className="text-gold mr-3 mt-1">📍</span>
                <span>
                  First Floor, Shop No. 2,<br />
                  near HK Travels, opposite Honda Showroom,<br />
                  Vishala Circle, Ahmedabad, Gujarat 380055
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-gold mr-3">📞</span>
                <a href="tel:+919904043204" className="hover:text-gold transition-colors duration-300">+91 99040 43204</a>
              </li>
              <li className="flex items-center mt-4">
                <a 
                  href="https://wa.me/919904043204" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center bg-[#25D366]/10 text-[#25D366] px-4 py-2 rounded border border-[#25D366]/30 hover:bg-[#25D366] hover:text-white transition-all duration-300 font-jost text-sm"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gold/20 text-center flex flex-col md:flex-row justify-between pl-2 pr-2 items-center">
          <p className="font-jost text-sm text-text-muted mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Dawat Restaurant. All Rights Reserved.
          </p>
          <div className="font-jost text-sm text-text-muted">
            Designed with <span className="text-gold">♥</span> in Ahmedabad
          </div>
        </div>
      </div>
    </footer>
  );
}
