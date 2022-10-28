import React, { Suspense, useState } from "react";
import List from "@/ui/list";
import ProductCard from "@/ui/cards/product";
import Modal from "@/ui/modals";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/fetches";
export default function ProductList({ products }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Suspense fallback={<span>loading</span>}>
        <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-4 px-5 w-full mx-auto ">
          <List
            list={products}
            renderItem={(item) => (
              <ProductCard
                onClick={() => setShowModal(true)}
                key={item._id}
                product={item}
              />
            )}
          />
        </div>
      </Suspense>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="absolute flex justify-center items-center overflow-hidden  left-[50%] bottom-0 -translate-x-1/2  md:w-2/5 w-full h-[90%] bg-white rounded-tl-2xl rounded-tr-2xl">
          <div className="w-32 h-32 bg-red-400"></div>
        </div>
      </Modal>
    </>
  );
}

function openModal() {}
