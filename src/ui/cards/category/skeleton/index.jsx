import React from "react";
const withds = [30, 40];
export default function CategorySkeletonCard() {
  const random = Math.floor(Math.random() * withds.length);
  const width = `w-${withds[random]}`;
  return (
    <div
      className={`flex  justify-center items-center gap-2 ${width} h-8 p-3 rounded-xl bg-white text-center `}
    >
      <div className="w-5 h-5 animate-pulse bg-gray-300 rounded-2xl" />
      <p className="m-0 animate-pulse  medium w-10 h-2 bg-gray-300 font-bold rounded-2xl"></p>
    </div>
  );
}
