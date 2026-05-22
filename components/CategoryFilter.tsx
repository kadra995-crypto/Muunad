"use client";

import { categories } from "@/lib/products";

const categoryEmoji: Record<string, string> = {
  All: "✨",
  SPF: "☀️",
  Serum: "💧",
  Essence: "🌿",
  Toner: "🌸",
  Cream: "🍯",
  Moisturizer: "💦",
  Cleanser: "✨",
  Treatment: "🔬",
  Patch: "🩹",
  "Eye Patch": "👁️",
};

interface CategoryFilterProps {
  selected: string;
  onSelect: (cat: string) => void;
  counts: Record<string, number>;
}

export default function CategoryFilter({ selected, onSelect, counts }: CategoryFilterProps) {
  return (
    <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-2 min-w-max sm:flex-wrap sm:min-w-0">
        {categories.map((cat) => {
          const isSelected = selected === cat;
          const count = cat === "All" ? counts.All : counts[cat] || 0;
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? "bg-natural text-white shadow-md"
                  : "bg-white text-trust border border-light hover:border-natural hover:text-natural"
              }`}
            >
              <span className="text-base">{categoryEmoji[cat]}</span>
              {cat}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isSelected ? "bg-white/20 text-white" : "bg-light text-trust/60"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
