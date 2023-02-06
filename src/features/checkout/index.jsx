import CheckoutCard from "ui/cards/checkout";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useBasket } from "context/basketContext";
import { useState } from "react";

import { createOrder } from "api";
import moment from "jalali-moment";
import { useRouter } from "next/router";

export default function CheckoutView() {
  const {
    basketItems,
    selectedDateTimeStringFormat,
    selectedDateStringFormat,
    selectedWindowDateTime,
    clearBasket,
  } = useBasket();
  const [coupon, setCoupon] = useState({
    has_coupon: false,
    coupon_code: "",
    coupon_discount_percentage: 0,
  });
  const router = useRouter();
  const createOrderMutate = useMutation((data) => createOrder({ data }), {
    onSettled: (result) => {
      // go to zarinpal or something
      router.replace(result.redirectUrl);
      clearBasket();
    },
  });

  const total_price = basketItems?.reduce((prevValue, currItem) => {
    return currItem.product.price * currItem.quantity + prevValue;
  }, 0);

  return (
    <div className="flex w-full flex-col items-center justify-start">
      <CheckoutCard
        {...{
          basketItems,
          total_price,
          onClear: () => {
            clearBasket();
          },
          coupon,
          onCouponResult: (coupon) => {
            if (coupon.isValid)
              setCoupon({
                coupon_id: coupon.data.id,
                has_coupon: coupon.isValid,
                coupon_code: coupon.data.coupon_code,
                coupon_discount_percentage: coupon.data.discount_percentage,
              });
          },
          isLoading: createOrderMutate.isLoading,
          onClick: () => {
            const basket_items = basketItems.map(
              ({ id, quantity, product }, i) => {
                return {
                  id: Date.now().toString() + i,
                  quantity: parseInt(quantity),
                  product: product,
                };
              }
            );

            // if no datetime selected
            if (!selectedDateStringFormat) return;

            createOrderMutate.mutate({
              basket_items,
              tax: 1.09,
              has_coupon: coupon.has_coupon,
              coupon_code: coupon.coupon_code,
              coupon_id: coupon.coupon_id,
              coupon_discount_percentage: coupon.coupon_discount_percentage,
              total_price,
              deliver_datetime_string: selectedDateTimeStringFormat,
              deliver_date_string: selectedDateStringFormat,
              deliver_datetime: {
                start: moment(selectedWindowDateTime.start).toDate(),
                end: moment(selectedWindowDateTime.end).toDate(),
              },
            });
          },
        }}
      />
    </div>
  );
}
