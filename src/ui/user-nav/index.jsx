import ReactDOM from "react-dom";
import { useSession } from "next-auth/react";
import { useBasket } from "context/basketContext";
import { useEffect, useState } from "react";
import Link from "next/link";
//icons

import UserIcon from "ui/icons/users";
import OrdersIcon from "ui/icons/orders";
import BasketIcon from "ui/icons/basket";
import SearchIcon from "ui/icons/searchs";
import XIcon from "ui/icons/xicon";
//ui
import SimpleTextField from "ui/forms/text-field/simple";
import DishIcon from "ui/icons/dish";
export default function UserNav() {
  const [mounted, setMounted] = useState(false);
  const { data, status } = useSession();

  const user = data?.user;
  const authenticated = status === "authenticated";
  const isLoading = status === "loading";
  const { basketQuantity } = useBasket();
  useEffect(() => {
    setMounted(true);
    //  setY(modal.current.y);
  }, []);

  return mounted
    ? ReactDOM.createPortal(
        <>
          <div
            dir="rtl"
            className="flex justify-center items-center h-[70px] w-full px-2"
          >
            <div className="w-full h-full flex justify-center  items-center ring-white ring-[1px] bg-white/80 backdrop-blur-sm rounded-lg shadow-gray-200 shadow-lg px-5">
              <div className="w-fit justify-start  gap-8 flex">
                <SearchButton />
                <LinkIcon href="/" title="خانه">
                  <DishIcon />
                </LinkIcon>
              </div>
              <MiddleLine />

              <div className=" h-full flex gap-8 justify-end items-center">
                <LinkIcon href="/me/basket" title="سبد خرید">
                  <div className="relative">
                    <BasketIcon />
                    <div
                      style={{
                        top: "-10px",
                        right: "-10px",
                      }}
                      className="absolute inline-flex justify-center items-center  text-xs font-bold text-atysa-900 rounded-full"
                    >
                      {basketQuantity || ""}
                    </div>
                  </div>
                </LinkIcon>

                {isLoading ? (
                  <div className="flex gap-2 h-5">
                    <span className="font-medium text-[#3A3D42] animate-pulse w-5 h-5 rounded-2xl bg-gray-300"></span>
                    <span className="font-medium text-[#3A3D42] animate-pulse w-20 rounded-2xl bg-gray-300"></span>
                  </div>
                ) : !authenticated ? (
                  <Link href="/login">
                    <button className="py-2 px-5 text-sm rounded-x border border-atysa-800 rounded-xl text-center text-atysa-800">
                      ورود/ثبت نام
                    </button>
                  </Link>
                ) : (
                  <>
                    <LinkIcon href="/me/orders" title="سفارش ها">
                      <OrdersIcon />
                    </LinkIcon>
                    <LinkIcon href="/me" title="پروفایل">
                      <UserIcon />
                    </LinkIcon>
                  </>
                )}
              </div>
            </div>
          </div>
        </>,
        document.getElementById("user-nav")
      )
    : "";
}

function LinkIcon({ children, href = "", title = "", onClick = () => {} }) {
  return (
    <>
      <Link href={href}>
        <a
          onClick={onClick}
          className="flex min-w-fit flex-col gap-1 justify-center items-center text-center text-[9px]"
        >
          {children}
          <span>{title}</span>
        </a>
      </Link>
    </>
  );
}

function MiddleLine() {
  return (
    <div className=" flex-grow h-full flex justify-center items-center">
      <span className="w-[0.5px] h-[15px]  bg-atysa-800/75"></span>
    </div>
  );
}

function SearchButton() {
  const [showSearch, setShowSearch] = useState(false);
  return (
    <div className="flex w-full">
      <button
        className="flex min-w-fit flex-col gap-1 justify-center items-center text-center text-[9px]"
        type="button"
        onClick={() => {
          setShowSearch((prev) => !prev);
        }}
      >
        <SearchIcon className="w-5 h-5 fill-atysa-800" />
        {!showSearch && <span>جستجو</span>}
      </button>
      {showSearch && (
        <div className="absolute px-5 flex justify-between items-center inset-0 bg-gray-100 rounded-lg z-50">
          <SearchIcon className="w-5 h-5 fill-atysa-800" />

          <SimpleTextField
            className="bg-transparent caret-atysa-800 w-full h-full text-right p-5"
            autoFocus
          />
          <div
            onClick={() => {
              setShowSearch((prev) => !prev);
            }}
          >
            <XIcon />
          </div>
        </div>
      )}
    </div>
  );
}

{
  /* <svg viewBox="0 0 24 24" aria-hidden="true" class="w-6 h-6 fill-atysa-800">
  <g>
    <path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"></path>
  </g>
</svg>; */
}
