import CategorySkeletonList from "features/categoryList/skeleton";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import List from "ui/list";
import { getPathName } from "utils";
export default function CategoryList({ categories }) {
  const router = useRouter();
  const pathName = getPathName(router.asPath);

  if (categories === undefined) return <CategorySkeletonList />;
  return (
    <List
      className="flex justify-center gap-2 w-full mx-auto"
      {...{
        list: categories,
        renderItem: (item, i) => (
          <>
            <CategoryCard category={item} active={pathName === item.name} />
          </>
        ),
      }}
    />
  );
}

function CategoryCard({ category, active }) {
  // if (category?.slug === undefined) return "";
  const activeTabClass = `${active ? "bg-gray-300" : "bg-white "} `;

  if (category.slug) {
    return (
      <Link href={`/category/${category.slug}`}>
        <div
          className={`${activeTabClass} flex justify-center  items-center gap-2  w-40 h-12 p-3 rounded-xl text-center transition-all duration-300 hover:scale-100  scale-90  select-none cursor-pointer  `}
        >
          <p className="m-0 medium font-bold"> {category.name}</p>
          <Image
            className="w-20 min-h-[80px] h-auto  object-contain rounded-2xl "
            src={`http://localhost:8000/uploads/categories/${category.image}`}
            width={25}
            height={25}
          />
        </div>
      </Link>
    );
  }
  return (
    <div
      className={`${activeTabClass} flex justify-center  items-center gap-2  w-40 h-12 p-3 rounded-xl text-center transition-all duration-300 hover:scale-100  scale-90  select-none cursor-pointer  `}
    >
      <p className="m-0 medium font-bold"> {category.name}</p>
      <Image
        className="w-20 min-h-[80px] h-auto  object-contain rounded-2xl "
        src={`http://localhost:8000/uploads/categories/${category.image}`}
        width={25}
        height={25}
      />
    </div>
  );
}
