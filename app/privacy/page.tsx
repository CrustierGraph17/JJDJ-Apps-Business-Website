import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/sections/legal-document";
import { privacyPolicy } from "@/data/legal";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: privacyPolicy.summary,
  path: "/privacy",
  type: "article",
});

export default function Page() {
  return <LegalDocumentPage document={privacyPolicy} />;
}
