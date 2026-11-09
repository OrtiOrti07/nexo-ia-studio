"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { contactAnchor, href } from "@/config/site";
import { hero } from "@/content/home";
import { ButtonLink } from "@/components/ui/Button";
import { gsap, MOTION, useGSAP } from "@/lib/motion";
import heroSky from "@/assets/photos/hero-nubes.jpg";
import type { PointerState } from "./OrreryScene";
import { OrreryPoster } from "./OrreryPoster";
import { useSceneMode } from "./useSceneMode";

// three.js solo se descarga cuando el dispositivo va a mostrar la escena 3D
const OrreryCanvas = dynamic(() => import("./OrreryScene"), { ssr: false, loading: () => null });

/** Si WebGL falla al crear el contexto, mostramos la versión estática. */
class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const delay = (i: number) => ({ "--reveal-index": i }) as CSSProperties;

/**
 * Hero "cinematográfico" por capas, de atrás hacia delante:
 *  1. Cielo (foto) con un zum lento.
 *  2. Titular gigante.
 *  3. Sistema orbital 3D que asoma sobre el mar de nubes.
 *  4. Nubes en primer plano: la misma foto, recortada con un degradado, que
 *     sube más deprisa al hacer scroll y "tapa" el titular.
 *  5. Texto de apoyo y botones, siempre por encima.
 */
