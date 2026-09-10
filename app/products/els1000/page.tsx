import { notFound } from "next/navigation";
import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export default function ELS1000Page() {
  const product = getELSProduct("els1000");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}