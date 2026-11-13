import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { ButtonLink } from "@/components/ui/Button";
import { contactAnchor, href } from "@/config/site";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <SiteShell>
      <section className="page-container flex min-h-[80svh] flex-col justify-center pt-32 pb-section">
        <p className="kicker text-muted">Error 404</p>
        <h1 className="mt-6 max-w-[16ch] text-h2">Esta página no existe (todavía)</h1>
        <p className="mt-6 max-w-copy text-lead text-muted">
          Puede que el enlace esté mal escrito o que la página haya cambiado de dirección. Vuelve al inicio o
          cuéntame qué buscabas.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={href("/")} size="lg">
            Volver al inicio
            <ArrowRight aria-hidden="true" className="size-4" />
          </ButtonLink>
          <ButtonLink href={contactAnchor} variant="outline" size="lg">
            Escríbeme
          </ButtonLink>
        </div>
      </section>
    </SiteShell>
  );
}
