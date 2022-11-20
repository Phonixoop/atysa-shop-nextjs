import React, { Suspense, useState } from "react";
import { useRouter } from "next/router";

import List from "@/ui/list";
import ProductCard from "@/ui/cards/product";
import Modal from "@/ui/modals";

import { SkeletonProductLarge } from "@/ui/cards/product/skeleton";
import { motion } from "framer-motion";

import MaterialsList from "ui/cards/product/materials-list";
import Price from "ui/cards/product/price";
import ProductCategoryList from "ui/cards/product/categories-list";
import AddProductButton from "ui/cards/product/add-product-button";
import Slider from "ui/slider";
import Star from "../../ui/icons/star";
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
        <div className="grid md:grid-cols-3 grid-rows-1 items-center justify-start gap-4">
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
            className="flex justify-center items-center bg-[#ffffff] w-full h-fit pt-5 pb-12"
          >
            <div className="flex justify-center flex-col gap-5 w-11/12 max-w-4xl h-full">
              <div
                dir="rtl"
                className="flex justify-center items-center gap-4 md:flex-row flex-col w-full"
              >
                <div className="flex-grow">
                  <Slider
                    imageUrls={[product.defaultImage, ...product.images]}
                  />
                </div>

                <div className="flex justify-center items-center flex-col w-full flex-grow gap-7 bg-white  rounded-lg">
                  {/* name rating description */}
                  <div className="flex flex-col w-full gap-y-5   items-start justify-between">
                    <div className="w-full flex flex-wrap md:justify-start justify-center">
                      <ProductCategoryList categories={product?.categories} />
                    </div>
                    <div className="w-full flex justify-between">
                      <span className="text-lg text-atysa-900 font-bold">
                        {product.name}
                      </span>
                      <div className="flex justify-center items-center gap-1 border-[1px] border-gray-300 rounded-md  px-[6px]">
                        <Star />

                        <span className="text-[0.7rem] text-atysa-900 font-bold text-center pt-1">
                          4.5
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 leading-relaxed text-sm text-justify">
                      {product?.description}
                    </p>
                  </div>

                  {/* price and add product button */}
                  <div className="flex justify-between items-center gap-5 w-full h-full">
                    <Price price={product.price} />

                    <AddProductButton id={product.id} product={product} />
                  </div>

                  <div className="relative flex justify-between items-center gap-2 w-full ">
                    <NutritionList nutritions={product.nutritions} />
                  </div>
                </div>
              </div>

              <div className="w-full">
                <MaterialsList
                  className="relative flex flex-row gap-2"
                  list={product.materials}
                  itemClass="text-[1rem] py-3"
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function NutritionList({ nutritions = [] }) {
  const total = nutritions
    .map((a) => a.amount)
    .reduce((prevValue, currentValue) => {
      return currentValue + prevValue;
    }, 0);
  return (
    <>
      {nutritions.map((nutrition) => {
        const height = 120;
        const heightClass = ` h-[${height}px]`;
        const percentage = (nutrition.amount / total) * 100;
        const overlayHeight = parseInt((percentage / height) * 100);
        // const overlayHeightClass = `bg-[rgba(255,255,${nutrition.amount})]`;
        return (
          <>
            <div
              className={`
                  relative
             
                flex flex-col gap-2 justify-center items-center
                ring-atysa-600
                ring-1 
                ring-inset
                
                w-[60px] ${heightClass} rounded-full
                overflow-hidden
               
                `}
            >
              <motion.div
                initial="initial"
                whileInView={{
                  height: [0, overlayHeight + 20],
                  repeatCount: 1,
                }}
                transition={{
                  duration: 3,
                  type: "spring",
                  damping: 30,
                  bounce: 300,
                  stiffness: 40,
                }}
                className={`absolute  bottom-0 z-0 rotate-6 bg-atysa-600 w-[500px]  `}
              />
              <span className="text-[0.7rem] text-atysa-900 font-bold z-10 ">
                {nutrition.name}
              </span>
              <span className="text-[0.9rem] text-atysa-900  font-bold z-10">
                {nutrition.amount}g
              </span>
            </div>
          </>
        );
      })}
    </>
  );
}
