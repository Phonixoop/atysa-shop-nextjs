import { useRouter } from "next/router";
import React from "react";
import CategoryCard from "@/ui/cards/category";
import CategorySkeletonCard from "@/ui/cards/category/skeleton";
import List from "@/ui/list";
import { getPathName } from "@/utils";
import ChevronLeftIcon from "@/ui/icons/chervons/chevronLeftIcon";
export default function CategoryList({ categories }) {
  const router = useRouter();
  const pathName = getPathName(router.asPath);

  if (!categories) return <SkeletonCategoryList />;

  return (
    <nav
      dir="rtl"
      className="flex flex-col w-full flex-nowrap items-center justify-center overflow-hidden py-3 drop-shadow-sm  mx-auto "
    >
      <div className="flex flex-col gap-3 ">
        <div className="flex flex-row items-center justify-between ">
          <h3 className="font-bold flex-grow pr-6"> دسته بندی</h3>
          <ButtonWithArrow />
        </div>
        <div className="flex overflow-hidden overflow-x-auto snap-x scrollbar-none gap-2 pr-4">
          <List
            list={categories}
            renderItem={(item, i) => (
              <CategoryCard
                extraClass=""
                key={i}
                category={item}
                active={pathName === item.slug}
              />
            )}
          />
        </div>
      </div>
    </nav>
  );
}

export function ButtonWithArrow() {
  return (
    <div className="flex items-center gap-1 justify-center text-atysa-secondry hover:opacity-75 pl-2 group cursor-pointer select-none transition-colors duration-300">
      <span> همه </span>
      <ChevronLeftIcon className="w-3  h-3 fill-current group-hover:-translate-x-[2px] transition-transform duration-300" />
    </div>
  );
}

export function SkeletonCategoryList() {
  return (
    <nav
      dir="rtl"
      className="flex flex-col w-full flex-nowrap items-center justify-center overflow-hidden   py-3 drop-shadow-sm  mx-auto "
    >
      <div className="flex flex-col gap-3 p-5">
        <h3 className="font-bold pr-2"> دسته بندی</h3>
        <div className="flex gap-3 overflow-hidden overflow-x-auto scrollbar-none">
          <List
            list={[...Array(6)]}
            renderItem={(_, i) => <CategorySkeletonCard key={i} />}
          />
        </div>
      </div>
    </nav>
  );
}
