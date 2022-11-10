import React from "react";
import Image from "next/image";
import Link from "next/link";
export default function MainLogo({
  className = "cursor-pointer object-fill",
  href = "/",
  ...rest
}) {
  return (
    <>
      <Link href={href} shallow={true}>
        <Image
          className={className}
          src="/images/logo.png"
          width={450 / 8}
          height={325 / 8}
          quality={100}
          alt="کترینگ آتیسا"
        />
      </Link>
    </>
  );
}
