import React from "react";
import Image from "next/image";
import Link from "next/link";
export default function MainLogo({ className, href, ...rest }) {
  return (
    <>
      <div className={`${className} w-16 h-16 object-fill cursor-pointer`}>
        <Link href={href} shallow={true}>
          <Image
            src="/images/logo.png"
            width={450 / 8}
            height={325 / 8}
            quality={100}
            alt="کترینگ آتیسا"
          />
        </Link>
      </div>
    </>
  );
}
