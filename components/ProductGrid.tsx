"use client";

import { useState, useMemo } from "react";
import { products } from "@/lib/products";
import CategoryFilter from "./CategoryFilter";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
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
    return products.filter((p) => {
      const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
      const query = searchQuery.toLowerCase();
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
    <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      {/* Section header */}
      <div className="text-center mb-10">
        <span className="text-xs font-semibold tracking-widest text-quality uppercase">
          Our Collection
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-natural mt-2 mb-3">
          Premium Beauty Products
        </h2>
        <p className="text-trust/60 text-sm max-w-lg mx-auto">
          Carefully curated K-beauty and international skincare essentials.
          SPF-focused for Somalia&apos;s high-UV climate.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md mx-auto">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-trust/40"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search products, brands, ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-light rounded-2xl text-sm text-trust placeholder-trust/40 focus:outline-none focus:border-natural transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-trust/40 hover:text-trust"
          >
            ×
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="mb-8">
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          counts={counts}
        />
      </div>

      {/* Results count */}
      <p className="text-xs text-trust/50 mb-6">
        {filtered.length} {filtered.length === 1 ? "product" : "products"} found
        {selectedCategory !== "All" && ` in ${selectedCategory}`}
        {searchQuery && ` for "${searchQuery}"`}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="text-5xl mb-4 block">🔍</span>
          <p className="text-trust/60 text-sm">No products found. Try a different search.</p>
          <button
            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
            className="mt-4 text-natural text-sm font-medium underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
