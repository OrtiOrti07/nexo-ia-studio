import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist_Mono, Instrument_Sans } from "next/font/google";
import { absoluteUrl, href, site } from "@/config/site";
import { faqs, services } from "@/content/home";
import "./globals.css";

// Titulares: Bricolage Grotesque, con sus ejes de tamaño óptico y anchura
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

// Texto: Instrument Sans, neutra pero con carácter
const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Solo etiquetas cortas y detalles técnicos
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Solo el dominio: las rutas de imágenes ya incluyen la subcarpeta (basePath)
  metadataBase: new URL(new URL(site.url).origin),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.owner }],
  creator: site.owner,
  manifest: href("/manifest.webmanifest"),
  keywords: [
    "diseño web a medida",
    "desarrollo web para empresas",
    "diseñador web freelance",
    "web corporativa",
    "landing page",
    "rediseño de páginas web",
  ],
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: absoluteUrl("/"),
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: site.colors.paper,
  colorScheme: "light",
};

/**
 * Antes de pintar: marca <html> con .js (si hay movimiento) para que la portada
 * empiece oculta y GSAP la revele. Si en 4 s no ha arrancado, .anim-fail la
 * muestra igualmente: nunca se queda contenido escondido.
 */
const ANIMATION_BOOT = `(function(){var d=document.documentElement;if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('js');setTimeout(function(){if(!d.classList.contains('anim-ready'))d.classList.add('anim-fail')},4000)})();`;

function StructuredData() {
  const home = absoluteUrl("/");
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${home}#web`,
        url: home,
        name: site.name,
        description: site.description,
        inLanguage: "es-ES",
        publisher: { "@id": `${home}#juan` },
      },
      {
        "@type": "Person",
        "@id": `${home}#juan`,
        name: site.owner,
        jobTitle: "Diseñador y desarrollador web",
        url: home,
        email: site.email,
        telephone: site.phone.href,
      },
      {
        "@type": "ProfessionalService",
        "@id": `${home}#servicio`,
        name: site.name,
        url: home,
        email: site.email,
        telephone: site.phone.href,
        description: site.description,
        founder: { "@id": `${home}#juan` },
        knowsAbout: ["Diseño web", "Desarrollo web", "Landing pages", "Rediseño web", "Diseño adaptable a móvil"],
        makesOffer: services.map((service) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: service.title, description: service.body },
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${home}#preguntas`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escapamos "<" para que el JSON no pueda cerrar la etiqueta script.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.language}
      className={`${bricolage.variable} ${instrument.variable} ${geistMono.variable} antialiased`}
      // El script de <head> añade clases a <html> antes de hidratar
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: ANIMATION_BOOT }} />
      </head>
      <body className="min-h-dvh">
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
