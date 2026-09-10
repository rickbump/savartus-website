import { notFound } from "next/navigation";
import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export default function ELS3600Page() {
  const product = getELSProduct("els3600");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}