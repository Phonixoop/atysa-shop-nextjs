import React from "react";

import { useBasket } from "context/basketContext";
import MainLayout from "layouts/mainLayout";
import ProfileLayout from "layouts/profile/layout";

import { SmallProductCard } from "ui/cards/product/mobile";
import CheckoutCard from "ui/cards/checkout";
import CheckoutView from "features/checkout";

export default function BasketPage() {
  const { basketItems } = useBasket();
  const finalPrice = basketItems.reduce((prevValue, currItem) => {
    return currItem.product.price * currItem.quantity + prevValue;
  }, 0);

  return (
    <ProfileLayout>
      <div
        dir="rtl"
        className="relative flex flex-row flex-wrap items-start justify-center gap-4 py-5 w-full md:w-3/4 h-full "
      >
        <CheckoutView />
      </div>
    </ProfileLayout>
  );
}

BasketPage.PageLayout = MainLayout;
