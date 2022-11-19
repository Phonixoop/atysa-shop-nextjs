import Image from "next/image";
import { useState } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function BlurImage({
  className = "",
  src = "",
  alt = "",
  width = 300,
  height = 300,
  objectFit = "fill",
  ...rest
}) {
  const [isLoading, setLoading] = useState(true);

  return (
    <>
      <Image
        {...{
          src,
          alt,
          width,
          height,
          objectFit,
        }}
        className={cn(
          "duration-700 ease-in-out group-hover:opacity-75",
          className
        )}
        onLoadingComplete={() => setLoading(false)}
        {...rest}
      />
    </>
  );
}

/* isLoading
            ? "scale-110 blur-2xl grayscale"
            : "scale-100 blur-0 grayscale-0"
            */
