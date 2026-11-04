import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  experimental: {
    serverActions: {
      ...(process.env.SERVER_ACTIONS_ALLOWED_ORIGINS
        ? {
            allowedOrigins: process.env.SERVER_ACTIONS_ALLOWED_ORIGINS
              .split(",")
              .map((origin) => origin.trim())
              .filter(Boolean),
          }
        : {}),
      bodySizeLimit: "31mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
