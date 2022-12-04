import CheckoutCard from "ui/cards/checkout";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import Button from "ui/buttons";
import { useBasket } from "context/basketContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { useMe } from "context/meContext";
import Modal from "ui/modals";
import LoginForm from "features/login/login-form";
import AddressForm from "features/address-form";
import { useSession } from "next-auth/react";
import BasketButton from "features/basket-button";

import { createOrder } from "api";
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

            createOrderMutate.mutate({
              basket_items,
              tax: 1.09,
              has_coupon: false,
              total_price,
            });
          },
        }}
      />
    </div>
  );
}
