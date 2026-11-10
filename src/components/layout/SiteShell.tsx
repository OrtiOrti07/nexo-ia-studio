import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

/** Estructura común: salto al contenido, cabecera, contenido, pie y scroll suave. */
export function SiteShell({ children, background }: { children: ReactNode; background?: ReactNode }) {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      {background}
      <SiteHeader />
      <main id="contenido" tabIndex={-1} className="relative z-10 outline-none">
        {children}
      </main>
      <SiteFooter />
      <SmoothScroll />
    </>
  );
}
