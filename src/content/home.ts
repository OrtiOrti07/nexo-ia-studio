/**
 * Contenido de la página de inicio.
 *
 * Todo el texto vive aquí para poder editarlo sin tocar los componentes.
 * Regla editorial: no se inventan clientes, cifras, certificaciones ni
 * resultados. Los ejemplos de "situaciones" son escenarios habituales, no casos
 * reales de clientes.
 */

export const hero = {
  title: "La IA y tu web deberían trabajar para tu negocio.",
  /** El mismo titular, partido en las líneas del hero. */
  titleLines: ["La IA y tu web", "deberían trabajar", "para tu negocio."],
  lead: "Detectamos dónde la inteligencia artificial te ahorra trabajo de verdad y diseñamos webs a medida que tus clientes entienden a la primera.",
  primaryCta: "Hablemos de tu proyecto",
  secondaryCta: "Descubre qué podemos mejorar",
  caption: "Tu negocio en el centro. La IA y la web, trabajando a su alrededor.",
};

export type ServiceLayer = "estrategia" | "operaciones" | "presencia";

export type Service = {
  id: string;
  layer: ServiceLayer;
  layerLabel: string;
  /** Órbita que representa en el sistema: 0 = la más cercana al centro. */
  orbit: 0 | 1 | 2;
  title: string;
  lead: string;
  includes: string[];
  forWhom: string;
};

/** Presentación de marca tras el hero (palabra gigante con la foto dentro). */
export const brandReveal = {
  tagline: "Consultoría de IA y webs a medida",
};

export const servicesHeading = {
  title: "Cómo podemos ayudarte",
  body: "Tres servicios que puedes contratar por separado o combinar. Cada uno actúa en una capa de tu negocio.",
};

export const servicesIntro = {
  title: "Trabajamos del centro de tu negocio hacia fuera",
  body: "Primero entendemos cómo funciona tu negocio por dentro. Después automatizamos lo que hoy os quita tiempo y construimos la web que te presenta ante tus clientes. Puedes contratar cada servicio por separado o combinarlos.",
};

export const services: Service[] = [
  {
    id: "consultoria",
    layer: "estrategia",
    layerLabel: "Estrategia",
    orbit: 0,
    title: "Consultoría de IA",
    lead: "Te ayudamos a decidir dónde tiene sentido usar inteligencia artificial en tu negocio y, igual de importante, dónde no.",
    includes: [
      "Diagnóstico de procesos, herramientas y datos",
      "Hoja de ruta con prioridades, esfuerzo estimado y riesgos",
      "Selección de herramientas y proveedores",
      "Formación práctica para tu equipo",
    ],
    forWhom:
      "Para quien quiere empezar con IA sin gastar en pruebas que no llevan a ninguna parte.",
  },
  {
    id: "automatizacion",
    layer: "operaciones",
    layerLabel: "Operaciones",
    orbit: 1,
    title: "Automatización con IA",
    lead: "Conectamos tus herramientas y ponemos la IA a trabajar en las tareas repetitivas: clasificar, resumir, responder y preparar documentos.",
    includes: [
      "Asistentes que responden con la información de tu negocio",
      "Flujos entre correo, formularios, CRM y hojas de cálculo",
      "Borradores automáticos de presupuestos, informes y respuestas",
      "Revisión humana en los puntos que importan",
    ],
    forWhom: "Para equipos que pasan horas copiando datos de un sitio a otro.",
  },
  {
    id: "webs",
    layer: "presencia",
    layerLabel: "Presencia",
    orbit: 2,
    title: "Webs a medida",
    lead: "Diseñamos y desarrollamos webs rápidas y claras, pensadas para que tus clientes entiendan lo que ofreces y den el siguiente paso.",
    includes: [
      "Estrategia de contenidos y redacción de textos",
      "Diseño propio, sin plantillas",
      "Desarrollo optimizado para móvil, velocidad y SEO",
      "Integración con reservas, formularios, tienda o tus herramientas",
    ],
    forWhom:
      "Para negocios cuya web no refleja lo que son o no genera contactos.",
  },
];

export const processIntro = {
  title: "Cómo trabajamos",
  body: "Un proceso por fases, con algo concreto que revisar al final de cada una. Sabes en todo momento qué estamos haciendo, por qué y qué viene después.",
};

