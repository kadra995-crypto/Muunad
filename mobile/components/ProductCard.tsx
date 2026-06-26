import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Product, productImages } from "../lib/products";
import { categoryEmoji } from "../lib/categoryMeta";
import { colors, fonts, radii } from "../lib/theme";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const cover = product.images?.[0];
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 3;

  return (
    <Pressable
      onPress={() => router.push(`/product/${product.id}`)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.imageWrap}>
        {cover ? (
          <Image source={productImages[cover]} style={styles.image} contentFit="cover" />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderEmoji}>{categoryEmoji[product.category] || "✨"}</Text>
          </View>
        )}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            {categoryEmoji[product.category] || "✨"} {product.category}
          </Text>
        </View>
        {outOfStock && (
          <View style={styles.stockBadge}>
            <Text style={styles.stockBadgeText}>Sold Out</Text>
          </View>
        )}
        {!outOfStock && lowStock && (
          <View style={[styles.stockBadge, { backgroundColor: colors.quality }]}>
            <Text style={styles.stockBadgeText}>Only {product.stock} left</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <View style={styles.footerRow}>
          <Text style={styles.price}>${product.retailPrice.toFixed(2)}</Text>
          <Text style={styles.volume}>{product.volume}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.light,
    overflow: "hidden",
  },
  imageWrap: {
    aspectRatio: 1,
    backgroundColor: colors.light50,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderEmoji: {
    fontSize: 40,
  },
  categoryBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  categoryBadgeText: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: colors.trust,
  },
  stockBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: colors.trust,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  stockBadgeText: {
    fontFamily: fonts.sansMedium,
    fontSize: 9,
    color: colors.white,
  },
  body: {
    padding: 10,
    gap: 2,
  },
  brand: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: colors.quality,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  name: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.trust,
    minHeight: 34,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: 4,
  },
  price: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 17,
    color: colors.natural,
  },
  volume: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.trust + "80",
  },
});
