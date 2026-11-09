import { SiteShell } from "@/components/layout/SiteShell";
import { CinematicHero } from "@/components/hero/CinematicHero";
import { BrandReveal } from "@/components/sections/BrandReveal";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Situations } from "@/components/sections/Situations";
import { Principles } from "@/components/sections/Principles";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <SiteShell overlay>
      <CinematicHero />
      <BrandReveal />
      <Services />
      <Process />
      <Situations />
      <Principles />
      <Faq />
      <Contact />
    </SiteShell>
  );
}
