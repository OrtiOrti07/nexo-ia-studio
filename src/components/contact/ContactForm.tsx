"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { href, site } from "@/config/site";
import { legal } from "@/config/legal";
import { buttonClasses } from "@/components/ui/Button";
import {
  INTERESTS,
  LIMITS,
  emptyContact,
  interestLabel,
  validateContact,
  validateField,
  type ContactErrors,
  type ContactField,
  type ContactInput,
  type ContactResponse,
} from "@/lib/contact/schema";

type Status = "idle" | "submitting" | "delivered" | "not_configured" | "failed";

/**
 * Adónde se envía el formulario:
 * - NEXT_PUBLIC_CONTACT_ENDPOINT: un servicio externo de formularios (p. ej.
 *   Formspree o Web3Forms). Funciona también en la versión estática.
 * - /api/contact: la ruta propia, cuando la web corre con servidor.
 * - Ninguno (versión estática sin servicio): se ofrece enviarlo por correo.
 */
const ENDPOINT =
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ??
  (process.env.NEXT_PUBLIC_STATIC_EXPORT === "1" ? null : "/api/contact");

type ContactFormProps = {
  /** Lo calcula el servidor: indica si hay un canal de envío configurado. */
  deliveryConfigured: boolean;
};

const fieldBase =
  "w-full rounded-field border bg-paper/50 px-4 font-sans text-ui text-ink placeholder:text-slate/70 " +
  "transition-[border-color,background-color] duration-200 hover:border-ink/40 focus:border-cobalt focus:bg-surface";

