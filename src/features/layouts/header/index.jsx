import React, { useState } from "react";
// React Components
// my ui

import MainLogo from "@/ui/logo";
import UserArea from "./userArea/index";
import SearchIcon from "@/ui/icons/searchs";

import Address from "features/address";
const BREAK_POINT = 900;
export default function Header({ children }) {
  const [searchText, setSearchText] = useState("");

  return (
    <>
      <header
        className={`flex sticky bg-[#fffffff9]  drop-shadow-sm top-0 justify-center p-3 mb-5 items-center w-full z-50 text-black `}
      >
        <nav
          className={`md:w-10/12 w-full flex flex-row gap-5  justify-between  items-center  h-auto rounded-2xl mx-auto`}
        >
          {/* Header on desktop */}
          <div className="hidden w-full desktopMin:flex  justify-between items-stretch">
            <UserArea />
            <div className="flex flex-grow justify-center items-center">
              <SearchBox />
            </div>

            <Address>
              <div className="flex">
                <MainLogo className="cursor-pointer object-fill " href="/" />
              </div>
            </Address>
          </div>

          {/* Header on Laptop and tablet and mobile */}
          <div className="hidden w-full laptopMax:flex flex-col gap-5 ">
            <div className="flex flex-row justify-between w-full">
              <div className="flex-grow"></div>
              <Address>
                <div className="flex">
                  <MainLogo className="cursor-pointer object-fill " href="/" />
                </div>
              </Address>
            </div>

            {/* <div className={`flex flex-grow justify-center items-center`}>
              <SearchBox />
            </div> */}
          </div>
        </nav>
      </header>

      {children}
    </>
  );
}

export function SearchBox() {
  return (
    <div className="flex w-full md:w-[400px] rounded-xl bg-gray-50/80">
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
