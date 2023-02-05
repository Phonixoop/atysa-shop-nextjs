import { motion } from "framer-motion";
import { useState } from "react";

//ui
import MaterialsList from "ui/cards/product/materials-list";
import Price from "ui/cards/product/price";
import ProductCategoryList from "ui/cards/product/categories-list";
import AddProductButton from "ui/cards/product/add-product-button";
import Slider from "ui/slider";

//icons

import ChevronLeftIcon from "ui/icons/chervons/chevron-left";
import ChevronRightIcon from "ui/icons/chervons/chervon-right";
import { trpc } from "utils/trpc";
import ThreeDotsWave from "ui/loadings/three-dots-wave";
import StarScore from "features/star-score";
import Comment from "features/comment";

export default function SingleProduct({ product }) {
  const productComments = trpc.comment.getCommentsByProductId.useQuery({
    productId: product.id,
  });
  if (!product) return "";
  return (
    <div
      dir="rtl"
      className="flex h-fit w-full flex-col items-center  justify-center bg-[#ffffff] pt-5 pb-36"
    >
      <div className="flex h-full w-11/12 max-w-4xl flex-col justify-center gap-5">
        <div
          dir="rtl"
          className="flex w-full flex-col items-center justify-center gap-4 md:flex-row"
        >
          <div className="flex-grow">
            <Slider
              imageUrls={[product?.defaultImage || "", ...product?.images]}
            />
          </div>

          <div className="flex w-full flex-grow flex-col items-center justify-center gap-7 rounded-lg  bg-white">
            {/* name rating description */}
            <div className="flex w-full flex-col items-start   justify-between gap-y-5">
              <div className="flex w-full flex-wrap justify-center md:justify-start">
                <ProductCategoryList categories={product?.categories} />
              </div>
              <div className="flex w-full justify-between">
                <span className="text-lg font-bold text-atysa-800">
                  {product.name}
                </span>
                <StarScore score={product.rate_score || "4.5"} />
              </div>
              <p className="text-justify text-sm leading-relaxed text-black/80">
                {product?.description}
              </p>
            </div>

            {/* price and add product button */}
            <div className="flex h-full w-full items-center justify-between gap-5">
              <Price
                className="font-bold text-atysa-main"
                price={product.price}
              />

              <AddProductButton id={product.id} product={product} />
            </div>
            <MaterialsListWithMore list={product.materials} />
            <div className="relative flex w-full items-center justify-between gap-2 ">
              <NutritionList nutritions={product.nutritions} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-5 rounded-md p-2 py-10 md:p-10">
        {productComments.isLoading ? (
          <ThreeDotsWave />
        ) : productComments.isError ||
          !productComments.data ||
          productComments.data.length <= 0 ? (
          ""
        ) : (
          <>
            {productComments.data?.map((comment) => {
              return <Comment key={comment.id} comment={comment} />;
            })}
          </>
        )}
      </div>
    </div>
  );
}

function NutritionList({ nutritions = [] }: { nutritions: Array<any> }) {
  const total = nutritions
    .map((a) => a.amount)
    .reduce((prevValue, currentValue) => {
      return currentValue + prevValue;
    }, 0);
  return (
    <>
      {nutritions.map((nutrition) => {
        const height = 120;

        const percentage = (nutrition.amount / total) * 100;
        const overlayHeight = (percentage / height) * 100;
        // const overlayHeightClass = `bg-[rgba(255,255,${nutrition.amount})]`;
        return (
          <>
            <div
              className={`
                    relative
  
                  flex w-[60px] flex-col items-center justify-center
                  gap-2
                  
                  overflow-hidden 
                  rounded-full
                  
                  ring-1 ring-inset
                  ring-atysa-main
                 
                  `}
              style={{
                height,
              }}
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
                className={`absolute  bottom-0 z-0 w-[500px] rotate-6 bg-atysa-main  `}
              />
              <span className="z-10 text-[0.7rem] font-bold text-atysa-900 ">
                {nutrition.name}
              </span>
              <span className="z-10 text-[0.9rem]  font-bold text-atysa-900">
                {nutrition.amount}g
              </span>
            </div>
          </>
        );
      })}
    </>
  );
}

function MaterialsListWithMore({ list }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative flex w-full flex-col justify-between gap-2 md:flex-row">
      <MaterialsList
        withIcon
        className={`${
          !isOpen ? "opacity-100" : "opacity-0"
        } relative flex flex-row justify-between gap-2 `}
        list={list.slice(0, 6)}
        itemClass="text-[0.8rem] rounded-md"
      />
      {list.length > 6 && (
        <button
          type="button"
          className="text-sm font-bold text-atysa-800"
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
        >
          {!isOpen ? (
            <span className="flex items-center justify-center gap-2 text-atysa-800">
              بیشتر
              <ChevronLeftIcon className="h-3 w-3 fill-none stroke-atysa-800 stroke-[3px]" />
            </span>
          ) : (
            <span className="flex items-center justify-center  gap-2 text-atysa-800">
              کمتر
              <ChevronRightIcon className="h-3 w-3 fill-none stroke-atysa-800 stroke-2" />
            </span>
          )}
        </button>
      )}
      {isOpen && (
        <div className="absolute z-50 w-full rounded-lg bg-white/50 p-3 drop-shadow-md backdrop-blur-sm md:w-10/12">
          <button
            type="button"
            className="flex w-full justify-end pt-2 text-left text-sm text-atysa-800 md:hidden "
            onClick={() => {
              setIsOpen((prev) => !prev);
            }}
          >
            <ChevronLeftIcon className="h-3 w-3 fill-none stroke-gray-800 stroke-[3px]" />
          </button>
          <MaterialsList
            withIcon
            className="relative flex flex-row flex-wrap justify-between gap-y-5 gap-x-4"
            list={list}
            itemClass="text-[0.8rem] bg-transparent rounded-md "
          />
        </div>
      )}
    </div>
  );
}
