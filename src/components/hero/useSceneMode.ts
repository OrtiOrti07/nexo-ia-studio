"use client";

import { useSyncExternalStore } from "react";

/**
 * Decide cómo se muestra la escena 3D del hero:
 * - "high": escritorio con WebGL.
 * - "lite": móvil, tableta o pantalla táctil (menos partículas y resolución).
 * - "poster": ilustración estática (movimiento reducido, ahorro de datos,
 *   equipo con poca memoria o CPU, o sin WebGL). No descarga three.js.
 * - "pending": durante el render en servidor.
 *
 * Para revisar las alternativas: ?escena=estatica o ?escena=ligera
 */
export type SceneMode = "pending" | "poster" | "high" | "lite";

let webglSupport: boolean | null = null;

function hasWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    webglSupport = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

type NavigatorHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

function detectMode(): SceneMode {
  const forced = new URLSearchParams(window.location.search).get("escena");
  if (forced === "estatica") return "poster";
  if (forced === "ligera") return "lite";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "poster";
  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return "poster";
  if ((nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) < 2) return "poster";
  if (!hasWebGL()) return "poster";
  const compact = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  return compact ? "lite" : "high";
}

function subscribe(onChange: () => void) {
  const queries = [
    window.matchMedia("(prefers-reduced-motion: reduce)"),
    window.matchMedia("(max-width: 767px), (pointer: coarse)"),
  ];
  queries.forEach((q) => q.addEventListener("change", onChange));
  return () => queries.forEach((q) => q.removeEventListener("change", onChange));
}

const getServerMode = (): SceneMode => "pending";

export function useSceneMode() {
  return useSyncExternalStore(subscribe, detectMode, getServerMode);
}
