/**
 * Configuración central de la marca.
 *
 * "Nexo IA Studio" es un nombre provisional: cambia aquí el nombre, el dominio
 * y los datos de contacto y se actualizarán la cabecera, el pie, los metadatos,
 * el JSON-LD, la imagen para redes sociales y los textos del formulario.
 */
export const site = {
  name: "Nexo IA Studio",
  /** Versión corta para espacios reducidos (manifest, icono de app). */
  shortName: "Nexo",
  /**
   * Dominio público. Se puede sobrescribir con NEXT_PUBLIC_SITE_URL en cada
   * entorno. El valor por defecto es provisional.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexoia.studio",
  locale: "es_ES",
  language: "es",
  /** Datos de contacto que se muestran en la web. */
  email: "juanortereque@gmail.com",
  phone: {
    /** Cómo se muestra. */
    display: "+34 683 59 38 64",
    /** Formato para el enlace tel: (sin espacios). */
    href: "+34683593864",
  },
  title: "Nexo IA Studio · Consultoría de IA y webs a medida",
  description:
    "Consultoría de inteligencia artificial, automatización de procesos y desarrollo de páginas web a medida para negocios que quieren trabajar mejor y llegar más lejos.",
  tagline: "Consultoría de IA y webs a medida",
} as const;

export const navigation = [
  { label: "Servicios", href: "/#servicios" },
  { label: "Método", href: "/#metodo" },
  { label: "Ejemplos", href: "/#situaciones" },
  { label: "Preguntas", href: "/#preguntas" },
] as const;

export const contactAnchor = "/#contacto";
