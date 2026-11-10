"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import { useRef, type ComponentPropsWithoutRef, type PointerEvent, type ReactNode } from "react";

type Variant = "neon" | "ghost";
type Size = "md" | "lg";

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-small",
  lg: "h-14 px-7 text-[1rem]",
};

export function linkClasses(variant: Variant = "neon", size: Size = "md") {
  return `inline-flex items-center justify-center gap-2.5 rounded-pill font-sans font-semibold whitespace-nowrap select-none ${
    variant === "neon" ? "btn-neon" : "btn-ghost"
  } ${sizes[size]}`;
}

type MagneticLinkProps = Omit<ComponentPropsWithoutRef<"a">, "onPointerMove" | "onPointerLeave"> & {
  variant?: Variant;
  size?: Size;
  /** Cuánto se deja atraer por el cursor (en px). */
  strength?: number;
  children: ReactNode;
};

/**
 * Enlace con aspecto de botón y efecto magnético: con ratón, se desplaza
 * levemente hacia el cursor con un muelle. En táctil o con movimiento reducido
 * se queda quieto.
 */
export function MagneticLink({
  variant = "neon",
  size = "md",
  strength = 10,
  className = "",
  children,
  ...props
}: MagneticLinkProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.6 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.6 });

  const onMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduce || event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength * 0.6);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span ref={ref} style={{ x, y }} className="inline-flex">
      <a
        {...props}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={`${linkClasses(variant, size)} ${className}`}
      >
        {children}
      </a>
    </motion.span>
  );
}
