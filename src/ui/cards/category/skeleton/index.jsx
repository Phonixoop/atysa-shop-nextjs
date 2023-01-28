import React from "react";
const withds = [30, 40];
export default function CategorySkeletonCard({ animationDelay = 0 }) {
  const random = Math.floor(Math.random() * withds.length);
  const width = `w-${withds[random]}`;
  return (
    <div
      className={`flex  animate-pulse justify-center items-center gap-2 w-[135px] p-3 h-8  rounded-xl bg-white text-center `}
      style={{ animationDelay: `${animationDelay}s !important;` }}
    >
      <div className="w-5 h-5 bg-gray-300 rounded-2xl" />
      <p className="m-0   medium w-10 h-2 bg-gray-300 font-bold rounded-2xl"></p>
    </div>
  );
}
