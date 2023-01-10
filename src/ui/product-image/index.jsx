import { useState } from "react";
import Image from "next/image";
import BlurImage from "ui/blur-image";

export default function ProductImage({
  className = "h-full w-full object-center",
  src = "",
  alt = "",
  objectFit = "cover",
  width = 400,
  height = 300,
  blur = false,
  ...rest
}) {
  return (
    <>
      {blur && (
        <div className="flex absolute t-0 w-full h-full leading-[0px] pointer-events-none select-none">
          <Image
            className="h-full w-full 
                 object-none object-center 
                  blur-md "
            src={src ? src : "/images/products/product-tr.png"}
            width={900}
            height={900}
            alt={alt}
          />
        </div>
      )}
      <BlurImage
        {...{
          className,
          src,
          alt,
          objectFit,
          width,
          height,
        }}
        {...rest}
      />
    </>
  );
}
