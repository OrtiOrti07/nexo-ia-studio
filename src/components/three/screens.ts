import { Painter, photoLandscape } from "./paint";

/*
 * Contenido de las pantallas de las escenas 3D, dibujado en canvas.
 * Las marcas son ficticias («Tu empresa», «Lumbre», «Cierzo», «Faro»).
 */

// «Tu empresa»: verde profundo, marfil y un dorado discreto
const TU = { bg: "#f7f5f0", ink: "#12332d", muted: "#5d6b66", gold: "#b8924a", soft: "#ece6da", line: "rgba(18,51,45,.12)" };

function tuLogo(p: Painter, x: number, y: number, s: number, color = TU.ink) {
  p.rr(x, y, s, s, s * 0.26, color);
  p.rr(x + s * 0.5, y + s * 0.5, s * 0.5, s * 0.5, s * 0.2, TU.gold);
  p.text("Tu empresa", x + s * 1.35, y + s * 0.78, { size: s * 0.82, weight: 700, family: "serif", color });
}

function arrowRight(p: Painter, x: number, y: number, s: number, color: string) {
  p.line(x, y, x + s, y, color, s * 0.14);
  p.line(x + s * 0.6, y - s * 0.38, x + s, y, color, s * 0.14);
  p.line(x + s * 0.6, y + s * 0.38, x + s, y, color, s * 0.14);
}

// ---------- Tu empresa ----------

export function tuHome(w = 1600, h = 1000, chrome = true) {
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, TU.bg);
  const top = chrome ? p.chrome("tuempresa.es") : 0;
  const ny = top + 64;
  tuLogo(p, 90, ny - 26, 36);
  ["Servicios", "Proyectos", "Empresa", "Contacto"].forEach((l, i) =>
    p.text(l, 640 + i * 150, ny + 2, { size: 21, weight: 500, color: TU.muted }),
  );
  const bw = p.measure("Pide presupuesto", { size: 19, weight: 600 }) + 52;
  p.pill("Pide presupuesto", w - 90 - bw, ny - 28, { h: 52, size: 19, bg: TU.ink, color: "#fff" });

  p.text("Calidad, cercanía y buen oficio", 90, top + 205, { size: 17, weight: 600, color: TU.gold, spacing: 2.6, upper: true });
  const ly = p.text("Lo que hacéis, contado como se merece.", 90, top + 300, {
    size: 86,
    weight: 700,
    family: "serif",
    color: TU.ink,
    maxW: 690,
    lh: 92,
    spacing: -1.5,
  });
  const py = p.text(
    "Una web clara, rápida y con vuestra personalidad, pensada para que os encuentren y os escriban.",
    90,
    ly + 68,
    { size: 24, color: TU.muted, maxW: 600, lh: 36 },
  );
  p.shadow(24, "rgba(18,51,45,.35)", 10);
  const b1 = p.pill("Pide presupuesto", 90, py + 48, { h: 64, size: 21, bg: TU.ink, color: "#fff" });
  p.noShadow();
  p.pill("Ver servicios", 90 + b1 + 16, py + 48, { h: 64, size: 21, border: "rgba(18,51,45,.3)", color: TU.ink });

  p.shadow(40, "rgba(18,51,45,.25)", 18);
  p.rr(860, top + 110, 650, 580, 30, "#fff");
  p.noShadow();
  photoLandscape(p, 860, top + 110, 650, 580, 30);
  // Tarjeta flotante sobre la imagen
  p.shadow(30, "rgba(18,51,45,.25)", 12);
  p.rr(900, top + 560, 330, 96, 20, "#fff");
  p.noShadow();
  p.circle(948, top + 608, 24, TU.soft);
  p.text("✓", 948, top + 617, { size: 24, weight: 700, color: TU.ink, align: "center" });
  p.text("Pide tu presupuesto", 988, top + 600, { size: 20, weight: 700, color: TU.ink });
  p.text("Sin compromiso", 988, top + 628, { size: 17, color: TU.muted });

  const cy = h - 200;
  const titles = ["Atención cercana", "Presupuesto claro", "Trabajo bien hecho"];
  const cw = (w - 180 - 48) / 3;
  titles.forEach((t, i) => {
    const x = 90 + i * (cw + 24);
    p.rr(x, cy, cw, 140, 22, "#fff", "rgba(18,51,45,.08)");
    p.circle(x + 52, cy + 70, 26, [TU.gold, "#9fb59a", TU.ink][i]);
    p.text(t, x + 98, cy + 62, { size: 23, weight: 700, color: TU.ink });
    p.bar(x + 98, cy + 82, cw * 0.5, 10, "rgba(18,51,45,.14)");
  });
  return p.c;
}

export function tuMobile(w = 600, h = 1300) {
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, TU.bg);
  const top = p.statusBar(TU.ink);
  tuLogo(p, 40, top + 30, 40);
  [0, 1].forEach((i) => p.bar(w - 90, top + 40 + i * 16, 48, 6, TU.ink));
  p.text("Calidad y buen oficio", 40, top + 175, { size: 18, weight: 600, color: TU.gold, spacing: 2.4, upper: true });
  const ly = p.text("Lo que hacéis, contado como se merece.", 40, top + 250, {
    size: 64,
    weight: 700,
    family: "serif",
    color: TU.ink,
    maxW: 520,
    lh: 70,
    spacing: -1,
  });
  const py = p.text("Una web clara y con vuestra personalidad, pensada para que os escriban.", 40, ly + 60, {
    size: 25,
    color: TU.muted,
    maxW: 510,
    lh: 37,
  });
  photoLandscape(p, 40, py + 50, w - 80, 360, 30);
  p.shadow(24, "rgba(18,51,45,.35)", 10);
  p.rr(40, h - 170, w - 80, 86, 43, TU.ink);
  p.noShadow();
  p.text("Pide presupuesto", w / 2, h - 116, { size: 27, weight: 600, color: "#fff", align: "center" });
  p.bar(w / 2 - 80, h - 30, 160, 8, "rgba(18,51,45,.35)");
  return p.c;
}

