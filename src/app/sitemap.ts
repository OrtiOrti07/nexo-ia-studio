import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/aviso-legal`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/privacidad`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
