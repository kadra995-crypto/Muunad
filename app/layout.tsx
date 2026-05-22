import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";

export const metadata: Metadata = {
  title: "MUUNAD – Pure Beauty, Natural Essence",
  description: "Premium skincare, body care, and beauty products curated for you. Shop K-beauty essentials, SPF protection, serums, and more.",
  keywords: "skincare, K-beauty, SPF, Somalia, beauty, serums, moisturizer, MUUNAD",
  openGraph: {
    title: "MUUNAD – Pure Beauty, Natural Essence",
    description: "Premium skincare and beauty products curated for the Somali market.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
