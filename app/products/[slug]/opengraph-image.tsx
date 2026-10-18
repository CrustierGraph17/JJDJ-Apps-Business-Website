import { createOgImage, OG_SIZE } from "@/lib/og";
import { getProduct, products } from "@/data/products";

export const alt = "Notle, a JJDJ app";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Pre-render one card per product at build time. */
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);

  return createOgImage({
    eyebrow: product ? `${product.category} · JJDJ` : "JJDJ app",
    title: product?.name ?? "JJDJ",
    description: product?.tagline,
    path: `jjdj.app/products/${slug}`,
  });
}
