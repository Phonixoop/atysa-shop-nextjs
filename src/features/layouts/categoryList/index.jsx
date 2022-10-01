import React from "react";

export default function CategoryList({ categories }) {
  return (
    <List
      className="flex flex-row flex-wrap justify-center gap-4 w-9/12 mx-auto "
      {...{
        list: categories,
        renderItem: (item) => <CategoryCard category={item} />,
      }}
    />
  );
}

function CategoryCard({ category }) {
  return (
    <div className=" w-40 transition-all duration-300 hover:scale-100  scale-90 min-h-[160px] select-none cursor-pointer  flex flex-col justify-center  items-center gap-3 h-full p-5 rounded-xl bg-white text-center">
      <Image
        className="w-20 min-h-[80px] h-auto rounded-2xl "
        src={"/icons/categories/box.png"}
        width={80}
        height={80}
      />
      <p className="m-0 medium font-bold">پک رژیمی</p>
    </div>
  );
}
