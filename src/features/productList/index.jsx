import React, { Suspense, useState } from "react";
import { useRouter } from "next/router";

import List from "@/ui/list";
import ProductCard from "@/ui/cards/product";
import Modal from "@/ui/modals";

import { SkeletonProductLarge } from "@/ui/cards/product/skeleton";
import ProductImageBox from "ui/cards/product/product-image-box";

export default function ProductList({ products }) {
  const [productModal, setProductModal] = useState({
    isOpen: false,
    product: undefined,
  });
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
        <div className="grid md:grid-cols-3 grid-rows-1 items-center justify-start gap-4  ">
          {!products && (
            <List
              list={[...Array(3)]}
              renderItem={(_, i) => <SkeletonProductLarge key={i} />}
            />
          )}

          <List
            list={products}
            renderItem={(item, i) => (
              <ProductCard
                onClick={() => setProductModal({ isOpen: true, product: item })}
                key={item}
                product={item}
              />
            )}
          />
        </div>
      </div>

      <Modal
        isOpen={productModal.isOpen}
        onClose={handleCloseModal}
        size="md"
        center
        title={productModal.product?.name}
      >
        {productModal.product && (
          <div
            dir="rtl"
            className="flex justify-center items-center bg-[#ffffff] w-full h-full"
          >
            <div className="flex flex-col w-full h-full p-5">
              <div className="flex flex-1">
                <ProductImageBox
                  className="relative flex  justify-center items-stretch h-[200px] leading-[0px] rounded-xl  overflow-hidden "
                  src={productModal.product.defaultImage}
                />
              </div>

              <div className="flex flex-1 ">{productModal.product.name}</div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
