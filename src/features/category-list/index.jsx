import React, { Fragment } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import CategoryCard from "@/ui/cards/category";
import CategorySkeletonCard from "@/ui/cards/category/skeleton";
import List from "@/ui/list";
import { getPathName } from "@/utils";
import ChevronLeftIcon from "@/ui/icons/chervons/chevron-left";
import { AnimateSharedLayout, motion } from "framer-motion";

const customCategory = {
  slug: "custom-dish",
  name: "بشقاب سفارشی من",
};

const allCategories = {
  slug: "",
  name: "همه",
};

export default function CategoryList({ categories }) {
  const router = useRouter();
  const pathName = getPathName(router.asPath);

  return (
    <AnimateSharedLayout>
      {!categories ? (
        <div className="relative flex gap-2 justify-between items-center  overflow-auto snap-x  mobileMin:scrollbar-none scrollbar-thin px-4 ">
          <List
            list={[...Array(6)]}
            renderItem={(_, i) => <CategorySkeletonCard key={i} />}
          />
        </div>
      ) : (
        <>
          <div className="relative flex  justify-between items-center  overflow-auto snap-x  mobileMin:scrollbar-none scrollbar-thin px-4 ">
            <div className="absolute bottom-[2px] rounded-full w-[95%] md:border-b-2" />
            <Link href={`/category/me`} shallow={true} passHref>
              <a className="min-w-fit">
                <CategoryCard
                  category={customCategory}
                  active={pathName === customCategory.slug}
                />
              </a>
            </Link>

            <List
              list={categories}
              renderItem={(item, i) => (
                <Link
                  key={i}
                  href={`/category/${item.slug}`}
                  shallow={true}
                  passHref
                >
                  <div className="min-w-fit">
                    <CategoryCard
                      category={item}
                      active={pathName === item.slug}
                    />
                  </div>
                </Link>
              )}
            />
            <Link href={`/`} shallow={true} passHref>
              <a className="min-w-fit">
                <CategoryCard
                  category={allCategories}
                  active={pathName === allCategories.slug}
                />
              </a>
            </Link>
          </div>
        </>
      )}
    </AnimateSharedLayout>
  );
}

export function ButtonWithArrow({ children }) {
  return (
    <div className="flex items-center gap-1 justify-center text-atysa-900 hover:opacity-75 pl-4 group cursor-pointer select-none transition-colors duration-300">
      <span> {children} </span>
      <ChevronLeftIcon className="w-3  h-3 fill-current group-hover:-translate-x-[2px] transition-transform duration-300" />
    </div>
  );
}

export function SkeletonCategoryList() {
  return (
    <nav
      dir="rtl"
      className="flex flex-col w-full flex-nowrap items-center justify-center overflow-hidden py-3 drop-shadow-sm  mx-auto "
    >
      <div className="flex flex-col gap-3 ">
        <div className="flex flex-row items-center justify-between ">
          <h3 className="font-bold flex-grow pr-6"></h3>
        </div>
        <div className="flex overflow-hidden overflow-x-auto snap-x scrollbar-none gap-2 pr-4">
          <List
            list={[...Array(6)]}
            renderItem={(_, i) => <CategorySkeletonCard key={i} />}
          />
        </div>
      </div>
    </nav>
  );
}

// <div className="relative flex flex-col justify-center items-start gap-3 overflow-visible before:absolute before:bottom-[2px] before:rounded-full before:w-full  before:border-b-2 w-full ">
{
  /* <div className="flex flex-row items-center justify-between w-full ">
        <h3 className="font-bold pr-7 text-atysa-800">دسته بندی</h3>
        <ButtonWithArrow>همه</ButtonWithArrow>
      </div> */
}
