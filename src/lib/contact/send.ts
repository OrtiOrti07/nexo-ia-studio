import { projectTypeLabel, type ContactErrors, type ContactInput } from "./schema";

/**
 * Envío del formulario a Formspree (https://formspree.io), un servicio de
 * formularios que funciona con webs estáticas como GitHub Pages: recibe el
 * mensaje y lo reenvía al correo de la cuenta. No hay ninguna clave secreta en
 * el código: la dirección del formulario es pública por naturaleza.
 *
 * La dirección se configura con la variable NEXT_PUBLIC_CONTACT_ENDPOINT
 * (p. ej. https://formspree.io/f/abcdwxyz). Sin ella, el formulario lo dice
 * claramente y no finge enviar nada. Ver README.md, "Formulario de contacto".
 */
export const CONTACT_ENDPOINT = (() => {
  const raw = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
})();

export type SendResult =
  | { ok: true }
  | { ok: false; reason: "network" | "rejected"; fieldErrors?: ContactErrors };

type FormspreeError = { field?: string; message?: string; code?: string };

export async function sendContact(input: ContactInput, endpoint: string): Promise<SendResult> {
  const body = {
    nombre: input.name.trim(),
    // Formspree usa el campo «email» como dirección de respuesta
    email: input.email.trim(),
    empresa: input.company.trim() || "(no indicada)",
    tipo_de_proyecto: projectTypeLabel(input.projectType),
    mensaje: input.message.trim(),
    consentimiento: "Acepta la política de privacidad",
    _subject: `Nuevo mensaje desde la web: ${input.name.trim()}`,
    // Campo trampa: si llega relleno, Formspree descarta el envío como spam
    _gotcha: input.website,
  };

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(15_000) : undefined,
    });
  } catch {
    return { ok: false, reason: "network" };
  }

  if (response.ok) return { ok: true };

  // Formspree explica qué campo ha rechazado: { errors: [{ field, message, code }] }
  let errors: FormspreeError[] = [];
  try {
    const data = (await response.json()) as { errors?: FormspreeError[] };
    errors = Array.isArray(data.errors) ? data.errors : [];
  } catch {
    // Respuesta sin JSON: se trata como error general
  }
  const fieldErrors: ContactErrors = {};
  if (errors.some((e) => e.field === "email")) {
    fieldErrors.email = "El servicio de envío no acepta este correo. Revísalo, por favor.";
  }
  return { ok: false, reason: "rejected", fieldErrors };
}
