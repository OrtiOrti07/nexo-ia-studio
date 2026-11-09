import { site } from "@/config/site";
import { interestLabel, type ContactInput } from "./schema";

/**
 * Envío de los mensajes de contacto.
 *
 * Funciona con cualquiera de estas dos opciones (variables de entorno):
 *
 * 1. CONTACT_WEBHOOK_URL: recibe un POST con el mensaje en JSON. Sirve para
 *    Make, Zapier, n8n, un CRM o un backend propio.
 * 2. RESEND_API_KEY + CONTACT_TO_EMAIL (+ CONTACT_FROM_EMAIL opcional): envía
 *    un correo a través de la API de Resend.
 *
 * Si no hay ninguna configurada, devuelve "not_configured" y el formulario lo
 * explica al usuario en lugar de fingir que el mensaje se ha enviado.
 */

export type DeliveryResult =
  | { status: "delivered" }
  | { status: "not_configured" }
  | { status: "failed"; reason: string };

export function isDeliveryConfigured() {
  return Boolean(
    process.env.CONTACT_WEBHOOK_URL ||
      (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL),
  );
}

function toPlainText(input: ContactInput) {
  return [
    `Nombre: ${input.name}`,
    `Correo: ${input.email}`,
    `Empresa: ${input.company || "(no indicada)"}`,
    `Interés: ${interestLabel(input.interest)}`,
    "",
    input.message,
  ].join("\n");
}

export async function deliverContact(input: ContactInput): Promise<DeliveryResult> {
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  const payload = {
    name: input.name,
    email: input.email,
    company: input.company,
    interest: input.interest,
    interestLabel: interestLabel(input.interest),
    message: input.message,
    consent: input.consent,
    source: site.url,
    receivedAt: new Date().toISOString(),
  };

  try {
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10_000),
      });
      return res.ok ? { status: "delivered" } : { status: "failed", reason: `webhook ${res.status}` };
    }

    if (resendKey && to) {
      const from = process.env.CONTACT_FROM_EMAIL ?? `${site.name} <onboarding@resend.dev>`;
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: input.email,
          subject: `Nuevo contacto web: ${input.name}${input.company ? ` (${input.company})` : ""}`,
          text: toPlainText(input),
        }),
        signal: AbortSignal.timeout(10_000),
      });
      return res.ok ? { status: "delivered" } : { status: "failed", reason: `resend ${res.status}` };
    }
  } catch (error) {
    return { status: "failed", reason: error instanceof Error ? error.message : "unknown" };
  }

  return { status: "not_configured" };
}
