import React from "react";
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
  slug: "all",
  name: "همه",
};

export default function CategoryList({ categories }) {
  const router = useRouter();
  const pathName = getPathName(router.asPath);

  return (
    <nav
      dir="rtl"
      className="flex flex-col w-9/12  flex-nowrap items-start  justify-center overflow-hidden drop-shadow-sm  mx-auto "
    >
      <div className="flex w-screen flex-col justify-center items-start gap-3 ">
        {/* <div className="flex flex-row items-center justify-between w-full ">
          <h3 className="font-bold pr-7 text-atysa-800">دسته بندی</h3>
          <ButtonWithArrow>همه</ButtonWithArrow>
        </div> */}
        <AnimateSharedLayout>
          <div className="flex justify-start items-center overflow-auto snap-x scrollbar-none pr-2 w-fit ">
            <Link href={`/category/me`} shallow={true} passHref>
              <a>
                <CategoryCard
                  category={customCategory}
                  active={pathName === customCategory.slug}
                />
              </a>
            </Link>
            {!categories && (
              <List
                list={[...Array(6)]}
                renderItem={(_, i) => <CategorySkeletonCard key={i} />}
              />
            )}
            <List
              list={categories}
              renderItem={(item, i) => (
                <Link
                  key={i}
                  href={`/category/${item.slug}`}
                  shallow={true}
                  passHref
                >
                  <div>
                    <CategoryCard
                      category={item}
                      active={pathName === item.slug}
                    />
                  </div>
                </Link>
              )}
            />
            <Link href={`/category/all`} shallow={true} passHref>
              <a>
                <CategoryCard
                  category={allCategories}
                  active={pathName === allCategories.slug}
                />
              </a>
            </Link>
          </div>
        </AnimateSharedLayout>
      </div>
    </nav>
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
