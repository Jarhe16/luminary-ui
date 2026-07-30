import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3", "bcryptjs"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
