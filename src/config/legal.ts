import { href, site } from "./site";

/**
 * Datos legales del titular de la web.
 *
 * Rellénalos antes de publicar. Mientras alguno valga `null`, las páginas de
 * aviso legal y privacidad lo marcan como "pendiente" y muestran un aviso.
 *
 * Los textos legales son una base redactada para una web informativa con
 * formulario de contacto y sin cookies. Conviene que los revise un asesor legal
 * antes de publicarlos.
 */
export const legal: {
  /** Razón social (sociedad) o nombre y apellidos (autónomo/a). */
  ownerName: string | null;
  /** NIF o CIF. */
  taxId: string | null;
  /** Domicilio completo. */
  address: string | null;
  /**
   * Datos de inscripción en el Registro Mercantil (solo sociedades).
   * Usa `false` si no aplica (por ejemplo, si eres autónomo/a).
   */
  registry: string | false | null;
  /** Correo para consultas y ejercicio de derechos de protección de datos. */
  email: string;
  /** Teléfono de contacto. */
  phone: { display: string; href: string };
  /** Plazo de conservación cuando no llega a haber relación comercial. */
  retentionWithoutContract: string;
  /** Fecha de la última revisión de los textos (texto libre). */
  updatedAt: string;
} = {
  ownerName: null,
  taxId: null,
  address: null,
  registry: null,
  email: site.email,
  phone: site.phone,
  retentionWithoutContract: "un año desde el último contacto",
  updatedAt: "8 de noviembre de 2026",
};

export const legalPages = [
  { label: "Aviso legal", href: href("/aviso-legal") },
  { label: "Privacidad", href: href("/privacidad") },
] as const;

export function hasPendingLegalData() {
  return [legal.ownerName, legal.taxId, legal.address, legal.registry].some((v) => v === null);
}
