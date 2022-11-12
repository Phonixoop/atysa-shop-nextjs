import React, { useState } from "react";
// React Components
import Link from "next/link";
// my ui
import MainLogo from "@/ui/logo";
import UserArea from "./userArea";
import TextField from "@/ui/forms/text-field";
import SearchIcon from "@/ui/icons/searchs";
import { useSession } from "next-auth/react";
const BREAK_POINT = 900;
export default function Header({ children }) {
  const [searchText, setSearchText] = useState("");

  return (
    <>
      <header
        className={`flex sticky md:bg-[#ffffff94] drop-shadow-sm top-0 justify-center p-3 mb-5 items-center w-full h-auto z-50 text-black backdrop-blur-lg `}
      >
        <nav
          className={`md:w-10/12 w-full flex flex-row gap-5  justify-between  items-center  h-auto rounded-2xl mx-auto`}
        >
          {/* Header on desktop */}
          <div className="hidden w-full desktopMin:flex  justify-between items-stretch">
            <UserArea />
            <div className="flex justify-center items-center">
              <SearchBox />
            </div>

            <Address />
          </div>

          {/* Header on Laptop and tablet and mobile */}
          <div className="hidden w-full laptopMax:flex flex-col gap-5">
            <div className="flex flex-row justify-between w-full ">
              <UserArea />
              <Address />
            </div>
            <div className="flex flex-grow justify-center items-center">
              <SearchBox />
            </div>
          </div>
        </nav>
      </header>
      {children}
    </>
  );
}

export function SearchBox() {
  return (
    <div className="flex w-full md:w-[400px] rounded-xl bg-gray-200">
      <div className="flex w-full gap-3 justify-end items-center  px-4 py-3 caret-atysa-secondry  rounded-2xl md:flex-grow ">
        <input
          className="w-full outline-none bg-transparent text-right placeholder-gray-400"
          placeholder="جستجو 11 محصول"
        />
        <span className="w-[1px] h-4 bg-gray-400"></span>
        <SearchIcon className="w-4 h-4 fill-gray-400" />
      </div>
    </div>
  );
}
export function Address() {
  const { data, status } = useSession();
  if (status === "loading")
    return (
      <div className="md:flex items-center justify-end gap-10 w-fit flex-grow md:flex-grow-0">
        <div className="flex flex-col items-end justify-end gap-2 text-right">
          <span className="w-5 h-5 rounded-full bg-gray-400 animate-pulse"></span>
          <span className="text-[10px] w-24 h-3 rounded-full bg-gray-400 animate-pulse"></span>
        </div>
      </div>
    );

  if (status === "unauthenticated") return <MainLogo />;

  return (
    <div className="flex items-center justify-end gap-10 w-fit flex-grow md:flex-grow-0">
      <div className="flex flex-col justify-end text-right">
        <span className="text-atysa-800">خانه</span>
        <span className="text-atysa-800 text-[10px]">
          جردن، خیابان سلطانی، پلاک 32
        </span>
      </div>
      <div className="md:flex hidden">
        <MainLogo className="cursor-pointer object-fill  " href="/" />
      </div>
    </div>
  );
}
