import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export const metadata: Metadata = {
  title: "ELS500 Enterprise Optical Storage System",

  description:
    "Explore the Savartus ELS500, a scalable enterprise optical storage system for nearline information preservation, Active Archive environments, and long-term retention.",

  alternates: {
    canonical: "/products/els500",
  },

  openGraph: {
    title: "ELS500 Enterprise Optical Storage System | Savartus",
    description:
      "Scalable enterprise optical storage for nearline preservation, Active Archive environments, and long-term information retention.",
    url: "/products/els500",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ELS500 Enterprise Optical Storage System | Savartus",
    description:
      "Scalable enterprise optical storage for nearline preservation, Active Archive environments, and long-term information retention.",
  },
};

export default function ELS500Page() {
  const product = getELSProduct("els500");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}