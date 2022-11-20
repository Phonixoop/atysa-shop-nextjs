import { useQuery } from "@tanstack/react-query";
import { getProducts } from "api";

import ProductList from "features/product-list";

export default function LandingPageV1() {
  const { data: products } = useQuery(["products"], getProducts, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  return (
    <>
      <ProductList products={products} />
    </>
  );
}
