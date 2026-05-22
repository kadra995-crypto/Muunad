import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import WhyMuunad from "@/components/WhyMuunad";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <WhyMuunad />
      <ProductGrid />
      <Footer />
      <CartDrawer />
      <CheckoutModal />
      <WhatsAppButton />
    </main>
  );
}
