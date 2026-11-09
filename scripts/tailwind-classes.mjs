// Escribe en src/app/globals.css la lista de clases usadas en src/.
//
// Por qué existe: en algunos Windows, el Control inteligente de aplicaciones
// bloquea el binario nativo de Tailwind (@tailwindcss/oxide). Tailwind recurre
// entonces a una versión WebAssembly que en Windows no puede leer los archivos
// del proyecto y genera el CSS sin utilidades. Con `@source inline(...)` le
// damos la lista de clases directamente y no necesita leer nada.
//
// La lista se guarda entre dos comentarios marcadores dentro de globals.css
// (Tailwind solo atiende `@source` en el archivo principal). En equipos donde
// el binario funciona, la detección automática sigue activa y la lista solo
// añade lo mismo que ya encuentra.
//
// Uso: node scripts/tailwind-classes.mjs [--watch]

import { readdirSync, readFileSync, writeFileSync, watch } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "src");
const CSS = join(SRC, "app", "globals.css");
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mdx"]);
const START = "/* tailwind-classes:start (generado, no editar) */";
const END = "/* tailwind-classes:end */";

// Forma de una clase de Tailwind: variantes, utilidades y valores arbitrarios
const CLASS_LIKE = /^[!-]?[@a-z*[][a-z0-9\-:/._%#,[\]()'!&@*+=>]*$/i;

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return files(full);
    return EXTENSIONS.has(extname(entry.name)) ? [full] : [];
  });
}

function candidates() {
  const set = new Set();
  for (const file of files(SRC)) {
    const text = readFileSync(file, "utf8");
    // Solo el contenido de cadenas de texto: "...", '...' y `...`
    const strings = text.match(/"[^"\n]*"|'[^'\n]*'|`[^`]*`/g) ?? [];
    for (const literal of strings) {
      for (const raw of literal.slice(1, -1).split(/\s+/)) {
        // Limpia restos de expresiones dentro de plantillas: "clase"} → clase
        const token = raw.replace(/^["'`{(]+|["'`})?:,;]+$/g, "");
        if (!token || token.length > 200) continue;
        if (!CLASS_LIKE.test(token)) continue;
        if (/[()]/.test(token) && !token.includes("[")) continue;
        if (token.includes("${")) continue;
        set.add(token);
      }
    }
  }
  return [...set].sort();
}

function write() {
  const css = readFileSync(CSS, "utf8");
  const start = css.indexOf(START);
  const end = css.indexOf(END);
  if (start === -1 || end === -1) {
    throw new Error(`No encuentro los marcadores de la lista de clases en ${CSS}`);
  }
  const block = `${START}\n@source inline("${candidates().join(" ")}");\n${END}`;
  const next = css.slice(0, start) + block + css.slice(end + END.length);
  if (next !== css) {
    writeFileSync(CSS, next);
    return true;
  }
  return false;
}

write();

if (process.argv.includes("--watch")) {
  let timer;
  watch(SRC, { recursive: true }, (_event, name) => {
    if (!name || name.endsWith("globals.css")) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        if (write()) console.log("[tailwind] Lista de clases actualizada");
      } catch (error) {
        console.error("[tailwind] No se pudo actualizar la lista de clases:", error);
      }
    }, 150);
  });
}
