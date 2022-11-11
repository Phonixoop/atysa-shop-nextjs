import { useState } from "react";
import { Fragment } from "react";
import { useBasket } from "context/basketContext";
//next
import Image from "next/image";
import Link from "next/link";

//icons
import BookmarkIcon from "@/ui/icons/bookmark";
import { MinusIcon } from "@heroicons/react/24/outline";
import TrashIcon from "@/ui/icons/trash";
import { PlusIcon } from "@heroicons/react/24/outline";
import { FireIcon } from "@heroicons/react/24/outline";

import CartButton from "@/ui/buttons/cartButton";

import CircleButton from "@/ui/buttons/circle";
import useWindowSize from "@/hooks/useWindowSize";

import ProductImage from "@/ui/product-image";

const BREAK_POINT = 700;

export default function ProductCard({ product, onClick = () => {}, ...rest }) {
  const windowSize = useWindowSize();
  const { id, name, price, calory } = product;

  if (windowSize.width <= BREAK_POINT)
    return (
      <>
        <div
          onClick={onClick}
          dir="rtl"
          className={`
        group
        product
        relative w-full  md:w-64  flex md:flex-col justify-center items-center gap-5 bg-white
         dark:bg-black
         rounded-tr-lg
         rounded-tl-lg
         rounded-bl-md
         rounded-br-md
         drop-shadow-md
         overflow-hidden
          md:hover:shadow-lg cursor-pointer
          transition-shadow duration-300
          select-none`}
        >
          {/* Col right */}
          <div className="flex flex-col items-center justify-center">
            <Link
              href={`/?product_slug=${product.slug}`}
              as={`/${product.slug}`}
              shallow={true}
            >
              <div className="relative flex overflow-hidden justify-center items-stretch rounded-bl-lg w-[150px] h-[100px] leading-[0px]">
                <ProductImage src={product.defaultImage} alt={name} />
                <span className="absolute top-2 right-2">
                  <BookmarkIcon className="w-6 h-6 stroke-[#000000ac] fill-[#000000ac] " />
                </span>
              </div>
            </Link>

            {/*add button */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between md:border-t-[1px] border-t-gray-300 p-2">
              <AddProductButton {...{ id }} />
            </div>
            {/*end add  button */}
          </div>

          {/* Col left */}
          <div className="flex flex-col items-center justify-center w-full text-center gap-5">
            {/* titles */}
            <div className="flex flex-col items-center justify-center w-full  ">
              <h3 className="w-full text-center">{name}</h3>

              <CategoryNameList categories={product?.categories} />
            </div>
            {/* titles end */}

            {/* Tags and calory */}
            <div className="flex flex-col items-center w-[150px] overflow-hidden justify-between  gap-3">
              {/* tags */}
              <div className="flex flex-row gap-2 ">
                <Tag>کشمش</Tag>
                <Tag>نمک</Tag>
                <Tag>گوشت</Tag>
              </div>
              {/* tags end */}

              <div className="hidden md:flex flex-row-reverse md:flex-row gap-2 md:justify-start justify-end items-center text-sm ">
                <h4> کالری {calory}</h4>
                <FireIcon className="w-4 h-4" />
              </div>
            </div>
            {/*End Tags and calory */}

            <Price {...{ price }} />
          </div>
        </div>
      </>
    );

  // if we are on desktop render out below design
  if (windowSize.width > BREAK_POINT)
    return (
      <>
        <div
          dir="rtl"
          className={`

        group 
        product
        relative md:w-64 flex md:flex-col justify-center  items-center gap-1 bg-white
        dark:bg-black 
        rounded-tr-lg 
        rounded-tl-lg
        rounded-bl-md
        rounded-br-md
        drop-shadow-md 
        overflow-hidden
          md:hover:shadow-lg cursor-pointer
          transition-shadow duration-300
          select-none`}
        >
          <Link
            href={`/?product_slug=${product.slug}`}
            as={`/${product.slug}`}
            shallow={true}
          >
            <div className="relative flex  justify-center items-stretch h-[200px] leading-[0px]">
              <ProductImage src={product.defaultImage} alt={name} />
              <span className="absolute top-2 right-2">
                <BookmarkIcon className="w-6 h-6 stroke-black fill-black " />
              </span>
            </div>
          </Link>
          <div className="w-full text-right px-3">
            {/* titles */}

            <div className="py-3">
              <h3 className="w-full text-right">{name}</h3>

              <CategoryNameList categories={product?.categories} />
            </div>
            {/* titles end */}

            <div className="flex flex-col md:flex-row justify-between mb-5 gap-3">
              {/* tags */}
              <div className="flex flex-row w-full md:w-1/2 gap-2">
                <Tag>سالاد ها</Tag>
                <Tag>رژیمی</Tag>
              </div>
              {/* tags end */}

              <div className="flex flex-row-reverse md:flex-row gap-2 md:justify-start justify-end items-center text-sm ">
                <h4> کالری {calory}</h4>
                <FireIcon className="w-4 h-4" />
              </div>
            </div>

            {/* price and button */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between border-t-[1px] border-t-gray-300 py-4">
              <AddProductButton {...{ id }} />
              <Price {...{ price }} />
            </div>
            {/*end price and button */}
          </div>
        </div>
      </>
    );
}

export function PlusButton({ children, ...rest }) {
  return (
    <CircleButton
      {...rest}
      className="relative bg-atysa-secondry rounded-full  p-2 "
    >
      <PlusIcon className=" stroke-white w-3 h-3 stroke-[2.8px]" />
    </CircleButton>
  );
}

export function MinusButton({ children, ...rest }) {
  return (
    <CircleButton
      {...rest}
      className="relative bg-atysa-secondry rounded-full  p-2 "
    >
      <MinusIcon className=" stroke-white w-3 h-3 stroke-[2.8px]" />
    </CircleButton>
  );
}

export function TrashButton({ children, ...rest }) {
  return (
    <CircleButton
      {...rest}
      className="relative flex justify-center items-center bg-transparent rounded-full hover:bg-transparent p-2 group "
    >
      <TrashIcon className="stroke-atysa-secondry w-3 h-3 stroke-[1.8px] group-focus:stroke-black hover:stroke-black" />
    </CircleButton>
  );
}

export function AddProductButton({ id = "" }) {
  const {
    increaseBasketQuantity,
    decreaseBasketQuantity,
    removeFromBasket,
    getItemQuantity,
  } = useBasket();
  const quantity = getItemQuantity(id);
  return (
    <>
      {quantity > 0 ? (
        <div className="flex items-center justify-between rounded-full px-[3px] py-[2px] min-w[6rem] md:w-[100px] w-[120px] h-9 bg-atysa-50 ">
          <PlusButton onClick={() => increaseBasketQuantity(id)} />
          <span className="text-atysa-800 font-bold">{quantity}</span>
          {quantity <= 1 ? (
            <TrashButton onClick={() => removeFromBasket(id)} />
          ) : (
            <MinusButton onClick={() => decreaseBasketQuantity(id)} />
          )}
        </div>
      ) : (
        <CartButton onClick={() => increaseBasketQuantity(id)}>
          افزودن
        </CartButton>
      )}
    </>
  );
}

export function Price({ price }) {
  return <h4 className="text-sm text-atysa-800">{commify(price)} تومان</h4>;
}

export function Tag({ children }) {
  return (
    <span className="text-center leading-[15px] text-white bg-green-700 rounded-full px-[5px] py-[1px] text-[0.7rem]">
      {children}
    </span>
  );
}

export function CategoryNameList({ categories = [] }) {
  return (
    <>
      <div className="flex gap-2">
        {categories.map((category) => {
          return (
            <h4 className="text-sm font-bold text-green-700">
              {category.name}
            </h4>
          );
        })}
      </div>
    </>
  );
}

function commify(x) {
  if (!x) return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function createMarkup(content) {
  return { __html: content };
}
