"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/CartContext";

const categoryEmoji: Record<string, string> = {
  SPF: "☀️", Serum: "💧", Essence: "🌿", Toner: "🌸",
  Cream: "🍯", Moisturizer: "💦", Cleanser: "✨",
  Treatment: "🔬", Patch: "🩹", "Eye Patch": "👁️",
};
const categoryStyles: Record<string, string> = {
  SPF: "from-amber-100 to-yellow-50",
  Serum: "from-rose-100 to-pink-50",
  Essence: "from-emerald-100 to-green-50",
  Toner: "from-pink-100 to-fuchsia-50",
  Cream: "from-amber-50 to-orange-50",
  Moisturizer: "from-sky-100 to-blue-50",
  Cleanser: "from-teal-100 to-emerald-50",
  Treatment: "from-violet-100 to-purple-50",
  Patch: "from-lime-100 to-green-50",
  "Eye Patch": "from-indigo-100 to-blue-50",
};

export default function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart, openCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const openZoom = () => {
    setZoomScale(1);
    setZoomed(true);
  };

  const images = product.images?.length
    ? product.images
    : product.image
    ? [product.image]
    : [];

  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    if (outOfStock) return;
    addToCart(product);
    onClose();
    openCart();
  };

  const gradient = categoryStyles[product.category] || "from-gray-100 to-gray-50";
  const emoji = categoryEmoji[product.category] || "✨";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl overflow-hidden animate-slide-in-up sm:animate-fade-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image header */}
        <div className={`relative h-72 sm:h-96 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
          {images.length > 0 ? (
            <>
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                className="object-contain p-2 cursor-zoom-in"
                sizes="(max-width: 640px) 100vw, 512px"
                onClick={openZoom}
              />
              <button
                onClick={openZoom}
                className="absolute bottom-4 right-4 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center text-trust hover:bg-white transition-colors"
                aria-label="Zoom image"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 8v6m-3-3h6m4 0a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </>
          ) : (
            <span className="text-8xl">{emoji}</span>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center text-trust hover:bg-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="absolute top-4 left-4 bg-white/80 text-[10px] font-bold px-3 py-1 rounded-full text-trust uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        {/* Thumbnail gallery */}
        {images.length > 1 && (
          <div className="flex gap-2 px-6 pt-4 overflow-x-auto">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActiveImage(i)}
                className={`relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                  i === activeImage ? "border-natural" : "border-transparent"
                }`}
              >
                <Image src={src} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <p className="text-xs font-bold text-quality tracking-widest uppercase mb-1">{product.brand}</p>
          <h2 className="font-display text-xl font-bold text-trust leading-snug mb-1">{product.name}</h2>
          <p className="text-xs text-gray-400 mb-4">{product.volume}</p>
          {outOfStock ? (
            <p className="text-xs font-bold text-gray-500 bg-gray-100 inline-block px-3 py-1 rounded-full mb-3">
              Out of Stock
            </p>
          ) : product.stock <= 5 ? (
            <p className="text-xs font-bold text-red-600 bg-red-50 inline-block px-3 py-1 rounded-full mb-3">
              Only {product.stock} left in stock
            </p>
          ) : null}
          <p className="text-sm text-trust/70 leading-relaxed mb-5">{product.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map((tag) => (
              <span key={tag} className="text-[11px] px-3 py-1 bg-light rounded-full text-trust/70 font-medium">
                {tag}
              </span>
            ))}
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-light">
            <div>
              <p className="text-xs text-trust/50 mb-0.5">Retail Price</p>
              <span className="font-display text-3xl font-bold text-natural">
                ${product.retailPrice.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className={`px-8 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                outOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-natural text-white hover:bg-trust hover:shadow-lg active:scale-95"
              }`}
            >
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen zoom lightbox */}
      {zoomed && images.length > 0 && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex flex-col"
          onClick={(e) => { e.stopPropagation(); setZoomed(false); }}
        >
          {/* Controls */}
          <div
            className="absolute top-4 right-4 z-10 flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomScale((s) => Math.min(s + 0.5, 4))}
              className="w-11 h-11 bg-white/15 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-colors"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              onClick={() => setZoomScale((s) => Math.max(s - 0.5, 1))}
              className="w-11 h-11 bg-white/15 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-colors"
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              onClick={() => setZoomed(false)}
              className="w-11 h-11 bg-white/15 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Close zoom"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable zoom area */}
          <div className="flex-1 overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="min-h-full min-w-full flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[activeImage]}
                alt={product.name}
                className="m-auto select-none transition-[height] duration-200"
                style={{ height: `${85 * zoomScale}vh`, width: "auto", maxWidth: "none" }}
                onDoubleClick={() => setZoomScale((s) => (s > 1 ? 1 : 2))}
                draggable={false}
              />
            </div>
          </div>

          {/* Thumbnail switcher inside lightbox */}
          {images.length > 1 && (
            <div
              className="flex gap-2 justify-center py-3"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => { setActiveImage(i); setZoomScale(1); }}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeImage ? "border-white" : "border-white/30"
                  }`}
                >
                  <Image src={src} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="48px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