export function CinematicHero() {
  const root = useRef<HTMLElement>(null);
  const objectRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<PointerState>({ x: 0, y: 0, active: false });
  const mode = useSceneMode();
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const is3D = mode === "high" || mode === "lite";

  // Scroll: cada capa se mueve a su propia velocidad (parallax con profundidad)
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MOTION.desktop, mobile: MOTION.mobile }, (ctx) => {
        const desktop = Boolean(ctx.conditions?.desktop);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: desktop ? "+=110%" : "bottom top",
            scrub: true,
            pin: desktop,
          },
        });
        tl.to("[data-layer=back]", { scale: 1.22, yPercent: -5, duration: 1 }, 0)
          .to("[data-layer=title]", { yPercent: desktop ? 70 : 40, scale: 0.94, duration: 1 }, 0)
          .to("[data-layer=title]", { autoAlpha: 0, duration: 0.25 }, 0.75)
          .to("[data-layer=object]", { yPercent: -16, scale: 1.1, duration: 1 }, 0)
          .to("[data-layer=front]", { yPercent: -18, scale: 1.1, duration: 1 }, 0)
          .to("[data-layer=ui]", { autoAlpha: 0, y: -40, duration: 0.3 }, 0);
      });
    },
    { scope: root },
  );

  // La escena 3D se detiene cuando el hero deja de verse
  useEffect(() => {
    const el = objectRef.current;
    if (!el || !is3D) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [is3D]);

  // Inclinación del sistema siguiendo el ratón
  useEffect(() => {
    if (mode !== "high") return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
      pointer.current.active = true;
    };
    const onLeave = () => {
      pointer.current.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [mode]);

  const handleReady = useCallback(() => setReady(true), []);
  const poster = <OrreryPoster className="h-full w-full" />;

  return (
    <section
      ref={root}
      id="inicio"
      data-header-theme="hero"
      aria-labelledby="hero-title"
      className="on-dark relative isolate h-svh min-h-[40rem] overflow-hidden bg-night text-white"
    >
      {/* 1. Cielo */}
      <div data-layer="back" className="absolute inset-0 will-change-transform" aria-hidden="true">
        <div className="hero-zoom absolute inset-0">
          <Image
            src={heroSky}
            alt=""
            fill
            preload
            quality={85}
            sizes="100vw"
            placeholder="blur"
            className="object-cover object-[50%_58%]"
          />
        </div>
        {/* Gradación de color: cielo más profundo arriba para leer el titular */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,31,0.62)_0%,rgba(7,11,31,0.18)_38%,rgba(7,11,31,0)_55%)]" />
      </div>

      {/* 2. Titular */}
      <div
        data-layer="title"
        className="absolute inset-x-0 top-[13svh] z-10 px-gutter text-center will-change-transform lg:top-[12svh]"
      >
        <h1
          id="hero-title"
          className="wide mx-auto max-w-[15ch] text-[clamp(2.6rem,0.8rem+6.4vw,7.6rem)] leading-[0.9] font-[720] tracking-[-0.045em] text-balance drop-shadow-[0_6px_40px_rgba(7,11,31,0.35)] lg:max-w-none"
        >
          {hero.titleLines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span className="line-rise block" style={delay(i)}>
                {line}
              </span>
              {i < hero.titleLines.length - 1 ? " " : null}
            </span>
          ))}
        </h1>
      </div>

      {/* 3. Sistema orbital 3D */}
      <div
        ref={objectRef}
        data-layer="object"
        aria-hidden="true"
        className="absolute left-1/2 z-20 aspect-square w-[min(94vw,32rem)] -translate-x-1/2 will-change-transform [top:calc(60%-min(47vw,16rem))] lg:w-[min(66vh,46rem)] lg:[top:calc(60%-min(33vh,23rem))]"
      >
        <div
          className={`absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,179,71,0.5),rgba(255,179,71,0)_45%)] transition-opacity duration-700 ${
            ready || mode === "poster" ? "opacity-0" : "opacity-100"
          }`}
        />
        {mode === "poster" && poster}
        {is3D && (
          <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
            <SceneBoundary fallback={poster}>
              <OrreryCanvas
                quality={mode}
                running={!paused && inView}
                pointerRef={pointer}
                onReady={handleReady}
              />
            </SceneBoundary>
          </div>
        )}
      </div>

      {/* 4. Nubes en primer plano */}
      <div
        data-layer="front"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 will-change-transform [mask-image:linear-gradient(180deg,transparent_0%,transparent_57%,#000_71%)]"
      >
        <div className="hero-zoom absolute inset-0">
          <Image
            src={heroSky}
            alt=""
            fill
            quality={85}
            sizes="100vw"
            className="object-cover object-[50%_58%]"
          />
        </div>
      </div>

      {/* Sombra inferior para leer el texto sobre las nubes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[52%] bg-[linear-gradient(0deg,rgba(7,11,31,0.86)_0%,rgba(7,11,31,0.5)_42%,rgba(7,11,31,0)_100%)]"
      />

      {/* 5. Texto de apoyo y acciones */}
      <div data-layer="ui" className="absolute inset-x-0 bottom-0 z-50">
        <div className="page-container flex flex-col gap-6 pb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:pb-14">
          <p
            className="hero-reveal max-w-[34rem] font-serif text-[1.125rem] leading-snug text-white/90 sm:text-lead"
            style={delay(3)}
          >
            {hero.lead}
          </p>
          <div className="hero-reveal flex flex-col gap-3 sm:flex-row lg:shrink-0" style={delay(4)}>
            <ButtonLink href={contactAnchor} variant="signal" size="lg">
              {hero.primaryCta}
            </ButtonLink>
            <ButtonLink href={href("/#situaciones")} variant="outline-light" size="lg" className="backdrop-blur-sm">
              {hero.secondaryCta}
            </ButtonLink>
          </div>
        </div>
      </div>
      {/* Control de pausa (la animación es continua: WCAG 2.2.2) */}
      {is3D && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="absolute right-gutter bottom-3 z-50 inline-flex h-8 items-center gap-2 rounded-pill px-2 text-micro font-medium text-white/75 transition-colors duration-200 hover:text-white"
        >
          {paused ? (
            <svg viewBox="0 0 16 16" className="size-3" aria-hidden="true">
              <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" className="size-3" aria-hidden="true">
              <rect x="3.5" y="2.5" width="3" height="11" rx="0.8" fill="currentColor" />
              <rect x="9.5" y="2.5" width="3" height="11" rx="0.8" fill="currentColor" />
            </svg>
          )}
          {paused ? "Reanudar animación" : "Pausar animación"}
        </button>
      )}
    </section>
  );
}
