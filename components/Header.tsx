"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";

export default function Header() {
  const { totalItems, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex flex-col leading-none">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-widest text-natural">
              MUUNAD
            </span>
            <span className="text-[9px] tracking-[0.25em] text-quality font-medium uppercase">
              Pure Beauty
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-sm font-medium text-trust hover:text-natural transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("products")}
              className="text-sm font-medium text-trust hover:text-natural transition-colors"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium text-trust hover:text-natural transition-colors"
            >
              About
            </button>
            <a
              href="https://wa.me/252615000000?text=Hello%20MUUNAD!%20I%20need%20help%20with%20a%20product."
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-trust hover:text-natural transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              className="relative p-2 text-trust hover:text-natural transition-colors"
              aria-label="Open cart"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-quality text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-trust"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-light animate-fade-in">
          <div className="px-4 py-4 flex flex-col gap-4">
            {["home", "products", "about"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="text-left text-sm font-medium text-trust capitalize py-2 border-b border-light/50"
              >
                {section}
              </button>
            ))}
            <a
              href="https://wa.me/252615000000?text=Hello%20MUUNAD!%20I%20need%20help%20with%20a%20product."
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-trust py-2"
            >
              Contact via WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
