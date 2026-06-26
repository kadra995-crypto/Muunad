import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isValidPhone } from "../../lib/phone";
import { colors, fonts, radii } from "../../lib/theme";

const SEND_CODE_URL = "https://muunad.com/api/auth/send-code";
const VERIFY_CODE_URL = "https://muunad.com/api/auth/verify-code";
const ORDERS_HISTORY_URL = "https://muunad.com/api/orders/history";
const TOKEN_KEY = "muunad_session_token";
const PHONE_KEY = "muunad_session_phone";

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

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const [token, setToken] = useState<string | null>(null);
  const [signedInPhone, setSignedInPhone] = useState<string | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(TOKEN_KEY), AsyncStorage.getItem(PHONE_KEY)]).then(
      ([storedToken, storedPhone]) => {
        setToken(storedToken);
        setSignedInPhone(storedPhone);
        setSessionLoaded(true);
      }
    );
  }, []);

  useEffect(() => {
    if (!token) return;
    setOrdersError("");
    fetch(ORDERS_HISTORY_URL, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          signOut();
          return;
        }
        setOrders(data.orders as Order[]);
      })
      .catch(() => setOrdersError("Could not load your order history. Please try again."));
  }, [token]);

  if (!sessionLoaded) {
    return <View style={[styles.container, { paddingTop: insets.top }]} />;
  }

  const signOut = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(PHONE_KEY);
    setToken(null);
    setSignedInPhone(null);
    setStep("phone");
    setPhone("");
    setCode("");
    setOrders(null);
  };

  const handleSendCode = async () => {
    if (!isValidPhone(phone)) {
      setError("Please enter a valid phone number, e.g. +252 61 XXX XXXX");
      return;
    }
    setError("");
    setIsSending(true);
    try {
      const res = await fetch(SEND_CODE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Could not send the verification code. Please try again.");
        return;
      }
      setStep("otp");
    } catch {
      setError("Could not send the verification code. Please check your connection and try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.trim().length < 4) {
      setError("Please enter the code we sent you.");
      return;
    }
    setError("");
    setIsSending(true);
    try {
      const res = await fetch(VERIFY_CODE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: code.trim() }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Incorrect code. Please try again.");
        return;
      }
      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      await AsyncStorage.setItem(PHONE_KEY, data.phone);
      setToken(data.token);
      setSignedInPhone(data.phone);
    } catch {
      setError("Could not verify the code. Please check your connection and try again.");
    } finally {
      setIsSending(false);
    }
  };

  if (token && signedInPhone) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 }]}
      >
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Signed in as</Text>
          <Text style={styles.cardValue}>{signedInPhone}</Text>
          <Pressable onPress={signOut}>
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Order History</Text>

        {ordersError && <Text style={styles.errorTextPlain}>{ordersError}</Text>}

        {orders === null && !ordersError && <Text style={styles.mutedText}>Loading your orders…</Text>}

        {orders?.length === 0 && <Text style={styles.mutedText}>No orders yet on this number.</Text>}

        <View style={styles.orderList}>
          {orders?.map((order) => (
            <View key={order.order_number} style={styles.orderCard}>
              <View style={styles.orderRow}>
                <Text style={styles.orderNumber}>{order.order_number}</Text>
                <Text style={styles.orderDate}>{new Date(order.created_at).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.orderMeta}>
                {order.items.reduce((sum, i) => sum + i.quantity, 0)} items ·{" "}
                {PAYMENT_LABELS[order.payment_method] || order.payment_method}
              </Text>
              <View style={styles.orderRow}>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>{order.status}</Text>
                </View>
                <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 }]}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Your Account</Text>
        <Text style={styles.subtitle}>Verify your phone number to view your order history.</Text>

        {step === "phone" && (
          <View style={styles.formGap}>
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                placeholder="+252 61 XXX XXXX"
                placeholderTextColor={colors.trust + "50"}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.fieldInput}
              />
            </View>
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            <Pressable
              style={[styles.primaryButton, isSending && styles.disabledButton]}
              onPress={handleSendCode}
              disabled={isSending}
            >
              <Text style={styles.primaryButtonText}>{isSending ? "Sending…" : "Send Verification Code"}</Text>
            </Pressable>
          </View>
        )}

        {step === "otp" && (
          <View style={styles.formGap}>
            <Text style={styles.otpHint}>
              Enter the code sent to <Text style={styles.otpHintBold}>{phone}</Text>.
            </Text>
            <TextInput
              placeholder="123456"
              placeholderTextColor={colors.trust + "50"}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              style={[styles.fieldInput, styles.otpInput]}
            />
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            <Pressable
              style={[styles.primaryButton, isSending && styles.disabledButton]}
              onPress={handleVerifyCode}
              disabled={isSending}
            >
              <Text style={styles.primaryButtonText}>{isSending ? "Verifying…" : "Verify & Continue"}</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setStep("phone");
                setError("");
              }}
            >
              <Text style={styles.linkText}>← Use a different number</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light50,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  notConfiguredText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.trust + "B3",
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 20,
    gap: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.light,
    padding: 24,
  },
  title: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 22,
    color: colors.natural,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.trust + "99",
    marginTop: 4,
    marginBottom: 20,
  },
  formGap: {
    gap: 16,
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
  otpInput: {
    textAlign: "center",
    letterSpacing: 4,
  },
  otpHint: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.trust + "99",
  },
  otpHintBold: {
    fontFamily: fonts.sansMedium,
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
  errorTextPlain: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: "#DC2626",
  },
  primaryButton: {
    backgroundColor: colors.natural,
    borderRadius: radii.lg,
    paddingVertical: 15,
    alignItems: "center",
  },
  primaryButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    letterSpacing: 0.5,
    color: colors.white,
  },
  disabledButton: {
    opacity: 0.6,
  },
  linkText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.trust + "99",
    textAlign: "center",
  },
  cardLabel: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.trust + "80",
  },
  cardValue: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 20,
    color: colors.natural,
    marginTop: 2,
    marginBottom: 14,
  },
  signOutText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.trust + "99",
  },
  sectionTitle: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 20,
    color: colors.natural,
  },
  mutedText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.trust + "80",
  },
  orderList: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.light,
    padding: 16,
    gap: 6,
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNumber: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.natural,
  },
  orderDate: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.trust + "80",
  },
  orderMeta: {
    fontFamily: fonts.sans,
    fontSize: 11.5,
    color: colors.trust + "99",
  },
  statusPill: {
    backgroundColor: colors.light50,
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusPillText: {
    fontFamily: fonts.sansMedium,
    fontSize: 9.5,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: colors.trust + "99",
  },
  orderTotal: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 16,
    color: colors.natural,
  },
});
