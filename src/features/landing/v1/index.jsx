import ProductList from "@/features/productList";
import { useState } from "react";
import Modal from "@/ui/modals";
import LoginForm from "features/login/loginForm";

export default function LandingPageV1({ products }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col gap-5 justify-center items-center w-full h-full bg-blue-50 min-h-full my-5">
      <ProductList products={products} />
    </div>
  );
}
