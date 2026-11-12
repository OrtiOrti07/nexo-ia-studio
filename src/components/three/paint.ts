/*
 * Utilidades de dibujo en canvas para las pantallas de las escenas 3D.
 * Las tipografías son las de la web (cargadas por next/font) más Georgia.
 */

export const FONTS = {
  display: '"Bricolage Grotesque", system-ui, sans-serif',
  sans: '"Instrument Sans", system-ui, sans-serif',
  mono: '"Geist Mono", ui-monospace, monospace',
  serif: 'Georgia, "Times New Roman", serif',
} as const;

type Family = keyof typeof FONTS;

export type TextOpts = {
  size: number;
  weight?: number;
  family?: Family;
  color?: string;
  align?: CanvasTextAlign;
  italic?: boolean;
  stretch?: "normal" | "condensed" | "semi-condensed" | "extra-condensed";
  spacing?: number;
  maxW?: number;
  lh?: number;
  upper?: boolean;
};

/** Espera a que estén listas las tipografías que usan las pantallas. */
export async function loadFonts() {
  if (typeof document === "undefined" || !document.fonts) return;
  await Promise.all(
    [
      `700 80px ${FONTS.display}`,
      `800 80px ${FONTS.display}`,
      `300 80px ${FONTS.display}`,
      `400 24px ${FONTS.sans}`,
      `600 24px ${FONTS.sans}`,
      `700 24px ${FONTS.sans}`,
      `400 20px ${FONTS.mono}`,
    ].map((f) => document.fonts.load(f).catch(() => [])),
  );
}

export class Painter {
  readonly c: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  constructor(
    readonly w: number,
    readonly h: number,
  ) {
    this.c = document.createElement("canvas");
    this.c.width = w;
    this.c.height = h;
    this.ctx = this.c.getContext("2d")!;
    this.ctx.textBaseline = "alphabetic";
  }

  rect(x: number, y: number, w: number, h: number, fill: string | CanvasGradient) {
    this.ctx.fillStyle = fill;
    this.ctx.fillRect(x, y, w, h);
    return this;
  }