export function tuServices(w = 1200, h = 800, chrome = true) {
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, TU.bg);
  const top = chrome ? p.chrome("tuempresa.es/servicios") : 0;
  p.text("Servicios", 70, top + 110, { size: 62, weight: 700, family: "serif", color: TU.ink });
  p.text("Todo lo que necesitas, con un mismo equipo.", 70, top + 158, { size: 22, color: TU.muted });
  const cw = (w - 140 - 64) / 3;
  const names = ["Asesoramiento", "Proyecto a medida", "Mantenimiento"];
  names.forEach((n, i) => {
    const x = 70 + i * (cw + 32);
    const y = top + 210;
    p.rr(x, y, cw, 480, 24, "#fff", "rgba(18,51,45,.08)");
    p.clip(x, y, cw, 230, 24, () => {
      p.rect(x, y, cw, 230, p.linear(x, y, x + cw, y + 230, [
        [0, ["#e8dcc4", "#c9d6c4", "#e6e1d6"][i]],
        [1, ["#c79a55", "#5f7d68", "#12332d"][i]],
      ]));
      p.circle(x + cw * 0.72, y + 80, 34, "rgba(255,255,255,.35)");
    });
    p.text(n, x + 28, y + 288, { size: 27, weight: 700, family: "serif", color: TU.ink });
    p.bar(x + 28, y + 318, cw - 70, 10, "rgba(18,51,45,.14)");
    p.bar(x + 28, y + 340, cw - 120, 10, "rgba(18,51,45,.14)");
    p.text("Saber más", x + 28, y + 420, { size: 19, weight: 600, color: TU.gold });
    arrowRight(p, x + 130, y + 413, 18, TU.gold);
  });
  return p.c;
}

export function tuContact(w = 1200, h = 800, chrome = true) {
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, TU.bg);
  const top = chrome ? p.chrome("tuempresa.es/contacto") : 0;
  p.text("Contacto", 70, top + 120, { size: 62, weight: 700, family: "serif", color: TU.ink });
  p.text("Cuéntanos qué necesitas y te respondemos.", 70, top + 172, { size: 23, color: TU.muted, maxW: 440, lh: 34 });
  [
    ["Teléfono", "900 000 000"],
    ["Correo", "hola@tuempresa.es"],
    ["Horario", "Lunes a viernes"],
  ].forEach(([k, v], i) => {
    const y = top + 300 + i * 92;
    p.circle(96, y, 26, TU.soft);
    p.circle(96, y, 8, TU.gold);
    p.text(k, 140, y - 6, { size: 17, color: TU.muted });
    p.text(v, 140, y + 22, { size: 22, weight: 600, color: TU.ink });
  });
  const fx = 620;
  p.shadow(36, "rgba(18,51,45,.18)", 14);
  p.rr(fx, top + 60, 510, 640, 26, "#fff");
  p.noShadow();
  ["Nombre", "Correo", "Mensaje"].forEach((l, i) => {
    const y = top + 120 + i * 120;
    p.text(l, fx + 40, y, { size: 18, weight: 600, color: TU.ink });
    p.rr(fx + 40, y + 16, 430, i === 2 ? 150 : 60, 14, TU.bg, "rgba(18,51,45,.14)");
  });
  p.rr(fx + 40, top + 590, 430, 66, 33, TU.ink);
  p.text("Enviar mensaje", fx + 255, top + 632, { size: 22, weight: 600, color: "#fff", align: "center" });
  return p.c;
}

/** Web completa y larga (sin barra de navegador) para recorrerla dentro del portátil. */
export function tuHomeLong() {
  const w = 1600;
  const p = new Painter(w, 3134);
  p.ctx.drawImage(tuHome(1600, 1000, false), 0, 0);
  p.ctx.drawImage(tuServices(1200, 800, false), 0, 1000, 1600, 1067);
  p.ctx.drawImage(tuContact(1200, 800, false), 0, 2067, 1600, 1067);
  return p.c;
}

/** Landing larga para la ilustración de «Landing page». */
export function tuLanding(w = 800, h = 1800) {
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, TU.bg);
  const top = p.chrome("tuempresa.es/cocinas", { h: 44 });
  p.rect(0, top, w, 640, TU.ink);
  p.text("Reformas de cocina", 56, top + 96, { size: 17, weight: 600, color: TU.gold, spacing: 2.4, upper: true });
  const ly = p.text("Tu nueva cocina, sin complicaciones.", 56, top + 170, {
    size: 62,
    weight: 700,
    family: "serif",
    color: "#f7f5f0",
    maxW: 640,
    lh: 68,
  });
  p.text("Te acompañamos del diseño a la obra terminada.", 56, ly + 56, { size: 23, color: "rgba(247,245,240,.75)", maxW: 600 });
  p.pill("Pide presupuesto", 56, ly + 100, { h: 66, size: 22, bg: TU.gold, color: TU.ink });
  photoLandscape(p, 56, ly + 200, w - 112, 190, 22);
  let y = top + 720;
  p.text("Por qué con nosotros", 56, y, { size: 38, weight: 700, family: "serif", color: TU.ink });
  ["Un único responsable de obra", "Presupuesto cerrado por escrito", "Plazos que se cumplen"].forEach((t, i) => {
    const yy = y + 70 + i * 96;
    p.circle(84, yy, 28, [TU.gold, "#9fb59a", TU.ink][i]);
    p.text(t, 132, yy - 4, { size: 24, weight: 700, color: TU.ink });
    p.bar(132, yy + 16, 420, 10, "rgba(18,51,45,.14)");
  });
  y += 400;
  p.rr(56, y, w - 112, 200, 24, "#fff", "rgba(18,51,45,.08)");
  p.text("“", 90, y + 110, { size: 120, family: "serif", color: TU.gold });
  [0, 1, 2].forEach((i) => p.bar(170, y + 60 + i * 30, [480, 440, 300][i], 12, "rgba(18,51,45,.16)"));
  y += 280;
  p.text("Cómo funciona", 56, y, { size: 38, weight: 700, family: "serif", color: TU.ink });
  ["Visita", "Diseño", "Obra"].forEach((t, i) => {
    const x = 56 + i * 230;
    p.circle(x + 34, y + 80, 34, i === 0 ? TU.ink : TU.soft);
    p.text(String(i + 1), x + 34, y + 92, { size: 30, weight: 700, color: i === 0 ? "#fff" : TU.ink, align: "center" });
    p.text(t, x, y + 160, { size: 24, weight: 700, color: TU.ink });
  });
  y += 230;
  p.rr(56, y, w - 112, 230, 28, TU.gold);
  p.text("¿Hablamos?", 96, y + 96, { size: 46, weight: 700, family: "serif", color: TU.ink });
  p.pill("Pide presupuesto", 96, y + 130, { h: 62, size: 21, bg: TU.ink, color: "#fff" });
  return p.c;
}

