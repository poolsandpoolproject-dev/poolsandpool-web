import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  async rewrites() {
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.poolsandpool.co/api/v1").replace(/\/+$/, "");
    return [{ source: "/api/v1/:path*", destination: `${base}/:path*` }];
  },
};

export default nextConfig;
