import { contactAnchor } from "@/config/site";
import { faqIntro, faqs } from "@/content/home";

export function Faq() {
  return (
    <section id="preguntas" aria-labelledby="preguntas-title" className="py-section">
      <div className="page-container grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 id="preguntas-title" className="wide text-h2">
              {faqIntro.title}
            </h2>
            <p className="mt-6 font-serif text-body text-slate">
              {faqIntro.aside}{" "}
              <a
                href={contactAnchor}
                className="font-sans font-semibold text-cobalt underline decoration-cobalt/40 decoration-2 underline-offset-4 hover:decoration-cobalt"
              >
                {faqIntro.asideLink}
              </a>
              .
            </p>
          </div>
        </div>

        <div className="border-t border-ink/15 lg:col-span-8">
          {faqs.map((item) => (
            <details key={item.question} className="faq-item border-b border-ink/15">
              <summary className="flex cursor-pointer items-start justify-between gap-6 py-6 text-left">
                <h3 className="text-[1.1875rem] leading-snug font-semibold md:text-[1.3125rem]">
                  {item.question}
                </h3>
                <span
                  aria-hidden="true"
                  className="relative mt-1.5 grid size-7 shrink-0 place-items-center rounded-full border border-ink/25"
                >
                  <span className="absolute h-[1.5px] w-3 bg-current" />
                  <span className="faq-icon-v absolute h-3 w-[1.5px] bg-current" />
                </span>
              </summary>
              <p className="max-w-[44rem] pb-7 font-serif text-body text-slate">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
