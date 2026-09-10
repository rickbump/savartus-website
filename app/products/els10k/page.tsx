import { notFound } from "next/navigation";
import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export default function ELS10KPage() {
  const product = getELSProduct("els10k");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}