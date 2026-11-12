import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { Reflector } from "three/addons/objects/Reflector.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { laptop, phone } from "./devices";
import { FONTS, loadFonts } from "./paint";
import {
  cierzoDesk,
  cierzoMobile,
  faroDesk,
  faroMobile,
  keyboard,
  lumbreDesk,
  lumbreMobile,
  tuHomeLong,
  tuMobile,
} from "./screens";

/*
 * Escaparate 3D de la portada: escena oscura de cine con un portátil en
 * tiempo real. Con el scroll (progreso p de 0 a 1) el portátil se abre, la
 * pantalla se enciende con un destello, se recorre la web, llega el móvil
 * girando y los conceptos pasan con una cortinilla de luz. Al cargar, la luz
 * sube desde la oscuridad (intro) y un brillo recorre la tapa de vez en cuando.
 */

export const BG = "#05070d";
export const STAGE_COUNT = 5;

export type Quality = "high" | "low";

type V3 = [number, number, number];
type Key = {
  cam: V3;
  look: V3;
  lapRot: number;
  lapY: number;
  tilt: number;
  lid: number;
  word: number;
};

// Un fotograma clave por etapa (p = 0, .25, .5, .75, 1)
const KEYS: Key[] = [
  { cam: [3.3, 1.9, 6.9], look: [-1.05, 1.0, 0], lapRot: 0.5, lapY: 0.75, tilt: 0.42, lid: 1.53, word: 1 },
  { cam: [2.9, 2.4, 7.6], look: [-1.25, 1.0, 0], lapRot: 0.3, lapY: 0.02, tilt: 0, lid: -0.3, word: 0.3 },
  { cam: [1.1, 1.85, 5.0], look: [-0.8, 1.12, -0.4], lapRot: 0.1, lapY: 0, tilt: 0, lid: -0.3, word: 0 },
  { cam: [3.5, 2.4, 8.8], look: [-0.7, 1.0, 0.3], lapRot: 0.3, lapY: 0, tilt: 0, lid: -0.3, word: 0 },
  { cam: [4.2, 2.8, 9.4], look: [-0.9, 1.0, 0.3], lapRot: 0.36, lapY: 0, tilt: 0, lid: -0.3, word: 0 },
];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => x * x * (3 - 2 * x);
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
/** 0 → 1 → 0 dentro de [a, b]. */
const bump = (x: number, a: number, b: number) => {
  const t = clamp01((x - a) / (b - a));
  return Math.sin(t * Math.PI);
};

function keyAt(p: number): Key {
  const x = Math.min(0.9999, Math.max(0, p)) * (KEYS.length - 1);
  const i = Math.floor(x);
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const t = easeInOut(x - i);
  // La tapa se abre antes que el resto del movimiento
  const tl = smooth(Math.min(1, (x - i) * 1.6));
  return {
    cam: lerp3(a.cam, b.cam, t),
    look: lerp3(a.look, b.look, t),
    lapRot: lerp(a.lapRot, b.lapRot, t),
    lapY: lerp(a.lapY, b.lapY, t),
    tilt: lerp(a.tilt, b.tilt, t),
    lid: lerp(a.lid, b.lid, tl),
    word: lerp(a.word, b.word, t),
  };
}

function canvasTexture(c: HTMLCanvasElement, maxAniso: number) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = maxAniso;
  return t;
}

/** Palabra gigante detrás del portátil, con degradado. */
function wordTexture(text: string) {
  const c = document.createElement("canvas");
  c.width = 2400;
  c.height = 600;
  const ctx = c.getContext("2d")!;
  ctx.font = `800 470px ${FONTS.display}`;
  if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "-12px";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const g = ctx.createLinearGradient(0, 80, 0, 560);
  g.addColorStop(0, "rgba(150,170,255,0.32)");
  g.addColorStop(0.55, "rgba(46,91,255,0.12)");
  g.addColorStop(1, "rgba(46,91,255,0)");
  ctx.fillStyle = g;
  ctx.fillText(text, 1200, 320);
  return c;
}

/** Silueta de la marca (dos ventanas) en blanco sobre negro, para el emblema de la tapa. */
function emblemTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 256, 256);
  ctx.save();
  ctx.scale(8, 8);
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  ctx.lineWidth = 1.9;
  ctx.beginPath();
  ctx.roundRect(2.5, 4, 19, 15.5, 3.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(10, 11.5, 19.5, 16.5, 3.2);
  ctx.fill();
  ctx.restore();
  return c;
}

function radialTexture(stops: [number, string][]) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  stops.forEach(([o, col]) => g.addColorStop(o, col));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return c;
}

