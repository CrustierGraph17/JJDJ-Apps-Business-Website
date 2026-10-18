import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";
import { site } from "@/data/site";

/**
 * Builds a page's metadata from one place, so canonical URLs, Open Graph and
 * Twitter cards are always consistent with the page's own title.
 *
 * The Open Graph image is not set here: every route gets one from the
 * `opengraph-image.tsx` file beside it, which Next wires up automatically.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  /** Route path, e.g. "/products". */
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url,
      title: `${title} · ${site.shortName}`,
      description,
      siteName: site.name,
      locale: site.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${site.shortName}`,
      description,
    },
  };
}
