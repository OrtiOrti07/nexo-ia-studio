"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/**
 * Escena 3D del hero: un "planetario" de la inteligencia del negocio.
 *
 * - Núcleo ámbar (el negocio) dentro de una esfera de cristal con una malla
 *   geodésica alrededor.
 * - Tres órbitas metálicas (estrategia, operaciones, presencia) con nodos que
 *   giran a distinta velocidad.
 * - Líneas y pulsos de datos que viajan desde los nodos hacia el centro.
 *
 * Todo el movimiento usa un reloj propio para que la pausa no provoque saltos.
 */

export type OrreryQuality = "high" | "lite";

export type PointerState = { x: number; y: number; active: boolean };

type OrreryCanvasProps = {
  quality: OrreryQuality;
  running: boolean;
  pointerRef: RefObject<PointerState>;
  onReady: () => void;
};

const COLORS = {
  amber: new THREE.Color("#f6b443"),
  amberGlow: new THREE.Color("#ffb347"),
  amberDeep: new THREE.Color("#e8890c"),
  porcelain: new THREE.Color("#f3f5ff"),
  ring: new THREE.Color("#e9edff"),
  mist: new THREE.Color("#dbe3ff"),
  glass: new THREE.Color("#dfe7ff"),
};

type NodeDef = { phase: number; size: number; amber: boolean };
type OrbitDef = {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  nodes: NodeDef[];
};

const ORBITS: OrbitDef[] = [
  {
    radius: 1.42,
    tilt: [1.2, 0.2, 0.34],
    speed: 0.36,
    nodes: [
      { phase: 0.4, size: 0.085, amber: true },
      { phase: 3.6, size: 0.05, amber: false },
    ],
  },
  {
    radius: 1.98,
    tilt: [1.0, -0.44, -0.3],
    speed: 0.23,
    nodes: [
      { phase: 1.9, size: 0.07, amber: false },
      { phase: 4.3, size: 0.095, amber: true },
      { phase: 5.7, size: 0.045, amber: false },
    ],
  },
  {
    radius: 2.58,
    tilt: [1.4, 0.32, 0.06],
    speed: 0.15,
    nodes: [
      { phase: 2.7, size: 0.11, amber: true },
      { phase: 0.8, size: 0.055, amber: false },
    ],
  },
];

const ALL_NODES = ORBITS.flatMap((orbit, orbitIndex) =>
  orbit.nodes.map((node) => ({ ...node, orbitIndex })),
);

const INTRO_SECONDS = 2.6;
const START_TILT = new THREE.Euler(Math.PI / 2 - 0.08, 0, 0);

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** Textura circular suave para puntos y halos, generada en un canvas. */
function useGlowTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

/** Iluminación de estudio para los reflejos metálicos de las órbitas. */
function StudioEnvironment() {
  const get = useThree((s) => s.get);
  useEffect(() => {
    const { gl, scene } = get();
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.9;
    return () => {
      scene.environment = null;
      env.dispose();
      room.dispose();
      pmrem.dispose();
    };
  }, [get]);
  return null;
}

