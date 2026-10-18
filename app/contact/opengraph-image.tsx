import { createOgImage, OG_SIZE } from "@/lib/og";
import { site } from "@/data/site";

export const alt = "Contact JJDJ";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "Contact",
    title: "One inbox, two people.",
    description: `Email JJDJ directly at ${site.email}.`,
    path: "jjdj.app/contact",
  });
}
