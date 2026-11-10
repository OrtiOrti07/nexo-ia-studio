/**
 * Contenido de la página de inicio.
 *
 * Regla editorial: no se inventan clientes, cifras, testimonios ni
 * certificaciones. Los proyectos son demostraciones conceptuales y se presentan
 * como tales.
 */

export type ServiceId =
  | "automatizacion"
  | "agentes"
  | "asistentes"
  | "integracion"
  | "estrategia"
  | "medida";

export const hero = {
  title: "Diseñamos la inteligencia que mueve tu empresa.",
  lead: "Agentes, automatizaciones y asistentes de IA construidos sobre tus procesos reales. Estrategia, desarrollo e integración con un mismo equipo, de la primera idea a la puesta en marcha.",
  primaryCta: "Transforma tu negocio",
  secondaryCta: "Descubre nuestros servicios",
  scrollHint: "Desliza para explorar",
};

export const servicesIntro = {
  title: "Seis formas de poner la IA a trabajar",
  body: "Cada servicio resuelve un problema concreto. Puedes empezar por uno y sumar los demás cuando tenga sentido.",
};

export type Service = {
  id: ServiceId;
  title: string;
  short: string;
  body: string;
  includes: string[];
  /** Acento del panel: cambia la luz de cada servicio. */
  accent: "blue" | "violet" | "cyan";
};

export const services: Service[] = [
  {
    id: "automatizacion",
    title: "Automatización inteligente de procesos",
    short: "Automatización",
    body: "Convertimos tareas repetitivas en flujos que se ejecutan solos: leer documentos, clasificar solicitudes, mover datos entre herramientas y avisar a la persona adecuada.",
    includes: ["Lectura de correos y documentos", "Flujos entre tus herramientas", "Revisión humana donde importa"],
    accent: "blue",
  },
  {
    id: "agentes",
    title: "Desarrollo de agentes de IA",
    short: "Agentes",
    body: "Agentes que razonan, consultan tus sistemas y completan tareas de principio a fin, con límites claros y un registro de cada paso que dan.",
    includes: ["Herramientas y permisos propios", "Trazabilidad de cada acción", "Despliegue en tu infraestructura"],
    accent: "violet",
  },
  {
    id: "asistentes",
    title: "Chatbots y asistentes virtuales",
    short: "Asistentes",
    body: "Asistentes que responden con la información real de tu negocio en la web, WhatsApp o tu intranet, y pasan la conversación a una persona cuando hace falta.",
    includes: ["Web, WhatsApp e intranet", "Base de conocimiento propia", "Traspaso a tu equipo"],
    accent: "cyan",
  },
  {
    id: "integracion",
    title: "Integración de IA en tu empresa",
    short: "Integración",
    body: "Llevamos la IA a las herramientas que ya usas, como el CRM, el ERP, el correo o tus documentos, sin obligarte a cambiar de sistema.",
    includes: ["Conectores y APIs", "Seguridad y control de accesos", "Formación del equipo"],
    accent: "blue",
  },
  {
    id: "estrategia",
    title: "Consultoría y estrategia de IA",
    short: "Estrategia",
    body: "Analizamos dónde aporta valor la IA en tu empresa, priorizamos por impacto y riesgo y diseñamos una hoja de ruta que se pueda cumplir.",
    includes: ["Diagnóstico y priorización", "Hoja de ruta por fases", "RGPD y Reglamento europeo de IA"],
    accent: "violet",
  },
  {
    id: "medida",
    title: "Soluciones a medida",
    short: "A medida",
    body: "Cuando no existe una herramienta para tu problema, la construimos: aplicaciones, paneles y modelos ajustados a tu caso, desde el prototipo hasta producción.",
    includes: ["Prototipo antes de construir", "Desarrollo completo", "Mantenimiento y mejora"],
    accent: "cyan",
  },
];

export const processIntro = {
  title: "Del ruido a la señal",
  body: "Un método en cinco fases. En cada una sabes qué hacemos, por qué y qué recibes.",
};

