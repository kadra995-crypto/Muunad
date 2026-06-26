import { View, Text, StyleSheet } from "react-native";
import NorthStar from "./NorthStar";
import { colors, fonts } from "../lib/theme";

export default function MuunadLogo({
  size = "md",
  variant = "dark",
}: {
  size?: "sm" | "md";
  variant?: "dark" | "light";
}) {
  const starSize = size === "sm" ? 22 : 28;
  const nameSize = size === "sm" ? 20 : 26;
  const nameColor = variant === "light" ? colors.white : colors.natural;

  return (
    <View style={styles.row}>
      <NorthStar size={starSize} color={nameColor} />
      <View style={styles.nameColumn}>
        <Text style={[styles.name, { fontSize: nameSize, color: nameColor }]}>Muunad</Text>
        <Text style={styles.tagline}>All Care. Just For You.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  nameColumn: {
    alignItems: "center",
  },
  name: {
    fontFamily: fonts.wordmark,
    lineHeight: undefined,
  },
  tagline: {
    fontFamily: fonts.sansMedium,
    fontSize: 7,
    letterSpacing: 1.2,
    color: colors.quality,
    textTransform: "uppercase",
    marginTop: 2,
  },
});
