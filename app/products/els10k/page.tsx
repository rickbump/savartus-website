import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export const metadata: Metadata = {
  title: "ELS10K Enterprise Optical Storage System",

  description:
    "Explore the Savartus ELS10K, a high-capacity enterprise optical storage system for scalable nearline preservation, Active Archive, and long-term information retention.",

  alternates: {
    canonical: "/products/els10k",
  },

  openGraph: {
    title: "ELS10K Enterprise Optical Storage System | Savartus",
    description:
      "High-capacity enterprise optical storage for scalable nearline preservation, Active Archive, and long-term information retention.",
    url: "/products/els10k",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ELS10K Enterprise Optical Storage System | Savartus",
    description:
      "High-capacity enterprise optical storage for scalable nearline preservation, Active Archive, and long-term information retention.",
  },
};

export default function ELS10KPage() {
  const product = getELSProduct("els10k");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}