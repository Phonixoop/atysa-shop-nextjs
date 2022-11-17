import React from "react";
import MainLayout from "layouts/mainLayout";
import ProfileLayout from "layouts/profile/layout";
import { useBasket } from "context/basketContext";
import { SmallProductCard } from "ui/cards/product/mobile";
import { getProductsByIds } from "api";
import { useQuery } from "@tanstack/react-query";
export default function BasketPage() {
  const { basketItems } = useBasket();
  const finalPrice = basketItems.reduce((prevValue, currItem) => {
    return currItem.product.price * currItem.quantity + prevValue;
  }, 0);

  return (
    <ProfileLayout>
      <div
        dir="rtl"
        className="flex flex-row flex-wrap items-start justify-start gap-4 p-5 w-full h-full "
      >
        <div className="flex flex-col flex-wrap items-start justify-end gap-4 p-5  ">
          {basketItems.map((item) => {
            return (
              <>
                <SmallProductCard key={item.id} product={item.product} />
              </>
            );
          })}
        </div>
        <div className="flex flex-col bg-gray-100 p-5 rounded-xl justify-center items-center gap-5 text-black flex-grow h-full sticky top-48 text-center">
          <span> قیمت : {finalPrice}</span>
          <button className="w-3/4 bg-atysa-secondry py-2 rounded-md text-white ">
            ثبت سفارش
          </button>
        </div>
      </div>
    </ProfileLayout>
  );
}

BasketPage.PageLayout = MainLayout;
