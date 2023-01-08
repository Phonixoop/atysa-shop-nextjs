import React, { useRef } from "react";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

import { getPathName } from "utils";
import { useRouter } from "next/router";
import FullName from "ui/fullname";
import ChevronLeftIcon from "ui/icons/chervons/chevron-left";
import { AnimateSharedLayout, motion } from "framer-motion";
// const variants = {
//   hidden: { opacity: 0.5, x: 0, y: 2 },
//   enter: { opacity: 1, x: 0, y: 0 },
//   exit: { opacity: 0.5, x: 0, y: 2 },
// };
const menu = [
  { id: 0, url: "me", name: "مشخصات کاربری", positionY: 4 },
  { id: 0, url: "me/custom-dish", name: "بشقاب سفارشی", positionY: 4 },
  { id: 1, url: "me/basket", name: "سبد خرید", positionY: 48 },
  { id: 2, url: "me/orders", name: "سفارش ها", positionY: 88 },
];
export default function ProfileLayout({ children, withShadow = true }) {
  const { data, status } = useSession();
  const router = useRouter();
  if (status === "loading" || status === "unauthenticated") return "";
  const user = data.user;

  const title = menu.find(
    (a) => getPathName(a.url) === getPathName(router.asPath)
  )?.name;
  return (
    <div
      dir="rtl"
      className={`flex mobileMin:flex-row flex-col gap-10 px-2 justify-center mobileMin:items-stretch  items-center lg:w-10/12 md:px-5 w-full mx-auto py-2  select-none`}
    >
      <div className="relative flex justify-center items-start">
        <div className="flex justify-center items-center sticky top-[5.5rem] flex-col md:w-[220px] w-full  bg-white  rounded-2xl ">
          {user && (
            <div className="flex text-right w-full justify-between">
              <FullName user={user} />

              <span className="w-full text-left text-xs p-2 ">
                {user.phonenumber}
              </span>
            </div>
          )}
          <FantasyMenu />
        </div>
      </div>
      <div
        className={`w-full flex flex-col justify-start items-center rounded-2xl h-auto bg-white ${
          withShadow ? "shadow-light" : ""
        } `}
      >
        <h2 className="text-right p-5 text-lg font-bold w-full text-atysa-800">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

function getName(item) {
  return getPathName(item.url) === getPathName(router.asPath);
}

function FantasyMenu() {
  const router = useRouter();
  const [active, setActive] = useState(
    menu.filter(
      (item) => getPathName(item.url) === getPathName(router.asPath)
    )[0]
  );
  const navElement = useRef();

  function handleActiveItem(e) {
    const top = e.currentTarget.getBoundingClientRect().top || 0;
    const width = e.currentTarget.getBoundingClientRect().width || 0;
    const height = e.currentTarget.getBoundingClientRect().height || 0;
    const y = top - navElement.current.getBoundingClientRect().height;
    setActive((prev) => {
      return {
        ...prev,
        positionY: `top-[${y}px]`,
      };
    });
  }
  function isActiveLink(item) {
    return getPathName(item.url) === getPathName(router.asPath);
  }
  return (
    <AnimateSharedLayout>
      <ul
        ref={navElement}
        //F3F3F4
        className="relative flex md:flex-col justify-around items-center gap-1 min-w-[13rem] w-full text-center bg-atysa-primary rounded-lg p-1"
      >
        {menu.map((item) => {
          return (
            <Link href={`/${item.url}`} key={item.id} shallow={false}>
              <li
                onClick={(e) => setActive(item)}
                className={`relative md:w-full w-fit  px-2 py-2 rounded-lg cursor-pointer  hover:bg-[#ffffff8a] ${
                  isActiveLink(item) ? "text-atysa-main" : "text-atysa-800"
                } transition-colors`}
              >
                <span className="relative md:text-base text-[0.7rem] z-10">
                  {item.name}
                </span>
                {isActiveLink(item) && (
                  <motion.span
                    layoutId="position"
                    initial={false}
                    className={`absolute bg-white rounded-lg  z-0 inset-0`}
                  />
                )}
              </li>
            </Link>
          );
        })}

        <li
          onClick={(e) => signOut()}
          className={`relative md:w-full w-fit  flex justify-center items-center px-2 py-2 rounded-lg cursor-pointer  bg-atysa-900 text-white hover:bg-atysa-900/90
      `}
        >
          <span className="relative md:text-base text-[0.7rem] z-10">خروج</span>
          <ChevronLeftIcon className="absolute hidden fill-none stroke-2 stroke-white md:flex md:left-5 left-1 w-4 h-4" />
        </li>
      </ul>
    </AnimateSharedLayout>
  );
}
