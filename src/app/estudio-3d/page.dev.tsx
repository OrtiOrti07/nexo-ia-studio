import type { Metadata } from "next";
import { RenderLab } from "@/components/three/RenderLab";

/*
 * Laboratorio de render: solo existe en `next dev` (extensión .dev.tsx, ver
 * pageExtensions en next.config.ts). No se publica.
 */

export const metadata: Metadata = {
  title: "Laboratorio de render",
  robots: { index: false, follow: false },
};

export default function RenderLabPage() {
  return <RenderLab />;
}
