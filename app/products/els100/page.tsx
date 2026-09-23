import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export const metadata: Metadata = {
  title: "ELS100 Enterprise Optical Storage System",

  description:
    "Explore the Savartus ELS100, a compact enterprise optical storage system for nearline information preservation and long-term retention.",

  alternates: {
    canonical: "/products/els100",
  },

  openGraph: {
    title: "ELS100 Enterprise Optical Storage System | Savartus",
    description:
      "Compact enterprise optical storage for nearline information preservation and long-term retention.",
    url: "/products/els100",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ELS100 Enterprise Optical Storage System | Savartus",
    description:
      "Compact enterprise optical storage for nearline information preservation and long-term retention.",
  },
};

export default function ELS100Page() {
  const product = getELSProduct("els100");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}