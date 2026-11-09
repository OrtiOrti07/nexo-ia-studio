import type { Metadata, Viewport } from "next";
import { Archivo, Newsreader } from "next/font/google";
import { absoluteUrl, href, site } from "@/config/site";
import { faqs } from "@/content/home";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
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
    "automatización de procesos con IA",
    "diseño web a medida",
    "desarrollo web a medida",
    "asistentes de IA para negocios",
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
  themeColor: "#1633c9",
  colorScheme: "light",
};

function StructuredData() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: site.name,
      url: site.url,
      email: site.email,
      telephone: site.phone.href,
      description: site.description,
      inLanguage: site.language,
      knowsAbout: [
        "Inteligencia artificial aplicada a negocios",
        "Automatización de procesos",
        "Diseño y desarrollo web a medida",
      ],
      makesOffer: [
        "Consultoría de IA",
        "Automatización con IA",
        "Webs a medida",
      ].map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      // Escapamos "<" para que el JSON no pueda cerrar la etiqueta script.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.language}
      className={`${archivo.variable} ${newsreader.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
