"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { contactAnchor, href } from "@/config/site";
import { hero, showcaseStages } from "@/content/home";
import { storyRenders } from "@/components/visuals/renders";
import type { Quality } from "@/components/three/showcase";

const STAGES = showcaseStages.length + 1;

/**
 * ¿Puede ir en vivo? Con WebGL 2, sin movimiento reducido, sin ahorro de datos
 * y con memoria suficiente. En móvil también, con calidad «baja».
 */
function liveQuality(): Quality | null {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return null;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 3) return null;
  try {
    const test = document.createElement("canvas");
    const gl = test.getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    if (!gl) return null;
  } catch {
    return null;
  }
  const small = window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches;
  return small ? "low" : "high";
}

/** Fotograma fijo: horizontal en pantallas anchas y vertical en las altas. */
function Still({ i, visible, poster }: { i: number; visible: boolean; poster?: "loading" | "sharp" }) {
  const common = { alt: "", sizes: "100vw" };
  const wide = getImageProps({ ...common, src: storyRenders[i].wide }).props;
  const tall = getImageProps({
    ...common,
    src: storyRenders[i].tall,
    loading: i === 0 ? "eager" : "lazy",
    fetchPriority: i === 0 ? "high" : "auto",
  }).props;
  return (
    <picture>
      <source media="(min-aspect-ratio: 1/1)" srcSet={wide.src} width={wide.width} height={wide.height} />
      <img
        {...tall}
        alt=""
        data-poster={poster}
        className={`absolute inset-0 size-full object-cover transition-[opacity,filter,scale] duration-700 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />
    </picture>
  );
}

/**
 * Portada y escaparate 3D. La escena ocupa la pantalla y se queda fija
 * mientras los textos pasan por encima; el scroll abre el portátil, recorre
 * la web, trae el móvil y enseña otros conceptos.
 *
 * - En vivo (three.js, que se descarga aparte) en escritorio y en móviles
 *   capaces, con calidad adaptada.
 * - Sin WebGL, con ahorro de datos o movimiento reducido: fotogramas
 *   renderizados con el mismo motor, que cambian con cada etapa.
 * - Mientras carga, el primer fotograma se ve desenfocado y oscuro; luego la
 *   escena en vivo aparece desde la oscuridad (o el fotograma se enfoca).
 */
export function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progress = useRef(0);
  const [stage, setStage] = useState(0);
  const [mode, setMode] = useState<"loading" | "live" | "stills">("loading");

  // Progreso del scroll, etapa activa y cabecera clara sobre el fondo oscuro
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / span));
      progress.current = p;
      setStage(Math.round(p * (STAGES - 1)));
      if (r.top <= 72 && r.bottom > 72) document.documentElement.dataset.header = "dark";
      else delete document.documentElement.dataset.header;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      delete document.documentElement.dataset.header;
    };
  }, []);

  // Escena en vivo (o fotogramas si no es posible)
  useEffect(() => {
    const quality = liveQuality();
    let stop: (() => void) | undefined;
    let cancelled = false;
    const fallback = () => !cancelled && setMode("stills");
    if (!quality) {
      const id = requestAnimationFrame(fallback);
      return () => {
        cancelled = true;
        cancelAnimationFrame(id);
      };
    }
    // Si tarda demasiado, se enfoca el fotograma mientras tanto
    const slow = window.setTimeout(() => !cancelled && setMode((m) => (m === "loading" ? "stills" : m)), 6000);
    import("@/components/three/showcaseLive")
      .then(({ startShowcase }) => {
        if (cancelled || !canvasRef.current || !stickyRef.current) return;
        return startShowcase(canvasRef.current, stickyRef.current, () => progress.current, () => setMode("live"), quality);
      })
      .then((dispose) => {
        if (cancelled) dispose?.();
        else stop = dispose;
      })
      .catch(fallback);
    return () => {
      cancelled = true;
      window.clearTimeout(slow);
      stop?.();
    };
  }, []);

  const live = mode === "live";

  return (
    <section ref={sectionRef} id="inicio" aria-labelledby="hero-title" className="relative bg-[#05070d] text-paper">
      {/* Escena fija */}
      <div ref={stickyRef} className="sticky top-0 h-svh overflow-hidden" aria-hidden="true">
        {storyRenders.map((_, i) =>
          i === 0 || (mode === "stills" && Math.abs(i - stage) <= 1) ? (
            <Still
              key={i}
              i={i}
              visible={!live && (mode === "loading" ? i === 0 : i === stage)}
              poster={i === 0 ? (mode === "loading" ? "loading" : "sharp") : undefined}
            />
          ) : null,
        )}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 size-full transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}
        />
        {/* Sombreado para que el texto se lea: inferior en móvil, lateral en escritorio */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#05070d_6%,rgb(5_7_13/0.86)_34%,rgb(5_7_13/0.2)_58%,transparent_72%)] lg:bg-[linear-gradient(to_right,rgb(5_7_13/0.9)_0%,rgb(5_7_13/0.55)_36%,transparent_60%)]" />
      </div>

      {/* Textos que pasan por encima */}
      <div className="relative -mt-[100svh]">
        <div
          data-hero-block
          className="page-container flex min-h-svh flex-col justify-end pt-24 pb-[max(2.5rem,env(safe-area-inset-bottom))] lg:justify-center lg:pb-16"
        >
          <div className="max-w-[40rem]">
            <p data-hero className="kicker text-muted-dark">
              {hero.eyebrow}
            </p>
            <h1 id="hero-title" data-hero-title className="mt-4 text-hero sm:mt-5">
              Tu web debería estar{" "}
              <span className="whitespace-nowrap">
                <span className="text-accent-light">a la altura</span>
                <span
                  aria-hidden="true"
                  className="ml-[0.12em] inline-block h-[0.72em] w-[0.26em] border-y-[3px] border-accent-light bg-[linear-gradient(var(--color-accent-light),var(--color-accent-light))] bg-[length:3px_100%] bg-center bg-no-repeat align-[0.02em]"
                />
              </span>{" "}
              de tu negocio.
            </h1>
            <p data-hero className="mt-4 max-w-[34rem] text-body text-paper/75 sm:mt-6 sm:text-lead">
              {hero.lead}
            </p>
            <div data-hero className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 sm:mt-9">
              <a href={contactAnchor} data-magnetic className="btn btn-primary btn-lg max-sm:w-full">
                {hero.primaryCta}
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
              <a
                href={href("/#proceso")}
                className="group inline-flex min-h-11 items-center gap-2 text-small font-semibold text-paper/85 transition-colors hover:text-paper max-sm:mx-auto"
              >
                <span className="link-grow">{hero.secondaryCta}</span>
                <ArrowDown aria-hidden="true" className="size-4 text-accent-light transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>

        {showcaseStages.map((s, i) => {
          const last = i === showcaseStages.length - 1;
          return (
            <div
              key={s.title}
              className={`page-container flex min-h-svh items-end lg:items-center lg:pb-0 ${last ? "pb-[22svh]" : "pb-[max(3rem,env(safe-area-inset-bottom))]"}`}
            >
              <div data-stage-text data-stage-last={last ? "" : undefined} className="max-w-[30rem]">
                <p data-stage-part className="kicker text-muted-dark">
                  <span className="font-mono text-accent-light">0{i + 2}</span> {s.kicker}
                </p>
                <h2 data-stage-part className="mt-4 text-h2 sm:mt-5">
                  {s.title}
                </h2>
                <p data-stage-part className="mt-4 text-body text-paper/75 sm:mt-5 sm:text-lead">
                  {s.body}
                </p>
                {last && (
                  <a data-stage-part data-magnetic href={contactAnchor} className="btn btn-primary btn-lg mt-7 max-sm:w-full">
                    Cuéntame tu proyecto
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
