import * as THREE from "three";
import { button, chip, cursor, laptop, panel, phone, tablet } from "./devices";
import {
  buttonFace,
  chatMobile,
  chipFace,
  cierzoDesk,
  cierzoMobile,
  codeEditor,
  designTool,
  faroDesk,
  faroMobile,
  keyboard,
  lumbreDesk,
  lumbreMobile,
  oldSite,
  proposalTablet,
  tagFace,
  tuContact,
  tuHome,
  tuLanding,
  tuMobile,
  tuServices,
} from "./screens";
import { contactShadow, type Studio } from "./studio";

/*
 * Composiciones de las escenas. Cada una coloca dispositivos en `studio.root`
 * y dice desde dónde mirarla. La portada se anima en vivo; el resto se
 * renderiza una vez como imagen (ver RenderLab).
 */

type Pointer = { x: number; y: number };

export type Built = {
  /** Dirección de la cámara desde el centro de la escena. */
  dir: [number, number, number];
  /** Fracción de la pantalla que puede ocupar la escena (1 = hasta el borde). */
  margin?: number;
  /** Desplaza el punto al que mira la cámara (en altura). */
  lift?: number;
  /** Animación continua (solo en la portada en vivo). */
  tick?: (t: number, pointer: Pointer) => void;
};

export type SceneDef = {
  /** Proporción ancho / alto de la imagen. */
  aspect: number;
  build: (s: Studio) => Built;
};

function place<T extends THREE.Object3D>(
  obj: T,
  pos: [number, number, number],
  rot: [number, number, number] = [0, 0, 0],
  scale = 1,
) {
  obj.position.set(...pos);
  obj.rotation.set(...rot);
  obj.scale.multiplyScalar(scale);
  return obj;
}

/** Dispositivo flotante con su sombra de contacto en el suelo. */
function floating(s: Studio, obj: THREE.Object3D, shadow: [number, number, number]) {
  s.root.add(obj);
  const sh = contactShadow(shadow[0], shadow[1], shadow[2]);
  sh.position.x = obj.position.x;
  sh.position.z = obj.position.z;
  s.root.add(sh);
  return obj;
}

const keysTex = (s: Studio) => s.texture(keyboard());

/** Etiqueta con la proporción exacta de su textura y altura `h`. */
function label(s: Studio, face: HTMLCanvasElement, h: number) {
  return overlay(chip(s.texture(face), (h * face.width) / face.height, h));
}

/** Etiquetas y cursores: no proyectan sombra (son elementos de interfaz). */
function overlay<T extends THREE.Object3D>(obj: T) {
  obj.traverse((o) => {
    o.castShadow = false;
  });
  return obj;
}

/** Portátil delante y móvil al lado (conceptos y algunos pasos). */
function laptopAndPhone(
  s: Studio,
  desk: HTMLCanvasElement,
  mobile: HTMLCanvasElement,
  opts: { mirror?: boolean; color?: string; phoneColor?: string; phoneX?: number } = {},
) {
  const m = opts.mirror ? -1 : 1;
  const lap = laptop(s.texture(desk), keysTex(s), { color: opts.color });
  place(lap, [-0.25 * m, 0, 0], [0, 0.32 * m, 0]);
  s.root.add(lap);
  s.root.add(place(contactShadow(4.4, 3.2, 0.42), [-0.25 * m, 0, 0.05]));
  const ph = phone(s.texture(mobile), { color: opts.phoneColor });
  floating(s, place(ph, [(opts.phoneX ?? 2.05) * m, 1.05, 1.15], [-0.04, -0.42 * m, 0.03 * m]), [1.3, 0.7, 0.32]);
  return { lap, ph };
}

