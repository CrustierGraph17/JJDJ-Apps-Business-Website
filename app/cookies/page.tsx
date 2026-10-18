import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/sections/legal-document";
import { cookiePolicy } from "@/data/legal";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Cookie Policy",
  description: cookiePolicy.summary,
  path: "/cookies",
  type: "article",
});

export default function Page() {
  return <LegalDocumentPage document={cookiePolicy} />;
}
