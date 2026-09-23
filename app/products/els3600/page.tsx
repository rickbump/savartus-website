import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export const metadata: Metadata = {
  title: "ELS3600 Enterprise Optical Storage System",

  description:
    "Explore the Savartus ELS3600, a scalable enterprise optical storage system for nearline information preservation, Active Archive environments, and long-term retention.",

  alternates: {
    canonical: "/products/els3600",
  },

  openGraph: {
    title: "ELS3600 Enterprise Optical Storage System | Savartus",
    description:
      "Scalable enterprise optical storage for nearline preservation, Active Archive environments, and long-term information retention.",
    url: "/products/els3600",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ELS3600 Enterprise Optical Storage System | Savartus",
    description:
      "Scalable enterprise optical storage for nearline preservation, Active Archive environments, and long-term information retention.",
  },
};

export default function ELS3600Page() {
  const product = getELSProduct("els3600");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}