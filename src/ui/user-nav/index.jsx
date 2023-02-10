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
import SearchArea from "features/search-product-area";
import SearchProduct from "features/search-product";
import Overlay from "ui/overlay";
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
            className="flex h-[70px] w-full items-center justify-center px-2"
          >
            <div className="flex h-full w-full items-center  justify-center rounded-lg bg-white/80 px-5 shadow-lg shadow-gray-200 ring-[1px] ring-white backdrop-blur-sm">
              <div className="flex w-fit  justify-start gap-8">
                <SearchButton />
                <LinkIcon href="/" title="خانه">
                  <DishIcon />
                </LinkIcon>
              </div>
              <MiddleLine />

              <div className=" flex h-full items-center justify-end gap-8">
                <LinkIcon href="/me/basket" title="سبد خرید">
                  <div className="relative">
                    <BasketIcon />
                    <div
                      style={{
                        top: "-10px",
                        right: "-10px",
                      }}
                      className="absolute inline-flex items-center justify-center  rounded-full text-xs font-bold text-atysa-900"
                    >
                      {basketQuantity || ""}
                    </div>
                  </div>
                </LinkIcon>

                {isLoading ? (
                  <div className="flex h-5 gap-2">
                    <span className="h-5 w-5 animate-pulse rounded-2xl bg-gray-300 font-medium text-[#3A3D42]"></span>
                    <span className="w-20 animate-pulse rounded-2xl bg-gray-300 font-medium text-[#3A3D42]"></span>
                  </div>
                ) : !authenticated ? (
                  <Link href="/login">
                    <button className="rounded-x rounded-xl border border-atysa-800 py-2 px-5 text-center text-sm text-atysa-800">
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
          className="flex min-w-fit flex-col items-center justify-center gap-1 text-center text-[9px]"
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
    <div className=" flex h-full flex-grow items-center justify-center">
      <span className="h-[15px] w-[0.5px]  bg-atysa-800/75"></span>
    </div>
  );
}

function SearchButton() {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  return (
    <div className="flex w-full">
      <button
        className="flex min-w-fit flex-col items-center justify-center gap-1 text-center text-[9px]"
        type="button"
        onClick={() => {
          setShowSearch((prev) => !prev);
        }}
      >
        <SearchIcon className="h-5 w-5 fill-atysa-800" />
        {!showSearch && <span>جستجو</span>}
      </button>
      {showSearch && (
        <div className="absolute inset-0 z-50 flex items-center justify-between rounded-lg bg-gray-100 px-5">
          <SearchIcon className="h-5 w-5 fill-atysa-800" />

          <SimpleTextField
            value={query}
            onChange={setQuery}
            className="h-full w-full bg-transparent p-5 text-right caret-atysa-800"
            autoFocus
          />

          <Overlay isOpen={true}>
            <div
              className="flex h-full p-5"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <SearchProduct query={query} />
            </div>
          </Overlay>
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
  /* <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-atysa-800">
  <g>
    <path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"></path>
  </g>
</svg>; */
}
