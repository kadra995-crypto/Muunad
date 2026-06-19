import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";

export const metadata: Metadata = {
  title: "Muunad — All Care. Just For You.",
  description: "Considered care, beautifully made — for skin worth keeping. Thoughtfully formulated skincare rituals, made in small batches and matched to you.",
  keywords: "Muunad, skincare, cosmetics, ritual, SPF, Somalia, serums, moisturizer, considered care",
  openGraph: {
    title: "Muunad — All Care. Just For You.",
    description: "Considered care, beautifully made — for skin worth keeping.",
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
