import React from "react";
import CartButton from "@/ui/buttons/cartButton";

export default function CircleButton({ children, className, ...rest }) {
  return (
    <CartButton
      className={`${
        className ? className : `relative bg-atysa-secondry rounded-full p-2`
      }`}
      {...rest}
    >
      {children}
    </CartButton>
  );
}
