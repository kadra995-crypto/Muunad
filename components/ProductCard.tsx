"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/CartContext";
import ProductModal from "./ProductModal";

const categoryStyles: Record<string, { from: string; to: string; badge: string }> = {
  SPF: { from: "from-amber-100", to: "to-yellow-50", badge: "bg-amber-500" },
  Serum: { from: "from-rose-100", to: "to-pink-50", badge: "bg-rose-400" },
  Essence: { from: "from-emerald-100", to: "to-green-50", badge: "bg-emerald-500" },
  Toner: { from: "from-pink-100", to: "to-fuchsia-50", badge: "bg-pink-400" },
  Cream: { from: "from-amber-50", to: "to-orange-50", badge: "bg-orange-400" },
  Moisturizer: { from: "from-sky-100", to: "to-blue-50", badge: "bg-sky-400" },
  Cleanser: { from: "from-teal-100", to: "to-emerald-50", badge: "bg-teal-500" },
  Treatment: { from: "from-violet-100", to: "to-purple-50", badge: "bg-violet-500" },
  Patch: { from: "from-lime-100", to: "to-green-50", badge: "bg-lime-500" },
  "Eye Patch": { from: "from-indigo-100", to: "to-blue-50", badge: "bg-indigo-400" },
};

const categoryEmoji: Record<string, string> = {
  SPF: "☀️",
  Serum: "💧",
  Essence: "🌿",
  Toner: "🌸",
  Cream: "🍯",
  Moisturizer: "💦",
  Cleanser: "✨",
  Treatment: "🔬",
  Patch: "🩹",
  "Eye Patch": "👁️",
};

export default function ProductCard({ product }: { product: Product }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart, openCart } = useCart();

  const style = categoryStyles[product.category] || {
    from: "from-gray-100", to: "to-gray-50", badge: "bg-gray-400"
  };
  const emoji = categoryEmoji[product.category] || "✨";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    openCart();
  };

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col">
        {/* Image area */}
        <div
          className={`relative h-44 sm:h-52 bg-gradient-to-br ${style.from} ${style.to} flex items-center justify-center overflow-hidden`}
          onClick={() => setModalOpen(true)}
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-4 transform group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <span className="text-6xl sm:text-7xl transform group-hover:scale-110 transition-transform duration-500 select-none">
              {emoji}
            </span>
          )}
          {/* Category badge */}
          <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-[10px] font-semibold px-2.5 py-1 rounded-full text-trust">
            {product.category}
          </span>
          {/* SPF badge */}
          {product.category === "SPF" && (
            <span className="absolute top-3 right-3 bg-quality text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              SPF 50+
            </span>
          )}
          {/* View detail hint */}
          <div className="absolute inset-0 bg-natural/0 group-hover:bg-natural/5 transition-colors duration-300 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
            <span className="text-[10px] text-natural/70 font-medium bg-white/80 px-2 py-0.5 rounded-full">
              View Details
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <p className="text-[11px] font-semibold text-quality tracking-wide uppercase mb-1">
            {product.brand}
          </p>
          <h3
            className="font-display text-sm font-semibold text-trust leading-snug mb-1 line-clamp-2 flex-1"
            onClick={() => setModalOpen(true)}
          >
            {product.name}
          </h3>
          <p className="text-xs text-gray-400 mb-3">{product.volume}</p>

          <div className="flex items-center justify-between mt-auto">
            <span className="font-display text-lg font-bold text-natural">
              ${product.retailPrice.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${
                added
                  ? "bg-emerald-500 text-white"
                  : "bg-natural text-white hover:bg-trust active:scale-95"
              }`}
            >
              {added ? "Added ✓" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <ProductModal product={product} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
