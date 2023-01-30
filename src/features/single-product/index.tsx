import { motion } from "framer-motion";
import { useState } from "react";

//ui
import MaterialsList from "ui/cards/product/materials-list";
import Price from "ui/cards/product/price";
import ProductCategoryList from "ui/cards/product/categories-list";
import AddProductButton from "ui/cards/product/add-product-button";
import Slider from "ui/slider";

//icons
import StarIcon from "ui/icons/star";
import ChevronLeftIcon from "ui/icons/chervons/chevron-left";
import ChevronRightIcon from "ui/icons/chervons/chervon-right";
import { trpc } from "utils/trpc";
import ThreeDotsWave from "ui/loadings/three-dots-wave";

export default function SingleProduct({ product }) {
  const productComments = trpc.comment.getCommentsByProductId.useQuery({
    productId: product.id,
  });
  if (!product) return "";
  return (
    <div
      dir="rtl"
      className="flex flex-col justify-center items-center bg-[#ffffff]  w-full h-fit pt-5 pb-36"
    >
      <div className="flex justify-center flex-col gap-5 w-11/12 max-w-4xl h-full">
        <div
          dir="rtl"
          className="flex justify-center items-center gap-4 md:flex-row flex-col w-full"
        >
          <div className="flex-grow">
            <Slider imageUrls={[product.defaultImage, ...product.images]} />
          </div>

          <div className="flex justify-center items-center flex-col w-full flex-grow gap-7 bg-white  rounded-lg">
            {/* name rating description */}
            <div className="flex flex-col w-full gap-y-5   items-start justify-between">
              <div className="w-full flex flex-wrap md:justify-start justify-center">
                <ProductCategoryList categories={product?.categories} />
              </div>
              <div className="w-full flex justify-between">
                <span className="text-lg text-atysa-800 font-bold">
                  {product.name}
                </span>
                <StarScore score="4.5" />
              </div>
              <p className="text-black/80 leading-relaxed text-sm text-justify">
                {product?.description}
              </p>
            </div>

            {/* price and add product button */}
            <div className="flex justify-between items-center gap-5 w-full h-full">
              <Price
                className="text-atysa-main font-bold"
                price={product.price}
              />

              <AddProductButton id={product.id} product={product} />
            </div>
            <MaterialsListWithMore list={product.materials} />
            <div className="relative flex justify-between items-center gap-2 w-full ">
              <NutritionList nutritions={product.nutritions} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-5 w-full md:p-10 p-2 py-10 rounded-md">
        {productComments.isLoading ? (
          <ThreeDotsWave />
        ) : productComments.isError ? (
          ""
        ) : (
          <>
            {productComments.data?.map((comment) => {
              return (
                <div className="flex flex-col justify-center items-center gap-5 w-full bg-atysa-primary  p-5 rounded-md">
                  <div className="w-full flex justify-start items-center gap-10 text-atysa-main text-sm">
                    <span> {comment.user_name}</span>
                    <div className="flex justify-start items-center flex-wrap gap-2">
                      {comment.products.map((product_name) => {
                        return (
                          <span className="bg-atysa-main text-white px-2 py-1 rounded-full text-xs">
                            {product_name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex justify-between w-full">
                    <p>{comment.message}</p>
                    <StarScore score={comment.rate_score} />
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
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

        const percentage = (nutrition.amount / total) * 100;
        const overlayHeight = parseInt((percentage / height) * 100);
        // const overlayHeightClass = `bg-[rgba(255,255,${nutrition.amount})]`;
        return (
          <>
            <div
              className={`
                    relative
  
                  flex flex-col gap-2 justify-center items-center
                  ring-atysa-main
                  
                  ring-1 
                  ring-inset
                  
                  w-[60px] rounded-full
                  overflow-hidden
                 
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
                className={`absolute  bottom-0 z-0 rotate-6 bg-atysa-main w-[500px]  `}
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

function MaterialsListWithMore({ list }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative w-full justify-between flex md:flex-row flex-col gap-2">
      <MaterialsList
        withIcon
        className={`${
          !isOpen ? "opacity-100" : "opacity-0"
        } relative flex justify-between flex-row gap-2 `}
        list={list.slice(0, 6)}
        itemClass="text-[0.8rem] rounded-md"
      />
      {list.length > 6 && (
        <button
          type="button"
          className="text-sm text-atysa-800 font-bold"
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
        >
          {!isOpen ? (
            <span className="flex justify-center text-atysa-800 items-center gap-2">
              بیشتر
              <ChevronLeftIcon className="w-3 h-3 fill-none stroke-atysa-800 stroke-[3px]" />
            </span>
          ) : (
            <span className="flex justify-center text-atysa-800  items-center gap-2">
              کمتر
              <ChevronRightIcon className="w-3 h-3 stroke-2 fill-none stroke-atysa-800" />
            </span>
          )}
        </button>
      )}
      {isOpen && (
        <div className="absolute md:w-10/12 w-full backdrop-blur-sm drop-shadow-md bg-white/50 z-50 p-3 rounded-lg">
          <button
            type="button"
            className="text-sm text-atysa-800 pt-2 w-full text-left md:hidden flex justify-end "
            onClick={() => {
              setIsOpen((prev) => !prev);
            }}
          >
            <ChevronLeftIcon className="w-3 h-3 fill-none stroke-gray-800 stroke-[3px]" />
          </button>
          <MaterialsList
            withIcon
            className="relative flex flex-wrap justify-between flex-row gap-y-5 gap-x-4"
            list={list}
            itemClass="text-[0.8rem] bg-transparent rounded-md "
          />
        </div>
      )}
    </div>
  );
}

function StarScore({ score }) {
  return (
    <div className="flex justify-center items-center gap-1 border-[1px] border-amber-100 rounded-md  px-[6px]">
      <StarIcon />
      <span className="text-[0.7rem] text-atysa-800 font-bold text-center pt-1">
        {score}
      </span>
    </div>
  );
}
