"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { contactAnchor, href, navigation, site } from "@/config/site";
import { Logo } from "@/components/ui/Logo";
import { buttonClass } from "@/components/ui/Button";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Barra de papel translúcido en cuanto se baja un poco
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menú móvil: Escape lo cierra y se bloquea el scroll mientras está abierto
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
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header
      // Con el menú abierto, fondo sólido y sin desenfoque: backdrop-filter haría
      // que el panel fijo del menú se midiera respecto a la cabecera y no a la pantalla
      data-open={open ? "" : undefined}
      className={`site-header fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,color] duration-300 ${
        open
          ? "border-line bg-paper"
          : scrolled
            ? "border-line/80 bg-paper/85 shadow-[0_8px_24px_-18px_rgb(15_23_42/0.35)] backdrop-blur-lg"
            : "border-transparent bg-transparent"
      }`}
    >
      <div className="page-container flex h-[4.5rem] items-center justify-between gap-6">
        <a href={href("/#inicio")} className="inline-flex min-h-11 items-center rounded-md" aria-label={`${site.owner}, diseño web: ir al inicio`}>
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex h-11 items-center rounded-pill px-4 text-small font-medium text-ink/75 transition-colors duration-200 hover:bg-ink/[0.05] hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={contactAnchor} className={buttonClass("ink", "md", "max-sm:hidden")}>
            Cuéntame tu proyecto
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="btn btn-outline size-12 min-h-0 px-0 lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Menú móvil a pantalla completa */}
      <div id={menuId} hidden={!open} className="fixed inset-x-0 top-[4.5rem] bottom-0 overflow-y-auto bg-paper lg:hidden">
        <nav aria-label="Principal (móvil)" className="page-container flex min-h-full flex-col pt-6 pb-8">
          <ul className="flex flex-col">
            {navigation.map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-5 font-display text-[2.25rem] leading-none font-bold tracking-[-0.03em]"
                >
                  <span className="font-mono text-micro font-normal tracking-normal text-muted">0{i + 1}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3 pt-10">
            <a href={contactAnchor} onClick={() => setOpen(false)} className={buttonClass("primary", "lg")}>
              Cuéntame tu proyecto
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
            <a href={`tel:${site.phone.href}`} className="inline-flex min-h-11 items-center justify-center text-small text-muted">
              o llámame al {site.phone.display}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
