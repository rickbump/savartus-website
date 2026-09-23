import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export const metadata: Metadata = {
  title: "ELS4000 Enterprise Optical Storage System",

  description:
    "Explore the Savartus ELS4000, a scalable enterprise optical storage system for nearline information preservation, Active Archive environments, and long-term retention.",

  alternates: {
    canonical: "/products/els4000",
  },

  openGraph: {
    title: "ELS4000 Enterprise Optical Storage System | Savartus",
    description:
      "Scalable enterprise optical storage for nearline preservation, Active Archive environments, and long-term information retention.",
    url: "/products/els4000",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ELS4000 Enterprise Optical Storage System | Savartus",
    description:
      "Scalable enterprise optical storage for nearline preservation, Active Archive environments, and long-term information retention.",
  },
};

export default function ELS4000Page() {
  const product = getELSProduct("els4000");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}