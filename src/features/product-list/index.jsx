import React, { Suspense, useState } from "react";
import { useRouter } from "next/router";

import List from "@/ui/list";
import ProductCard from "@/ui/cards/product";
import Modal from "@/ui/modals";

// loadings
import ThreeDotsWave from "ui/loadings/three-dots-wave";
import SingleProduct from "../single-product";
export default function ProductList({ products }) {
  const [productModal, setProductModal] = useState({
    isOpen: false,
    product: undefined,
  });
  const { product } = productModal;
  const router = useRouter();

  function handleCloseModal() {
    setProductModal({ isOpen: false, product: undefined });
    // router.replace("/", undefined, { shallow: true });
  }

  return (
    <>
      <div
        dir="rtl"
        className="relative flex items-start justify-center md:justify-start w-full"
      >
        <div className="flex flex-wrap items-center justify-start w-full gap-4 px-2">
          {!products ? (
            <div className="w-full flex justify-center items-center ">
              <ThreeDotsWave />
            </div>
          ) : (
            <List
              list={products}
              renderItem={(item) => (
                <ProductCard
                  onClick={() =>
                    setProductModal({ isOpen: true, product: item })
                  }
                  key={item.id}
                  product={item}
                />
              )}
            />
          )}
        </div>
      </div>

      <Modal
        isOpen={productModal.isOpen}
        onClose={handleCloseModal}
        size="md"
        center
        title={productModal.product?.name}
      >
        <SingleProduct product={productModal.product} />
      </Modal>
    </>
  );
}