export const processSteps = [
  {
    title: "Entendemos tu negocio",
    body: "Hablamos contigo y con quien haga falta de tu equipo: cómo trabajáis, quiénes son tus clientes y qué quieres conseguir.",
    deliverable: "Un resumen de lo que hemos entendido y las primeras ideas.",
  },
  {
    title: "Detectamos oportunidades",
    body: "Revisamos procesos, herramientas, datos y tu web actual. Separamos lo que la IA puede hacer bien de lo que no merece la pena.",
    deliverable: "Un diagnóstico con prioridades, esfuerzo estimado y riesgos.",
  },
  {
    title: "Diseñamos la solución",
    body: "Concretamos alcance, plazos y presupuesto. Antes de construir, validamos la idea con un prototipo que puedes probar.",
    deliverable: "Una propuesta cerrada por escrito y un prototipo navegable.",
  },
  {
    title: "Construimos contigo",
    body: "Desarrollamos en entregas cortas y probamos con tus datos y casos reales. Ajustamos lo necesario según lo que veas.",
    deliverable: "Versiones funcionales que revisas en cada entrega.",
  },
  {
    title: "Lanzamos y acompañamos",
    body: "Ponemos la solución en marcha, formamos a tu equipo y medimos cómo se usa para seguir mejorándola.",
    deliverable: "La solución funcionando, documentación y un plan de mejora.",
  },
];

export type Situation = {
  id: string;
  problem: string;
  context: string;
  approach: string;
  steps: string[];
  services: string[];
};

export const situationsIntro = {
  title: "Situaciones que podemos resolver",
  body: "Son algunos de los problemas que más se repiten en pequeñas y medianas empresas. No son casos de clientes: son ejemplos de cómo abordaríamos cada uno. La solución final siempre se ajusta después de conocer tu negocio.",
};

export const situations: Situation[] = [
  {
    id: "preguntas-repetidas",
    problem: "Respondemos las mismas preguntas todo el día",
    context:
      "Horarios, precios, plazos de entrega, cómo reservar. Tu equipo contesta lo mismo por teléfono, correo y mensajería, y el trabajo importante se queda esperando.",
    approach:
      "Un asistente que responde con la información real de tu negocio en la web o en tus canales de mensajería, y que pasa la conversación a una persona cuando la consulta lo necesita.",
    steps: [
      "Reunimos y ordenamos la información que hoy está en la cabeza de tu equipo",
      "Configuramos el asistente con límites claros sobre qué puede responder",
      "Revisamos las conversaciones para mejorar respuestas y detectar dudas nuevas",
    ],
    services: ["Automatización con IA", "Webs a medida"],
  },
  {
    id: "presupuestos",
    problem: "Preparar un presupuesto nos lleva demasiado tiempo",
    context:
      "Hay que juntar datos del cliente, consultar tarifas, revisar condiciones y dar formato al documento. Cada presupuesto se hace casi desde cero.",
    approach:
      "Un flujo que recoge los datos del cliente con un formulario guiado, consulta tus tarifas y genera un borrador que tu equipo revisa antes de enviarlo.",
    steps: [
      "Analizamos cómo se hacen hoy los presupuestos y qué partes se repiten",
      "Conectamos el formulario con tus tarifas y tu plantilla de documento",
      "Dejamos la revisión final y el envío en manos de tu equipo",
    ],
    services: ["Automatización con IA"],
  },
  {
    id: "web-sin-contactos",
    problem: "Tenemos web, pero no nos trae clientes",
    context:
      "La web existe, pero no explica con claridad qué haces ni para quién. Quien llega no sabe qué hacer a continuación y se marcha.",
    approach:
      "Replanteamos el mensaje y la estructura desde lo que busca tu cliente, rediseñamos la web y preparamos la medición para saber qué funciona.",
    steps: [
      "Estudiamos a tu cliente, tu competencia y cómo te encuentran",
      "Reescribimos los textos y diseñamos un recorrido claro hasta el contacto",
      "Lanzamos con analítica y revisamos los datos para seguir mejorando",
    ],
    services: ["Webs a medida", "Consultoría de IA"],
  },
  {
    id: "informacion-interna",
    problem: "Nadie encuentra la información interna",
    context:
      "Manuales, contratos, fichas de producto y procedimientos repartidos entre carpetas, correos y PDFs. Encontrar una respuesta supone preguntar a la persona de siempre.",
    approach:
      "Un buscador con IA sobre tus propios documentos que responde en lenguaje natural, indica de qué documento sale cada respuesta y respeta quién puede ver qué.",
    steps: [
      "Inventariamos y limpiamos las fuentes de información",
      "Definimos permisos según los perfiles de tu equipo",
      "Probamos con preguntas reales antes de abrirlo a todo el equipo",
    ],
    services: ["Consultoría de IA", "Automatización con IA"],
  },
  {
    id: "por-donde-empezar",
    problem: "Queremos usar IA, pero no sabemos por dónde empezar",
    context:
      "Se oye hablar de IA a todas horas y hay demasiadas herramientas. Probar sin rumbo cuesta dinero y tiempo, y es difícil saber qué sirve de verdad.",
    approach:
      "Un diagnóstico de tu negocio y un taller con tu equipo para elegir pocas iniciativas, empezar por la más clara y medir si funciona antes de ir a más.",
    steps: [
      "Detectamos tareas candidatas junto a las personas que las hacen",
      "Priorizamos según impacto esperado, esfuerzo y riesgo",
      "Lanzamos un piloto acotado con criterios claros de éxito",
    ],
    services: ["Consultoría de IA"],
  },
  {
    id: "pedidos-dispersos",
    problem: "Los pedidos nos llegan por demasiados canales",
    context:
      "Correo, formulario web, mensajería y teléfono. Cada solicitud acaba en un sitio distinto y alguna se pierde por el camino.",
    approach:
      "Centralizamos todas las entradas en un único lugar, las clasificamos automáticamente y avisamos a la persona responsable de cada una.",
    steps: [
      "Mapeamos por dónde entra cada tipo de solicitud",
      "Unificamos las entradas y definimos reglas de clasificación",
      "Creamos avisos y un panel sencillo para seguir cada caso",
    ],
    services: ["Automatización con IA"],
  },
];

