import { useState, useMemo } from "react";
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { products, Product } from "../../lib/products";
import CategoryFilter from "../../components/CategoryFilter";
import ProductCard from "../../components/ProductCard";
import { colors, fonts } from "../../lib/theme";

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: products.length };
    products.forEach((p) => {
      c[p.category] = (c[p.category] || 0) + 1;
    });
    return c;
  }, []);

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return products.filter((p) => {
      const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>The Collection</Text>
        <Text style={styles.title}>Rituals, matched to you</Text>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={16} color={colors.trust + "80"} style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products, brands, ingredients..."
          placeholderTextColor={colors.trust + "60"}
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")} style={styles.clearButton}>
            <Ionicons name="close-circle" size={16} color={colors.trust + "80"} />
          </Pressable>
        )}
      </View>

      <View style={styles.filterWrap}>
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} counts={counts} />
      </View>

      <Text style={styles.resultsCount}>
        {filtered.length} {filtered.length === 1 ? "product" : "products"} found
        {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}
      </Text>

      <FlatList
        data={filtered}
        key={2}
        numColumns={2}
        keyExtractor={(item: Product) => String(item.id)}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item }) => (
          <View style={styles.gridCell}>
            <ProductCard product={item} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No products found. Try a different search.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
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
  searchWrap: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.trust,
  },
  clearButton: {
    padding: 4,
  },
  filterWrap: {
    marginTop: 14,
    marginHorizontal: -20,
  },
  resultsCount: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.trust + "80",
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 4,
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 8,
  },
  gridRow: {
    gap: 12,
  },
  gridCell: {
    flex: 1,
    marginBottom: 12,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.trust + "80",
  },
});
