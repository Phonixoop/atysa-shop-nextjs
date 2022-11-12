import React from "react";
import CartButton from "@/ui/buttons/cartButton";

export default function CircleButton({
  type = "button",
  children,
  className,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`${
        className ? className : `relative bg-atysa-secondry rounded-full p-2`
      }`}
      {...rest}
    >
      {children}
    </button>
  );
}
