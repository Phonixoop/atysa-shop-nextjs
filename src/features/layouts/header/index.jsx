import React, { useRef, useState, useEffect } from "react";
// React Components
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
// my ui
import MainLogo from "@/ui/logo";
// hero icons
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import PhoneArrowDownLeftIcon from "@heroicons/react/24/outline/";
import OrdersIcon from "ui/icons/orders";

export default function Header() {
  return (
    <header className="flex justify-center items-center   w-full h-28 py-[20px] text-black">
      <nav className="w-10/12 flex gap-5 justify-between p-5 items-center   bg-white h-full rounded-2xl mx-auto">
        <UserArea />
        <Menu />
        <MainLogo href="/" />
      </nav>
    </header>
  );
}
function UserArea() {
  const { session, loading } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(undefined);
  function toggle() {
    setIsOpen((prev) => !prev);
  }

  return (
    <div className="flex justify-center items-stretch gap-10 ">
      {loading && "Loading"}
      {session && (
        <button className="py-2 px-5 rounded-xl bg-red-500" onClick={signIn}>
          ورود
        </button>
      )}
      {!session && (
        <>
          <Link href="/orders">
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
function UserAreaMenu({
  show = false,
  outsideRef = undefined,
  onFocusChanged = () => {},
}) {
  const _ref = useRef(undefined);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        _ref.current &&
        !_ref.current.contains(event.target) &&
        outsideRef.current &&
        !outsideRef.current.contains(event.target)
      ) {
        onFocusChanged();
        console.log("clicked outside");
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onFocusChanged]);
  return (
    <div
      ref={_ref}
      className={`${
        show ? "flex opacity-100 " : "invisible opacity-0"
      } flex-col  absolute -left-36 top-12 py-2 w-56  bg-white shadow-xl shadow-[#fffddd37] z-10 rounded-br-2xl rounded-bl-2xl transition-all `}
    >
      <div className="flex gap-3 justify-end items-center w-full rounded-md py-3 px-4 shadow-md  cursor-pointer">
        <div className="flex items-end justify-center flex-col gap-1 ">
          <span className="text-[0.8rem] text-black font-medium">
            علی حسن زاده
          </span>
          <span className="text-green-500 text-[10px] font-medium">
            مشاهده حساب کاربری
          </span>
        </div>
        <UserIcon className="h-4 w-4  text-black" />
      </div>
      <div className="flex gap-3 justify-end items-center w-full rounded-md hover:bg-[#F3F3F4]  py-3 px-4 cursor-pointer">
        <span className="text-[#3A3D42]">ساخت بشقاب شخصی</span>
        <OrdersIcon className="h-4 w-4 text-black" />
      </div>
    </div>
  );
}
function Menu() {
  return (
    <div className="md:flex hidden flex-grow justify-end  w-fit">
      <div className="relative flex gap-2 w-fit py-2 px-2 rounded-2xl  bg-atysa-primary">
        <Link href="/category/diet">
          <a className="bg-white p-2 px-4 rounded-xl">دسته بندی</a>
        </Link>
        <Link href="">
          <a className="bg-white p-2 px-4 rounded-xl">پنل کاربری</a>
        </Link>
        <Link href="/me/orders">
          <a className="bg-white p-2 px-4 rounded-xl">سفارش های من</a>
        </Link>
      </div>
    </div>
  );
}
// <nav class="w-9/12 flex gap-5 justify-between p-5 items-center   bg-white h-full rounded-2xl mx-auto">

// <Link href="/">
//  <Image class="w-16 h-auto object-fill"  />
// </Link>
// <div class="flex flex-grow">
//  <button   href="/order">

//    سفارش
// </button>
// </div>
//  <div class="flex justify-between items-center gap-4 ">

//    {/* <div class="relative flex gap-2 items-center">
//      <img class="w-9 h-9 object-cover rounded-full" src="{{asset(Auth::User()->avatar)}}" />
//      <button class="bg-[#ffffff] text-black"  href="/user">

//      </button>
//      <button class="flex peer justify-center items-center w-8 h-8 border border-gray-400 rounded-full">
//        <x-icon.down ></x-icon.down>
//      </button>
//      <div class="absolute rounded-lg gap-5 p-2 hidden top-0 left-10 z-10 bg-white shadow-xl duration-300  text-black w-52   peer-hover:flex transition-shadow">
//        <div class="flex flex-col gap-2 w-full">
//        <a class="bg-gray-50 w-full p-2 rounded-xl hover:bg-white" href="/user">سفارش ها</a>
//        <a class="bg-gray-50 w-full p-2 rounded-xl hover:bg-white" href="">بشقاب های شخصی</a>
//         <a class="bg-gray-50 w-full p-2 rounded-xl hover:bg-white" href="">خروج</a>
//        </div>
//      </div>
//    </div> */}

//    <button class="bg-[#ffffff] text-black  "  href="/login">

//      ورود
//    </button>

// </div>

// </nav>
