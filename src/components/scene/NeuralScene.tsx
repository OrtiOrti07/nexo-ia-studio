"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { buildFormations, buildSynapses } from "./formations";
import { sceneState } from "./sceneStore";
import {
  coreFragment,
  coreVertex,
  particlesFragment,
  particlesVertex,
  synapseFragment,
  synapseVertex,
} from "./shaders";

export type SceneQuality = "high" | "lite";

type Clock = { time: number; intro: number; stage: number };

const PALETTE = {
  blue: new THREE.Color("#3b82ff"),
  violet: new THREE.Color("#8b5cff"),
  cyan: new THREE.Color("#22e3ff"),
};

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smoothstep = (a: number, b: number, x: number) => smooth(clamp01((x - a) / (b - a)));

type Layout = { x: number; y: number; z: number; s: number; o: number };

/** Dónde y a qué escala se sitúa cada formación, según la forma de la pantalla. */
function layouts(aspect: number): Layout[] {
  const wide = aspect >= 1;
  const fit = Math.min(1, aspect / 1.3);
  return [
    wide ? { x: 2.45, y: 0.02, z: 0, s: 0.92, o: 1 } : { x: 0, y: 2.0, z: -0.6, s: 0.5, o: 0.95 },
    { x: 0, y: 0.15, z: -2.6, s: 0.55 + fit * 0.45, o: 0.5 },
    // Señal: en pantallas anchas pero no tanto, se encoge para que los cinco nodos quepan
    // En vertical la señal pasa por detrás del texto de los pasos: más tenue
    { x: 0, y: wide ? -0.15 : 0.3, z: 0, s: wide ? Math.min(1, aspect / 1.55) : 0.42 + fit * 0.6, o: wide ? 0.85 : 0.32 },
    { x: 0, y: 0, z: 0, s: 1, o: wide ? 0.45 : 0.3 },
    { x: 0, y: 0, z: 0, s: wide ? 1 : 0.42 + fit * 0.55, o: 1 },
    // Calma: detrás del formulario, para que su luz asome alrededor del panel
    wide ? { x: 1.75, y: -0.1, z: -1, s: 1.35, o: 0.5 } : { x: 0, y: 2.4, z: -1.2, s: 0.6, o: 0.4 },
  ];
}

function sampleLayout(list: Layout[], stage: number): Layout {
  const i = Math.min(Math.floor(stage), list.length - 1);
  const a = list[i];
  const b = list[Math.min(i + 1, list.length - 1)];
  const f = smooth(clamp01(stage - i));
  const lerp = (x: number, y: number) => x + (y - x) * f;
  return { x: lerp(a.x, b.x), y: lerp(a.y, b.y), z: lerp(a.z, b.z), s: lerp(a.s, b.s), o: lerp(a.o, b.o) };
}

/** Visibilidad del núcleo y las sinapsis: en el hero y, más pequeño, en contacto. */
const coreVisibility = (stage: number) =>
  Math.max(1 - smoothstep(0, 0.55, stage), smoothstep(4.45, 5, stage) * 0.85);

