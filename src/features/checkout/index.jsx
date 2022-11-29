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
import AddressForm from "features/address-form";
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
  const { data: user, loading } = useMe();
  const [modal, setModal] = useState({
    isOpen: false,
    type: {
      name: "",
      title: "",
    },
  });

  const hasAddress = user?.addresses.length > 0;
  const activeAddress = user?.addresses.filter((a) => a.isActive === true)[0];
  const shouldOpenAddressModal = !hasAddress || !!activeAddress;

  return (
    <>
      <Button
        {...rest}
        onClick={() => {
          if (!user)
            return setModal({
              isOpen: true,
              type: {
                name: "login",
                title: "ورود/عضویت",
              },
            });
          if (!activeAddress)
            return setModal({
              isOpen: true,
              type: {
                name: "address",
                title: hasAddress ? "انتخاب آدرس" : "افزودن آدرس",
              },
            });

          return onClick();
        }}
      >
        ثبت سفارش
      </Button>

      <Modal
        size="sm"
        center
        isOpen={modal.isOpen}
        title={modal?.type?.title}
        onClose={() => setModal({ isOpen: false })}
      >
        {modal?.type?.name === "login" ? (
          <div className="w-full h-full py-5">
            <LoginForm onSuccess={() => setModal(false)} />
          </div>
        ) : modal?.type?.name === "address" ? (
          <div className="p-5 w-full overflow-y-scroll">
            <AddressForm
              onSettled={() => {
                setModal({ isOpen: false });
              }}
            />
          </div>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
}
