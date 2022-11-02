import Image from "next/image";

export default function ProductImage({ url = "", alt = "" }) {
  return (
    <>
      <div className="flex absolute t-0 w-full h-full leading-[0px] pointer-events-none select-none">
        <Image
          className="h-full w-full 
                 object-none object-center 
                  blur-md transition-all duration-300 ease-linear"
          src={url ? url : "/images/products/product-tr.png"}
          width={900}
          height={900}
          alt={alt}
        />
      </div>
      <Image
        className="h-full w-full object-cover object-center "
        src={url ? url : "/images/products/product-tr.png"}
        width={400}
        height={300}
        alt={alt}
      />
    </>
  );
}