/** Cristal con brillo de borde (efecto Fresnel). */
const fresnelVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fresnelFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uIntensity;
  uniform float uBase;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float f = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewDir))), uPower);
    gl_FragColor = vec4(uColor, uBase + f * uIntensity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function Core({
  quality,
  glow,
  clockRef,
}: {
  quality: OrreryQuality;
  glow: THREE.Texture;
  clockRef: RefObject<{ time: number; intro: number }>;
}) {
  const nucleus = useRef<THREE.Mesh>(null);
  const lattice = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Sprite>(null);

  const { edges, vertices } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1, 1);
    const edgesGeometry = new THREE.EdgesGeometry(ico);
    const pos = ico.getAttribute("position");
    const seen = new Map<string, THREE.Vector3>();
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      const key = `${v.x.toFixed(3)}|${v.y.toFixed(3)}|${v.z.toFixed(3)}`;
      if (!seen.has(key)) seen.set(key, v);
    }
    ico.dispose();
    const points = new THREE.BufferGeometry().setFromPoints([...seen.values()]);
    return { edges: edgesGeometry, vertices: points };
  }, []);

  const shellUniforms = useMemo(
    () => ({
      uColor: { value: COLORS.glass },
      uPower: { value: 2.6 },
      uIntensity: { value: 0.75 },
      uBase: { value: 0.04 },
    }),
    [],
  );

  useFrame((_, delta) => {
    const { time, intro } = clockRef.current;
    const step = Math.min(delta, 0.05);
    if (nucleus.current) {
      const breathe = 1 + Math.sin(time * 1.6) * 0.035;
      nucleus.current.scale.setScalar(breathe * (0.6 + 0.4 * intro));
    }
    if (halo.current) {
      const s = (2.5 + Math.sin(time * 1.6) * 0.12) * intro;
      halo.current.scale.set(s, s, 1);
    }
    if (lattice.current) {
      lattice.current.rotation.y += step * 0.12;
      lattice.current.rotation.x = Math.sin(time * 0.2) * 0.15;
    }
  });

  const segments = quality === "high" ? 48 : 32;

  return (
    <group>
      <sprite ref={halo} renderOrder={1}>
        <spriteMaterial
          map={glow}
          color={COLORS.amberGlow}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <mesh ref={nucleus}>
        <sphereGeometry args={[0.34, segments, segments]} />
        <meshStandardMaterial
          color={COLORS.amber}
          emissive={COLORS.amberDeep}
          emissiveIntensity={0.75}
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>

      <mesh renderOrder={2}>
        <sphereGeometry args={[0.82, segments, segments]} />
        <shaderMaterial
          vertexShader={fresnelVertex}
          fragmentShader={fresnelFragment}
          uniforms={shellUniforms}
          transparent
          depthWrite={false}
        />
      </mesh>

      <group ref={lattice} scale={0.9}>
        <lineSegments geometry={edges}>
          <lineBasicMaterial
            color={COLORS.mist}
            transparent
            opacity={0.32}
            depthWrite={false}
          />
        </lineSegments>
        <points geometry={vertices}>
          <pointsMaterial
            map={glow}
            color={COLORS.porcelain}
            size={0.09}
            sizeAttenuation
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </points>
      </group>
    </group>
  );
}

