import { site } from "@/config/site";

/**
 * Marca: dos ventanas de navegador superpuestas, la de delante en cobalto.
 * Resume el trabajo (webs) y la idea de profundidad de toda la identidad.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect x="2.5" y="4" width="19" height="15.5" rx="3.2" fill="#ffffff" stroke="currentColor" strokeWidth="1.7" />
      <path d="M2.5 8.6h19" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10" y="11.5" width="19.5" height="16.5" rx="3.2" fill="#2e5bff" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10 16.2h19.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="13.4" cy="13.9" r="0.95" fill="currentColor" />
      <circle cx="16.2" cy="13.9" r="0.95" fill="currentColor" />
      <path d="M14 21.5h8.5M14 24.4h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="size-8 shrink-0" />
      <span className="font-display text-[1.375rem] leading-none font-extrabold tracking-[-0.03em]">
        {site.shortName}
      </span>
      {!compact && (
        <span className="hidden border-l border-current/20 pl-2.5 font-mono text-[0.75rem] leading-none opacity-70 sm:inline">
          diseño web
        </span>
      )}
    </span>
  );
}
