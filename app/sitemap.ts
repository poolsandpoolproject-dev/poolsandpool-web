import type { MetadataRoute } from "next";
import { listCategories } from "@/lib/api/public/menu";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://poolsandpool.co";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await listCategories();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/menu/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes];
}
