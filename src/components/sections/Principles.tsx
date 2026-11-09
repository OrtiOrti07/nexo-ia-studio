"use client";

import { useRef } from "react";
import { principles } from "@/content/home";
import { gsap, MOTION, useGSAP } from "@/lib/motion";

/**
 * Criterio: la frase principal se "ilumina" palabra a palabra al hacer scroll.
 * Sin movimiento (o sin JavaScript) se lee completa desde el principio.
 */
export function Principles() {
  const root = useRef<HTMLElement>(null);
  const words = principles.title.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.any, () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: "[data-statement]", start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
        gsap.fromTo(
          "[data-principle]",
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            ease: "none",
            scrollTrigger: { trigger: "[data-principles]", start: "top 85%", end: "top 50%", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-header-theme="dark" aria-labelledby="criterio-title" className="on-dark bg-night py-section text-white">
      <div className="page-container">
        <h2
          id="criterio-title"
          data-statement
          aria-label={principles.title}
          className="wide max-w-[18ch] text-[clamp(2.4rem,1rem+5vw,6.5rem)] leading-[0.98] font-[680] tracking-[-0.04em]"
        >
          {words.map((word, i) => (
            <span key={i} aria-hidden="true">
              <span data-word className="inline-block">
                {word}
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </h2>
        <p className="mt-8 max-w-copy font-serif text-lead text-mist">{principles.body}</p>

        <ul data-principles className="mt-16 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {principles.items.map((item) => (
            <li key={item.title} data-principle className="border-t border-white/20 pt-6">
              <h3 className="flex items-center gap-3 text-[1.1875rem] font-semibold">
                <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-amber" />
                {item.title}
              </h3>
              <p className="mt-3 font-serif text-small text-mist">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