// ---------- Rediseño: la web de antes ----------

export function oldSite(w = 1200, h = 800) {
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, p.linear(0, 0, 0, h, [
    [0, "#e3ecf7"],
    [1, "#b7c9e2"],
  ]));
  const top = p.chrome("miempresa.com/index.html");
  p.rect(0, top, w, 110, p.linear(0, top, 0, top + 110, [
    [0, "#3d63b0"],
    [1, "#1d3a7a"],
  ]));
  p.text("Bienvenidos a nuestra página web", w / 2, top + 72, {
    size: 46,
    weight: 700,
    italic: true,
    family: "serif",
    color: "#ffe14d",
    align: "center",
  });
  p.rect(0, top + 110, w, 44, "#eef2f8");
  p.text("Inicio | Empresa | Servicios | Productos | Contacto | Libro de visitas", w / 2, top + 140, {
    size: 20,
    family: "serif",
    color: "#1a3fbf",
    align: "center",
  });
  p.line(160, top + 145, w - 160, top + 145, "#1a3fbf", 1.5);
  // Barra lateral de botones con relieve
  ["Inicio", "Productos", "Ofertas", "Enlaces"].forEach((t, i) => {
    const y = top + 190 + i * 64;
    p.rect(40, y, 190, 48, "#d4d0c8");
    p.line(40, y, 230, y, "#fff", 3);
    p.line(40, y, 40, y + 48, "#fff", 3);
    p.line(40, y + 48, 230, y + 48, "#808080", 3);
    p.line(230, y, 230, y + 48, "#808080", 3);
    p.text(t, 135, y + 31, { size: 20, family: "serif", color: "#000", align: "center" });
  });
  p.rect(270, top + 190, w - 310, 500, "#fff");
  p.rect(300, top + 220, 300, 220, "#9fb2c9");
  p.ctx.strokeStyle = "#7d7d7d";
  p.ctx.lineWidth = 6;
  p.ctx.strokeRect(300, top + 220, 300, 220);
  p.text("¡NUEVO!", 630, top + 250, { size: 28, weight: 700, family: "serif", color: "#e00000" });
  p.text(
    "Somos una empresa con muchos años de experiencia en el sector. Ofrecemos los mejores servicios a nuestros clientes con la máxima calidad y profesionalidad.",
    630,
    top + 296,
    { size: 21, family: "serif", color: "#222", maxW: w - 680, lh: 30 },
  );
  p.text("Haga clic aquí para más información", 300, top + 500, { size: 21, family: "serif", color: "#1a3fbf" });
  p.line(300, top + 505, 640, top + 505, "#1a3fbf", 1.5);
  p.text("Página optimizada para 800x600", w / 2, h - 30, { size: 16, family: "serif", color: "#556", align: "center" });
  return p.c;
}

// ---------- Concepto 01 · Lumbre (restaurante) ----------

const LU = { bg: "#1b1310", cream: "#f1e6d4", ember: "#c8512b", muted: "rgba(241,230,212,.68)" };

function plate(p: Painter, cx: number, cy: number, r: number) {
  p.shadow(r * 0.5, "rgba(0,0,0,.6)", r * 0.12);
  p.circle(cx, cy, r, p.radial(cx - r * 0.2, cy - r * 0.25, r * 1.2, [
    [0, "#fbf3e6"],
    [0.7, "#e8dcc8"],
    [1, "#c9b89c"],
  ]));
  p.noShadow();
  p.circle(cx, cy, r * 0.72, p.radial(cx, cy, r * 0.72, [
    [0, "#f6ecdc"],
    [1, "#e2d4bd"],
  ]));
  // Salsa
  p.ctx.beginPath();
  p.ctx.arc(cx + r * 0.05, cy + r * 0.05, r * 0.46, Math.PI * 0.9, Math.PI * 1.9);
  p.ctx.strokeStyle = "rgba(122,40,18,.55)";
  p.ctx.lineWidth = r * 0.07;
  p.ctx.lineCap = "round";
  p.ctx.stroke();
  // Pieza principal a la brasa
  p.ctx.save();
  p.ctx.translate(cx, cy);
  p.ctx.rotate(-0.35);
  p.ctx.beginPath();
  p.ctx.ellipse(0, 0, r * 0.42, r * 0.24, 0, 0, Math.PI * 2);
  p.ctx.fillStyle = p.linear(-r * 0.4, -r * 0.2, r * 0.4, r * 0.2, [
    [0, "#5a1d0c"],
    [0.5, "#9a3a17"],
    [1, "#c8512b"],
  ]);
  p.ctx.fill();
  for (let i = -3; i <= 3; i++) {
    p.ctx.beginPath();
    p.ctx.moveTo(i * r * 0.11 - r * 0.05, -r * 0.2);
    p.ctx.lineTo(i * r * 0.11 + r * 0.05, r * 0.2);
    p.ctx.strokeStyle = "rgba(35,10,4,.55)";
    p.ctx.lineWidth = r * 0.025;
    p.ctx.stroke();
  }
  p.ctx.restore();
  [
    [0.32, 0.3, 0.07, "#6b8f4e"],
    [0.4, 0.18, 0.05, "#8fb06a"],
    [-0.36, 0.28, 0.06, "#7aa05a"],
    [-0.22, -0.34, 0.045, "#f3c26b"],
    [0.12, -0.38, 0.04, "#f3c26b"],
  ].forEach(([dx, dy, rr, c]) => p.circle(cx + r * (dx as number), cy + r * (dy as number), r * (rr as number), c as string));
}

