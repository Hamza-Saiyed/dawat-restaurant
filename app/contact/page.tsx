import SectionTitle from "@/components/ui/SectionTitle";
import ContactForm from "@/components/contact/ContactForm";
import { Clock, Navigation, PhoneCall, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-dark pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Get in Touch"
          title="Contact Us"
          description="We would love to hear from you. Whether it's a reservation inquiry, feedback, or a special request, our team is always here to assist you."
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Info & Map */}
          <div className="flex flex-col h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* Address */}
              <div className="bg-[#111111] p-6 border border-gold/10 hover:border-gold/30 transition-colors duration-300">
                <Navigation className="text-gold mb-4" size={24} />
                <h4 className="font-playfair text-xl text-text-primary mb-2">Location</h4>
                <p className="font-cormorant text-text-secondary leading-relaxed">
                  First Floor, Shop No. 2,<br />
                  near HK Travels, opp. Honda Showroom,<br />
                  Vishala Circle, Ahmedabad 380055
                </p>
              </div>

              {/* Hours */}
              <div className="bg-[#111111] p-6 border border-gold/10 hover:border-gold/30 transition-colors duration-300">
                <Clock className="text-gold mb-4" size={24} />
                <h4 className="font-playfair text-xl text-text-primary mb-2">Hours</h4>
                <p className="font-cormorant text-text-secondary leading-relaxed pl-0">
                  <span className="block text-gold">Everyday</span>
                  11:00 AM - 1:00 AM
                </p>
              </div>

              {/* Phone */}
              <div className="bg-[#111111] p-6 border border-gold/10 hover:border-gold/30 transition-colors duration-300">
                <PhoneCall className="text-gold mb-4" size={24} />
                <h4 className="font-playfair text-xl text-text-primary mb-2">Phone</h4>
                <p className="font-cormorant text-text-secondary leading-relaxed">
                  <a href="tel:+919904043204" className="hover:text-gold transition-colors duration-300">+91 99040 43204</a>
                </p>
              </div>

              {/* Email */}
              <div className="bg-[#111111] p-6 border border-gold/10 hover:border-gold/30 transition-colors duration-300">
                <Mail className="text-gold mb-4" size={24} />
                <h4 className="font-playfair text-xl text-text-primary mb-2">Email</h4>
                <p className="font-cormorant text-text-secondary leading-relaxed">
                  <a href="mailto:info@dawat-restaurant.com" className="hover:text-gold transition-colors duration-300">info@dawat-restaurant.com</a>
                </p>
              </div>
            </div>

            {/* Map Embed */}
            <div className="flex-grow w-full min-h-[300px] border border-gold/20 relative p-2 bg-dark-card">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.0!2d72.5388!3d23.0009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAwJzAzLjIiTiA3MsKwMzInMTkuNyJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[20%] opacity-90 h-full w-full object-cover"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="h-full">
            <ContactForm />
          </div>

        </div>
      </div>
    </main>
  );
}
