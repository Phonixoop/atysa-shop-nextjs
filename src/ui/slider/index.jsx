import { useState } from "react";
import BlurImage from "ui/blur-image";
import ProductImage from "ui/product-image";
export default function Slider({ imageUrls = [] }) {
  const [activeImageUrl, setActiveImageUrl] = useState(imageUrls[0]);
  return (
    <div className="flex md:flex-row flex-col justify-center items-center gap-2 w-full h-full ">
      <div className="relative w-80 h-auto rounded-lg ">
        <ProductImage
          objectFit="contain"
          className="rounded-lg"
          src={activeImageUrl}
        />
      </div>
      <div className="flex flex-wrap justify-between items-center md:flex-col gap-4 w-auto h-full mx-auto ">
        {imageUrls.map((url, i) => {
          return (
            <div
              key={i}
              onClick={() => setActiveImageUrl(url)}
              className={`flex justify-center items-center w-16 h-auto cursor-pointer ring-atysa-main rounded-lg p-[1px] transition-transform ${
                url === activeImageUrl ? "ring-2 scale-95" : ""
              }`}
            >
              <BlurImage className="rounded-lg" objectFit="contain" src={url} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
