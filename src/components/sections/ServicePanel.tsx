"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import { useRef, type CSSProperties, type PointerEvent } from "react";
import { Bot, Boxes, Cable, Compass, MessagesSquare, Workflow, type LucideIcon } from "lucide-react";
import type { Service, ServiceId } from "@/content/home";
import { ServiceGlyph } from "@/components/visuals/ServiceGlyph";

const ICONS: Record<ServiceId, LucideIcon> = {
  automatizacion: Workflow,
  agentes: Bot,
  asistentes: MessagesSquare,
  integracion: Cable,
  estrategia: Compass,
  medida: Boxes,
};

/** Color de la luz de cada panel, como triplete RGB para los degradados. */
const GLOW: Record<Service["accent"], string> = {
  blue: "59 130 255",
  violet: "139 92 255",
  cyan: "34 227 255",
};

/**
 * Panel de servicio con profundidad: con ratón se inclina levemente hacia el
 * cursor (muelle) y una luz sigue al puntero por su superficie.
 */
export function ServicePanel({ service, index }: { service: Service; index: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const rotateX = useSpring(0, { stiffness: 160, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 160, damping: 18 });
  const Icon = ICONS[service.id];

  const onMove = (event: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || event.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    if (reduce) return;
    rotateY.set((px - 0.5) * 7);
    rotateX.set((0.5 - py) * 6);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div className="h-full [perspective:1400px]">
      <motion.article
        ref={ref}
        id={`servicio-${service.id}`}
        aria-labelledby={`servicio-${service.id}-title`}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, "--glow": GLOW[service.accent] } as unknown as CSSProperties}
        className="glass spotlight flex h-full flex-col overflow-hidden rounded-panel p-6 sm:p-8 lg:p-10"
      >
        {/* Luz ambiental propia de cada servicio */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-1/3 -right-1/4 size-[70%] rounded-full opacity-60 blur-3xl"
          style={{ background: `radial-gradient(circle, rgb(${GLOW[service.accent]} / 0.35), transparent 65%)` }}
        />

        <div className="relative flex items-center justify-between">
          <span className="font-mono text-micro text-muted">{String(index + 1).padStart(2, "0")} / 06</span>
          <span
            className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]"
            style={{ boxShadow: `0 0 30px -6px rgb(${GLOW[service.accent]} / 0.6)` }}
          >
            <Icon aria-hidden="true" className="size-5" style={{ color: `rgb(${GLOW[service.accent]})` }} />
          </span>
        </div>

        {/* El diagrama ocupa el espacio que deja el texto: nunca lo empuja fuera del panel */}
        <div className="relative my-5 flex min-h-[9rem] flex-1 items-center justify-center lg:my-6 lg:min-h-0">
          <ServiceGlyph
            id={service.id}
            accent={service.accent}
            className="h-auto w-full max-w-[22rem] lg:absolute lg:inset-0 lg:m-auto lg:h-full lg:max-h-[15rem] lg:w-auto"
          />
        </div>

        <div className="relative">
          <h3 id={`servicio-${service.id}-title`} className="text-h3">
            {service.title}
          </h3>
          <p className="mt-3 text-small text-muted">{service.body}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {service.includes.map((item) => (
              <li key={item} className="rounded-pill border border-white/10 bg-white/[0.03] px-3 py-1.5 text-micro text-text/85">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </motion.article>
    </div>
  );
}
