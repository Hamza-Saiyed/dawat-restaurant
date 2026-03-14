"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
  };

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-dark">
        <Image
          src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2000"
          alt="Dawat Restaurant Ambiance"
          fill
          priority
          className="object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/40 to-dark"></div>
      </div>

      {/* Floating Particles/Bokeh (CSS based) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gold/20 backdrop-blur-sm animate-pulse-gold inline-block"
            style={{
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 3}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="mb-6 flex items-center justify-center space-x-4">
            <div className="w-12 h-px bg-gold/60"></div>
            <span className="font-jost text-gold uppercase tracking-[0.4em] text-sm md:text-base font-medium">
              Est. Since Ahmedabad
            </span>
            <div className="w-12 h-px bg-gold/60"></div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-playfair text-6xl md:text-8xl lg:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark font-bold mb-2 pb-2 drop-shadow-xl"
          >
            DAWAT
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="font-jost text-xl md:text-3xl text-text-primary uppercase tracking-[0.5em] md:tracking-[0.8em] font-light mb-8 ml-3"
          >
            Restaurant
          </motion.h2>

            <motion.p 
              variants={itemVariants}
              className="font-cormorant text-2xl md:text-3xl text-text-secondary leading-relaxed max-w-2xl mx-auto drop-shadow-md"
            >
              &quot;Authentic North Indian Taste in Ahmedabad&quot;
            </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto px-4">
            <Link
              href="/menu"
              className="bg-gold text-dark font-jost uppercase tracking-widest py-4 px-10 text-sm font-semibold hover:bg-gold-light transition-all duration-300 shadow-[0_0_20px_rgba(201,168,76,0.4)] hover:shadow-[0_0_30px_rgba(201,168,76,0.6)]"
            >
              View Our Menu
            </Link>
            <Link
              href="/reservation"
              className="bg-transparent border border-gold text-gold font-jost uppercase tracking-widest py-4 px-10 text-sm font-semibold hover:bg-gold hover:text-dark transition-all duration-300"
            >
              Book a Table
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer"
        onClick={scrollToAbout}
      >
        <span className="font-jost text-gold text-xs uppercase tracking-widest mb-2 opacity-70">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="text-gold opacity-70" size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
