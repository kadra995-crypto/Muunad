import { ScrollView, Pressable, Text, View, StyleSheet } from "react-native";
import { categories } from "../lib/products";
import { categoryEmoji } from "../lib/categoryMeta";
import { colors, fonts, radii } from "../lib/theme";

interface CategoryFilterProps {
  selected: string;
  onSelect: (cat: string) => void;
  counts: Record<string, number>;
}

export default function CategoryFilter({ selected, onSelect, counts }: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {categories.map((cat) => {
        const isSelected = selected === cat;
        const count = cat === "All" ? counts.All : counts[cat] || 0;
        return (
          <Pressable
            key={cat}
            onPress={() => onSelect(cat)}
            style={[styles.chip, isSelected ? styles.chipSelected : styles.chipDefault]}
          >
            <Text style={styles.emoji}>{categoryEmoji[cat]}</Text>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>{cat}</Text>
            <View style={[styles.countPill, isSelected ? styles.countPillSelected : styles.countPillDefault]}>
              <Text style={[styles.countText, isSelected && styles.countTextSelected]}>{count}</Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingHorizontal: 16,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  chipDefault: {
    backgroundColor: colors.white,
    borderColor: colors.light,
  },
  chipSelected: {
    backgroundColor: colors.natural,
    borderColor: colors.natural,
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.trust,
  },
  labelSelected: {
    color: colors.white,
  },
  countPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radii.full,
  },
  countPillDefault: {
    backgroundColor: colors.light,
  },
  countPillSelected: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  countText: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: colors.trust + "99",
  },
  countTextSelected: {
    color: colors.white,
  },
});
