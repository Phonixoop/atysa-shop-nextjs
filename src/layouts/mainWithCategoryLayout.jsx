import React, { useEffect, useState } from "react";
import Header from "@/features/layouts/header";
import Footer from "@/features/layouts/footer";
import CategoryList from "features/categoryList";
import CheckoutCard from "ui/cards/checkout";
import TakeAwayIcon from "ui/icons/take-away";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api";
import Image from "next/image";
export default function MainWithCategoryLayout({ children }) {
  const { data: categories } = useQuery(["categories"], getCategories, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <Header />
      <main className="home-container justify-center md:w-10/12 w-11/12 h-full my-10 mx-auto">
        <div
          dir="rtl"
          className="map  justify-center items-center hidden md:flex w-full"
        >
          <Image
            src={"/images/map.png"}
            objectFit="contain"
            width={300}
            height={300}
          />
        </div>
        <div
          dir="rtl"
          className="banner flex justify-start items-start  w-full "
        >
          <Banner />
        </div>
        <div dir="rtl" className="basket w-full sticky top-[11.5em]  ">
          <CheckoutCard />
        </div>
        <div dir="rtl" className="content w-full ">
          <div className="flex flex-col justify-center items-center gap-2 w-full h-full ">
            <CategoryList {...{ categories }} />
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/*     */

function Banner() {
  return (
    <div dir="rtl" className="flex w-full  ">
      <div className="relative flex justify-between items-center w-full pr-6 bg-[#529da034] rounded-3xl h-48">
        <div className="flex md:flex-row flex-col justify-center items-center flex-grow gap-10">
          <div className="flex">
            <button
              className="text-sm font-bold text-atysa-500 rounded-tr-2xl rounded-bl-2xl rounded-tl-sm rounded-br-sm border-[2px] 
        px-4 py-2
     border-atysa-200 hover:bg-atysa-500 hover:text-white hover:font-normal transition-colors"
            >
              هات باکس
            </button>
          </div>
          <div className="flex md:text-right text-center  flex-col gap-2">
            <h2 className="text-atysa-800 font-bold text-lg">
              سفارش در هر زمان
            </h2>
            <p className="text-atysa-500 text-sm font-normal">
              با دعوت دوستان می توانید تخفیف ویژه بگیرید
            </p>
          </div>
        </div>
        <div className="w-[40%] h-auto md:flex hidden ">
          <TakeAwayIcon className=" w-full h-auto " />
        </div>
      </div>
    </div>
  );
}

/*


        <div dir="rtl" className="flex  w-9/12 h-full mx-auto  m-20">
          <div className="relative flex justify-between items-center w-[80%] pr-6 bg-[#529da034] rounded-3xl h-48">
            <div className="flex justify-center items-center flex-grow gap-10">
              <div className="flex">
                <button
                  className="text-sm font-bold text-atysa-500 rounded-tr-2xl rounded-bl-2xl rounded-tl-sm rounded-br-sm border-[2px] 
                  px-4 py-2
               border-atysa-200 hover:bg-atysa-500 hover:text-white hover:font-normal transition-colors"
                >
                  هات باکس
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-atysa-700 font-bold text-lg">
                  سفارش در هر زمان
                </h2>
                <p className="text-atysa-500 text-sm font-normal">
                  با دعوت دوستان می توانید تخفیف ویژه بگیرید
                </p>
              </div>
            </div>
            <div className="w-[40%] h-auto ">
              <TakeAwayIcon className=" w-full h-auto " />
            </div>
          </div>
        </div>
        <CategoryList {...{ categories }} />*/
