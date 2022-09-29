import React from "react";
// React Components
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="flex justify-center items-center  w-full h-28 py-[20px] text-black">
      <nav className="w-9/12 flex gap-5 justify-between p-5 items-center   bg-white h-full rounded-2xl mx-auto">
        <Link href="/">
          <div className="flex">
            <div className="flex "></div>

            {session ? "" : <Link href="/login">ورود</Link>}
            <Image
              class="w-16 h-16 object-fill"
              src="/images/logo.png"
              width={450 / 8}
              height={325 / 8}
              quality={70}
            />
          </div>
        </Link>
      </nav>
    </header>
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
