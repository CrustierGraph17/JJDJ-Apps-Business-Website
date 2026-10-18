import { createOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Logos, colours and facts.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    eyebrow: "Press kit",
    title: "Logos, colours and facts.",
    description: "An accurate press kit for JJDJ and Notle.",
    path: "jjdj.app/press",
  });
}
