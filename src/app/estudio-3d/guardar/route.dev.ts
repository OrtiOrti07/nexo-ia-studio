import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/*
 * Guarda las imágenes del laboratorio de render (solo en `next dev`).
 * Las escenas van a src/assets/renders/; la imagen social, a src/app/.
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") return new Response(null, { status: 404 });
  const name = new URL(request.url).searchParams.get("nombre") ?? "";
  if (!/^[a-z0-9-]{2,40}$/.test(name)) return Response.json({ error: "nombre no válido" }, { status: 400 });
  const data = Buffer.from(await request.arrayBuffer());
  if (data.length < 1000 || data.length > 8_000_000) return Response.json({ error: "tamaño no válido" }, { status: 400 });
  const target =
    name === "opengraph-image"
      ? path.join(process.cwd(), "src", "app", "opengraph-image.png")
      : path.join(process.cwd(), "src", "assets", "renders", `${name}.webp`);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, data);
  return Response.json({ ok: true, bytes: data.length });
}
