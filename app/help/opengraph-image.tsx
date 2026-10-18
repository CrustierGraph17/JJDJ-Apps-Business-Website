import { createOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Notle help";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "Notle help",
    title: "How Notle works.",
    description: "Audio, study tools, plans and your data.",
    path: "jjdj.app/help",
  });
}
