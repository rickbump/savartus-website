import { notFound } from "next/navigation";
import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export default function ELS8000Page() {
  const product = getELSProduct("els8000");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}