import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export const metadata: Metadata = {
  title: "ELS300 Rack-Mounted Optical Storage System",

  description:
    "Explore the Savartus ELS300, a rack-mounted enterprise optical storage system for nearline information preservation, Active Archive environments, and long-term retention.",

  alternates: {
    canonical: "/products/els300",
  },

  openGraph: {
    title: "ELS300 Rack-Mounted Optical Storage System | Savartus",
    description:
      "Rack-mounted enterprise optical storage for nearline preservation, Active Archive environments, and long-term information retention.",
    url: "/products/els300",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ELS300 Rack-Mounted Optical Storage System | Savartus",
    description:
      "Rack-mounted enterprise optical storage for nearline preservation, Active Archive environments, and long-term information retention.",
  },
};

export default function ELS300Page() {
  const product = getELSProduct("els300");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}