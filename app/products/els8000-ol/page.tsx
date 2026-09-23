import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export const metadata: Metadata = {
  title: "ELS8000-OL Offline Optical Storage System",

  description:
    "Explore the Savartus ELS8000-OL, a high-capacity offline optical storage system for physically isolated, long-term enterprise information preservation.",

  alternates: {
    canonical: "/products/els8000-ol",
  },

  openGraph: {
    title: "ELS8000-OL Offline Optical Storage System | Savartus",
    description:
      "High-capacity offline optical storage for physically isolated, long-term enterprise information preservation.",
    url: "/products/els8000-ol",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ELS8000-OL Offline Optical Storage System | Savartus",
    description:
      "High-capacity offline optical storage for physically isolated, long-term enterprise information preservation.",
  },
};

export default function ELS8000OLPage() {
  const product = getELSProduct("els8000-ol");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}