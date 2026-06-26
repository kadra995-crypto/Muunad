"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { toE164, isValidPhone } from "@/lib/phone";

interface OrderItem {
  productId: number;
  name: string;
  brand: string;
  quantity: number;
  price: number;
}

interface Order {
  order_number: string;
  customer_name: string;
  address: string;
  items: OrderItem[];
  total: number;
  payment_method: string;
  transaction_id: string | null;
  status: string;
  created_at: string;
}

const PAYMENT_LABELS: Record<string, string> = {
  evc: "EVC Plus",
  sahal: "Sahal",
  zaad: "Zaad",
};

type Step = "phone" | "otp";

export default function AccountPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    if (!supabase) {
      setSessionLoaded(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoaded(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !session) return;
    setOrdersError("");
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setOrdersError("Could not load your order history. Please try again.");
          return;
        }
        setOrders(data as Order[]);
      });
  }, [session]);

  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="bg-white rounded-3xl border border-light p-6 text-center">
        <p className="text-sm text-trust/70">
          Account and order history aren&apos;t set up yet. Check back soon.
        </p>
      </div>
    );
  }

  if (!sessionLoaded) {
    return null;
  }

  const handleSendCode = async () => {
    if (!isValidPhone(phone)) {
      setError("Please enter a valid phone number, e.g. +252 61 XXX XXXX");
      return;
    }
    setError("");
    setIsSending(true);
    const { error } = await supabase!.auth.signInWithOtp({ phone: toE164(phone) });
    setIsSending(false);
    if (error) {
      setError(error.message);
      return;
    }
    setStep("otp");
  };

  const handleVerifyCode = async () => {
    if (code.trim().length < 4) {
      setError("Please enter the code we sent you.");
      return;
    }
    setError("");
    setIsSending(true);
    const { error } = await supabase!.auth.verifyOtp({
      phone: toE164(phone),
      token: code.trim(),
      type: "sms",
    });
    setIsSending(false);
    if (error) {
      setError(error.message);
      return;
    }
  };

  const handleSignOut = async () => {
    await supabase!.auth.signOut();
    setStep("phone");
    setPhone("");
    setCode("");
    setOrders(null);
  };

  if (session) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-light p-6">
          <p className="text-xs text-trust/50">Signed in as</p>
          <p className="font-display text-xl font-bold text-natural">{session.user.phone}</p>
          <button
            onClick={handleSignOut}
            className="mt-4 text-xs font-semibold text-trust/60 hover:text-natural transition-colors"
          >
            Sign out
          </button>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-natural mb-4">Order History</h2>

          {ordersError && <p className="text-sm text-red-600">{ordersError}</p>}

          {orders === null && !ordersError && (
            <p className="text-sm text-trust/50">Loading your orders…</p>
          )}

          {orders?.length === 0 && (
            <p className="text-sm text-trust/50">No orders yet on this number.</p>
          )}

          <div className="space-y-3">
            {orders?.map((order) => (
              <div key={order.order_number} className="bg-white rounded-2xl border border-light p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-natural">{order.order_number}</p>
                  <p className="text-xs text-trust/50">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-xs text-trust/60 mt-1">
                  {order.items.reduce((sum, i) => sum + i.quantity, 0)} items ·{" "}
                  {PAYMENT_LABELS[order.payment_method] || order.payment_method}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-light-50 text-trust/60">
                    {order.status}
                  </span>
                  <p className="font-display text-lg font-bold text-natural">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-light p-6">
      <h1 className="font-display text-2xl font-bold text-natural mb-1">Your Account</h1>
      <p className="text-sm text-trust/60 mb-5">
        Verify your phone number to view your order history.
      </p>

      {step === "phone" && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-trust/70 mb-1.5 block">Phone Number</label>
            <input
              type="tel"
              placeholder="+252 61 XXX XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-light rounded-xl text-sm text-trust placeholder-trust/30 focus:outline-none focus:border-natural transition-colors"
            />
          </div>
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}
          <button
            onClick={handleSendCode}
            disabled={isSending}
            className="w-full bg-natural text-white py-3.5 rounded-2xl font-semibold text-sm hover:bg-trust transition-colors disabled:opacity-50"
          >
            {isSending ? "Sending…" : "Send Verification Code"}
          </button>
        </div>
      )}

      {step === "otp" && (
        <div className="space-y-4">
          <p className="text-xs text-trust/60">
            Enter the code sent to <strong>{toE164(phone)}</strong>.
          </p>
          <input
            type="text"
            inputMode="numeric"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-light rounded-xl text-sm text-trust placeholder-trust/30 focus:outline-none focus:border-natural transition-colors text-center tracking-[0.3em]"
          />
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}
          <button
            onClick={handleVerifyCode}
            disabled={isSending}
            className="w-full bg-natural text-white py-3.5 rounded-2xl font-semibold text-sm hover:bg-trust transition-colors disabled:opacity-50"
          >
            {isSending ? "Verifying…" : "Verify & Continue"}
          </button>
          <button
            onClick={() => {
              setStep("phone");
              setError("");
            }}
            className="w-full text-xs font-medium text-trust/60 hover:text-natural transition-colors"
          >
            ← Use a different number
          </button>
        </div>
      )}
    </div>
  );
}
