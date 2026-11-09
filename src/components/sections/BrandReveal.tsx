"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/config/site";
import { brandReveal, servicesIntro } from "@/content/home";
import { gsap, MOTION, useGSAP } from "@/lib/motion";
import heroSky from "@/assets/photos/hero-nubes.jpg";

/**
 * Presentación de marca: el nombre en letras gigantes con el cielo del hero
 * dentro. Al llegar, la cámara está "dentro" de una letra (solo se ve la foto)
 * y al hacer scroll se aleja hasta mostrar la palabra entera.
 *
 * Técnica: una capa del color del fondo con la palabra recortada mediante una
 * máscara SVG. Escalamos el texto de la máscara, así el recorte es vectorial y
 * se mantiene nítido a cualquier tamaño.
 */
export function BrandReveal() {
  const root = useRef<HTMLElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const maskId = useId().replace(/:/g, "");
  // Tamaño real de la sección; hasta medirlo usamos uno por defecto y no animamos
  const [measured, setMeasured] = useState<{ w: number; h: number } | null>(null);
  const box = measured ?? { w: 1440, h: 900 };
  const word = site.shortName.toUpperCase();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setMeasured({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fontSize = Math.min(box.w * 0.27, box.h * 0.52);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.any, () => {
        if (!measured) return;
        let tl: gsap.core.Timeline | undefined;
        let cancelled = false;
        // Esperamos a la tipografía para medir bien el centro de la letra
        document.fonts.ready.then(() => {
          if (cancelled) return;
          const text = textRef.current;
          if (!text || !groupRef.current) return;
          // Zum hacia el centro del carácter central (la "X" de NEXO)
          const index = Math.floor(word.length / 2);
          const extent = text.getExtentOfChar(Math.min(index, word.length - 1));
          const origin = `${extent.x + extent.width / 2} ${extent.y + extent.height / 2}`;

          tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=140%",
              scrub: true,
              pin: true,
            },
          });
          tl.fromTo(
            groupRef.current,
            { scale: 34, svgOrigin: origin, smoothOrigin: false },
            { scale: 1, svgOrigin: origin, smoothOrigin: false, duration: 0.62, ease: "power2.inOut" },
            0,
          )
            .fromTo("[data-reveal=photo]", { scale: 1.18 }, { scale: 1, duration: 0.62 }, 0)
            .fromTo("[data-reveal=tagline]", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.14 }, 0.5)
            .fromTo("[data-reveal=statement]", { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.66)
            .to({}, { duration: 0.14 });
        });
        // Se crea después de cargar la tipografía, así que la deshacemos a mano
        return () => {
          cancelled = true;
          tl?.revert();
        };
      });
    },
    { scope: root, dependencies: [measured?.w, measured?.h], revertOnUpdate: true },
  );

  return (
    <section ref={root} aria-labelledby="nexo-title" className="relative isolate h-svh min-h-[36rem] overflow-hidden bg-paper">
      <div data-reveal="photo" className="absolute inset-0" aria-hidden="true">
        <Image src={heroSky} alt="" fill sizes="100vw" className="object-cover object-[50%_45%]" />
      </div>

      {/* Capa del color del fondo con el nombre recortado */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${box.w} ${box.h}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={box.w} height={box.h}>
            <rect width={box.w} height={box.h} fill="white" />
            <g ref={groupRef}>
              <text
                ref={textRef}
                x={box.w / 2}
                y={box.h * 0.42}
                textAnchor="middle"
                dominantBaseline="central"
                fill="black"
                style={{
                  fontFamily: "var(--font-archivo)",
                  fontSize,
                  fontWeight: 800,
                  fontVariationSettings: '"wdth" 125',
                  letterSpacing: "-0.04em",
                }}
              >
                {word}
              </text>
            </g>
          </mask>
        </defs>
        <rect width={box.w} height={box.h} fill="var(--color-paper)" mask={`url(#${maskId})`} />
      </svg>

      <p
        data-reveal="tagline"
        className="wide absolute inset-x-0 top-[calc(42%+var(--tag-offset))] text-center text-[clamp(1.1rem,0.8rem+1.2vw,2rem)] font-semibold tracking-[-0.02em] text-ink"
        style={{ "--tag-offset": `${fontSize * 0.42}px` } as React.CSSProperties}
      >
        {site.name.replace(site.shortName, "").trim()}
        <span className="mt-1 block font-serif text-small font-normal tracking-normal text-slate">
          {brandReveal.tagline}
        </span>
      </p>

      <div data-reveal="statement" className="absolute inset-x-0 bottom-0 pb-10 lg:pb-14">
        <div className="page-container grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h2 id="nexo-title" className="wide text-[clamp(1.6rem,1.1rem+1.6vw,2.6rem)] leading-[1.05] lg:col-span-6">
            {servicesIntro.title}
          </h2>
          <p className="max-w-copy font-serif text-small text-slate lg:col-span-5 lg:col-start-8">
            {servicesIntro.body}
          </p>
        </div>
      </div>
    </section>
  );
}
