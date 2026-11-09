"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import { gsap, MOTION, useGSAP } from "@/lib/motion";

type ParallaxPhotoProps = {
  src: StaticImageData;
  /** Desplazamiento vertical máximo, en % de la altura de la foto. */
  amount?: number;
  className?: string;
  imageClassName?: string;
  sizes?: string;
};

/**
 * Foto de fondo que se desplaza más despacio que la página. Ocupa su
 * contenedor (que debe tener position: relative y overflow: hidden).
 */
export function ParallaxPhoto({
  src,
  amount = 10,
  className = "",
  imageClassName = "object-cover",
  sizes = "100vw",
}: ParallaxPhotoProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.any, () => {
        gsap.fromTo(
          "[data-parallax]",
          { yPercent: -amount, scale: 1.08 },
          {
            yPercent: amount,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className={`absolute inset-0 overflow-hidden ${className}`}>
      <div data-parallax className="absolute inset-x-0 -inset-y-[14%]">
        <Image src={src} alt="" fill sizes={sizes} placeholder="blur" className={imageClassName} />
      </div>
    </div>
  );
}
