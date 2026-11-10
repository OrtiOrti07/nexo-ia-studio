import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { LogoMark } from "@/components/ui/Logo";
import { contactAnchor, href } from "@/config/site";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <SiteShell>
      <section className="page-container flex min-h-[80svh] flex-col justify-center pt-32 pb-section">
        <LogoMark className="size-16" />
        <h1 className="mt-8 max-w-[18ch] text-h2">Esta señal no lleva a ninguna parte</h1>
        <p className="mt-6 max-w-copy text-lead text-muted">
          La página no existe o ha cambiado de dirección. Vuelve al inicio o cuéntanos qué buscabas.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <MagneticLink href={href("/")} size="lg">
            Volver al inicio
            <ArrowRight aria-hidden="true" className="size-4" />
          </MagneticLink>
          <MagneticLink href={contactAnchor} variant="ghost" size="lg">
            Escríbenos
          </MagneticLink>
        </div>
      </section>
    </SiteShell>
  );
}
