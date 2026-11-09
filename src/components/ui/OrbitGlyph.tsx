/**
 * Versión plana del sistema orbital del hero. Se usa en servicios para indicar
 * en qué "órbita" del negocio actúa cada uno: estrategia (centro), operaciones
 * (media) o presencia (exterior).
 */

const ORBITS = [
  { rx: 18, ry: 9, rotate: -14, nodeAt: 0.6 },
  { rx: 31, ry: 15, rotate: -22, nodeAt: 3.7 },
  { rx: 44, ry: 21, rotate: -8, nodeAt: 5.3 },
] as const;

function pointOnOrbit(index: number) {
  const { rx, ry, rotate, nodeAt } = ORBITS[index];
  const x = rx * Math.cos(nodeAt);
  const y = ry * Math.sin(nodeAt);
  const a = (rotate * Math.PI) / 180;
  return {
    x: 50 + x * Math.cos(a) - y * Math.sin(a),
    y: 50 + x * Math.sin(a) + y * Math.cos(a),
  };
}

type OrbitGlyphProps = {
  active: 0 | 1 | 2;
  className?: string;
};

export function OrbitGlyph({ active, className = "" }: OrbitGlyphProps) {
  const node = pointOnOrbit(active);
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {ORBITS.map((orbit, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="50"
          rx={orbit.rx}
          ry={orbit.ry}
          transform={`rotate(${orbit.rotate} 50 50)`}
          fill="none"
          stroke={i === active ? "var(--color-cobalt)" : "var(--color-line)"}
          strokeWidth={i === active ? 2.4 : 1.3}
        />
      ))}
      <circle cx="50" cy="50" r="8" fill="var(--color-cobalt)" />
      <circle cx="50" cy="50" r="3.4" fill="var(--color-amber)" />
      <circle
        cx={node.x}
        cy={node.y}
        r="5"
        fill="var(--color-amber)"
        stroke="var(--color-ink)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Marca gráfica: un núcleo con una órbita y un nodo. */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse
        cx="16"
        cy="16"
        rx="14"
        ry="6.2"
        transform="rotate(-24 16 16)"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="16" cy="16" r="5.4" fill="currentColor" />
      <circle cx="28.8" cy="10.3" r="2.9" fill="var(--color-amber)" />
    </svg>
  );
}
