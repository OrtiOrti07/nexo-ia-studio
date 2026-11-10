import type { CSSProperties, ReactNode } from "react";
import {
  ArrowUp,
  BookOpen,
  Calculator,
  Check,
  Database,
  FileText,
  LoaderCircle,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { CaseVisual as CaseVisualKind } from "@/content/home";
import s from "./CaseVisual.module.css";

/**
 * Fragmento de interfaz vivo (HTML y CSS) para cada proyecto de demostración.
 *
 * Todo el contenido es ficticio y genérico. Cada demo es un bucle de 8–9 s
 * hecho con keyframes (CaseVisual.module.css); el estado base de cada elemento
 * es el fotograma final, que es lo que se ve con movimiento reducido. Para los
 * lectores de pantalla, la raíz es una imagen con una descripción en español.
 */

export type CaseVisualProps = {
  kind: CaseVisualKind;
  className?: string;
};

type Vars = CSSProperties & { [key: `--${string}`]: string };

function cx(...names: (string | false | null | undefined)[]) {
  return names.filter(Boolean).join(" ");
}

const FRAME: Record<CaseVisualKind, { title: string; status: string; label: string }> = {
  invoices: {
    title: "Facturas de proveedores",
    status: "En ejecución",
    label:
      "Demostración: tres facturas de proveedores avanzan solas por las fases recibida, datos extraídos, validada con pedido y lista para aprobar.",
  },
  support: {
    title: "Asistente de la tienda",
    status: "En línea",
    label:
      "Demostración: un asistente de tienda online responde dónde está un pedido y, cuando el cliente quiere devolver un producto dañado, transfiere la conversación a una persona del equipo de atención al cliente.",
  },
  planning: {
    title: "Planificación semanal",
    status: "Propuesta lista",
    label:
      "Demostración: los trabajos de corte, montaje y revisión de una semana pasan de un calendario desordenado y con solapes a una propuesta ordenada de lunes a viernes.",
  },
  agent: {
    title: "Agente comercial",
    status: "Propuesta lista",
    label:
      "Demostración: un agente consulta la ficha del cliente en el CRM, revisa el catálogo y las tarifas vigentes, calcula el presupuesto y redacta un borrador de propuesta para revisar.",
  },
};

export function CaseVisual({ kind, className }: CaseVisualProps) {
  const frame = FRAME[kind];

  return (
    <div
      role="img"
      aria-label={frame.label}
      className={cx(
        s.frame,
        "@container relative flex aspect-[4/3] w-full flex-col overflow-hidden rounded-card border border-white/10 bg-graphite/80 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] md:aspect-[16/11]",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-2.5 @lg:px-5 @lg:py-3"
      >
        <span className="min-w-0 truncate font-sans text-small text-muted">{frame.title}</span>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-pill border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[12px] leading-none text-text/85">
          <span className={cx(s.live, "relative size-1.5 rounded-full bg-cyan")} />
          {frame.status}
        </span>
      </div>

      <div aria-hidden="true" className="relative min-h-0 flex-1 p-3 @md:p-5 @xl:p-7">
        {kind === "invoices" && <Invoices />}
        {kind === "support" && <Support />}
        {kind === "planning" && <Planning />}
        {kind === "agent" && <Agent />}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Facturas: cada fila avanza Recibida → Datos extraídos → Validada con pedido
 * → Lista para aprobar. Las filas van desfasadas 0,9 s (bucle de 8 s).
 * ------------------------------------------------------------------------- */

const INVOICES = [
  { supplier: "Suministros del Norte", ref: "FAC-0412", amount: "1.240,50 €" },
  { supplier: "Papelería Central", ref: "FAC-0413", amount: "386,20 €" },
  { supplier: "Transportes Ribera", ref: "FAC-0414", amount: "2.915,00 €" },
];

const STAGES = [
  { label: "Recibida", anim: s.s0, tone: "border-white/10 bg-white/[0.03] text-muted", dot: "bg-white/40" },
  { label: "Datos extraídos", anim: s.s1, tone: "border-blue/25 bg-blue/[0.08] text-text/85", dot: "bg-blue" },
  { label: "Validada con pedido", anim: s.s2, tone: "border-violet/25 bg-violet/[0.08] text-text/85", dot: "bg-violet" },
  { label: "Lista para aprobar", anim: s.s3, tone: "border-ok/30 bg-ok/[0.08] text-text", dot: "" },
];

const rowDelay = (i: number): Vars => ({ "--d": `${i * 0.9}s` });

function Invoices() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[36rem] flex-col justify-center gap-2 @md:gap-2.5">
      <div className="hidden items-center justify-between px-4 text-[12px] text-muted @md:flex">
        <span>Proveedor e importe</span>
        <span>Estado</span>
      </div>
      <ul className="flex flex-col gap-2 @md:gap-2.5">
        {INVOICES.map((invoice, i) => (
          <li
            key={invoice.ref}
            style={rowDelay(i)}
            className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 overflow-hidden rounded-field border border-white/[0.06] bg-white/[0.025] px-3 py-2 @md:px-4 @md:py-3 @xl:py-4"
          >
            <div className="min-w-0">
              <p className="text-[13px] leading-tight text-text @xl:text-[14px]">{invoice.supplier}</p>
              <p className="mt-1 text-[12px] leading-none text-muted tabular-nums">
                <span className="hidden font-mono @md:inline">{invoice.ref} · </span>
                {invoice.amount}
              </p>
            </div>

            {/* Estados apilados en la misma celda: solo uno visible a la vez */}
            <div className="grid justify-items-end">
              {STAGES.map((stage, k) => (
                <span
                  key={stage.label}
                  className={cx(
                    stage.anim,
                    "col-start-1 row-start-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border px-2 py-0.5 text-[12px] leading-[1.4]",
                    stage.tone,
                  )}
                >
                  {k === STAGES.length - 1 ? (
                    <Check aria-hidden="true" className="size-3 text-ok" strokeWidth={3} />
                  ) : (
                    <span className={cx("size-1.5 rounded-full", stage.dot)} />
                  )}
                  {stage.label}
                </span>
              ))}
            </div>

            <span className="absolute inset-x-0 bottom-0 h-px bg-white/[0.04]">
              <span
                className={cx(
                  s.progress,
                  "block h-full origin-left bg-[linear-gradient(90deg,var(--color-blue),var(--color-violet),var(--color-cyan))] shadow-[0_0_8px_rgb(34_227_255/0.45)]",
                )}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Atención al cliente: chat con indicador de escritura y traspaso a una
 * persona (bucle de 9 s). Los mensajes se abren de abajo arriba como en un
 * chat real; si no caben, los primeros quedan ocultos tras el degradado.
 * ------------------------------------------------------------------------- */

function Support() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[34rem] flex-col">
      <div className={cx(s.chat, "flex min-h-0 flex-1 flex-col justify-end")}>
        <ChatRow anim={s.m1}>
          <CustomerBubble>¿Dónde está mi pedido 4821?</CustomerBubble>
        </ChatRow>
        <ChatRow anim={s.m2}>
          <AssistantBubble typing={s.t2} reveal={s.b2}>
            Está en reparto y llegará mañana antes de las 14:00.
          </AssistantBubble>
        </ChatRow>
        <ChatRow anim={s.m3}>
          <CustomerBubble>Me llegó un producto dañado y quiero devolverlo.</CustomerBubble>
        </ChatRow>
        <ChatRow anim={s.m4}>
          <AssistantBubble typing={s.t4} reveal={s.b4}>
            Lo siento. Te paso con una persona del equipo para gestionarlo.
          </AssistantBubble>
        </ChatRow>
        <ChatRow anim={s.m5}>
          <p className="mx-auto flex w-fit max-w-full items-center gap-2 rounded-field border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] leading-snug text-muted">
            <UserRound aria-hidden="true" className="size-3.5 shrink-0 text-cyan" />
            <span>
              Conversación transferida a <span className="text-text">Laura</span> · Atención al cliente
            </span>
          </p>
        </ChatRow>
      </div>

      <div className="mt-3 hidden shrink-0 items-center justify-between rounded-pill border border-white/[0.08] bg-white/[0.03] py-1.5 pl-4 pr-1.5 text-[12px] text-muted @md:flex">
        <span>Escribe tu mensaje</span>
        <span className="grid size-6 place-items-center rounded-full bg-white/[0.06] text-text/70">
          <ArrowUp aria-hidden="true" className="size-3.5" />
        </span>
      </div>
    </div>
  );
}

/**
 * Fila que se despliega (0fr → 1fr) y empuja hacia arriba a las anteriores.
 * No encoge: si el chat no cabe, desborda por arriba, bajo el degradado.
 */
function ChatRow({ anim, children }: { anim: string; children: ReactNode }) {
  return (
    <div className={cx(s.chatRow, anim, "shrink-0")}>
      <div className="min-h-0 overflow-hidden">
        <div className="pt-2.5">{children}</div>
      </div>
    </div>
  );
}

function CustomerBubble({ children }: { children: ReactNode }) {
  return (
    <p className="ml-auto w-fit max-w-[80%] rounded-[14px] rounded-br-[4px] bg-white/[0.09] px-3 py-2 text-[13px] leading-snug text-text">
      {children}
    </p>
  );
}

function AssistantBubble({ typing, reveal, children }: { typing: string; reveal: string; children: ReactNode }) {
  return (
    <div className="flex items-end gap-2">
      <span className="grid size-6 shrink-0 place-items-center rounded-full border border-cyan/30 bg-cyan/[0.08]">
        <span className="size-1.5 rounded-full bg-cyan shadow-[0_0_8px_var(--color-cyan)]" />
      </span>
      <div className="grid max-w-[82%]">
        <p
          className={cx(
            reveal,
            "col-start-1 row-start-1 origin-bottom-left rounded-[14px] rounded-bl-[4px] border border-white/[0.06] bg-anthracite/90 px-3 py-2 text-[13px] leading-snug text-text/90",
          )}
        >
          {children}
        </p>
        <span
          className={cx(
            s.typing,
            typing,
            "col-start-1 row-start-1 inline-flex w-fit items-center gap-1 self-end rounded-[14px] rounded-bl-[4px] border border-white/[0.06] bg-anthracite/90 px-3 py-[0.7rem]",
          )}
        >
          <span className={cx(s.typingDot, "size-1.5 rounded-full bg-text/70")} />
          <span className={cx(s.typingDot, "size-1.5 rounded-full bg-text/70")} style={{ animationDelay: "0.15s" }} />
          <span className={cx(s.typingDot, "size-1.5 rounded-full bg-text/70")} style={{ animationDelay: "0.3s" }} />
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Planificación: los trabajos pasan de un calendario desordenado ("Antes") a
 * una propuesta ordenada ("Propuesta"). Bucle de 8 s.
 * ------------------------------------------------------------------------- */

const DAYS = ["L", "M", "X", "J", "V"];
const LANES = ["Corte", "Montaje", "Revisión"];

/** Base casi opaca + tinte en degradado: el bloque tapa las celdas del calendario */
const JOB_TONE = {
  blue: "border-blue/25 border-l-blue bg-graphite/95 bg-linear-to-r from-blue/[0.2] to-blue/[0.08]",
  violet: "border-violet/25 border-l-violet bg-graphite/95 bg-linear-to-r from-violet/[0.2] to-violet/[0.08]",
  cyan: "border-cyan/25 border-l-cyan bg-graphite/95 bg-linear-to-r from-cyan/[0.17] to-cyan/[0.06]",
} as const;

type Job = {
  code: string;
  lane: number;
  day: number;
  span: number;
  tone: keyof typeof JOB_TONE;
  /** Desplazamiento y giro en el estado desordenado (en % del propio bloque) */
  scatter: [x: string, y: string, rotate: string];
  conflict?: boolean;
};

const JOBS: Job[] = [
  { code: "A-12", lane: 0, day: 0, span: 2, tone: "blue", scatter: ["30%", "60%", "-3deg"], conflict: true },
  { code: "B-07", lane: 0, day: 2, span: 1, tone: "violet", scatter: ["-150%", "25%", "2deg"], conflict: true },
  { code: "C-31", lane: 0, day: 3, span: 2, tone: "cyan", scatter: ["-70%", "110%", "-2deg"] },
  { code: "D-05", lane: 1, day: 0, span: 2, tone: "cyan", scatter: ["15%", "-40%", "2.5deg"], conflict: true },
  { code: "A-12", lane: 1, day: 2, span: 2, tone: "blue", scatter: ["-55%", "65%", "-2deg"] },
  { code: "B-07", lane: 1, day: 4, span: 1, tone: "violet", scatter: ["-250%", "-30%", "3deg"], conflict: true },
  { code: "E-20", lane: 2, day: 0, span: 1, tone: "violet", scatter: ["140%", "-70%", "-3deg"] },
  { code: "D-05", lane: 2, day: 2, span: 1, tone: "cyan", scatter: ["-120%", "-35%", "2deg"], conflict: true },
  { code: "A-12", lane: 2, day: 4, span: 1, tone: "blue", scatter: ["-200%", "-95%", "-2.5deg"] },
];

const jobStyle = (job: Job, i: number): Vars => ({
  gridColumn: `${job.day + 1} / span ${job.span}`,
  gridRow: `${job.lane + 1}`,
  "--sx": job.scatter[0],
  "--sy": job.scatter[1],
  "--sr": job.scatter[2],
  "--d": `${i * 0.06}s`,
});

function Planning() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[40rem] flex-col justify-center gap-3">
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="grid text-[12px] leading-none">
          <span
            className={cx(
              s.before,
              "col-start-1 row-start-1 inline-flex w-fit items-center gap-1.5 rounded-pill border border-danger/30 bg-danger/[0.08] px-2.5 py-1 text-text/85",
            )}
          >
            <span className="size-1.5 rounded-full bg-danger" />
            Antes
          </span>
          <span
            className={cx(
              s.after,
              "col-start-1 row-start-1 inline-flex w-fit items-center gap-1.5 rounded-pill border border-ok/30 bg-ok/[0.08] px-2.5 py-1 text-text/85",
            )}
          >
            <span className="size-1.5 rounded-full bg-ok" />
            Propuesta
          </span>
        </div>
        <span className="text-[12px] text-muted">Semana 14</span>
      </div>

      <div className="grid max-h-[17rem] min-h-0 flex-1 grid-cols-[3.75rem_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] gap-x-2 gap-y-1.5 @md:grid-cols-[4.5rem_minmax(0,1fr)]">
        <span />
        <div className="grid grid-cols-5 gap-1 text-center text-[12px] text-muted">
          {DAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="grid grid-rows-3 gap-1 text-[12px] text-muted">
          {LANES.map((lane) => (
            <span key={lane} className="flex items-center">
              {lane}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-5 grid-rows-3 gap-1">
          {Array.from({ length: 15 }, (_, i) => (
            <span
              key={i}
              className="rounded-md bg-white/[0.025]"
              style={{ gridColumn: (i % 5) + 1, gridRow: Math.floor(i / 5) + 1 }}
            />
          ))}
          {JOBS.map((job, i) => (
            <div
              key={`${job.code}-${job.lane}`}
              style={jobStyle(job, i)}
              className={cx(
                s.job,
                "relative flex min-w-0 items-center rounded-md border border-l-2 px-1.5 text-[12px] text-text/90",
                JOB_TONE[job.tone],
              )}
            >
              <span className="truncate">{job.code}</span>
              {job.conflict && (
                <span className={cx(s.conflict, "pointer-events-none absolute -inset-px rounded-md border border-danger/70")} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Agente: traza de cuatro pasos (girando → hecho) y, al final, el borrador de
 * la propuesta. Bucle de 9 s.
 * ------------------------------------------------------------------------- */

const STEPS: { icon: LucideIcon; label: string; row: string; run: string; done: string }[] = [
  { icon: Database, label: "Consultar ficha del cliente en el CRM", row: s.step0, run: s.run0, done: s.done0 },
  { icon: BookOpen, label: "Revisar catálogo y tarifas vigentes", row: s.step1, run: s.run1, done: s.done1 },
  { icon: Calculator, label: "Calcular presupuesto", row: s.step2, run: s.run2, done: s.done2 },
  { icon: FileText, label: "Redactar borrador de propuesta", row: s.step3, run: s.run3, done: s.done3 },
];

function Agent() {
  return (
    <div
      className={cx(
        s.agent,
        "mx-auto grid h-full w-full max-w-[44rem] content-center gap-2.5 @lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] @lg:items-center @lg:gap-6",
      )}
    >
      <ol className="relative grid auto-rows-fr">
        {/* Raíl que se llena a medida que avanzan los pasos */}
        <span className="absolute bottom-[12.5%] left-2 top-[12.5%] w-px bg-white/10 @lg:left-3.5">
          <span
            className={cx(
              s.rail,
              "block h-full w-full origin-top bg-[linear-gradient(180deg,var(--color-blue),var(--color-violet),var(--color-cyan))]",
            )}
          />
        </span>

        {STEPS.map(({ icon: Icon, label, row, run, done }) => (
          <li key={label} className={cx(row, "relative flex items-center gap-2.5 py-1 @lg:gap-3 @lg:py-1.5")}>
            <span className="relative grid size-4 shrink-0 place-items-center bg-graphite @lg:size-7 @lg:rounded-lg @lg:border @lg:border-white/10 @lg:bg-anthracite">
              <Icon aria-hidden="true" className="size-4 text-text/80 @lg:size-3.5" />
            </span>
            <span className="min-w-0 flex-1 text-[13px] leading-snug text-text/90">{label}</span>
            <span className="grid size-4 shrink-0 place-items-center">
              <span className="col-start-1 row-start-1 size-3.5 rounded-full border border-white/15" />
              <span className={cx(s.run, run, "col-start-1 row-start-1 grid place-items-center")}>
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-cyan" />
              </span>
              <span
                className={cx(done, "col-start-1 row-start-1 grid size-4 place-items-center rounded-full bg-ok/15 text-ok")}
              >
                <Check aria-hidden="true" className="size-3" strokeWidth={3} />
              </span>
            </span>
          </li>
        ))}
      </ol>

      <div
        className={cx(
          s.doc,
          "flex items-start gap-3 rounded-field border border-white/10 bg-anthracite/70 p-2.5 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.8)] @lg:flex-col @lg:p-4",
        )}
      >
        <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-cyan/30 bg-cyan/[0.08]">
          <FileText aria-hidden="true" className="size-3.5 text-cyan" />
        </span>
        <div className="min-w-0 flex-1 @lg:w-full">
          <p className="text-[13px] leading-snug text-text">
            Propuesta <span className="text-muted">· Borrador para revisar</span>
          </p>
          <div className="mt-2 space-y-1.5 @lg:mt-3 @lg:space-y-2">
            <span className={cx(s.line1, "block h-1 w-[92%] origin-left rounded-full bg-white/[0.12] @lg:h-1.5")} />
            <span className={cx(s.line2, "block h-1 w-[76%] origin-left rounded-full bg-white/[0.12] @lg:h-1.5")} />
            <span className={cx(s.line3, "block h-1 w-[54%] origin-left rounded-full bg-white/[0.12] @lg:h-1.5")} />
          </div>
        </div>
      </div>
    </div>
  );
}
