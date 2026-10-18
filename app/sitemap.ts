import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { helpArticles } from "@/data/help";
import { absoluteUrl } from "@/lib/utils";

/**
 * sitemap.xml
 *
 * Built from the same data files the pages use, so adding a product or a help
 * article automatically adds it here.
 */
/** The date the wording on these pages was last reviewed. */
const CONTENT_UPDATED = "2026-10-17";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: CONTENT_UPDATED,
      priority: 1,
      changeFrequency: "weekly",
    },
    {
      url: absoluteUrl("/products"),
      lastModified: CONTENT_UPDATED,
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      url: absoluteUrl("/about"),
      lastModified: CONTENT_UPDATED,
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: absoluteUrl("/help"),
      lastModified: CONTENT_UPDATED,
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: absoluteUrl("/docs"),
      lastModified: CONTENT_UPDATED,
      priority: 0.6,
      changeFrequency: "monthly",
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: CONTENT_UPDATED,
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      url: absoluteUrl("/press"),
      lastModified: CONTENT_UPDATED,
      priority: 0.4,
      changeFrequency: "yearly",
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: "2026-10-17",
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: "2026-10-17",
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      url: absoluteUrl("/cookies"),
      lastModified: "2026-10-17",
      priority: 0.3,
      changeFrequency: "yearly",
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: absoluteUrl(`/products/${product.slug}`),
    lastModified: CONTENT_UPDATED,
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  const articleRoutes: MetadataRoute.Sitemap = helpArticles.map((article) => ({
    url: absoluteUrl(`/help/${article.slug}`),
    lastModified: article.updated,
    priority: 0.5,
    changeFrequency: "monthly",
  }));

  return [...staticRoutes, ...productRoutes, ...articleRoutes];
}
