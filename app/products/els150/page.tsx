import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export const metadata: Metadata = {
  title: "ELS150 Magnetic-Optical Hybrid Storage System",

  description:
    "Explore the Savartus ELS150, a 14U organizational storage appliance with an integrated cache server and automatic write-once optical second copies, up to 30 TB.",

  alternates: {
    canonical: "/products/els150",
  },

  openGraph: {
    title: "ELS150 Magnetic-Optical Hybrid Storage System | Savartus",
    description:
      "A 14U organizational storage appliance with a built-in cache server and an automatic write-once optical second copy, up to 30 TB.",
    url: "/products/els150",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ELS150 Magnetic-Optical Hybrid Storage System | Savartus",
    description:
      "A 14U organizational storage appliance with a built-in cache server and an automatic write-once optical second copy, up to 30 TB.",
  },
};

export default function ELS150Page() {
  const product = getELSProduct("els150");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}