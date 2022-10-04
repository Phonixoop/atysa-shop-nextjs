import { useRouter } from "next/router";
import React from "react";
import CategoryCard from "ui/cards/category";
import CategorySkeletonCard from "ui/cards/category/skeleton";
import List from "ui/list";
import { getPathName } from "utils";

export default function CategoryList({ categories }) {
  const router = useRouter();
  const pathName = getPathName(router.asPath);

  if (categories === undefined)
    return (
      <List
        className="flex justify-center   gap-2 p-5 w-full mx-auto "
        {...{
          list: [...Array(6)],
          renderItem: () => <CategorySkeletonCard />,
        }}
      />
    );
  return (
    <List
      className="flex justify-center  gap-2 p-5 w-full mx-auto "
      {...{
        list: categories,
        renderItem: (item, i) => (
          <>
            <CategoryCard category={item} active={pathName === item.slug} />
          </>
        ),
      }}
    />
  );
}
