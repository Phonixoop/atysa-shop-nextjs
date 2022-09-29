import React from "react";

export default function TextField({
  value,
  label,
  isRtl = true,
  onChange = () => {},
  ...rest
}) {
  const direction = `${isRtl ? "text-right" : "text-left"}`;
  return (
    <div className="relative select-none">
      <input
        type="text"
        id="floating_filled"
        className={`${direction} block rounded-lg px-2.5 py-5 w-full text-sm text-gray-900 bg-gray-100 dark:bg-gray-700 border-0 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer `}
        placeholder=" "
      />
      <label
        for="floating_filled"
        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300   
          top-[35%]
         transform
        scale-75 z-10 origin-top-right right-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>
    </div>
  );
}