export const principles = {
  title: "La tecnología es el medio. Tu negocio, el centro.",
  body: "Antes que herramientas, buscamos criterio: qué conviene hacer, en qué orden y qué no merece la pena. Así entendemos nuestro trabajo.",
  items: [
    {
      title: "IA solo donde aporta",
      body: "Si un problema se resuelve mejor con un proceso más sencillo o una hoja de cálculo bien hecha, te lo diremos.",
    },
    {
      title: "Personas al mando",
      body: "Diseñamos las automatizaciones para que tu equipo revise y decida en los puntos importantes.",
    },
    {
      title: "Tus datos, bajo control",
      body: "Usamos solo lo imprescindible y te explicamos dónde está cada dato y quién puede verlo.",
    },
    {
      title: "Sin dependencias ocultas",
      body: "Cuentas, código y documentación a nombre de tu empresa. Puedes seguir sin nosotros cuando quieras.",
    },
  ],
};

export const faqIntro = {
  title: "Preguntas frecuentes",
  aside: "¿No encuentras tu pregunta?",
  asideLink: "Escríbenos",
};

export const faqs = [
  {
    question: "¿Necesito saber de tecnología para trabajar con vosotros?",
    answer:
      "No. Tú nos cuentas cómo funciona tu negocio y nosotros lo traducimos a soluciones. Te explicamos cada decisión en lenguaje claro y no damos nada por sabido.",
  },
  {
    question: "¿Cuánto cuesta un proyecto?",
    answer:
      "Depende del alcance: no cuesta lo mismo automatizar una tarea que construir una web con varias integraciones. Después de la primera conversación y del diagnóstico te damos un presupuesto cerrado por escrito, dividido por fases, para que sepas qué pagas en cada momento.",
  },
  {
    question: "¿Cuánto tiempo se tarda?",
    answer:
      "También depende del alcance. Una mejora concreta puede estar lista mucho antes que una web completa o que una integración con varios sistemas. En la propuesta incluimos un calendario por fases con fechas para cada entrega.",
  },
  {
    question: "¿Qué pasa con los datos de mi empresa y de mis clientes?",
    answer:
      "Usamos solo los datos imprescindibles, priorizamos proveedores con garantías de privacidad adecuadas y diseñamos cada solución teniendo en cuenta el RGPD. Antes de empezar te explicamos qué datos se usan, dónde se guardan y quién tiene acceso.",
  },
  {
    question: "¿La IA va a sustituir a mi equipo?",
    answer:
      "Nuestro enfoque es otro: quitar a tu equipo las tareas repetitivas para que dedique su tiempo a lo que requiere criterio y trato personal. Las decisiones importantes siguen en manos de personas.",
  },
  {
    question: "¿Podéis trabajar con las herramientas que ya usamos?",
    answer:
      "Siempre que sea posible, sí. Antes de proponer nada nuevo revisamos lo que ya tenéis, como el correo, el CRM, las hojas de cálculo, el ERP o la tienda online, y buscamos la forma de conectarlo.",
  },
  {
    question: "¿La web será mía? ¿Podré actualizarla yo?",
    answer:
      "Sí. El dominio, el código y los contenidos quedan a nombre de tu empresa. Si necesitas editar textos o publicar contenido, preparamos un sistema de gestión sencillo y te enseñamos a usarlo.",
  },
  {
    question: "¿Qué pasa después del lanzamiento?",
    answer:
      "Podemos acompañarte con mantenimiento, mejoras y revisión de resultados. Si prefieres que lo gestione tu equipo, te dejamos documentación y formación para que no dependas de nosotros.",
  },
];

export const contactIntro = {
  title: "Cuéntanos qué quieres mejorar",
  body: "Una primera conversación sin compromiso para entender tu caso. Si creemos que podemos ayudarte, te lo diremos con un plan. Si no, también.",
  nextSteps: [
    "Leemos tu mensaje y, si hace falta, te pedimos algún dato más.",
    "Hablamos por videollamada o por teléfono para entender tu negocio.",
    "Te enviamos una propuesta por escrito con alcance, plazos y presupuesto.",
  ],
};