export function lumbreDesk(w = 1600, h = 1000, chrome = true) {
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, LU.bg);
  p.rect(0, 0, w, h, p.radial(w * 0.75, h * 0.55, w * 0.55, [
    [0, "rgba(200,81,43,.32)"],
    [1, "rgba(200,81,43,0)"],
  ]));
  const top = chrome ? p.chrome("lumbre.example", { dark: true }) : 0;
  const ny = top + 66;
  p.text("Lumbre", 90, ny, { size: 30, family: "serif", color: LU.cream, spacing: 9, upper: true });
  ["Carta", "Vinos", "Dónde estamos"].forEach((l, i) => p.text(l, 700 + i * 150, ny, { size: 20, color: LU.muted }));
  const bw = p.measure("Reservar", { size: 19, weight: 600 }) + 52;
  p.pill("Reservar", w - 90 - bw, ny - 34, { h: 50, size: 19, bg: LU.ember, color: "#fff4e6" });
  p.text("Cocina de brasa", 90, top + 250, { size: 26, italic: true, family: "serif", color: "#e58a62" });
  const ly = p.text("Cocinamos despacio, a fuego lento.", 90, top + 345, {
    size: 98,
    italic: true,
    family: "serif",
    color: LU.cream,
    maxW: 700,
    lh: 100,
    spacing: -1.5,
  });
  const py = p.text("Producto de temporada, brasa de encina y una carta corta que cambia con el mercado.", 90, ly + 66, {
    size: 24,
    color: LU.muted,
    maxW: 560,
    lh: 36,
  });
  p.shadow(30, "rgba(200,81,43,.6)", 8);
  const b1 = p.pill("Reservar mesa", 90, py + 50, { h: 64, size: 21, bg: LU.ember, color: "#fff4e6" });
  p.noShadow();
  p.pill("Ver la carta", 90 + b1 + 16, py + 50, { h: 64, size: 21, border: "rgba(241,230,212,.35)", color: LU.cream });
  plate(p, 1160, top + 420, 270);
  p.line(90, h - 110, w - 90, h - 110, "rgba(241,230,212,.14)", 2);
  ["Carta de temporada", "Brasa de encina", "Reserva en un minuto"].forEach((t, i) =>
    p.text(t, 90 + i * 480, h - 60, { size: 22, italic: true, family: "serif", color: LU.muted }),
  );
  return p.c;
}

export function lumbreMobile(w = 600, h = 1300) {
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, LU.bg);
  p.rect(0, 0, w, h, p.radial(w * 0.5, h * 0.3, w, [
    [0, "rgba(200,81,43,.3)"],
    [1, "rgba(200,81,43,0)"],
  ]));
  const top = p.statusBar(LU.cream);
  p.text("Lumbre", w / 2, top + 70, { size: 30, family: "serif", color: LU.cream, spacing: 9, upper: true, align: "center" });
  plate(p, w / 2, top + 330, 200);
  const ly = p.text("Cocinamos despacio, a fuego lento.", 44, top + 640, {
    size: 66,
    italic: true,
    family: "serif",
    color: LU.cream,
    maxW: 520,
    lh: 70,
  });
  p.text("Brasa de encina y carta de temporada.", 44, ly + 56, { size: 25, color: LU.muted, maxW: 500 });
  p.shadow(30, "rgba(200,81,43,.6)", 8);
  p.rr(40, h - 170, w - 80, 86, 43, LU.ember);
  p.noShadow();
  p.text("Reservar mesa", w / 2, h - 116, { size: 27, weight: 600, color: "#fff4e6", align: "center" });
  p.bar(w / 2 - 80, h - 30, 160, 8, "rgba(241,230,212,.4)");
  return p.c;
}

// ---------- Concepto 02 · Cierzo (arquitectura) ----------

const CI = { bg: "#efeeea", ink: "#2f3437", oxide: "#9a5b3c", muted: "rgba(47,52,55,.6)" };

function building(p: Painter, x: number, y: number, w: number, h: number) {
  p.clip(x, y, w, h, 4, () => {
    p.rect(x, y, w, h, p.linear(0, y, 0, y + h, [
      [0, "#c9d3d8"],
      [0.65, "#e8e6e0"],
      [1, "#e8e6e0"],
    ]));
    p.rect(x, y + h * 0.78, w, h * 0.22, p.linear(0, y + h * 0.78, 0, y + h, [
      [0, "#c8c0ae"],
      [1, "#aea591"],
    ]));
    // Volumen inferior de hormigón oscuro
    p.rect(x + w * 0.2, y + h * 0.48, w * 0.46, h * 0.31, p.linear(x + w * 0.2, 0, x + w * 0.66, 0, [
      [0, "#3a4044"],
      [0.75, "#2f3437"],
      [1, "#24282b"],
    ]));
    // Vidrio con luz cálida
    p.rect(x + w * 0.26, y + h * 0.56, w * 0.26, h * 0.17, p.linear(0, y + h * 0.56, 0, y + h * 0.73, [
      [0, "#f0c48f"],
      [1, "#b9773f"],
    ]));
    p.line(x + w * 0.39, y + h * 0.56, x + w * 0.39, y + h * 0.73, "#2f3437", w * 0.004);
    // Volumen volado claro
    p.shadow(w * 0.03, "rgba(0,0,0,.35)", w * 0.012);
    p.rect(x + w * 0.34, y + h * 0.3, w * 0.5, h * 0.19, p.linear(x + w * 0.34, 0, x + w * 0.84, 0, [
      [0, "#e2ded4"],
      [0.8, "#d2cdc1"],
      [1, "#bdb7ab"],
    ]));
    p.noShadow();
    p.rect(x + w * 0.38, y + h * 0.355, w * 0.34, h * 0.07, CI.oxide);
    // Árbol
    p.ctx.beginPath();
    p.ctx.ellipse(x + w * 0.86, y + h * 0.66, w * 0.045, h * 0.13, 0, 0, Math.PI * 2);
    p.ctx.fillStyle = "#6f7a63";
    p.ctx.fill();
    p.rect(x + w * 0.857, y + h * 0.76, w * 0.006, h * 0.04, "#4a4438");
  });
}

