"use client";

/**
 * Estado compartido entre la página (DOM) y la escena 3D, sin re-renderizar:
 * la escena lee estos valores en cada fotograma.
 */

export const sceneState = {
  /** Formación objetivo según el scroll (0..5, con decimales en las transiciones). */
  stage: 0,
  /** Puntero en coordenadas normalizadas (-1..1) y si está activo (solo ratón). */
  pointer: { x: 0, y: 0, active: false },
  /** Nodo del método que se ilumina en la formación "señal" (posición x en la escena). */
  focusX: 0,
};

/* Pausa de la animación (WCAG 2.2.2): pequeño store para useSyncExternalStore */
let paused = false;
const listeners = new Set<() => void>();

export const pauseStore = {
  get: () => paused,
  getServer: () => false,
  set(next: boolean) {
    paused = next;
    // Detiene también las animaciones CSS de la página (ver globals.css)
    document.documentElement.dataset.motion = next ? "paused" : "running";
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
