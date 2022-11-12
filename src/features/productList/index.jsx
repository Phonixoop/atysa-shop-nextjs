import React, { Suspense, useState } from "react";
import List from "@/ui/list";
import ProductCard from "@/ui/cards/product";
import Modal from "@/ui/modals";
import { useRouter } from "next/router";
import { SkeletonProductLarge } from "@/ui/cards/product/skeleton";
export default function ProductList({ products }) {
  const [showModal, setShowModal] = useState();
  const router = useRouter();

  function handleCloseModal() {
    router.replace("/", undefined, { shallow: true });
  }

  return (
    <>
      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-4 px-5 w-full mx-auto ">
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
              onClick={() => setShowModal(true)}
              key={item}
              product={item}
            />
          )}
        />
      </div>

      <Modal
        isOpen={!!router.query.product_slug}
        onClose={handleCloseModal}
        size="xs"
        center
        title="محصول"
      >
        <div className="flex justify-center items-center bg-[#ffffff] w-full h-full"></div>
      </Modal>
    </>
  );
}

function openModal() {}
