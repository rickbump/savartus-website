import { notFound } from "next/navigation";
import { ELSProductDetail } from "@/components/products/ELSProductDetail";
import { getELSProduct } from "@/data/els-products";

export default function ELS100Page() {
  const product = getELSProduct("els100");

  if (!product) {
    notFound();
  }

  return <ELSProductDetail product={product} />;
}