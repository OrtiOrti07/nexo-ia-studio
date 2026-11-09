import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

type SiteShellProps = {
  /** true en la portada: la cabecera arranca transparente sobre el hero. */
  overlay?: boolean;
  children: ReactNode;
};

/** Estructura común de todas las páginas: salto al contenido, cabecera, main y pie. */
export function SiteShell({ overlay = false, children }: SiteShellProps) {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader overlay={overlay} />
      <main id="contenido" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter />
      <SmoothScroll />
    </>
  );
}
