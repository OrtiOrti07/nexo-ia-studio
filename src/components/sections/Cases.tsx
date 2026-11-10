import { cases, casesIntro } from "@/content/home";
import { CaseVisual } from "@/components/visuals/CaseVisual";
import { Reveal, RevealText } from "@/components/ui/Reveal";

/**
 * Proyectos de demostración en composición editorial: la interfaz del caso en
 * grande y, al lado, el reto y la solución. Alternan de lado.
 */
export function Cases() {
  return (
    <section id="proyectos" aria-labelledby="proyectos-title" className="relative py-section">
      <div className="page-container">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <RevealText id="proyectos-title" text={casesIntro.title} className="text-h2 lg:col-span-7" />
          <p className="max-w-copy text-lead text-muted lg:col-span-5">{casesIntro.body}</p>
        </div>

        <ol className="mt-16 flex flex-col gap-20 lg:mt-24 lg:gap-32">
          {cases.map((item, i) => (
            <li key={item.id}>
              <Reveal
                as="article"
                className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
              >
                <div
                  data-reveal
                  className={`group relative lg:col-span-7 ${i % 2 === 1 ? "lg:order-2 lg:col-start-6" : ""}`}
                >
                  {/* Halo de luz detrás de la interfaz */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(60%_60%_at_50%_50%,rgb(59_130_255/0.18),transparent_70%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="relative transition-transform duration-500 ease-out group-hover:-translate-y-1">
                    <CaseVisual kind={item.visual} />
                  </div>
                </div>

                <div data-reveal className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-1 lg:col-start-1" : ""}`}>
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-micro">
                    <span className="rounded-pill border border-cyan/40 px-2.5 py-1 font-mono text-cyan">
                      {item.label} · Proyecto conceptual
                    </span>
                    <span className="text-muted">{item.area}</span>
                  </p>
                  <h3 className="mt-5 text-h3">{item.title}</h3>
                  <dl className="mt-6 space-y-5">
                    <div>
                      <dt className="text-micro font-semibold text-text">El reto</dt>
                      <dd className="mt-1 text-body text-muted">{item.problem}</dd>
                    </div>
                    <div>
                      <dt className="text-micro font-semibold text-text">Cómo lo resolveríamos</dt>
                      <dd className="mt-1 text-body text-muted">{item.solution}</dd>
                    </div>
                  </dl>
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tecnologías">
                    {item.stack.map((tech) => (
                      <li key={tech} className="rounded-pill bg-white/[0.05] px-3 py-1.5 text-micro text-text/80">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
