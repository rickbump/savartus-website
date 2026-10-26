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
      {
        source: "/learn",
        destination: "/resources",
        permanent: true,
      },
      {
        source: "/solutions",
        destination: "/#solutions",
        permanent: true,
      },
      {
        source: "/solutions/data-lifecycle-management",
        destination: "/data-lifecycle-management",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/insights",
        permanent: true,
      },
      {
        source: "/contact-us/contact-savartus-team",
        destination: "/contact",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
