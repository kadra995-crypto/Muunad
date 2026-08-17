import { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { products, productImages } from "../../lib/products";
import { categoryEmoji } from "../../lib/categoryMeta";
import { useCart } from "../../lib/CartContext";
import { colors, fonts, radii } from "../../lib/theme";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);

  const product = products.find((p) => String(p.id) === id);

  if (!product) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Product not found.</Text>
      </View>
    );
  }

  const images = product.images ?? [];
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    addToCart(product);
    router.back();
    router.push("/cart");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.imageWrap}>
          {images.length > 0 ? (
            <Image
              source={productImages[images[activeImage]]}
              style={styles.image}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Text style={styles.placeholderEmoji}>{categoryEmoji[product.category] || "✨"}</Text>
            </View>
          )}

          <Pressable
            style={[styles.closeButton, { top: insets.top + 12 }]}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={20} color={colors.trust} />
          </Pressable>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {categoryEmoji[product.category] || "✨"} {product.category}
            </Text>
          </View>
        </View>

        {images.length > 1 && (
          <View style={styles.thumbRow}>
            {images.map((img, i) => (
              <Pressable
                key={img}
                onPress={() => setActiveImage(i)}
                style={[styles.thumb, i === activeImage && styles.thumbActive]}
              >
                <Image source={productImages[img]} style={styles.thumbImage} contentFit="cover" />
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.volume}>{product.volume}</Text>

          {outOfStock && (
            <View style={[styles.stockBadge, { backgroundColor: colors.trust }]}>
              <Text style={styles.stockBadgeText}>Out of Stock</Text>
            </View>
          )}
          {!outOfStock && lowStock && (
            <View style={[styles.stockBadge, { backgroundColor: colors.quality }]}>
              <Text style={styles.stockBadgeText}>Only {product.stock} left in stock</Text>
            </View>
          )}

          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.tagRow}>
            {product.tags.map((tag) => (
              <View key={tag} style={styles.tagPill}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.price}>${product.retailPrice.toFixed(2)}</Text>
        <Pressable
          style={[styles.addButton, outOfStock && styles.addButtonDisabled]}
          onPress={handleAddToCart}
          disabled={outOfStock}
        >
          <Text style={styles.addButtonText}>{outOfStock ? "Out of Stock" : "Add to Cart"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.base,
  },
  notFoundText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.trust,
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
    fontSize: 64,
  },
  closeButton: {
    position: "absolute",
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryBadge: {
    position: "absolute",
    bottom: 14,
    left: 14,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.full,
  },
  categoryBadgeText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.trust,
  },
  thumbRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbActive: {
    borderColor: colors.natural,
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  brand: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.quality,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  name: {
    fontFamily: "Marcellus_400Regular",
    fontSize: 24,
    color: colors.natural,
    marginTop: 4,
  },
  volume: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.trust + "99",
    marginTop: 2,
  },
  stockBadge: {
    alignSelf: "flex-start",
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 12,
  },
  stockBadgeText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.white,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: 13.5,
    lineHeight: 21,
    color: colors.trust + "CC",
    marginTop: 16,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  tagPill: {
    backgroundColor: colors.care + "40",
    borderRadius: radii.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.trust,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.light,
    backgroundColor: colors.white,
  },
  price: {
    fontFamily: "Marcellus_400Regular",
    fontSize: 28,
    color: colors.natural,
  },
  addButton: {
    backgroundColor: colors.natural,
    borderRadius: radii.lg,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  addButtonDisabled: {
    backgroundColor: colors.trust + "40",
  },
  addButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    letterSpacing: 0.5,
    color: colors.white,
  },
});
