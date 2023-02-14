import { useEffect, useRef, useState } from "react";
import { useBasket } from "context/basketContext";
// icons
import ClockIcon from "ui/icons/clocks";
import ClockWithFlash from "ui/icons/clocks/with-flash";
import ChevronDownIcon from "ui/icons/chervons/chevron-down";
import ChevronUpIcon from "ui/icons/chervons/chervon-up";
import EmptyBasketIcon from "ui/icons/empty-basket/";
import HelmetIcon from "ui/icons/helmet";

//featuers
import DatePickerView from "features/date-picker";

//ui
import Price from "ui/cards/product/price";
import { commify } from "ui/cards/product/price";
import withLabel from "ui/forms/with-label";
import EnglishField from "ui/forms/english-field";
import Modal from "ui/modals";
import AddProductButton from "ui/cards/product/add-product-button";
import RadioBox from "ui/forms/radiobox";
import { TrashButton } from "ui/cards/product/add-product-button";

import { AnimatePresence, motion } from "framer-motion";
import PriceWithLabel from "ui/price-with-label";
import BasketButton from "features/basket-button";
import { DAYS } from "data";

const Days = Object.values(DAYS).reverse();
import moment from "jalali-moment";
import Button from "ui/buttons";
import { trpc } from "utils/trpc";
import Toast from "ui/toast";

// const date = moment
//   .from(new Date().toDateString(), "fa")
//   .to(moment().add(1, "week"));

const EnglishFieldWithLable = withLabel(EnglishField);

export default function CheckoutCard({
  basketItems,
  total_price,
  isLoading = false,
  onCouponResult = () => {},
  onClear = () => {},
  onClick = () => {},
}) {
  const allCalories = basketItems
    .map((a) => a.product)
    .map((product) => product.calories);

  const total_calories = allCalories.reduce(
    (prev, current) => prev + current,
    0
  );
  const { currentSelectedDateTime } = useBasket({
    text: "",
  });
  const [coupon, setCoupon] = useState();

  const priceWithCoupon = coupon?.result?.isValid
    ? total_price - (total_price * (coupon.result.data.discount_percentage / 100))
    : total_price;
  return (
    <div className=" sticky top-[5.5em] z-0 flex w-full flex-col items-center justify-center gap-5 rounded-xl  px-5 text-center text-black">
      <ChooseTime />

      <div className="relative flex w-full items-center justify-start gap-2 rounded-md bg-white px-3 py-4">
        <HelmetIcon />
        <span className="text-right text-sm">هزینه ارسال رایگان</span>
      </div>
      {basketItems.length > 0 ? (
        <>
          <div className="flex w-full  flex-col items-center justify-center gap-5  rounded-lg">
            <div className="flex w-full items-center justify-between rounded-md  px-1 py-2">
              <span className="text-sm font-bold text-atysa-900">
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
              className="flex w-full  flex-col items-center justify-center gap-5 rounded-lg"
            >
              <div className="flex w-full items-center justify-between font-bold text-emerald-600">
                <span className="">مجموع کالری</span>
                <span className="w-2"></span>
                <span className="h-[1px] flex-grow border-b-[1.5px] border-dashed border-emerald-600"></span>
                <span className="w-2"></span>
                <span className=""> {commify(total_calories)}</span>
              </div>
              <PriceWithLabel price={total_price}>مجموع</PriceWithLabel>
              <PriceWithLabel price={priceWithCoupon * 0.09}>
                مالیات
              </PriceWithLabel>
              {coupon?.result?.isValid && (
                <PriceWithLabel
                  className="font-bold text-atysa-main"
                  price={priceWithCoupon.toFixed()}
                  max={total_price.toString().length + 1}
                >
                  مبلغ با {coupon.result.data.discount_percentage} درصد تخفیف
                </PriceWithLabel>
              )}

              <PriceWithLabel
                className="font-bold text-atysa-900"
                price={(priceWithCoupon * 1.09).toFixed()}
              >
                مبلغ قابل پرداخت با مالیات
              </PriceWithLabel>
              <CouponView
                coupon={coupon?.text}
                onChange={(coupon) => {
                  setCoupon(() => {
                    return {
                      text: coupon,
                    };
                  });
                }}
                onSettled={(result) => {
                  setCoupon((prev) => {
                    return {
                      text: prev.text,
                      result,
                    };
                  });
                  onCouponResult(result);
                }}
              />
            </motion.div>
          </div>
        </>
      ) : (
        <div className="my-20 flex w-full flex-col items-center justify-center gap-5">
          <EmptyBasketIcon />
          <span className="text-sm font-bold text-gray-400 ">
            سبد خرید شما خالی است!
          </span>
        </div>
      )}
      {basketItems.length > 0 && (
        <div className="sticky bottom-0 z-50 w-full  bg-gradient-to-t  pb-10 backdrop-blur-sm ">
          <BasketButton
            disabled={
              isLoading ||
              !(
                currentSelectedDateTime.day.dayName &&
                currentSelectedDateTime.time.period.value
              )
            }
            isLoading={isLoading}
            className="bg-atysa-main text-white"
            onClick={() => {
              onClick();
            }}
          >
            ثبت سفارش
          </BasketButton>
        </div>
      )}
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
      className="flex w-full flex-col items-center justify-start  rounded-md border-b-2 py-2"
    >
      <span className="w-full text-right">{item.product.name}</span>
      <div className="flex w-full items-center justify-between ">
        <Price className="text-atysa-main" price={item.product.price} />
        <AddProductButton id={item.id} product={item.product} />
      </div>
    </motion.div>
  );
}

