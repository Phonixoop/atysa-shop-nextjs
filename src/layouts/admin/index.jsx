import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

//icons
import CategoryIcon from "ui/icons/category";
import Image from "next/image";
import MainLogo from "ui/logo";
function OrdersImageIcon() {
  return <Image src="/images/image-icons/orders.png" width="16" height="16" />;
}

function ProductsImageIcon({ classN }) {
  return (
    <Image
      className={classN}
      src="/images/image-icons/products.png"
      width="16"
      height="16"
    />
  );
}
function GalleryImageIcon() {
  return <Image src="/images/image-icons/gallery.png" width="16" height="16" />;
}
function CouponImageIcon() {
  return <Image src="/images/image-icons/coupon.png" width="16" height="16" />;
}
function MaterialImageIcon() {
  return (
    <Image src="/images/image-icons/material.png" width="16" height="16" />
  );
}
function SettingsImageIcon() {
  return (
    <Image src="/images/image-icons/settings.png" width="16" height="16" />
  );
}
function UsersImageIcon() {
  return (
    <Image src="/images/image-icons/users-list.webp" width="16" height="16" />
  );
}
function CommentsImageIcon() {
  return (
    <Image
      src="/images/image-icons/user-comments.webp"
      width="16"
      height="16"
    />
  );
}

const menuItems = [
  {
    url: "/admin/gallery",
    name: "رسانه ها",
    Icon: GalleryImageIcon,
  },
  {
    url: "/admin/categories",
    name: "دسته بندی ها",
    Icon: CategoryIcon,
  },
  {
    url: "/admin/products",
    name: "محصول ها",
    Icon: ProductsImageIcon,
  },
  {
    url: "/admin/materials",
    name: "مواد اولیه",
    Icon: MaterialImageIcon,
  },
  {
    url: "/admin/orders",
    name: "سفارش ها",
    Icon: OrdersImageIcon,
  },
  {
    url: "/admin/comments",
    name: "کامنت ها",
    Icon: CommentsImageIcon,
  },
  {
    url: "/admin/users",
    name: "کاربر ها",
    Icon: UsersImageIcon,
  },
  {
    url: "/admin/coupons",
    name: "کد تخفیف",
    Icon: CouponImageIcon,
  },
  {
    url: "/admin/settings",
    name: "تنظیمات",
    Icon: SettingsImageIcon,
  },
];

export default function AdminLayout({ children }) {
  const { asPath } = useRouter();
  const pathName = getPathName(asPath);
  return (
    <div
      dir="rtl"
      className="flex min-h-screen w-full flex-col items-center justify-start  bg-gradient-to-l from-zinc-300/40 to-atysa-primary "
    >
      <div className="sticky top-1 z-10 my-3 mr-[15vw] flex h-14 w-[80vw] items-center justify-start rounded-xl bg-white p-5 text-right drop-shadow-lg">
        <MainLogo />
      </div>
      <div className="overflow-overlay  flex items-start justify-center ">
        <div className=" fixed top-0 right-0 h-full  min-w-[15vw] overflow-hidden p-2">
          <AsideMenu path={pathName} />
        </div>
        <div className="relative mr-[15vw] flex w-[80vw] flex-col items-center justify-center py-3">
          {children}
        </div>
      </div>
    </div>
  );
}

function AsideMenu({ path }) {
  return (
    <>
      <div
        className="flex h-full w-10/12   flex-col items-center justify-center gap-5 px-0 
"
      >
        {menuItems.map((item) => {
          const Icon = item?.Icon;
          return renderMenuItem(
            item.name,
            item,
            Icon,
            getPathName(item.url) === path
          );
        })}
      </div>
    </>
  );
}

function renderMenuItem(key, item, Icon, active = false) {
  const { url, name } = item;
  const activeClass = active
    ? "shadow-full bg-white shadow-gray-200 text-atysa-main -translate-x-2 "
    : " shadow-inset text-atysa-900 stroke-atysa-main";

  return (
    <Link key={key} href={url}>
      <span
        className={`${activeClass} duration-5000 flex w-full cursor-pointer items-center justify-center gap-10 rounded-md px-2 py-2 text-center font-bold transition-transform hover:scale-105`}
      >
        <Icon
          fill={`${active ? "fill-atysa-main" : "fill-none"}`}
          stroke="stroke-inherit"
        />
        <span className="flex flex-grow justify-start">{name}</span>
      </span>
    </Link>
  );
}

function getPathName(path = "") {
  return path.substring(path.lastIndexOf("/") + 1);
}
