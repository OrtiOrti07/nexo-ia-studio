"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

const EASE = "expo.out";

/**
 * Coreografía de toda la página. Se engancha a atributos `data-*` del HTML:
 *
 * - `data-hero-title`, `data-hero`, `data-hero-block`: entrada de la portada y salida con el scroll.
 * - `data-stage-text` / `data-stage-part`: textos del escaparate, que entran y salen con el scroll.
 * - `data-split`: titulares que se revelan palabra a palabra tras una máscara.
 * - `data-reveal`: bloques que suben y aparecen al entrar en pantalla (en grupo, escalonados).
 * - `data-clip`: imágenes que se descubren con un recorte y se acercan.
 * - `data-parallax="8"`: desplazamiento vertical ligado al scroll.
 * - `data-progress` dentro de `data-progress-track`: línea que se llena con el scroll.
 * - `data-magnetic`, `data-tilt` (+ `data-tilt-depth`): interacción con ratón.
 *
 * Con `prefers-reduced-motion` no se anima nada y todo se ve desde el principio.
 * En pantallas táctiles el scroll es el nativo; en escritorio, suave (Lenis).
 */
export function Motion() {
  useEffect(() => {
    const html = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      html.classList.add("anim-ready");
      return;
    }
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanups: (() => void)[] = [];

    // Scroll suave con inercia, sincronizado con ScrollTrigger
    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);
    if (fine) {
      lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 } });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    let ctx: gsap.Context | undefined;
    let cancelled = false;
    const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1200))]);

    fonts.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const blur = (px: number) => (fine ? `blur(${px}px)` : "blur(0px)");

        // ---------- Portada ----------
        const title = document.querySelector<HTMLElement>("[data-hero-title]");
        const heroItems = gsap.utils.toArray<HTMLElement>("[data-hero]");
        const intro = gsap.timeline({ delay: 0.1 });
        if (title) {
          const split = SplitText.create(title, { type: "lines,words", mask: "lines", linesClass: "split-line" });
          gsap.set(title, { opacity: 1 });
          intro.from(split.words, {
            yPercent: 118,
            rotate: 5,
            transformOrigin: "0% 100%",
            duration: 1.35,
            ease: EASE,
            stagger: 0.05,
          });
        }
        intro.fromTo(
          heroItems,
          { opacity: 0, y: 26, filter: blur(10) },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: EASE, stagger: 0.09, clearProps: "filter" },
          0.4,
        );

        const heroBlock = document.querySelector<HTMLElement>("[data-hero-block]");
        if (heroBlock) {
          gsap.to(heroBlock, {
            opacity: 0,
            y: -90,
            filter: blur(12),
            ease: "none",
            scrollTrigger: { trigger: heroBlock, start: "top top", end: "bottom 30%", scrub: true },
          });
        }

        // ---------- Textos del escaparate ----------
        gsap.utils.toArray<HTMLElement>("[data-stage-text]").forEach((el) => {
          const parts = el.querySelectorAll<HTMLElement>("[data-stage-part]");
          const last = el.hasAttribute("data-stage-last");
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: "top 92%", end: last ? "top 30%" : "bottom 8%", scrub: 0.5 },
          });
          tl.fromTo(
            parts,
            { opacity: 0, y: 70, filter: blur(14) },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, stagger: 0.07, ease: "power2.out" },
          );
          if (!last) {
            tl.to(parts, { opacity: 1, duration: 0.35 }).to(parts, {
              opacity: 0,
              y: -60,
              filter: blur(12),
              duration: 0.35,
              stagger: 0.05,
              ease: "power1.in",
            });
          }
        });

        // ---------- Titulares palabra a palabra ----------
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          const split = SplitText.create(el, { type: "lines,words", mask: "lines", linesClass: "split-line" });
          gsap.from(split.words, {
            yPercent: 115,
            rotate: 4,
            transformOrigin: "0% 100%",
            duration: 1.2,
            ease: EASE,
            stagger: 0.045,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        // ---------- Bloques que aparecen ----------
        const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
        gsap.set(reveals, { opacity: 0, y: 44 });
        ScrollTrigger.batch(reveals, {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.09, overwrite: true }),
        });

        // ---------- Imágenes que se descubren ----------
        gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
          const img = el.querySelector("img");
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
          tl.fromTo(
            el,
            { clipPath: "inset(16% 12% 16% 12% round 40px)", opacity: 0.4 },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1, duration: 1.6, ease: "expo.inOut", clearProps: "clipPath" },
          );
          if (img) tl.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 2, ease: EASE }, 0);
        });

        // ---------- Paralaje ----------
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax) || 8;
          gsap.fromTo(
            el,
            { yPercent: -amount },
            { yPercent: amount, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });

        // ---------- Líneas de progreso ----------
        gsap.utils.toArray<HTMLElement>("[data-progress-track]").forEach((track) => {
          const bar = track.querySelector("[data-progress]");
          if (!bar) return;
          gsap.fromTo(
            bar,
            { scaleY: 0 },
            { scaleY: 1, ease: "none", scrollTrigger: { trigger: track, start: "top 62%", end: "bottom 62%", scrub: 0.4 } },
          );
        });

        // ---------- Cabecera: se esconde al bajar y vuelve al subir ----------
        const header = document.querySelector<HTMLElement>(".site-header");
        if (header) {
          let hidden = false;
          ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate(self) {
              const hide = self.direction === 1 && self.scroll() > 140 && !header.hasAttribute("data-open");
              if (hide === hidden) return;
              hidden = hide;
              gsap.to(header, {
                yPercent: hide ? -105 : 0,
                duration: hide ? 0.3 : 0.6,
                ease: hide ? "power2.out" : EASE,
                overwrite: true,
              });
            },
          });
        }

        // ---------- Ratón: botones magnéticos y tarjetas que se inclinan ----------
        if (fine) {
          gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
            const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
            const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
            const move = (e: PointerEvent) => {
              const r = el.getBoundingClientRect();
              xTo((e.clientX - r.left - r.width / 2) * 0.22);
              yTo((e.clientY - r.top - r.height / 2) * 0.35);
            };
            const leave = () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)", overwrite: true });
            el.addEventListener("pointermove", move);
            el.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              el.removeEventListener("pointermove", move);
              el.removeEventListener("pointerleave", leave);
            });
          });

          gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((el) => {
            gsap.set(el, { transformPerspective: 1100 });
            const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3" });
            const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3" });
            const depth = el.querySelector<HTMLElement>("[data-tilt-depth]");
            const dx = depth ? gsap.quickTo(depth, "x", { duration: 0.8, ease: "power3" }) : null;
            const dy = depth ? gsap.quickTo(depth, "y", { duration: 0.8, ease: "power3" }) : null;
            const move = (e: PointerEvent) => {
              const r = el.getBoundingClientRect();
              const px = (e.clientX - r.left) / r.width - 0.5;
              const py = (e.clientY - r.top) / r.height - 0.5;
              ry(px * 9);
              rx(-py * 7);
              dx?.(px * 18);
              dy?.(py * 14);
            };
            const leave = () => {
              rx(0);
              ry(0);
              dx?.(0);
              dy?.(0);
            };
            el.addEventListener("pointermove", move);
            el.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              el.removeEventListener("pointermove", move);
              el.removeEventListener("pointerleave", leave);
            });
          });
        }
      });
      html.classList.add("anim-ready");
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      ctx?.revert();
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  return null;
}
