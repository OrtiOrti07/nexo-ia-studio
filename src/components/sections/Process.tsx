"use client";

import { useRef, useState, type CSSProperties } from "react";
import { PackageCheck } from "lucide-react";
import { processIntro, processSteps } from "@/content/home";
import { gsap, MOTION, ScrollTrigger, useGSAP } from "@/lib/motion";
import { sceneState } from "@/components/scene/sceneStore";
import { RevealText } from "@/components/ui/Reveal";

/** Posición x de cada nodo en la escena 3D (ver formations.ts, formación "señal"). */
const NODE_X = [-3.6, -1.8, 0, 1.8, 3.6];

/**
 * Método. En escritorio la sección se fija y el scroll avanza paso a paso: el
 * nodo activo se ilumina en la escena 3D, en la línea de progreso y en el texto.
 * En móvil es una línea de tiempo vertical.
 */
export function Process() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useGSAP(
    () => {
      const select = (index: number) => {
        if (index === activeRef.current) return;
        activeRef.current = index;
        sceneState.focusX = NODE_X[index];
        setActive(index);
      };
      sceneState.focusX = NODE_X[0];

      const mm = gsap.matchMedia();
      mm.add(MOTION.desktop, () => {
        ScrollTrigger.create({
          trigger: "[data-process-pin]",
          start: "top top",
          end: () => `+=${window.innerHeight * 3.2}`,
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            gsap.set("[data-progress]", { scaleX: self.progress });
            select(Math.min(processSteps.length - 1, Math.floor(self.progress * processSteps.length)));
          },
        });
      });
      mm.add(MOTION.mobile, () => {
        gsap.fromTo(
          "[data-progress-v]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-steps-v]", start: "top 70%", end: "bottom 60%", scrub: true },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-step-v]").forEach((step, i) => {
          ScrollTrigger.create({ trigger: step, start: "top 65%", onEnter: () => select(i), onEnterBack: () => select(i) });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="metodo" aria-labelledby="metodo-title" className="relative">
      <div data-process-pin className="relative lg:h-svh">
        <div className="page-container py-section lg:pt-28 lg:pb-0">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
            <RevealText id="metodo-title" text={processIntro.title} className="text-h2 lg:col-span-6" />
            <p className="max-w-copy text-lead text-muted lg:col-span-5 lg:col-start-8">{processIntro.body}</p>
          </div>
        </div>

        {/* Escritorio: raíl alineado con los nodos de la escena 3D */}
        <div aria-hidden="true" className="absolute inset-x-0 top-[59%] hidden lg:block">
          <div className="relative h-px bg-white/10">
            <div
              data-progress
              className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-[linear-gradient(90deg,#3b82ff,#8b5cff,#22e3ff)]"
            />
          </div>
          {processSteps.map((step, i) => (
            <div
              key={step.title}
              className="absolute top-0 -translate-x-1/2 text-center"
              style={{ left: `calc(50% + ${i - 2} * min(33.6vh, 21.7vw))` } as CSSProperties}
            >
              <span
                className={`mx-auto block size-3 -translate-y-1/2 rounded-full border transition-all duration-500 ${
                  i <= active
                    ? "border-cyan bg-cyan shadow-[0_0_18px_4px_rgb(34_227_255/0.55)]"
                    : "border-white/30 bg-bg"
                }`}
              />
              <span
                className={`mt-3 block font-mono text-micro transition-colors duration-500 ${
                  i === active ? "text-text" : "text-muted"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>

        {/* Escritorio: detalle del paso activo */}
        <div className="page-container absolute inset-x-0 bottom-[7svh] hidden lg:block">
          {/* Versión visual; los lectores de pantalla leen la lista completa de abajo */}
          <div className="relative min-h-[12rem] max-w-[44rem]" aria-hidden="true">
            {processSteps.map((step, i) => (
              <article
                key={step.title}
                className={`absolute inset-x-0 bottom-0 transition-[opacity,transform,filter] duration-500 ease-out ${
                  i === active ? "translate-y-0 opacity-100 blur-0" : "pointer-events-none translate-y-4 opacity-0 blur-sm"
                }`}
              >
                <h3 className="text-h3">
                  <span className="mr-3 font-mono text-[0.6em] text-cyan">{String(i + 1).padStart(2, "0")}</span>
                  {step.title}
                </h3>
                <p className="mt-3 text-body text-muted">{step.body}</p>
                <p className="mt-4 inline-flex items-center gap-2 text-small text-text">
                  <PackageCheck aria-hidden="true" className="size-4 text-cyan" />
                  Recibes: {step.output}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Móvil y tableta: línea de tiempo vertical (en escritorio, solo para lectores de pantalla) */}
        <div data-steps-v className="page-container relative pb-section lg:sr-only">
          <span aria-hidden="true" className="absolute top-2 bottom-0 left-[calc(var(--spacing-gutter)+5px)] w-px bg-white/10" />
          <span
            aria-hidden="true"
            data-progress-v
            className="absolute top-2 bottom-0 left-[calc(var(--spacing-gutter)+5px)] w-px origin-top bg-[linear-gradient(180deg,#3b82ff,#8b5cff,#22e3ff)]"
          />
          <ol>
          {processSteps.map((step, i) => (
            <li key={step.title} data-step-v className="relative pb-12 pl-10 last:pb-0">
              <span
                aria-hidden="true"
                className={`absolute top-1.5 left-0 size-[11px] rounded-full border transition-all duration-500 ${
                  i <= active ? "border-cyan bg-cyan shadow-[0_0_14px_3px_rgb(34_227_255/0.5)]" : "border-white/30 bg-bg"
                }`}
              />
              <h3 className="text-h3">
                <span className="mr-2 font-mono text-[0.6em] text-cyan">{String(i + 1).padStart(2, "0")}</span>
                {step.title}
              </h3>
              <p className="mt-3 text-body text-muted">{step.body}</p>
              <p className="mt-3 inline-flex items-start gap-2 text-small text-text">
                <PackageCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-cyan" />
                Recibes: {step.output}
              </p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
