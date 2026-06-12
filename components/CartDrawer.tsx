"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/CartContext";

const categoryEmoji: Record<string, string> = {
  SPF: "☀️", Serum: "💧", Essence: "🌿", Toner: "🌸",
  Cream: "🍯", Moisturizer: "💦", Cleanser: "✨",
  Treatment: "🔬", Patch: "🩹", "Eye Patch": "👁️",
};

export default function CartDrawer() {
  const { state, closeCart, removeFromCart, updateQuantity, openCheckout, totalPrice, totalItems } = useCart();

  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [state.isOpen]);

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeCart} />
      <div className="relative bg-white w-full sm:w-96 h-full flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-light">
          <div>
            <h2 className="font-display text-xl font-bold text-natural">Your Cart</h2>
            <p className="text-xs text-trust/50 mt-0.5">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-light hover:bg-care/20 transition-colors text-trust"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <span className="text-6xl">🛒</span>
              <p className="font-display text-xl text-natural font-semibold">Your cart is empty</p>
              <p className="text-sm text-trust/50">Add some beautiful products!</p>
              <button
                onClick={closeCart}
                className="bg-natural text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-trust transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            state.items.map((item) => (
              <div key={item.product.id} className="flex gap-4 p-3 bg-light-50 rounded-2xl">
                {/* Emoji thumbnail */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-care/20 to-quality/20 flex items-center justify-center text-2xl flex-shrink-0">
                  {categoryEmoji[item.product.category] || "✨"}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-quality font-bold uppercase tracking-wide">
                    {item.product.brand}
                  </p>
                  <p className="text-sm font-semibold text-trust leading-snug line-clamp-2 mt-0.5">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-400">{item.product.volume}</p>
                </div>
                {/* Price & qty */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <p className="font-display font-bold text-natural text-sm">
                    ${(item.product.retailPrice * item.quantity).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-light flex items-center justify-center text-trust hover:bg-care/30 transition-colors text-sm font-bold"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold text-trust w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-light flex items-center justify-center text-trust hover:bg-care/30 transition-colors text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-[10px] text-red-400 hover:text-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="p-5 border-t border-light space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-trust/60">Subtotal</span>
              <span className="font-display text-xl font-bold text-natural">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-trust/40 text-center">
              Shipping calculated at checkout
            </p>
            <button
              onClick={openCheckout}
              className="w-full bg-natural text-white py-4 rounded-2xl font-semibold text-sm hover:bg-trust transition-all duration-200 hover:shadow-lg active:scale-98"
            >
              Proceed to Checkout
            </button>
            <a
              href="https://wa.me/25261896701?text=Hello%20MUUNAD!%20I%20would%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3.5 rounded-2xl font-semibold text-sm hover:bg-green-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order via WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
