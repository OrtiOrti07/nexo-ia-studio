import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { ButtonLink } from "@/components/ui/Button";
import { OrbitGlyph } from "@/components/ui/OrbitGlyph";
import { contactAnchor, href } from "@/config/site";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <SiteShell>
      <section className="page-container flex min-h-[80svh] flex-col justify-center pt-32 pb-section">
        <OrbitGlyph active={2} className="size-24" />
        <h1 className="wide mt-8 max-w-[40rem] text-h2">Esta página se ha salido de órbita</h1>
        <p className="mt-6 max-w-copy font-serif text-lead text-slate">
          No existe o ha cambiado de dirección. Vuelve al inicio o cuéntanos qué buscabas.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={href("/")} variant="primary" size="lg">
            Volver al inicio
          </ButtonLink>
          <ButtonLink href={contactAnchor} variant="outline" size="lg">
            Escríbenos
          </ButtonLink>
        </div>
      </section>
    </SiteShell>
  );
}
