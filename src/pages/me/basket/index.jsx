import React from "react";

import { useBasket } from "context/basketContext";
import MainLayout from "layouts/mainLayout";
import ProfileLayout from "layouts/profile/layout";

import { SmallProductCard } from "ui/cards/product/mobile";
import CheckoutCard from "ui/cards/checkout";

export default function BasketPage() {
  const { basketItems } = useBasket();
  const finalPrice = basketItems.reduce((prevValue, currItem) => {
    return currItem.product.price * currItem.quantity + prevValue;
  }, 0);

  return (
    <ProfileLayout>
      <div
        dir="rtl"
        className="relative flex flex-row flex-wrap items-start justify-center gap-4 py-5  w-full h-full "
      >
        {/* <div className="flex flex-col  flex-wrap items-start justify-end gap-4 p-5  ">
          {basketItems.map((item) => {
            return (
              <>
                <SmallProductCard key={item.id} product={item.product} />
              </>
            );
          })}
        </div> */}
        <div className="sticky w-full top-[11.5rem] ">
          <CheckoutCard />
        </div>
      </div>
    </ProfileLayout>
  );
}

BasketPage.PageLayout = MainLayout;
