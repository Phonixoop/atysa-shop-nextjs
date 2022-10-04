import React from "react";

export default function CategorySkeletonCard() {
  return (
    <div className="flex  justify-center  items-center gap-2  w-40  h-12 p-3 rounded-xl bg-white text-center ">
      <p className="m-0 animate-pulse  medium w-10 h-2 bg-gray-300 font-bold rounded-2xl"></p>
      <div className="w-5 h-5 animate-pulse bg-gray-300 rounded-2xl" />
    </div>
  );
}
