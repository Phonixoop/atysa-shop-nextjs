import { useRouter } from "next/router";
import React from "react";
import CategoryCard from "ui/cards/category";
import CategorySkeletonCard from "ui/cards/category/skeleton";
import List from "ui/list";
import { getPathName } from "utils";

export default function CategoryList({ categories }) {
  const router = useRouter();
  const pathName = getPathName(router.asPath);

  if (categories)
    return (
      <nav
        dir="rtl"
        className="flex flex-nowrap items-center justify-center overflow-x-auto  gap-2 drop-shadow-sm w-full mx-auto bg-white "
      >
        <div className="flex w-10/12">
          <List
            {...{
              list: categories,
              renderItem: (item, i) => (
                <>
                  <CategoryCard
                    category={item}
                    active={pathName === item.slug}
                  />
                </>
              ),
            }}
          />
        </div>
      </nav>
    );

  return (
    <nav className="flex justify-center  gap-2 drop-shadow-sm w-full bg mx-auto bg-white ">
      <List
        {...{
          list: [...Array(6)],
          renderItem: () => <CategorySkeletonCard />,
        }}
      />
    </nav>
  );
}
