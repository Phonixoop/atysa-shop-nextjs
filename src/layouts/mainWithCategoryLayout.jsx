import React, { useEffect, useState } from "react";
import Header from "@/features/layouts/header";
import Footer from "@/features/layouts/footer";
import CategoryList from "features/categoryList";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api";
import TakeAwayIcon from "ui/icons/take-away";
export default function MainWithCategoryLayout({ children }) {
  const { data: categories } = useQuery(["categories"], getCategories, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  return (
    <>
      <Header>
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
        <CategoryList {...{ categories }} />
      </Header>
      <main className="flex flex-grow w-full h-full">{children}</main>
      <Footer />
    </>
  );
}
