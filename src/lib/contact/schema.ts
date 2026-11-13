/**
 * Validación del formulario de contacto.
 */

export const PROJECT_TYPES = [
  { value: "corporativa", label: "Web corporativa" },
  { value: "landing", label: "Landing page" },
  { value: "rediseno", label: "Rediseño de mi web actual" },
  { value: "otro", label: "Otra cosa o aún no lo sé" },
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number]["value"];

export function isProjectType(value: unknown): value is ProjectType {
  return PROJECT_TYPES.some((type) => type.value === value);
}

export type ContactInput = {
  name: string;
  email: string;
  company: string;
  projectType: ProjectType;
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
  projectType: "otro",
  message: "",
  consent: false,
  website: "",
};

export function validateField(field: ContactField, input: ContactInput): string | undefined {
  switch (field) {
    case "name":
      if (!input.name.trim()) return "Escribe tu nombre.";
      if (input.name.trim().length > LIMITS.name)
        return `El nombre es demasiado largo (máximo ${LIMITS.name} caracteres).`;
      return;
    case "email":
      if (!input.email.trim()) return "Escribe tu correo electrónico para que pueda responderte.";
      if (!EMAIL_PATTERN.test(input.email.trim()))
        return "Revisa el correo: debe tener un formato como nombre@empresa.com.";
      return;
    case "company":
      if (input.company.trim().length > LIMITS.company)
        return `El nombre de la empresa es demasiado largo (máximo ${LIMITS.company} caracteres).`;
      return;
    case "message": {
      const length = input.message.trim().length;
      if (!length) return "Cuéntame brevemente qué necesitas.";
      if (length < LIMITS.messageMin)
        return `Añade algo más de detalle (mínimo ${LIMITS.messageMin} caracteres).`;
      if (length > LIMITS.messageMax)
        return `El mensaje es demasiado largo (máximo ${LIMITS.messageMax} caracteres).`;
      return;
    }
    case "consent":
      if (!input.consent) return "Necesito tu permiso para usar estos datos y poder responderte.";
      return;
    case "projectType":
      return;
  }
}

const FIELD_ORDER: ContactField[] = ["name", "email", "company", "projectType", "message", "consent"];

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of FIELD_ORDER) {
    const error = validateField(field, input);
    if (error) errors[field] = error;
  }
  return errors;
}

export function projectTypeLabel(value: ProjectType) {
  return PROJECT_TYPES.find((type) => type.value === value)?.label ?? value;
}
