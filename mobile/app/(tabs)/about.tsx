import { ScrollView, View, Text, Pressable, Linking, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MuunadLogo from "../../components/MuunadLogo";
import { colors, fonts, radii } from "../../lib/theme";

const WHATSAPP_NUMBER = "25261896701";

const vibes = ["Warm", "Elegant", "Caring", "Considered", "Small Batch"];

const paymentMethods = [
  { emoji: "📱", label: "EVC Plus", desc: "Hormuud Telesom" },
  { emoji: "🏦", label: "Sahal", desc: "Premier Bank" },
  { emoji: "📲", label: "Zaad", desc: "Telesom" },
];

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  const openWhatsApp = (text: string) => {
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
    >
      <View style={[styles.hero, { paddingTop: insets.top + 24 }]}>
        <MuunadLogo size="md" variant="light" />

        <Text style={styles.description}>
          Muunad is a cosmetic house built on attentiveness — considered care, beautifully made,
          for skin worth keeping. Thoughtfully formulated rituals, made in small batches and
          matched to you.
        </Text>

        <View style={styles.vibeRow}>
          {vibes.map((vibe) => (
            <View key={vibe} style={styles.vibePill}>
              <Text style={styles.vibeText}>{vibe}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={styles.whatsappButton}
          onPress={() => openWhatsApp("Hello MUUNAD!")}
        >
          <Ionicons name="logo-whatsapp" size={18} color={colors.white} />
          <Text style={styles.whatsappButtonText}>+252 61 896 701</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Methods</Text>
        <View style={styles.paymentList}>
          {paymentMethods.map((pm) => (
            <View key={pm.label} style={styles.paymentRow}>
              <Text style={styles.paymentEmoji}>{pm.emoji}</Text>
              <View>
                <Text style={styles.paymentLabel}>{pm.label}</Text>
                <Text style={styles.paymentDesc}>{pm.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.spfNote}>
        <Text style={styles.spfEmoji}>☀️</Text>
        <Text style={styles.spfText}>
          Somalia UV Index 10–12 year-round — SPF is a daily necessity, not a luxury.
        </Text>
      </View>

      <Pressable
        style={styles.contactButton}
        onPress={() => openWhatsApp("Hello MUUNAD! I would like to learn more about your products.")}
      >
        <Ionicons name="logo-whatsapp" size={20} color={colors.natural} />
        <Text style={styles.contactButtonText}>Chat with us on WhatsApp</Text>
      </Pressable>

      <Text style={styles.copyright}>© {new Date().getFullYear()} Muunad. All rights reserved.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.natural,
  },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: 13.5,
    lineHeight: 21,
    color: "rgba(255,255,255,0.7)",
    marginTop: 18,
  },
  vibeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  vibePill: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: radii.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  vibeText: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
  },
  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    backgroundColor: "#22C55E",
    borderRadius: radii.md,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 20,
  },
  whatsappButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.white,
  },
  section: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.trust,
    marginBottom: 16,
  },
  paymentList: {
    gap: 16,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  paymentEmoji: {
    fontSize: 26,
  },
  paymentLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.trust,
  },
  paymentDesc: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.trust + "80",
  },
  spfNote: {
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },
  spfEmoji: {
    fontSize: 14,
  },
  spfText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.trust + "99",
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.natural,
    paddingVertical: 15,
  },
  contactButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.natural,
  },
  copyright: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.white + "60",
    textAlign: "center",
    marginTop: 24,
  },
});
