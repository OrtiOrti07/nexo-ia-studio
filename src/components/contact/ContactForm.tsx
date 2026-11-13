"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";
import { ArrowRight, Check, ChevronDown, CircleAlert, LoaderCircle, Mail, Phone } from "lucide-react";
import { href, site } from "@/config/site";
import { ownerLabel } from "@/config/legal";
import {
  LIMITS,
  PROJECT_TYPES,
  emptyContact,
  isProjectType,
  validateContact,
  validateField,
  type ContactErrors,
  type ContactField,
  type ContactInput,
  type ProjectType,
} from "@/lib/contact/schema";
import { CONTACT_ENDPOINT, sendContact } from "@/lib/contact/send";

type Status = "idle" | "submitting" | "sent" | "failed" | "too_fast" | "not_configured";

/** Un envío más rápido que esto, desde que se carga el formulario, es casi seguro un bot. */
const MIN_FILL_TIME_MS = 3000;

const fieldBase =
  "w-full rounded-field border bg-white px-4 text-body text-ink placeholder:text-muted/70 " +
  "shadow-[inset_0_1px_2px_rgb(15_23_42/0.06)] transition-[border-color,box-shadow] duration-200 " +
  "hover:border-line-strong focus:border-ink focus:shadow-[0_0_0_4px_rgb(46_91_255/0.2)] focus:outline-none";

