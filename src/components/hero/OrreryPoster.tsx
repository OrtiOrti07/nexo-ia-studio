/**
 * Versión estática y ligera del planetario. Se muestra cuando el usuario
 * prefiere movimiento reducido, ahorra datos, el equipo es poco potente o el
 * navegador no admite WebGL.
 */

/** Redondeo para que el SVG sea idéntico en servidor y navegador. */
const r2 = (n: number) => Math.round(n * 100) / 100;

const ORBITS = [
  { rx: 158, ry: 50, rotate: -16 },
  { rx: 220, ry: 92, rotate: 22 },
  { rx: 286, ry: 64, rotate: -5 },
];

const NODES = [
  { orbit: 0, t: 0.5, r: 8, amber: true },
  { orbit: 0, t: 3.7, r: 5, amber: false },
  { orbit: 1, t: 2.1, r: 6.5, amber: false },
  { orbit: 1, t: 4.4, r: 9, amber: true },
  { orbit: 2, t: 2.75, r: 10.5, amber: true },
  { orbit: 2, t: 0.75, r: 5.5, amber: false },
  { orbit: 2, t: 5.6, r: 4.5, amber: false },
];

function onOrbit(orbitIndex: number, t: number) {
  const { rx, ry, rotate } = ORBITS[orbitIndex];
  const a = (rotate * Math.PI) / 180;
  const x = rx * Math.cos(t);
  const y = ry * Math.sin(t);
  return {
    x: r2(300 + x * Math.cos(a) - y * Math.sin(a)),
    y: r2(300 + x * Math.sin(a) + y * Math.cos(a)),
  };
}

// Polvo de fondo con posiciones fijas (deterministas)
const DUST = Array.from({ length: 46 }, (_, i) => {
  const angle = i * 2.399963;
  const radius = 120 + ((i * 53) % 170);
  return {
    x: r2(300 + Math.cos(angle) * radius * 1.02),
    y: r2(300 + Math.sin(angle) * radius * 0.9),
    r: r2(0.8 + ((i * 7) % 5) * 0.28),
    o: r2(0.25 + ((i * 11) % 6) * 0.07),
  };
});

export function OrreryPoster({ className = "" }: { className?: string }) {
  const nodes = NODES.map((n) => ({ ...n, ...onOrbit(n.orbit, n.t) }));
  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="poster-halo">
          <stop offset="0" stopColor="#ffb347" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="poster-core" cx="0.38" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#ffe3ad" />
          <stop offset="0.55" stopColor="#f6b443" />
          <stop offset="1" stopColor="#d98a12" />
        </radialGradient>
        <radialGradient id="poster-glass" r="0.5">
          <stop offset="0.72" stopColor="#dfe7ff" stopOpacity="0" />
          <stop offset="1" stopColor="#dfe7ff" stopOpacity="0.28" />
        </radialGradient>
        <radialGradient id="poster-node" cx="0.35" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c9d3ff" />
        </radialGradient>
      </defs>

      {DUST.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#dbe3ff" opacity={d.o} />
      ))}

      <circle cx="300" cy="300" r="120" fill="url(#poster-halo)" />

      {nodes.map((n, i) => (
        <line
          key={`l${i}`}
          x1={n.x}
          y1={n.y}
          x2="300"
          y2="300"
          stroke={n.amber ? "#f6b443" : "#dbe3ff"}
          strokeOpacity={n.amber ? 0.45 : 0.28}
          strokeWidth="1"
        />
      ))}

      {ORBITS.map((o, i) => (
        <ellipse
          key={`o${i}`}
          cx="300"
          cy="300"
          rx={o.rx}
          ry={o.ry}
          transform={`rotate(${o.rotate} 300 300)`}
          fill="none"
          stroke="#e9edff"
          strokeOpacity="0.85"
          strokeWidth="1.6"
        />
      ))}

      <circle cx="300" cy="300" r="82" fill="url(#poster-glass)" />
      <circle
        cx="300"
        cy="300"
        r="82"
        fill="none"
        stroke="#dfe7ff"
        strokeOpacity="0.5"
        strokeWidth="1.2"
      />
      <circle
        cx="300"
        cy="300"
        r="92"
        fill="none"
        stroke="#dbe3ff"
        strokeOpacity="0.32"
        strokeDasharray="2 9"
      />
      <circle cx="300" cy="300" r="34" fill="url(#poster-core)" />

      {nodes.map((n, i) =>
        n.amber ? (
          <g key={`n${i}`}>
            <circle cx={n.x} cy={n.y} r={n.r * 3} fill="url(#poster-halo)" />
            <circle cx={n.x} cy={n.y} r={n.r} fill="#f6b443" />
          </g>
        ) : (
          <circle key={`n${i}`} cx={n.x} cy={n.y} r={n.r} fill="url(#poster-node)" />
        ),
      )}
    </svg>
  );
}
