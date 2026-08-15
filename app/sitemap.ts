import type { MetadataRoute } from "next";
import { getAllPublishedPosts, getAuthors, getCategories } from "@/lib/data";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, authors] = await Promise.all([getAllPublishedPosts(), getCategories(), getAuthors()]);

  const latest = posts[0]?.updated_at ?? posts[0]?.published_at ?? new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/blog"), lastModified: latest, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/risorse"), lastModified: latest, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/chi-siamo"), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/registrati"), changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/cookie-policy"), changeFrequency: "yearly", priority: 0.2 },
  ];

  const totalBlogPages = Math.max(1, Math.ceil(posts.length / siteConfig.postsPerPage));
  const blogPages: MetadataRoute.Sitemap = Array.from({ length: totalBlogPages - 1 }, (_, index) => ({
    url: absoluteUrl(`/blog/pagina/${index + 2}`),
    lastModified: latest,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...blogPages,
    ...categories.map((category) => ({
      url: absoluteUrl(`/blog/categoria/${category.slug}`),
      lastModified: latest,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...authors.map((author) => ({
      url: absoluteUrl(`/autori/${author.slug}`),
      lastModified: latest,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...posts
      .filter((post) => !post.noindex)
      .map((post) => ({
        url: absoluteUrl(`/blog/${post.slug}`),
        lastModified: post.updated_at ?? post.published_at ?? post.created_at,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
  ];
}
