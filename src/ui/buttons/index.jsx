import React from "react";

export default function Button({
  children,
  className,
  canClick = false,
  onClick = () => {},
  ...rest
}) {
  return (
    <button
      disabled={!canClick}
      onClick={() => onClick()}
      className={`w-full py-2 rounded-xl transition-colors duration-300 ${
        canClick ? "bg-atysa-secondry text-black" : "bg-gray-200 text-gray-500"
      }`}
      {...rest}
    >
      {children}
    </button>
  );
}
