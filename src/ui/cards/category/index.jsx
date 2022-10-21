import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CategoryCard({
  extraClass = "",
  category,
  active,
  onClick = () => {},
}) {
  const activeTabClass = `${
    active
      ? "bg-gray-900 text-white bg-atysa-secondry-2  scale-100 "
      : "bg-white hover:scale-100 bg-white scale-90 "
  } `;

  return (
    <Link href={`/category/${category.slug}`} passHref>
      <div
        className={`${activeTabClass} flex flex-row min-w-fit py-1  flex-grow justify-center items-center gap-2  rounded-full text-center transition-all duration-300  select-none cursor-pointer ${extraClass} `}
      >
        <Image
          className="w-20 min-h-[80px] h-[80px] pr-2   object-contain rounded-2xl "
          src={`/icons/categories/${category.slug}.png`}
          width={25}
          height={25}
          alt={category.slug}
        />
        <h4 className="m-0  md:text-base text-[12px] font-bold pl-2">
          {category.name}
        </h4>
      </div>
    </Link>
  );

  // return (
  //   <div
  //     className={`${activeTabClass} flex justify-center  items-center gap-2  w-40 h-12 p-3 rounded-tr-xl rounded-tl-xl text-center transition-all duration-300 hover:scale-100  scale-90  select-none cursor-pointer  `}
  //   >
  //     <p className="m-0 medium font-bold"> {category.name}</p>
  //     <Image
  //       className="w-20 min-h-[80px] h-auto  object-contain rounded-2xl "
  //       src={`http://localhost:8000/uploads/categories/${category.image}`}
  //       width={25}
  //       height={25}
  //     />
  //   </div>
  // );
}
