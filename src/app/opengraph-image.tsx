import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { hero } from "@/content/home";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // La misma foto del hero, leída en el servidor al generar la imagen
  const photo = await readFile(join(process.cwd(), "src/assets/photos/hero-nubes.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", color: "#ffffff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={1200} height={800} style={{ position: "absolute", top: -60, left: 0, width: 1200, height: 800, objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            background: "linear-gradient(180deg, rgba(7,11,31,0.7) 0%, rgba(7,11,31,0.15) 55%, rgba(7,11,31,0.55) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "64px 72px",
          }}
        >
          <div style={{ display: "flex", fontSize: 30, fontWeight: 600 }}>{site.name}</div>
          <div style={{ display: "flex", fontSize: 74, fontWeight: 700, lineHeight: 1, letterSpacing: -2, maxWidth: 900 }}>
            {hero.title}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#f6b443" }}>{site.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
