import { SiteShell } from "@/components/layout/SiteShell";
import { SceneLayer } from "@/components/scene/SceneLayer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Cases } from "@/components/sections/Cases";
import { FinalCta } from "@/components/sections/FinalCta";
import { Contact } from "@/components/sections/Contact";

/**
 * Portada. Cada bloque lleva `data-stage`: la formación que adopta la escena 3D
 * del fondo mientras está en pantalla (ver docs/direccion-visual.md).
 */
export default function Home() {
  return (
    <SiteShell background={<SceneLayer />}>
      <div data-stage="0">
        <Hero />
      </div>
      <div data-stage="1">
        <Services />
      </div>
      <div data-stage="2">
        <Process />
      </div>
      <div data-stage="3">
        <Cases />
      </div>
      <div data-stage="4">
        <FinalCta />
      </div>
      <div data-stage="5">
        <Contact />
      </div>
    </SiteShell>
  );
}
