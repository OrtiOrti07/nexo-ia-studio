"use client";

import { useSyncExternalStore } from "react";

/**
 * Cómo se muestra la escena 3D:
 * - "high": escritorio con WebGL (más partículas y bloom).
 * - "lite": móvil, tableta o pantalla táctil.
 * - "static": fondo de luz sin three.js (movimiento reducido, ahorro de datos,
 *   equipo con poca memoria o CPU, o sin WebGL).
 * - "pending": durante el render en servidor.
 *
 * Para revisar las alternativas: ?escena=estatica o ?escena=ligera
 */
export type SceneMode = "pending" | "static" | "high" | "lite";

let webglSupport: boolean | null = null;

function hasWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    webglSupport = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

type NavigatorHints = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };

function detect(): SceneMode {
  const forced = new URLSearchParams(window.location.search).get("escena");
  if (forced === "estatica") return "static";
  if (forced === "ligera") return "lite";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return "static";
  if ((nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) < 2) return "static";
  if (!hasWebGL()) return "static";
  const compact = window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches;
  return compact ? "lite" : "high";
}

function subscribe(onChange: () => void) {
  const queries = [
    window.matchMedia("(prefers-reduced-motion: reduce)"),
    window.matchMedia("(max-width: 1023px), (pointer: coarse)"),
  ];
  queries.forEach((q) => q.addEventListener("change", onChange));
  return () => queries.forEach((q) => q.removeEventListener("change", onChange));
}

export function useSceneMode() {
  return useSyncExternalStore(subscribe, detect, () => "pending" as SceneMode);
}
