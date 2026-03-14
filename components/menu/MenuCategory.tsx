"use client";

import { menuCategories } from "@/data/menuData";
import clsx from "clsx";

interface MenuCategoryProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function MenuCategory({ activeCategory, setActiveCategory }: MenuCategoryProps) {
  return (
    <div className="w-full overflow-x-auto pb-4 mb-8 custom-scrollbar scroll-smooth">
      <div className="flex space-x-2 md:justify-center min-w-max px-4">
        {menuCategories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={clsx(
              "font-jost text-sm uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-300 border",
              activeCategory === category
                ? "bg-gold text-dark border-gold shadow-[0_0_15px_rgba(201,168,76,0.3)]"
                : "bg-transparent text-text-secondary border-gold/30 hover:border-gold hover:text-gold"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
