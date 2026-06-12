"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/CartContext";

type PaymentMethod = "evc" | "sahal" | "zaad";
type Step = "info" | "payment" | "confirm";

const WHATSAPP_NUMBER = "25261896701";

const MERCHANT_NUMBERS: Record<PaymentMethod, string> = {
  evc: "+252 61 896 701",
  sahal: "+252 61 896 701",
  zaad: "+252 61 896 701",
};

const PAYMENT_METHODS = [
  { id: "evc" as PaymentMethod, label: "EVC Plus", emoji: "📱", desc: "Hormuud" },
  { id: "sahal" as PaymentMethod, label: "Sahal", emoji: "🏦", desc: "Premier Bank" },
  { id: "zaad" as PaymentMethod, label: "Zaad", emoji: "📲", desc: "Telesom" },
];

export default function CheckoutModal() {
  const { state, closeCheckout, clearCart, totalPrice, totalItems } = useCart();
  const [step, setStep] = useState<Step>("info");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("evc");
  const [orderNumber] = useState(() => `MND-${Date.now().toString().slice(-6)}`);

  const [info, setInfo] = useState({ name: "", phone: "", address: "" });
  const [mobileRef, setMobileRef] = useState("");
  const [error, setError] = useState("");
  // Snapshot of the total at confirmation time — totalPrice goes to 0 once the cart clears
  const [confirmedTotal, setConfirmedTotal] = useState(0);

  useEffect(() => {
    if (state.isCheckoutOpen) {
      document.body.style.overflow = "hidden";
      setStep("info");
      setError("");
      setMobileRef("");
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [state.isCheckoutOpen]);

  if (!state.isCheckoutOpen) return null;

  const validPhone = (p: string) => p.replace(/\D/g, "").length >= 9;

  const handleContinueToPayment = () => {
    if (!info.name.trim() || !info.phone.trim() || !info.address.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validPhone(info.phone)) {
      setError("Please enter a valid phone number, e.g. +252 61 XXX XXXX");
      return;
    }
    setError("");
    setStep("payment");
  };

  const handleConfirmOrder = () => {
    if (mobileRef.trim().length < 4) {
      setError("Please enter the transaction reference number you received after sending the payment.");
      return;
    }
    setError("");
    setConfirmedTotal(totalPrice);
    setStep("confirm");
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCheckout} />
      <div
        className="relative bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl overflow-hidden animate-slide-in-up sm:animate-fade-in max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-light flex-shrink-0">
          <div>
            <h2 className="font-display text-xl font-bold text-natural">
              {step === "confirm" ? "Order Confirmed! 🎉" : "Checkout"}
            </h2>
            {step !== "confirm" && (
              <div className="flex items-center gap-2 mt-1">
                {["info", "payment"].map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-colors ${step === s ? "bg-natural" : i === 0 && step === "payment" ? "bg-quality" : "bg-light"}`} />
                    {i === 0 && <div className="w-8 h-0.5 bg-light" />}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={closeCheckout} className="w-9 h-9 flex items-center justify-center rounded-full bg-light hover:bg-care/20 transition-colors text-trust">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5">

          {/* Step 1: Contact Info */}
          {step === "info" && (
            <div className="space-y-4">
              <div className="bg-light-50 rounded-2xl p-4 mb-4">
                <p className="text-xs text-trust/50 mb-1">Order Summary</p>
                <p className="text-sm font-semibold text-trust">{totalItems} items</p>
                <p className="font-display text-2xl font-bold text-natural">${totalPrice.toFixed(2)}</p>
              </div>

              {[
                { key: "name", label: "Full Name", placeholder: "Your full name", type: "text" },
                { key: "phone", label: "Phone Number", placeholder: "+252 61 XXX XXXX", type: "tel" },
                { key: "address", label: "Delivery Address", placeholder: "District, Street, City", type: "text" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-semibold text-trust/70 mb-1.5 block">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={info[field.key as keyof typeof info]}
                    onChange={(e) => setInfo({ ...info, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-light rounded-xl text-sm text-trust placeholder-trust/30 focus:outline-none focus:border-natural transition-colors"
                  />
                </div>
              ))}

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
              )}

              <button
                onClick={handleContinueToPayment}
                className="w-full bg-natural text-white py-4 rounded-2xl font-semibold text-sm hover:bg-trust transition-colors mt-2"
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === "payment" && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-trust mb-3">Choose Payment Method</p>

              {/* Payment method buttons */}
              <div className="grid grid-cols-3 gap-3">
                {PAYMENT_METHODS.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      paymentMethod === pm.id
                        ? "border-natural bg-natural/5"
                        : "border-light bg-white hover:border-care"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{pm.emoji}</span>
                    <span className="text-xs font-bold text-trust block">{pm.label}</span>
                    <span className="text-[10px] text-trust/50">{pm.desc}</span>
                  </button>
                ))}
              </div>

              {/* Mobile money instructions */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-3">
                <p className="text-sm font-bold text-green-800">
                  {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label} Payment Instructions
                </p>
                <div className="space-y-2 text-xs text-green-700">
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="text-green-600">Send to:</span>
                    <span className="font-bold text-sm">{MERCHANT_NUMBERS[paymentMethod]}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="text-green-600">Name:</span>
                    <span className="font-bold">MUUNAD Store</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-green-600">Amount:</span>
                    <span className="font-bold text-base text-natural">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-green-800 mb-1.5 block">
                    Enter Transaction Reference Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TXN123456789"
                    value={mobileRef}
                    onChange={(e) => setMobileRef(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-green-300 rounded-xl text-sm text-trust placeholder-trust/30 focus:outline-none focus:border-green-500 transition-colors"
                  />
                  <p className="text-[10px] text-green-600 mt-1">
                    Send the payment first, then enter the reference you received.
                  </p>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setError(""); setStep("info"); }}
                  className="flex-1 border border-light text-trust py-3.5 rounded-2xl text-sm font-medium hover:border-natural hover:text-natural transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleConfirmOrder}
                  className="flex-[2] bg-natural text-white py-3.5 rounded-2xl text-sm font-semibold hover:bg-trust transition-colors"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === "confirm" && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-4xl">
                ✅
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-natural">Thank You!</h3>
                <p className="text-trust/60 text-sm mt-1">Your order has been placed successfully.</p>
              </div>
              <div className="bg-light-50 rounded-2xl p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-trust/50">Order #</span>
                  <span className="font-bold text-natural">{orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-trust/50">Total Paid</span>
                  <span className="font-bold text-natural">${confirmedTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-trust/50">Payment</span>
                  <span className="font-bold text-natural">
                    {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-trust/50">Reference</span>
                  <span className="font-bold text-natural">{mobileRef}</span>
                </div>
              </div>
              <p className="text-xs text-trust/50 leading-relaxed">
                We will contact you on <strong>{info.phone}</strong> to confirm delivery details.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hello MUUNAD! My order ${orderNumber} has been placed.\nName: ${info.name}\nTotal: $${confirmedTotal.toFixed(2)}\nPayment: ${PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label}\nReference: ${mobileRef}\nAddress: ${info.address}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3.5 rounded-2xl font-semibold text-sm hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Confirm on WhatsApp
              </a>
              <button onClick={closeCheckout} className="w-full border border-light text-trust py-3 rounded-2xl text-sm font-medium hover:border-natural transition-colors">
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