function Orbits({
  quality,
  glow,
  clockRef,
}: {
  quality: OrreryQuality;
  glow: THREE.Texture;
  clockRef: RefObject<{ time: number; intro: number }>;
}) {
  const rings = useRef<(THREE.Group | null)[]>([]);
  const nodes = useRef<(THREE.Group | null)[]>([]);
  const links = useRef<THREE.LineSegments>(null);
  const pulses = useRef<THREE.Points>(null);

  const scratch = useMemo(
    () => ({
      euler: new THREE.Euler(),
      quat: new THREE.Quaternion(),
      v: new THREE.Vector3(),
      nodePositions: ALL_NODES.map(() => new THREE.Vector3()),
    }),
    [],
  );

  // Geometrías de líneas de datos y pulsos (una línea y un pulso por nodo)
  const { linkGeometry, pulseGeometry } = useMemo(() => {
    const count = ALL_NODES.length;
    const linkPositions = new Float32Array(count * 2 * 3);
    const linkColors = new Float32Array(count * 2 * 4);
    ALL_NODES.forEach((node, i) => {
      const c = node.amber ? COLORS.amber : COLORS.mist;
      linkColors.set([c.r, c.g, c.b, node.amber ? 0.55 : 0.35], i * 8);
      linkColors.set([c.r, c.g, c.b, 0], i * 8 + 4);
    });
    const linkGeometry = new THREE.BufferGeometry();
    linkGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linkPositions, 3).setUsage(THREE.DynamicDrawUsage),
    );
    linkGeometry.setAttribute("color", new THREE.BufferAttribute(linkColors, 4));

    const pulsePositions = new Float32Array(count * 3);
    const pulseColors = new Float32Array(count * 4);
    const pulseGeometry = new THREE.BufferGeometry();
    pulseGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(pulsePositions, 3).setUsage(THREE.DynamicDrawUsage),
    );
    pulseGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(pulseColors, 4).setUsage(THREE.DynamicDrawUsage),
    );
    return { linkGeometry, pulseGeometry };
  }, []);

  // Marcas de graduación en la órbita exterior, como en un instrumento
  const ticks = useMemo(() => {
    const r = ORBITS[2].radius + 0.13;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame(() => {
    const { time, intro } = clockRef.current;
    const e = intro;
    let nodeIndex = 0;

    ORBITS.forEach((orbit, i) => {
      const ring = rings.current[i];
      // Despliegue inicial: las órbitas parten alineadas y se abren
      const local = easeOutQuart(clamp01((time - i * 0.18) / (INTRO_SECONDS - 0.4)));
      scratch.euler.set(
        THREE.MathUtils.lerp(START_TILT.x, orbit.tilt[0], local),
        THREE.MathUtils.lerp(START_TILT.y, orbit.tilt[1], local),
        THREE.MathUtils.lerp(START_TILT.z, orbit.tilt[2], local),
      );
      const scale = THREE.MathUtils.lerp(0.55, 1, local);
      if (ring) {
        ring.rotation.copy(scratch.euler);
        ring.scale.setScalar(scale);
      }
      scratch.quat.setFromEuler(scratch.euler);

      orbit.nodes.forEach((node) => {
        const angle = node.phase + time * orbit.speed;
        const p = scratch.nodePositions[nodeIndex];
        p.set(Math.cos(angle) * orbit.radius, Math.sin(angle) * orbit.radius, 0)
          .multiplyScalar(scale)
          .applyQuaternion(scratch.quat);
        const group = nodes.current[nodeIndex];
        if (group) {
          group.position.copy(p);
          group.scale.setScalar(node.size * local);
        }
        nodeIndex++;
      });
    });

    // Líneas nodo → núcleo
    const linkPos = linkGeometry.getAttribute("position") as THREE.BufferAttribute;
    const pulsePos = pulseGeometry.getAttribute("position") as THREE.BufferAttribute;
    const pulseCol = pulseGeometry.getAttribute("color") as THREE.BufferAttribute;

    ALL_NODES.forEach((node, i) => {
      const p = scratch.nodePositions[i];
      linkPos.setXYZ(i * 2, p.x, p.y, p.z);
      linkPos.setXYZ(i * 2 + 1, 0, 0, 0);

      // Pulso de datos viajando hacia el centro
      const cycle = (time * 0.32 + i * 0.37) % 1;
      const travel = cycle * cycle; // acelera al acercarse al núcleo
      scratch.v.copy(p).multiplyScalar(1 - travel * 0.92);
      pulsePos.setXYZ(i, scratch.v.x, scratch.v.y, scratch.v.z);
      const c = node.amber ? COLORS.amber : COLORS.porcelain;
      const alpha = Math.sin(Math.PI * cycle) * e;
      pulseCol.setXYZW(i, c.r, c.g, c.b, alpha);
    });
    linkPos.needsUpdate = true;
    pulsePos.needsUpdate = true;
    pulseCol.needsUpdate = true;

    if (links.current) {
      (links.current.material as THREE.LineBasicMaterial).opacity = e;
    }
  });

  const tubular = quality === "high" ? 280 : 180;

  return (
    <group>
      {ORBITS.map((orbit, i) => (
        <group
          key={i}
          ref={(el) => {
            rings.current[i] = el;
          }}
        >
          <mesh>
            <torusGeometry args={[orbit.radius, quality === "high" ? 0.0095 : 0.012, 8, tubular]} />
            <meshStandardMaterial
              color={COLORS.ring}
              metalness={0.92}
              roughness={0.22}
            />
          </mesh>
          {i === 2 && (
            <points geometry={ticks}>
              <pointsMaterial
                map={glow}
                color={COLORS.mist}
                size={0.045}
                sizeAttenuation
                transparent
                opacity={0.7}
                depthWrite={false}
              />
            </points>
          )}
        </group>
      ))}

      {ALL_NODES.map((node, i) => (
        <group
          key={i}
          ref={(el) => {
            nodes.current[i] = el;
          }}
        >
          <mesh>
            <sphereGeometry args={[1, 24, 16]} />
            {node.amber ? (
              <meshStandardMaterial
                color={COLORS.amber}
                emissive={COLORS.amberDeep}
                emissiveIntensity={0.6}
                roughness={0.35}
              />
            ) : (
              <meshStandardMaterial
                color={COLORS.porcelain}
                roughness={0.28}
                metalness={0.05}
              />
            )}
          </mesh>
          {node.amber && (
            <sprite scale={[6.5, 6.5, 1]}>
              <spriteMaterial
                map={glow}
                color={COLORS.amberGlow}
                transparent
                opacity={0.45}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </sprite>
          )}
        </group>
      ))}

      <lineSegments ref={links} geometry={linkGeometry}>
        <lineBasicMaterial vertexColors transparent depthWrite={false} />
      </lineSegments>

      <points ref={pulses} geometry={pulseGeometry}>
        <pointsMaterial
          map={glow}
          vertexColors
          size={0.12}
          sizeAttenuation
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function Dust({ quality, glow }: { quality: OrreryQuality; glow: THREE.Texture }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const count = quality === "high" ? 320 : 140;
    const positions = new Float32Array(count * 3);
    // Generador determinista para que la composición sea siempre la misma
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < count; i++) {
      const r = 3.2 + rand() * 4.2;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [quality]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += Math.min(delta, 0.05) * 0.018;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        map={glow}
        color={COLORS.mist}
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}

/** Reloj, inclinación con el puntero, encuadre de cámara y control de rendimiento. */
function Rig({
  quality,
  pointerRef,
  clockRef,
  onReady,
  onSlow,
  children,
}: {
  quality: OrreryQuality;
  pointerRef: RefObject<PointerState>;
  clockRef: RefObject<{ time: number; intro: number }>;
  onReady: () => void;
  onSlow: () => void;
  children: React.ReactNode;
}) {
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const ready = useRef(false);
  const perf = useRef({ frames: 0, elapsed: 0, strikes: 0, done: false });

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.05);
    clockRef.current.time += step;
    clockRef.current.intro = easeOutQuart(clamp01(clockRef.current.time / INTRO_SECONDS));

    const { camera, size } = state;
    const aspect = size.width / Math.max(size.height, 1);
    // Encuadre: el sistema completo siempre cabe, también en vertical
    const distance = 9.3 / Math.min(1, aspect * 1.05);
    const p = pointerRef.current;
    const px = p.active ? p.x : Math.sin(clockRef.current.time * 0.25) * 0.35;
    const py = p.active ? p.y : Math.cos(clockRef.current.time * 0.21) * 0.2;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, px * 0.45, 2.5, step);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.35 + py * 0.3, 2.5, step);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, distance, 4, step);
    camera.lookAt(0, 0, 0);

    if (tilt.current) {
      tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, -py * 0.22, 3, step);
      tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, px * 0.32, 3, step);
    }
    if (spin.current) spin.current.rotation.y += step * 0.05;

    if (!ready.current) {
      ready.current = true;
      onReady();
    }

    // Si el equipo no llega a ~45 fps de forma sostenida, bajamos la resolución
    const m = perf.current;
    if (!m.done && clockRef.current.time > INTRO_SECONDS) {
      m.frames++;
      m.elapsed += delta;
      if (m.elapsed >= 2) {
        const fps = m.frames / m.elapsed;
        m.strikes = fps < 45 ? m.strikes + 1 : 0;
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
    <group ref={tilt}>
      <group ref={spin} rotation={[0.08, 0, quality === "high" ? -0.12 : -0.08]}>
        {children}
      </group>
    </group>
  );
}

