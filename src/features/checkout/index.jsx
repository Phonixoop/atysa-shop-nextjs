import CheckoutCard from "ui/cards/checkout";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { createOrder } from "api";
import Button from "ui/buttons";
import { useBasket } from "context/basketContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { useMe } from "context/meContext";
import Modal from "ui/modals";
import LoginForm from "features/login/login-form";
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
          <BasketButton
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
          </BasketButton>
        )}
      </div>
    </div>
  );
}

function BasketButton({ onClick = () => {}, ...rest }) {
  const { data } = useMe();
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (!data)
    return (
      <>
        <Button
          {...rest}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          ثبت سفارش
        </Button>

        <Modal
          size="sm"
          center
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <div className="w-full h-full py-5">
            <LoginForm onSuccess={() => setIsModalOpen(false)} />
          </div>
        </Modal>
      </>
    );
  return (
    <Button {...rest} onClick={onClick}>
      ثبت سفارش
    </Button>
  );
}
