import { ScrollView, View, Text, Pressable, Linking, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import NorthStar from "../../components/NorthStar";
import { productImages } from "../../lib/products";
import { colors, fonts, radii } from "../../lib/theme";

const WHATSAPP_NUMBER = "25261896701";

const stats = [
  { value: "16", label: "Curated Products" },
  { value: "Small Batch", label: "Made with care" },
  { value: "SPF 50+", label: "Sun Protection" },
];

const features = [
  {
    emoji: "☀️",
    title: "SPF-First for Somalia",
    desc: "Somalia has one of the highest UV indexes in the world (10–12 year-round). We stock 8+ SPF 50+ options because sun protection is your most important daily skincare step.",
  },
  {
    emoji: "🌿",
    title: "Natural Ingredients",
    desc: "Centella asiatica, snail mucin, rice extract, heartleaf — all backed by science and proven by millions of happy skin-lovers worldwide.",
  },
  {
    emoji: "💧",
    title: "K-Beauty Curated",
    desc: "We hand-pick the best-performing K-beauty and international brands: COSRX, Beauty of Joseon, Anua, The Ordinary, La Roche-Posay, and more.",
  },
  {
    emoji: "📱",
    title: "Easy Somali Payments",
    desc: "Pay with EVC Plus, Sahal, or Zaad — the payment methods you already trust.",
  },
];

const stripItems = [
  "ALL CARE. JUST FOR YOU.",
  "CONSIDERED CARE",
  "MADE IN SMALL BATCHES",
  "MATCHED TO YOU",
  "SKIN WORTH KEEPING",
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const openWhatsApp = (text: string) => {
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={[styles.hero, { paddingTop: insets.top + 16 }]}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>COSMETICS, WITH INTENTION</Text>
        </View>

        <Text style={styles.headline}>
          <Text style={styles.headlineNatural}>Care that{"\n"}</Text>
          <Text style={styles.headlineItalic}>knows</Text>
          <Text style={styles.headlineNatural}> your skin</Text>
        </Text>

        <Text style={styles.subhead}>
          Thoughtfully formulated rituals, made in small batches and matched to you.
          Considered care, beautifully made — for skin worth keeping.
        </Text>

        <View style={styles.ctaRow}>
          <Pressable style={styles.primaryButton} onPress={() => router.push("/shop")}>
            <Text style={styles.primaryButtonText}>Shop the ritual</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => openWhatsApp("Hello MUUNAD! I would like to learn more about your products.")}
          >
            <Ionicons name="logo-whatsapp" size={18} color={colors.natural} />
            <Text style={styles.secondaryButtonText}>WhatsApp Us</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Most-loved product */}
        <Pressable style={styles.productCard} onPress={() => router.push("/shop")}>
          <Image
            source={productImages["boj-relief-sun-2"]}
            style={styles.productImage}
            contentFit="cover"
          />
          <View style={styles.badge}>
            <NorthStar size={13} color={colors.cream} />
            <Text style={styles.badgeText}>Most Loved</Text>
          </View>
          <View style={styles.caption}>
            <Text style={styles.captionTitle}>Relief Sun SPF50+</Text>
            <Text style={styles.captionSubtitle}>Beauty of Joseon · Rice + Probiotics</Text>
          </View>
        </Pressable>
      </View>

      {/* Brand strip */}
      <View style={styles.strip}>
        <View style={styles.stripRow}>
          {stripItems.map((item, i) => (
            <View key={item} style={styles.stripGroup}>
              <Text style={styles.stripText}>{item}</Text>
              {i < stripItems.length - 1 && <Text style={styles.stripDot}>✦</Text>}
            </View>
          ))}
        </View>
      </View>

      {/* Why Muunad */}
      <View style={styles.why}>
        <Text style={styles.whyEyebrow}>WHY MUUNAD</Text>
        <Text style={styles.whyTitle}>Considered care, in every detail</Text>
        <View style={styles.featureGrid}>
          {features.map((f) => (
            <View key={f.title} style={styles.featureCard}>
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light50,
  },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: colors.care + "40",
    borderRadius: radii.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
  },
  pillText: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.trust,
  },
  headline: {
    marginBottom: 14,
  },
  headlineNatural: {
    fontFamily: "Marcellus_400Regular",
    fontSize: 44,
    lineHeight: 48,
    color: colors.natural,
  },
  headlineItalic: {
    fontFamily: "Marcellus_400Regular",
    fontSize: 44,
    lineHeight: 48,
    color: colors.quality,
  },
  subhead: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.trust + "B3",
    marginBottom: 20,
  },
  ctaRow: {
    gap: 10,
    marginBottom: 24,
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
  secondaryButton: {
    flexDirection: "row",
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.natural,
    borderRadius: radii.lg,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    letterSpacing: 0.5,
    color: colors.natural,
  },
  statsRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 24,
  },
  statItem: {
    alignItems: "flex-start",
  },
  statValue: {
    fontFamily: "Marcellus_400Regular",
    fontSize: 18,
    color: colors.natural,
  },
  statLabel: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.trust + "99",
  },
  productCard: {
    borderRadius: radii.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.care + "60",
  },
  productImage: {
    width: "100%",
    aspectRatio: 736 / 1008,
  },
  badge: {
    position: "absolute",
    top: 14,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.natural + "F2",
    borderRadius: radii.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  badgeText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.white,
  },
  caption: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 14,
  },
  captionTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.white,
  },
  captionSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  strip: {
    backgroundColor: colors.natural,
    paddingVertical: 12,
  },
  stripRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 16,
  },
  stripGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stripText: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.white,
  },
  stripDot: {
    color: colors.quality,
    fontSize: 10,
  },
  why: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  whyEyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.quality,
    textAlign: "center",
  },
  whyTitle: {
    fontFamily: "Marcellus_400Regular",
    fontSize: 26,
    color: colors.natural,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  featureGrid: {
    gap: 14,
  },
  featureCard: {
    backgroundColor: colors.light50,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.light,
    padding: 16,
  },
  featureEmoji: {
    fontSize: 30,
    marginBottom: 10,
  },
  featureTitle: {
    fontFamily: "Marcellus_400Regular",
    fontSize: 16,
    color: colors.trust,
    marginBottom: 6,
  },
  featureDesc: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
    lineHeight: 19,
    color: colors.trust + "99",
  },
});
