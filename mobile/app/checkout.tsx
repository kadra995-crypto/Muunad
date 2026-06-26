import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../lib/CartContext";
import { colors, fonts, radii } from "../lib/theme";

const WHATSAPP_NUMBER = "25261896701";
const WAAFI_CHARGE_URL = "https://muunad.com/api/waafi/charge";
const ORDERS_URL = "https://muunad.com/api/orders";

type PaymentMethod = "evc" | "sahal" | "zaad";
type Step = "info" | "payment" | "confirm";

const PAYMENT_METHODS: { id: PaymentMethod; label: string; emoji: string; desc: string }[] = [
  { id: "evc", label: "EVC Plus", emoji: "📱", desc: "Hormuud" },
  { id: "sahal", label: "Sahal", emoji: "🏦", desc: "Premier Bank" },
  { id: "zaad", label: "Zaad", emoji: "📲", desc: "Telesom" },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, clearCart, totalPrice, totalItems } = useCart();

  const [step, setStep] = useState<Step>("info");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("evc");
  const [orderNumber] = useState(() => `MND-${Date.now().toString().slice(-6)}`);

  const [info, setInfo] = useState({ name: "", phone: "", address: "" });
  const [walletPhone, setWalletPhone] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [confirmedTotal, setConfirmedTotal] = useState(0);

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

  const selectedMethodLabel = PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label ?? "";

  const handleConfirmOrder = async () => {
    if (!validPhone(walletPhone)) {
      setError(`Please enter the ${selectedMethodLabel} number to charge.`);
      return;
    }
    setError("");
    setIsPaying(true);
    try {
      const res = await fetch(WAAFI_CHARGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: walletPhone,
          amount: totalPrice,
          orderNumber,
          customerName: info.name,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Payment failed. Please try again.");
        setIsPaying(false);
        return;
      }
      setTransactionId(data.transactionId || "");
      setConfirmedTotal(totalPrice);

      // Best-effort: order history must never block a customer's already-paid checkout.
      fetch(ORDERS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          phone: walletPhone,
          customerName: info.name,
          address: info.address,
          items: items.map((i) => ({
            productId: i.product.id,
            name: i.product.name,
            brand: i.product.brand,
            quantity: i.quantity,
            price: i.product.retailPrice,
          })),
          total: totalPrice,
          paymentMethod,
          transactionId: data.transactionId || "",
        }),
      }).catch(() => {});

      setStep("confirm");
      clearCart();
    } catch {
      setError("Could not process payment. Please check your connection and try again.");
    } finally {
      setIsPaying(false);
    }
  };

  const openWhatsAppConfirmation = () => {
    const text = `Hello MUUNAD! My order ${orderNumber} has been placed.\nName: ${info.name}\nTotal: $${confirmedTotal.toFixed(2)}\nPayment: ${selectedMethodLabel}\nTransaction ID: ${transactionId}\nAddress: ${info.address}`;
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.headerTitle}>{step === "confirm" ? "Order Confirmed! 🎉" : "Checkout"}</Text>
          {step !== "confirm" && (
            <View style={styles.stepRow}>
              <View style={[styles.stepDot, step === "info" && styles.stepDotActive]} />
              <View style={styles.stepLine} />
              <View
                style={[
                  styles.stepDot,
                  step === "payment" && styles.stepDotActive,
                ]}
              />
            </View>
          )}
        </View>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color={colors.trust} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
        {step === "info" && (
          <View style={styles.stepContent}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Order Summary</Text>
              <Text style={styles.summaryItems}>{totalItems} items</Text>
              <Text style={styles.summaryTotal}>${totalPrice.toFixed(2)}</Text>
            </View>

            <Field
              label="Full Name"
              placeholder="Your full name"
              value={info.name}
              onChangeText={(v) => setInfo({ ...info, name: v })}
            />
            <Field
              label="Phone Number"
              placeholder="+252 61 XXX XXXX"
              value={info.phone}
              onChangeText={(v) => setInfo({ ...info, phone: v })}
              keyboardType="phone-pad"
            />
            <Field
              label="Delivery Address"
              placeholder="District, Street, City"
              value={info.address}
              onChangeText={(v) => setInfo({ ...info, address: v })}
            />

            {error && <ErrorBox message={error} />}

            <Pressable style={styles.primaryButton} onPress={handleContinueToPayment}>
              <Text style={styles.primaryButtonText}>Continue to Payment →</Text>
            </Pressable>
          </View>
        )}

        {step === "payment" && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionLabel}>Choose Payment Method</Text>

            <View style={styles.methodRow}>
              {PAYMENT_METHODS.map((pm) => {
                const selected = paymentMethod === pm.id;
                return (
                  <Pressable
                    key={pm.id}
                    onPress={() => setPaymentMethod(pm.id)}
                    style={[styles.methodCard, selected && styles.methodCardSelected]}
                  >
                    <Text style={styles.methodEmoji}>{pm.emoji}</Text>
                    <Text style={styles.methodLabel}>{pm.label}</Text>
                    <Text style={styles.methodDesc}>{pm.desc}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.walletCard}>
              <Text style={styles.walletTitle}>Pay with {selectedMethodLabel}</Text>
              <View style={styles.walletAmountRow}>
                <Text style={styles.walletAmountLabel}>Amount:</Text>
                <Text style={styles.walletAmountValue}>${totalPrice.toFixed(2)}</Text>
              </View>
              <Text style={styles.walletFieldLabel}>{selectedMethodLabel} Number</Text>
              <TextInput
                placeholder="+252 61 XXX XXXX"
                placeholderTextColor={colors.trust + "50"}
                value={walletPhone}
                onChangeText={setWalletPhone}
                keyboardType="phone-pad"
                style={styles.walletInput}
              />
              <Text style={styles.walletHint}>You'll get a USSD prompt on this number to approve the payment.</Text>
            </View>

            {error && <ErrorBox message={error} />}

            <View style={styles.actionRow}>
              <Pressable
                style={styles.backButton}
                onPress={() => {
                  setError("");
                  setStep("info");
                }}
                disabled={isPaying}
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </Pressable>
              <Pressable
                style={[styles.primaryButton, styles.payButton, isPaying && styles.disabledButton]}
                onPress={handleConfirmOrder}
                disabled={isPaying}
              >
                <Text style={styles.primaryButtonText}>{isPaying ? "Processing…" : "Pay Now"}</Text>
              </Pressable>
            </View>
          </View>
        )}

        {step === "confirm" && (
          <View style={styles.confirmContent}>
            <View style={styles.confirmIcon}>
              <Text style={styles.confirmEmoji}>✅</Text>
            </View>
            <Text style={styles.confirmTitle}>Thank You!</Text>
            <Text style={styles.confirmSubtitle}>Your order has been placed successfully.</Text>

            <View style={styles.receiptCard}>
              <ReceiptRow label="Order #" value={orderNumber} />
              <ReceiptRow label="Total Paid" value={`$${confirmedTotal.toFixed(2)}`} />
              <ReceiptRow label="Payment" value={selectedMethodLabel} />
              <ReceiptRow label="Transaction ID" value={transactionId} />
            </View>

            <Text style={styles.confirmNote}>
              We will contact you on <Text style={styles.confirmNoteBold}>{info.phone}</Text> to confirm delivery details.
            </Text>

            <Pressable style={styles.whatsappButton} onPress={openWhatsAppConfirmation}>
              <Ionicons name="logo-whatsapp" size={18} color={colors.white} />
              <Text style={styles.whatsappButtonText}>Confirm on WhatsApp</Text>
            </Pressable>

            <Pressable
              style={styles.continueButton}
              onPress={() => router.replace("/shop")}
            >
              <Text style={styles.continueButtonText}>Continue Shopping</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: "default" | "phone-pad";
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.trust + "50"}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={styles.fieldInput}
      />
    </View>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.receiptRow}>
      <Text style={styles.receiptLabel}>{label}</Text>
      <Text style={styles.receiptValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  headerTitle: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 20,
    color: colors.natural,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.light,
  },
  stepDotActive: {
    backgroundColor: colors.natural,
  },
  stepLine: {
    width: 32,
    height: 1.5,
    backgroundColor: colors.light,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light50,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  stepContent: {
    gap: 16,
  },
  summaryCard: {
    backgroundColor: colors.light50,
    borderRadius: radii.md,
    padding: 16,
  },
  summaryLabel: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.trust + "80",
  },
  summaryItems: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.trust,
    marginTop: 2,
  },
  summaryTotal: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 24,
    color: colors.natural,
    marginTop: 2,
  },
  fieldWrap: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.trust + "B3",
  },
  fieldInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: radii.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.trust,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: radii.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  errorText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: "#DC2626",
  },
  primaryButton: {
    backgroundColor: colors.natural,
    borderRadius: radii.lg,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    letterSpacing: 0.5,
    color: colors.white,
  },
  sectionLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.trust,
  },
  methodRow: {
    flexDirection: "row",
    gap: 10,
  },
  methodCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.light,
    borderRadius: radii.md,
    padding: 12,
    backgroundColor: colors.white,
  },
  methodCardSelected: {
    borderColor: colors.natural,
    backgroundColor: colors.natural + "0D",
  },
  methodEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  methodLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.trust,
  },
  methodDesc: {
    fontFamily: fonts.sans,
    fontSize: 9.5,
    color: colors.trust + "80",
  },
  walletCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: radii.md,
    padding: 16,
    gap: 8,
  },
  walletTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: "#166534",
  },
  walletAmountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  walletAmountLabel: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: "#15803D",
  },
  walletAmountValue: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 18,
    color: colors.natural,
  },
  walletFieldLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: "#166534",
  },
  walletInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#86EFAC",
    borderRadius: radii.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.trust,
  },
  walletHint: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: "#16A34A",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  backButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: radii.lg,
    paddingVertical: 15,
    alignItems: "center",
  },
  backButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.trust,
  },
  payButton: {
    flex: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
  confirmContent: {
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  confirmIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmEmoji: {
    fontSize: 32,
  },
  confirmTitle: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 24,
    color: colors.natural,
  },
  confirmSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.trust + "99",
    textAlign: "center",
    marginTop: -8,
  },
  receiptCard: {
    width: "100%",
    backgroundColor: colors.light50,
    borderRadius: radii.md,
    padding: 16,
    gap: 8,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  receiptLabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.trust + "80",
  },
  receiptValue: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.natural,
  },
  confirmNote: {
    fontFamily: fonts.sans,
    fontSize: 11.5,
    lineHeight: 18,
    color: colors.trust + "99",
    textAlign: "center",
  },
  confirmNoteBold: {
    fontFamily: fonts.sansMedium,
    color: colors.trust,
  },
  whatsappButton: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
    backgroundColor: "#22C55E",
    borderRadius: radii.lg,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  whatsappButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    letterSpacing: 0.5,
    color: colors.white,
  },
  continueButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: radii.lg,
    paddingVertical: 14,
    alignItems: "center",
  },
  continueButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.trust,
  },
});
