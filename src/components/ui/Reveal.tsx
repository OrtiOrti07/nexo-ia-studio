"use client";

import { Fragment, useRef, type ElementType, type ReactNode } from "react";
import { gsap, MOTION, useGSAP } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Desfase entre los elementos marcados con data-reveal. */
  stagger?: number;
  /** Distancia del desplazamiento de entrada, en px. */
  distance?: number;
};

/**
 * Hace aparecer, de forma progresiva al hacer scroll, los hijos marcados con
 * `data-reveal` (o el bloque entero si no hay ninguno). Sin JavaScript o con
 * movimiento reducido el contenido se ve desde el principio.
 */
export function Reveal({ children, as: Tag = "div", className = "", stagger = 0.08, distance = 36 }: RevealProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.any, () => {
        const el = root.current;
        if (!el) return;
        const marked = el.querySelectorAll("[data-reveal]");
        const targets = marked.length ? Array.from(marked) : [el];
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: distance, filter: "blur(6px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "expo.out",
            stagger,
            scrollTrigger: { trigger: el, start: "top 82%", once: true },
            clearProps: "filter",
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <Tag ref={root} className={className}>
      {children}
    </Tag>
  );
}

type RevealTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
};

/**
 * Titular que se revela palabra a palabra al entrar en pantalla: cada palabra
 * sube desde una máscara. El texto completo queda en el DOM para los lectores
 * de pantalla.
 */
export function RevealText({ text, as: Tag = "h2", className = "", id }: RevealTextProps) {
  const root = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.any, () => {
        gsap.fromTo(
          "[data-word]",
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.045,
            scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <Tag ref={root} id={id} className={className} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span data-word className="inline-block">
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
