import { useRef } from "react";
import { useState } from "react";

export default function RadioBox({
  children,
  groupName = "",
  checked = false,
  onChange = () => {},
}) {
  const ref = useRef(undefined);
  return (
    <>
      <input hidden ref={ref} name={groupName} type={"radio"} />
      <div dir="rtl" className="flex justify-center items-center gap-2">
        <label htmlFor=""> {children}</label>
        <div
          onClick={() => onChange(!ref.current.checked)}
          className="relative center flex justify-center items-center w-[20px] h-[20px] p-1 ring-inset ring-1 ring-atysa-secondry rounded-full cursor-pointer"
        >
          {checked && (
            <span
              className={`${
                checked ? "bg-atysa-main" : "bg-white"
              } w-full h-full rounded-full`}
            />
          )}
        </div>
      </div>
    </>
  );
}
