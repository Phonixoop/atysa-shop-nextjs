import React from "react";
//import Circle  from "ui/icons/loadings/circle";
import ThreeDotsWave from "ui/loadings/three-dots-wave";
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
  const enabldedClass = `${className}   hover:bg-opacity-95 cursor-pointer`;
  const busyClass = `bg-gray-200 text-gray-500 cursor-not-allowed`;
  return (
    <motion.button
      whileTap={{
        scale: disabled || isLoading ? 1 : 0.95,
        transition: {
          duration: 0,
        },
      }}
      disabled={disabled}
      dir="rtl"
      type={type}
      onClick={() => onClick()}
      className={`
       relative flex w-full justify-center items-center p-2 rounded-lg transition-all duration-400 select-none
      ${extraClass}
      ${!disabled ? enabldedClass : busyClass}`}
      {...rest}
    >
      {children}
      <div
        dir="rtl"
        className="absolute w-fit top-7  h-fit flex justify-start items-center"
      >
        {isLoading && <ThreeDotsWave />}
      </div>
    </motion.button>
  );
}
