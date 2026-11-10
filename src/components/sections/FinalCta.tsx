import { ArrowRight } from "lucide-react";
import { contactAnchor } from "@/config/site";
import { finalCta } from "@/content/home";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { Reveal, RevealText } from "@/components/ui/Reveal";

/**
 * Llamada final. Detrás, la escena forma un anillo de luz (el "portal") y un
 * degradado cónico gira muy despacio.
 */
export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="relative flex min-h-svh items-center overflow-hidden py-section">
      <div
        aria-hidden="true"
        className="cta-aura pointer-events-none absolute top-1/2 left-1/2 size-[min(90vw,64rem)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
      />
      <div className="page-container relative text-center">
        <RevealText id="cta-title" text={finalCta.title} className="mx-auto max-w-[16ch] text-display" />
        <Reveal className="mx-auto mt-8 flex max-w-[36rem] flex-col items-center">
          <p data-reveal className="text-lead text-muted">
            {finalCta.body}
          </p>
          <div data-reveal className="mt-10">
            <MagneticLink href={contactAnchor} size="lg" strength={14}>
              {finalCta.button}
              <ArrowRight aria-hidden="true" className="size-4" />
            </MagneticLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
