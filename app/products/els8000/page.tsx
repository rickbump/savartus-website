import type { Metadata } from "next";
import { socialImages } from "@/lib/social-images";
import { notFound } from "next/navigation";

import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export const metadata: Metadata = {
  title: "ELS8000 Enterprise Optical Storage System",

  description:
    "Explore the Savartus ELS8000 high-capacity optical storage system for scalable nearline preservation, Active Archive, and long-term information retention.",

  alternates: {
    canonical: "/products/els8000",
  },

  openGraph: {
    images: socialImages.openGraph,
    title: "ELS8000 Enterprise Optical Storage System | Savartus",
    description:
      "High-capacity enterprise optical storage for scalable nearline preservation, Active Archive environments, and long-term information retention.",
    url: "/products/els8000",
    type: "website",
  },

  twitter: {
    images: socialImages.twitter,
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