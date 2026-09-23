import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export const metadata: Metadata = {
  title: "ELS150 Active Archive Storage System",

  description:
    "Explore the Savartus ELS150, a compact Active Archive system combining performance storage with nearline optical preservation for long-term enterprise information retention.",

  alternates: {
    canonical: "/products/els150",
  },

  openGraph: {
    title: "ELS150 Active Archive Storage System | Savartus",
    description:
      "A compact Active Archive system combining performance storage with nearline optical preservation for long-term enterprise information retention.",
    url: "/products/els150",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ELS150 Active Archive Storage System | Savartus",
    description:
      "A compact Active Archive system combining performance storage with nearline optical preservation for long-term enterprise information retention.",
  },
};

export default function ELS150Page() {
  const product = getELSProduct("els150");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}