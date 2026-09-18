import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // URLs durables : anciennes formes ou variantes courantes.
      { source: "/forum", destination: "/communaute", permanent: true },
      { source: "/forum/:path*", destination: "/communaute/:path*", permanent: true },
      { source: "/comparateur", destination: "/comparer", permanent: true },
      { source: "/montres", destination: "/equipements", permanent: true },
      { source: "/produits/:path*", destination: "/equipements/:path*", permanent: true },
      { source: "/tools/:path*", destination: "/outils/:path*", permanent: true },
      { source: "/about", destination: "/a-propos", permanent: true },
    ];
  },
};

export default nextConfig;
