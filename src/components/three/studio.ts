import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/*
 * Estudio de render: WebGL con fondo transparente, iluminación de estudio
 * generada en local (RoomEnvironment, sin descargar mapas HDR), luz principal
 * con sombra suave, contraluz en cobalto y un suelo que solo recoge sombras.
 */

export type Studio = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  root: THREE.Group;
  texture: (canvas: HTMLCanvasElement) => THREE.CanvasTexture;
  setSize: (w: number, h: number, dpr: number) => void;
  render: () => void;
  dispose: () => void;
};

export function createStudio(canvas: HTMLCanvasElement, opts: { preserve?: boolean } = {}): Studio {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: Boolean(opts.preserve),
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.035).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.9;

  const key = new THREE.DirectionalLight("#ffffff", 2.3);
  key.position.set(-2.2, 11, 3.2);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -7;
  key.shadow.camera.right = 7;
  key.shadow.camera.top = 7;
  key.shadow.camera.bottom = -7;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 30;
  key.shadow.radius = 16;
  key.shadow.blurSamples = 25;
  key.shadow.bias = -0.0004;
  scene.add(key);

  const rim = new THREE.DirectionalLight("#8ea6ff", 1.5);
  rim.position.set(6, 3.5, -6);
  scene.add(rim);
  scene.add(new THREE.HemisphereLight("#ffffff", "#d6deee", 0.45));

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.ShadowMaterial({ color: "#0b1020", opacity: 0.18 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 200);
  const root = new THREE.Group();
  scene.add(root);

  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const textures: THREE.Texture[] = [];

  return {
    renderer,
    scene,
    camera,
    root,
    texture(c) {
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = maxAniso;
      t.generateMipmaps = true;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      textures.push(t);
      return t;
    },
    setSize(w, h, dpr) {
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },
    render() {
      renderer.render(scene, camera);
    },
    dispose() {
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry.dispose();
          (Array.isArray(m.material) ? m.material : [m.material]).forEach((mat) => mat.dispose());
        }
      });
      textures.forEach((t) => t.dispose());
      env.dispose();
      pmrem.dispose();
      room.dispose();
      renderer.dispose();
    },
  };
}

/** Sombra de contacto: un degradado suave justo debajo de una pieza. */
export function contactShadow(w: number, d: number, opacity = 0.35) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(11,16,32,1)");
  g.addColorStop(0.5, "rgba(11,16,32,.45)");
  g.addColorStop(1, "rgba(11,16,32,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity, depthWrite: false, toneMapped: false }),
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.003;
  m.renderOrder = -1;
  m.userData.noFit = true;
  return m;
}

/**
 * Coloca la cámara en la dirección `dir` y a la distancia justa para que todas
 * las piezas quepan dentro del margen, centradas. Usa las cajas de cada pieza
 * (orientadas), así que el encuadre se ajusta a lo que de verdad se ve.
 */
export function fitCamera(camera: THREE.PerspectiveCamera, root: THREE.Object3D, dir: THREE.Vector3, margin = 0.9, lift = 0) {
  root.updateMatrixWorld(true);
  const points: THREE.Vector3[] = [];
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || m.userData.noFit) return;
    if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
    const b = m.geometry.boundingBox!;
    for (const x of [b.min.x, b.max.x])
      for (const y of [b.min.y, b.max.y])
        for (const z of [b.min.z, b.max.z]) points.push(new THREE.Vector3(x, y, z).applyMatrix4(m.matrixWorld));
  });
  const box = new THREE.Box3().setFromPoints(points);
  const target = box.getCenter(new THREE.Vector3());
  const d = dir.clone().normalize();
  const v = new THREE.Vector3();

  const bounds = () => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of points) {
      v.copy(p).project(camera);
      minX = Math.min(minX, v.x);
      maxX = Math.max(maxX, v.x);
      minY = Math.min(minY, v.y);
      maxY = Math.max(maxY, v.y);
    }
    return { minX, maxX, minY, maxY };
  };
  const placeAt = (dist: number) => {
    camera.position.copy(target).addScaledVector(d, dist);
    camera.lookAt(target);
    camera.updateMatrixWorld(true);
  };

  let dist = 10;
  for (let pass = 0; pass < 4; pass++) {
    let lo = 0.5;
    let hi = 150;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      placeAt(mid);
      const b = bounds();
      const fits = Math.max(-b.minX, b.maxX, -b.minY, b.maxY) <= margin;
      if (fits) hi = mid;
      else lo = mid;
    }
    dist = hi;
    placeAt(dist);
    // Centra lo que se ve: desplaza el punto de mira según el descentrado
    const b = bounds();
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist;
    const halfW = halfH * camera.aspect;
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
    target.addScaledVector(right, ((b.minX + b.maxX) / 2) * halfW);
    target.addScaledVector(up, ((b.minY + b.maxY) / 2) * halfH + (pass === 0 ? lift : 0));
  }
  placeAt(dist);
  return target;
}
