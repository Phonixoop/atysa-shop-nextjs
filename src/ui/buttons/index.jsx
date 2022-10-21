import React from "react";

export default function Button({
  children,
  className,
  disabled = false,
  onClick = () => {},
  ...rest
}) {
  const activeClass =
    "text-atysa-secondry hover:bg-atysa-secondry hover:text-white";
  return (
    <>
      <style jsx>
        {`
          .btn-shadow {
            box-shadow: rgb(58 61 66 / 6%) 0px 1px 0px,
              rgb(0 0 0 / 20%) 0px 4px 16px -8px;
          }
          .disabled {
            color: rgb(166, 170, 173);
            background-color: rgb(237, 239, 240);
            border-color: rgba(255, 0, 166, 0.06);
          }
        `}
      </style>
      <button
        disabled={disabled}
        onClick={() => onClick()}
        className={`
          ${
            className
              ? className
              : `min-w[6rem]
          md:w-[100px] w-[120px]
          h-9
          border-[0.093rem]
          bg-clip-padding
          text-[0.875rem]
          inline-flex
          justify-center
          items-center
          text-center
          btn-shadow  
         rounded-full px-2 py-[1px] select-none
         transition-all duration-150 ease-out `
          }
        ${disabled ? "disabled" : activeClass} `}
        {...rest}
      >
        {children}
      </button>
    </>
  );
}
