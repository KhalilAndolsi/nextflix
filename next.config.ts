import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "image.tmdb.org",
        protocol: "https",
      },
      {
        hostname: "media.themoviedb.org",
        protocol: "https",
      },
      {
        hostname: "api.dicebear.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
