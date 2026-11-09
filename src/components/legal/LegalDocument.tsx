import type { ReactNode } from "react";
import { hasPendingLegalData, legal } from "@/config/legal";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalDocumentProps = {
  title: string;
  intro: ReactNode;
  sections: LegalSection[];
};

/** Muestra un dato del titular o, si falta, una marca visible de "pendiente". */
export function Field({ value, label }: { value: string | null | false; label: string }) {
  if (value) return <>{value}</>;
  return (
    <mark className="rounded-sm bg-amber/35 px-1.5 py-0.5 font-sans text-[0.9em] font-medium text-ink">
      {label} pendiente
    </mark>
  );
}

/** Lista de datos identificativos del titular. */
export function OwnerDetails() {
  const rows: { label: string; value: ReactNode }[] = [
    { label: "Titular", value: <Field value={legal.ownerName} label="Razón social o nombre" /> },
    { label: "NIF", value: <Field value={legal.taxId} label="NIF" /> },
    { label: "Domicilio", value: <Field value={legal.address} label="Domicilio" /> },
    {
      label: "Correo electrónico",
      value: (
        <a href={`mailto:${legal.email}`} className="text-cobalt underline underline-offset-4">
          {legal.email}
        </a>
      ),
    },
    {
      label: "Teléfono",
      value: (
        <a href={`tel:${legal.phone.href}`} className="text-cobalt underline underline-offset-4">
          {legal.phone.display}
        </a>
      ),
    },
  ];
  if (legal.registry !== false) {
    rows.push({
      label: "Datos registrales",
      value: <Field value={legal.registry} label="Inscripción registral" />,
    });
  }

  return (
    <dl className="mt-6 divide-y divide-line overflow-hidden rounded-card bg-surface">
      {rows.map((row) => (
        <div key={row.label} className="grid gap-1 px-5 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
          <dt className="font-sans text-micro font-semibold text-slate sm:pt-0.5">{row.label}</dt>
          <dd className="font-serif text-small">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function LegalDocument({ title, intro, sections }: LegalDocumentProps) {
  const pending = hasPendingLegalData();

  return (
    <article className="page-container pt-32 pb-section lg:pt-40">
      <header className="max-w-[46rem]">
        <h1 className="wide text-h2">{title}</h1>
        <p className="mt-4 text-micro text-slate">Última actualización: {legal.updatedAt}</p>
        <div className="mt-8 font-serif text-lead text-ink/85">{intro}</div>
        {pending && (
          <p
            role="note"
            className="mt-8 rounded-card border border-amber bg-amber/15 px-4 py-3.5 font-serif text-small leading-snug"
          >
            <strong className="font-sans font-semibold">Aviso:</strong> algunos datos del titular
            están pendientes de completar y aparecen marcados en el texto.
          </p>
        )}
      </header>

      <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
        <nav aria-label="Índice" className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="text-ui font-semibold">En esta página</p>
            <ol className="mt-4 space-y-1 border-l border-line">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-[0.9375rem] text-slate transition-colors duration-200 hover:border-cobalt hover:text-ink"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="max-w-[44rem] lg:col-span-8">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="border-t border-ink/15 py-10 first:border-t-0 first:pt-0"
            >
              <h2 id={`${section.id}-title`} className="wide text-h3">
                {section.title}
              </h2>
              <div className="legal-prose mt-5">{section.content}</div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