export function cierzoDesk(w = 1600, h = 1000, chrome = true) {
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, CI.bg);
  const top = chrome ? p.chrome("cierzo.example") : 0;
  const ny = top + 62;
  p.text("Cierzo", 90, ny, { size: 30, weight: 300, family: "display", stretch: "condensed", spacing: 12, upper: true, color: CI.ink });
  ["Proyectos", "Estudio", "Contacto"].forEach((l, i) =>
    p.text(l, w - 520 + i * 160, ny, { size: 17, spacing: 2, upper: true, color: CI.ink }),
  );
  building(p, 90, top + 110, w - 180, 610);
  p.text("Casa en la ladera", 90, h - 92, {
    size: 74,
    weight: 300,
    family: "display",
    stretch: "condensed",
    upper: true,
    spacing: 1,
    color: CI.ink,
  });
  p.bar(760, h - 132, 380, 10, "rgba(47,52,55,.2)");
  p.bar(760, h - 108, 260, 10, "rgba(47,52,55,.2)");
  p.text("04 / 12", w - 90, h - 100, { size: 20, family: "mono", color: CI.oxide, align: "right" });
  return p.c;
}

export function cierzoMobile(w = 600, h = 1300) {
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, CI.bg);
  const top = p.statusBar(CI.ink);
  p.text("Cierzo", 40, top + 70, { size: 30, weight: 300, family: "display", stretch: "condensed", spacing: 10, upper: true, color: CI.ink });
  [0, 1].forEach((i) => p.bar(w - 90, top + 50 + i * 16, 48, 5, CI.ink));
  building(p, 40, top + 130, w - 80, 520);
  p.text("Casa en la ladera", 40, top + 760, {
    size: 64,
    weight: 300,
    family: "display",
    stretch: "condensed",
    upper: true,
    maxW: 520,
    lh: 66,
    color: CI.ink,
  });
  p.text("Vivienda unifamiliar", 40, top + 900, { size: 24, color: CI.muted });
  p.clip(40, top + 950, w - 80, 220, 4, () => {
    p.rect(40, top + 950, w - 80, 220, p.linear(40, top + 950, w - 40, top + 1170, [
      [0, "#d7d2c6"],
      [1, "#2f3437"],
    ]));
  });
  return p.c;
}

// ---------- Concepto 03 · Faro (instalaciones) ----------

const FA = { navy: "#0f172a", blue: "#1d4ed8", yellow: "#facc15", muted: "#475569", soft: "#eef3ff" };

function faroLogo(p: Painter, x: number, y: number, s: number) {
  p.rr(x, y, s, s, s * 0.24, FA.blue);
  p.ctx.beginPath();
  p.ctx.moveTo(x + s * 0.3, y + s * 0.5);
  p.ctx.lineTo(x + s * 0.95, y + s * 0.22);
  p.ctx.lineTo(x + s * 0.95, y + s * 0.78);
  p.ctx.closePath();
  p.ctx.fillStyle = FA.yellow;
  p.ctx.fill();
  p.text("Faro", x + s * 1.3, y + s * 0.8, { size: s * 0.85, weight: 800, family: "display", color: FA.navy });
}

export function faroDesk(w = 1600, h = 1000, chrome = true) {
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, "#ffffff");
  const top = chrome ? p.chrome("faro.example") : 0;
  p.rect(0, top, w, 46, FA.navy);
  p.text("Atención rápida, de lunes a sábado", 90, top + 30, { size: 17, color: "rgba(255,255,255,.75)" });
  p.text("Llámanos", w - 90, top + 30, { size: 17, weight: 700, color: FA.yellow, align: "right" });
  const ny = top + 120;
  faroLogo(p, 90, ny - 32, 44);
  ["Servicios", "Empresas", "Zonas", "Contacto"].forEach((l, i) => p.text(l, 640 + i * 150, ny, { size: 20, weight: 500, color: FA.muted }));
  const bw = p.measure("Pide presupuesto", { size: 19, weight: 700 }) + 48;
  p.pill("Pide presupuesto", w - 90 - bw, ny - 34, { h: 52, size: 19, bg: FA.yellow, color: FA.navy, r: 12, weight: 700 });
  const ly = p.text("Tu instalación, en buenas manos.", 90, top + 300, {
    size: 84,
    weight: 800,
    family: "display",
    color: FA.navy,
    maxW: 720,
    lh: 86,
    spacing: -2,
  });
  const py = p.text("Electricidad, climatización y fontanería para hogares y empresas. Presupuesto claro y sin sorpresas.", 90, ly + 64, {
    size: 24,
    color: FA.muted,
    maxW: 620,
    lh: 36,
  });
  const b1 = p.pill("Pide presupuesto", 90, py + 48, { h: 64, size: 21, bg: FA.blue, color: "#fff", r: 14, weight: 700 });
  p.pill("Llamar", 90 + b1 + 16, py + 48, { h: 64, size: 21, border: "rgba(15,23,42,.25)", color: FA.navy, r: 14, weight: 700 });
  // Formulario en dos pasos
  const fx = 960;
  const fy = top + 190;
  p.shadow(40, "rgba(29,78,216,.2)", 16);
  p.rr(fx, fy, 550, 470, 26, FA.soft);
  p.noShadow();
  p.text("Paso 1 de 2", fx + 44, fy + 64, { size: 18, family: "mono", color: FA.blue });
  p.bar(fx + 44, fy + 84, 462, 8, "rgba(29,78,216,.15)");
  p.bar(fx + 44, fy + 84, 231, 8, FA.blue);
  p.text("¿Qué necesitas?", fx + 44, fy + 150, { size: 34, weight: 800, family: "display", color: FA.navy });
  let cx = fx + 44;
  ["Electricidad", "Climatización", "Fontanería"].forEach((c, i) => {
    const cw = p.pill(c, cx, fy + 190, {
      h: 52,
      size: 18,
      bg: i === 0 ? FA.blue : "#fff",
      color: i === 0 ? "#fff" : FA.navy,
      border: i === 0 ? undefined : "rgba(15,23,42,.18)",
      weight: 600,
    });
    cx += cw + 10;
  });
  p.rr(fx + 44, fy + 270, 462, 60, 12, "#fff", "rgba(15,23,42,.14)");
  p.text("Código postal", fx + 64, fy + 308, { size: 19, color: "rgba(71,85,105,.7)" });
  p.rr(fx + 44, fy + 360, 462, 64, 14, FA.yellow);
  p.text("Siguiente", fx + 275, fy + 401, { size: 21, weight: 700, color: FA.navy, align: "center" });
  const cy = h - 170;
  const cw4 = (w - 180 - 72) / 4;
  ["Electricidad", "Climatización", "Fontanería", "Mantenimiento"].forEach((t, i) => {
    const x = 90 + i * (cw4 + 24);
    p.rr(x, cy, cw4, 110, 18, "#fff", "rgba(15,23,42,.1)");
    p.circle(x + 50, cy + 55, 24, i % 2 ? FA.yellow : FA.blue);
    p.text(t, x + 90, cy + 63, { size: 21, weight: 700, color: FA.navy });
  });
  return p.c;
}

