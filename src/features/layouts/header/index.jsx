import React from "react";
// React Components
import Link from "next/link";
// my ui
import MainLogo from "@/ui/logo";
import UserArea from "./userArea";

export default function Header() {
  return (
    <header className="flex justify-center items-center  bg-white w-full h-24 mb-5 text-black">
      <nav className="w-10/12 flex gap-5 justify-between p-5 items-center   h-full rounded-2xl mx-auto">
        <UserArea />
        <div className="flex justify-center flex-grow">
          <input
            className="w-80 h-10 transition-all duration-100 rounded-xl outline-none bg-[#EBEDF0] text-right p-5 focus:bg-white focus:shadow-md focus:border-2 border-white"
            type="text"
            placeholder="جستجو"
          />
        </div>
        <div className="md:flex items-center hidden  justify-end gap-10 w-fit">
          <div className="flex flex-col justify-end text-right">
            <span>خانه</span>
            <span className="text-[10px]">جردن، خیابان سلطانی، پلاک 32</span>
          </div>
          <MainLogo href="/" />
        </div>
      </nav>
    </header>
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