function buildMailto(values: ContactInput) {
  const subject = `Consulta desde la web: ${values.name}`;
  const body = [
    values.message,
    "",
    "—",
    `Nombre: ${values.name}`,
    `Correo: ${values.email}`,
    values.company ? `Empresa: ${values.company}` : null,
    `Interés: ${interestLabel(values.interest)}`,
  ]
    .filter(Boolean)
    .join("\n");
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ContactForm({ deliveryConfigured }: ContactFormProps) {
  const [values, setValues] = useState<ContactInput>(emptyContact);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  const showResult = status === "delivered" || status === "not_configured";

  useEffect(() => {
    if (showResult) resultRef.current?.focus();
  }, [showResult]);

  const update = <K extends keyof ContactInput>(field: K, value: ContactInput[K]) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // Si el campo ya mostraba un error, lo revalidamos al escribir
    if (field !== "website" && touched[field as ContactField]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field as ContactField, next) }));
    }
  };

  const blur = (field: ContactField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, values) }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    setTouched({ name: true, email: true, company: true, message: true, consent: true });

    const firstInvalid = Object.keys(found)[0] as ContactField | undefined;
    if (firstInvalid) {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`);
      el?.focus();
      return;
    }

    // Sin destino configurado no fingimos un envío: ofrecemos el correo
    if (!ENDPOINT) {
      setStatus("not_configured");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
      });
      // Servicio externo: basta con que responda bien
      if (ENDPOINT !== "/api/contact") {
        setStatus(res.ok ? "delivered" : "failed");
        return;
      }
      const data = (await res.json()) as ContactResponse;
      if (data.status === "invalid") {
        setErrors(data.errors);
        setStatus("idle");
        return;
      }
      setStatus(data.status === "delivered" || data.status === "not_configured" ? data.status : "failed");
    } catch {
      setStatus("failed");
    }
  };

  const reset = (keepValues: boolean) => {
    if (!keepValues) {
      setValues(emptyContact);
      setTouched({});
      setErrors({});
    }
    setStatus("idle");
  };

  if (status === "delivered") {
    return (
      <ResultPanel
        headingRef={resultRef}
        tone="success"
        title="Mensaje enviado"
        actions={
          <button type="button" onClick={() => reset(false)} className={buttonClasses("outline", "md")}>
            Enviar otro mensaje
          </button>
        }
      >
        Gracias, {values.name}. Hemos recibido tu mensaje y te responderemos en{" "}
        <strong className="font-semibold text-ink">{values.email}</strong>.
      </ResultPanel>
    );
  }

  if (status === "not_configured") {
    return (
      <ResultPanel
        headingRef={resultRef}
        tone="notice"
        title="Tu mensaje aún no se ha enviado"
        actions={
          <>
            <a href={buildMailto(values)} className={buttonClasses("primary", "md")}>
              Enviarlo desde mi correo
            </a>
            <button type="button" onClick={() => reset(true)} className={buttonClasses("outline", "md")}>
              Volver al formulario
            </button>
          </>
        }
      >
        Los datos son correctos, pero el envío del formulario todavía no está conectado a ningún
        correo, así que no nos ha llegado. Puedes enviárnoslo desde tu propio correo: abriremos un
        mensaje con todo lo que has escrito, dirigido a{" "}
        <strong className="font-semibold text-ink">{site.email}</strong>.
      </ResultPanel>
    );
  }

  const describedBy = (field: ContactField, extra?: string) =>
    [errors[field] ? id(`${field}-error`) : null, extra].filter(Boolean).join(" ") || undefined;

  const messageLength = values.message.trim().length;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Nombre" htmlFor={id("name")} error={errors.name} errorId={id("name-error")}>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={LIMITS.name + 20}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => blur("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            className={`${fieldBase} h-12 ${errors.name ? "border-danger" : "border-line"}`}
          />
        </Field>

        <Field
          label="Correo electrónico"
          htmlFor={id("email")}
          error={errors.email}
          errorId={id("email-error")}
        >
          <input
            id={id("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => blur("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            className={`${fieldBase} h-12 ${errors.email ? "border-danger" : "border-line"}`}
          />
        </Field>
      </div>

      <Field
        label="Empresa"
        optional
        htmlFor={id("company")}
        error={errors.company}
        errorId={id("company-error")}
      >
        <input
          id={id("company")}
          name="company"
          type="text"
          autoComplete="organization"
          value={values.company}
          onChange={(e) => update("company", e.target.value)}
          onBlur={() => blur("company")}
          aria-invalid={Boolean(errors.company)}
          aria-describedby={describedBy("company")}
          className={`${fieldBase} h-12 ${errors.company ? "border-danger" : "border-line"}`}
        />
      </Field>

      <fieldset>
        <legend className="text-[0.9375rem] font-semibold">¿En qué podemos ayudarte?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {INTERESTS.map((option) => (
            <label key={option.value} className="relative cursor-pointer">
              <input
                type="radio"
                name="interest"
                value={option.value}
                checked={values.interest === option.value}
                onChange={() => update("interest", option.value)}
                className="peer absolute inset-0 cursor-pointer opacity-0"
              />
              <span className="inline-flex h-10 items-center rounded-pill border border-line px-4 text-[0.9375rem] font-medium text-ink transition-colors duration-200 peer-checked:border-cobalt peer-checked:bg-cobalt peer-checked:text-white peer-hover:border-ink/40 peer-focus-visible:outline-[2.5px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cobalt peer-focus-visible:outline-solid">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field
        label="Cuéntanos tu caso"
        htmlFor={id("message")}
        error={errors.message}
        errorId={id("message-error")}
        hint={
          <span id={id("message-hint")}>
            Qué haces, qué te gustaría mejorar y cualquier plazo que tengas en mente.
          </span>
        }
      >
        <textarea
          id={id("message")}
          name="message"
          rows={5}
          required
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          onBlur={() => blur("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message", id("message-hint"))}
          className={`${fieldBase} resize-y py-3 leading-relaxed ${errors.message ? "border-danger" : "border-line"}`}
        />
        <p className="mt-1.5 text-right text-micro text-slate" aria-hidden="true">
          {messageLength}/{LIMITS.messageMax}
        </p>
      </Field>

      {/* Campo trampa para bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>No rellenes este campo</label>
        <input
          id={id("website")}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={(e) => update("consent", e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={describedBy("consent")}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-cobalt"
          />
          <span className="font-serif text-small leading-snug">
            Acepto que {site.name} use estos datos únicamente para responder a mi consulta, según
            la{" "}
            <a
              href={href("/privacidad")}
              target="_blank"
              rel="noopener"
              className="font-sans font-semibold text-cobalt underline underline-offset-4"
            >
              política de privacidad
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
            .
          </span>
        </label>
        {errors.consent && <ErrorText id={id("consent-error")}>{errors.consent}</ErrorText>}
        <p className="mt-4 font-serif text-micro leading-relaxed text-slate">
          <strong className="font-sans font-semibold text-ink">Protección de datos.</strong>{" "}
          Responsable: {legal.ownerName ?? site.name}. Finalidad: responder a tu consulta y, si lo
          pides, enviarte una propuesta. Legitimación: tu consentimiento. No cedemos tus datos a
          terceros salvo obligación legal. Puedes acceder a ellos, rectificarlos o suprimirlos,
          entre otros derechos, como explica la política de privacidad.
        </p>
      </div>

      {!deliveryConfigured && (
        <p className="rounded-card border border-amber bg-amber/15 px-4 py-3.5 font-serif text-small leading-snug">
          <strong className="font-sans font-semibold">Aviso:</strong> el envío de este formulario
          todavía no está conectado. Puedes rellenarlo y comprobar que todo está bien; al final te
          ofreceremos enviarlo desde tu propio correo.
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "submitting"}
          className={`${buttonClasses("primary", "lg")} w-full sm:w-auto`}
        >
          {status === "submitting" ? "Enviando…" : "Enviar mensaje"}
        </button>
        <div role="status" aria-live="polite" className="text-micro">
          {status === "failed" && (
            <span className="font-medium text-danger">
              No hemos podido enviar el mensaje. Comprueba tu conexión e inténtalo de nuevo, o
              escríbenos a {site.email} o llámanos al {site.phone.display}.
            </span>
          )}
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  error,
  errorId,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  error?: string;
  errorId: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-[0.9375rem] font-semibold">
        {label}
        {optional && <span className="ml-1.5 font-normal text-slate">(opcional)</span>}
      </label>
      {hint && <p className="mt-1 font-serif text-micro text-slate">{hint}</p>}
      <div className="mt-2">{children}</div>
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-micro font-medium text-danger">
      <svg viewBox="0 0 16 16" className="mt-px size-4 shrink-0" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 4.5v4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="8" cy="11.3" r="0.95" fill="currentColor" />
      </svg>
      {children}
    </p>
  );
}

function ResultPanel({
  headingRef,
  tone,
  title,
  actions,
  children,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  tone: "success" | "notice";
  title: string;
  actions: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="panel-swap">
      <span
        aria-hidden="true"
        className={`grid size-12 place-items-center rounded-full ${
          tone === "success" ? "bg-cobalt text-white" : "bg-amber text-ink"
        }`}
      >
        {tone === "success" ? (
          <svg viewBox="0 0 24 24" className="size-6">
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="size-6">
            <path d="M12 6.5v7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="12" cy="17.3" r="1.3" fill="currentColor" />
          </svg>
        )}
      </span>
      <h3 ref={headingRef} tabIndex={-1} className="wide mt-6 text-h3 outline-none">
        {title}
      </h3>
      <p className="mt-4 max-w-copy font-serif text-body text-slate">{children}</p>
      <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
    </div>
  );
}
