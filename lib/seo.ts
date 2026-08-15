import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";
import type { Author, Category, FaqItem, Post } from "@/lib/types";

const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

/** URL dell'immagine social generata al volo per una pagina. */
export function ogImageUrl(params: { title: string; kicker?: string; meta?: string }) {
  const search = new URLSearchParams({ title: params.title });
  if (params.kicker) search.set("kicker", params.kicker);
  if (params.meta) search.set("meta", params.meta);
  return `/api/og?${search.toString()}`;
}

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  noindex,
  canonical,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noindex?: boolean;
  canonical?: string | null;
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? ogImageUrl({ title });

  return {
    title,
    description,
    alternates: { canonical: canonical || url },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(type === "article" ? { publishedTime, modifiedTime, authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// ---------------------------------------------------------------------------
// Dati strutturati
// ---------------------------------------------------------------------------

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    email: siteConfig.email,
    sameAs: [siteConfig.linkedin],
    knowsAbout: [
      "Intelligenza artificiale applicata alla professione contabile",
      "Automazione degli studi commercialisti",
      "Protezione dei dati nell'uso dell'AI",
    ],
    areaServed: { "@type": "Country", name: "Italia" },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "it-IT",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function personSchema(author: Author) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/autori/${author.slug}#person`,
    name: author.name,
    url: absoluteUrl(`/autori/${author.slug}`),
    jobTitle: author.role_title ?? undefined,
    description: author.bio ?? undefined,
    image: author.avatar_url ?? undefined,
    sameAs: author.linkedin_url ? [author.linkedin_url] : undefined,
    hasCredential: author.credentials
      ? { "@type": "EducationalOccupationalCredential", credentialCategory: author.credentials }
      : undefined,
    worksFor: { "@id": ORGANIZATION_ID },
  };
}

export function articleSchema(post: Post, wordCount?: number) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.seo_title || post.title,
    name: post.title,
    description: post.seo_description || post.excerpt || undefined,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at ?? post.published_at ?? post.created_at,
    inLanguage: "it-IT",
    isAccessibleForFree: true,
    wordCount,
    timeRequired: post.reading_minutes ? `PT${post.reading_minutes}M` : undefined,
    articleSection: post.category?.name ?? undefined,
    keywords: post.focus_keyword ?? undefined,
    image: [absoluteUrl(post.cover_url ?? ogImageUrl({ title: post.title, kicker: post.category?.name }))],
    author: post.author
      ? {
          "@type": "Person",
          "@id": `${siteConfig.url}/autori/${post.author.slug}#person`,
          name: post.author.name,
          url: absoluteUrl(`/autori/${post.author.slug}`),
          jobTitle: post.author.role_title ?? undefined,
        }
      : { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faq: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function collectionSchema({
  name,
  description,
  path,
  posts,
}: {
  name: string;
  description: string;
  path: string;
  posts: Post[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: "it-IT",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/blog/${post.slug}`),
        name: post.title,
      })),
    },
  };
}

export function categoryMetadataDefaults(category: Category) {
  return {
    title: category.seo_title || `${category.name} — articoli per commercialisti`,
    description:
      category.seo_description ||
      category.description ||
      `Tutti gli articoli di ${siteConfig.name} nella categoria ${category.name}.`,
  };
}
