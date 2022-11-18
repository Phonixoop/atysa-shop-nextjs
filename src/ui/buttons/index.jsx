import React from "react";
import Circle from "@/ui/icons/loadings/circle";
import { motion } from "framer-motion";
export default function Button({
  children,
  type = "button",
  disabled = false,
  isLoading = false,
  className = "",
  extraClass = "",
  onClick = () => {},
  ...rest
}) {
  const enabldedClass = `${className}  text-white hover:shadow-lg hover:drop-shadow-md cursor-pointer`;
  const busyClass = `bg-gray-200 text-gray-500 cursor-not-allowed`;
  return (
    <motion.button
      whileTap={{
        scale: disabled || isLoading ? 1 : 0.95,
        transition: {
          duration: 0,
        },
      }}
      dir="rtl"
      type={type}
      onClick={() => onClick()}
      className={`
       relative w-full flex justify-start items-center p-2 rounded-lg transition-all duration-400 select-none
      ${extraClass}
      ${!disabled ? enabldedClass : busyClass}`}
      {...rest}
    >
      <span className="flex-grow">{children}</span>
      {isLoading && (
        <Circle
          extraClasses={`
        absolute z-10 `}
        />
      )}
    </motion.button>
  );
}
