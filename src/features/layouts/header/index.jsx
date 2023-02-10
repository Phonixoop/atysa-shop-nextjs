import React, { useState } from "react";
// React Components
// my ui

import MainLogo from "ui/logo";
import UserArea from "./userArea/index";
import SearchIcon from "ui/icons/searchs";

import Address from "features/address";
import { useSession } from "next-auth/react";
import SearchProduct from "features/search-product";
import Overlay from "ui/overlay";
import SearchArea from "features/search-product-area";

const BREAK_POINT = 768;
export default function Header({ children }) {
  const [searchText, setSearchText] = useState("");
  const { data, status } = useSession();
  let marginTop = 0,
    top = "top-0";
  if (status === "authenticated" && data?.user.role === "ADMIN") {
    marginTop = 40;
    top = "top-[40px]";
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 mb-5 flex  w-full items-center justify-center bg-[#fffffff9]  p-3 text-black drop-shadow-sm `}
      >
        <nav
          className={`mx-auto flex h-auto w-full flex-row  items-center  justify-between  gap-5 rounded-2xl md:max-w-[1280px]`}
        >
          {/* Header on desktop */}
          <div className=" flex w-full  items-center justify-between">
            <div className="z-10 ">
              <UserArea />
            </div>
            <div className="flex flex-grow items-center justify-center">
              <div className="absolute inset-0 hidden items-center justify-center md:flex ">
                <div className="">
                  <SearchArea />
                </div>
              </div>
            </div>
            <div className="z-10 ">
              <Address>
                <div className="flex">
                  <MainLogo className="cursor-pointer object-fill " href="/" />
                </div>
              </Address>
            </div>
          </div>

          {/* Header on Laptop and tablet and mobile */}
          {/* <div className="hidden w-full laptopMax:flex flex-col gap-5 ">
            <div className="flex flex-row justify-between w-full">
              <div className="flex-grow"></div>
              <Address>
                <div className="flex">
                  <MainLogo className="cursor-pointer object-fill " href="/" />
                </div>
              </Address>
            </div> */}

          {/* <div className={`flex flex-grow justify-center items-center`}>
              <SearchBox />
            </div> */}
          {/* </div> */}
        </nav>
      </header>

      {children}
    </>
  );
}
