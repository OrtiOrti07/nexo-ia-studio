"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import { services, servicesHeading } from "@/content/home";
import { gsap, MOTION, useGSAP } from "@/lib/motion";
import consultoria from "@/assets/photos/consultoria.jpg";
import automatizacion from "@/assets/photos/automatizacion.jpg";
import web from "@/assets/photos/web.jpg";

const PHOTOS: Record<string, StaticImageData> = { consultoria, automatizacion, webs: web };

/**
 * Servicios en filas: una franja de foto con el nombre del servicio en grande y,
 * al lado, qué incluye. Al entrar en pantalla la franja se abre desde el centro
 * y la foto se desplaza más despacio que la página (parallax).
 */
export function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.any, () => {
        gsap.utils.toArray<HTMLElement>("[data-service]").forEach((row) => {
          const strip = row.querySelector("[data-strip]");
          const photo = row.querySelector("[data-photo]");
          const word = row.querySelector("[data-word]");
          const details = row.querySelector("[data-details]");

          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: row, start: "top 88%", end: "top 38%", scrub: true },
            })
            .fromTo(strip, { clipPath: "inset(42% 0% 42% 0% round 18px)" }, { clipPath: "inset(0% 0% 0% 0% round 18px)", duration: 1 }, 0)
            .fromTo(word, { xPercent: -8, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.7 }, 0.3)
            .fromTo(details, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, 0.4);

          gsap.fromTo(
            photo,
            { yPercent: -9 },
            {
              yPercent: 9,
              ease: "none",
              scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="servicios"
      data-header-theme="dark"
      aria-labelledby="servicios-title"
      className="on-dark bg-night py-section text-white"
    >
      <div className="page-container">
        <header className="mx-auto max-w-[44rem] text-center">
          <h2 id="servicios-title" className="wide text-h2">
            {servicesHeading.title}
          </h2>
          <p className="mt-5 font-serif text-body text-mist">{servicesHeading.body}</p>
        </header>

        <ul className="mt-16 lg:mt-24">
          {services.map((service) => (
            <li
              key={service.id}
              data-service
              className="grid gap-6 border-t border-white/12 py-8 last:border-b lg:grid-cols-12 lg:gap-10 lg:py-10"
            >
              <div
                data-strip
                className="group relative order-1 h-[clamp(12rem,24vw,21rem)] overflow-hidden rounded-[18px] lg:order-2 lg:col-span-8"
              >
                <div data-photo className="absolute inset-x-0 -inset-y-[12%]">
                  <Image
                    src={PHOTOS[service.id]}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 62vw, 100vw"
                    placeholder="blur"
                    className="object-cover transition-transform duration-700 ease-out-quint group-hover:scale-[1.04]"
                  />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,11,31,0.78)_0%,rgba(7,11,31,0.35)_55%,rgba(7,11,31,0.15)_100%)]" />
                <p className="absolute top-5 left-6 text-micro font-medium text-white/80 lg:left-8">
                  Órbita: {service.layerLabel}
                </p>
                <h3
                  data-word
                  className="wide absolute bottom-4 left-5 text-[clamp(2.3rem,0.9rem+4.6vw,6rem)] leading-[0.95] font-[680] tracking-[-0.035em] lg:bottom-6 lg:left-8"
                >
                  {service.title}
                </h3>
              </div>

              <div data-details className="order-2 lg:order-1 lg:col-span-4 lg:pt-2">
                <p className="font-serif text-body text-white/90">{service.lead}</p>
                <p className="sr-only">Incluye:</p>
                <ul className="mt-6 space-y-2.5">
                  {service.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.9375rem] leading-snug text-white/80">
                      <span aria-hidden="true" className="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-amber" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-l-2 border-amber pl-4 font-serif text-small text-mist">
                  {service.forWhom}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
