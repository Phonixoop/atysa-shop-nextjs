import React from "react";
// React Components
import Link from "next/link";
// my ui
import MainLogo from "@/ui/logo";
import UserArea from "./userArea";

export default function Header() {
  return (
    <header className="flex justify-center items-center   w-full h-28 py-[20px] text-black">
      <nav className="w-10/12 flex gap-5 justify-between p-5 items-center   bg-white h-full rounded-2xl mx-auto">
        <UserArea />
        <Menu />
        <MainLogo href="/" />
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
