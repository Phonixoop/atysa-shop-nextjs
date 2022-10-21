import React from "react";
import Button from "@/ui/buttons";

export default function CircleButton({ children, className, ...rest }) {
  return (
    <Button
      className={`${
        className ? className : `relative bg-atysa-secondry rounded-full p-2`
      }`}
      {...rest}
    >
      {children}
    </Button>
  );
}
