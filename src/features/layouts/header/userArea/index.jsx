import { useRef, useState } from "react";
// nextjs components
import Link from "next/link";
// icons
import { useBasket } from "context/basketContext";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import OrdersIcon from "@/ui/icons/orders";
import UserDropDown from "./dropdown";
import { signIn, useSession } from "next-auth/react";
import BasketIcon from "ui/icons/basket";

export default function UserArea() {
  const { data, status } = useSession();
  const { basketQuantity } = useBasket();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(undefined);
  function toggle() {
    setIsOpen((prev) => !prev);
  }
  return (
    <div className="flex justify-center items-center gap-6 md:gap-10 select-none ">
      {status === "authenticated" && (
        <div className="min-w-fit">
          <OrderStatusButton />
        </div>
      )}

      <Link href={"/me/basket"} passHref>
        <a className="inline-flex relative items-center p-3 text-sm font-medium text-center text-white rounded-lg  focus:outline-none dark:bg-blue-600 ">
          <BasketIcon />
          <div className="inline-flex absolute -top-0 -right-0 justify-center items-center w-5 h-5 text-xs font-bold text-atysa-900 rounded-full">
            {basketQuantity || ""}
          </div>
        </a>
      </Link>
      {status === "loading" ? (
        <div className="flex gap-2 h-5">
          <span className="font-medium text-[#3A3D42] animate-pulse w-20 rounded-2xl bg-gray-300"></span>
          <span className="font-medium text-[#3A3D42] animate-pulse w-5 h-5 rounded-2xl bg-gray-300"></span>
        </div>
      ) : status === "unauthenticated" ? (
        <Link href="/login">
          <button className="py-2 px-5 text-sm rounded-x border border-atysa-800 rounded-xl text-center text-atysa-800">
            ورود/ثبت نام
          </button>
        </Link>
      ) : status === "authenticated" ? (
        <>
          <div className="relative flex gap-5 w-full">
            <button
              type="button"
              ref={buttonRef}
              className="flex justify-center items-center"
              onClick={() => toggle()}
            >
              <UserIcon className="h-5 w-5 text-[#3A3D42]" />
            </button>

            <UserDropDown
              user={data.user}
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
    <div className="flex items-center justify-center ">
      <span className="relative inline-flex">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow-sm rounded-md text-atysa-500 bg-white transition ease-in-out duration-1000 ring-1 ring-atysa-25"
        >
          وضعیت سفارش
        </button>
        <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-atysa-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-atysa-500"></span>
        </span>
      </span>
    </div>
  );
}
