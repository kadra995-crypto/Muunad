import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccountPanel from "@/components/AccountPanel";

export default function AccountPage() {
  return (
    <main>
      <Header />
      <div className="min-h-[60vh] bg-light-50 py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <AccountPanel />
        </div>
      </div>
      <Footer />
      <CartDrawer />
      <CheckoutModal />
      <WhatsAppButton />
    </main>
  );
}
