import { useRef, useState } from "react";
// nextjs components
import Link from "next/link";
// icons

import UserIcon from "@heroicons/react/24/outline/UserIcon";
import OrdersIcon from "@/ui/icons/orders";
import UserDropDown from "./dropdown";
import { signIn, useSession } from "next-auth/react";

export default function UserArea() {
  const { data, status } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(undefined);
  function toggle() {
    setIsOpen((prev) => !prev);
  }
  return (
    <div className="flex justify-center items-center gap-6 md:gap-10 select-none ">
      {status === "loading" ? (
        <div className="flex gap-2 h-5">
          <span className="font-medium text-[#3A3D42] animate-pulse w-20 rounded-2xl bg-gray-300"></span>
          <span className="font-medium text-[#3A3D42] animate-pulse w-5 h-5 rounded-2xl bg-gray-300"></span>
        </div>
      ) : status === "unauthenticated" ? (
        <button
          className="py-2 px-5 rounded-xl bg-red-500"
          onClick={() => signIn()}
        >
          ورود
        </button>
      ) : status === "authenticated" ? (
        <>
          <Link href="/me/orders">
            <a className="flex gap-2  items-center">
              <span className="hidden md:flex text-sm font-medium text-right  text-[#3A3D42]">
                سفارش ها
              </span>
              <OrdersIcon className="h-5 w-5 text-black " />
            </a>
          </Link>
          <div className="relative">
            <button
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
