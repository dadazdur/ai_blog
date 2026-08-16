import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogIndex, blogTotalPages } from "@/components/blog-index";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

type Params = Promise<{ numero: string }>;

export async function generateStaticParams() {
  const total = await blogTotalPages();
  return Array.from({ length: Math.max(0, total - 1) }, (_, index) => ({ numero: String(index + 2) }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { numero } = await params;
  return buildMetadata({
    title: `AI per commercialisti e consulenti fiscali — pagina ${numero}`,
    description:
      "Archivio degli articoli di Le Scritture sull'uso dell'intelligenza artificiale nello studio professionale.",
    path: `/blog/pagina/${numero}`,
  });
}

export default async function BlogPaginaPage({ params }: { params: Params }) {
  const { numero } = await params;
  const page = Number(numero);
  if (!Number.isInteger(page) || page < 2) notFound();

  const total = await blogTotalPages();
  if (page > total) notFound();

  return <BlogIndex page={page} />;
}
