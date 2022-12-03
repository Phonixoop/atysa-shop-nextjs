import { useRef, useState } from "react";
// nextjs components
import Link from "next/link";
import { useBasket } from "context/basketContext";
import { useSession } from "next-auth/react";
// icons

import UserIcon from "ui/icons/users";
import OrdersIcon from "ui/icons/orders";
import BasketIcon from "ui/icons/basket";

import UserDropDown from "./dropdown/index";
import { useMe } from "context/meContext";
export default function UserArea() {
  const { data, status } = useSession();

  const user = data?.user;
  const authenticated = status === "authenticated";
  const isLoading = status === "loading";

  const { basketQuantity } = useBasket();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(undefined);
  function toggle() {
    setIsOpen((prev) => !prev);
  }

  return (
    <div className="hidden md:flex justify-center items-center md:gap-10 gap-10 select-none  ">
      {authenticated && (
        <div className="min-w-fit">
          <OrderStatusButton />
        </div>
      )}

      <Link href={"/me/basket"} passHref>
        <a className="relative inline-flex  items-center  text-sm font-medium text-center text-white rounded-lg  focus:outline-none dark:bg-blue-600 ">
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
        </a>
      </Link>

      {isLoading ? (
        <div className="flex gap-2 h-5">
          <span className="font-medium text-[#3A3D42] animate-pulse w-20 rounded-2xl bg-gray-300"></span>
          <span className="font-medium text-[#3A3D42] animate-pulse w-5 h-5 rounded-2xl bg-gray-300"></span>
        </div>
      ) : !user ? (
        <Link href="/login">
          <button className="py-2 px-5 text-sm rounded-x border border-atysa-800 rounded-xl text-center text-atysa-800">
            ورود/ثبت نام
          </button>
        </Link>
      ) : user ? (
        <>
          <div className="relative  flex gap-5 w-full">
            <button
              type="button"
              ref={buttonRef}
              className="flex justify-center items-center"
              onClick={() => toggle()}
            >
              <UserIcon />
            </button>

            <UserDropDown
              user={user}
              outsideRef={buttonRef}
              show={isOpen}
              onFocusChanged={() => setIsOpen(false)}
            />
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

function OrderStatusButton() {
  return (
    <div className="flex items-center justify-center w-fit">
      <div className="relative flex flex-col ">
        <Link href={"/me/orders"}>
          <div className="relative flex flex-col  gap-2">
            <button
              type="button"
              className=" mobileMax:inline-flex items-center  font-semibold leading-6 text-sm  rounded-md text-atysa-500 bg-white transition ease-in-out duration-1000"
            >
              <OrdersIcon />
            </button>
            {/* <span className="absolute text-right w-[9ch] left-1/2 -translate-x-1/2 -bottom-6 text-sm text-atysa-500 font-semibold">
              سفارش ها
            </span> */}
          </div>
          {/* <button
              type="button"
              className="hidden mobileMin:inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow-sm rounded-md text-atysa-500 bg-white transition ease-in-out duration-1000 ring-1 ring-atysa-25"
            >
              وضعیت سفارش
            </button> */}
        </Link>
        {/* <span className="flex absolute h-3 w-3 -top-3 -right-3 ">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-atysa-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-atysa-500"></span>
        </span> */}
      </div>
    </div>
  );
}
