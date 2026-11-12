import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { Motion } from "@/components/motion/Motion";

/** Estructura común: salto al contenido, cabecera, contenido, pie y coreografía de animaciones. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido" tabIndex={-1} className="relative outline-none">
        {children}
      </main>
      <SiteFooter />
      <Motion />
    </>
  );
}
