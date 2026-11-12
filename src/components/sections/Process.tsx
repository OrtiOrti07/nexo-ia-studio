"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { processIntro, processSteps } from "@/content/home";
import { processRenders } from "@/components/visuals/renders";

/**
 * Proceso. En escritorio, el render 3D de cada paso acompaña la lectura (el
 * del paso que cruza el centro de la pantalla aparece al frente) y una línea
 * se llena con el scroll. En móvil, los pasos se deslizan en horizontal.
 */
export function Process() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!items?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((item) => io.observe(item));
    return () => io.disconnect();
  }, []);

  return (
    <section id="proceso" aria-labelledby="proceso-title" className="relative border-t border-line bg-paper-2/70 py-section">
      <div className="page-container">
        <header>
          <p data-reveal className="kicker text-muted">
            {processIntro.kicker}
          </p>
          <h2 id="proceso-title" data-split className="mt-4 text-h2">
            {processIntro.title}
          </h2>
        </header>

        {/* Escritorio */}
        <div className="mt-20 hidden gap-8 lg:grid lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="sticky top-[calc(50svh-15rem)]">
              <div aria-hidden="true" className="relative aspect-[100/82]">
                {processRenders.map((img, i) => (
                  <Image
                    key={img.src}
                    src={img}
                    alt=""
                    sizes="45vw"
                    className={`absolute inset-0 size-full object-contain transition-[opacity,scale,translate,filter] duration-700 ease-out ${
                      i === active
                        ? "blur-0 scale-100 opacity-100"
                        : i < active
                          ? "-translate-y-6 scale-[0.94] opacity-0 blur-md"
                          : "translate-y-6 scale-[0.94] opacity-0 blur-md"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-center font-mono text-micro text-muted">
                <span className="text-accent-ink">
                  Paso {active + 1} de {processSteps.length}
                </span>{" "}
                · {processSteps[active].title}
              </p>
            </div>
          </div>

          <ol ref={listRef} data-progress-track className="relative lg:col-span-5 lg:col-start-8">
            <span aria-hidden="true" className="absolute top-6 bottom-6 left-6 w-px bg-line-strong" />
            <span
              aria-hidden="true"
              data-progress
              className="absolute top-6 bottom-6 left-6 w-px origin-top bg-accent"
            />
            {processSteps.map((step, i) => {
              const isActive = i === active;
              return (
                <li
                  key={step.title}
                  data-step={i}
                  aria-current={isActive ? "step" : undefined}
                  className="relative grid grid-cols-[3rem_minmax(0,1fr)] gap-x-6 not-last:mb-[20svh]"
                >
                  <span
                    aria-hidden="true"
                    className={`relative grid size-12 place-items-center rounded-full border font-mono text-micro transition-[background-color,border-color,color,scale] duration-500 ease-out ${
                      isActive ? "scale-110 border-accent bg-accent text-white" : "border-line-strong bg-paper text-muted"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className={`pt-2 transition-opacity duration-500 ${isActive ? "" : "opacity-45"}`}>
                    <h3 className="text-h3">{step.title}</h3>
                    <p className="mt-3 text-lead text-muted">{step.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Móvil: tarjetas que se deslizan */}
        <ol className="-mx-gutter mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-4 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          {processSteps.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              className="w-[80%] max-w-[22rem] shrink-0 snap-center overflow-hidden rounded-panel border border-line bg-card shadow-soft sm:w-[55%]"
            >
              <Image
                src={processRenders[i]}
                alt=""
                sizes="80vw"
                className="aspect-[100/82] w-full bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff_0%,var(--color-paper)_75%)] object-contain"
              />
              <div className="border-t border-line p-5">
                <p className="font-mono text-micro text-accent-ink">Paso {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-h3">{step.title}</h3>
                <p className="mt-2 text-small text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
