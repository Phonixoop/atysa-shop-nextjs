import React, { useState } from "react";
// React Components
import Link from "next/link";
// my ui
import MainLogo from "@/ui/logo";
import UserArea from "./userArea";
import TextField from "@/ui/froms/text-field";
import SearchIcon from "@/ui/icons/searchs";
import useWindowSize from "@/hooks/useWindowSize";
import { useSession } from "next-auth/react";
const BREAK_POINT = 900;
export default function Header({ children }) {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="top-0 z-50 backdrop-blur-xl  ">
      <header
        className={`flex justify-center items-center w-full h-full z-50  text-black `}
      >
        <nav
          className={`md:w-10/12 w-full flex flex-row gap-5  justify-between p-5 items-center  h-auto rounded-2xl mx-auto`}
        >
          {/* Header on desktop */}
          <div className="hidden w-full desktop:flex justify-between">
            <UserArea />
            <div className="flex w-6/12  justify-center pr-2 items-center">
              <SearchBox />
            </div>
            <Address />
          </div>

          {/* Header on Laptop and tablet and mobile */}
          <div className="hidden w-full laptop:flex flex-col gap-5">
            <div className="flex flex-row justify-between w-full ">
              <UserArea />
              <Address />
            </div>
            <div className="flex justify-cente items-center">
              <SearchBox />
            </div>
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
}

export function SearchBox() {
  return (
    <div className="w-full flex justify-end px-4 py-3 caret-atysa-secondry  rounded-2xl items-center gap-3  md:flex-grow ">
      <input
        className="w-full outline-none bg-transparent text-right"
        placeholder="جستجو محصولات"
      />
      <span className="w-[1px] h-4 bg-gray-400"></span>
      <SearchIcon className="fill-gray-400 w-4 h-4" />
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
        <MainLogo
          className="w-16 h-16 object-fill hidden md:flex justify-content items-center"
          href="/"
        />
      </div>
    );

  return (
    <div className="md:flex items-center justify-end gap-10 w-fit flex-grow md:flex-grow-0">
      <div className="flex flex-col justify-end text-right">
        <span className="">خانه</span>
        <span className="text-[10px]">جردن، خیابان سلطانی، پلاک 32</span>
      </div>
      <MainLogo
        className="w-16 h-16 object-fill hidden md:flex justify-content items-center"
        href="/"
      />
    </div>
  );
}
