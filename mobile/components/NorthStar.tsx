import Svg, { Path, Circle } from "react-native-svg";

// Muunad's primary mark — a four-point spark with a single gold core.
// Geometry matches the Brand Guidelines master path and components/Header.tsx on the website.
export default function NorthStar({ size = 24, color = "#953414" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 0.5 Q12.72 10.99 22.06 12 Q12.72 13.01 12 23.5 Q11.28 13.01 1.94 12 Q11.28 10.99 12 0.5 Z"
        fill={color}
      />
      <Circle cx={12} cy={12} r={2.3} fill="#C0894A" />
    </Svg>
  );
}
