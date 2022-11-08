import React from "react";
import CartButton from "@/ui/buttons/cartButton";

export default function CircleButton({ children, className, ...rest }) {
  return (
    <button
      className={`${
        className ? className : `relative bg-atysa-secondry rounded-full p-2`
      }`}
      {...rest}
    >
      {children}
    </button>
  );
}
