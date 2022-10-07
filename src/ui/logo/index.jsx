import React from "react";
import Image from "next/image";
import Link from "next/link";
export default function MainLogo({ className, href, ...rest }) {
  return (
    <>
      <Link href={href}>
        <a className={className}>
          <Image
            className="w-16 h-16 object-fill"
            src="/images/logo.png"
            width={450 / 8}
            height={325 / 8}
            quality={100}
          />
        </a>
      </Link>
    </>
  );
}
