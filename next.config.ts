import type { NextConfig } from "next";

/**
 * Con NEXT_PUBLIC_STATIC_EXPORT=1 la web se compila como archivos estáticos
 * (carpeta out/) para GitHub Pages. NEXT_PUBLIC_BASE_PATH es la subcarpeta
 * donde se publica (p. ej. /nexo-ia-studio). Ver .github/workflows/pages.yml.
 */
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
const isDev = process.env.NODE_ENV === "development";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  // La exportación estática no admite Cache Components (prerenderizado parcial)
  cacheComponents: !isStaticExport,
  ...(isStaticExport ? { output: "export" as const, trailingSlash: true } : {}),
  basePath,
  // Las páginas *.dev.tsx (el laboratorio de render 3D) solo existen en desarrollo
  pageExtensions: isDev ? ["tsx", "ts", "dev.tsx", "dev.ts"] : ["tsx", "ts"],
  images: {
    // Las imágenes ya se generan optimizadas (WebP) y la web es estática:
    // se sirven tal cual, sin el optimizador de Next.js.
    unoptimized: true,
  },
  partialPrefetching: !isStaticExport,
  turbopack: {
    rules: {
      // Solo la hoja global usa Tailwind; los módulos CSS (*.module.css) siguen
      // siendo módulos, con sus clases con ámbito propio.
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
