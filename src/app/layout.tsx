import type { Metadata, Viewport } from "next";
import { Geist_Mono, Hubot_Sans, Mona_Sans } from "next/font/google";
import { absoluteUrl, href, site } from "@/config/site";
import { services } from "@/content/home";
import "./globals.css";

// Titulares: Hubot Sans con su eje de anchura (expandida)
const hubot = Hubot_Sans({
  variable: "--font-hubot",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
});

// Texto: Mona Sans, de la misma familia
const mona = Mona_Sans({
  variable: "--font-mona",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
});

// Solo índices y etiquetas técnicas cortas
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
  manifest: href("/manifest.webmanifest"),
  keywords: [
    "consultoría de inteligencia artificial",
    "consultoría IA para empresas",
    "agentes de IA",
    "automatización de procesos con IA",
    "chatbots para empresas",
    "integración de inteligencia artificial",
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
  themeColor: "#050505",
  colorScheme: "dark",
};

function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phone.href,
    description: site.description,
    inLanguage: site.language,
    knowsAbout: ["Inteligencia artificial aplicada a empresas", "Agentes de IA", "Automatización de procesos"],
    makesOffer: services.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.title, description: service.body },
    })),
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
    <html lang={site.language} className={`${hubot.variable} ${mona.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-dvh">
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
