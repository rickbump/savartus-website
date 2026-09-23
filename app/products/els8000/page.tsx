import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export const metadata: Metadata = {
  title: "ELS8000 Enterprise Optical Storage System",

  description:
    "Explore the Savartus ELS8000, a high-capacity enterprise optical storage system for scalable nearline information preservation, Active Archive environments, and long-term retention.",

  alternates: {
    canonical: "/products/els8000",
  },

  openGraph: {
    title: "ELS8000 Enterprise Optical Storage System | Savartus",
    description:
      "High-capacity enterprise optical storage for scalable nearline preservation, Active Archive environments, and long-term information retention.",
    url: "/products/els8000",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ELS8000 Enterprise Optical Storage System | Savartus",
    description:
      "High-capacity enterprise optical storage for scalable nearline preservation, Active Archive environments, and long-term information retention.",
  },
};

export default function ELS8000Page() {
  const product = getELSProduct("els8000");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}