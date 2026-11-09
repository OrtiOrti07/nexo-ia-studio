"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { contactAnchor, navigation, site } from "@/config/site";
import { buttonClasses } from "@/components/ui/Button";
import { BrandMark } from "@/components/ui/OrbitGlyph";

type SiteHeaderProps = {
  /** true en páginas con hero a pantalla completa: la cabecera empieza transparente. */
  overlay?: boolean;
};

type Theme = "hero" | "dark" | "light";

export function SiteHeader({ overlay = false }: SiteHeaderProps) {
  const [theme, setTheme] = useState<Theme>(overlay ? "hero" : "light");
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // El tono de la cabecera sigue a la sección que tiene debajo:
  // transparente sobre el hero, oscura sobre secciones oscuras, clara en el resto.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let next: Theme = "light";
      for (const el of document.querySelectorAll<HTMLElement>("[data-header-theme]")) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 36 && rect.bottom > 36) {
          next = el.dataset.headerTheme as Theme;
          break;
        }
      }
      setTheme(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const current: Theme = open ? "light" : theme;
  const transparent = current !== "light";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-300 ease-out-quint ${
        current === "hero"
          ? "on-dark border-b border-transparent bg-transparent text-white"
          : current === "dark"
            ? "on-dark border-b border-white/10 bg-night/60 text-white backdrop-blur-md"
            : "on-paper border-b border-line/80 bg-paper/90 text-ink backdrop-blur-md"
      }`}
    >
      <div className="page-container flex h-[4.5rem] items-center justify-between gap-6">
        <Link
          href="/#inicio"
          className="flex items-center gap-2.5 rounded-md"
          aria-label={`${site.name}, ir al inicio`}
        >
          <BrandMark className="size-8" />
          <span className="wide text-[1.0625rem] font-semibold tracking-[-0.01em] whitespace-nowrap">
            {site.name}
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`rounded-pill px-4 py-2 text-ui font-medium transition-colors duration-200 ${
                    transparent ? "text-white/85 hover:bg-white/10 hover:text-white" : "text-ink/80 hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={contactAnchor}
            className={`${buttonClasses(transparent ? "signal" : "primary", "md")} max-sm:hidden`}
          >
            Hablemos
          </a>
          <button
            ref={toggleRef}
            type="button"
            className={`inline-flex h-11 items-center gap-2 rounded-pill px-4 text-ui font-medium lg:hidden ${
              transparent ? "border border-white/40" : "border border-ink/20"
            }`}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-[1.5px] w-4 bg-current transition-transform duration-300 ease-out-quint ${
                  open ? "top-[5px] rotate-45" : "top-0.5"
                }`}
              />
              <span
                className={`absolute left-0 h-[1.5px] w-4 bg-current transition-transform duration-300 ease-out-quint ${
                  open ? "top-[5px] -rotate-45" : "top-2"
                }`}
              />
            </span>
            {open ? "Cerrar" : "Menú"}
          </button>
        </div>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className="border-t border-line/80 bg-paper lg:hidden"
      >
        <nav aria-label="Principal (móvil)" className="page-container py-4">
          <ul className="flex flex-col">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="wide flex items-center justify-between border-b border-line py-4 text-[1.375rem] font-semibold text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={contactAnchor}
            onClick={() => setOpen(false)}
            className={`${buttonClasses("primary", "lg")} mt-6 w-full`}
          >
            Hablemos de tu proyecto
          </a>
        </nav>
      </div>
    </header>
  );
}
