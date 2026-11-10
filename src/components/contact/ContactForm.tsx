"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AlertCircle, Check, ChevronDown, Loader2, Mail, Send } from "lucide-react";
import { href, site } from "@/config/site";
import { legal } from "@/config/legal";
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
  type Interest,
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
  "w-full rounded-field border bg-white/[0.03] px-4 text-body text-text placeholder:text-muted/60 " +
  "transition-[border-color,background-color,box-shadow] duration-200 hover:border-white/25 " +
  "focus:border-cyan/70 focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgb(34_227_255/0.12)] focus:outline-none";

const buttonBase =
  "inline-flex h-12 items-center justify-center gap-2 rounded-pill px-6 text-small font-semibold select-none";

function buildMailto(values: ContactInput) {
  const subject = `Consulta desde la web: ${values.name}`;
  const body = [
    values.message,
    "",
    "—",
    `Nombre: ${values.name}`,
    `Correo: ${values.email}`,
    values.company ? `Empresa: ${values.company}` : null,
    `Servicio: ${interestLabel(values.interest)}`,
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
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
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
          <button type="button" onClick={() => reset(false)} className={`btn-ghost ${buttonBase}`}>
            Enviar otro mensaje
          </button>
        }
      >
        Gracias, {values.name}. Hemos recibido tu mensaje y te responderemos en{" "}
        <strong className="font-semibold text-text">{values.email}</strong>.
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
            <a href={buildMailto(values)} className={`btn-neon ${buttonBase}`}>
              <Mail aria-hidden="true" className="size-4" />
              Enviarlo desde mi correo
            </a>
            <button type="button" onClick={() => reset(true)} className={`btn-ghost ${buttonBase}`}>
              Volver al formulario
            </button>
          </>
        }
      >
        Los datos son correctos, pero el envío del formulario todavía no está conectado, así que no nos ha
        llegado. Puedes enviárnoslo desde tu correo: se abrirá un mensaje con todo lo que has escrito, dirigido a{" "}
        <strong className="font-semibold text-text">{site.email}</strong>.
      </ResultPanel>
    );
  }

  const describedBy = (field: ContactField, extra?: string) =>
    [errors[field] ? id(`${field}-error`) : null, extra].filter(Boolean).join(" ") || undefined;

  const border = (field: ContactField) => (errors[field] ? "border-danger/80" : "border-white/12");
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
            className={`${fieldBase} h-12 ${border("name")}`}
          />
        </Field>

        <Field label="Correo electrónico" htmlFor={id("email")} error={errors.email} errorId={id("email-error")}>
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
            className={`${fieldBase} h-12 ${border("email")}`}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Empresa" optional htmlFor={id("company")} error={errors.company} errorId={id("company-error")}>
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
            className={`${fieldBase} h-12 ${border("company")}`}
          />
        </Field>

        <Field label="Servicio de interés" htmlFor={id("interest")} errorId={id("interest-error")}>
          <div className="relative">
            <select
              id={id("interest")}
              name="interest"
              value={values.interest}
              onChange={(e) => update("interest", e.target.value as Interest)}
              className={`${fieldBase} h-12 appearance-none pr-11 ${border("interest")} [&>option]:bg-graphite`}
            >
              {INTERESTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted"
            />
          </div>
        </Field>
      </div>

      <Field
        label="Descripción del proyecto"
        htmlFor={id("message")}
        error={errors.message}
        errorId={id("message-error")}
        hint={<span id={id("message-hint")}>Qué hacéis, qué queréis mejorar y cualquier plazo que tengáis en mente.</span>}
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
          className={`${fieldBase} resize-y py-3 leading-relaxed ${border("message")}`}
        />
        <p className="mt-1.5 text-right font-mono text-micro text-muted" aria-hidden="true">
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
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-cyan"
          />
          <span className="text-small leading-snug text-text/90">
            Acepto que {site.name} use estos datos únicamente para responder a mi consulta, según la{" "}
            <a
              href={href("/privacidad")}
              target="_blank"
              rel="noopener"
              className="font-semibold text-cyan underline underline-offset-4"
            >
              política de privacidad
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
            .
          </span>
        </label>
        {errors.consent && <ErrorText id={id("consent-error")}>{errors.consent}</ErrorText>}
        <p className="mt-4 text-micro leading-relaxed text-muted">
          <strong className="font-semibold text-text/90">Protección de datos.</strong> Responsable:{" "}
          {legal.ownerName ?? site.name}. Finalidad: responder a tu consulta y, si lo pides, enviarte una propuesta.
          Legitimación: tu consentimiento. No cedemos tus datos a terceros salvo obligación legal. Puedes acceder a
          ellos, rectificarlos o suprimirlos, entre otros derechos, como explica la política de privacidad.
        </p>
      </div>

      {!deliveryConfigured && (
        <p className="rounded-card border border-cyan/25 bg-cyan/[0.06] px-4 py-3.5 text-small leading-snug text-text/90">
          <strong className="font-semibold">Aviso:</strong> el envío de este formulario todavía no está conectado.
          Puedes rellenarlo y comprobar que todo está bien; al final te ofreceremos enviarlo desde tu correo.
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "submitting"}
          className={`btn-neon ${buttonBase} h-14 w-full px-8 text-[1rem] disabled:cursor-progress disabled:opacity-70 sm:w-auto`}
        >
          {status === "submitting" ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              Enviando…
            </>
          ) : (
            <>
              <Send aria-hidden="true" className="size-4" />
              Enviar mensaje
            </>
          )}
        </button>
        <div role="status" aria-live="polite" className="text-small">
          {status === "failed" && (
            <span className="font-medium text-danger">
              No hemos podido enviar el mensaje. Comprueba tu conexión e inténtalo de nuevo, o escríbenos a{" "}
              {site.email} o llámanos al {site.phone.display}.
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
      <label htmlFor={htmlFor} className="block text-small font-semibold text-text">
        {label}
        {optional && <span className="ml-1.5 font-normal text-muted">(opcional)</span>}
      </label>
      {hint && <p className="mt-1 text-micro text-muted">{hint}</p>}
      <div className="mt-2">{children}</div>
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-micro font-medium text-danger">
      <AlertCircle aria-hidden="true" className="mt-px size-4 shrink-0" />
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
    <div>
      <span
        aria-hidden="true"
        className={`grid size-12 place-items-center rounded-full ${
          tone === "success" ? "bg-ok/15 text-ok" : "bg-cyan/15 text-cyan"
        }`}
      >
        {tone === "success" ? <Check className="size-6" /> : <AlertCircle className="size-6" />}
      </span>
      <h3 ref={headingRef} tabIndex={-1} className="mt-6 text-h3 outline-none">
        {title}
      </h3>
      <p className="mt-4 max-w-copy text-body text-muted">{children}</p>
      <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
    </div>
  );
}
