import { createShowcase, type Quality } from "./showcase";

/**
 * Escaparate en tiempo real.
 *
 * - El progreso del scroll mueve la escena a través de un muelle (con inercia
 *   y un leve rebote), no de forma rígida.
 * - Al estar listo, la luz sube desde la oscuridad durante ~2,6 s (intro).
 * - Solo se renderiza mientras la sección se ve y la pestaña está activa.
 * - Calidad adaptativa: si no llega a ~35 fps baja la resolución, luego quita
 *   el brillo y por último el reflejo del suelo.
 */
export async function startShowcase(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  getProgress: () => number,
  onReady: () => void,
  quality: Quality,
) {
  const show = await createShowcase(canvas, { quality });
  let disposed = false;
  let frame = 0;
  let visible = true;
  const maxDpr = quality === "low" ? 1.5 : 1.75;
  let dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  let p = getProgress();
  let v = 0;
  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  let start = 0;
  let introStart = 0;
  let last = 0;
  const times: number[] = [];
  let degraded = 0;

  const resize = () => {
    const r = host.getBoundingClientRect();
    if (r.width && r.height) show.setSize(r.width, r.height, dpr);
  };

  const degrade = () => {
    degraded++;
    if (degraded === 1 && dpr > 1) {
      dpr = 1;
      resize();
    } else if (degraded <= 2) {
      show.setBloom(false);
    } else {
      show.setReflections(false);
    }
  };

  const loop = (now: number) => {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    // Calidad adaptativa (media de 90 fotogramas)
    if (dt > 0 && dt < 0.25) {
      times.push(dt);
      if (times.length > 90) {
        times.shift();
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        if (avg > 0.028 && degraded < 3) {
          times.length = 0;
          degrade();
        }
      }
    }

    // Muelle hacia el progreso del scroll (ligeramente subamortiguado)
    const stiffness = 90;
    const damping = 2 * Math.sqrt(stiffness) * 0.86;
    v += ((getProgress() - p) * stiffness - v * damping) * dt;
    p += v * dt;

    pointer.x += (target.x - pointer.x) * 0.05;
    pointer.y += (target.y - pointer.y) * 0.05;
    const intro = Math.min(1, (now - introStart) / 2600);
    show.update(p, (now - start) / 1000, intro, pointer);
    show.render();
    frame = requestAnimationFrame(loop);
  };
  const wake = () => {
    if (!frame && !disposed) {
      last = performance.now();
      frame = requestAnimationFrame(loop);
    }
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    target.x = e.clientX / window.innerWidth - 0.5;
    target.y = e.clientY / window.innerHeight - 0.5;
  };
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) wake();
  });
  const ro = new ResizeObserver(resize);
  const onVisibility = () => !document.hidden && wake();

  resize();
  show.update(p, 0, 0, pointer);
  // Compila los shaders antes del primer fotograma (sin tirones al empezar)
  await show.compile().catch(() => undefined);
  if (disposed) return () => undefined;
  start = introStart = performance.now();
  show.render();
  onReady();
  io.observe(host);
  ro.observe(host);
  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  wake();

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("visibilitychange", onVisibility);
    show.dispose();
  };
}
