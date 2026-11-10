"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X, Menu } from "lucide-react";
import { contactAnchor, href, navigation, site } from "@/config/site";
import { Logo } from "@/components/ui/Logo";
import { MagneticLink } from "@/components/ui/MagneticLink";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Barra de cristal en cuanto se baja un poco
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menú móvil: Escape lo cierra y bloquea el scroll mientras está abierto
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
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
        open
          ? "border-b border-white/8 bg-bg"
          : scrolled
            ? "border-b border-white/8 bg-bg/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="page-container flex h-18 items-center justify-between gap-6">
        <a href={href("/#inicio")} className="rounded-md" aria-label={`${site.name}, ir al inicio`}>
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group relative inline-flex h-11 items-center text-small font-medium text-muted transition-colors duration-200 hover:text-text"
                >
                  {item.label}
                  {/* Subrayado de luz que se dibuja al pasar el cursor */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-2 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,#3b82ff,#22e3ff)] transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <MagneticLink href={contactAnchor} variant="neon" size="md" className="max-sm:hidden" strength={6}>
            Hablemos
          </MagneticLink>
          <button
            ref={toggleRef}
            type="button"
            className="btn-ghost inline-flex size-11 items-center justify-center rounded-full lg:hidden"
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
      <div id={menuId} hidden={!open} className="fixed inset-x-0 top-18 bottom-0 bg-bg lg:hidden">
        <nav aria-label="Principal (móvil)" className="page-container flex h-full flex-col pt-8 pb-10">
          <ul className="flex flex-col">
            {navigation.map((item, i) => (
              <li key={item.href} className="border-b border-white/8">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-5 font-display text-[2rem] leading-none font-bold tracking-[-0.03em]"
                >
                  <span className="font-mono text-micro text-muted">0{i + 1}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3">
            <a
              href={contactAnchor}
              onClick={() => setOpen(false)}
              className="btn-neon inline-flex h-14 items-center justify-center rounded-pill font-semibold"
            >
              Transforma tu negocio
            </a>
            <a href={`mailto:${site.email}`} className="inline-flex h-11 items-center justify-center text-small text-muted">
              {site.email}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
