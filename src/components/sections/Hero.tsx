import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { contactAnchor, href } from "@/config/site";
import { hero } from "@/content/home";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { ScenePauseButton } from "@/components/scene/SceneLayer";

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

// El titular, partido en líneas para la entrada (cada una sube desde su máscara)
const TITLE_LINES = ["Diseñamos la", "inteligencia que", "mueve tu empresa."];

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative flex min-h-svh flex-col">
      <div className="page-container flex flex-1 flex-col justify-end pt-28 pb-6 lg:justify-center lg:pt-24 lg:pb-16">
        <div className="max-w-[52rem]">
          <p className="hero-in inline-flex items-center gap-2.5 text-small text-muted" style={delay(0)}>
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-cyan" />
            </span>
            Consultoría de IA para empresas
          </p>

          <h1 id="hero-title" className="mt-4 text-display sm:mt-6" aria-label={hero.title}>
            {TITLE_LINES.map((line, i) => (
              <span key={line} aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
                <span className="line-rise block" style={delay(i)}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-in mt-5 max-w-[36rem] text-body text-muted sm:mt-7 sm:text-lead" style={delay(3)}>
            {hero.lead}
          </p>

          <div className="hero-in mt-7 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center" style={delay(4)}>
            <MagneticLink href={contactAnchor} size="lg">
              {hero.primaryCta}
              <ArrowRight aria-hidden="true" className="size-4" />
            </MagneticLink>
            <MagneticLink href={href("/#servicios")} variant="ghost" size="lg">
              {hero.secondaryCta}
            </MagneticLink>
          </div>
        </div>
      </div>

      <div className="page-container flex items-center justify-between pb-6">
        <a
          href={href("/#servicios")}
          className="hero-in group inline-flex min-h-11 items-center gap-3 text-micro text-muted transition-colors hover:text-text"
          style={delay(5)}
        >
          <span aria-hidden="true" className="relative h-10 w-px overflow-hidden bg-white/15">
            <span className="scroll-drop absolute inset-x-0 top-0 h-1/3 bg-[linear-gradient(180deg,transparent,#22e3ff)]" />
          </span>
          {hero.scrollHint}
        </a>
        <ScenePauseButton className="hero-in" />
      </div>
    </section>
  );
}
