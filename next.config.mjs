/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "**.shopify.com" },
      { protocol: "https", hostname: "**.myshopify.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "**.media-amazon.com" },
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "**.cerave.com" },
      { protocol: "https", hostname: "**.laroche-posay.com" },
      { protocol: "https", hostname: "**.theordinary.com" },
      { protocol: "https", hostname: "**.cosrx.com" },
      { protocol: "https", hostname: "**.beautyofjoseon.com" },
      { protocol: "https", hostname: "**.skin1004.com" },
      { protocol: "https", hostname: "**.anua.com" },
      { protocol: "https", hostname: "images.ctfassets.net" },
      { protocol: "https", hostname: "**.iherb.com" },
    ],
  },
};

export default nextConfig;
