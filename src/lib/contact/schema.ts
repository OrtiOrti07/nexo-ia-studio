/**
 * Validación del formulario de contacto, compartida entre navegador y servidor.
 */

export const INTERESTS = [
  { value: "consultoria", label: "Consultoría de IA" },
  { value: "automatizacion", label: "Automatización" },
  { value: "web", label: "Web a medida" },
  { value: "no-lo-se", label: "Aún no lo sé" },
] as const;

export type Interest = (typeof INTERESTS)[number]["value"];

export type ContactInput = {
  name: string;
  email: string;
  company: string;
  interest: Interest;
  message: string;
  consent: boolean;
  /** Campo trampa para bots: las personas no lo ven ni lo rellenan. */
  website: string;
};

export type ContactField = Exclude<keyof ContactInput, "website">;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const LIMITS = {
  name: 100,
  company: 120,
  messageMin: 20,
  messageMax: 3000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const emptyContact: ContactInput = {
  name: "",
  email: "",
  company: "",
  interest: "no-lo-se",
  message: "",
  consent: false,
  website: "",
};

const asText = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/** Convierte datos desconocidos (p. ej. el cuerpo de una petición) en un ContactInput. */
export function normalizeContact(raw: unknown): ContactInput {
  const data = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const interest = INTERESTS.some((i) => i.value === data.interest)
    ? (data.interest as Interest)
    : "no-lo-se";
  return {
    name: asText(data.name),
    email: asText(data.email).toLowerCase(),
    company: asText(data.company),
    interest,
    message: asText(data.message),
    consent: data.consent === true,
    website: asText(data.website),
  };
}

export function validateField(field: ContactField, input: ContactInput): string | undefined {
  switch (field) {
    case "name":
      if (!input.name.trim()) return "Escribe tu nombre.";
      if (input.name.trim().length > LIMITS.name)
        return `El nombre es demasiado largo (máximo ${LIMITS.name} caracteres).`;
      return;
    case "email":
      if (!input.email.trim()) return "Escribe tu correo electrónico.";
      if (!EMAIL_PATTERN.test(input.email.trim()))
        return "Revisa el correo: debe tener un formato como nombre@empresa.com.";
      return;
    case "company":
      if (input.company.trim().length > LIMITS.company)
        return `El nombre de la empresa es demasiado largo (máximo ${LIMITS.company} caracteres).`;
      return;
    case "message": {
      const length = input.message.trim().length;
      if (!length) return "Cuéntanos brevemente qué necesitas.";
      if (length < LIMITS.messageMin)
        return `Añade algo más de detalle (mínimo ${LIMITS.messageMin} caracteres).`;
      if (length > LIMITS.messageMax)
        return `El mensaje es demasiado largo (máximo ${LIMITS.messageMax} caracteres).`;
      return;
    }
    case "consent":
      if (!input.consent) return "Necesitamos tu permiso para usar estos datos y responderte.";
      return;
    case "interest":
      return;
  }
}

const FIELD_ORDER: ContactField[] = ["name", "email", "company", "interest", "message", "consent"];

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of FIELD_ORDER) {
    const error = validateField(field, input);
    if (error) errors[field] = error;
  }
  return errors;
}

export function interestLabel(value: Interest) {
  return INTERESTS.find((i) => i.value === value)?.label ?? value;
}

/** Respuesta del endpoint /api/contact. */
export type ContactResponse =
  | { status: "delivered" }
  | { status: "not_configured" }
  | { status: "invalid"; errors: ContactErrors }
  | { status: "failed" };
