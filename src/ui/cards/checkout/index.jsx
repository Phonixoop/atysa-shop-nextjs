import { useEffect, useRef, useState } from "react";
import { useBasket } from "context/basketContext";
// icons
import ClockIcon from "ui/icons/clocks";
import ClockWithFlash from "ui/icons/clocks/with-flash";
import ChevronDownIcon from "ui/icons/chervons/chevron-down";
import ChevronUpIcon from "ui/icons/chervons/chervon-up";
import EmptyBasketIcon from "ui/icons/empty-basket/";
//ui
import Button from "ui/buttons";
import Price from "ui/cards/product/price";
import withLabel from "ui/forms/with-label";
import EnglishField from "ui/forms/english-field";

const EnglishFieldWithLable = withLabel(EnglishField);

import AddProductButton from "ui/cards/product/add-product-button";
import { TrashButton } from "ui/cards/product/add-product-button";
export default function CheckoutCard() {
  const { basketItems, clearBasket } = useBasket();
  const [coupon, setCoupon] = useState("");

  const finalPrice = basketItems.reduce((prevValue, currItem) => {
    return currItem.product.price * currItem.quantity + prevValue;
  }, 0);
  return (
    <div className="relative  flex flex-col z-0 px-5 rounded-xl justify-center items-center gap-5 text-black flex-grow h-full  text-center">
      {basketItems.length > 0 ? (
        <>
          <ChooseTime />
          <div className="flex flex-col  justify-center items-center w-full gap-5  p-2 rounded-lg">
            <div className="flex w-full justify-between items-center px-1  rounded-md py-2">
              <span className="text-sm font-bold">
                سبد خرید ({basketItems.length})
              </span>
              <span>
                <TrashButton
                  className="bg-atysa-100"
                  onClick={() => clearBasket()}
                />
              </span>
            </div>
            <BasketItemList list={basketItems} />

            <PriceWithLabel price={finalPrice}>مجموع</PriceWithLabel>
            <PriceWithLabel
              price={finalPrice * 0.09}
              max={finalPrice.toString().length + 1}
            >
              مالیات
            </PriceWithLabel>
            <PriceWithLabel
              className="text-atysa-900 font-bold"
              price={finalPrice * 1.09}
              max={finalPrice.toString().length + 1}
            >
              مبلغ قابل پرداخت
            </PriceWithLabel>
            <div className="w-full">
              <EnglishFieldWithLable
                upperCase
                bg="bg-transparent"
                label={"کد تخفیف"}
                value={coupon}
                onChange={(val) => setCoupon(val)}
              />
            </div>

            <div className="sticky -top-[1000px] w-full">
              <Button className="bg-atysa-secondry z-0 ">ثبت سفارش</Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <EmptyBasketIcon />
          <span className="font-bold text-sm text-gray-400">
            سبد خرید شما خالی است!
          </span>
        </>
      )}
    </div>
  );
}

function PriceWithLabel({
  children,
  className = "text-atysa-900",
  price = 0,
  max,
}) {
  return (
    <div className="flex w-full justify-between px-3">
      <span className={className}>{children}</span>
      <span>
        <Price {...{ price, max }} />
      </span>
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
    <div className="flex flex-col justify-start items-center w-full border-b-2 py-2">
      <span className="w-full text-right">{item.product.name}</span>
      <div className="flex justify-between items-center w-full ">
        <Price price={item.product.price} />
        <AddProductButton id={item.id} product={item.product} />
      </div>
    </div>
  );
}

function ChooseTime() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex relative justify-center items-center z-10 gap-1 w-full bg-white px-3 py-3 rounded-md ">
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className={`flex w-full justify-between items-center ${
          !isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-1 gap-2">
          <ClockWithFlash />
          <span className="text-sm">دریافت در سریع ترین زمان ممکن</span>
        </div>

        <ChevronDownIcon />
      </button>
      {isOpen && (
        <div className="absolute inset-0  h-36 flex justify-center items-start  px-3 py-3 bg-white bg-opacity-50 backdrop-blur-sm drop-shadow-2xl rounded-md ">
          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="flex w-full justify-between items-center"
          >
            <div className="flex flex-1 gap-2">
              <ClockIcon />
              <span className="text-sm">زمان دریافت سفارش</span>
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
