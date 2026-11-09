import { href, navigation, site } from "@/config/site";
import { legalPages } from "@/config/legal";
import { BrandMark } from "@/components/ui/OrbitGlyph";
import { CurrentYear } from "./CurrentYear";

export function SiteFooter() {
  return (
    <footer data-header-theme="dark" className="on-dark bg-night text-white">
      <div className="page-container grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <a href={href("/#inicio")} className="inline-flex items-center gap-2.5 rounded-md">
            <BrandMark className="size-9" />
            <span className="wide text-[1.125rem] font-semibold">{site.name}</span>
          </a>
          <p className="mt-5 max-w-[24rem] font-serif text-small text-mist">
            Consultoría de inteligencia artificial, automatización y webs a medida para negocios que
            quieren trabajar mejor.
          </p>
        </div>

        <nav aria-label="Pie de página" className="md:col-span-3">
          <ul className="space-y-3">
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-ui text-white/80 underline-offset-4 hover:text-white hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="text-ui font-semibold">Contacto</p>
          <a
            href={`mailto:${site.email}`}
            className="wide mt-2 inline-block text-[1.25rem] font-semibold break-all text-amber underline-offset-[6px] hover:underline"
          >
            {site.email}
          </a>
          <a
            href={`tel:${site.phone.href}`}
            className="wide mt-2 block text-[1.25rem] font-semibold text-white underline-offset-[6px] hover:underline"
          >
            {site.phone.display}
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="page-container flex flex-col gap-3 py-6 text-micro text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {site.name}
          </p>
          <nav aria-label="Información legal">
            <ul className="flex gap-6">
              {legalPages.map((page) => (
                <li key={page.href}>
                  <a
                    href={page.href}
                    className="text-white/75 underline-offset-4 hover:text-white hover:underline"
                  >
                    {page.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="page-container pb-6 text-[0.8125rem] leading-relaxed text-white/50">
          Fotografías de Jason Leung, Jerry Zhang, Parrish Freeman, Calvin Wise, Compare Fibre y
          Jakub Żerdzicki en{" "}
          <a href="https://unsplash.com" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
            Unsplash
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