  rr(x: number, y: number, w: number, h: number, r: number, fill?: string | CanvasGradient, stroke?: string, lw = 2) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lw;
      ctx.stroke();
    }
    return this;
  }

  bar(x: number, y: number, w: number, h: number, fill: string) {
    return this.rr(x, y, w, h, h / 2, fill);
  }

  circle(cx: number, cy: number, r: number, fill: string | CanvasGradient) {
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this.ctx.fillStyle = fill;
    this.ctx.fill();
    return this;
  }

  line(x1: number, y1: number, x2: number, y2: number, color: string, lw = 2) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.stroke();
    return this;
  }

  linear(x0: number, y0: number, x1: number, y1: number, stops: [number, string][]) {
    const g = this.ctx.createLinearGradient(x0, y0, x1, y1);
    stops.forEach(([o, c]) => g.addColorStop(o, c));
    return g;
  }

  radial(x: number, y: number, r: number, stops: [number, string][]) {
    const g = this.ctx.createRadialGradient(x, y, 0, x, y, r);
    stops.forEach(([o, c]) => g.addColorStop(o, c));
    return g;
  }

  shadow(blur: number, color: string, oy = 0) {
    this.ctx.shadowBlur = blur;
    this.ctx.shadowColor = color;
    this.ctx.shadowOffsetY = oy;
    return this;
  }

  noShadow() {
    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = "transparent";
    this.ctx.shadowOffsetY = 0;
    return this;
  }

  clip(x: number, y: number, w: number, h: number, r: number, draw: () => void) {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.clip();
    draw();
    ctx.restore();
    return this;
  }

  private font(o: TextOpts) {
    const ctx = this.ctx;
    ctx.font = `${o.italic ? "italic " : ""}${o.weight ?? 400} ${o.size}px ${FONTS[o.family ?? "sans"]}`;
    ctx.fillStyle = o.color ?? "#0b1020";
    ctx.textAlign = o.align ?? "left";
    if ("fontStretch" in ctx) (ctx as CanvasRenderingContext2D & { fontStretch: string }).fontStretch = o.stretch ?? "normal";
    if ("letterSpacing" in ctx)
      (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${o.spacing ?? 0}px`;
  }

  /** Parte el texto en líneas que caben en `maxW`. */
  wrap(str: string, o: TextOpts) {
    this.font(o);
    const value = o.upper ? str.toUpperCase() : str;
    if (!o.maxW) return [value];
    const lines: string[] = [];
    let line = "";
    for (const word of value.split(" ")) {
      const test = line ? `${line} ${word}` : word;
      if (this.ctx.measureText(test).width > o.maxW && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  /** Texto con salto de línea automático si se da `maxW`. Devuelve la y de la última línea. */
  text(str: string, x: number, y: number, o: TextOpts) {
    const lines = this.wrap(str, o);
    const lh = o.lh ?? o.size * 1.2;
    lines.forEach((line, i) => this.ctx.fillText(line, x, y + i * lh));
    return y + (lines.length - 1) * lh;
  }

  measure(str: string, o: TextOpts) {
    this.font(o);
    return this.ctx.measureText(o.upper ? str.toUpperCase() : str).width;
  }

  /** Píldora con texto centrado; devuelve su ancho. */
  pill(
    label: string,
    x: number,
    y: number,
    o: { h: number; size: number; bg?: string; color: string; border?: string; px?: number; weight?: number; family?: Family; r?: number },
  ) {
    const tw = this.measure(label, { size: o.size, weight: o.weight ?? 600, family: o.family });
    const w = tw + (o.px ?? o.h * 0.8) * 2;
    this.rr(x, y, w, o.h, o.r ?? o.h / 2, o.bg, o.border, 2);
    this.text(label, x + w / 2, y + o.h / 2 + o.size * 0.36, {
      size: o.size,
      weight: o.weight ?? 600,
      family: o.family,
      color: o.color,
      align: "center",
    });
    return w;
  }

  /** Barra de navegador; devuelve la altura que ocupa. */
  chrome(url: string, opts: { dark?: boolean; h?: number } = {}) {
    const h = opts.h ?? Math.round(this.w * 0.036);
    const dark = opts.dark ?? false;
    this.rect(0, 0, this.w, h, dark ? "#1d2130" : "#e9ecf1");
    this.line(0, h - 1, this.w, h - 1, dark ? "rgba(255,255,255,.08)" : "rgba(11,16,32,.08)", 2);
    const d = h * 0.24;
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => this.circle(h * 0.6 + i * d * 2.6, h / 2, d, c));
    const uw = this.w * 0.36;
    const ux = (this.w - uw) / 2;
    this.rr(ux, h * 0.2, uw, h * 0.6, h * 0.3, dark ? "rgba(255,255,255,.08)" : "#ffffff");
    this.text(url, this.w / 2, h * 0.5 + h * 0.13, {
      size: h * 0.34,
      family: "mono",
      color: dark ? "rgba(255,255,255,.65)" : "rgba(11,16,32,.6)",
      align: "center",
    });
    return h;
  }

  /** Barra de estado de un móvil; devuelve la altura que ocupa. */
  statusBar(color: string) {
    const h = this.w * 0.12;
    this.text("9:41", this.w * 0.12, h * 0.62, { size: this.w * 0.042, weight: 600, color });
    this.rr(this.w * 0.78, h * 0.42, this.w * 0.07, h * 0.24, 4, undefined, color, 2);
    this.rect(this.w * 0.79, h * 0.45, this.w * 0.045, h * 0.18, color);
    this.rr(this.w * 0.36, h * 0.3, this.w * 0.28, h * 0.4, h * 0.2, "#000");
    return h;
  }
}

/** Imagen abstracta con aspecto fotográfico: paisaje al atardecer. */
export function photoLandscape(p: Painter, x: number, y: number, w: number, h: number, r: number, tone: "warm" | "cool" = "warm") {
  p.clip(x, y, w, h, r, () => {
    const sky =
      tone === "warm"
        ? p.linear(0, y, 0, y + h, [
            [0, "#f3e3c3"],
            [0.55, "#e9c48e"],
            [1, "#d79f63"],
          ])
        : p.linear(0, y, 0, y + h, [
            [0, "#dfe7f2"],
            [0.6, "#c4d2e6"],
            [1, "#9fb3d1"],
          ]);
    p.rect(x, y, w, h, sky);
    p.circle(x + w * 0.66, y + h * 0.36, h * 0.13, p.radial(x + w * 0.66, y + h * 0.36, h * 0.2, [
      [0, tone === "warm" ? "#fff2cf" : "#ffffff"],
      [0.55, tone === "warm" ? "#f7c66f" : "#e9eef8"],
      [1, "rgba(255,255,255,0)"],
    ]));
    const hill = (cx: number, cy: number, rx: number, ry: number, c: string) => {
      p.ctx.beginPath();
      p.ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      p.ctx.fillStyle = c;
      p.ctx.fill();
    };
    hill(x + w * 0.2, y + h * 1.02, w * 0.7, h * 0.42, tone === "warm" ? "#9fb59a" : "#8fa3bf");
    hill(x + w * 0.85, y + h * 1.08, w * 0.62, h * 0.46, tone === "warm" ? "#5f7d68" : "#5d7398");
    hill(x + w * 0.35, y + h * 1.2, w * 0.8, h * 0.42, tone === "warm" ? "#1d3f36" : "#24365a");
    p.rect(x, y, w, h, p.linear(0, y, 0, y + h, [
      [0, "rgba(255,255,255,0.12)"],
      [1, "rgba(0,0,0,0.12)"],
    ]));
  });
}
