import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { contactAnchor, href, navigation, site, socials } from "@/config/site";
import { legalPages } from "@/config/legal";
import { services } from "@/content/home";
import { Logo } from "@/components/ui/Logo";
import { CurrentYear } from "./CurrentYear";

const linkClass =
  "inline-flex min-h-11 items-center text-small text-muted transition-colors duration-200 hover:text-text";

export function SiteFooter() {
  const activeSocials = socials.filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <footer className="relative z-10 border-t border-white/8 bg-bg">
      <div className="page-container grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <a href={href("/#inicio")} className="inline-flex rounded-md">
            <Logo />
          </a>
          <p className="mt-5 max-w-[22rem] text-small text-muted">
            Consultoría de inteligencia artificial para empresas: estrategia, agentes, automatización y asistentes a
            medida.
          </p>
          <a
            href={contactAnchor}
            className="group mt-6 inline-flex min-h-11 items-center gap-2 text-small font-semibold text-text"
          >
            Transforma tu negocio
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 text-cyan transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>

        <nav aria-label="Pie de página" className="md:col-span-2">
          <p className="font-mono text-micro text-muted">Navegación</p>
          <ul className="mt-3">
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={linkClass}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="font-mono text-micro text-muted">Servicios</p>
          <ul className="mt-3">
            {services.map((service) => (
              <li key={service.id}>
                <a href={href("/#servicios")} className={linkClass}>
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="font-mono text-micro text-muted">Contacto</p>
          <ul className="mt-3">
            <li>
              <a href={`mailto:${site.email}`} className={`${linkClass} gap-2 break-all`}>
                <Mail aria-hidden="true" className="size-4 shrink-0 text-cyan" />
                {site.email}
              </a>
            </li>
            <li>
              <a href={`tel:${site.phone.href}`} className={`${linkClass} gap-2`}>
                <Phone aria-hidden="true" className="size-4 shrink-0 text-cyan" />
                {site.phone.display}
              </a>
            </li>
          </ul>
          {activeSocials.length > 0 && (
            <>
              <p className="mt-6 font-mono text-micro text-muted">Redes</p>
              <ul className="mt-2 flex flex-wrap gap-x-5">
                {activeSocials.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="page-container flex flex-col gap-2 py-6 text-micro text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {site.name}
          </p>
          <nav aria-label="Información legal">
            <ul className="flex gap-6">
              {legalPages.map((page) => (
                <li key={page.href}>
                  <a href={page.href} className="inline-flex min-h-11 items-center transition-colors hover:text-text">
                    {page.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
