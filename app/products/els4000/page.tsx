import { notFound } from "next/navigation";
import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export default function ELS4000Page() {
  const product = getELSProduct("els4000");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}