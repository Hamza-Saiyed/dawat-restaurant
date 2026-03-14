"use client";

import { useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import MenuCategory from "@/components/menu/MenuCategory";
import FoodCard from "@/components/menu/FoodCard";
import { menuData } from "@/data/menuData";
import { motion, AnimatePresence } from "framer-motion";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredMenu = activeCategory === "All"
    ? menuData
    : menuData.filter((item) => item.category === activeCategory);

  return (
    <main className="min-h-screen bg-dark pt-32 pb-24">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          subtitle="A Culinary Experience"
          title="Our Grand Menu"
          description="Explore our extensive collection of masterfully crafted dishes, bringing the authentic taste of North India directly to your table."
        />

        <div className="sticky top-[80px] z-30 bg-dark/95 backdrop-blur-md pt-4 border-b border-gold/10 -mx-4 px-4 sm:mx-0 sm:px-0">
          <MenuCategory activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 min-h-[50vh]">
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <FoodCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
