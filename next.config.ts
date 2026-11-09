import type { NextConfig } from "next";

/**
 * Con NEXT_PUBLIC_STATIC_EXPORT=1 la web se compila como archivos estáticos
 * (carpeta out/) para GitHub Pages. NEXT_PUBLIC_BASE_PATH es la subcarpeta
 * donde se publica (p. ej. /nexo-ia-studio). Ver .github/workflows/pages.yml.
 */
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  // La exportación estática no admite Cache Components (prerenderizado parcial)
  cacheComponents: !isStaticExport,
  ...(isStaticExport ? { output: "export" as const, trailingSlash: true } : {}),
  basePath,
  images: {
    // Next 16 exige declarar las calidades permitidas
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
    // Sin servidor no hay optimizador de imágenes: se sirven tal cual
    unoptimized: isStaticExport,
  },
  partialPrefetching: !isStaticExport,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
