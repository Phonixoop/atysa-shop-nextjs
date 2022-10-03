import { useRef, useState } from "react";
// nextjs components
import Link from "next/link";
// icons

import UserIcon from "@heroicons/react/24/outline/UserIcon";
import OrdersIcon from "ui/icons/orders";
import { useAuth } from "features/auth";
import UserAreaMenu from "../userAreaMenu/";

export default function UserArea() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(undefined);
  function toggle() {
    setIsOpen((prev) => !prev);
  }
  return (
    <div className="flex justify-center items-stretch gap-10 select-none ">
      {!user && (
        <Link href="/login">
          <button className="py-2 px-5 rounded-xl bg-red-500">ورود</button>
        </Link>
      )}
      {user && (
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
              outsideRef={buttonRef}
              show={isOpen}
              onFocusChanged={() => setIsOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}
