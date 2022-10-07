import React, { useState } from "react";
// React Components
import Link from "next/link";
// my ui
import MainLogo from "@/ui/logo";
import UserArea from "./userArea";
import TextField from "ui/froms/text-field";
import SearchIcon from "ui/icons/searchs";
export default function Header({ children }) {
  const [searchText, setSearchText] = useState("");
  return (
    <div className="sticky top-0 z-50  ">
      <header className="flex justify-center items-center  bg-white w-full h-20 z-50  text-black ">
        <nav className="md:w-10/12 w-full flex md:gap-5  justify-between p-5 items-center   h-full rounded-2xl mx-auto">
          <UserArea />
          <div className="flex justify-center items-center gap-2 p-7 md:flex-grow">
            <input
              className="w-[300px] hidden md:block h-10 transition-all duration-100 p-3 rounded-xl outline-none bg-[#EBEDF0] text-right  focus:bg-white focus:drop-shadow-md focus:border-2 border-white"
              placeholder="جستجو"
            />
            <SearchIcon />
          </div>
          <div className="md:flex items-center justify-end gap-10 w-fit flex-grow md:flex-grow-0">
            <div className="flex flex-col justify-end text-right">
              <span>خانه</span>
              <span className="text-[10px]">جردن، خیابان سلطانی، پلاک 32</span>
            </div>
            <MainLogo
              className="w-16 h-16 object-fill hidden md:flex justify-content items-center"
              href="/"
            />
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
}

function Menu() {
  return (
    <div className="md:flex hidden flex-grow justify-end  w-fit">
      <div className="relative flex gap-2 w-fit py-2 px-2 rounded-2xl  bg-atysa-primary">
        <Link href="/category/diet">
          <a className="bg-white p-2 px-4 rounded-xl">دسته بندی</a>
        </Link>
        <Link href="">
          <a className="bg-white p-2 px-4 rounded-xl">پنل کاربری</a>
        </Link>
        <Link href="/me/orders">
          <a className="bg-white p-2 px-4 rounded-xl">سفارش های من</a>
        </Link>
      </div>
    </div>
  );
}
