import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@internium/ui", "@internium/backend"],
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
