import { createOgImage, OG_SIZE } from "@/lib/og";
import { getArticle, helpArticles } from "@/data/help";

export const alt = "A Notle help article";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return helpArticles.map((article) => ({ slug: article.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);

  return createOgImage({
    eyebrow: "Notle help",
    title: article?.title ?? "Help centre",
    description: article?.description,
    path: `jjdj.app/help/${slug}`,
  });
}
