import { site } from "@/config/site";
import { contactIntro } from "@/content/home";
import { ContactForm } from "@/components/contact/ContactForm";
import { isDeliveryConfigured } from "@/lib/contact/deliver";
import { ParallaxPhoto } from "@/components/motion/ParallaxPhoto";
import sunset from "@/assets/photos/cierre-sol-nubes.jpg";

export function Contact() {
  return (
    <section
      id="contacto"
      data-header-theme="dark"
      aria-labelledby="contacto-title"
      className="on-dark relative isolate overflow-hidden bg-night py-section text-white"
    >
      {/* Cierre: sol sobre el mar de nubes, el mismo cielo del principio */}
      <ParallaxPhoto src={sunset} imageClassName="object-cover object-[50%_40%]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,11,31,0.86)_0%,rgba(7,11,31,0.62)_45%,rgba(7,11,31,0.25)_100%)]"
      />
      <div className="page-container relative grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 id="contacto-title" className="wide text-h2">
            {contactIntro.title}
          </h2>
          <p className="mt-6 max-w-copy font-serif text-lead text-white/85">{contactIntro.body}</p>

          <h3 className="mt-12 text-ui font-semibold text-amber">Qué pasa después</h3>
          <ol className="mt-5 space-y-5">
            {contactIntro.nextSteps.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="grid size-8 shrink-0 place-items-center rounded-full border border-white/40 text-micro font-bold"
                >
                  {i + 1}
                </span>
                <span className="pt-1 font-serif text-small text-white/90">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-12">
            <p className="font-serif text-small text-mist">¿Prefieres llamar o escribir directamente?</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={`tel:${site.phone.href}`}
                  className="wide text-[1.25rem] font-semibold text-white underline decoration-amber decoration-2 underline-offset-4 hover:text-amber"
                >
                  {site.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="wide text-[1.25rem] font-semibold break-all text-white underline decoration-amber decoration-2 underline-offset-4 hover:text-amber"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="on-paper rounded-panel bg-surface p-6 text-ink shadow-[0_40px_80px_-40px_rgba(6,14,70,0.55)] sm:p-10 lg:col-span-7 lg:p-12">
          <ContactForm deliveryConfigured={isDeliveryConfigured()} />
        </div>
      </div>
    </section>
  );
}
