import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import FullName from "ui/fullname";
function AdminBar() {
  const { data, status } = useSession();
  const user = data?.user || undefined;
  if (status !== "authenticated" && data?.user.role !== "ADMIN") return;
  return (
    <div
      dir="rtl"
      className="fixed left-0 top-0 right-0 z-[60] flex  justify-start items-center gap-20 bg-atysa-900 px-10 py-2   overflow-x-auto  scrollbar-none"
    >
      <div className="text-white flex justify-center items-center gap-2 min-w-fit">
        <span className="text-atysa-main">ادمین</span>
        <FullName user={user} withFallback />
        <span className="text-sm"> {user.phonenumber}</span>
      </div>

      <div className="flex justify-center items-center gap-5 text-sm text-white ">
        <LinkButtonForAdmin href={"/admin/gallery"}>
          رسانه ها
        </LinkButtonForAdmin>
        <LinkButtonForAdmin href={"/admin/categories"}>
          دسته بندی ها
        </LinkButtonForAdmin>
        <LinkButtonForAdmin href={"/admin/products"}>
          محصول ها
        </LinkButtonForAdmin>
        <LinkButtonForAdmin href={"/admin/materials"}>
          مواد اولیه
        </LinkButtonForAdmin>
        <LinkButtonForAdmin href={"/admin/orders"}>سفارش ها</LinkButtonForAdmin>
      </div>
    </div>
  );
}

export default AdminBar;

function LinkButtonForAdmin({ children, href }) {
  return (
    <Link href={href} passHref>
      <a className="min-w-fit cursor-pointer hover:text-atysa-main">
        {children}
      </a>
    </Link>
  );
}