export const SCENES = {
  /** Web corporativa: varias páginas de la misma web, escalonadas en profundidad. */
  "svc-corporativa": {
    aspect: 4 / 3,
    build(s) {
      const pages = [tuContact(), tuServices(), tuHome(1600, 1000)];
      pages.forEach((c, i) => {
        const w = 2.5;
        const h = i === 2 ? w / 1.6 : w / 1.5;
        floating(s, place(panel(s.texture(c), w, h), [-1.7 + i * 0.85, 2.45 - i * 0.62, -1.7 + i * 0.85], [-0.04, 0.5, 0]), [2.6, 1.1, 0.16]);
      });
      return { dir: [0.75, 0.38, 1], margin: 0.92 };
    },
  },

  /** Landing page: una página larga y un botón que sobresale. */
  "svc-landing": {
    aspect: 4 / 3,
    build(s) {
      floating(s, place(panel(s.texture(tuLanding()), 1.7, 3.825), [0, 2.1, 0], [-0.08, 0.45, 0.02]), [2, 1.4, 0.2]);
      floating(s, place(button(s.texture(buttonFace("Pide presupuesto")), 2.1, 0.5, "#b8924a"), [0.55, 1.75, 0.95], [0, 0.4, 0]), [2, 0.5, 0.18]);
      s.root.add(overlay(place(cursor(0.24), [1.45, 1.62, 1.2], [0, 0.4, 0.1])));
      return { dir: [0.7, 0.3, 1], margin: 0.9 };
    },
  },

  /** Rediseño: la web antigua detrás y la nueva, en portátil, delante. */
  "svc-rediseno": {
    aspect: 4 / 3,
    build(s) {
      const old = floating(s, place(panel(s.texture(oldSite()), 2.5, 1.667), [-1.75, 2.05, -1.5], [0.04, 0.5, -0.06]), [2.6, 1, 0.14]);
      old.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh && m.material instanceof THREE.MeshPhysicalMaterial && m.material.emissiveMap) m.material.emissiveIntensity = 0.82;
      });
      const lap = laptop(s.texture(tuHome()), keysTex(s));
      place(lap, [0.55, 0, 0.35], [0, 0.32, 0]);
      s.root.add(lap, place(contactShadow(4.4, 3.2, 0.42), [0.55, 0, 0.4]));
      s.root.add(place(label(s, tagFace("Antes", "#535c6e"), 0.26), [-2.45, 3.0, -1.2], [0, 0.5, 0]));
      s.root.add(place(label(s, tagFace("Después"), 0.28), [2.35, 1.55, 1.1], [0, 0.32, 0]));
      return { dir: [0.75, 0.42, 1], margin: 0.92 };
    },
  },

  "proc-conversacion": {
    aspect: 100 / 82,
    build(s) {
      floating(s, place(phone(s.texture(chatMobile())), [0, 1.2, 0], [-0.06, -0.38, 0.05], 1.25), [1.5, 0.8, 0.32]);
      s.root.add(place(label(s, chipFace("Primera conversación", "dot"), 0.3), [-1.0, 1.75, 0.6], [0, -0.38, 0]));
      return { dir: [0.55, 0.3, 1], margin: 0.84 };
    },
  },

  "proc-propuesta": {
    aspect: 100 / 82,
    build(s) {
      floating(s, place(tablet(s.texture(proposalTablet())), [0, 1.3, 0], [-0.12, 0.42, 0.03]), [2, 1, 0.3]);
      s.root.add(place(label(s, chipFace("Alcance, plazos y presupuesto", "check"), 0.24), [-0.35, 2.55, 0.55], [0, 0.42, 0]));
      return { dir: [0.6, 0.32, 1], margin: 0.86 };
    },
  },

  "proc-diseno": {
    aspect: 100 / 82,
    build(s) {
      const lap = laptop(s.texture(designTool()), keysTex(s));
      place(lap, [0, 0, 0], [0, 0.36, 0]);
      s.root.add(lap, place(contactShadow(4.4, 3.2, 0.42), [0, 0, 0.05]));
      return { dir: [0.62, 0.42, 1], margin: 0.9 };
    },
  },

  "proc-desarrollo": {
    aspect: 100 / 82,
    build(s) {
      laptopAndPhone(s, codeEditor(), tuMobile(), { color: "#5b616d", phoneColor: "#c3c8d1" });
      return { dir: [0.62, 0.42, 1], margin: 0.92 };
    },
  },

  "proc-publicacion": {
    aspect: 100 / 82,
    build(s) {
      laptopAndPhone(s, tuHome(), tuMobile());
      s.root.add(place(label(s, chipFace("Publicada", "dot"), 0.27), [-1.95, 2.55, 0.35], [0, 0.32, 0]));
      s.root.add(place(label(s, chipFace("tuempresa.es", "lock"), 0.27), [1.2, 2.85, 0.25], [0, 0.1, 0]));
      return { dir: [0.62, 0.42, 1], margin: 0.92 };
    },
  },

  "work-restaurante": {
    aspect: 100 / 70,
    build(s) {
      laptopAndPhone(s, lumbreDesk(), lumbreMobile(), { color: "#5b616d", phoneColor: "#2a2f39" });
      return { dir: [0.62, 0.36, 1], margin: 0.94 };
    },
  },

  "work-arquitectura": {
    aspect: 100 / 70,
    build(s) {
      laptopAndPhone(s, cierzoDesk(), cierzoMobile(), { mirror: true, color: "#c3c8d1", phoneColor: "#d6d9df", phoneX: 2.35 });
      return { dir: [-0.62, 0.36, 1], margin: 0.94 };
    },
  },

  "work-instalaciones": {
    aspect: 100 / 70,
    build(s) {
      laptopAndPhone(s, faroDesk(), faroMobile(), { color: "#c3c8d1", phoneColor: "#3a404c" });
      return { dir: [0.62, 0.36, 1], margin: 0.94 };
    },
  },
} satisfies Record<string, SceneDef>;

export type SceneId = keyof typeof SCENES;
export const SCENE_IDS = Object.keys(SCENES) as SceneId[];
