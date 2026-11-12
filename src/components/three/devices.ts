import * as THREE from "three";

/*
 * Dispositivos de las escenas 3D, construidos con geometría propia (sin
 * modelos descargados): portátil, móvil, tableta, paneles de navegador,
 * etiquetas, botón y cursor. Unidades: el portátil mide 3,2 de ancho.
 */

// ---------- Geometría ----------

export function roundedRectShape(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  const rr = Math.min(r, w / 2, h / 2);
  s.moveTo(x + rr, y);
  s.lineTo(x + w - rr, y);
  s.absarc(x + w - rr, y + rr, rr, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - rr);
  s.absarc(x + w - rr, y + h - rr, rr, 0, Math.PI / 2, false);
  s.lineTo(x + rr, y + h);
  s.absarc(x + rr, y + h - rr, rr, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + rr);
  s.absarc(x + rr, y + rr, rr, Math.PI, Math.PI * 1.5, false);
  return s;
}

/** Losa con esquinas redondeadas y cantos biselados, centrada, con la cara frontal en +z. */
export function slab(w: number, h: number, depth: number, r: number, bevel: number) {
  const shape = roundedRectShape(w - bevel * 2, h - bevel * 2, Math.max(0.001, r - bevel));
  const core = Math.max(0.001, depth - bevel * 2);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: core,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 5,
    curveSegments: 28,
  });
  geo.translate(0, 0, -core / 2);
  geo.computeVertexNormals();
  return geo;
}

/** Superficie plana redondeada con UV de 0 a 1 (para pantallas con textura). */
export function roundedPlane(w: number, h: number, r: number) {
  const geo = new THREE.ShapeGeometry(roundedRectShape(w, h, r), 28);
  const pos = geo.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / w + 0.5;
    uv[i * 2 + 1] = pos.getY(i) / h + 0.5;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return geo;
}

// ---------- Materiales ----------

export const materials = {
  aluminium: (color = "#c9ced6") =>
    new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.92,
      roughness: 0.32,
      clearcoat: 0.3,
      clearcoatRoughness: 0.35,
    }),
  darkGlass: () =>
    new THREE.MeshPhysicalMaterial({
      color: "#05070c",
      metalness: 0.1,
      roughness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    }),
  /** Pantalla encendida: se ve tal cual, sin velos de luz que la apaguen. */
  screen: (map: THREE.Texture) => new THREE.MeshBasicMaterial({ map, toneMapped: false }),
  card: (color = "#ffffff") =>
    new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0,
      roughness: 0.38,
      clearcoat: 0.7,
      clearcoatRoughness: 0.2,
      sheen: 0.4,
      sheenColor: new THREE.Color("#dfe6ff"),
    }),
  glossy: (color: string) =>
    new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.05,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    }),
  /** Cara con textura que no recibe luz (etiquetas, rótulos). */
  label: (map: THREE.Texture, transparent = false) =>
    new THREE.MeshBasicMaterial({ map, transparent, toneMapped: false }),
};

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, cast = true) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = cast;
  m.receiveShadow = false;
  return m;
}

// ---------- Dispositivos ----------

export type Device = THREE.Group & { userData: { footprint: [number, number] } };

function group(footprint: [number, number]) {
  const g = new THREE.Group() as Device;
  g.userData.footprint = footprint;
  return g;
}

/** Portátil abierto. La pantalla mide 16:10; `keys` es la textura del teclado. */
export function laptop(
  screen: THREE.Texture,
  keys: THREE.Texture,
  opts: { color?: string; open?: number; emblem?: THREE.Texture } = {},
) {
  const color = opts.color ?? "#c3c8d1";
  const g = group([3.3, 2.3]);
  const W = 3.2;
  const D = 2.16;
  const T = 0.1;

  const base = mesh(slab(W, D, T, 0.14, 0.03), materials.aluminium(color));
  base.rotation.x = -Math.PI / 2;
  base.position.y = T / 2;
  g.add(base);

  // Teclado y panel táctil
  const kb = mesh(roundedPlane(W * 0.84, D * 0.4, 0.03), new THREE.MeshStandardMaterial({ map: keys, roughness: 0.6 }), false);
  kb.rotation.x = -Math.PI / 2;
  kb.position.set(0, T + 0.002, -D * 0.13);
  g.add(kb);
  const pad = mesh(
    roundedPlane(W * 0.34, D * 0.27, 0.05),
    new THREE.MeshPhysicalMaterial({ color, metalness: 0.75, roughness: 0.22, clearcoat: 0.6 }),
    false,
  );
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(0, T + 0.002, D * 0.28);
  g.add(pad);

  // Tapa, con bisagra en el borde trasero
  const hinge = new THREE.Group();
  hinge.position.set(0, T * 0.95, -D / 2 + 0.03);
  hinge.rotation.x = -(opts.open ?? 0.3);
  g.add(hinge);

  const LH = 2.06;
  const LT = 0.06;
  const lid = mesh(slab(W, LH, LT, 0.14, 0.02), materials.aluminium(color));
  lid.position.set(0, LH / 2, -LT / 2);
  hinge.add(lid);

  const bezel = mesh(roundedPlane(W - 0.035, LH - 0.035, 0.125), materials.darkGlass(), false);
  bezel.position.set(0, LH / 2, 0.001);
  hinge.add(bezel);

  const sw = W - 0.2;
  const sh = sw / 1.6;
  const display = mesh(roundedPlane(sw, sh, 0.035), materials.screen(screen), false);
  display.position.set(0, LH / 2 + 0.045, 0.002);
  hinge.add(display);

  // Emblema pulido en la parte trasera de la tapa
  if (opts.emblem) {
    const mark = mesh(
      new THREE.PlaneGeometry(0.46, 0.46),
      new THREE.MeshPhysicalMaterial({
        color: "#eef1f8",
        metalness: 1,
        roughness: 0.08,
        alphaMap: opts.emblem,
        transparent: true,
      }),
      false,
    );
    mark.position.set(0, LH / 2, -LT - 0.003);
    mark.rotation.y = Math.PI;
    hinge.add(mark);
  }

  g.userData.hinge = hinge;
  g.userData.display = display;
  return g;
}