function ChooseTime({ onChange = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const { basketItems, selectedDateTimeRadioBox, currentSelectedDateTime } =
    useBasket();
  return (
    <div className="relative  z-10 flex w-full items-center justify-center gap-1 rounded-md bg-white px-3 py-4">
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className={`flex w-full items-center justify-between ${
          !isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="justify-right flex  h-full flex-1 items-center gap-2">
          {basketItems.length <= 0 || selectedDateTimeRadioBox.id === 0 ? (
            <ClockWithFlash />
          ) : selectedDateTimeRadioBox.id === 1 ? (
            <ClockIcon />
          ) : (
            ""
          )}

          <div className="flex min-h-[1.7rem] items-center justify-center gap-2 overflow-hidden text-right text-sm">
            {basketItems.length <= 0 ? (
              <>
                <span> دریافت در سریع ترین زمان ممکن</span>
              </>
            ) : selectedDateTimeRadioBox.id === 0 ? (
              <>
                <span>زمان دریافت</span>
                {basketItems.length > 0 && (
                  <SelectedDateTimeStringFormat
                    className="flex w-fit justify-start gap-1 rounded-lg bg-atysa-primary p-1 font-bold text-atysa-main"
                    date={currentSelectedDateTime}
                  />
                )}
              </>
            ) : (
              <>
                <span>زمان دریافت</span>

                {basketItems.length > 0 && (
                  <SelectedDateTimeStringFormat
                    className="flex w-fit justify-start gap-1 rounded-lg bg-atysa-primary p-1 font-bold text-atysa-main"
                    date={currentSelectedDateTime}
                  />
                )}
              </>
            )}
          </div>
        </div>

        <ChevronDownIcon className="h-4 w-4 " strokeColor="stroke-atysa-800" />
      </button>
      {isOpen && (
        <div className="absolute top-0 flex min-h-fit w-full flex-col items-center justify-start  rounded-md bg-white/60 px-3 py-4 drop-shadow-2xl backdrop-blur-sm ">
          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="flex w-full items-center justify-between"
          >
            <div className="justify-right flex  h-[1.7rem] flex-1 items-center gap-2">
              <ClockIcon />
              <span>زمان دریافت</span>
              {basketItems.length > 0 && (
                <SelectedDateTimeStringFormat
                  className="flex w-fit justify-start gap-1 rounded-lg bg-atysa-primary bg-transparent p-1 font-bold text-atysa-main"
                  date={currentSelectedDateTime}
                />
              )}
            </div>

            <ChevronUpIcon className="h-4 w-4 fill-none stroke-atysa-main stroke-[3]" />
          </button>
          <DatePickerButton onChange={onChange} />
        </div>
      )}
    </div>
  );
}
function DatePickerButton({ onChange = () => {} }) {
  const {
    setToFastestDateTime,
    selectedDateTimeRadioBox,
    setSelectedDateTimeRadioBox,
    currentSelectedDateTime,
    selectedDateTimeStringFormat,
  } = useBasket();
  const [modal, setModal] = useState({ isOpen: false });

  return (
    <>
      <div className="flex w-full flex-col items-center justify-start gap-4 pt-5">
        <div className="flex w-full justify-between gap-2">
          <RadioBox
            checked={selectedDateTimeRadioBox.id === 0}
            onClick={() => {
              setSelectedDateTimeRadioBox({ id: 0 });
              setToFastestDateTime();
            }}
          >
            سریع ترین زمان ممکن
          </RadioBox>
          <ClockWithFlash />
        </div>
        <div className="h-[1px] w-full bg-gray-300" />
        <div className="justify-startitems-center flex w-full">
          <RadioBox
            checked={selectedDateTimeRadioBox.id === 1}
            onClick={() => {
              setSelectedDateTimeRadioBox({ id: 1 });
              setModal({ isOpen: true });
            }}
          >
            زمان دیگر
          </RadioBox>
        </div>
      </div>
      <Modal
        center
        size="sm"
        title={
          currentSelectedDateTime.day.dayName &&
          currentSelectedDateTime.time.period.value ? (
            <>
              <div className="flex w-full items-center justify-center">
                <SelectedDateTimeStringFormat date={currentSelectedDateTime} />
              </div>
            </>
          ) : (
            "انتخاب زمان ارسال"
          )
        }
        isOpen={modal.isOpen}
        onClose={() => {
          if (
            currentSelectedDateTime.day.dayName &&
            currentSelectedDateTime.time.period.value
          )
            setSelectedDateTimeRadioBox({ id: 1 });
          else {
            setSelectedDateTimeRadioBox({ id: 0 });
          }

          setModal({ isOpen: false });
        }}
      >
        <div className="flex items-center justify-center pb-24 md:py-2">
          <DatePickerView onSubmit={() => setModal({ isOpen: false })} />
        </div>
      </Modal>
    </>
  );
}

function SelectedDateTimeStringFormat({
  className = "w-full flex gap-1 justify-center items-center font-bold text-atysa-main px-1",
  date = undefined,
}) {
  if (!date) return "";
  return (
    <>
      {date.day.dayName && date.time.period.value && (
        <div dir="rtl" className={className}>
          <span>
            {date.day.dayName} {date.day.date}
          </span>
          <span className="font-bold">
            {date.time.period.value.split("-")[0]}
          </span>

          <span className="font-bold"> تا </span>
          <span className="font-bold">
            {date.time.period.value.split("-")[1]}
          </span>
        </div>
      )}
    </>
  );
}

function CouponView({ coupon, onChange = () => {}, onSettled = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const checkCouponMutate = trpc.coupon.checkCoupon.useMutation({
    onSettled: (result) => {
      onSettled(result);
      setIsOpen(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    },
  });
  return (
    <>
      <div className="flex w-full items-end justify-between gap-5">
        <div className=" w-full ">
          <EnglishFieldWithLable
            upperCase
            bg="bg-transparent"
            label={"کد تخفیف"}
            value={coupon}
            onChange={(val) => onChange(val)}
          />
        </div>

        <div className="min-w-[5rem]">
          <Button
            disabled={checkCouponMutate.isLoading || !!!coupon}
            isLoading={checkCouponMutate.isLoading}
            onClick={() => {
              checkCouponMutate.mutate({
                name: coupon,
              });
            }}
            className="bg-atysa-800 pt-2 font-thin text-white"
          >
            برسی
          </Button>
        </div>
      </div>

      <Toast
        className={`py-5 ${
          checkCouponMutate.data?.isValid
            ? "bg-emerald-500/30"
            : "bg-red-500/30"
        }`}
        isOpen={isOpen}
      >
        {checkCouponMutate.isSuccess && checkCouponMutate.data?.message}
      </Toast>
    </>
  );
}
