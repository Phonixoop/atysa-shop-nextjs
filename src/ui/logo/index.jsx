import React from "react";
import Image from "next/image";
import Link from "next/link";
export default function MainLogo({ href, ...rest }) {
  return (
    <>
      <Link href={href}>
        <a>
          <Image
            class="w-16 h-16 object-fill"
            src="/images/logo.png"
            width={450 / 8}
            height={325 / 8}
            quality={70}
          />
        </a>
      </Link>
    </>
  );
}
