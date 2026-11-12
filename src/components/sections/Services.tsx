import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { href } from "@/config/site";
import { services, servicesIntro } from "@/content/home";
import { serviceRenders } from "@/components/visuals/renders";

/**
 * Servicios. La sección entra como una hoja clara que se desliza sobre el
 * escaparate oscuro. En móvil, las tarjetas se deslizan en horizontal.
 */
export function Services() {
  return (
    <section
      id="servicios"
      aria-labelledby="servicios-title"
      className="relative z-10 -mt-[14svh] rounded-t-[2rem] bg-paper pt-20 pb-section shadow-[0_-40px_80px_-30px_rgb(0_0_0/0.65)] sm:rounded-t-[3rem] lg:pt-28"
    >
      <div className="page-container">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p data-reveal className="kicker text-muted">
              {servicesIntro.kicker}
            </p>
            <h2 id="servicios-title" data-split className="mt-4 text-h2">
              {servicesIntro.title}
            </h2>
          </div>
          <p data-reveal className="font-mono text-micro text-muted lg:hidden">
            Desliza para ver los tres →
          </p>
        </header>
      </div>

      <div className="page-container mt-10 lg:mt-16">
        <ul className="-mx-gutter flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-6 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {services.map((service) => (
            <li
              key={service.id}
              data-reveal
              data-tilt
              className="service-card group relative flex w-[84%] max-w-[24rem] shrink-0 snap-center flex-col overflow-hidden rounded-panel border border-line bg-card shadow-soft transition-shadow duration-500 ease-out sm:w-[60%] lg:w-auto lg:max-w-none lg:hover:shadow-float"
            >
              <div
                data-clip
                className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff_0%,var(--color-paper-2)_70%)]"
              >
                <Image
                  src={serviceRenders[service.id]}
                  alt=""
                  data-tilt-depth
                  sizes="(min-width: 1024px) 30vw, 84vw"
                  className="relative size-full object-contain"
                />
                <span className="absolute top-4 left-5 font-mono text-micro text-muted">{service.index}</span>
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="text-h3">{service.title}</h3>
                <p className="mt-3 text-small text-muted sm:text-body">{service.body}</p>
                <a
                  href={href("/#contacto")}
                  data-project-type={service.id}
                  className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-small font-semibold"
                >
                  <span className="link-grow">{service.cta}</span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 text-accent-ink transition-transform duration-300 ease-out group-hover:translate-x-1"
                  />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