export function faroMobile(w = 600, h = 1300) {
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, "#ffffff");
  const top = p.statusBar(FA.navy);
  faroLogo(p, 40, top + 30, 46);
  [0, 1].forEach((i) => p.bar(w - 90, top + 44 + i * 16, 48, 6, FA.navy));
  const ly = p.text("Tu instalación, en buenas manos.", 40, top + 220, {
    size: 70,
    weight: 800,
    family: "display",
    color: FA.navy,
    maxW: 520,
    lh: 72,
    spacing: -1.5,
  });
  p.text("Presupuesto claro y sin sorpresas.", 40, ly + 60, { size: 25, color: FA.muted });
  p.rr(40, ly + 110, w - 80, 400, 28, FA.soft);
  p.text("¿Qué necesitas?", 76, ly + 190, { size: 34, weight: 800, family: "display", color: FA.navy });
  ["Electricidad", "Climatización", "Fontanería"].forEach((c, i) =>
    p.pill(c, 76, ly + 230 + i * 80, {
      h: 62,
      size: 23,
      bg: i === 0 ? FA.blue : "#fff",
      color: i === 0 ? "#fff" : FA.navy,
      border: i === 0 ? undefined : "rgba(15,23,42,.18)",
    }),
  );
  p.rr(40, h - 170, w - 80, 86, 18, FA.yellow);
  p.text("Llamar ahora", w / 2, h - 116, { size: 27, weight: 700, color: FA.navy, align: "center" });
  p.bar(w / 2 - 80, h - 30, 160, 8, "rgba(15,23,42,.3)");
  return p.c;
}

// ---------- Proceso ----------

const J = { ink: "#0b1020", muted: "#535c6e", blue: "#2e5bff", soft: "#e5ebff", bg: "#f4f5f7" };

export function chatMobile(w = 600, h = 1300) {
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, J.bg);
  const top = p.statusBar(J.ink);
  p.rect(0, top, w, 120, "#fff");
  p.line(0, top + 120, w, top + 120, "rgba(11,16,32,.08)", 2);
  p.circle(84, top + 60, 34, J.blue);
  p.text("J", 84, top + 72, { size: 32, weight: 700, family: "display", color: "#fff", align: "center" });
  p.text("Juan · Diseño web", 136, top + 54, { size: 26, weight: 700, color: J.ink });
  p.text("en línea", 136, top + 86, { size: 20, color: "#12805c" });
  const msgs: [boolean, string][] = [
    [true, "Hola, soy Juan. Cuéntame: ¿qué queréis conseguir con la web?"],
    [false, "Que se entienda lo que hacemos y que nos pidan presupuesto."],
    [true, "Perfecto. ¿Tenéis ya logotipo y fotos?"],
    [false, "Logotipo sí, fotos pocas."],
    [true, "Sin problema, lo vemos en la llamada."],
  ];
  let y = top + 180;
  msgs.forEach(([me, m]) => {
    const maxW = 380;
    const lines = p.wrap(m, { size: 25, maxW });
    const bh = 34 * lines.length + 40;
    const bw = Math.max(...lines.map((l) => p.measure(l, { size: 25 }))) + 48;
    const x = me ? 36 : w - 36 - bw;
    p.rr(x, y, bw, bh, 28, me ? J.blue : "#fff", me ? undefined : "rgba(11,16,32,.06)");
    p.text(m, x + 24, y + 44, { size: 25, color: me ? "#fff" : J.ink, maxW, lh: 34 });
    y += bh + 22;
  });
  p.rr(30, h - 150, w - 60, 76, 38, "#fff", "rgba(11,16,32,.1)");
  p.text("Escribe un mensaje…", 66, h - 102, { size: 23, color: "rgba(83,92,110,.7)" });
  p.circle(w - 76, h - 112, 28, J.blue);
  arrowRight(p, w - 90, h - 112, 26, "#fff");
  return p.c;
}

