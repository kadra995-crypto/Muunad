"use client";

import { useState, useRef, useEffect } from "react";
import { useCart } from "@/lib/CartContext";

const shopCategories = [
  { name: "SPF", emoji: "☀️" },
  { name: "Serum", emoji: "💧" },
  { name: "Essence", emoji: "🌿" },
  { name: "Toner", emoji: "🌸" },
  { name: "Cleanser", emoji: "✨" },
  { name: "Moisturizer", emoji: "💦" },
  { name: "Treatment", emoji: "🔬" },
];

// The North Star — Muunad's primary mark: a four-point spark with a single gold
// core. Geometry mirrors the Brand Guidelines master path (slim, sharp waist with
// the vertical points slightly longer than the horizontal).
export function NorthStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 0.5 Q12.72 10.99 22.06 12 Q12.72 13.01 12 23.5 Q11.28 13.01 1.94 12 Q11.28 10.99 12 0.5 Z"
        fill="currentColor"
      />
      <circle cx="12" cy="12" r="2.3" fill="#C0894A" />
    </svg>
  );
}

function MuunadLogo() {
  return (
    <div className="flex items-center gap-1.5 leading-none select-none">
      <NorthStar className="w-6 h-6 sm:w-7 sm:h-7 text-natural" />
      <div className="flex flex-col items-start">
        <span className="font-wordmark text-2xl sm:text-[28px] text-natural">
          Muunad
        </span>
        <span className="w-full text-center text-[7px] tracking-[0.15em] text-quality font-medium uppercase mt-0.5 whitespace-nowrap">
          All Care. Just For You.
        </span>
      </div>
    </div>
  );
}

export default function Header() {
  const { totalItems, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectCategory = (cat: string) => {
    setShopOpen(false);
    setMobileShopOpen(false);
    setMenuOpen(false);
    window.dispatchEvent(new CustomEvent("muunad:category", { detail: { category: cat } }));
    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Logo */}
          <button onClick={() => scrollToSection("home")} className="focus:outline-none">
            <MuunadLogo />
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-sm font-medium text-trust hover:text-natural transition-colors"
            >
              Home
            </button>

            {/* Shop dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShopOpen(!shopOpen)}
                className="flex items-center gap-1 text-sm font-medium text-trust hover:text-natural transition-colors"
              >
                Shop
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {shopOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-light p-4 animate-fade-in">
                  <p className="text-[10px] font-bold tracking-widest text-quality uppercase mb-3">
                    Shop by Category
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {shopCategories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => selectCategory(cat.name)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-light text-left text-sm text-trust hover:text-natural transition-colors"
                      >
                        <span className="text-base">{cat.emoji}</span>
                        <span className="text-xs font-medium">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-light mt-3 pt-3">
                    <button
                      onClick={() => selectCategory("All")}
                      className="w-full text-center text-xs font-semibold text-natural hover:text-trust transition-colors"
                    >
                      View All Products →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium text-trust hover:text-natural transition-colors"
            >
              About
            </button>
            <a
              href="https://wa.me/25261896701?text=Hello%20MUUNAD!%20I%20need%20help%20with%20a%20product."
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
          <div className="px-4 py-4 flex flex-col gap-1">
            <button
              onClick={() => scrollToSection("home")}
              className="text-left text-sm font-medium text-trust py-3 border-b border-light/50"
            >
              Home
            </button>

            {/* Mobile shop expand */}
            <div className="border-b border-light/50">
              <button
                onClick={() => setMobileShopOpen(!mobileShopOpen)}
                className="w-full flex items-center justify-between text-sm font-medium text-trust py-3"
              >
                <span>Shop</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${mobileShopOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileShopOpen && (
                <div className="grid grid-cols-2 gap-2 pb-3 px-1">
                  {shopCategories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => selectCategory(cat.name)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-light/50 text-left text-sm text-trust"
                    >
                      <span>{cat.emoji}</span>
                      <span className="text-xs font-medium">{cat.name}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => selectCategory("All")}
                    className="col-span-2 text-center text-xs font-semibold text-natural py-2"
                  >
                    View All →
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => scrollToSection("about")}
              className="text-left text-sm font-medium text-trust py-3 border-b border-light/50"
            >
              About
            </button>
            <a
              href="https://wa.me/25261896701?text=Hello%20MUUNAD!%20I%20need%20help%20with%20a%20product."
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-trust py-3"
            >
              Contact via WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
