import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "ink" | "outline" | "outline-light";
type Size = "md" | "lg";

/** Clases de un botón (sirven igual para <a> y <button>). */
export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `btn btn-${variant}${size === "lg" ? " btn-lg" : ""}${extra ? ` ${extra}` : ""}`;
}

type ButtonLinkProps = ComponentPropsWithoutRef<"a"> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

/** Enlace con aspecto de botón. */
export function ButtonLink({ variant = "primary", size = "md", className = "", children, ...props }: ButtonLinkProps) {
  return (
    <a {...props} className={buttonClass(variant, size, className)}>
      {children}
    </a>
  );
}
