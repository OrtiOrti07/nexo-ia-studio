import { Plus } from "lucide-react";
import { contactAnchor } from "@/config/site";
import { faqIntro, faqs } from "@/content/home";

/** Preguntas frecuentes con <details>: accesibles y funcionan sin JavaScript. */
export function Faq() {
  return (
    <section id="preguntas" aria-labelledby="preguntas-title" className="relative border-t border-line py-section">
      <div className="page-container grid gap-10 lg:grid-cols-12 lg:gap-8">
        <header className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p data-reveal className="kicker text-muted">
              {faqIntro.kicker}
            </p>
            <h2 id="preguntas-title" data-split className="mt-4 text-h2">
              {faqIntro.title}
            </h2>
            <a
              data-reveal
              href={contactAnchor}
              className="mt-6 inline-flex min-h-11 items-center text-small font-semibold text-ink"
            >
              <span className="link-grow">¿Otra duda? Escríbeme</span>
            </a>
          </div>
        </header>

        <div className="faq-list lg:col-span-7 lg:col-start-6">
          {faqs.map((faq) => (
            <details key={faq.q} data-reveal className="faq group border-b border-line first:border-t">
              <summary className="flex min-h-11 items-center justify-between gap-5 py-5 text-left sm:py-6">
                <h3 className="font-display text-[1.15rem] leading-snug font-semibold tracking-[-0.01em] [font-variation-settings:'opsz'_24,'wdth'_100] sm:text-[1.375rem]">
                  {faq.q}
                </h3>
                <span
                  aria-hidden="true"
                  className="faq-icon grid size-10 shrink-0 place-items-center rounded-full border border-line-strong bg-card transition-colors duration-200 group-open:border-accent group-open:bg-accent group-open:text-white"
                >
                  <Plus className="size-4" />
                </span>
              </summary>
              <p className="max-w-[40rem] pb-6 text-body text-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
