import React from "react";
import Circle from "@/ui/icons/loadings/circle";
export default function Button({
  children,
  className,
  extraClass = "",
  canClick = false,
  onClick = () => {},
  isLoading = false,
  ...rest
}) {
  return (
    <button
      dir="rtl"
      disabled={!canClick}
      onClick={() => onClick()}
      className={`bg-gray-400 relative w-full flex justify-start items-center p-2  rounded-lg  transition-all duration-400
      ${extraClass}
      ${
        canClick
          ? "bg-atysa-secondry text-white hover:shadow-lg hover:drop-shadow-md cursor-pointer"
          : "bg-gray-200 text-gray-500 cursor-not-allowed"
      }`}
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
