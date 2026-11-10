import { useId, type CSSProperties, type ReactNode } from "react";
import type { ServiceId } from "@/content/home";
import s from "./ServiceGlyph.module.css";

/**
 * Diagrama animado de cada servicio (SVG en línea, decorativo).
 *
 * El color de acento lidera las líneas y los pulsos; los otros dos neones lo
 * acompañan. La estructura va en blanco a baja opacidad. Las animaciones viven
 * en ServiceGlyph.module.css; el fotograma base de cada glifo se lee como un
 * diagrama completo, que es lo que se ve con movimiento reducido.
 *
 * Las coordenadas trigonométricas están precalculadas para que el marcado sea
 * idéntico en servidor y cliente.
 */

type Accent = "blue" | "violet" | "cyan";

export type ServiceGlyphProps = {
  id: ServiceId;
  accent: Accent;
  className?: string;
};

type GlyphProps = {
  /** `url(#…)` del filtro de brillo */
  glow: string;
  /** `url(#…)` del degradado radial suave en el color del acento */
  halo: string;
};

const ACCENT: Record<Accent, string> = { blue: s.blue, violet: s.violet, cyan: s.cyan };

function cx(...names: (string | false | null | undefined)[]) {
  return names.filter(Boolean).join(" ");
}

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` });

/** Trazo de estructura: fino y blanco a baja opacidad */
const HAIR = { stroke: "#fff", strokeOpacity: 0.16, strokeWidth: 1 } as const;

/* ---------------------------------------------------------------------------
 * Automatización: tres carriles entran en un procesador y sale uno.
 * ------------------------------------------------------------------------- */

const AUTO_LANES = [
  { d: "M20 64H62C92 64 90 100 120 100", tone: s.cb, at: 0.12 },
  { d: "M20 120H120", tone: s.ca, at: 0 },
  { d: "M20 176H62C92 176 90 140 120 140", tone: s.cc, at: 0.24 },
];
const AUTO_OUT = "M200 120H289";
const AUTO_GRID =
  "M136 86V154M152 86V154M168 86V154M184 86V154M126 96H194M126 112H194M126 128H194M126 144H194";

function Automatizacion({ glow }: GlyphProps) {
  return (
    <>
      <g {...HAIR}>
        {AUTO_LANES.map((lane) => (
          <path key={lane.d} d={lane.d} />
        ))}
      </g>
      <path d={AUTO_OUT} className={s.ca} stroke="currentColor" strokeOpacity={0.4} />

      {/* Fuentes de entrada */}
      <g fill="#050505" stroke="#fff" strokeOpacity={0.35}>
        <circle cx={20} cy={64} r={3.5} />
        <circle cx={20} cy={120} r={3.5} />
        <circle cx={20} cy={176} r={3.5} />
      </g>

      {/* Procesador con rejilla interior */}
      <rect x={120} y={80} width={80} height={80} rx={14} fill="#fff" fillOpacity={0.03} stroke="#fff" strokeOpacity={0.24} />
      <path d={AUTO_GRID} stroke="#fff" strokeOpacity={0.07} />
      <rect className={cx(s.cb, s.autoCell)} x={137.5} y={81.5} width={13} height={13} rx={3} fill="currentColor" />
      <rect className={cx(s.cc, s.autoCell)} style={delay(0.15)} x={169.5} y={145.5} width={13} height={13} rx={3} fill="currentColor" />
      <rect className={cx(s.ca, s.autoCell)} style={delay(0.3)} x={185.5} y={97.5} width={13} height={13} rx={3} fill="currentColor" />

      <rect x={146} y={106} width={28} height={28} rx={7} fill="#08090c" />
      <g filter={glow}>
        <g className={cx(s.ca, s.fb, s.autoCore)}>
          <rect x={146} y={106} width={28} height={28} rx={7} fill="currentColor" fillOpacity={0.16} stroke="currentColor" strokeWidth={1.25} />
          <rect x={155} y={115} width={10} height={10} rx={2.5} fill="currentColor" fillOpacity={0.85} />
        </g>
      </g>

      {/* Puertos */}
      <g fill="#fff" fillOpacity={0.55}>
        <circle cx={120} cy={100} r={2} />
        <circle cx={120} cy={120} r={2} />
        <circle cx={120} cy={140} r={2} />
        <circle cx={200} cy={120} r={2} />
      </g>

      {/* Destino */}
      <circle cx={296} cy={120} r={7} stroke="#fff" strokeOpacity={0.28} />
      <circle
        className={cx(s.ca, s.fb, s.autoSink)}
        cx={296}
        cy={120}
        r={7}
        stroke="currentColor"
        strokeWidth={1.25}
        vectorEffect="non-scaling-stroke"
      />

      {/* Pulsos */}
      <g filter={glow} strokeWidth={2.5} strokeLinecap="round">
        {AUTO_LANES.map((lane) => (
          <path
            key={lane.d}
            d={lane.d}
            pathLength={100}
            stroke="currentColor"
            className={cx(lane.tone, s.pulse, s.autoIn)}
            style={delay(lane.at)}
          />
        ))}
        <path d={AUTO_OUT} pathLength={100} stroke="currentColor" className={cx(s.ca, s.pulse, s.autoOut)} />
        <circle className={s.ca} cx={296} cy={120} r={2.5} fill="currentColor" stroke="none" />
      </g>
    </>
  );
}

/* ---------------------------------------------------------------------------
 * Agentes: un núcleo que consulta cinco herramientas, una tras otra.
 * ------------------------------------------------------------------------- */

type ToolIcon = "data" | "doc" | "search" | "calendar" | "terminal";

/** Nodos sobre una elipse (rx 100, ry 78) y rama desde el borde del núcleo */
const AGENT_NODES: { x: number; y: number; d: string; icon: ToolIcon; at: number }[] = [
  { x: 160, y: 42, d: "M160 96L160 59", icon: "data", at: 0 },
  { x: 255.1, y: 95.9, d: "M183.3 114.1L238.2 100.2", icon: "doc", at: -3.2 },
  { x: 218.8, y: 183.1, d: "M176.4 137.6L203.7 166.9", icon: "search", at: -2.4 },
  { x: 101.2, y: 183.1, d: "M143.6 137.6L116.3 166.9", icon: "calendar", at: -1.6 },
  { x: 64.9, y: 95.9, d: "M136.7 114.1L81.8 100.2", icon: "terminal", at: -0.8 },
];

/** Iconos genéricos dibujados alrededor de (0, 0) */
const TOOL_ICONS: Record<ToolIcon, ReactNode> = {
  data: (
    <>
      <ellipse cx={0} cy={-4.5} rx={6} ry={2.2} />
      <path d="M-6 -4.5V4.5C-6 5.7 -3.3 6.7 0 6.7S6 5.7 6 4.5V-4.5M-6 0C-6 1.2 -3.3 2.2 0 2.2S6 1.2 6 0" />
    </>
  ),
  doc: <path d="M-4.5 -6.5H1.5L5 -3V6.5H-4.5ZM1.5 -6.5V-3H5M-2 0.5H2.5M-2 3.5H2.5" />,
  search: (
    <>
      <circle cx={-1.5} cy={-1.5} r={4.5} />
      <path d="M1.8 1.8L6 6" />
    </>
  ),
  calendar: (
    <>
      <rect x={-6} y={-5} width={12} height={11} rx={2} />
      <path d="M-6 -1H6M-3 -7V-3M3 -7V-3" />
    </>
  ),
  terminal: <path d="M-5.5 -3.5L-1.5 0L-5.5 3.5M0.5 4.5H5.5" />,
};

/** Nodo que queda iluminado en el fotograma estático */
const AGENT_STILL = 1;

function Agentes({ glow, halo }: GlyphProps) {
  return (
    <>
      <ellipse cx={160} cy={120} rx={100} ry={78} stroke="#fff" strokeOpacity={0.06} strokeDasharray="2 6" />
      <g {...HAIR}>
        {AGENT_NODES.map((node) => (
          <path key={node.d} d={node.d} />
        ))}
      </g>

      {/* Ida (acento) y vuelta (apoyo) de cada consulta */}
      <g filter={glow} strokeWidth={2.5} strokeLinecap="round">
        {AGENT_NODES.map((node, i) => (
          <g key={node.d}>
            <path
              d={node.d}
              pathLength={100}
              stroke="currentColor"
              className={cx(s.ca, s.agOut, i === AGENT_STILL && s.on)}
              style={delay(node.at)}
            />
            <path d={node.d} pathLength={100} stroke="currentColor" className={cx(s.cb, s.agBack)} style={delay(node.at)} />
          </g>
        ))}
      </g>

      {/* Herramientas */}
      {AGENT_NODES.map((node) => (
        <g key={node.icon}>
          <rect
            x={node.x - 14}
            y={node.y - 14}
            width={28}
            height={28}
            rx={8}
            fill="#fff"
            fillOpacity={0.03}
            stroke="#fff"
            strokeOpacity={0.22}
          />
          <g
            transform={`translate(${node.x} ${node.y})`}
            stroke="#fff"
            strokeOpacity={0.6}
            strokeWidth={1.1}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {TOOL_ICONS[node.icon]}
          </g>
        </g>
      ))}
      <g filter={glow}>
        {AGENT_NODES.map((node, i) => (
          <rect
            key={node.icon}
            className={cx(s.ca, s.agNode, i === AGENT_STILL && s.on)}
            style={delay(node.at)}
            x={node.x - 14}
            y={node.y - 14}
            width={28}
            height={28}
            rx={8}
            fill="currentColor"
            fillOpacity={0.08}
            stroke="currentColor"
            strokeWidth={1.25}
          />
        ))}
      </g>

      {/* Núcleo con anillo discontinuo que gira despacio */}
      <g className={s.agSpin}>
        <circle cx={160} cy={120} r={32} stroke="#fff" strokeOpacity={0.3} strokeDasharray="1 5" strokeLinecap="round" />
        <circle
          className={s.ca}
          cx={160}
          cy={120}
          r={32}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeDasharray="16 185"
          strokeLinecap="round"
        />
      </g>
      <circle cx={160} cy={120} r={20} fill={halo} />
      <circle className={s.ca} cx={160} cy={120} r={20} stroke="currentColor" strokeOpacity={0.75} />
      <circle
        className={cx(s.ca, s.fb, s.agBeat)}
        style={delay(-0.04)}
        cx={160}
        cy={120}
        r={20}
        stroke="currentColor"
        vectorEffect="non-scaling-stroke"
      />
      <circle className={s.ca} cx={160} cy={120} r={5} fill="currentColor" filter={glow} />
    </>
  );
}

/* ---------------------------------------------------------------------------
 * Asistentes: conversación por turnos, indicador de escritura y voz.
 * ------------------------------------------------------------------------- */

const BUBBLE_USER = "M38 34H166A14 14 0 0 1 180 48V66A14 14 0 0 1 166 80H28A4 4 0 0 1 24 76V48A14 14 0 0 1 38 34Z";
const BUBBLE_BOT = "M154 94H282A14 14 0 0 1 296 108V136A4 4 0 0 1 292 140H154A14 14 0 0 1 140 126V108A14 14 0 0 1 154 94Z";

const WAVE = [
  { x: 48, h: 6, at: -0.15 },
  { x: 56, h: 12, at: -0.95 },
  { x: 64, h: 18, at: -0.45 },
  { x: 72, h: 26, at: -1.1 },
  { x: 80, h: 16, at: -0.3 },
  { x: 88, h: 22, at: -0.75 },
  { x: 96, h: 30, at: -0.05 },
  { x: 104, h: 20, at: -0.6 },
  { x: 112, h: 12, at: -1 },
  { x: 120, h: 24, at: -0.35 },
  { x: 128, h: 14, at: -0.85 },
  { x: 136, h: 8, at: -0.2 },
  { x: 144, h: 5, at: -0.7 },
];

function Asistentes({ glow }: GlyphProps) {
  return (
    <>
      {/* Mensaje de la persona */}
      <g className={s.asUser}>
        <path d={BUBBLE_USER} fill="#fff" fillOpacity={0.04} stroke="#fff" strokeOpacity={0.24} />
        <rect x={40} y={48} width={104} height={5} rx={2.5} fill="#fff" fillOpacity={0.32} />
        <rect x={40} y={61} width={66} height={5} rx={2.5} fill="#fff" fillOpacity={0.2} />
      </g>

      {/* Respuesta del asistente */}
      <g className={s.asBot}>
        <path d={BUBBLE_BOT} className={s.ca} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeOpacity={0.7} />
        <rect x={156} y={108} width={116} height={5} rx={2.5} fill="#fff" fillOpacity={0.42} />
        <rect x={156} y={121} width={78} height={5} rx={2.5} fill="#fff" fillOpacity={0.28} />
      </g>

      {/* Escribiendo… */}
      <g className={s.asTyping}>
        <rect
          className={s.ca}
          x={240}
          y={94}
          width={56}
          height={26}
          rx={13}
          fill="currentColor"
          fillOpacity={0.08}
          stroke="currentColor"
          strokeOpacity={0.5}
        />
        <g className={s.ca} fill="currentColor" filter={glow}>
          <circle className={s.asDot} cx={256} cy={107} r={2.6} />
          <circle className={s.asDot} style={delay(0.13)} cx={268} cy={107} r={2.6} />
          <circle className={s.asDot} style={delay(0.26)} cx={280} cy={107} r={2.6} />
        </g>
      </g>

      {/* Entrada de voz */}
      <rect x={24} y={168} width={272} height={42} rx={21} fill="#fff" fillOpacity={0.025} stroke="#fff" strokeOpacity={0.16} />
      <g className={s.ca} stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" filter={glow}>
        {WAVE.map((bar) => (
          <line
            key={bar.x}
            className={s.asBar}
            style={delay(bar.at)}
            x1={bar.x}
            x2={bar.x}
            y1={189 - bar.h / 2}
            y2={189 + bar.h / 2}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
      <circle className={s.cb} cx={272} cy={189} r={13} fill="currentColor" fillOpacity={0.14} stroke="currentColor" strokeOpacity={0.6} />
      <g stroke="#fff" strokeOpacity={0.8} strokeWidth={1.2} strokeLinecap="round">
        <rect x={269} y={181} width={6} height={10} rx={3} />
        <path d="M265.5 187.5A6.5 6.5 0 0 0 278.5 187.5M272 194V197" />
      </g>
    </>
  );
}

/* ---------------------------------------------------------------------------
 * Integración: cuatro sistemas conectados a un núcleo, por turnos.
 * ------------------------------------------------------------------------- */

const SYSTEMS = [
  { label: "CRM", x: 22, y: 36, link: "M98 54C124 54 112 111.1 135.6 111.1", at: 0 },
  { label: "ERP", x: 222, y: 36, link: "M222 54C196 54 208 111.1 184.4 111.1", at: -3 },
  { label: "Docs", x: 222, y: 168, link: "M222 186C196 186 208 128.9 184.4 128.9", at: -2 },
  { label: "Correo", x: 22, y: 168, link: "M98 186C124 186 112 128.9 135.6 128.9", at: -1 },
];

function Integracion({ glow, halo }: GlyphProps) {
  return (
    <>
      <g {...HAIR}>
        {SYSTEMS.map((sys) => (
          <path key={sys.label} d={sys.link} />
        ))}
      </g>

      {/* Conexión que se enciende y chispa en su frente */}
      <g filter={glow}>
        {SYSTEMS.map((sys) => (
          <g key={sys.label} stroke="currentColor" className={s.ca}>
            <path d={sys.link} pathLength={100} strokeWidth={1.5} className={s.inLink} style={delay(sys.at)} />
            <path d={sys.link} pathLength={100} strokeWidth={3} strokeLinecap="round" className={s.inSpark} style={delay(sys.at)} />
          </g>
        ))}
      </g>

      {/* Sistemas */}
      {SYSTEMS.map((sys) => (
        <g key={sys.label}>
          <rect x={sys.x} y={sys.y} width={76} height={36} rx={10} fill="#fff" fillOpacity={0.03} stroke="#fff" strokeOpacity={0.22} />
          <g className={cx(s.ca, s.inBlock)} style={delay(sys.at)}>
            <rect
              x={sys.x}
              y={sys.y}
              width={76}
              height={36}
              rx={10}
              fill="currentColor"
              fillOpacity={0.07}
              stroke="currentColor"
              strokeWidth={1.25}
            />
            <circle cx={sys.x + 14} cy={sys.y + 18} r={2.2} fill="currentColor" />
          </g>
          <circle cx={sys.x + 14} cy={sys.y + 18} r={2.2} fill="#fff" fillOpacity={0.3} />
          <text
            x={sys.x + 45}
            y={sys.y + 18.5}
            className="font-mono"
            fontSize={11}
            letterSpacing="0.04em"
            fill="#fff"
            fillOpacity={0.7}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {sys.label}
          </text>
        </g>
      ))}

      {/* Núcleo */}
      <circle cx={160} cy={120} r={26} fill={halo} />
      <circle className={s.ca} cx={160} cy={120} r={26} stroke="currentColor" strokeOpacity={0.65} />
      <circle
        className={cx(s.cb, s.inSpin)}
        cx={160}
        cy={120}
        r={17}
        stroke="currentColor"
        strokeOpacity={0.8}
        strokeDasharray="3 4.5"
      />
      <circle
        className={cx(s.ca, s.fb, s.inBeat)}
        style={delay(-0.28)}
        cx={160}
        cy={120}
        r={26}
        stroke="currentColor"
        vectorEffect="non-scaling-stroke"
      />
      <g className={s.cc} fill="currentColor" fillOpacity={0.85}>
        <circle cx={135.6} cy={111.1} r={1.8} />
        <circle cx={184.4} cy={111.1} r={1.8} />
        <circle cx={135.6} cy={128.9} r={1.8} />
        <circle cx={184.4} cy={128.9} r={1.8} />
      </g>
      <circle className={s.ca} cx={160} cy={120} r={6} fill="currentColor" filter={glow} />
    </>
  );
}

/* ---------------------------------------------------------------------------
 * Estrategia: radar con barrido y señales que se encienden a su paso.
 * ------------------------------------------------------------------------- */

const RADAR_TICKS =
  "M260 120L267 120M256.6 145.9L260.5 146.9M246.6 170L250.1 172M230.7 190.7L233.5 193.5M210 206.6L212 210.1M185.9 216.6L186.9 220.5M160 220L160 227M134.1 216.6L133.1 220.5M110 206.6L108 210.1M89.3 190.7L86.5 193.5M73.4 170L69.9 172M63.4 145.9L59.5 146.9M60 120L53 120M63.4 94.1L59.5 93.1M73.4 70L69.9 68M89.3 49.3L86.5 46.5M110 33.4L108 29.9M134.1 23.4L133.1 19.5M160 20L160 13M185.9 23.4L186.9 19.5M210 33.4L212 29.9M230.7 49.3L233.5 46.5M246.6 70L250.1 68M256.6 94.1L260.5 93.1";

/** Sectores anidados (5° a 50°) tras el borde de ataque: estela que se desvanece */
const SWEEP_SECTORS = [
  "M160 120L259.6 111.3A100 100 0 0 1 260 120Z",
  "M160 120L258.5 102.6A100 100 0 0 1 260 120Z",
  "M160 120L256.6 94.1A100 100 0 0 1 260 120Z",
  "M160 120L254 85.8A100 100 0 0 1 260 120Z",
  "M160 120L250.6 77.7A100 100 0 0 1 260 120Z",
  "M160 120L246.6 70A100 100 0 0 1 260 120Z",
  "M160 120L241.9 62.6A100 100 0 0 1 260 120Z",
  "M160 120L236.6 55.7A100 100 0 0 1 260 120Z",
  "M160 120L230.7 49.3A100 100 0 0 1 260 120Z",
  "M160 120L224.3 43.4A100 100 0 0 1 260 120Z",
];

/**
 * Señales. `at` = ángulo / 360 × 4 s − 4 s: el retardo negativo hace que cada
 * una se encienda justo cuando el barrido (4 s por vuelta) pasa por su ángulo.
 */
const BLIPS = [
  { x: 221.1, y: 158.2, at: -3.64, tone: s.ca, still: false },
  { x: 166.2, y: 149.3, at: -3.13, tone: s.cc, still: false },
  { x: 123.8, y: 148.3, at: -2.42, tone: s.ca, still: false },
  { x: 90.4, y: 73, at: -1.62, tone: s.cb, still: false },
  { x: 183.2, y: 62.5, at: -0.76, tone: s.ca, still: true },
];

function Estrategia({ glow, halo }: GlyphProps) {
  return (
    <>
      <circle cx={160} cy={120} r={100} fill={halo} opacity={0.35} />
      <g stroke="#fff">
        <circle cx={160} cy={120} r={100} strokeOpacity={0.18} />
        <circle cx={160} cy={120} r={66} strokeOpacity={0.1} />
        <circle cx={160} cy={120} r={33} strokeOpacity={0.1} />
        <path d="M52 120H268M160 12V228" strokeOpacity={0.08} />
        <path d={RADAR_TICKS} strokeOpacity={0.28} />
      </g>

      <g className={cx(s.ca, s.esSweep)}>
        <g fill="currentColor" fillOpacity={0.045}>
          {SWEEP_SECTORS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g filter={glow}>
          <path d="M160 120H260" stroke="currentColor" strokeWidth={1.25} />
          <circle cx={260} cy={120} r={2} fill="currentColor" />
        </g>
      </g>

      {BLIPS.map((blip) => (
        <circle
          key={blip.at}
          className={cx(blip.tone, s.fb, s.esRing, blip.still && s.on)}
          style={delay(blip.at)}
          cx={blip.x}
          cy={blip.y}
          r={3}
          stroke="currentColor"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <g filter={glow}>
        {BLIPS.map((blip) => (
          <circle
            key={blip.at}
            className={cx(blip.tone, s.fb, s.esBlip, blip.still && s.on)}
            style={delay(blip.at)}
            cx={blip.x}
            cy={blip.y}
            r={2.6}
            fill="currentColor"
          />
        ))}
      </g>
      <circle cx={160} cy={120} r={2.5} fill="#fff" fillOpacity={0.7} />
    </>
  );
}

/* ---------------------------------------------------------------------------
 * A medida: esfera paramétrica de meridianos y puntos que gira despacio.
 *
 * Proyección ortográfica con la cámara 20° por encima del ecuador. Cada
 * meridiano es una elipse base transformada con scaleX(sen α) skewY(φ); los
 * puntos de la retícula se mueven por sus paralelos. El giro completo dura
 * 16 s; el retardo negativo de cada elemento es su longitud inicial.
 * ------------------------------------------------------------------------- */

const MERIDIANS = [
  { t: "scaleX(0.001) skewY(18.88deg)", at: 0 },
  { t: "scaleX(0.5) skewY(16.5deg)", at: -1.333 },
  { t: "scaleX(0.866) skewY(9.7deg)", at: -2.667 },
  { t: "scaleX(1) skewY(0deg)", at: -4 },
  { t: "scaleX(0.866) skewY(-9.7deg)", at: -5.333 },
  { t: "scaleX(0.5) skewY(-16.5deg)", at: -6.667 },
];

type Parallel = "eq" | "n" | "s";

const PARALLEL_CLASS: Record<Parallel, string> = { eq: s.meEq, n: s.meN, s: s.meS };

/** Puntos de la retícula: fotograma inicial (posición y profundidad) */
const LATTICE: { p: Parallel; t: string; o: number; at: number; tone?: string }[] = [
  { p: "eq", t: "translate(0px, 25.31px)", o: 0.97, at: 0, tone: s.ca },
  { p: "eq", t: "translate(64.09px, 12.65px)", o: 0.77, at: -2.667 },
  { p: "eq", t: "translate(64.09px, -12.65px)", o: 0.35, at: -5.333 },
  { p: "eq", t: "translate(0px, -25.31px)", o: 0.15, at: -8 },
  { p: "eq", t: "translate(-64.09px, -12.65px)", o: 0.35, at: -10.667 },
  { p: "eq", t: "translate(-64.09px, 12.65px)", o: 0.77, at: -13.333 },
  { p: "n", t: "translate(28.34px, -27.91px)", o: 0.93, at: -1.333 },
  { p: "n", t: "translate(49.09px, -54.39px)", o: 0.5, at: -5.333 },
  { p: "n", t: "translate(-28.34px, -61.49px)", o: 0.38, at: -9.333, tone: s.cb },
  { p: "n", t: "translate(-49.09px, -35px)", o: 0.82, at: -13.333 },
  { p: "s", t: "translate(49.09px, 54.39px)", o: 0.62, at: -2.667 },
  { p: "s", t: "translate(28.34px, 27.91px)", o: 0.19, at: -6.667, tone: s.cc },
  { p: "s", t: "translate(-49.09px, 35px)", o: 0.3, at: -10.667 },
  { p: "s", t: "translate(-28.34px, 61.49px)", o: 0.74, at: -14.667 },
];

/** Paralelos: mitad trasera (arriba) y delantera (abajo) */
const PARALLELS = [
  { back: "M103.31 75.3A56.69 19.39 0 0 1 216.69 75.3", front: "M103.31 75.3A56.69 19.39 0 0 0 216.69 75.3" },
  { back: "M86 120A74 25.31 0 0 1 234 120", front: "M86 120A74 25.31 0 0 0 234 120" },
  { back: "M103.31 164.7A56.69 19.39 0 0 1 216.69 164.7", front: "M103.31 164.7A56.69 19.39 0 0 0 216.69 164.7" },
];

const ORBIT = "M34 120A126 32 0 1 0 286 120A126 32 0 1 0 34 120Z";

function Medida({ glow }: GlyphProps) {
  return (
    <>
      {/* Órbita inclinada con dos señales */}
      <g transform="rotate(18 160 120)">
        <path d={ORBIT} stroke="#fff" strokeOpacity={0.1} />
        <g filter={glow} strokeWidth={2} strokeLinecap="round">
          <path d={ORBIT} pathLength={100} stroke="currentColor" className={cx(s.ca, s.meOrbit)} />
          <path d={ORBIT} pathLength={100} stroke="currentColor" className={cx(s.cc, s.meOrbit)} style={delay(-2)} />
        </g>
      </g>

      <g transform="rotate(-14 160 120)">
        <circle className={s.ca} cx={160} cy={120} r={74} stroke="currentColor" strokeOpacity={0.3} />
        <path d="M160 34V206" stroke="#fff" strokeOpacity={0.18} strokeDasharray="2 4" />

        <g stroke="#fff" strokeOpacity={0.16}>
          {MERIDIANS.map((m) => (
            <ellipse
              key={m.at}
              className={s.meMeridian}
              style={{ transform: m.t, animationDelay: `${m.at}s` }}
              cx={160}
              cy={120}
              rx={74}
              ry={69.54}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        <g stroke="#fff" strokeOpacity={0.1}>
          {PARALLELS.map((p) => (
            <path key={p.back} d={p.back} />
          ))}
        </g>
        <g stroke="#fff" strokeOpacity={0.45} strokeWidth={1.4} strokeDasharray="0.1 4.2" strokeLinecap="round">
          <path d={PARALLELS[0].front} />
          <path d={PARALLELS[2].front} />
          <path d={PARALLELS[1].front} className={s.ca} stroke="currentColor" strokeOpacity={0.8} />
        </g>

        <g fill="#fff" fillOpacity={0.5}>
          <circle cx={160} cy={50.46} r={2} />
          <circle cx={160} cy={189.54} r={2} />
        </g>

        {LATTICE.filter((dot) => !dot.tone).map((dot) => (
          <circle
            key={dot.at + dot.p}
            className={PARALLEL_CLASS[dot.p]}
            style={{ transform: dot.t, opacity: dot.o, animationDelay: `${dot.at}s` }}
            cx={160}
            cy={120}
            r={1.7}
            fill="#fff"
          />
        ))}
        <g filter={glow}>
          {LATTICE.filter((dot) => dot.tone).map((dot) => (
            <circle
              key={dot.at + dot.p}
              className={cx(dot.tone, PARALLEL_CLASS[dot.p])}
              style={{ transform: dot.t, opacity: dot.o, animationDelay: `${dot.at}s` }}
              cx={160}
              cy={120}
              r={3.2}
              fill="currentColor"
            />
          ))}
        </g>
      </g>
    </>
  );
}

const GLYPHS: Record<ServiceId, (props: GlyphProps) => ReactNode> = {
  automatizacion: Automatizacion,
  agentes: Agentes,
  asistentes: Asistentes,
  integracion: Integracion,
  estrategia: Estrategia,
  medida: Medida,
};

export function ServiceGlyph({ id, accent, className }: ServiceGlyphProps) {
  // Identificadores únicos por instancia para el filtro y el degradado
  const uid = useId().replace(/[^\w-]/g, "");
  const glowId = `sg${uid}glow`;
  const haloId = `sg${uid}halo`;
  const Glyph = GLYPHS[id];

  return (
    <svg
      viewBox="0 0 320 240"
      aria-hidden="true"
      focusable="false"
      fill="none"
      className={cx(s.glyph, ACCENT[accent], className)}
    >
      <defs>
        <filter
          id={glowId}
          filterUnits="userSpaceOnUse"
          x={-40}
          y={-40}
          width={400}
          height={320}
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation={6} result="wide" />
          <feGaussianBlur in="SourceGraphic" stdDeviation={2} result="near" />
          <feMerge>
            <feMergeNode in="wide" />
            <feMergeNode in="near" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={haloId} className={s.ca}>
          <stop offset="0" stopColor="currentColor" stopOpacity={0.32} />
          <stop offset="1" stopColor="currentColor" stopOpacity={0} />
        </radialGradient>
      </defs>
      <Glyph glow={`url(#${glowId})`} halo={`url(#${haloId})`} />
    </svg>
  );
}