export function ContactForm() {
  const [values, setValues] = useState<ContactInput>(emptyContact);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const startedAt = useRef(0);
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Los enlaces «Quiero una landing page…» de los servicios preseleccionan el tipo de proyecto
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLElement>("[data-project-type]");
      const type = link?.dataset.projectType;
      if (isProjectType(type)) setValues((prev) => ({ ...prev, projectType: type }));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const showResult = status === "sent" || status === "not_configured";

  useEffect(() => {
    if (showResult) resultRef.current?.focus();
  }, [showResult]);

  const update = <K extends keyof ContactInput>(field: K, value: ContactInput[K]) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (status === "failed" || status === "too_fast") setStatus("idle");
    // Si el campo ya mostraba un error, se revalida al escribir
    if (field !== "website" && touched[field as ContactField]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field as ContactField, next) }));
    }
  };

  const blur = (field: ContactField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, values) }));
  };

  const focusField = (field: string) =>
    formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const found = validateContact(values);
    setErrors(found);
    setTouched({ name: true, email: true, company: true, message: true, consent: true });
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }

    // Sin servicio configurado no se finge un envío
    if (!CONTACT_ENDPOINT) {
      setStatus("not_configured");
      return;
    }

    // Protección antispam: campo trampa relleno o envío instantáneo
    if (values.website) {
      setStatus("sent");
      return;
    }
    if (Date.now() - startedAt.current < MIN_FILL_TIME_MS) {
      setStatus("too_fast");
      return;
    }

    setStatus("submitting");
    const result = await sendContact(values, CONTACT_ENDPOINT);
    if (result.ok) {
      setStatus("sent");
      return;
    }
    if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...result.fieldErrors }));
      focusField(Object.keys(result.fieldErrors)[0]);
    }
    setStatus("failed");
  };

  const reset = (keepValues: boolean) => {
    if (!keepValues) {
      setValues(emptyContact);
      setTouched({});
      setErrors({});
    }
    startedAt.current = Date.now();
    setStatus("idle");
  };

  if (status === "sent") {
    return (
      <ResultPanel
        headingRef={resultRef}
        tone="success"
        title="Mensaje enviado"
        actions={
          <button type="button" onClick={() => reset(false)} className="btn btn-outline">
            Enviar otro mensaje
          </button>
        }
      >
        Gracias, {values.name.trim()}. Me ha llegado tu mensaje y te responderé en{" "}
        <strong className="font-semibold text-ink">{values.email.trim()}</strong>.
      </ResultPanel>
    );
  }

  if (status === "not_configured") {
    return (
      <ResultPanel
        headingRef={resultRef}
        tone="notice"
        title="Tu mensaje no se ha enviado"
        actions={
          <button type="button" onClick={() => reset(true)} className="btn btn-outline">
            Volver al formulario
          </button>
        }
      >
        El envío del formulario todavía no está activado, así que el mensaje no me ha llegado. Mientras tanto, puedes
        escribirme a{" "}
        <a href={`mailto:${site.email}`} className="font-semibold text-ink underline underline-offset-4">
          {site.email}
        </a>{" "}
        o llamarme al{" "}
        <a href={`tel:${site.phone.href}`} className="font-semibold whitespace-nowrap text-ink underline underline-offset-4">
          {site.phone.display}
        </a>
        .
      </ResultPanel>
    );
  }

  const describedBy = (field: ContactField, extra?: string) =>
    [errors[field] ? id(`${field}-error`) : null, extra].filter(Boolean).join(" ") || undefined;
  const border = (field: ContactField) => (errors[field] ? "border-danger" : "border-line");
  const messageLength = values.message.trim().length;
  const submitting = status === "submitting";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-labelledby={`${uid}-title`}
      aria-busy={submitting}
      className="grid gap-6"
    >
      <div>
        <h3 id={`${uid}-title`} className="font-display text-[1.5rem] leading-tight font-bold tracking-[-0.02em]">
          Escríbeme aquí
        </h3>
        <p className="mt-1.5 text-small text-muted">
          Los campos marcados con <span aria-hidden="true">*</span>
          <span className="sr-only">asterisco</span> son obligatorios.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Nombre" required htmlFor={id("name")} error={errors.name} errorId={id("name-error")}>
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

        <Field label="Correo electrónico" required htmlFor={id("email")} error={errors.email} errorId={id("email-error")}>
          <input
            id={id("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
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

        <Field label="¿Qué necesitas?" htmlFor={id("projectType")} errorId={id("projectType-error")}>
          <div className="relative">
            <select
              id={id("projectType")}
              name="projectType"
              value={values.projectType}
              onChange={(e) => update("projectType", e.target.value as ProjectType)}
              className={`${fieldBase} h-12 cursor-pointer appearance-none pr-11 ${border("projectType")}`}
            >
              {PROJECT_TYPES.map((option) => (
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
        label="Cuéntame tu proyecto"
        required
        htmlFor={id("message")}
        error={errors.message}
        errorId={id("message-error")}
        hint={
          <span id={id("message-hint")}>
            A qué se dedica tu empresa, qué quieres conseguir con la web y si tienes alguna fecha en mente.
          </span>
        }
      >
        <textarea
          id={id("message")}
          name="message"
          rows={5}
          required
          maxLength={LIMITS.messageMax + 200}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          onBlur={() => blur("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message", id("message-hint"))}
          className={`${fieldBase} min-h-36 resize-y py-3 leading-relaxed ${border("message")}`}
        />
        <p
          className={`mt-1.5 text-right font-mono text-micro ${messageLength > LIMITS.messageMax ? "text-danger" : "text-muted"}`}
          aria-hidden="true"
        >
          {messageLength}/{LIMITS.messageMax}
        </p>
      </Field>

      {/* Campo trampa para bots (Formspree lo llama _gotcha): invisible para las personas */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("gotcha")}>No rellenes este campo</label>
        <input
          id={id("gotcha")}
          name="_gotcha"
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
            required
            checked={values.consent}
            onChange={(e) => update("consent", e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={describedBy("consent", id("privacy-info"))}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-accent-ink"
          />
          <span className="text-small leading-snug">
            He leído y acepto la{" "}
            <a
              href={href("/privacidad")}
              target="_blank"
              rel="noopener"
              className="font-semibold text-accent-ink underline underline-offset-4"
            >
              política de privacidad
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
            . <span aria-hidden="true">*</span>
          </span>
        </label>
        {errors.consent && <ErrorText id={id("consent-error")}>{errors.consent}</ErrorText>}
        <p id={id("privacy-info")} className="mt-4 text-micro leading-relaxed text-muted">
          <strong className="font-semibold text-ink">Protección de datos.</strong> Responsable: {ownerLabel}. Finalidad:
          responder a tu consulta y, si me la pides, enviarte una propuesta. Legitimación: tu consentimiento. El mensaje
          se envía a través de Formspree, que lo recibe por cuenta mía. Puedes acceder a tus datos, rectificarlos o
          suprimirlos, entre otros derechos, como explica la política de privacidad.
        </p>
      </div>

      {!CONTACT_ENDPOINT && (
        <p className="flex gap-3 rounded-card border border-accent/40 bg-accent-soft/60 px-4 py-3.5 text-small leading-snug">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-ink" />
          <span>
            <strong className="font-semibold">El envío del formulario aún no está activado.</strong> Mientras tanto,
            escríbeme a {site.email} o llámame al {site.phone.display}.
          </span>
        </p>
      )}

      <div role="alert" className="empty:hidden">
        {status === "failed" && (
          <p className="flex gap-3 rounded-card border border-danger/30 bg-danger/[0.06] px-4 py-3.5 text-small leading-snug text-danger">
            <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>
              No he podido recibir el mensaje. Revisa tu conexión y vuelve a intentarlo; si sigue fallando, escríbeme a{" "}
              <a href={`mailto:${site.email}`} className="font-semibold underline underline-offset-4">
                {site.email}
              </a>{" "}
              o llámame al{" "}
              <a href={`tel:${site.phone.href}`} className="font-semibold whitespace-nowrap underline underline-offset-4">
                {site.phone.display}
              </a>
              . Lo que has escrito sigue aquí.
            </span>
          </p>
        )}
        {status === "too_fast" && (
          <p className="flex gap-3 rounded-card border border-danger/30 bg-danger/[0.06] px-4 py-3.5 text-small leading-snug text-danger">
            <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>El formulario se ha enviado demasiado rápido. Revisa los datos y vuelve a pulsar «Enviar mensaje».</span>
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary btn-lg w-full disabled:cursor-progress disabled:opacity-80 sm:w-auto"
        >
          {submitting ? (
            <>
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              Enviando…
            </>
          ) : (
            <>
              Enviar mensaje
              <ArrowRight aria-hidden="true" className="size-4" />
            </>
          )}
        </button>
        <p aria-live="polite" className="text-micro text-muted sm:text-right">
          {submitting ? "Enviando tu mensaje…" : "Sin salir de esta página."}
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  required,
  error,
  errorId,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  required?: boolean;
  error?: string;
  errorId: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-small font-semibold text-ink">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-accent-ink">
            *
          </span>
        )}
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
      <CircleAlert aria-hidden="true" className="mt-px size-4 shrink-0" />
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
  headingRef: RefObject<HTMLHeadingElement | null>;
  tone: "success" | "notice";
  title: string;
  actions: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="py-4" role="status">
      <span
        aria-hidden="true"
        className={`grid size-14 place-items-center rounded-full ${
          tone === "success" ? "bg-ok text-white" : "bg-accent text-white"
        } shadow-[0_10px_24px_-10px_rgb(15_23_42/0.5)]`}
      >
        {tone === "success" ? <Check className="size-7" strokeWidth={2.5} /> : <CircleAlert className="size-7" />}
      </span>
      <h3 ref={headingRef} tabIndex={-1} className="mt-6 text-h3 outline-none">
        {title}
      </h3>
      <p className="mt-4 max-w-copy text-body text-muted">{children}</p>
      <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
      <ul className="mt-10 space-y-1 border-t border-line pt-6 text-small">
        <li>
          <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center gap-2 text-muted hover:text-ink">
            <Mail aria-hidden="true" className="size-4 text-accent-ink" />
            {site.email}
          </a>
        </li>
        <li>
          <a href={`tel:${site.phone.href}`} className="inline-flex min-h-11 items-center gap-2 text-muted hover:text-ink">
            <Phone aria-hidden="true" className="size-4 text-accent-ink" />
            {site.phone.display}
          </a>
        </li>
      </ul>
    </div>
  );
}
