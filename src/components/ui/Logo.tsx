import { site } from "@/config/site";

/** Marca: un núcleo con tres nodos conectados, en el degradado de la paleta. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="logo-neon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b82ff" />
          <stop offset="0.5" stopColor="#8b5cff" />
          <stop offset="1" stopColor="#22e3ff" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="none" stroke="url(#logo-neon)" strokeWidth="1.6" opacity="0.9" />
      <path d="M9 20.5 16 9.5l7 11z" fill="none" stroke="#eef0f5" strokeWidth="1.3" strokeLinejoin="round" opacity="0.55" />
      <circle cx="16" cy="9.5" r="2.3" fill="#22e3ff" />
      <circle cx="9" cy="20.5" r="2.3" fill="#3b82ff" />
      <circle cx="23" cy="20.5" r="2.3" fill="#8b5cff" />
      <circle cx="16" cy="16.8" r="1.6" fill="#eef0f5" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="size-8 shrink-0" />
      <span className="wide font-display text-[1.0625rem] font-bold tracking-[-0.02em] whitespace-nowrap">
        {site.name}
      </span>
    </span>
  );
}
