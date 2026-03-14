import { MenuItem } from "@/data/menuData";
import { MessageCircle } from "lucide-react";
import Image from "next/image";

interface FoodCardProps {
  item: MenuItem;
}

export default function FoodCard({ item }: FoodCardProps) {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919904043204";
  const message = encodeURIComponent(`Hi! I would like to order: ${item.name} (₹${item.price})`);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="bg-dark-card border border-gold/20 rounded-lg overflow-hidden transition-all duration-300 hover:border-gold hover:shadow-[0_0_20px_rgba(201,168,76,0.2)] group flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {item.badge && (
          <div className="absolute top-4 right-4 bg-gold text-dark text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm z-10">
            {item.badge}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent opacity-80"></div>
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-playfair text-xl text-text-primary pr-4 leading-tight">
            {item.name}
          </h3>
          <span className="font-jost text-gold font-bold text-lg whitespace-nowrap">
            ₹{item.price}
          </span>
        </div>
        
        <p className="font-cormorant text-text-secondary mb-6 flex-grow">
          {item.description}
        </p>

        {/* Action Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center space-x-2 bg-transparent border border-gold text-gold hover:bg-gold hover:text-dark py-2.5 px-4 font-jost text-sm uppercase tracking-wider transition-colors duration-300 mt-auto"
        >
          <MessageCircle size={18} />
          <span>Order via WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
