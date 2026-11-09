// Genera robots.txt, sitemap.xml y manifest.webmanifest en public/.
//
// Por qué son archivos y no rutas de Next.js: la versión estática (GitHub
// Pages) exige marcar esas rutas como estáticas, y esa marca no es compatible
// con Cache Components. Como archivos funcionan igual con y sin servidor.
//
// Usa la misma configuración que la web (src/config/site.ts), así que respeta
// NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_BASE_PATH y NEXT_PUBLIC_STATIC_EXPORT.
// Se ejecuta antes de `dev` y de `build`.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { absoluteUrl, basePath, href, site } from "../src/config/site.ts";

const PUBLIC = join(fileURLToPath(new URL("..", import.meta.url)), "public");

const pages = [
  { path: "/", changefreq: "monthly", priority: "1.0" },
  { path: "/aviso-legal", changefreq: "yearly", priority: "0.2" },
  { path: "/privacidad", changefreq: "yearly", priority: "0.2" },
];

const robots = `User-agent: *
Allow: ${href("/")}
Disallow: ${href("/api/")}

Sitemap: ${absoluteUrl("/sitemap.xml")}
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) =>
      `  <url>\n    <loc>${absoluteUrl(p.path)}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>
`;

const manifest = {
  name: site.name,
  short_name: site.shortName,
  description: site.description,
  lang: site.language,
  start_url: href("/"),
  display: "browser",
  background_color: "#eff1f4",
  theme_color: "#1633c9",
  icons: [
    { src: `${basePath}/icon.svg`, sizes: "any", type: "image/svg+xml" },
    { src: `${basePath}/apple-icon.png`, sizes: "180x180", type: "image/png" },
  ],
};

// public/ puede no existir en un clon limpio (git no guarda carpetas vacías)
mkdirSync(PUBLIC, { recursive: true });
writeFileSync(join(PUBLIC, "robots.txt"), robots);
writeFileSync(join(PUBLIC, "sitemap.xml"), sitemap);
writeFileSync(join(PUBLIC, "manifest.webmanifest"), `${JSON.stringify(manifest, null, 2)}\n`);