export const processSteps = [
  {
    title: "Análisis del negocio",
    body: "Entendemos cómo trabaja tu equipo: procesos, datos, herramientas y objetivos. Hablamos con quien hace el trabajo, no solo con quien lo dirige.",
    output: "Mapa de procesos y puntos de fricción",
  },
  {
    title: "Identificación de oportunidades",
    body: "Señalamos dónde la IA ahorra tiempo o mejora decisiones, y lo ordenamos por impacto, esfuerzo y riesgo.",
    output: "Lista priorizada y propuesta cerrada",
  },
  {
    title: "Desarrollo de soluciones",
    body: "Prototipamos, lo probamos con tu equipo y con datos reales, y construimos la versión definitiva por entregas cortas.",
    output: "Prototipo validado y versiones funcionales",
  },
  {
    title: "Integración tecnológica",
    body: "Conectamos la solución con tus sistemas, con permisos, seguridad y registro de actividad desde el primer día.",
    output: "Solución en producción y documentada",
  },
  {
    title: "Optimización continua",
    body: "Medimos cómo se usa, ajustamos lo que falla y ampliamos lo que funciona. La IA mejora con el uso si alguien la cuida.",
    output: "Informe de uso y plan de mejora",
  },
];

export type CaseVisual = "invoices" | "support" | "planning" | "agent";

export const casesIntro = {
  title: "Proyectos de demostración",
  body: "Cuatro ejemplos conceptuales de lo que construimos. No son clientes reales: muestran cómo abordaríamos cada problema.",
};

export const cases: {
  id: string;
  label: string;
  area: string;
  title: string;
  problem: string;
  solution: string;
  stack: string[];
  visual: CaseVisual;
}[] = [
  {
    id: "facturas",
    label: "Demo 01",
    area: "Automatización empresarial",
    title: "Facturas de proveedores que se registran solas",
    problem: "Un equipo de administración copia a mano cada factura del correo al ERP y cruza los datos con los pedidos.",
    solution: "Un flujo lee las facturas al llegar, extrae los datos, los valida contra el pedido y deja el asiento listo para aprobar.",
    stack: ["Lectura de documentos", "Validación", "ERP"],
    visual: "invoices",
  },
  {
    id: "soporte",
    label: "Demo 02",
    area: "Atención al cliente con IA",
    title: "Un asistente que resuelve y sabe cuándo pasar a una persona",
    problem: "Una tienda online responde las mismas preguntas sobre pedidos y devoluciones por correo, chat y teléfono.",
    solution: "Un asistente consulta el estado real del pedido, responde con la política de la tienda y deriva a una persona los casos delicados.",
    stack: ["Asistente", "Consulta de pedidos", "Traspaso humano"],
    visual: "support",
  },
  {
    id: "planificacion",
    label: "Demo 03",
    area: "Optimización de procesos",
    title: "Planificación semanal propuesta en minutos",
    problem: "Un taller organiza turnos y pedidos en una hoja de cálculo que se rehace cada semana y depende de una sola persona.",
    solution: "Un sistema propone la planificación con las restricciones del taller y el responsable solo revisa y ajusta.",
    stack: ["Optimización", "Restricciones", "Panel de revisión"],
    visual: "planning",
  },
  {
    id: "agente",
    label: "Demo 04",
    area: "Agentes inteligentes",
    title: "Un agente comercial que prepara propuestas",
    problem: "Preparar una propuesta exige consultar el CRM, el catálogo y las tarifas, y se tarda días en enviarla.",
    solution: "Un agente reúne la información del cliente, calcula el presupuesto con las tarifas vigentes y redacta un borrador para revisar.",
    stack: ["Agente", "CRM", "Generación de documentos"],
    visual: "agent",
  },
];

export const finalCta = {
  title: "Tu próximo salto tecnológico empieza aquí.",
  body: "Cuéntanos qué quieres mejorar. En la primera conversación te proponemos un primer paso concreto, con alcance y plazos claros.",
  button: "Agenda una conversación",
};

export const contactIntro = {
  title: "Hablemos de tu proyecto",
  body: "Escríbenos con lo que tengas en mente, aunque solo sea una intuición. Leemos cada mensaje y respondemos personalmente.",
  nextSteps: [
    "Leemos tu mensaje y, si hace falta, te pedimos algún dato más.",
    "Hablamos para entender tu negocio y lo que quieres conseguir.",
    "Te enviamos una propuesta con alcance, plazos y presupuesto.",
  ],
};
