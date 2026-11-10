/**
 * Formaciones de las partículas. Cada sección de la página tiene la suya y la
 * escena interpola entre ellas según el scroll (ver docs/direccion-visual.md).
 *
 * 0 Núcleo · 1 Constelación · 2 Señal · 3 Rejilla · 4 Portal · 5 Calma
 */

export const STAGES = 6;

/** Generador pseudoaleatorio determinista: la composición es siempre la misma. */
export function seeded(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number) {
  const u = Math.max(rand(), 1e-6);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function unitVector(rand: () => number): [number, number, number] {
  const z = rand() * 2 - 1;
  const a = rand() * Math.PI * 2;
  const r = Math.sqrt(1 - z * z);
  return [r * Math.cos(a), r * Math.sin(a), z];
}

export type Formations = {
  count: number;
  /** Una matriz de posiciones (x, y, z) por formación. */
  targets: Float32Array[];
  /** Posición inicial dispersa, para la entrada. */
  dust: Float32Array;
  /** Por partícula: dos valores aleatorios y un tamaño relativo. */
  random: Float32Array;
};

export function buildFormations(count: number): Formations {
  const rand = seeded(20261110);
  const targets = Array.from({ length: STAGES }, () => new Float32Array(count * 3));
  const dust = new Float32Array(count * 3);
  const random = new Float32Array(count * 3);

  // Mismas posiciones que los nodos del método en la página (ver Process.tsx)
  const nodesX = [-3.6, -1.8, 0, 1.8, 3.6];
  const gridCols = Math.ceil(Math.sqrt(count * 1.9));

  for (let i = 0; i < count; i++) {
    const k = i * 3;
    const r1 = rand();
    const r2 = rand();
    random[k] = r1;
    random[k + 1] = r2;
    random[k + 2] = 0.45 + Math.pow(rand(), 2.2) * 1.4;

    // 0 · Núcleo: una cáscara neuronal con algo de materia en el interior
    {
      const [x, y, z] = unitVector(rand);
      const shell = r1 < 0.78;
      const radius = shell ? 1.55 + gaussian(rand) * 0.07 : 0.35 + Math.pow(rand(), 0.6) * 1.1;
      targets[0].set([x * radius, y * radius, z * radius], k);
    }

    // 1 · Constelación: un disco galáctico de dos brazos, inclinado
    {
      const arm = r2 < 0.5 ? 0 : Math.PI;
      const radius = 1.2 + Math.pow(rand(), 0.75) * 6.2;
      const angle = arm + radius * 0.62 + gaussian(rand) * 0.32;
      const thickness = gaussian(rand) * 0.12 * (1 + radius * 0.05);
      const x = Math.cos(angle) * radius;
      const zFlat = Math.sin(angle) * radius;
      // Inclinación del disco hacia la cámara
      const tilt = 1.12;
      const y = thickness * Math.cos(tilt) - zFlat * Math.sin(tilt);
      const z = thickness * Math.sin(tilt) + zFlat * Math.cos(tilt);
      targets[1].set([x, y, z], k);
    }

    // 2 · Señal: una onda que atraviesa cinco nodos
    {
      if (r1 < 0.42) {
        const node = nodesX[Math.floor(rand() * nodesX.length)];
        const [x, y, z] = unitVector(rand);
        const radius = 0.08 + Math.pow(rand(), 0.5) * 0.36;
        targets[2].set([node + x * radius, y * radius, z * radius], k);
      } else {
        const x = (rand() * 2 - 1) * 7.5;
        const strand = r2 < 0.5 ? 1 : -1;
        const y = Math.sin(x * 1.05) * 0.42 * strand + gaussian(rand) * 0.05;
        const z = Math.cos(x * 1.05) * 0.42 * strand + gaussian(rand) * 0.05;
        targets[2].set([x, y, z], k);
      }
    }

    // 3 · Rejilla: un terreno de datos que se pierde en profundidad
    {
      const col = i % gridCols;
      const row = Math.floor(i / gridCols);
      const rows = Math.ceil(count / gridCols);
      const x = (col / (gridCols - 1) - 0.5) * 16;
      const z = -(row / Math.max(rows - 1, 1)) * 12 + 3;
      const y = -1.7 + Math.sin(x * 0.55) * Math.cos(z * 0.6) * 0.35;
      targets[3].set([x, y, z], k);
    }

    // 4 · Portal: un anillo de luz con chispas
    {
      const angle = rand() * Math.PI * 2;
      const spark = r1 > 0.86;
      const radius = 2.7 + gaussian(rand) * (spark ? 0.55 : 0.07);
      const depth = gaussian(rand) * (spark ? 0.6 : 0.08);
      targets[4].set([Math.cos(angle) * radius, Math.sin(angle) * radius, depth], k);
    }

    // 5 · Calma: el núcleo pequeño y recogido
    {
      const [x, y, z] = unitVector(rand);
      const radius = 0.95 + gaussian(rand) * 0.05;
      targets[5].set([x * radius, y * radius, z * radius], k);
    }

    // Polvo inicial, del que se condensa el núcleo al cargar
    {
      const [x, y, z] = unitVector(rand);
      const radius = 4 + rand() * 6;
      dust.set([x * radius, y * radius, z * radius], k);
    }
  }

  return { count, targets, dust, random };
}

/** Arcos de sinapsis entre puntos de la superficie del núcleo. */
export function buildSynapses(arcs: number, segments: number, radius: number) {
  const rand = seeded(7);
  const vertices = arcs * segments * 2;
  const position = new Float32Array(vertices * 3);
  const along = new Float32Array(vertices);
  const seed = new Float32Array(vertices);

  const point = (a: number[], b: number[], t: number, lift: number) => {
    // Interpolación esférica entre dos direcciones unitarias
    const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    const omega = Math.acos(dot);
    const s = Math.sin(omega) || 1;
    const wa = Math.sin((1 - t) * omega) / s;
    const wb = Math.sin(t * omega) / s;
    const r = radius * (1 + lift * Math.sin(Math.PI * t));
    return [(a[0] * wa + b[0] * wb) * r, (a[1] * wa + b[1] * wb) * r, (a[2] * wa + b[2] * wb) * r];
  };

  let v = 0;
  for (let i = 0; i < arcs; i++) {
    const a = unitVector(rand);
    let b = unitVector(rand);
    // Arcos de longitud media: ni puntos pegados ni antípodas
    while (a[0] * b[0] + a[1] * b[1] + a[2] * b[2] > 0.8 || a[0] * b[0] + a[1] * b[1] + a[2] * b[2] < -0.6) {
      b = unitVector(rand);
    }
    const lift = 0.06 + rand() * 0.16;
    const arcSeed = rand();
    for (let s = 0; s < segments; s++) {
      const t0 = s / segments;
      const t1 = (s + 1) / segments;
      position.set(point(a, b, t0, lift), v * 3);
      along[v] = t0;
      seed[v] = arcSeed;
      v++;
      position.set(point(a, b, t1, lift), v * 3);
      along[v] = t1;
      seed[v] = arcSeed;
      v++;
    }
  }
  return { position, along, seed };
}
