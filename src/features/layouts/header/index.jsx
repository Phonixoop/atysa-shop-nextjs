import React, { useState } from "react";
// React Components
// my ui
import { useMe } from "context/meContext";
import Link from "next/link";
import MainLogo from "@/ui/logo";
import UserArea from "./userArea";
import SearchIcon from "@/ui/icons/searchs";
import Button from "ui/buttons";
import { useSession } from "next-auth/react";
import LinkButton from "ui/buttons/link-button";
import ChevronDownIcon from "ui/icons/chervons/chevron-down";
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

            <Address />
          </div>

          {/* Header on Laptop and tablet and mobile */}
          <div className="hidden w-full laptopMax:flex flex-col gap-5 ">
            <div className="flex flex-row justify-between w-full">
              <UserArea />
              <Address />
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
export function Address() {
  const { data: user, isLoading, authenticated } = useMe();

  if (!user) return <MainLogo />;
  const hasAddress = user.addresses.length > 0;
  const activeAddress = user.addresses.filter((a) => a.isActive === true)[0];
  return (
    <div
      dir="rtl"
      className="flex items-center justify-start gap-10 w-fit flex-grow md:flex-grow-0"
    >
      <div className="md:flex hidden">
        <MainLogo className="cursor-pointer object-fill  " href="/" />
      </div>
      <div className="flex flex-col justify-start text-right">
        {hasAddress && activeAddress ? (
          <div className="flex justify-start items-stretch gap-2 ">
            <div className="flex flex-col justify-end items-start text-right">
              <span className="text-atysa-800">{activeAddress.title}</span>
              <span className="text-atysa-800 text-[10px] text-right">
                {activeAddress.description.slice(0, 40)}
              </span>
            </div>
            <div className="flex justify-center items-end pb-[2px]">
              <ChevronDownIcon className="w-3 h-3  stroke-atysa-900" />
            </div>
          </div>
        ) : (
          <>
            {hasAddress && (
              <LinkButton
                href="/me"
                className="border-[1px] border-dashed border-atysa-900 text-sm text-atysa-900"
              >
                انتخاب آدرس
              </LinkButton>
            )}
            {!hasAddress && (
              <LinkButton
                href="/me"
                className="border-[1px] border-dashed border-atysa-900 text-sm text-atysa-900"
              >
                افزودن آدرس
              </LinkButton>
            )}
          </>
        )}
      </div>
    </div>
  );
}
