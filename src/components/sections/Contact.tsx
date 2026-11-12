import { Mail, Phone } from "lucide-react";
import { site } from "@/config/site";
import { contactIntro } from "@/content/home";
import { ContactForm } from "@/components/contact/ContactForm";

export function Contact() {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="on-ink relative overflow-clip py-section">
      {/* Halo cobalto detrás del formulario */}
      <div
        aria-hidden="true"
        data-parallax="12"
        className="pointer-events-none absolute right-[-15%] bottom-[-10%] size-[min(90vw,60rem)] rounded-full bg-[radial-gradient(circle,rgb(46_91_255/0.26),transparent_62%)]"
      />

      <div className="page-container relative grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p data-reveal className="kicker text-muted-dark">
            {contactIntro.kicker}
          </p>
          <h2 id="contacto-title" data-split className="mt-4 text-h2">
            {contactIntro.title}
          </h2>
          <p data-reveal className="mt-5 max-w-copy text-lead text-muted-dark">
            {contactIntro.body}
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <li data-reveal>
              <a
                href={`mailto:${site.email}`}
                className="flex min-h-14 items-center gap-4 rounded-card border border-ink-3 px-4 py-3 transition-colors duration-200 hover:border-accent-light"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-white">
                  <Mail aria-hidden="true" className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-micro text-muted-dark">Correo</span>
                  <span className="block font-semibold break-all text-paper">{site.email}</span>
                </span>
              </a>
            </li>
            <li data-reveal>
              <a
                href={`tel:${site.phone.href}`}
                className="flex min-h-14 items-center gap-4 rounded-card border border-ink-3 px-4 py-3 transition-colors duration-200 hover:border-accent-light"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-white">
                  <Phone aria-hidden="true" className="size-4" />
                </span>
                <span>
                  <span className="block font-mono text-micro text-muted-dark">Teléfono</span>
                  <span className="block font-semibold text-paper">{site.phone.display}</span>
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div data-reveal className="relative lg:col-span-7 lg:self-start">
          {/* Hojas apiladas detrás del formulario: profundidad sin estorbar al rellenarlo */}
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden translate-x-4 translate-y-4 rotate-[1.6deg] rounded-panel bg-ink-3 sm:block"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden translate-x-2 translate-y-2 rotate-[0.8deg] rounded-panel bg-[#c9d0dc] sm:block"
          />
          <div className="relative rounded-panel bg-paper p-5 text-ink shadow-[0_40px_90px_-30px_rgb(0_0_0/0.7)] [--focus-ring:var(--color-ink)] sm:p-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
