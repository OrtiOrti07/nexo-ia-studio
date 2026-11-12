import * as THREE from "three";
import { loadFonts } from "./paint";
import { SCENES, type Built, type SceneId } from "./scenes";
import { createStudio, fitCamera, type Studio } from "./studio";

/** Monta una escena en un estudio ya creado y encuadra la cámara. */
export function mountScene(studio: Studio, id: SceneId): Built {
  const built: Built = SCENES[id].build(studio);
  studio.camera.aspect = SCENES[id].aspect;
  studio.camera.updateProjectionMatrix();
  fitCamera(studio.camera, studio.root, new THREE.Vector3(...built.dir), built.margin ?? 0.9, built.lift ?? 0);
  return built;
}

/** Renderiza una escena como imagen (para el laboratorio de render). */
export async function renderStill(id: SceneId, width: number, type = "image/webp", quality = 0.9) {
  await loadFonts();
  const { aspect } = SCENES[id];
  const w = Math.round(width);
  const h = Math.round(width / aspect);
  const canvas = document.createElement("canvas");
  const studio = createStudio(canvas, { preserve: true });
  studio.setSize(w, h, 1);
  const built = mountScene(studio, id);
  built.tick?.(0, { x: 0, y: 0 });
  studio.render();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  // Copia para componer otras imágenes antes de liberar el contexto WebGL
  const copy = document.createElement("canvas");
  copy.width = w;
  copy.height = h;
  copy.getContext("2d")!.drawImage(canvas, 0, 0);
  studio.dispose();
  if (!blob) throw new Error(`No se pudo exportar ${id}`);
  return { blob, canvas: copy };
}
