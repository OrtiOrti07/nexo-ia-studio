/**
 * Configuración central de la marca.
 *
 * "Nexo IA Studio" es un nombre provisional: cambia aquí el nombre, el dominio
 * y los datos de contacto y se actualizarán la cabecera, el pie, los metadatos,
 * el JSON-LD, la imagen para redes sociales y los textos del formulario.
 */

/**
 * Prefijo de las rutas cuando la web vive en una subcarpeta, como en GitHub
 * Pages (`/nexo-ia-studio`). Vacío en local o con dominio propio.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** true cuando se compila como web estática (GitHub Pages). */
export const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

/**
 * Ruta interna lista para usar en un enlace: añade el prefijo del sitio y, en
 * la versión estática, la barra final que espera GitHub Pages.
 * Ejemplos: href("/#servicios"), href("/privacidad").
 */
export function href(path: string) {
  const [rawPath, hash] = path.split("#");
  let pathname = rawPath || "/";
  const lastSegment = pathname.split("/").pop() ?? "";
  if (isStaticExport && !pathname.endsWith("/") && !lastSegment.includes(".")) {
    pathname += "/";
  }
  return `${basePath}${pathname}${hash ? `#${hash}` : ""}`;
}

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://nexoia.studio");

/** URL absoluta de una ruta interna (metadatos, sitemap, robots). */
export function absoluteUrl(path: string) {
  return new URL(href(path), new URL(siteUrl).origin).toString();
}

export const site = {
  name: "Nexo IA Studio",
  /** Versión corta para espacios reducidos (manifest, icono de app). */
  shortName: "Nexo",
  /**
   * Dirección pública completa (incluida la subcarpeta, si la hay), en orden:
   * 1. NEXT_PUBLIC_SITE_URL (la define el despliegue en GitHub Pages).
   * 2. La dirección de producción de Vercel, si se despliega allí.
   * 3. Un dominio provisional.
   */
  url: siteUrl,
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
  title: "Nexo IA Studio | Consultoría de inteligencia artificial para empresas",
  description:
    "Agentes de IA, automatización de procesos, asistentes virtuales e integración de inteligencia artificial a medida. Estrategia, desarrollo y puesta en marcha con un mismo equipo.",
  tagline: "Consultoría de inteligencia artificial",
} as const;

/**
 * Redes sociales. Añade la URL de cada perfil cuando exista: solo se muestran
 * las que tengan dirección (sin enlaces vacíos ni decorativos).
 */
export const socials: { label: string; href: string | null }[] = [
  { label: "LinkedIn", href: null },
  { label: "Instagram", href: null },
  { label: "X", href: null },
  { label: "YouTube", href: null },
];

export const navigation = [
  { label: "Servicios", href: href("/#servicios") },
  { label: "Método", href: href("/#metodo") },
  { label: "Proyectos", href: href("/#proyectos") },
  { label: "Contacto", href: href("/#contacto") },
] as const;

export const contactAnchor = href("/#contacto");
