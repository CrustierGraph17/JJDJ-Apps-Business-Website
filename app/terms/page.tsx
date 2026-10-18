import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/sections/legal-document";
import { termsOfService } from "@/data/legal";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: termsOfService.summary,
  path: "/terms",
  type: "article",
});

export default function Page() {
  return <LegalDocumentPage document={termsOfService} />;
}
