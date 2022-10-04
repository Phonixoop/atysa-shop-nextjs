import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import List from "ui/list";
import { getPathName } from "utils";
export default function CategorySkeletonList({ categories }) {
  const router = useRouter();
  const pathName = getPathName(router.asPath);

  return (
    <List
      className="flex justify-center gap-2 w-full mx-auto"
      {...{
        list: [...Array(6)],
        renderItem: () => (
          <>
            <CategorySkeletonCard />
          </>
        ),
      }}
    />
  );
}

function CategorySkeletonCard() {
  return (
    <div className="flex  justify-center  items-center gap-2  w-40  h-12 p-3 rounded-xl bg-white text-center ">
      <p className="m-0 medium w-10 h-2 bg-gray-200 font-bold rounded-2xl"></p>
      <div className="w-5 h-5 bg-gray-200 rounded-2xl" />
    </div>
  );
}
