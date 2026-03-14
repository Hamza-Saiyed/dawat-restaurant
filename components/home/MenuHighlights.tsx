import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";
import FoodCard from "@/components/menu/FoodCard";
import { menuData } from "@/data/menuData";

export default function MenuHighlights() {
  // Select specific featured dishes from menuData
  const featuredIds = ["m1", "m2", "s4", "b1", "s2", "d1"];
  const featuredDishes = menuData.filter((item) => featuredIds.includes(item.id));

  // Reorder to match exact specification if possible
  const orderedDishes = featuredIds
    .map((id) => featuredDishes.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  return (
    <section className="py-24 bg-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Discover"
          title="Our Signature Dishes"
          description="A curated selection of Dawat's finest culinary creations, each prepared with passion and authentic spices to give you a taste of royalty."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 mt-12">
          {orderedDishes.map((dish) => (
            <FoodCard key={dish.id} item={dish} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center bg-transparent border border-gold text-gold font-jost uppercase tracking-widest py-3 px-8 text-sm font-semibold hover:bg-gold hover:text-dark transition-all duration-300 shadow-[0_0_10px_rgba(201,168,76,0.2)] hover:shadow-[0_0_20px_rgba(201,168,76,0.5)]"
          >
            Explore Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
