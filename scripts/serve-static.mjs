// Sirve la carpeta out/ como lo haría GitHub Pages, bajo la subcarpeta del
// repositorio, para comprobar en local rutas, enlaces y recursos.
//
// Uso (después de compilar la versión estática, ver README.md):
//   npm run preview:pages            → http://localhost:4173/nexo-ia-studio/
//   PORT=5000 BASE_PATH=/otra npm run preview:pages

import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../out", import.meta.url));
const BASE = (process.env.BASE_PATH ?? "/nexo-ia-studio").replace(/\/$/, "");
const PORT = Number(process.env.PORT ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
};

if (!existsSync(OUT)) {
  console.error("No existe out/. Compila antes la versión estática (ver README.md).");
  process.exit(1);
}

function send(res, status, file) {
  res.writeHead(status, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const path = decodeURIComponent(url.pathname);
  if (path === "/" && BASE) {
    res.writeHead(302, { Location: `${BASE}/` });
    return res.end();
  }
  if (BASE && !path.startsWith(`${BASE}/`) && path !== BASE) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end(`Fuera de ${BASE}/ (GitHub Pages solo sirve esa subcarpeta)`);
  }
  if (path === BASE) {
    res.writeHead(301, { Location: `${BASE}/` });
    return res.end();
  }
  // Sin barras iniciales (en Windows, normalize las convierte en «\»)
  const relative = normalize(path.slice(BASE.length)).replace(/^[\\/]+/, "");
  let file = join(OUT, relative);
  if (!file.startsWith(OUT)) {
    res.writeHead(403);
    return res.end();
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
  if (!existsSync(file)) return send(res, 404, join(OUT, "404.html"));
  send(res, 200, file);
}).listen(PORT, () => {
  console.log(`Versión estática en http://localhost:${PORT}${BASE}/`);
});
