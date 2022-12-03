import ReactDOM from "react-dom";
import { useSession } from "next-auth/react";
import { useBasket } from "context/basketContext";
import { useEffect, useState } from "react";
import Link from "next/link";
//icons

import UserIcon from "ui/icons/users";
import OrdersIcon from "ui/icons/orders";
import BasketIcon from "ui/icons/basket";
import SearchIcon from "ui/icons/searchs";
export default function UserNav() {
  const [mounted, setMounted] = useState(false);
  const { data, status } = useSession();

  const user = data?.user;
  const authenticated = status === "authenticated";
  const isLoading = status === "loading";
  const { basketQuantity } = useBasket();
  useEffect(() => {
    setMounted(true);
    //  setY(modal.current.y);
  }, []);

  return mounted
    ? ReactDOM.createPortal(
        <>
          <div
            dir="rtl"
            className="flex justify-center items-center  h-16 w-full px-2"
          >
            <div className="w-full h-full flex justify-center items-center bg-white/80 backdrop-blur-sm rounded-lg shadow-gray-200 shadow-lg px-5">
              <div className="w-fit justify-start gap-10 flex">
                <LinkIcon href="/">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    class="w-6 h-6 fill-atysa-800"
                  >
                    <g>
                      <path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"></path>
                    </g>
                  </svg>
                </LinkIcon>
                <LinkIcon href="/">
                  <SearchIcon className="w-5 h-5 fill-atysa-800" />
                </LinkIcon>
              </div>
              <div className="w-full h-full flex justify-center items-center">
                <span className="w-[0.5px] h-[15px]  border-atysa-800/75 border-r-[0.8px] border-dotted"></span>
              </div>
              <div className="w-full h-full flex gap-10 justify-end items-center">
                <LinkIcon href="/me/orders">
                  <OrdersIcon />
                </LinkIcon>
                <LinkIcon href="/me/basket">
                  <div className="relative">
                    <BasketIcon />
                    <div
                      style={{
                        top: "-10px",
                        right: "-10px",
                      }}
                      className="absolute inline-flex justify-center items-center  text-xs font-bold text-atysa-900 rounded-full"
                    >
                      {basketQuantity || ""}
                    </div>
                  </div>
                </LinkIcon>
                <LinkIcon href="/me">
                  <UserIcon />
                </LinkIcon>
              </div>
            </div>
          </div>
        </>,
        document.getElementById("user-nav")
      )
    : "";
}

function LinkIcon({ children, href = "" }) {
  return (
    <>
      <Link href={href}>
        <a>{children}</a>
      </Link>
    </>
  );
}
