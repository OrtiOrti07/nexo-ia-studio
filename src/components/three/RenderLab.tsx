"use client";

import { useState } from "react";
import { FONTS, loadFonts } from "./paint";
import { renderStill } from "./render";
import { SCENE_IDS, type SceneId } from "./scenes";
import { createShowcase, STAGE_COUNT } from "./showcase";

/** Anchura (px) de cada imagen: el doble de lo que ocupa en pantalla, aprox. */
const WIDTHS: Partial<Record<SceneId, number>> = {};
const DEFAULT_WIDTH = 1500;

async function save(name: string, blob: Blob) {
  const res = await fetch(`/estudio-3d/guardar?nombre=${name}`, { method: "POST", body: blob });
  if (!res.ok) throw new Error(`No se pudo guardar ${name}`);
  return (await res.json()) as { bytes: number };
}

/** Imagen para redes sociales (1200×630): titular sobre el escaparate 3D oscuro. */
async function composeOg(still: HTMLCanvasElement) {
  await loadFonts();
  const c = document.createElement("canvas");
  c.width = 1200;
  c.height = 630;
  const ctx = c.getContext("2d")!;
  // El fotograma ocupa todo el fondo, desplazado a la derecha
  const scale = 630 / still.height;
  ctx.fillStyle = "#05070d";
  ctx.fillRect(0, 0, 1200, 630);
  ctx.drawImage(still, 1200 - still.width * scale + 120, 0, still.width * scale, 630);
  const shade = ctx.createLinearGradient(0, 0, 760, 0);
  shade.addColorStop(0, "rgba(5,7,13,.92)");
  shade.addColorStop(0.7, "rgba(5,7,13,.55)");
  shade.addColorStop(1, "rgba(5,7,13,0)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, 1200, 630);

  ctx.lineWidth = 3;
  ctx.strokeStyle = "#f4f5f7";
  ctx.fillStyle = "#0b1020";
  ctx.beginPath();
  ctx.roundRect(72, 66, 34, 28, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#2e5bff";
  ctx.beginPath();
  ctx.roundRect(86, 80, 36, 30, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#f4f5f7";
  ctx.font = `800 34px ${FONTS.display}`;
  ctx.fillText("Juan", 138, 102);
  ctx.fillStyle = "#9aa3b7";
  ctx.font = `400 18px ${FONTS.mono}`;
  ctx.fillText("diseño web", 230, 100);

  ctx.font = `700 70px ${FONTS.display}`;
  ctx.fillStyle = "#f4f5f7";
  ctx.fillText("Tu web debería", 72, 250);
  ctx.fillText("estar", 72, 324);
  ctx.fillStyle = "#8ea6ff";
  ctx.fillText("a la altura", 72 + ctx.measureText("estar ").width, 324);
  ctx.fillStyle = "#f4f5f7";
  ctx.fillText("de tu negocio.", 72, 398);

  ctx.font = `400 20px ${FONTS.mono}`;
  let x = 72;
  for (const tag of ["Webs corporativas", "Landing pages", "Rediseños"]) {
    ctx.fillStyle = "#2e5bff";
    ctx.beginPath();
    ctx.arc(x + 5, 553, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#9aa3b7";
    ctx.fillText(tag, x + 18, 560);
    x += ctx.measureText(tag).width + 48;
  }
  return new Promise<Blob>((resolve) => c.toBlob((b) => resolve(b!), "image/png"));
}

/** Fotogramas fijos del escaparate de la portada: horizontal (escritorio) y vertical (móvil). */
async function renderStory(onDone: (name: string, blob: Blob, canvas: HTMLCanvasElement) => Promise<void>) {
  const sizes = [
    ["ancho", 1600, 900],
    ["alto", 860, 1620],
  ] as const;
  for (const [label, w, h] of sizes) {
    const canvas = document.createElement("canvas");
    const show = await createShowcase(canvas, { still: true });
    show.setSize(w, h, 1);
    for (let i = 0; i < STAGE_COUNT; i++) {
      show.update(i / (STAGE_COUNT - 1), 0);
      show.render();
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.86));
      if (blob) await onDone(`story-${i}-${label}`, blob, canvas);
    }
    show.dispose();
  }
}

/**
 * Laboratorio de render (solo en desarrollo). Renderiza cada escena con el
 * mismo motor que la portada en vivo y guarda las imágenes en
 * src/assets/renders/, más la imagen para redes sociales.
 */
export function RenderLab() {
  const [log, setLog] = useState<string[]>([]);
  const [previews, setPreviews] = useState<{ id: string; url: string }[]>([]);
  const [busy, setBusy] = useState(false);

  const run = async (ids: SceneId[]) => {
    setBusy(true);
    setLog([]);
    try {
      for (const id of ids) {
        const { blob } = await renderStill(id, WIDTHS[id] ?? DEFAULT_WIDTH);
        const { bytes } = await save(id, blob);
        setLog((l) => [...l, `✓ ${id}: ${Math.round(bytes / 1024)} KB`]);
        setPreviews((p) => [...p.filter((x) => x.id !== id), { id, url: URL.createObjectURL(blob) }]);
      }
      setLog((l) => [...l, "Listo"]);
    } catch (error) {
      setLog((l) => [...l, `✗ ${error instanceof Error ? error.message : String(error)}`]);
    } finally {
      setBusy(false);
    }
  };

  const runStory = async () => {
    setBusy(true);
    setLog([]);
    try {
      await renderStory(async (name, blob, canvas) => {
        const { bytes } = await save(name, blob);
        setLog((l) => [...l, `✓ ${name}: ${Math.round(bytes / 1024)} KB`]);
        setPreviews((p) => [...p.filter((x) => x.id !== name), { id: name, url: URL.createObjectURL(blob) }]);
        if (name === "story-4-ancho") {
          const copy = document.createElement("canvas");
          copy.width = canvas.width;
          copy.height = canvas.height;
          copy.getContext("2d")!.drawImage(canvas, 0, 0);
          const og = await composeOg(copy);
          const r = await save("opengraph-image", og);
          setLog((l) => [...l, `✓ opengraph-image: ${Math.round(r.bytes / 1024)} KB`]);
        }
      });
      setLog((l) => [...l, "Listo"]);
    } catch (error) {
      setLog((l) => [...l, `✗ ${error instanceof Error ? error.message : String(error)}`]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page-container py-16">
      <h1 className="text-h2">Laboratorio de render</h1>
      <p className="mt-4 max-w-copy text-muted">Solo en desarrollo. Genera las imágenes de las escenas 3D.</p>
      <div className="mt-8 flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" disabled={busy} onClick={() => run(SCENE_IDS)} data-render-all>
          Renderizar todo
        </button>
        <button type="button" className="btn btn-ink" disabled={busy} onClick={runStory} data-render-story>
          Escaparate de la portada
        </button>
        {SCENE_IDS.map((id) => (
          <button key={id} type="button" className="btn btn-outline" disabled={busy} onClick={() => run([id])} data-render={id}>
            {id}
          </button>
        ))}
      </div>
      <pre className="mt-8 font-mono text-micro" data-log>
        {log.join("\n")}
      </pre>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {previews.map((p) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={p.id} src={p.url} alt={p.id} className="w-full rounded-card border border-line bg-paper-2" />
        ))}
      </div>
    </main>
  );
}
