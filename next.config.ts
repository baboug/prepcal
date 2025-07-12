import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "pinchofyum.com",
      },
    ],
  },
};

export default nextConfig;
