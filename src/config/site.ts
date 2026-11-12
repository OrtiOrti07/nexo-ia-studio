/**
 * Configuración central de la marca personal.
 *
 * Cambia aquí el nombre, la dirección pública y los datos de contacto: se
 * actualizan la cabecera, el pie, los metadatos, el JSON-LD, el manifest y los
 * textos del formulario.
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

/**
 * Dirección pública completa (incluida la subcarpeta, si la hay), en orden:
 * 1. NEXT_PUBLIC_SITE_URL (la define el despliegue en GitHub Pages).
 * 2. La dirección de producción de Vercel, si algún día se despliega allí.
 * 3. La dirección actual en GitHub Pages.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://ortiorti07.github.io/nexo-ia-studio");

/** URL absoluta de una ruta interna (metadatos, sitemap, robots). */
export function absoluteUrl(path: string) {
  return new URL(href(path), new URL(siteUrl).origin).toString();
}

export const site = {
  /** Nombre de la marca tal como aparece en títulos y metadatos. */
  name: "Juan · Diseño web",
  /** Versión corta para espacios reducidos (manifest, icono de app). */
  shortName: "Juan",
  /** Persona que está detrás de la web. */
  owner: "Juan",
  role: "Diseño y desarrollo web",
  url: siteUrl,
  locale: "es_ES",
  language: "es",
  /** Datos de contacto que se muestran en la web. */
  email: "juanortereque@gmail.com",
  phone: {
    /** Cómo se muestra. */
    display: "+34 683 593 864",
    /** Formato para el enlace tel: (sin espacios). */
    href: "+34683593864",
  },
  title: "Juan · Diseño y desarrollo de webs a medida para empresas",
  description:
    "Soy Juan y diseño y desarrollo páginas web a medida para empresas: webs corporativas, landing pages y rediseños adaptados a tu marca y a tus objetivos. Cuéntame tu proyecto.",
  /** Colores de la marca fuera del CSS (manifest, navegador). */
  colors: {
    paper: "#f4f5f7",
    ink: "#0b1020",
  },
} as const;

/**
 * Redes sociales. Añade la URL de cada perfil cuando exista: solo se muestran
 * las que tengan dirección (sin enlaces vacíos ni decorativos).
 */
export const socials: { label: string; href: string | null }[] = [
  { label: "LinkedIn", href: null },
  { label: "Instagram", href: null },
  { label: "GitHub", href: null },
];

export const navigation = [
  { label: "Servicios", href: href("/#servicios") },
  { label: "Proceso", href: href("/#proceso") },
  { label: "Trabajos", href: href("/#trabajos") },
  { label: "Contacto", href: href("/#contacto") },
] as const;

export const contactAnchor = href("/#contacto");
