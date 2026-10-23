import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  redirects() {
    return [
      {
        source: "/about",
        destination: "/company",
        permanent: true,
      },
      {
        source: "/solutions/enterprise-laser-storage",
        destination: "/products/els",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
