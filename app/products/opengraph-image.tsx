import { createOgImage, OG_SIZE } from "@/lib/og";

export const alt = "One app, for now.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "Products",
    title: "One app, for now.",
    description: "Notle: study tools and four editors. Launching 10 November 2026.",
    path: "jjdj.app/products",
  });
}
