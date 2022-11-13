import Image from "next/image";
import { useState } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function BlurImage({
  className = "",
  src = "",
  alt = "",
  ...rest
}) {
  const [isLoading, setLoading] = useState(true);

  return (
    <>
      <Image
        alt={alt}
        src={src}
        objectFit="fill"
        className={cn(
          "duration-700 ease-in-out group-hover:opacity-75",
          className,
          isLoading
            ? "scale-110 blur-2xl grayscale"
            : "scale-100 blur-0 grayscale-0"
        )}
        onLoadingComplete={() => setLoading(false)}
        {...rest}
      />
    </>
  );
}
