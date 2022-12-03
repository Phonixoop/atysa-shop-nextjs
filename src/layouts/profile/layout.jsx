import React, { useRef } from "react";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

import { getPathName } from "utils";
import { useRouter } from "next/router";
import FullName from "ui/fullname";
import { useMe } from "context/meContext";
// const variants = {
//   hidden: { opacity: 0.5, x: 0, y: 2 },
//   enter: { opacity: 1, x: 0, y: 0 },
//   exit: { opacity: 0.5, x: 0, y: 2 },
// };
const menu = [
  { id: 0, url: "me", name: "مشخصات کاربری", positionY: 4 },
  { id: 1, url: "me/basket", name: "سبد خرید", positionY: 48 },
  { id: 2, url: "me/orders", name: "سفارش ها", positionY: 88 },
];
export default function ProfileLayout({ children }) {
  const { data: user } = useMe();
  const router = useRouter();
  const title = menu.find(
    (a) => getPathName(a.url) === getPathName(router.asPath)
  )?.name;
  return (
    <div
      dir="rtl"
      className="flex mobileMin:flex-row flex-col gap-10 px-2 justify-center mobileMin:items-start  items-center md:w-8/12 w-full mx-auto py-2 overflow-hidden"
    >
      <div className="flex flex-col md:w-[220px] w-full p-2 bg-white place-center rounded-2xl shadow-light">
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
      <div className="w-full flex flex-col place-center rounded-2xl h-auto bg-white shadow-light overflow-hidden">
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
    <ul
      ref={navElement}
      className="relative flex md:flex-col   place-center gap-1 min-w-[13rem] w-full text-center bg-[#F3F3F4] rounded-lg p-1"
    >
      {menu.map((item) => {
        return (
          <Link href={`/${item.url}`} key={item.id} shallow={false}>
            <li
              onClick={(e) => setActive(item)}
              className={`relative w-full px-2 py-2 rounded-lg cursor-pointer  hover:bg-[#ffffff8a] ${
                isActiveLink(item) ? "text-atysa-secondry " : "text-atysa-800"
              } transition-colors`}
            >
              <span className="relative md:text-base text-[0.8rem] z-10">
                {item.name}
              </span>
              {isActiveLink(item) && (
                <span className={`absolute bg-white rounded-lg  z-0 inset-0`} />
              )}
            </li>
          </Link>
        );
      })}

      <li
        onClick={(e) => signOut()}
        className={`relative w-full px-2 py-2 rounded-lg cursor-pointer  hover:bg-[#ffffff8a] ${
          isActiveLink(item) ? "text-atysa-secondry " : "text-atysa-800"
        } transition-colors`}
      >
        <span className="relative md:text-base text-[0.8rem] z-10">خروج</span>
        {isActiveLink(item) && (
          <span className={`absolute bg-white rounded-lg  z-0 inset-0`} />
        )}
      </li>
    </ul>
  );
}
