"use client";

import { useRef } from "react";
import { services, servicesIntro } from "@/content/home";
import { gsap, MOTION, useGSAP } from "@/lib/motion";
import { Reveal, RevealText } from "@/components/ui/Reveal";
import { ServicePanel } from "./ServicePanel";

/**
 * Servicios. En escritorio la sección se fija y los paneles se recorren en
 * horizontal al hacer scroll; cada panel entra con un leve giro en 3D. En
 * móvil y tableta se apilan en vertical.
 */
export function Services() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.desktop, () => {
        const el = track.current;
        if (!el) return;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: "[data-services-pin]",
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.6,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
        // Cada panel gira hacia el espectador al entrar en escena
        gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
          gsap.fromTo(
            panel,
            { rotateY: -14, z: -120, autoAlpha: 0.35 },
            {
              rotateY: 0,
              z: 0,
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left 100%",
                end: "left 55%",
                scrub: true,
              },
            },
          );
        });
      });
      mm.add(MOTION.mobile, () => {
        gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
          gsap.fromTo(
            panel,
            { y: 48, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.9,
              ease: "expo.out",
              scrollTrigger: { trigger: panel, start: "top 88%", once: true },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="servicios" aria-labelledby="servicios-title" className="relative">
      <div data-services-pin className="lg:flex lg:h-svh lg:items-center lg:overflow-hidden">
        <div
          ref={track}
          className="flex flex-col gap-6 px-gutter py-section will-change-transform lg:flex-row lg:items-stretch lg:gap-8 lg:py-0 lg:[perspective:1600px]"
        >
          <Reveal className="flex flex-col justify-center lg:w-[min(36vw,34rem)] lg:shrink-0 lg:pr-10">
            <RevealText id="servicios-title" text={servicesIntro.title} className="text-h2" />
            <p data-reveal className="mt-6 max-w-copy text-lead text-muted">
              {servicesIntro.body}
            </p>
            <p data-reveal aria-hidden="true" className="mt-10 hidden items-center gap-3 text-micro text-muted lg:flex">
              <span className="h-px w-12 bg-[linear-gradient(90deg,transparent,#22e3ff)]" />
              Sigue bajando para recorrerlos
            </p>
          </Reveal>

          {services.map((service, i) => (
            <div key={service.id} data-panel className="lg:h-[min(78svh,46rem)] lg:w-[min(44vw,40rem)] lg:shrink-0">
              <ServicePanel service={service} index={i} />
            </div>
          ))}
          <div aria-hidden="true" className="hidden w-[8vw] shrink-0 lg:block" />
        </div>
      </div>
    </section>
  );
}
