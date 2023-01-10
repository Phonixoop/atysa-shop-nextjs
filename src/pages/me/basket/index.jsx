import React from "react";

import { useBasket } from "context/basketContext";
import MainLayout from "layouts/mainLayout";
import ProfileLayout from "layouts/profile/layout";

import { SmallProductCard } from "ui/cards/product/mobile";
import CheckoutCard from "ui/cards/checkout";
import CheckoutView from "features/checkout";
import Image from "next/image";

export default function BasketPage() {
  const { basketItems } = useBasket();
  const finalPrice = basketItems.reduce((prevValue, currItem) => {
    return currItem.product.price * currItem.quantity + prevValue;
  }, 0);

  return (
    <ProfileLayout>
      <div
        dir="rtl"
        className="relative flex items-center justify-between gap-4 py-5 w-full bg-gray-50 rounded-2xl h-full "
      >
        <div className="flex w-full md:flex-row flex-col justify-between">
          <CheckoutView />
          <div className="w-full hidden md:flex justify-center items-center">
            <Image
              className="hidden md:flex px-10"
              src={"/images/illustrations/basket.png"}
              objectFit="contain"
              width={400}
              height={400}
            />
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
}

BasketPage.PageLayout = MainLayout;
