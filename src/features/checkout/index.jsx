import CheckoutCard from "ui/cards/checkout";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { createOrder } from "api";
import Button from "ui/buttons";
import { useBasket } from "context/basketContext";
import { useState } from "react";
import { motion } from "framer-motion";
export default function CheckoutView() {
  const { basketItems, basketQuantity, clearBasket } = useBasket();
  const [coupon, setCoupon] = useState("");

  const createOrderMutate = useMutation((data) => createOrder(data), {
    onSettled: () => {
      // go to zarinpal or something
      clearBasket();
    },
  });

  const total_price = basketItems.reduce((prevValue, currItem) => {
    return currItem.product.price * currItem.quantity + prevValue;
  }, 0);

  return (
    <div className="flex flex-col justify-center items-center w-full sticky top-[11.5em] ">
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
        }}
      />
      <div className="sticky bottom-0 w-11/12  pb-10  bg-gradient-to-t backdrop-blur-sm ">
        {basketItems.length > 0 && (
          <Button
            className="bg-atysa-secondry z-0 "
            onClick={() => {
              const basket_items = basketItems.map(
                ({ id, quantity, product }, i) => {
                  return {
                    id: Date.now().toString() + i,
                    quantity: parseInt(quantity),
                    product: product,
                  };
                }
              );

              createOrderMutate.mutate({
                basket_items,
                tax: 1.09,
                has_coupon: false,
                total_price,
              });
            }}
          >
            ثبت سفارش
          </Button>
        )}
      </div>
    </div>
  );
}