/**
 * Pantalla con cortinilla: mezcla dos texturas con un borde de luz diagonal,
 * permite recorrer una página larga (offset/repeat) y subir el brillo por
 * encima de 1 para que el «bloom» haga el destello de encendido.
 */
function screenMaterial(a: THREE.Texture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      mapA: { value: a },
      mapB: { value: a },
      uvA: { value: new THREE.Vector4(0, 0, 1, 1) },
      uvB: { value: new THREE.Vector4(0, 0, 1, 1) },
      mixT: { value: 0 },
      bright: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D mapA;
      uniform sampler2D mapB;
      uniform vec4 uvA;
      uniform vec4 uvB;
      uniform float mixT;
      uniform float bright;
      varying vec2 vUv;
      void main() {
        vec3 a = texture2D(mapA, uvA.xy + vUv * uvA.zw).rgb;
        vec3 b = texture2D(mapB, uvB.xy + vUv * uvB.zw).rgb;
        float d = vUv.x * 0.8 + (1.0 - vUv.y) * 0.2;
        float t = mixT * 1.12 - 0.06;
        float m = 1.0 - smoothstep(t - 0.035, t + 0.035, d);
        vec3 col = mix(a, b, m);
        float edge = exp(-pow((d - t) / 0.018, 2.0)) * step(0.001, mixT) * step(mixT, 0.999);
        col += vec3(0.55, 0.68, 1.0) * edge * 1.6;
        gl_FragColor = vec4(col * bright, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
}

export type Showcase = {
  setSize: (w: number, h: number, dpr: number) => void;
  /** Coloca la escena en el progreso `p` (0-1); `t` en segundos; `intro` de 0 a 1; `pointer` de -0.5 a 0.5. */
  update: (p: number, t: number, intro?: number, pointer?: { x: number; y: number }) => void;
  render: () => void;
  setBloom: (on: boolean) => void;
  setReflections: (on: boolean) => void;
  compile: () => Promise<void>;
  dispose: () => void;
};

export async function createShowcase(
  canvas: HTMLCanvasElement,
  opts: { still?: boolean; quality?: Quality } = {},
): Promise<Showcase> {
  await loadFonts();
  const low = opts.quality === "low";
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !low,
    preserveDrawingBuffer: Boolean(opts.still),
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const tex = (c: HTMLCanvasElement) => canvasTexture(c, maxAniso);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.32;

  const camera = new THREE.PerspectiveCamera(30, 16 / 9, 0.1, 100);

  // ---------- Luces ----------
  RectAreaLightUniformsLib.init();
  const key = new THREE.SpotLight("#ffffff", 140, 0, 0.55, 0.85, 2);
  key.position.set(-2.6, 7.5, 4.2);
  key.target.position.set(0, 0.6, 0);
  scene.add(key, key.target);
  const rimLeft = new THREE.DirectionalLight("#4f72ff", 4.2);
  rimLeft.position.set(-7, 3, -5);
  const rimRight = new THREE.DirectionalLight("#a9bcff", 3.2);
  rimRight.position.set(7, 4.5, -4);
  // Luz que cruza la tapa: el brillo que la recorre de vez en cuando
  const sweep = new THREE.DirectionalLight("#ffffff", 0);
  scene.add(rimLeft, rimRight, sweep, new THREE.HemisphereLight("#2a3656", "#05070d", 0.9));

  // ---------- Fondo: halo, palabra gigante, partículas ----------
  const glowMat = new THREE.MeshBasicMaterial({
    map: tex(radialTexture([
      [0, "rgba(46,91,255,0.24)"],
      [0.5, "rgba(46,91,255,0.07)"],
      [0.75, "rgba(46,91,255,0)"],
      [1, "rgba(46,91,255,0)"],
    ])),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), glowMat);
  glow.position.set(-0.2, 3.5, -5);
  glow.renderOrder = 2; // el suelo (que funde el reflejo) se pinta antes
  scene.add(glow);

  const wordMat = new THREE.MeshBasicMaterial({ map: tex(wordTexture("A MEDIDA")), transparent: true, depthWrite: false, toneMapped: false });
  const word = new THREE.Mesh(new THREE.PlaneGeometry(8.4, 2.1), wordMat);
  word.position.set(-1.7, 3.0, -4.6);
  word.renderOrder = 2;
  scene.add(word);

  const count = low ? 320 : 700;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = Math.random() * 6;
    positions[i * 3 + 2] = -6 + Math.random() * 10;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const dustMat = new THREE.PointsMaterial({
    color: "#8ea6ff",
    size: low ? 0.04 : 0.028,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    map: tex(radialTexture([
      [0, "rgba(255,255,255,1)"],
      [1, "rgba(255,255,255,0)"],
    ])),
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  dust.renderOrder = 2;
  scene.add(dust);

  // ---------- Suelo con reflejo que se funde con el fondo ----------
  const mirror = new Reflector(new THREE.PlaneGeometry(40, 40), {
    clipBias: 0.003,
    textureWidth: low ? 512 : 1024,
    textureHeight: low ? 512 : 1024,
    color: new THREE.Color("#171a21"),
  });
  mirror.rotation.x = -Math.PI / 2;
  scene.add(mirror);
  const fade = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshBasicMaterial({
      map: tex(radialTexture([
        [0, "rgba(9,12,24,0.62)"],
        [0.14, "rgba(7,9,18,0.8)"],
        [0.34, "rgba(5,7,13,1)"],
        [1, "rgba(5,7,13,1)"],
      ])),
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  fade.rotation.x = -Math.PI / 2;
  fade.position.set(0, 0.002, 0.6);
  fade.renderOrder = 1;
  scene.add(fade);

  // ---------- Dispositivos ----------
  const longTex = tex(tuHomeLong());
  const longRepeat = 1000 / 3134;
  const desk = [longTex, tex(lumbreDesk(1600, 1000, false)), tex(cierzoDesk(1600, 1000, false)), tex(faroDesk(1600, 1000, false))];
  const mobile = [tex(tuMobile()), tex(lumbreMobile()), tex(cierzoMobile()), tex(faroMobile())];

  const emblem = new THREE.CanvasTexture(emblemTexture());
  const lap = laptop(desk[0], tex(keyboard()), { color: "#b9bfca", emblem });
  scene.add(lap);
  const hinge = lap.userData.hinge as THREE.Group;
  const lapDisplay = lap.userData.display as THREE.Mesh;
  (lapDisplay.material as THREE.Material).dispose();
  const lapScreen = screenMaterial(desk[0]);
  lapDisplay.material = lapScreen;

  // Luz de la pantalla sobre el teclado
  const screenLight = new THREE.RectAreaLight("#cfd9ff", 0, 2.9, 1.8);
  screenLight.position.set(0, 1.08, 0.05);
  screenLight.rotation.y = Math.PI;
  hinge.add(screenLight);

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 3.4),
    new THREE.MeshBasicMaterial({
      map: tex(radialTexture([
        [0, "rgba(0,0,0,0.85)"],
        [0.6, "rgba(0,0,0,0.35)"],
        [1, "rgba(0,0,0,0)"],
      ])),
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.004;
  scene.add(shadow);

  const ph = phone(mobile[0], { color: "#2b303b" });
  scene.add(ph);
  const phDisplay = ph.userData.display as THREE.Mesh;
  (phDisplay.material as THREE.Material).dispose();
  const phoneScreen = screenMaterial(mobile[0]);
  phDisplay.material = phoneScreen;

  // ---------- Posprocesado: brillo ----------
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.38, 0.55, 1.05);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  let aspect = 16 / 9;
  // Vectores reutilizados en cada fotograma (sin crear basura en el bucle)
  const look = new THREE.Vector3();
  const cam = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const longUv = new THREE.Vector4(0, 0, 1, longRepeat);
  const fullUv = new THREE.Vector4(0, 0, 1, 1);

  // Conceptos al final: cambios de pantalla en estos puntos del scroll
  const SWITCH = [0.82, 0.88, 0.94];
  const WIPE = 0.045;

  return {
    setSize(w, h, dpr) {
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      composer.setPixelRatio(dpr);
      composer.setSize(w, h);
      aspect = w / h;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    },
    update(p, t, intro = 1, pointer = { x: 0, y: 0 }) {
      const k = keyAt(p);
      const idle = 1 - clamp01(p * 4);
      const ie = easeOutExpo(intro);

      // ----- Cámara -----
      cam.set(...k.cam);
      look.set(...k.look);
      if (aspect < 1.15) {
        // Vertical: centrado entre portátil y móvil, y el objeto en la mitad superior
        const phoneIn = smooth(clamp01((p - 0.5) / 0.25));
        look.x = 0.9 * phoneIn;
        look.y -= 0.85 + 0.75 * idle;
        dir.copy(cam).sub(look);
        cam.copy(look).add(dir.multiplyScalar(Math.pow(1.6 / aspect, 0.82)));
      }
      // Intro: la cámara llega desde más cerca y más baja
      dir.copy(cam).sub(look);
      cam.copy(look).add(dir.multiplyScalar(lerp(0.78, 1, ie)));
      cam.y -= (1 - ie) * 0.6;
      // Deriva de cámara en mano y parallax del ratón
      cam.x += Math.sin(t * 0.5) * 0.05 + pointer.x * 0.5;
      cam.y += Math.sin(t * 0.37) * 0.035 - pointer.y * 0.3;
      camera.position.copy(cam);
      camera.lookAt(look);

      // ----- Luz: sube desde la oscuridad -----
      renderer.toneMappingExposure = lerp(0.18, 1.1, easeOutCubic(intro));
      // Barrido de brillo sobre la tapa (al cargar y luego cada 7 s, solo al principio)
      const cycle = intro < 1 ? intro * 1.4 : ((t % 7) / 1.6);
      sweep.position.set(lerp(-9, 9, clamp01(cycle)), 6, 5);
      sweep.intensity = 5 * bump(cycle, 0, 1) * idle;

      // ----- Portátil -----
      lap.rotation.y = k.lapRot + Math.sin(t * 0.35) * 0.06 * idle + (1 - ie) * 0.5;
      lap.position.y = k.lapY + Math.sin(t * 0.9) * 0.05 * idle - (1 - ie) * 0.3;
      lap.rotation.x = k.tilt;
      hinge.rotation.x = k.lid;
      shadow.position.x = lap.position.x;
      (shadow.material as THREE.MeshBasicMaterial).opacity = 1 - Math.min(1, lap.position.y * 1.4);

      // ----- Pantalla: encendido con destello, recorrido de la web y cortinillas -----
      // Se enciende durante la apertura; el destello termina antes del punto de reposo (p = 0.25)
      const on = smooth(clamp01((p - 0.1) / 0.08));
      const flash = bump(p, 0.12, 0.215) * 0.55;
      lapScreen.uniforms.bright.value = on * 0.94 + flash;
      screenLight.intensity = on * 1.3 + flash * 3;
      const scroll = smooth(clamp01((p - 0.32) / 0.4));
      longUv.y = 1 - longRepeat - scroll * (1 - longRepeat);
      let a = 0;
      let mixT = 0;
      for (let i = 0; i < SWITCH.length; i++) {
        if (p >= SWITCH[i]) {
          a = i;
          mixT = clamp01((p - SWITCH[i]) / WIPE);
        }
      }
      const from = p >= SWITCH[0] ? a : 0;
      const to = Math.min(from + 1, desk.length - 1);
      lapScreen.uniforms.mapA.value = desk[from];
      lapScreen.uniforms.mapB.value = desk[to];
      (lapScreen.uniforms.uvA.value as THREE.Vector4).copy(from === 0 ? longUv : fullUv);
      lapScreen.uniforms.mixT.value = p >= SWITCH[0] ? easeInOut(mixT) : 0;
      phoneScreen.uniforms.mapA.value = mobile[from];
      phoneScreen.uniforms.mapB.value = mobile[to];
      phoneScreen.uniforms.mixT.value = lapScreen.uniforms.mixT.value;
      phoneScreen.uniforms.bright.value = 0.94;

      // ----- Móvil: llega girando en arco -----
      const arrive = easeOutCubic(clamp01((p - 0.52) / 0.24));
      ph.position.set(lerp(6.5, 2.2, arrive), lerp(1.6, 1.05, arrive) + Math.sin(arrive * Math.PI) * 0.7, lerp(2.6, 1.05, arrive));
      ph.position.y += Math.sin(t * 0.9 + 1.4) * 0.04 * arrive;
      ph.rotation.set(-0.04, -0.42 - (1 - arrive) * Math.PI * 1.6, 0.04 + (1 - arrive) * 0.5 + Math.sin(t * 0.6) * 0.012);
      ph.visible = arrive > 0.001;

      // ----- Fondo -----
      wordMat.opacity = k.word * ie;
      word.position.y = 3.0 - (1 - ie) * 0.5;
      glowMat.opacity = lerp(0.2, 1, ie);
      dustMat.opacity = 0.55 * ie;
      dust.rotation.y = t * 0.012;
      dust.position.y = Math.sin(t * 0.2) * 0.15;
    },
    render() {
      composer.render();
    },
    setBloom(on) {
      bloom.enabled = on;
    },
    setReflections(on) {
      mirror.visible = on;
    },
    async compile() {
      await renderer.compileAsync(scene, camera);
    },
    dispose() {
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh || (o as THREE.Points).isPoints) {
          m.geometry?.dispose();
          const mats = Array.isArray(m.material) ? m.material : [m.material];
          mats.forEach((mat) => {
            (mat as THREE.MeshBasicMaterial).map?.dispose();
            mat.dispose();
          });
        }
      });
      desk.forEach((d) => d.dispose());
      mobile.forEach((d) => d.dispose());
      emblem.dispose();
      mirror.dispose();
      composer.dispose();
      env.dispose();
      pmrem.dispose();
      room.dispose();
      renderer.dispose();
    },
  };
}
