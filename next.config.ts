import type { NextConfig } from "next";

/**
 * JJDJ — Next.js configuration.
 * Kept intentionally lean: no remote image hosts are used, every asset in
 * /public is optimised locally through next/image.
 */
const nextConfig: NextConfig = {
  
  allowedDevOrigins: ['ada-jacket-crop-dam.trycloudflare.com'],
  reactStrictMode: true,
  poweredByHeader: false,
  // Serve modern formats first for the screenshot galleries.
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 828, 1080, 1200, 1600, 1920],
  },
};

export default nextConfig;
