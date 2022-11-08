import Image from "next/image";
import { useState } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function BlurImage({ image, ...rest }) {
  const [isLoading, setLoading] = useState(true);

  return (
    <>
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <Image
          alt=""
          src={image.url}
          layout="fill"
          objectFit="cover"
          className={cn(
            "duration-700 ease-in-out group-hover:opacity-75 rounded-lg",
            isLoading
              ? "scale-110 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          )}
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{image.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">{image.username}</p>
    </>
  );
}
