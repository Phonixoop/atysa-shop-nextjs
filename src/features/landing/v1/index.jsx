import ProductList from "@/features/productList";
import { useState } from "react";
import Modal from "@/ui/modals";
import LoginForm from "features/login/loginForm";

export default function LandingPageV1({ products }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col justify-center items-center w-full h-full bg-blue-50 min-h-full my-5">
      <div className="md:w-10/12 w-[95%] flex flex-col gap-5">
        <h2
          dir="rtl"
          className="w-full flex justify-start px-5 text-xl font-bold  text-right"
        >
          محصولات VIP
        </h2>
        <ProductList products={products} />
        {/* <button onClick={() => setIsOpen(true)}>login</button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <LoginForm />
        </Modal> */}
      </div>
    </div>
  );
}
