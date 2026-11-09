"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion";

/**
 * Scroll suave con inercia (Lenis) sincronizado con ScrollTrigger, para que las
 * animaciones ligadas al scroll se muevan con la misma cadencia.
 *
 * Lenis respeta `prefers-reduced-motion` por defecto: en ese caso el scroll es
 * el nativo del navegador.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.09,
      // Los enlaces a anclas (#servicios, /#contacto…) también se desplazan suave,
      // descontando la altura de la cabecera fija.
      anchors: { offset: -72 },
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Si la página se abre con un ancla en la URL, recolocamos tras medir
    const hash = window.location.hash;
    if (hash) {
      requestAnimationFrame(() => {
        const target = document.querySelector(hash);
        if (target instanceof HTMLElement) lenis.scrollTo(target, { offset: -72, immediate: true });
      });
    }

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
