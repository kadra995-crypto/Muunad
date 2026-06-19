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

export default function WhyMuunad() {
  return (
    <section className="bg-white py-16 border-y border-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-widest text-quality uppercase">Why Muunad</span>
          <h2 className="font-display text-4xl sm:text-5xl font-medium text-natural mt-2">
            Considered care, in every detail
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 bg-light-50 rounded-2xl border border-light hover:border-care transition-colors group"
            >
              <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform duration-300">
                {f.emoji}
              </span>
              <h3 className="font-display font-bold text-trust text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-trust/60 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
