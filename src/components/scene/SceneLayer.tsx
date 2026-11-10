"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { pauseStore, sceneState } from "./sceneStore";
import { useSceneMode } from "./useSceneMode";

// three.js y el postprocesado se descargan aparte, solo si se van a usar
const NeuralScene = dynamic(() => import("./NeuralScene"), { ssr: false, loading: () => null });

/** Si WebGL falla al crear el contexto, queda el fondo estático. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Traduce el scroll a la formación de la escena. Cada bloque de la página lleva
 * `data-stage="n"`; cerca del final de un bloque la escena empieza a pasar a la
 * formación del siguiente.
 */
function readStage() {
  const blocks = Array.from(document.querySelectorAll<HTMLElement>("[data-stage]"));
  if (blocks.length === 0) return 0;
  const centre = window.innerHeight * 0.5;
  for (let i = 0; i < blocks.length; i++) {
    const rect = blocks[i].getBoundingClientRect();
    if (rect.top <= centre && rect.bottom > centre) {
      const current = Number(blocks[i].dataset.stage);
      const next = blocks[i + 1] ? Number(blocks[i + 1].dataset.stage) : current;
      const local = (centre - rect.top) / rect.height;
      // En bloques altos (fijados con scroll) la transición ocupa menos recorrido
      const start = rect.height > window.innerHeight * 1.6 ? 0.88 : 0.7;
      return current + (next - current) * smoothstep(start, 1, local);
    }
  }
  const first = blocks[0].getBoundingClientRect();
  return first.top > centre ? Number(blocks[0].dataset.stage) : Number(blocks[blocks.length - 1].dataset.stage);
}

/** Fondo estático: halos de luz con la paleta, sin WebGL. */
function StaticBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute top-[8%] right-[-10%] size-[70vmax] rounded-full bg-[radial-gradient(circle,rgb(139_92_255/0.22),transparent_62%)]" />
      <div className="absolute top-[30%] right-[8%] size-[38vmax] rounded-full bg-[radial-gradient(circle,rgb(34_227_255/0.16),transparent_60%)]" />
      <div className="absolute bottom-[-20%] left-[-10%] size-[60vmax] rounded-full bg-[radial-gradient(circle,rgb(59_130_255/0.16),transparent_62%)]" />
    </div>
  );
}

export function SceneLayer() {
  const mode = useSceneMode();
  const paused = useSyncExternalStore(pauseStore.subscribe, pauseStore.get, pauseStore.getServer);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const is3D = mode === "high" || mode === "lite";

  // Scroll → formación
  useEffect(() => {
    if (!is3D) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      sceneState.stage = readStage();
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [is3D]);

  // Puntero (solo ratón o lápiz: en táctil no hay "hover")
  useEffect(() => {
    if (mode !== "high") return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      sceneState.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
      sceneState.pointer.active = true;
    };
    const onLeave = () => {
      sceneState.pointer.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [mode]);

  // Pestaña oculta: la escena se detiene
  useEffect(() => {
    const onVisibility = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const handleReady = useCallback(() => setReady(true), []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-bg">
      {(mode === "static" || (is3D && !ready)) && <StaticBackdrop />}
      {is3D && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <SceneBoundary>
            <NeuralScene quality={mode} running={!paused && visible} onReady={handleReady} />
          </SceneBoundary>
        </div>
      )}
      {/* Viñeta: oscurece los bordes para que el texto respire */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(5_5_5/0.75)_100%)]" />
    </div>
  );
}

/** Botón de pausa de la animación de fondo (WCAG 2.2.2). */
export function ScenePauseButton({ className = "" }: { className?: string }) {
  const paused = useSyncExternalStore(pauseStore.subscribe, pauseStore.get, pauseStore.getServer);
  const mode = useSceneMode();
  if (mode !== "high" && mode !== "lite") return null;
  return (
    <button
      type="button"
      onClick={() => pauseStore.set(!paused)}
      className={`inline-flex h-11 items-center gap-2 rounded-pill px-3 text-micro font-medium text-muted transition-colors duration-200 hover:text-text ${className}`}
    >
      <span aria-hidden="true" className="grid size-5 place-items-center rounded-full border border-white/20">
        {paused ? (
          <svg viewBox="0 0 16 16" className="size-2.5">
            <path d="M5 3v10l8-5z" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" className="size-2.5">
            <rect x="4" y="3" width="2.6" height="10" rx="0.6" fill="currentColor" />
            <rect x="9.4" y="3" width="2.6" height="10" rx="0.6" fill="currentColor" />
          </svg>
        )}
      </span>
      {paused ? "Reanudar animación" : "Pausar animación"}
    </button>
  );
}
