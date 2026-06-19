"use client";

import { NorthStar } from "./Header";

export default function Hero() {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative overflow-hidden bg-light-50">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-care/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-quality/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-natural/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-block px-4 py-1.5 bg-care/25 rounded-full">
              <span className="text-xs font-medium tracking-widest text-trust uppercase">
                Cosmetics, with intention
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.05]">
              <span className="text-natural">Care that</span>
              <br />
              <span className="text-quality italic">knows</span>
              <span className="text-natural"> your skin</span>
            </h1>

            <p className="text-base sm:text-lg text-trust/70 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Thoughtfully formulated rituals, made in small batches and matched to you.
              Considered care, beautifully made — for skin worth keeping.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={scrollToProducts}
                className="bg-natural text-white px-8 py-4 rounded-2xl font-semibold text-sm tracking-wide hover:bg-trust transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                Shop the ritual
              </button>
              <a
                href="https://wa.me/25261896701?text=Hello%20MUUNAD!%20I%20would%20like%20to%20learn%20more%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-2 border-natural text-natural px-8 py-4 rounded-2xl font-semibold text-sm tracking-wide hover:bg-natural hover:text-white transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 justify-center lg:justify-start pt-4">
              {[
                { value: "16", label: "Curated Products" },
                { value: "Small Batch", label: "Made with care" },
                { value: "SPF 50+", label: "Sun Protection" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="font-display text-xl font-bold text-natural">{stat.value}</div>
                  <div className="text-xs text-trust/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              {/* Main circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-care/30 to-quality/20 border border-care/30" />
              {/* Center content */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-cream to-blush/50 flex items-center justify-center">
                <div className="text-center flex flex-col items-center">
                  <NorthStar className="w-16 h-16 sm:w-20 sm:h-20 text-natural" />
                  <div className="mt-3 font-wordmark text-natural text-xl">Muunad</div>
                </div>
              </div>
              {/* Floating spark accents */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-quality/20 border border-quality/30 flex items-center justify-center">
                <NorthStar className="w-8 h-8 text-quality" />
              </div>
              <div className="absolute -bottom-2 -left-6 w-16 h-16 rounded-full bg-care/30 border border-care/40 flex items-center justify-center">
                <NorthStar className="w-6 h-6 text-natural" />
              </div>
              <div className="absolute top-1/2 -right-8 w-14 h-14 rounded-full bg-natural/10 border border-natural/20 flex items-center justify-center">
                <NorthStar className="w-5 h-5 text-natural" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand strip */}
      <div className="bg-natural text-white py-3 overflow-hidden">
        <div className="flex flex-wrap gap-x-8 gap-y-1 whitespace-nowrap text-xs tracking-[0.2em] font-medium justify-center">
          <span>ALL CARE. JUST FOR YOU.</span>
          <span className="text-quality">✦</span>
          <span>CONSIDERED CARE</span>
          <span className="text-quality">✦</span>
          <span>MADE IN SMALL BATCHES</span>
          <span className="text-quality">✦</span>
          <span>MATCHED TO YOU</span>
          <span className="text-quality">✦</span>
          <span>SKIN WORTH KEEPING</span>
        </div>
      </div>
    </section>
  );
}
