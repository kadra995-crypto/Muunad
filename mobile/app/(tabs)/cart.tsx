import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCart, CartItem } from "../../lib/CartContext";
import { productImages } from "../../lib/products";
import { categoryEmoji } from "../../lib/categoryMeta";
import { colors, fonts, radii } from "../../lib/theme";

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.emptyEmoji}>🛍️</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>Add some products to get started.</Text>
        <Pressable style={styles.shopButton} onPress={() => router.push("/shop")}>
          <Text style={styles.shopButtonText}>Browse the Shop</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Your Bag</Text>
        <Text style={styles.title}>{totalItems} {totalItems === 1 ? "item" : "items"}</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item: CartItem) => String(item.product.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const cover = item.product.images?.[0];
          const atMaxStock = item.quantity >= item.product.stock;
          return (
            <View style={styles.row}>
              {cover ? (
                <Image source={productImages[cover]} style={styles.image} contentFit="cover" />
              ) : (
                <View style={[styles.image, styles.placeholder]}>
                  <Text style={styles.placeholderEmoji}>{categoryEmoji[item.product.category] || "✨"}</Text>
                </View>
              )}

              <View style={styles.rowBody}>
                <Text style={styles.brand}>{item.product.brand}</Text>
                <Text style={styles.name} numberOfLines={2}>{item.product.name}</Text>
                <Text style={styles.price}>${item.product.retailPrice.toFixed(2)}</Text>

                <View style={styles.quantityRow}>
                  <Pressable
                    style={styles.qtyButton}
                    onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Ionicons name="remove" size={14} color={colors.trust} />
                  </Pressable>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <Pressable
                    style={[styles.qtyButton, atMaxStock && styles.qtyButtonDisabled]}
                    onPress={() => !atMaxStock && updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={atMaxStock}
                  >
                    <Ionicons name="add" size={14} color={atMaxStock ? colors.trust + "40" : colors.trust} />
                  </Pressable>
                </View>
              </View>

              <Pressable style={styles.removeButton} onPress={() => removeFromCart(item.product.id)}>
                <Ionicons name="trash-outline" size={16} color={colors.trust + "80"} />
              </Pressable>
            </View>
          );
        }}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
        </View>
        <Pressable style={styles.checkoutButton} onPress={() => router.push("/checkout")}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 22,
    color: colors.natural,
  },
  emptyText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.trust + "99",
    marginTop: 4,
    textAlign: "center",
  },
  shopButton: {
    backgroundColor: colors.natural,
    borderRadius: radii.lg,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: 20,
  },
  shopButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    letterSpacing: 0.5,
    color: colors.white,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  eyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.quality,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 28,
    color: colors.natural,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.light,
    padding: 10,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: radii.sm,
    backgroundColor: colors.light50,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderEmoji: {
    fontSize: 24,
  },
  rowBody: {
    flex: 1,
    gap: 1,
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
    fontSize: 12.5,
    color: colors.trust,
  },
  price: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 16,
    color: colors.natural,
    marginTop: 2,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  qtyButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.light50,
    borderWidth: 1,
    borderColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonDisabled: {
    opacity: 0.5,
  },
  qtyValue: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.trust,
    minWidth: 16,
    textAlign: "center",
  },
  removeButton: {
    padding: 6,
    alignSelf: "flex-start",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.light,
    backgroundColor: colors.white,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },
  totalLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.trust + "99",
  },
  totalValue: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 26,
    color: colors.natural,
  },
  checkoutButton: {
    backgroundColor: colors.natural,
    borderRadius: radii.lg,
    paddingVertical: 15,
    alignItems: "center",
  },
  checkoutButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    letterSpacing: 0.5,
    color: colors.white,
  },
});
