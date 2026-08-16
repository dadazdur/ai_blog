import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog-index";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "AI per commercialisti e consulenti fiscali",
  description:
    "Guide operative, prompt testati e analisi sull'uso dell'intelligenza artificiale nello studio professionale: casi d'uso concreti, privacy dei dati e strumenti a confronto.",
  path: "/blog",
});

export default function BlogPage() {
  return <BlogIndex page={1} />;
}
