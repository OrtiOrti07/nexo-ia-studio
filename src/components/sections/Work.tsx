import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { contactAnchor } from "@/config/site";
import { concepts, workIntro } from "@/content/home";
import { conceptRenders } from "@/components/visuals/renders";

export function Work() {
  return (
    <section id="trabajos" aria-labelledby="trabajos-title" className="relative overflow-clip py-section">
      <div className="page-container">
        <header className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <p data-reveal className="kicker text-muted">
              {workIntro.kicker}
            </p>
            <h2 id="trabajos-title" data-split className="mt-4 text-h2">
              {workIntro.title}
            </h2>
          </div>
          <p data-reveal className="max-w-copy text-body text-muted lg:col-span-5">
            {workIntro.body}
          </p>
        </header>

        <div className="mt-12 space-y-16 sm:space-y-24 lg:mt-20 lg:space-y-28">
          {concepts.map((concept, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={concept.id}
                aria-labelledby={`concepto-${concept.id}`}
                className="grid items-center gap-6 lg:grid-cols-12 lg:gap-8"
              >
                <div data-parallax="6" className={`relative lg:col-span-7 ${flip ? "lg:order-2 lg:col-start-6" : ""}`}>
                  <div data-clip className="group">
                    <Image
                      src={conceptRenders[concept.id]}
                      alt={`Concepto de web para ${concept.sector.toLowerCase()} (marca ficticia «${concept.brand}») en portátil y móvil`}
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="w-full"
                    />
                  </div>
                  <span
                    className={`absolute top-1 rounded-pill bg-ink px-3 py-1.5 font-mono text-[0.75rem] text-paper shadow-[0_10px_24px_-12px_rgb(11_16_32/0.6)] ${flip ? "right-0" : "left-0"}`}
                  >
                    {workIntro.label}
                  </span>
                </div>

                <div data-reveal className={`lg:col-span-4 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-9"}`}>
                  <p className="font-mono text-micro text-muted">
                    <span className="text-accent-ink">{concept.index}</span> / {concept.sector} · {concept.brand}
                  </p>
                  <h3 id={`concepto-${concept.id}`} className="mt-3 text-h3">
                    {concept.title}
                  </h3>
                  <p className="mt-3 text-body text-muted">{concept.body}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div
          data-reveal
          className="mt-20 flex flex-col items-start gap-6 rounded-panel bg-ink p-7 text-paper sm:p-10 lg:flex-row lg:items-center lg:justify-between"
        >
          <p className="max-w-[34rem] font-display text-[1.5rem] leading-tight font-bold tracking-[-0.02em] sm:text-[1.75rem]">
            ¿Cómo sería la de tu empresa?
          </p>
          <a href={contactAnchor} data-magnetic className="btn btn-primary btn-lg max-sm:w-full">
            Cuéntame tu proyecto
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
