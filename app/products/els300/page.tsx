import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export const metadata: Metadata = {
  title: "ELS300 Rack-Mounted Magnetic-Optical Hybrid Storage System",

  description:
    "Explore the Savartus ELS300, a 7U organizational storage appliance with its cache server integrated in the chassis and automatic write-once optical second copies, up to 57.6 TB.",

  alternates: {
    canonical: "/products/els300",
  },

  openGraph: {
    title: "ELS300 Rack-Mounted Magnetic-Optical Hybrid Storage System | Savartus",
    description:
      "A 7U organizational storage appliance with an integrated cache server and automatic write-once optical second copies, up to 57.6 TB.",
    url: "/products/els300",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ELS300 Rack-Mounted Magnetic-Optical Hybrid Storage System | Savartus",
    description:
      "A 7U organizational storage appliance with an integrated cache server and automatic write-once optical second copies, up to 57.6 TB.",
  },
};

export default function ELS300Page() {
  const product = getELSProduct("els300");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}