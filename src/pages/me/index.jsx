import React from "react";
import MainLayout from "layouts/mainLayout";
import { motion } from "framer-motion";
import { useState } from "react";
export default function MePage() {
  return (
    <div
      dir="rtl"
      className="flex mobileMin:flex-row flex-col gap-10 justify-center items-start w-8/12 mx-auto py-10"
    >
      <div className="flex flex-col w-[220px] py-2 bg-white place-center rounded-2xl shadow-light">
        <span className="w-full text-right text-xs p-2">پروفایل</span>
        <FantasyMenu />
      </div>
      <div className="flex-1 flex flex-col place-center rounded-2xl h-auto bg-white shadow-light">
        <p> content</p>
        <p> content</p>
        <p> content</p>
        <p> content</p>
        <p> content</p>
        <p> content</p>
        <p> content</p>
      </div>
    </div>
  );
}
const menu = [
  { id: 0, name: "مشخصات کاربری", positionY: "-translate-y-5" },
  { id: 1, name: "سفارش ها", positionY: "translate-y-5" },
];
function FantasyMenu() {
  const [active, setActive] = useState(menu[0]);
  return (
    <ul className="relative flex flex-col place-center gap-1 w-52 text-center bg-[#F3F3F4] rounded-lg p-1">
      <span
        className={`absolute follower bg-white w-[12.5rem]  rounded-lg h-10 p-1 left-1/2 -translate-x-1/2  z-0 transition-transform ${active.positionY}`}
      ></span>
      {menu.map((item) => {
        return (
          <li
            onClick={(e) => {
              setActive(item);
            }}
            className={`w-full  py-2 rounded-lg cursor-pointer z-10 hover:bg-[#ffffff8a] ${
              active.id === item.id ? "text-atysa-secondry" : "text-atysa-800 "
            } transition-colors`}
          >
            {item.name}
          </li>
        );
      })}
    </ul>
  );
}

MePage.PageLayout = MainLayout;