export default function OrreryCanvas({
  quality,
  running,
  pointerRef,
  onReady,
}: OrreryCanvasProps) {
  const maxDpr = quality === "high" ? 1.75 : 1.5;
  const [dpr, setDpr] = useState<number | [number, number]>([1, maxDpr]);
  const clockRef = useRef({ time: 0, intro: 0 });

  return (
    <Canvas
      dpr={dpr}
      frameloop={running ? "always" : "never"}
      camera={{ position: [0, 0.35, 10.4], fov: 32, near: 0.1, far: 60 }}
      flat
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <SceneContents
        quality={quality}
        pointerRef={pointerRef}
        clockRef={clockRef}
        onReady={onReady}
        onSlow={() => setDpr(1)}
      />
    </Canvas>
  );
}

function SceneContents({
  quality,
  pointerRef,
  clockRef,
  onReady,
  onSlow,
}: {
  quality: OrreryQuality;
  pointerRef: RefObject<PointerState>;
  clockRef: RefObject<{ time: number; intro: number }>;
  onReady: () => void;
  onSlow: () => void;
}) {
  const glow = useGlowTexture();
  useEffect(() => () => glow.dispose(), [glow]);

  return (
    <>
      {/* Luz tomada del cielo de la foto: azul arriba, rosado del mar de nubes abajo */}
      <hemisphereLight args={["#7d97ff", "#ffb39a", 0.9]} />
      <directionalLight position={[-4, 5, 6]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[3, -4, -3]} intensity={1.2} color="#ffb38a" />
      <pointLight position={[0, 0, 0]} intensity={7} distance={7} decay={1.6} color="#ffb347" />
      <StudioEnvironment />
      <Rig quality={quality} pointerRef={pointerRef} clockRef={clockRef} onReady={onReady} onSlow={onSlow}>
        <Core quality={quality} glow={glow} clockRef={clockRef} />
        <Orbits quality={quality} glow={glow} clockRef={clockRef} />
      </Rig>
      <Dust quality={quality} glow={glow} />
    </>
  );
}
