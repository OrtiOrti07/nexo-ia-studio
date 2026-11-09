"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { situations, situationsIntro, type Situation } from "@/content/home";
import { SectionIntro } from "./SectionIntro";

function SituationDetail({ item }: { item: Situation }) {
  return (
    <>
      <p className="font-serif text-body text-slate">{item.context}</p>
      <h4 className="mt-8 text-ui font-semibold text-cobalt">Cómo lo abordaríamos</h4>
      <p className="mt-2 font-serif text-lead">{item.approach}</p>
      <ol className="mt-7 space-y-3.5">
        {item.steps.map((step, i) => (
          <li key={step} className="flex gap-4 text-ui leading-snug">
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-full bg-paper text-micro font-bold text-cobalt"
            >
              {i + 1}
            </span>
            <span className="pt-1">{step}</span>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-line pt-6">
        <span className="mr-1 text-micro text-slate">Servicios implicados:</span>
        {item.services.map((service) => (
          <span
            key={service}
            className="rounded-pill border border-cobalt/30 px-3 py-1 text-micro font-medium text-cobalt"
          >
            {service}
          </span>
        ))}
      </div>
    </>
  );
}

export function Situations() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const focusTab = (index: number) => {
    const next = (index + situations.length) % situations.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        focusTab(index + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        focusTab(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(situations.length - 1);
        break;
    }
  };

  const current = situations[active];

  return (
    <section id="situaciones" aria-labelledby="situaciones-title" className="py-section">
      <div className="page-container">
        <SectionIntro
          id="situaciones-title"
          title={situationsIntro.title}
          body={situationsIntro.body}
        />

        {/* Escritorio: pestañas */}
        <div className="mt-16 hidden gap-10 lg:grid lg:grid-cols-12">
          <div
            role="tablist"
            aria-label="Situaciones habituales"
            aria-orientation="vertical"
            className="flex flex-col lg:col-span-5"
          >
            {situations.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabs.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={`group relative flex items-start gap-4 rounded-card px-5 py-5 text-left transition-colors duration-200 ${
                    selected ? "bg-surface" : "hover:bg-surface/60"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`mt-[0.55rem] size-2.5 shrink-0 rounded-full border-[1.5px] transition-colors duration-200 ${
                      selected ? "border-ink bg-amber" : "border-ink/40 bg-transparent"
                    }`}
                  />
                  <span
                    className={`wide text-[1.25rem] leading-snug font-semibold transition-colors duration-200 ${
                      selected ? "text-ink" : "text-ink/65 group-hover:text-ink"
                    }`}
                  >
                    {item.problem}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${current.id}`}
            tabIndex={0}
            className="grid rounded-panel bg-surface p-10 lg:col-span-7 xl:p-14"
          >
            {/* Todas las situaciones ocupan la misma celda: el panel mantiene la
                altura de la más larga y no hay saltos al cambiar de pestaña. */}
            {situations.map((item, index) => (
              <div
                key={item.id}
                className={`[grid-area:1/1] ${index === active ? "panel-swap" : "invisible"}`}
              >
                <h3 className="wide text-h3">{item.problem}</h3>
                <div className="mt-5">
                  <SituationDetail item={item} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Móvil y tableta: lista desplegable */}
        <div className="mt-12 space-y-3 lg:hidden">
          {situations.map((item, index) => (
            <details
              key={item.id}
              className="faq-item group rounded-card bg-surface"
              open={index === 0}
            >
              <summary className="flex cursor-pointer items-start gap-4 px-5 py-5">
                <span
                  aria-hidden="true"
                  className="mt-[0.5rem] size-2.5 shrink-0 rounded-full border-[1.5px] border-ink/50 group-open:border-ink group-open:bg-amber"
                />
                <h3 className="wide flex-1 text-[1.1875rem] leading-snug font-semibold">
                  {item.problem}
                </h3>
                <span aria-hidden="true" className="relative mt-2 size-3.5 shrink-0">
                  <span className="absolute top-1/2 left-0 h-[1.5px] w-full -translate-y-1/2 bg-current" />
                  <span className="faq-icon-v absolute top-0 left-1/2 h-full w-[1.5px] -translate-x-1/2 bg-current" />
                </span>
              </summary>
              <div className="px-5 pt-1 pb-7">
                <SituationDetail item={item} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
