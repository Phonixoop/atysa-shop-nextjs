import { useContext, useEffect, useRef, forwardRef } from "react";
import { useAuth } from "features/auth";
import OrdersIcon from "ui/icons/orders";
import UserIcon from "ui/icons/users";

export function UserAreaMenu({ show = false, onFocusChanged = () => {} }, ref) {
  const { user, logout } = useAuth();
  const _ref = useRef(undefined);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        _ref.current &&
        !_ref.current.contains(event.target) &&
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        onFocusChanged();
        console.log("clicked outside");
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onFocusChanged]);

  return (
    <div
      ref={_ref}
      className={`${
        show ? "flex opacity-100 " : "invisible opacity-0"
      } flex-col  absolute -left-36 top-12 py-2 w-56  bg-white shadow-xl shadow-[#fffddd37] z-10 rounded-br-2xl rounded-bl-2xl transition-all `}
    >
      <div className="flex gap-3 justify-end items-center w-full rounded-md py-3 px-4 shadow-md  cursor-pointer">
        <div className="flex items-end justify-center flex-col gap-1 ">
          <span className="text-[0.8rem] text-black font-medium">
            {user?.name
              ? user?.name
              : user?.phonenumber
              ? user?.phonenumber
              : ""}
          </span>
          <span className="text-green-500 text-[10px] font-medium">
            مشاهده حساب کاربری
          </span>
        </div>
        <UserIcon className="h-4 w-4  text-black" />
      </div>
      <div className="flex gap-3 justify-end items-center w-full rounded-md hover:bg-[#F3F3F4]  py-3 px-4 cursor-pointer">
        <span className="text-[#3A3D42]">ساخت بشقاب شخصی</span>
        <OrdersIcon className="h-4 w-4 text-black" />
      </div>
      <div className="flex gap-3 justify-end items-center w-full rounded-md hover:bg-[#F3F3F4]  py-3 px-4 cursor-pointer">
        <span className="text-[#3A3D42]" onClick={() => logout()}>
          خروج
        </span>
        --|
      </div>
    </div>
  );
}

export default forwardRef(UserAreaMenu);
