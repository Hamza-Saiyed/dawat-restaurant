"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "About", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Reviews", href: "/reviews" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={clsx(
        "fixed w-full z-50 transition-all duration-300",
        isScrolled || pathname !== "/"
          ? "bg-[#0D0D0D]/90 backdrop-blur-md py-4 shadow-lg border-b border-gold/10"
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 overflow-hidden rounded-full border border-gold/20 group-hover:border-gold transition-colors duration-300">
              <img 
                src="/logo.jpg" 
                alt="Dawat Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-playfair text-2xl font-bold text-gold tracking-widest text-shadow-gold leading-none">
                DAWAT
              </span>
              <span className="font-jost text-[9px] uppercase tracking-[0.3em] text-text-secondary mt-1 ml-0.5">
                Restaurant
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "font-jost text-sm uppercase tracking-widest transition-colors duration-300 hover:text-gold",
                  pathname === link.href ? "text-gold" : "text-text-primary"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/reservation"
              className="bg-gold text-dark font-jost text-sm uppercase px-6 py-2 tracking-widest hover:bg-gold-light transition-colors duration-300 border border-gold hover:shadow-[0_0_15px_rgba(201,168,76,0.5)]"
            >
              Book Table
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gold focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={clsx(
          "md:hidden absolute w-full bg-[#0D0D0D] border-b border-gold/20 transition-all duration-300 ease-in-out overflow-hidden origin-top",
          isMobileMenuOpen ? "max-h-screen py-4 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col px-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={clsx(
                "font-jost text-sm uppercase tracking-widest transition-colors duration-300 hover:text-gold py-2",
                pathname === link.href ? "text-gold" : "text-text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/reservation"
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-gold text-dark font-jost text-sm uppercase tracking-widest text-center px-6 py-3 hover:bg-gold-light transition-colors duration-300 mx-auto w-full max-w-sm mt-4 inline-block font-semibold"
          >
            Book Table
          </Link>
        </div>
      </div>
    </nav>
  );
}
