import type { StaticImageData } from "next/image";
import svcCorporativa from "@/assets/renders/svc-corporativa.webp";
import svcLanding from "@/assets/renders/svc-landing.webp";
import svcRediseno from "@/assets/renders/svc-rediseno.webp";
import procConversacion from "@/assets/renders/proc-conversacion.webp";
import procPropuesta from "@/assets/renders/proc-propuesta.webp";
import procDiseno from "@/assets/renders/proc-diseno.webp";
import procDesarrollo from "@/assets/renders/proc-desarrollo.webp";
import procPublicacion from "@/assets/renders/proc-publicacion.webp";
import workRestaurante from "@/assets/renders/work-restaurante.webp";
import workArquitectura from "@/assets/renders/work-arquitectura.webp";
import workInstalaciones from "@/assets/renders/work-instalaciones.webp";
import story0Wide from "@/assets/renders/story-0-ancho.webp";
import story0Tall from "@/assets/renders/story-0-alto.webp";
import story1Wide from "@/assets/renders/story-1-ancho.webp";
import story1Tall from "@/assets/renders/story-1-alto.webp";
import story2Wide from "@/assets/renders/story-2-ancho.webp";
import story2Tall from "@/assets/renders/story-2-alto.webp";
import story3Wide from "@/assets/renders/story-3-ancho.webp";
import story3Tall from "@/assets/renders/story-3-alto.webp";
import story4Wide from "@/assets/renders/story-4-ancho.webp";
import story4Tall from "@/assets/renders/story-4-alto.webp";
import type { ConceptId, ServiceId } from "@/content/home";

/*
 * Renders 3D de las secciones. Se generan con el laboratorio de render
 * (`npm run dev` → /estudio-3d), con el mismo motor que la portada en vivo.
 */

export const serviceRenders: Record<ServiceId, StaticImageData> = {
  corporativa: svcCorporativa,
  landing: svcLanding,
  rediseno: svcRediseno,
};

export const processRenders: StaticImageData[] = [
  procConversacion,
  procPropuesta,
  procDiseno,
  procDesarrollo,
  procPublicacion,
];

export const conceptRenders: Record<ConceptId, StaticImageData> = {
  restaurante: workRestaurante,
  arquitectura: workArquitectura,
  instalaciones: workInstalaciones,
};

/** Fotogramas del escaparate de la portada: horizontal (escritorio) y vertical (móvil). */
export const storyRenders: { wide: StaticImageData; tall: StaticImageData }[] = [
  { wide: story0Wide, tall: story0Tall },
  { wide: story1Wide, tall: story1Tall },
  { wide: story2Wide, tall: story2Tall },
  { wide: story3Wide, tall: story3Tall },
  { wide: story4Wide, tall: story4Tall },
];
