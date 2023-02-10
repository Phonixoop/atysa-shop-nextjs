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
import XIcon from "ui/icons/xicon";
//ui
import SimpleTextField from "ui/forms/text-field/simple";
import DishIcon from "ui/icons/dish";
export default function Overlay({
  children,
  className = "fixed top-0 left-0 z-50 flex h-screen w-screen items-start justify-center bg-gray-600/60  backdrop-blur-md md:backdrop-blur-0",
  isOpen = false,
  onClose = () => {},
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    //  setY(modal.current.y);
  }, []);

  function handleClose() {
    onClose();
  }

  return mounted && isOpen
    ? ReactDOM.createPortal(
        <div className={className} onClick={handleClose}>
          {children}
        </div>,
        document.getElementById("overlay")
      )
    : "";
}

{
  /* <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-atysa-800">
  <g>
    <path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"></path>
  </g>
</svg>; */
}