/** Teléfono de frente. La pantalla mide 0,74 × 1,62 (proporción 0,457). */
export function phone(screen: THREE.Texture, opts: { color?: string } = {}) {
  const g = group([0.9, 0.5]);
  const W = 0.82;
  const H = 1.7;
  const T = 0.085;
  const R = 0.135;

  g.add(mesh(slab(W, H, T, R, 0.03), materials.aluminium(opts.color ?? "#3a404c")));

  const glass = mesh(roundedPlane(W - 0.03, H - 0.03, R - 0.015), materials.darkGlass(), false);
  glass.position.z = T / 2 + 0.001;
  g.add(glass);

  const display = mesh(roundedPlane(W - 0.08, H - 0.08, R - 0.05), materials.screen(screen), false);
  display.position.z = T / 2 + 0.002;
  g.add(display);

  const island = mesh(roundedPlane(0.22, 0.06, 0.03), new THREE.MeshBasicMaterial({ color: "#000000" }), false);
  island.position.set(0, H / 2 - 0.1, T / 2 + 0.003);
  g.add(island);

  g.userData.display = display;
  return g;
}

/** Tableta vertical. La pantalla mide 1,38 × 1,84 (proporción 0,75). */
export function tablet(screen: THREE.Texture, opts: { color?: string } = {}) {
  const g = group([1.6, 0.5]);
  const W = 1.5;
  const H = 1.96;
  const T = 0.065;
  const R = 0.12;

  g.add(mesh(slab(W, H, T, R, 0.022), materials.aluminium(opts.color ?? "#c9ced6")));

  const glass = mesh(roundedPlane(W - 0.03, H - 0.03, R - 0.015), materials.darkGlass(), false);
  glass.position.z = T / 2 + 0.001;
  g.add(glass);

  const display = mesh(roundedPlane(1.38, 1.84, 0.05), materials.screen(screen), false);
  display.position.z = T / 2 + 0.002;
  g.add(display);
  return g;
}

/** Ventana de navegador flotante: una placa blanca con la página encima. */
export function panel(screen: THREE.Texture, w: number, h: number) {
  const g = group([w, 0.4]);
  const T = 0.05;
  g.add(mesh(slab(w, h, T, 0.09, 0.016), materials.card()));
  const display = mesh(roundedPlane(w - 0.05, h - 0.05, 0.07), materials.screen(screen), false);
  display.position.z = T / 2 + 0.001;
  g.add(display);
  return g;
}

/** Etiqueta con forma de píldora (textura con su propio fondo). */
export function chip(face: THREE.Texture, w: number, h: number) {
  const g = group([w, 0.3]);
  const T = 0.06;
  g.add(mesh(slab(w, h, T, h / 2, 0.02), materials.card()));
  const front = mesh(roundedPlane(w - 0.02, h - 0.02, h / 2 - 0.01), materials.label(face), false);
  front.position.z = T / 2 + 0.001;
  g.add(front);
  return g;
}

/** Botón 3D en cobalto con el rótulo en blanco. */
export function button(face: THREE.Texture, w: number, h: number, color = "#2e5bff") {
  const g = group([w, 0.4]);
  const T = 0.14;
  g.add(mesh(slab(w, h, T, h / 2, 0.045), materials.glossy(color)));
  const front = mesh(roundedPlane(w - 0.1, h - 0.06, h / 2 - 0.03), materials.label(face, true), false);
  front.position.z = T / 2 + 0.002;
  g.add(front);
  return g;
}

/** Cursor de ratón en relieve: flecha negra con borde blanco. */
export function cursor(size = 0.42) {
  const g = group([0.4, 0.3]);
  const pts: [number, number][] = [
    [0, 0],
    [0, -1],
    [0.25, -0.77],
    [0.42, -1.13],
    [0.58, -1.06],
    [0.42, -0.71],
    [0.74, -0.71],
  ];
  const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  const opts = { depth: 0.06, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 3 };
  const black = mesh(new THREE.ExtrudeGeometry(shape, opts), materials.glossy("#0b1020"));
  const outline = mesh(new THREE.ExtrudeGeometry(shape, { ...opts, bevelSize: 0.075, depth: 0.03 }), materials.card());
  outline.position.z = -0.05;
  g.add(outline, black);
  g.scale.setScalar(size);
  return g;
}
