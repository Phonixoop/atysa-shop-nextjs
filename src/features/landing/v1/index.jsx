import ProductList from "@/features/productList";
import { useState } from "react";
import Modal from "@/ui/modals";
import LoginForm from "features/login/loginForm";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api";
export default function LandingPageV1() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: products } = useQuery(["products"], getProducts, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  return (
    <div className="flex flex-col gap-5 justify-center items-center w-full h-full min-h-full my-5">
      <ProductList products={products} />
    </div>
  );
}
