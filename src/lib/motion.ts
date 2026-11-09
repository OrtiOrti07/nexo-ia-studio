"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Punto único de registro de GSAP. Todos los componentes animados importan
 * desde aquí para no registrar los plugins varias veces.
 */
gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Consultas de `gsap.matchMedia()`. Las animaciones ligadas al scroll solo se
 * crean si el usuario no ha pedido movimiento reducido; con movimiento reducido
 * cada sección se muestra en su composición final, estática.
 */
export const MOTION = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  any: "(prefers-reduced-motion: no-preference)",
} as const;

export { gsap, ScrollTrigger, useGSAP };
