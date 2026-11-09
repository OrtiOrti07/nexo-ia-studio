"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { processIntro, processSteps } from "@/content/home";
import { gsap, MOTION, useGSAP } from "@/lib/motion";
import arquitectura from "@/assets/photos/arquitectura.jpg";
import { SectionIntro } from "./SectionIntro";

const N = processSteps.length;

/**
 * Método en chevrons: una sola foto repartida entre cinco flechas que apuntan
 * hacia delante, una por fase. Cada flecha muestra su parte de la imagen, de
 * modo que juntas forman la foto completa.
 */
export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.any, () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: "[data-chevrons]", start: "top 85%", end: "top 30%", scrub: true },
          })
          .fromTo(
            "[data-chevron]",
            { autoAlpha: 0, y: 36 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.12 },
            0,
          )
          .fromTo("[data-chevron-photo]", { scale: 1.25 }, { scale: 1, duration: 1 }, 0);

        // Paneo lento de la foto mientras se recorre la sección
        gsap.fromTo(
          "[data-chevron-pan]",
          { xPercent: -3 },
          {
            xPercent: 3,
            ease: "none",
            scrollTrigger: { trigger: "[data-chevrons]", start: "top bottom", end: "bottom top", scrub: true },
          },
        );

        gsap.fromTo(
          "[data-step]",
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: "[data-steps]", start: "top 88%", end: "top 55%", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="metodo" aria-labelledby="metodo-title" className="bg-paper py-section">
      <div className="page-container">
        <SectionIntro id="metodo-title" title={processIntro.title} body={processIntro.body} />

        <div
          data-chevrons
          aria-hidden="true"
          className="relative mt-14 h-[clamp(7rem,17vw,15rem)] lg:mt-20"
          style={{ "--n": N, "--d": "clamp(1.4rem, 4.2vw, 4.25rem)", "--g": "clamp(0.3rem, 0.6vw, 0.6rem)" } as CSSProperties}
        >
          {processSteps.map((step, i) => (
            <div
              key={step.title}
              data-chevron
              className="absolute inset-y-0 overflow-hidden"
              style={{
                width: "calc((100% + (var(--n) - 1) * (var(--d) - var(--g))) / var(--n))",
                left: `calc(${i} * ((100% + (var(--n) - 1) * (var(--d) - var(--g))) / var(--n) - var(--d) + var(--g)))`,
                clipPath:
                  i === 0
                    ? "polygon(0 0, calc(100% - var(--d)) 0, 100% 50%, calc(100% - var(--d)) 100%, 0 100%)"
                    : "polygon(0 0, calc(100% - var(--d)) 0, 100% 50%, calc(100% - var(--d)) 100%, 0 100%, var(--d) 50%)",
              }}
            >
              {/* La foto ocupa el ancho de toda la fila y se desplaza para alinearse */}
              <div
                className="absolute inset-y-0"
                style={{
                  width: "calc(var(--n) * 100% - (var(--n) - 1) * (var(--d) - var(--g)))",
                  left: `calc(${-i} * (100% - var(--d) + var(--g)))`,
                }}
              >
                <div data-chevron-pan className="absolute -inset-x-[4%] inset-y-0">
                  <div data-chevron-photo className="absolute inset-0">
                    <Image
                      src={arquitectura}
                      alt=""
                      fill
                      sizes="100vw"
                      placeholder="blur"
                      className="object-cover object-[50%_60%]"
                    />
                  </div>
                </div>
              </div>
              <span
                className={`wide absolute bottom-3 text-[clamp(1.1rem,0.6rem+1.6vw,2.4rem)] font-bold text-ink/80 ${
                  i === 0 ? "left-4" : "left-[calc(var(--d)+0.6rem)]"
                }`}
              >
                {i + 1}
              </span>
            </div>
          ))}
        </div>

        <ol data-steps className="mt-12 grid gap-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-0">
          {processSteps.map((step, index) => (
            <li key={step.title} data-step className="flex flex-col lg:row-span-3 lg:grid lg:grid-rows-subgrid">
              <h3 className="wide text-[1.3125rem] leading-tight font-semibold">
                <span className="sr-only">Paso {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-3 font-serif text-small text-slate">{step.body}</p>
              <div className="mt-5 rounded-card bg-surface px-4 py-3.5">
                <p className="text-micro font-semibold text-cobalt">Recibes</p>
                <p className="mt-1 font-serif text-small leading-snug">{step.deliverable}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
