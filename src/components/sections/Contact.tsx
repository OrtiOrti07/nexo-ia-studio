import { Mail, Phone } from "lucide-react";
import { site } from "@/config/site";
import { contactIntro } from "@/content/home";
import { ContactForm } from "@/components/contact/ContactForm";
import { isDeliveryConfigured } from "@/lib/contact/deliver";
import { Reveal, RevealText } from "@/components/ui/Reveal";

export function Contact() {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="relative py-section">
      <div className="page-container grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <RevealText id="contacto-title" text={contactIntro.title} className="text-h2" />
          <Reveal>
            <p data-reveal className="mt-6 max-w-copy text-lead text-muted">
              {contactIntro.body}
            </p>

            <h3 data-reveal className="mt-12 text-small font-semibold text-text">
              Qué pasa después
            </h3>
            <ol className="mt-5 space-y-5">
              {contactIntro.nextSteps.map((step, i) => (
                <li data-reveal key={step} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center rounded-full border border-white/15 font-mono text-micro text-cyan"
                  >
                    {i + 1}
                  </span>
                  <span className="pt-1 text-small text-muted">{step}</span>
                </li>
              ))}
            </ol>

            <ul data-reveal className="mt-12 space-y-1">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="group inline-flex min-h-11 items-center gap-3 text-[1.0625rem] font-semibold break-all text-text"
                >
                  <Mail aria-hidden="true" className="size-5 shrink-0 text-cyan" />
                  <span className="bg-[linear-gradient(90deg,#3b82ff,#22e3ff)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                    {site.email}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phone.href}`}
                  className="group inline-flex min-h-11 items-center gap-3 text-[1.0625rem] font-semibold text-text"
                >
                  <Phone aria-hidden="true" className="size-5 shrink-0 text-cyan" />
                  <span className="bg-[linear-gradient(90deg,#3b82ff,#22e3ff)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                    {site.phone.display}
                  </span>
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7">
          <div data-reveal className="rounded-panel border border-white/10 bg-graphite/92 p-6 shadow-[0_40px_120px_-40px_rgb(59_130_255/0.35)] backdrop-blur-xl sm:p-10">
            <ContactForm deliveryConfigured={isDeliveryConfigured()} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