export function proposalTablet(w = 1200, h = 1600) {
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, "#ffffff");
  p.rect(0, 0, 16, h, J.blue);
  p.text("Propuesta", 100, 140, { size: 24, family: "mono", color: J.blue, upper: true, spacing: 3 });
  p.text("Web corporativa para tu empresa", 100, 230, {
    size: 66,
    weight: 700,
    family: "display",
    color: J.ink,
    maxW: 900,
    lh: 72,
    spacing: -1.5,
  });
  p.line(100, 360, w - 100, 360, "rgba(11,16,32,.1)", 2);
  p.text("1. Alcance", 100, 440, { size: 32, weight: 700, family: "display", color: J.ink });
  ["Diseño a medida a partir de tu marca", "Inicio, servicios, empresa y contacto", "Adaptada a móvil, tableta y ordenador", "Formulario conectado a tu correo"].forEach(
    (t, i) => {
      const y = 510 + i * 66;
      p.circle(124, y - 9, 20, J.soft);
      p.line(114, y - 9, 121, y - 1, J.blue, 4);
      p.line(121, y - 1, 134, y - 17, J.blue, 4);
      p.text(t, 164, y, { size: 27, color: J.ink });
    },
  );
  p.text("2. Calendario", 100, 840, { size: 32, weight: 700, family: "display", color: J.ink });
  [
    ["Diseño", 0, 0.42],
    ["Desarrollo", 0.34, 0.8],
    ["Publicación", 0.78, 1],
  ].forEach(([t, a, b], i) => {
    const y = 900 + i * 76;
    p.text(t as string, 100, y + 28, { size: 24, color: J.muted });
    p.bar(330, y + 8, 770, 28, J.bg);
    p.bar(330 + 770 * (a as number), y + 8, 770 * ((b as number) - (a as number)), 28, i === 2 ? "#12805c" : J.blue);
  });
  p.text("3. Presupuesto", 100, 1210, { size: 32, weight: 700, family: "display", color: J.ink });
  p.rr(100, 1250, w - 200, 150, 24, J.bg);
  p.text("Presupuesto cerrado", 140, 1316, { size: 30, weight: 700, color: J.ink });
  p.text("Detallado por partidas, sin sorpresas.", 140, 1360, { size: 24, color: J.muted });
  p.rr(w - 420, 1460, 320, 76, 38, J.blue);
  p.text("Aceptar propuesta", w - 260, 1508, { size: 24, weight: 600, color: "#fff", align: "center" });
  return p.c;
}

export function designTool(w = 1600, h = 1000) {
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, "#1b1e27");
  p.rect(0, 0, w, 56, "#14161d");
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => p.circle(32 + i * 26, 28, 7, c));
  p.text("Tu empresa — Inicio", w / 2, 36, { size: 18, color: "rgba(255,255,255,.7)", align: "center" });
  // Capas
  p.rect(0, 56, 270, h - 56, "#171a22");
  p.text("Capas", 28, 106, { size: 18, weight: 600, color: "rgba(255,255,255,.85)" });
  ["Inicio", "Cabecera", "Titular", "Texto", "Botones", "Imagen", "Ventajas", "Pie"].forEach((l, i) => {
    const y = 150 + i * 46;
    if (l === "Titular") p.rr(14, y - 30, 242, 42, 8, "rgba(46,91,255,.35)");
    p.rr(32 + (i ? 18 : 0), y - 18, 16, 16, 3, undefined, "rgba(255,255,255,.5)", 2);
    p.text(l, 60 + (i ? 18 : 0), y - 3, { size: 17, color: l === "Titular" ? "#fff" : "rgba(255,255,255,.7)" });
  });
  // Propiedades
  p.rect(w - 300, 56, 300, h - 56, "#171a22");
  p.text("Texto", w - 272, 106, { size: 18, weight: 600, color: "rgba(255,255,255,.85)" });
  [
    ["Fuente", "Georgia"],
    ["Peso", "Bold"],
    ["Tamaño", "86"],
    ["Interlineado", "92"],
  ].forEach(([k, v], i) => {
    const y = 160 + i * 70;
    p.text(k, w - 272, y, { size: 15, color: "rgba(255,255,255,.5)" });
    p.rr(w - 272, y + 12, 244, 36, 8, "#232733");
    p.text(v, w - 258, y + 37, { size: 16, color: "#fff" });
  });
  // Lienzo con la página
  p.rect(270, 56, w - 570, h - 56, "#2a2e3a");
  const page = tuHome(1600, 1000);
  const pw = 940;
  const ph = (pw * 1000) / 1600;
  const px = 270 + (w - 570 - pw) / 2;
  const py = 56 + (h - 56 - ph) / 2;
  p.shadow(40, "rgba(0,0,0,.5)", 14);
  p.ctx.drawImage(page, 0, 58, 1600, 942, px, py, pw, ph);
  p.noShadow();
  // Selección del titular
  const s = pw / 1600;
  const sx = px + 76 * s;
  const sy = py + (300 - 120) * s;
  const sw = 720 * s;
  const sh = 300 * s;
  p.ctx.strokeStyle = J.blue;
  p.ctx.lineWidth = 2;
  p.ctx.strokeRect(sx, sy, sw, sh);
  [
    [sx, sy],
    [sx + sw, sy],
    [sx, sy + sh],
    [sx + sw, sy + sh],
  ].forEach(([x, y]) => p.rr(x - 6, y - 6, 12, 12, 2, "#fff", J.blue, 2));
  p.pill("Titular · 86 px", sx, sy - 44, { h: 32, size: 15, bg: J.blue, color: "#fff", r: 6, px: 10 });
  return p.c;
}

