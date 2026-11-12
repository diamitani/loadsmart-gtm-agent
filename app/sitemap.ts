import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/presentation`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/playbook`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/demo`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/skills`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/automations`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/courses`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/documents`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/signup`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/signin`, changeFrequency: "monthly", priority: 0.3 },
  ];
}
