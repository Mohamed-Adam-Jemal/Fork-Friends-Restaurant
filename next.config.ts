import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imxrshekrwrgnwerqflt.supabase.co",
        pathname: "**", // or be more specific like "/storage/v1/object/public/**"
      },
    ],
  },
};

export default nextConfig;
