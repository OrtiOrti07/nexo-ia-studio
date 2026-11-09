import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "signal" | "primary" | "outline-light" | "outline";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-pill font-sans font-semibold whitespace-nowrap select-none " +
  "transition-[background-color,color,border-color,transform] duration-200 ease-out-quint active:scale-[0.97] " +
  "disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  // Acción principal sobre cobalto
  signal: "bg-amber text-ink hover:bg-amber-soft",
  // Acción principal sobre papel
  primary: "bg-cobalt text-white hover:bg-cobalt-deep",
  // Acción secundaria sobre cobalto
  "outline-light":
    "border-[1.5px] border-white/70 text-white hover:border-white hover:bg-white/10",
  // Acción secundaria sobre papel
  outline:
    "border-[1.5px] border-ink/30 text-ink hover:border-ink hover:bg-ink/5",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-ui",
  lg: "h-14 px-7 text-[1.0625rem]",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md") {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}

type ButtonLinkProps = ComponentPropsWithoutRef<"a"> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

/** Enlace con aspecto de botón (para anclas y navegación). */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={`${buttonClasses(variant, size)} ${className}`} {...props}>
      {children}
    </a>
  );
}