function Particles({ count, clockRef }: { count: number; clockRef: RefObject<Clock> }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const pixelRatio = useThree((s) => s.viewport.dpr);

  const geometry = useMemo(() => {
    const f = buildFormations(count);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(f.targets[0], 3));
    f.targets.slice(1).forEach((target, i) => g.setAttribute(`aP${i + 1}`, new THREE.BufferAttribute(target, 3)));
    g.setAttribute("aDust", new THREE.BufferAttribute(f.dust, 3));
    g.setAttribute("aRandom", new THREE.BufferAttribute(f.random, 3));
    // Los límites cambian con cada formación: sin recorte por frustum
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uStage: { value: 0 },
      uIntro: { value: 0 },
      uSize: { value: count > 4000 ? 42 : 58 },
      uPixelRatio: { value: 1 },
      uOpacity: { value: 1 },
      uMouseStrength: { value: 0 },
      uFocusX: { value: 0 },
      uMouse: { value: new THREE.Vector3(99, 99, 99) },
      uBlue: { value: PALETTE.blue },
      uViolet: { value: PALETTE.violet },
      uCyan: { value: PALETTE.cyan },
    }),
    [count],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    const m = material.current;
    if (!m) return;
    const { time, intro, stage } = clockRef.current;
    m.uniforms.uTime.value = time;
    m.uniforms.uIntro.value = intro;
    m.uniforms.uStage.value = stage;
    m.uniforms.uPixelRatio.value = pixelRatio;
    m.uniforms.uFocusX.value = THREE.MathUtils.damp(m.uniforms.uFocusX.value, sceneState.focusX, 4, Math.min(delta, 0.05));
  });

  return (
    <points geometry={geometry} frustumCulled={false} name="particles">
      <shaderMaterial
        ref={material}
        vertexShader={particlesVertex}
        fragmentShader={particlesFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Core({ quality, clockRef }: { quality: SceneQuality; clockRef: RefObject<Clock> }) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.ShaderMaterial>(null);
  const nucleus = useRef<THREE.Mesh>(null);
  const segments = quality === "high" ? 160 : 72;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEnergy: { value: 0 },
      uVisibility: { value: 1 },
      uBlue: { value: PALETTE.blue },
      uViolet: { value: PALETTE.violet },
      uCyan: { value: PALETTE.cyan },
    }),
    [],
  );

  useFrame(() => {
    const { time, intro, stage } = clockRef.current;
    const vis = coreVisibility(stage) * smoothstep(0.15, 0.85, intro);
    if (group.current) {
      group.current.visible = vis > 0.01;
      // En la formación "calma" el núcleo encoge para caber dentro de las partículas
      const calm = smoothstep(4.45, 5, stage);
      const breathe = 1 + Math.sin(time * 1.1) * 0.025;
      group.current.scale.setScalar((0.55 + 0.45 * vis) * (1 - calm * 0.45) * breathe);
    }
    if (shell.current) {
      shell.current.uniforms.uTime.value = time;
      shell.current.uniforms.uVisibility.value = vis;
      shell.current.uniforms.uEnergy.value = sceneState.pointer.active ? 1 : 0;
    }
    if (nucleus.current) {
      const s = 0.17 + Math.sin(time * 2.2) * 0.015;
      nucleus.current.scale.setScalar(s * vis);
    }
  });

  return (
    <group ref={group}>
      <mesh ref={nucleus}>
        <icosahedronGeometry args={[1, 3]} />
        {/* Valores por encima de 1: el bloom los convierte en luz */}
        <meshBasicMaterial color={new THREE.Color(0.55, 1.05, 1.5)} toneMapped={false} />
      </mesh>
      <mesh renderOrder={2}>
        <sphereGeometry args={[1.05, segments, segments]} />
        <shaderMaterial
          ref={shell}
          vertexShader={coreVertex}
          fragmentShader={coreFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Synapses({ quality, clockRef }: { quality: SceneQuality; clockRef: RefObject<Clock> }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const { position, along, seed } = buildSynapses(quality === "high" ? 110 : 48, 28, 1.48);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(position, 3));
    g.setAttribute("aAlong", new THREE.BufferAttribute(along, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [quality]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uVisibility: { value: 1 },
      uBlue: { value: PALETTE.blue },
      uCyan: { value: PALETTE.cyan },
    }),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(() => {
    const m = material.current;
    if (!m) return;
    const { time, intro, stage } = clockRef.current;
    m.uniforms.uTime.value = time;
    m.uniforms.uVisibility.value = coreVisibility(stage) * smoothstep(0.35, 1, intro) * (1 - smoothstep(4.4, 5, stage));
  });

  return (
    <lineSegments geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={synapseVertex}
        fragmentShader={synapseFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

/** Reloj, transición entre formaciones, puntero y control de rendimiento. */
function Director({
  quality,
  clockRef,
  onReady,
  onSlow,
  children,
}: {
  quality: SceneQuality;
  clockRef: RefObject<Clock>;
  onReady: () => void;
  onSlow: () => void;
  children: React.ReactNode;
}) {
  const layoutGroup = useRef<THREE.Group>(null);
  const tiltGroup = useRef<THREE.Group>(null);
  const ready = useRef(false);
  const perf = useRef({ frames: 0, elapsed: 0, strikes: 0, done: false });
  const spin = useRef(0);
  const scratch = useMemo(
    () => ({
      raycaster: new THREE.Raycaster(),
      plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
      hit: new THREE.Vector3(),
      ndc: new THREE.Vector2(),
    }),
    [],
  );

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.05);
    const c = clockRef.current;
    c.time += step;
    c.intro = Math.min(1, c.intro + step / 2.6);
    // La formación sigue al scroll con inercia
    c.stage = THREE.MathUtils.damp(c.stage, sceneState.stage, 3.2, step);

    const { camera, size } = state;
    const aspect = size.width / Math.max(size.height, 1);
    const l = sampleLayout(layouts(aspect), c.stage);
    const g = layoutGroup.current;
    if (g) {
      g.position.set(l.x, l.y, l.z);
      g.scale.setScalar(l.s);
    }

    // Opacidad global de las partículas según la sección
    const particles = state.scene.getObjectByName("particles") as THREE.Points | undefined;
    const pm = particles?.material as THREE.ShaderMaterial | undefined;
    if (pm) pm.uniforms.uOpacity.value = l.o;

    // Giro lento en las formaciones esféricas y el disco; quieto en la señal y la rejilla
    const p = sceneState.pointer;
    const spinWeight = Math.max(1 - smoothstep(1, 1.8, c.stage), smoothstep(4.2, 5, c.stage));
    spin.current = (spin.current + step * 0.1) % (Math.PI * 2);
    const wrapped = spin.current > Math.PI ? spin.current - Math.PI * 2 : spin.current;
    const t = tiltGroup.current;
    if (t) {
      const px = p.active ? p.x : 0;
      const py = p.active ? p.y : 0;
      // La inclinación de base solo se aplica a las formaciones esféricas: la señal y la rejilla van rectas
      const baseX = 0.18 * spinWeight;
      const baseZ = (quality === "high" ? -0.12 : 0) * spinWeight;
      t.rotation.y = THREE.MathUtils.damp(t.rotation.y, wrapped * spinWeight + px * 0.35 * spinWeight, 3, step);
      t.rotation.x = THREE.MathUtils.damp(t.rotation.x, baseX - py * 0.22 * spinWeight, 3, step);
      t.rotation.z = THREE.MathUtils.damp(t.rotation.z, baseZ, 3, step);
    }

    // Posición del puntero en el espacio de las partículas, para apartarlas
    if (pm && particles) {
      const heroWeight = 1 - smoothstep(0.3, 0.9, c.stage);
      const target = p.active ? heroWeight : 0;
      pm.uniforms.uMouseStrength.value = THREE.MathUtils.damp(pm.uniforms.uMouseStrength.value, target, 4, step);
      if (p.active) {
        scratch.ndc.set(p.x, p.y);
        scratch.raycaster.setFromCamera(scratch.ndc, camera);
        if (scratch.raycaster.ray.intersectPlane(scratch.plane, scratch.hit)) {
          particles.worldToLocal(scratch.hit);
          pm.uniforms.uMouse.value.copy(scratch.hit);
        }
      }
    }

    // Leve paralaje de cámara
    const cx = p.active ? p.x * 0.25 : 0;
    const cy = p.active ? p.y * 0.18 : 0;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, cx, 2, step);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, cy, 2, step);
    camera.lookAt(0, 0, 0);

    if (!ready.current) {
      ready.current = true;
      onReady();
    }

    // Si el equipo no sostiene ~40 fps, rebajamos la calidad una vez
    const m = perf.current;
    if (!m.done && c.time > 3) {
      m.frames++;
      m.elapsed += delta;
      if (m.elapsed >= 2) {
        const fps = m.frames / m.elapsed;
        m.strikes = fps < 40 ? m.strikes + 1 : 0;
        m.frames = 0;
        m.elapsed = 0;
        if (m.strikes >= 2) {
          m.done = true;
          onSlow();
        }
      }
    }
  });

  return (
    <group ref={layoutGroup}>
      <group ref={tiltGroup}>
        {children}
      </group>
    </group>
  );
}

type NeuralSceneProps = {
  quality: SceneQuality;
  running: boolean;
  onReady: () => void;
};

export default function NeuralScene({ quality, running, onReady }: NeuralSceneProps) {
  const [degraded, setDegraded] = useState(false);
  const clockRef = useRef<Clock>({ time: 0, intro: 0, stage: 0 });
  const bloom = quality === "high" && !degraded;
  const maxDpr = degraded ? 1 : quality === "high" ? 1.5 : 1.25;

  return (
    <Canvas
      dpr={[1, maxDpr]}
      frameloop={running ? "always" : "never"}
      flat
      camera={{ position: [0, 0, 8.5], fov: 35, near: 0.1, far: 60 }}
      gl={{ antialias: !bloom, alpha: false, powerPreference: "high-performance", stencil: false }}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={["#050505"]} />
      <Director quality={quality} clockRef={clockRef} onReady={onReady} onSlow={() => setDegraded(true)}>
        <Particles count={quality === "high" ? 7000 : 2600} clockRef={clockRef} />
        <Synapses quality={quality} clockRef={clockRef} />
        <Core quality={quality} clockRef={clockRef} />
      </Director>
      {bloom && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.16} luminanceSmoothing={0.4} radius={0.72} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
