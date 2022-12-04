import { useEffect, useRef, useState } from "react";

// icons
import ClockIcon from "ui/icons/clocks";
import ClockWithFlash from "ui/icons/clocks/with-flash";
import ChevronDownIcon from "ui/icons/chervons/chevron-down";
import ChevronUpIcon from "ui/icons/chervons/chervon-up";
import EmptyBasketIcon from "ui/icons/empty-basket/";
import HelmetIcon from "ui/icons/helmet";

//ui

import Price from "ui/cards/product/price";
import withLabel from "ui/forms/with-label";
import EnglishField from "ui/forms/english-field";

import AddProductButton from "ui/cards/product/add-product-button";
import { TrashButton } from "ui/cards/product/add-product-button";

import { motion } from "framer-motion";
import PriceWithLabel from "ui/price-with-label";
import BasketButton from "features/basket-button";
import { useMutation } from "@tanstack/react-query";

const EnglishFieldWithLable = withLabel(EnglishField);

export default function CheckoutCard({
  basketItems,
  total_price,
  coupon,
  isLoading = false,
  onCoupon = () => {},
  onClear = () => {},
  onClick = () => {},
}) {
  return (
    <div className=" flex flex-col z-0 px-5 rounded-xl justify-center items-center gap-5 text-black w-full  text-center sticky top-[5.5em]">
      <ChooseTime />

      <div className="flex relative justify-start items-center gap-2 w-full bg-white px-3 py-4 rounded-md">
        <HelmetIcon />
        <span className="text-sm text-right">هزینه ارسال رایگان</span>
      </div>
      {basketItems.length > 0 ? (
        <>
          <div className="flex flex-col  justify-center items-center w-full gap-5  p-2 rounded-lg">
            <div className="flex w-full justify-between items-center px-1  rounded-md py-2">
              <span className="text-sm font-bold">
                سبد خرید ({basketItems.length})
              </span>
              <span>
                <TrashButton
                  className="bg-atysa-100"
                  onClick={() => onClear()}
                />
              </span>
            </div>
            <BasketItemList list={basketItems} />

            <motion.div
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", delay: 0 }}
              className="flex flex-col  justify-center items-center w-full gap-5  p-2 rounded-lg"
            >
              <PriceWithLabel price={total_price}>مجموع</PriceWithLabel>
              <PriceWithLabel
                price={total_price * 0.09}
                max={total_price.toString().length + 1}
              >
                مالیات
              </PriceWithLabel>
              <PriceWithLabel
                className="text-atysa-900 font-bold"
                price={total_price * 1.09}
                max={total_price.toString().length + 1}
              >
                مبلغ قابل پرداخت
              </PriceWithLabel>
              <div className="w-full">
                <EnglishFieldWithLable
                  upperCase
                  bg="bg-transparent"
                  label={"کد تخفیف"}
                  value={coupon}
                  onChange={(val) => onCoupon(val)}
                />
              </div>
            </motion.div>
          </div>
        </>
      ) : (
        <div className="my-20 flex flex-col w-full justify-center items-center gap-5">
          <EmptyBasketIcon />
          <span className="font-bold text-sm text-gray-400 ">
            سبد خرید شما خالی است!
          </span>
        </div>
      )}

      <div className="sticky bottom-0 w-11/12  pb-10  bg-gradient-to-t backdrop-blur-sm ">
        {basketItems.length > 0 && (
          <BasketButton
            disabled={isLoading}
            isLoading={isLoading}
            className="bg-atysa-secondry z-0 "
            onClick={() => {
              onClick();
            }}
          >
            ثبت سفارش
          </BasketButton>
        )}
      </div>
    </div>
  );
}

function BasketItemList({ list = [] }) {
  return list.map((item) => {
    return <BasketItem key={item.id} item={item} />;
  });
}

function BasketItem({ item }) {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", delay: 0 }}
      className="flex flex-col justify-start items-center w-full  py-2 border-b-2  p-2 rounded-md"
    >
      <span className="w-full text-right">{item.product.name}</span>
      <div className="flex justify-between items-center w-full ">
        <Price price={item.product.price} />
        <AddProductButton id={item.id} product={item.product} />
      </div>
    </motion.div>
  );
}

function ChooseTime() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex relative justify-center items-center z-10 gap-1 w-full bg-white px-3 py-4 rounded-md ">
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className={`flex w-full justify-between items-center ${
          !isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-1 gap-2">
          <ClockWithFlash />
          <span className="text-sm text-right">
            دریافت در سریع ترین زمان ممکن
          </span>
        </div>

        <ChevronDownIcon />
      </button>
      {isOpen && (
        <div className="absolute inset-0  h-36 flex justify-center items-start  px-3 py-4 bg-white bg-opacity-50 backdrop-blur-sm drop-shadow-2xl rounded-md ">
          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="flex w-full justify-between items-center"
          >
            <div className="flex flex-1 gap-2">
              <ClockIcon />
              <span className="text-sm text-right">زمان دریافت سفارش</span>
            </div>

            <ChevronUpIcon />
          </button>
        </div>
      )}
    </div>
  );
}

function withDropDown(Component) {
  return function WrappedComponnet({
    outsideRef,
    onFocusChanged = () => {},
    ...rest
  }) {
    const _ref = useRef(undefined);
    useEffect(() => {
      const handleClickOutside = (event) => {
        onFocusChanged();
      };
      document.addEventListener("click", handleClickOutside, true);
      return () => {
        document.removeEventListener("click", handleClickOutside, true);
      };
    }, [onFocusChanged]);
    return (
      <div className="w-full" ref={_ref}>
        <Component {...rest} />
      </div>
    );
  };
}
