// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   experimental: {
//     optimizePackageImports: ["lucide-react", "framer-motion"],
//   },
//   images: {
//     formats: ["image/avif", "image/webp"],
//   },
//   compress: true,
// poweredByHeader: false,
// generateEtags: true,
//   async headers() {
//     return [
//       {
//         source: "/(.*)",
//         headers: [
//           { key: "X-Frame-Options", value: "DENY" },
//           { key: "X-Content-Type-Options", value: "nosniff" },
//           { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
//           { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
//         ],
//       },
//       {
//         source: "/api/(.*)",
//         headers: [
//           { key: "Cache-Control", value: "no-store" },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// `next.config.ts` is loaded by Next.js outside the normal app module
// graph (before the `@/*` tsconfig path alias / webpack resolver is set
// up), so it cannot safely resolve `@/lib/seo/redirects`. Use a type-safe
// relative import instead; this does not change `lib/seo`'s architecture
// or its public surface — every other consumer still imports via `@/lib/seo`.
import { getNextRedirects } from "./lib/seo/redirects";

// Pin the app root so a stray parent lockfile (e.g. Desktop/Dev/Work) cannot
// become Turbopack's inferred workspace root and break nested App Router routes.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  turbopack: {
    root: projectRoot,
    resolveAlias: {
      "@tensorflow/tfjs-node": "@tensorflow/tfjs",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
  async redirects() {
    return getNextRedirects();
  },
};

export default nextConfig;