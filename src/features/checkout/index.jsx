import CheckoutCard from "ui/cards/checkout";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useBasket } from "context/basketContext";
import { useState } from "react";

import { createOrder } from "api";
import moment from "jalali-moment";

export default function CheckoutView() {
  const {
    basketItems,
    selectedDateTimeStringFormat,
    selectedDateStringFormat,
    selectedWindowDateTime,
    clearBasket,
  } = useBasket();
  const [coupon, setCoupon] = useState("");

  const createOrderMutate = useMutation((data) => createOrder({ data }), {
    onSettled: () => {
      // go to zarinpal or something
      clearBasket();
    },
  });

  const total_price = basketItems?.reduce((prevValue, currItem) => {
    return currItem.product.price * currItem.quantity + prevValue;
  }, 0);

  return (
    <div className="flex flex-col justify-start items-center w-full   ">
      <CheckoutCard
        {...{
          basketItems,
          total_price,
          onClear: () => {
            clearBasket();
          },
          coupon,
          onCoupon: (value) => {
            setCoupon(value);
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
              has_coupon: false,
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
