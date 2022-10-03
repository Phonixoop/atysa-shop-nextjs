import { useRef, useState } from "react";
// nextjs components
import Link from "next/link";
// icons

import UserIcon from "@heroicons/react/24/outline/UserIcon";
import OrdersIcon from "ui/icons/orders";
import { useAuth } from "features/auth";
import UserAreaMenu from "../userAreaMenu/";
import { signIn, useSession } from "next-auth/react";

export default function UserArea() {
  const { data, status } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(undefined);
  function toggle() {
    setIsOpen((prev) => !prev);
  }
  return (
    <div className="flex justify-center items-stretch gap-10 select-none ">
      {status === "loading" ? (
        <span> loading </span>
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
            <a className="flex  gap-2">
              <span className="font-medium text-[#3A3D42]"> سفارش ها</span>
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
            <UserAreaMenu
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
