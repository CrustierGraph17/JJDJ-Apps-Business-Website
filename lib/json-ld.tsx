import type { Product } from "@/data/products";
import type { HelpArticle } from "@/data/help";
import { site, socialLinks } from "@/data/site";
import { absoluteUrl } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 *  JSON-LD
 *
 *  Built here rather than inline in pages so the shapes stay consistent and
 *  every route emits the same vocabulary. Only facts from /data go in.
 * ------------------------------------------------------------------ */

type JsonLd = Record<string, unknown>;

/** Organization + WebSite. Emitted once, from the root layout. */
export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${absoluteUrl("/")}#organization`,
        name: site.name,
        alternateName: site.shortName,
        url: absoluteUrl("/"),
        description: site.description,
        email: site.email,
        foundingDate: String(site.founded),
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/brand/jjdj-mark-on-light.svg"),
        },
        // Lets search engines tie the official accounts to the org.
        sameAs: socialLinks.map((social) => social.href),
        address: {
          "@type": "PostalAddress",
          addressLocality: "Perth",
          addressRegion: "WA",
          addressCountry: "AU",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        url: absoluteUrl("/"),
        name: site.name,
        description: site.description,
        inLanguage: "en-AU",
        publisher: { "@id": `${absoluteUrl("/")}#organization` },
      },
    ],
  };
}

/** SoftwareApplication for a product detail page. */
export function productJsonLd(product: Product): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    applicationCategory: "EducationalApplication",
    applicationSubCategory: product.category,
    operatingSystem: product.platforms.join(", "),
    description: product.summary,
    datePublished: product.launchDate,
    url: absoluteUrl(`/products/${product.slug}`),
    softwareHelp: { "@type": "CreativeWork", url: absoluteUrl("/help") },
    author: { "@id": `${absoluteUrl("/")}#organization` },
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "USD",
      description: "Notle Free",
      availability: "https://schema.org/PreOrder",
      url: absoluteUrl(`/products/${product.slug}`),
    },
  };
}

/** FAQPage for the help centre and the per-product FAQs. */
export function faqJsonLd(items: { question: string; answer: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** TechArticle for a help article, including its section headings. */
export function articleJsonLd(article: HelpArticle): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.description,
    dateModified: article.updated,
    url: absoluteUrl(`/help/${article.slug}`),
    inLanguage: "en-AU",
    author: { "@id": `${absoluteUrl("/")}#organization` },
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
    proficiencyLevel: "Beginner",
    articleSection: article.sections.map((section) => section.heading),
  };
}

/** Breadcrumbs, so results show the path rather than a bare URL. */
export function breadcrumbJsonLd(trail: { name: string; href: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

/** ItemList of the catalogue, for the products index. */
export function productListJsonLd(products: Product[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "JJDJ apps",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: absoluteUrl(`/products/${product.slug}`),
    })),
  };
}

/**
 * Renders a JSON-LD block. Uses dangerouslySetInnerHTML because that is the
 * only way to emit a raw script body; the input is our own typed data, never
 * anything user-supplied.
 */
export function JsonLd({ data }: { data: JsonLd }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
