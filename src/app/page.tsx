import { SiteShell } from "@/components/layout/SiteShell";
import { Showcase } from "@/components/sections/Showcase";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Work } from "@/components/sections/Work";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";

/**
 * Portada (escaparate 3D ligado al scroll), qué puedes encargarme, cómo
 * trabajamos, conceptos de diseño, dudas frecuentes y contacto.
 */
export default function Home() {
  return (
    <SiteShell>
      <Showcase />
      <Services />
      <Process />
      <Work />
      <Faq />
      <Contact />
    </SiteShell>
  );
}
