import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import List from "@/ui/list";
const menuItems = [
  {
    url: "/admin/gallery",
    name: "رسانه ها",
  },
  {
    url: "/admin/categories",
    name: "دسته بندی ها",
  },
  {
    url: "/admin/products",
    name: "محصول ها",
  },
  {
    url: "/admin/orders",
    name: "سفارش ها",
  },
  {
    url: "/admin/coupons",
    name: "کد تخفیف",
  },
];

export default function AdminLayout({ children }) {
  const { asPath } = useRouter();
  const pathName = getPathName(asPath);
  return (
    <div
      dir="rtl"
      className="flex flex-col justify-start items-center min-h-screen "
    >
      <div className="flex items-center bg-white w-[80vw] mr-[15vw] text-right justify-start my-3 p-5 rounded-xl h-14 sticky top-1 z-10 drop-shadow-lg"></div>
      <div className="flex  justify-center items-start overflow-overlay ">
        <div className=" fixed h-full top-0 right-0  overflow-hidden p-2  min-w-[15vw]">
          <AsideMenu path={pathName} />
        </div>
        <div className="flex flex-col relative justify-center items-center py-3 w-[80vw] mr-[15vw]">
          {children}
        </div>
      </div>
    </div>
  );
}

function AsideMenu({ path }) {
  return (
    <>
      <div className=" flex flex-col gap-5 justify-center items-center w-full h-full px-2 rounded-3xl bg-white">
        <List
          {...{
            list: menuItems,
            renderItem: (item) =>
              renderMenuItem(item.name, item, getPathName(item.url) === path),
          }}
        />
      </div>
    </>
  );
}

function renderMenuItem(key, item, active = false) {
  const { url, name } = item;
  const activeClass = active
    ? "bg-blue-900  text-white "
    : "bg-slate-900  text-white";
  return (
    <Link key={key} href={url} shallow={true}>
      <span
        className={` ${activeClass} cursor-pointer px-2 py-2 w-full text-center rounded-lg hover:scale-105 transition-transform duration-5000`}
      >
        {name}
      </span>
    </Link>
  );
}

function getPathName(path = "") {
  return path.substring(path.lastIndexOf("/") + 1);
}
