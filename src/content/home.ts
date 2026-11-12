/**
 * Textos de la página de inicio.
 *
 * Regla editorial: no se inventan apellidos, trayectoria, clientes, premios,
 * cifras, precios ni testimonios. Los trabajos que se muestran son conceptos
 * con marcas ficticias y se presentan como tales.
 */

export const hero = {
  eyebrow: "Juan · diseño y desarrollo web",
  /** El titular se compone en Showcase.tsx para marcar «a la altura». */
  title: "Tu web debería estar a la altura de tu negocio.",
  lead: "Soy Juan. Diseño y programo webs a medida para empresas, pensadas para que tus clientes te escriban, te llamen o te pidan presupuesto.",
  primaryCta: "Cuéntame tu proyecto",
  secondaryCta: "Cómo trabajo",
};

/** Etapas del escaparate 3D de la portada (la primera es la portada en sí). */
export const showcaseStages = [
  {
    kicker: "Diseño propio",
    title: "Diseñada desde cero para tu marca.",
    body: "Sin plantillas: tu tono, tus colores y lo que necesitan tus clientes.",
  },
  {
    kicker: "Clara y directa",
    title: "Que se entienda a la primera.",
    body: "Cada sección lleva al visitante, sin rodeos, hasta el contacto.",
  },
  {
    kicker: "En cualquier pantalla",
    title: "Igual de bien en el móvil.",
    body: "Diseñada también para el teléfono, no adaptada a última hora.",
  },
  {
    kicker: "Cada negocio, su web",
    title: "Hecha a la medida de lo que haces.",
    body: "Un restaurante, un estudio o un instalador no necesitan la misma web.",
  },
];

export type ServiceId = "corporativa" | "landing" | "rediseno";

export const servicesIntro = {
  kicker: "Servicios",
  title: "Qué puedes encargarme",
};

export const services: { id: ServiceId; index: string; title: string; body: string; cta: string }[] = [
  {
    id: "corporativa",
    index: "01",
    title: "Web corporativa",
    body: "Quién eres, qué ofreces y cómo contactarte, claro desde cualquier pantalla.",
    cta: "Quiero una web corporativa",
  },
  {
    id: "landing",
    index: "02",
    title: "Landing page",
    body: "Una sola página para una campaña, un servicio o un lanzamiento.",
    cta: "Quiero una landing page",
  },
  {
    id: "rediseno",
    index: "03",
    title: "Rediseño",
    body: "Tu web actual, puesta al día sin perder lo que ya funciona.",
    cta: "Quiero rediseñar mi web",
  },
];

export const processIntro = {
  kicker: "Proceso",
  title: "Así trabajaremos juntos",
};

export const processSteps = [
  { title: "Conversación", body: "Me cuentas tu negocio y qué quieres conseguir con la web." },
  { title: "Propuesta", body: "Alcance, plazos y presupuesto por escrito, antes de empezar." },
  { title: "Diseño", body: "Diseño la web con tu marca y la ajustamos juntos." },
  { title: "Desarrollo", body: "La programo y la pruebo en móvil, tableta y ordenador." },
  { title: "Publicación", body: "La publicamos en tu dominio y te explico cómo funciona." },
];

export const workIntro = {
  kicker: "Trabajos",
  title: "Conceptos de diseño",
  body: "Marcas inventadas para enseñarte cómo cambia una web según el negocio. No son trabajos para clientes.",
  label: "Concepto · marca ficticia",
};

export type ConceptId = "restaurante" | "arquitectura" | "instalaciones";

export const concepts: { id: ConceptId; index: string; sector: string; brand: string; title: string; body: string }[] = [
  {
    id: "restaurante",
    index: "01",
    sector: "Restaurante",
    brand: "Lumbre",
    title: "Que apetezca reservar desde el móvil",
    body: "La comida delante y el botón de reservar siempre a mano.",
  },
  {
    id: "arquitectura",
    index: "02",
    sector: "Estudio de arquitectura",
    brand: "Cierzo",
    title: "Habla poco y enseña mucho",
    body: "Mucho aire, proyectos a gran tamaño y el contacto al final del recorrido.",
  },
  {
    id: "instalaciones",
    index: "03",
    sector: "Empresa de instalaciones",
    brand: "Faro Instalaciones",
    title: "Del problema al presupuesto en dos pasos",
    body: "Mensaje directo, teléfono visible y un formulario corto.",
  },
];

export const faqIntro = {
  kicker: "Preguntas frecuentes",
  title: "Antes de empezar",
};

export const faqs = [
  {
    q: "¿Cuánto cuesta una web?",
    a: "Depende del tipo de web, de las páginas y de las funciones que necesites. Tras la primera conversación te envío un presupuesto por escrito y sin compromiso.",
  },
  {
    q: "¿Cuánto se tarda?",
    a: "Depende del alcance. En la propuesta va un calendario con las fechas de cada fase; tener los contenidos preparados lo acelera mucho.",
  },
  {
    q: "¿Necesito tener los textos y las fotos?",
    a: "Ayuda, pero no es imprescindible. Te digo qué hace falta para cada página y te ayudo a ordenarlo.",
  },
  {
    q: "Ya tengo web. ¿Puedes mejorarla?",
    a: "Sí. Reviso qué funciona y qué no, y te propongo qué conservar y qué cambiar sin perder lo que ya te funciona.",
  },
  {
    q: "¿Quién se encarga del dominio y el alojamiento?",
    a: "Si ya los tienes, trabajo con ellos. Si no, te ayudo a contratarlos a tu nombre para que siempre sean tuyos.",
  },
];

export const contactIntro = {
  kicker: "Contacto",
  title: "Cuéntame tu proyecto",
  body: "Escríbeme con lo que tengas, aunque solo sea una idea. Te respondo personalmente.",
};
