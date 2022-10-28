import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import List from "@/ui/list";
const menuItems = [
  {
    url: "/admin/categories",
    name: "دسته بندی ها",
  },
  {
    url: "/admin/products",
    name: "محصول ها",
  },
  {
    url: "/admin/banners",
    name: "بنر ها",
  },
];

export default function AdminLayout({ children }) {
  const { asPath } = useRouter();
  const pathName = getPathName(asPath);
  return (
    <div dir="rtl" className="flex flex-row w-screen h-screen ">
      <div className="flex justify-center items-center px-1 w-52  h-full">
        <AsideMenu path={pathName} />
      </div>
      <div className="flex justify-center items-center flex-grow h-full bg-atysa-primary">
        {children}
      </div>
    </div>
  );
}

function AsideMenu({ path }) {
  return (
    <>
      <div className="flex flex-col gap-5 justify-center items-center w-full h-[90%] p-2 m-2 rounded-3xl bg-white">
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
    <Link key={key} href={url}>
      <span
        className={`${activeClass} cursor-pointer px-2 py-2 w-full text-center rounded-lg hover:scale-105 transition-transform duration-5000`}
      >
        {name}
      </span>
    </Link>
  );
}

function getPathName(path = "") {
  return path.substring(path.lastIndexOf("/") + 1);
}
