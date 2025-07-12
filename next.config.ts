import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "pinchofyum.com",
      },
      {
        hostname: "mealprepmanual.com",
      },
    ],
  },
};

export default nextConfig;
