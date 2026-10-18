import { createOgImage, OG_SIZE } from "@/lib/og";

export const alt = "JJDJ developer docs";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "Docs",
    title: "The reference for what we have shipped.",
    description: "Every published Notle reference in one index.",
    path: "jjdj.app/docs",
  });
}