export function codeEditor(w = 1600, h = 1000) {
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, "#0f1320");
  p.rect(0, 0, w, 52, "#0b0e18");
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => p.circle(30 + i * 26, 26, 7, c));
  p.text("tu-empresa — Hero.tsx", w / 2, 33, { size: 17, color: "rgba(255,255,255,.6)", align: "center" });
  p.rect(0, 52, 260, h - 52, "#0c1019");
  p.text("ARCHIVOS", 26, 96, { size: 14, family: "mono", color: "rgba(255,255,255,.45)", spacing: 1.5 });
  ["app", "  page.tsx", "  layout.tsx", "components", "  Hero.tsx", "  Servicios.tsx", "  Contacto.tsx", "styles.css"].forEach(
    (f, i) => {
      const y = 140 + i * 38;
      if (f.trim() === "Hero.tsx") p.rect(0, y - 26, 260, 36, "rgba(46,91,255,.25)");
      p.text(f, 26, y, { size: 17, family: "mono", color: f.startsWith("  ") ? "rgba(255,255,255,.75)" : "rgba(255,255,255,.5)" });
    },
  );
  p.rect(260, 52, w - 260, 46, "#0c1019");
  p.rect(260, 52, 190, 46, "#0f1320");
  p.text("Hero.tsx", 288, 82, { size: 16, family: "mono", color: "#fff" });
  const C = { k: "#c792ea", t: "#82aaff", s: "#c3e88d", a: "#ffcb6b", p: "#e6e9f2", c: "rgba(255,255,255,.35)" };
  const code: [string, string][][] = [
    [["export function ", C.k], ["Hero", C.t], ["() {", C.p]],
    [["  return (", C.p]],
    [["    <", C.p], ["section ", C.t], ["className", C.a], ["=", C.p], ['"hero"', C.s], [">", C.p]],
    [["      <", C.p], ["h1", C.t], [">", C.p], ["Lo que hacéis, contado como se merece.", C.p], ["</", C.p], ["h1", C.t], [">", C.p]],
    [["      <", C.p], ["p", C.t], [">", C.p], ["Una web clara y rápida.", C.p], ["</", C.p], ["p", C.t], [">", C.p]],
    [["      <", C.p], ["a ", C.t], ["href", C.a], ["=", C.p], ['"#contacto"', C.s], [" className", C.a], ["=", C.p], ['"boton"', C.s], [">", C.p]],
    [["        Pide presupuesto", C.p]],
    [["      </", C.p], ["a", C.t], [">", C.p]],
    [["      <", C.p], ["Imagen ", C.t], ["prioridad ", C.a], ["/>", C.p]],
    [["    </", C.p], ["section", C.t], [">", C.p]],
    [["  );", C.p]],
    [["}", C.p]],
    [["", C.p]],
    [["// Adaptada a móvil, tableta y ordenador", C.c]],
  ];
  code.forEach((parts, i) => {
    const y = 160 + i * 44;
    p.text(String(i + 1), 320, y, { size: 19, family: "mono", color: "rgba(255,255,255,.25)", align: "right" });
    let x = 352;
    parts.forEach(([t, c]) => {
      p.text(t, x, y, { size: 21, family: "mono", color: c });
      x += p.measure(t, { size: 21, family: "mono" });
    });
  });
  p.rect(260, h - 200, w - 260, 200, "#0b0e18");
  p.line(260, h - 200, w, h - 200, "rgba(255,255,255,.08)", 2);
  p.text("TERMINAL", 290, h - 160, { size: 14, family: "mono", color: "rgba(255,255,255,.45)", spacing: 1.5 });
  p.text("✓ Compilado sin errores", 290, h - 112, { size: 19, family: "mono", color: "#7ee2a8" });
  p.text("✓ Probado en móvil, tableta y escritorio", 290, h - 76, { size: 19, family: "mono", color: "#7ee2a8" });
  p.text("→ Versión de prueba lista para revisar", 290, h - 40, { size: 19, family: "mono", color: "#82aaff" });
  return p.c;
}

// ---------- Piezas pequeñas ----------

export function keyboard(w = 1024, h = 512) {
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, "#1c2029");
  const rows = 6;
  const gap = 8;
  const kh = (h - gap * (rows + 1)) / rows;
  for (let r = 0; r < rows; r++) {
    const cols = r === 5 ? 9 : 14;
    const kw = (w - gap * (cols + 1)) / cols;
    for (let c = 0; c < cols; c++) {
      let x = gap + c * (kw + gap);
      let ww = kw;
      if (r === 5 && c === 4) ww = kw * 2.6;
      if (r === 5 && c > 4) x += kw * 1.6 + gap;
      if (x + ww > w - gap) continue;
      p.rr(x, gap + r * (kh + gap), ww, kh * (r === 0 ? 0.6 : 1), 8, "#0d1016");
    }
  }
  return p.c;
}

type ChipIcon = "check" | "lock" | "dot";

export function chipFace(label: string, icon: ChipIcon, h = 200) {
  const size = h * 0.36;
  const w = Math.ceil(h * 0.95 + new Painter(4, 4).measure(label, { size, weight: 600 }) + h * 0.45);
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, "#ffffff");
  const cx = h * 0.5;
  if (icon === "dot") {
    p.circle(cx, h / 2, h * 0.28, "rgba(34,197,94,.22)");
    p.circle(cx, h / 2, h * 0.16, "#22c55e");
  } else {
    p.circle(cx, h / 2, h * 0.28, J.blue);
    if (icon === "check") {
      p.ctx.lineCap = "round";
      p.line(cx - h * 0.11, h / 2, cx - h * 0.03, h / 2 + h * 0.08, "#fff", h * 0.055);
      p.line(cx - h * 0.03, h / 2 + h * 0.08, cx + h * 0.12, h / 2 - h * 0.08, "#fff", h * 0.055);
    } else {
      p.rr(cx - h * 0.1, h / 2 - h * 0.02, h * 0.2, h * 0.15, 6, "#fff");
      p.ctx.beginPath();
      p.ctx.arc(cx, h / 2 - h * 0.02, h * 0.065, Math.PI, 0);
      p.ctx.strokeStyle = "#fff";
      p.ctx.lineWidth = h * 0.035;
      p.ctx.stroke();
    }
  }
  p.text(label, h * 0.92, h / 2 + size * 0.36, { size, weight: 600, color: J.ink });
  return p.c;
}

export function tagFace(label: string, bg = J.blue, color = "#fff", h = 160) {
  const size = h * 0.46;
  const w = Math.ceil(new Painter(4, 4).measure(label, { size, weight: 700 }) + h * 0.9);
  const p = new Painter(w, h);
  p.rect(0, 0, w, h, bg);
  p.text(label, w / 2, h / 2 + size * 0.36, { size, weight: 700, color, align: "center" });
  return p.c;
}

export function buttonFace(label: string, w = 1000, h = 200) {
  const p = new Painter(w, h);
  p.text(label, w / 2, h / 2 + h * 0.15, { size: h * 0.42, weight: 700, color: "#fff", align: "center" });
  return p.c;
}
