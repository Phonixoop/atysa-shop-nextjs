import React from "react";
import Circle from "@/ui/icons/loadings/circle";
export default function Button({
  children,
  canClick = false,
  isLoading = false,
  className = "",
  extraClass = "",
  onClick = () => {},
  ...rest
}) {
  const canClickClass = `${className}  text-white hover:shadow-lg hover:drop-shadow-md cursor-pointer`;
  const busyClass = `bg-gray-200 text-gray-500 cursor-not-allowed`;
  return (
    <button
      dir="rtl"
      disabled={!canClick}
      onClick={() => onClick()}
      className={`
       relative w-full flex justify-start items-center p-2 rounded-lg transition-all duration-400
      ${extraClass}
      ${canClick ? canClickClass : busyClass}`}
      {...rest}
    >
      <span className="flex-grow">{children}</span>
      <Circle
        extraClasses={`
        ${isLoading ? "opacity-100" : "opacity-0"} absolute z-10 `}
      />
    </button>
  );
}
