import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export const metadata: Metadata = {
  title: "ELS10K-OL Offline Optical Storage System",

  description:
    "Explore the Savartus ELS10K-OL, a high-capacity offline optical storage system for physically isolated, long-term enterprise information preservation.",

  alternates: {
    canonical: "/products/els10k-ol",
  },

  openGraph: {
    title: "ELS10K-OL Offline Optical Storage System | Savartus",
    description:
      "High-capacity offline optical storage for physically isolated, long-term enterprise information preservation.",
    url: "/products/els10k-ol",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ELS10K-OL Offline Optical Storage System | Savartus",
    description:
      "High-capacity offline optical storage for physically isolated, long-term enterprise information preservation.",
  },
};

export default function ELS10KOLPage() {
  const product = getELSProduct("els10k-ol");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}