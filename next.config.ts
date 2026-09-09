import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-*" },
      { protocol: "https", hostname: "github.com", pathname: "/raycast.png", search: "" },
      { protocol: "https", hostname: "github.com", pathname: "/figma.png", search: "" },
    ],
  },
};

export default nextConfig;
